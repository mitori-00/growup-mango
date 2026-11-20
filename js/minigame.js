window.MangoGame = window.MangoGame || {};

(function (ns) {
    class CatchMinigame {
        constructor(options) {
            this.screenEl = options.screenEl;
            this.mangoEl = options.mangoEl;
            this.scoreEl = options.scoreEl;
            this.timeEl = options.timeEl;
            this.heartsEl = options.heartsEl;
            this.comboEl = options.comboEl;
            this.guideEl = options.guideEl;
            this.resultEl = options.resultEl;
            this.resultTitleEl = options.resultTitleEl;
            this.resultDetailsEl = options.resultDetailsEl;
            this.onStatGain = options.onStatGain;
            this.onComplete = options.onComplete;

            this.running = false;
            this.paused = false;
            this.score = 0;
            this.bonusCoins = 0;
            this.timeLeft = ns.MINIGAME_CONFIG.durationSeconds;
            this.hearts = ns.MINIGAME_CONFIG.maxHearts;
            this.combo = 0;
            this.invincibleUntil = 0;

            this.playerX = 110;
            this.moveLeft = false;
            this.moveRight = false;
            this.items = [];
            this.loopId = null;
            this.spawnTimer = 0;
        }

        reset() {
            this.stopLoop();
            this.running = false;
            this.paused = false;
            this.score = 0;
            this.bonusCoins = 0;
            this.timeLeft = ns.MINIGAME_CONFIG.durationSeconds;
            this.hearts = ns.MINIGAME_CONFIG.maxHearts;
            this.combo = 0;
            this.invincibleUntil = 0;
            this.spawnTimer = 0;

            this.screenEl.classList.remove('fever');
            this.mangoEl.classList.remove('invincible');
            this.resultEl.style.display = 'none';
            this.playerX = Math.max(8, (this.screenEl.clientWidth - 52) / 2);
            this.mangoEl.style.left = `${this.playerX}px`;

            this.guideEl.innerHTML = 'CATCH BALLS!<br>60s / ❤️❤️❤️<br><br>PRESS [PLAY/STOP]<br>TO START';
            this.guideEl.style.display = 'block';
            this.renderHud();
        }

        toggle() {
            if (this.resultEl.style.display === 'flex') return;
            if (this.running) {
                this.pause();
            } else {
                this.start();
            }
        }

        pause() {
            this.running = false;
            this.paused = true;
            if (this.loopId) cancelAnimationFrame(this.loopId);
            this.loopId = null;
            this.guideEl.innerHTML = `PAUSED<br>SCORE: ${this.score}<br>TIME: ${Math.ceil(this.timeLeft)}s<br><br>PRESS [PLAY/STOP]`;
            this.guideEl.style.display = 'block';
        }

        start() {
            if (!this.paused) {
                this.clearItems();
            }
            this.running = true;
            this.paused = false;
            this.guideEl.style.display = 'none';
            this.resultEl.style.display = 'none';

            let lastTime = performance.now();
            const tick = (now) => {
                if (!this.running) return;
                const dt = Math.min(0.05, (now - lastTime) / 1000);
                lastTime = now;
                this.update(dt, now);
                if (this.running) {
                    this.loopId = requestAnimationFrame(tick);
                }
            };
            this.loopId = requestAnimationFrame(tick);
        }

        stopLoop() {
            this.running = false;
            this.paused = false;
            if (this.loopId) cancelAnimationFrame(this.loopId);
            this.loopId = null;
            this.clearItems();
            this.screenEl.classList.remove('fever');
            this.mangoEl.classList.remove('invincible');
        }

        clearItems() {
            this.items.forEach((it) => it.el.remove());
            this.items = [];
        }

        getPhase() {
            const elapsed = ns.MINIGAME_CONFIG.durationSeconds - this.timeLeft;
            if (elapsed >= 40) {
                return { name: 'FEVER', spawnInterval: 0.5, speedMult: 1.35, scoreMult: 1.5, isFever: true };
            }
            if (elapsed >= 20) {
                return { name: 'FAST', spawnInterval: 0.65, speedMult: 1.2, scoreMult: 1.0, isFever: false };
            }
            return { name: 'NORMAL', spawnInterval: 0.85, speedMult: 1.0, scoreMult: 1.0, isFever: false };
        }

        getComboMultiplier() {
            if (this.combo >= 15) return 2.0;
            if (this.combo >= 10) return 1.5;
            if (this.combo >= 5) return 1.2;
            return 1.0;
        }

        update(dt, now) {
            this.timeLeft = Math.max(0, this.timeLeft - dt);
            if (this.timeLeft <= 0) {
                this.finish('TIME UP!');
                return;
            }

            const phase = this.getPhase();
            this.screenEl.classList.toggle('fever', phase.isFever);

            if (now >= this.invincibleUntil) {
                this.mangoEl.classList.remove('invincible');
            }

            // 플레이어 이동
            const maxX = Math.max(8, this.screenEl.clientWidth - 54);
            const speed = 235;
            if (this.moveLeft) {
                this.playerX = Math.max(4, this.playerX - speed * dt);
                this.mangoEl.style.transform = 'scaleX(-1)';
            }
            if (this.moveRight) {
                this.playerX = Math.min(maxX, this.playerX + speed * dt);
                this.mangoEl.style.transform = 'scaleX(1)';
            }
            this.mangoEl.style.left = `${this.playerX}px`;

            // 아이템 스폰
            this.spawnTimer += dt;
            if (this.spawnTimer >= phase.spawnInterval) {
                this.spawnTimer = 0;
                this.spawnItem(phase);
            }

            // 충돌 및 낙하 업데이트
            const catchTop = this.screenEl.clientHeight - 76;
            const catchBottom = this.screenEl.clientHeight - 24;

            for (let i = this.items.length - 1; i >= 0; i--) {
                const it = this.items[i];
                it.y += it.speed * dt;
                it.el.style.top = `${it.y}px`;

                const hitY = it.y + 16 >= catchTop && it.y <= catchBottom;
                const hitX = it.x + 16 >= this.playerX && it.x <= this.playerX + 46;

                if (hitY && hitX) {
                    this.handleCatch(it, phase, now);
                    it.el.remove();
                    this.items.splice(i, 1);
                    if (!this.running) return;
                    continue;
                }

                if (it.y > this.screenEl.clientHeight - 22) {
                    it.el.remove();
                    this.items.splice(i, 1);
                }
            }

            this.renderHud(phase);
        }

        spawnItem(phase) {
            const rand = Math.random();
            let type = 'ball';
            let emoji = '🎾';
            let baseSpeed = 135 + Math.min(90, this.score * 0.2);

            if (phase.isFever && rand < 0.14) {
                type = 'gold';
                emoji = '🪙';
                baseSpeed += 25;
            } else if (!phase.isFever && rand < 0.04) {
                type = 'gold';
                emoji = '🪙';
                baseSpeed += 25;
            } else if (rand < 0.24) {
                type = 'bomb';
                emoji = '💣';
                baseSpeed += 20;
            } else if (rand < 0.44) {
                type = 'bone';
                emoji = '🦴';
                baseSpeed += 10;
            }

            const el = document.createElement('div');
            el.className = 'falling-item';
            el.textContent = emoji;
            const x = 10 + Math.random() * Math.max(20, this.screenEl.clientWidth - 36);
            el.style.left = `${x}px`;
            el.style.top = '34px';
            this.screenEl.appendChild(el);

            this.items.push({ el, x, y: 34, speed: baseSpeed * phase.speedMult, type });
        }

        handleCatch(it, phase, now) {
            if (it.type === 'bomb') {
                if (now < this.invincibleUntil) return;
                this.score = Math.max(0, this.score - 20);
                this.hearts = Math.max(0, this.hearts - 1);
                this.combo = 0;
                this.invincibleUntil = now + ns.MINIGAME_CONFIG.invincibleMs;
                this.mangoEl.classList.add('invincible');
                if (ns.Sound) ns.Sound.playBomb();
                this.spawnFloatText('-20 ❤️-1', it.x, it.y, 'bad');
                if (this.hearts <= 0) {
                    this.finish('GAME OVER');
                }
                return;
            }

            this.combo += 1;
            const mult = phase.scoreMult * this.getComboMultiplier();

            if (it.type === 'gold') {
                const pts = Math.round(30 * mult);
                this.score += pts;
                this.bonusCoins += 5;
                if (ns.Sound) ns.Sound.playCatchGold();
                this.spawnFloatText(`+${pts} 🪙+5`, it.x, it.y, 'gold');
            } else if (it.type === 'bone') {
                const pts = Math.round(25 * mult);
                this.score += pts;
                this.onStatGain({ happy: 3, exp: 10 });
                if (ns.Sound) ns.Sound.playCatchBone();
                this.spawnFloatText(`+${pts}`, it.x, it.y, 'gold');
            } else {
                const pts = Math.round(10 * mult);
                this.score += pts;
                this.onStatGain({ happy: 1, exp: 4 });
                if (ns.Sound) ns.Sound.playCatchBall();
                this.spawnFloatText(`+${pts}`, it.x, it.y, '');
            }
        }

        spawnFloatText(text, x, y, styleClass) {
            const el = document.createElement('div');
            el.className = `float-text ${styleClass || ''}`.trim();
            el.textContent = text;
            el.style.left = `${Math.max(8, Math.min(this.screenEl.clientWidth - 76, x))}px`;
            el.style.top = `${Math.max(40, y - 10)}px`;
            this.screenEl.appendChild(el);
            setTimeout(() => el.remove(), 650);
        }

        renderHud(phase) {
            const currentPhase = phase || this.getPhase();
            this.scoreEl.textContent = `SCORE ${String(this.score).padStart(4, '0')}`;
            this.timeEl.textContent = `${Math.ceil(this.timeLeft)}s`;
            this.heartsEl.textContent = '❤️'.repeat(this.hearts) + '🖤'.repeat(ns.MINIGAME_CONFIG.maxHearts - this.hearts);

            const parts = [];
            if (currentPhase.isFever) parts.push('🔥FEVER x1.5');
            if (this.combo >= 5) parts.push(`${this.combo} COMBO x${this.getComboMultiplier()}`);
            this.comboEl.textContent = parts.join(' ');
        }

        finish(reasonTitle) {
            this.stopLoop();
            const survivedAll = this.timeLeft <= 0 && this.hearts > 0;
            if (ns.Sound) {
                if (survivedAll) ns.Sound.playGameClear();
                else ns.Sound.playGameOver();
            }
            const perfectClear = survivedAll && this.hearts === ns.MINIGAME_CONFIG.maxHearts;
            const baseCoins = Math.floor(this.score / 10);
            const clearBonus = perfectClear
                ? ns.MINIGAME_CONFIG.perfectBonusCoins
                : (survivedAll ? ns.MINIGAME_CONFIG.survivalBonusCoins : 0);

            const summary = this.onComplete({
                score: this.score,
                baseCoins,
                clearBonus,
                goldCoins: this.bonusCoins,
                survivedAll,
                perfectClear
            });

            this.resultTitleEl.textContent = reasonTitle;
            const badgeHtml = summary.isNewRecord ? '<div class="result-badge">🏆 NEW RECORD!</div>' : '';
            this.resultDetailsEl.innerHTML = `
                ${badgeHtml}
                <div class="result-row"><span>최종 점수</span><span>${summary.score} pts</span></div>
                <div class="result-row"><span>기본 보상</span><span>+${summary.baseCoins} 🪙</span></div>
                <div class="result-row"><span>황금 코인</span><span>+${summary.goldCoins} 🪙</span></div>
                <div class="result-row"><span>완주 보너스</span><span>+${summary.clearBonus} 🪙</span></div>
                <div class="result-row"><span>신기록 보너스</span><span>+${summary.recordBonus} 🪙</span></div>
                <div class="result-row highlight"><span>총 획득 코인</span><span>+${summary.totalCoins} 🪙</span></div>
            `;
            this.resultEl.style.display = 'flex';
        }
    }

    ns.CatchMinigame = CatchMinigame;
})(window.MangoGame);
