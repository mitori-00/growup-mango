window.MangoGame = window.MangoGame || {};

(function (ns) {
    let state = ns.StorageService.loadState();
    let isHome = true;
    let activeShopTab = 'snack';

    // DOM 요소
    const homeScreen = document.getElementById('home-screen');
    const gameScreen = document.getElementById('game-screen');
    const themeDecor = document.getElementById('theme-decor');
    const homeBtns = document.getElementById('home-buttons');
    const gameBtns = document.getElementById('game-buttons');

    const levelDisplay = document.getElementById('level-display');
    const coinDisplay = document.getElementById('coin-display');
    const shopCoinDisplay = document.getElementById('shop-coin-display');
    const homeBestScore = document.getElementById('home-best-score');
    const homeFormName = document.getElementById('home-form-name');
    const hungerBar = document.getElementById('hunger-bar');
    const happyBar = document.getElementById('happy-bar');
    const fatigueBar = document.getElementById('fatigue-bar');
    const statusBubble = document.getElementById('status-bubble');
    const zzzIcon = document.getElementById('zzz-icon');

    const homeMango = document.getElementById('home-mango');
    const homeMangoSvg = document.getElementById('home-mango-svg');
    const gameMangoSvg = document.getElementById('game-mango-svg');

    const foodModal = document.getElementById('food-modal');
    const foodList = document.getElementById('food-list');
    const shopModal = document.getElementById('shop-modal');
    const shopList = document.getElementById('shop-list');
    const dexModal = document.getElementById('dex-modal');
    const dexList = document.getElementById('dex-list');
    const dexCountDisplay = document.getElementById('dex-count-display');
    const dexCareSummary = document.getElementById('dex-care-summary');
    const dexFooter = document.getElementById('dex-footer');
    const rankModal = document.getElementById('rank-modal');
    const rankList = document.getElementById('rank-list');
    const syncBadge = document.getElementById('sync-badge');
    const nicknameInput = document.getElementById('nickname-input');

    function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }

    function save(immediate = false) {
        if (immediate) {
            ns.StorageService.saveStateImmediate(state);
        } else {
            ns.StorageService.saveState(state);
        }
    }

    function showBubble(text) {
        statusBubble.textContent = text;
        statusBubble.style.display = 'block';
        clearTimeout(statusBubble._timer);
        statusBubble._timer = setTimeout(() => {
            statusBubble.style.display = 'none';
        }, 1450);
    }

    function unlockDexForm(formId) {
        if (!state.unlockedDex.includes(formId)) {
            state.unlockedDex.push(formId);
        }
    }

    function determineAdultForm() {
        const { feed, play, sleep } = state.careStats;
        const maxVal = Math.max(feed, play, sleep);
        const minVal = Math.min(feed, play, sleep);

        if (maxVal - minVal <= 2 && feed + play + sleep >= 3) {
            return 'adult_balanced';
        }
        if (feed >= play && feed >= sleep) return 'adult_foodie';
        if (play >= feed && play >= sleep) return 'adult_sporty';
        return 'adult_sleepy';
    }

    function getCurrentFormId() {
        if (state.level >= 11) {
            if (!state.adultForm) {
                state.adultForm = determineAdultForm();
                unlockDexForm(state.adultForm);
            }
            return state.adultForm;
        }
        if (state.level >= 6) {
            unlockDexForm('teen');
            return 'teen';
        }
        unlockDexForm('baby');
        return 'baby';
    }

    function getFormMeta(formId) {
        return ns.EVOLUTION_FORMS.find((f) => f.id === formId) || ns.EVOLUTION_FORMS[0];
    }

    function recordCare(type, amount = 1) {
        if (!state.careStats) state.careStats = { feed: 0, play: 0, sleep: 0 };
        state.careStats[type] = (state.careStats[type] || 0) + amount;
    }

    function addExp(amount) {
        const prevLevel = state.level;
        state.exp += amount;
        let leveledUp = false;
        while (state.exp >= 100) {
            state.exp -= 100;
            state.level += 1;
            leveledUp = true;
        }
        if (!leveledUp) return;

        let evolvedForm = null;
        if (prevLevel < 6 && state.level >= 6) {
            unlockDexForm('teen');
            evolvedForm = getFormMeta('teen');
        }
        if (prevLevel < 11 && state.level >= 11) {
            state.adultForm = determineAdultForm();
            unlockDexForm(state.adultForm);
            evolvedForm = getFormMeta(state.adultForm);
        }

        if (evolvedForm) {
            showBubble(`진화! ${evolvedForm.name}`);
            if (ns.Sound) ns.Sound.playEvolution();
            save(true);
        } else {
            showBubble('LEVEL UP!');
            if (ns.Sound) ns.Sound.playLevelUp();
        }
    }

    function applyTheme() {
        const themeClasses = ['theme-default', 'theme-sakura', 'theme-beach', 'theme-camping'];
        [homeScreen, gameScreen].forEach((el) => {
            el.classList.remove(...themeClasses);
            el.classList.add(state.equippedTheme || 'theme-default');
        });

        themeDecor.innerHTML = '';
        if (state.equippedTheme === 'theme-sakura') {
            ['🌸', '🌸', '💮'].forEach((icon, i) => {
                const span = document.createElement('span');
                span.className = 'decor-dot';
                span.textContent = icon;
                span.style.top = `${110 + i * 48}px`;
                span.style.left = `${22 + i * 95}px`;
                themeDecor.appendChild(span);
            });
        } else if (state.equippedTheme === 'theme-beach') {
            const sun = document.createElement('span');
            sun.className = 'decor-dot';
            sun.textContent = '☀️';
            sun.style.top = '106px';
            sun.style.right = '18px';
            themeDecor.appendChild(sun);
        } else if (state.equippedTheme === 'theme-camping') {
            ['✨', '⭐', '✨'].forEach((icon, i) => {
                const span = document.createElement('span');
                span.className = 'decor-dot';
                span.textContent = icon;
                span.style.top = `${102 + i * 32}px`;
                span.style.left = `${28 + i * 98}px`;
                themeDecor.appendChild(span);
            });
            const fire = document.createElement('span');
            fire.className = 'decor-dot';
            fire.textContent = '🔥';
            fire.style.bottom = '24px';
            fire.style.right = '16px';
            themeDecor.appendChild(fire);
        }
    }

    function applyEvolutionVisual(formId) {
        const formClasses = ['form-adult_foodie', 'form-adult_sporty', 'form-adult_sleepy', 'form-adult_balanced'];
        [homeMangoSvg, gameMangoSvg].forEach((svg) => {
            svg.classList.remove(...formClasses);
            if (formId.startsWith('adult_')) {
                svg.classList.add(`form-${formId}`);
            }
        });

        document.querySelectorAll('.evo-layer').forEach((layer) => {
            layer.style.display = 'none';
        });
        if (formId.startsWith('adult_')) {
            document.querySelectorAll(`.evo-${formId}`).forEach((layer) => {
                layer.style.display = 'inline';
            });
        }
    }

    function applyAccessories() {
        document.querySelectorAll('.acc-layer').forEach((layer) => {
            layer.style.display = 'none';
        });
        if (!state.equippedAccessory) return;
        const item = ns.SHOP_ITEMS.find((it) => it.id === state.equippedAccessory);
        if (!item || !item.cssClass) return;
        document.querySelectorAll(`.${item.cssClass}`).forEach((el) => {
            el.style.display = 'inline';
        });
    }

    function updateUI() {
        const formId = getCurrentFormId();
        const formMeta = getFormMeta(formId);

        let pixelSize = 52;
        if (state.level >= 11) {
            pixelSize = 66;
        } else if (state.level >= 6) {
            pixelSize = 58;
        }

        const lvStr = String(state.level).padStart(2, '0');
        levelDisplay.textContent = `LV.${lvStr} (${formMeta.stage})`;
        homeFormName.textContent = `${formMeta.icon} ${formMeta.name}`;
        coinDisplay.textContent = state.coins;
        shopCoinDisplay.textContent = state.coins;
        homeBestScore.textContent = state.highScore;

        hungerBar.style.width = `${clamp(state.hunger, 0, 100)}%`;
        happyBar.style.width = `${clamp(state.happy, 0, 100)}%`;
        fatigueBar.style.width = `${clamp(state.fatigue, 0, 100)}%`;

        homeMangoSvg.style.width = `${pixelSize}px`;
        homeMangoSvg.style.height = `${pixelSize}px`;

        homeScreen.classList.toggle('sleeping', state.isSleeping);
        zzzIcon.style.display = state.isSleeping ? 'block' : 'none';
        homeMangoSvg.classList.toggle('walking', !state.isSleeping);

        applyTheme();
        applyEvolutionVisual(formId);
        applyAccessories();
    }

    function closeAllModals() {
        foodModal.style.display = 'none';
        shopModal.style.display = 'none';
        dexModal.style.display = 'none';
        rankModal.style.display = 'none';
    }

    // 간식/밥 선택 모달
    function openFoodModal() {
        if (state.isSleeping) {
            showBubble('ZZZ... SLEEPING');
            return;
        }
        closeAllModals();
        renderFoodList();
        foodModal.style.display = 'flex';
    }

    function renderFoodList() {
        foodList.innerHTML = '';

        const basicCard = document.createElement('div');
        basicCard.className = 'item-card';
        basicCard.innerHTML = `
            <div class="item-info">
                <div class="item-name">🍖 기본 사료 (무료)</div>
                <div class="item-desc">배고픔 +20, 피로 +5, 경험치 +20</div>
            </div>
            <button type="button" class="item-btn">먹이기</button>
        `;
        basicCard.querySelector('button').addEventListener('click', () => {
            if (ns.Sound) ns.Sound.playFeed();
            recordCare('feed', 1);
            state.hunger = clamp(state.hunger + 20, 0, 100);
            state.fatigue = clamp(state.fatigue + 5, 0, 100);
            addExp(20);
            foodModal.style.display = 'none';
            showBubble('YUMMY! +EXP');
            updateUI();
            save();
        });
        foodList.appendChild(basicCard);

        const snacks = ns.SHOP_ITEMS.filter((it) => it.category === 'snack');
        snacks.forEach((snack) => {
            const qty = state.inventory[snack.id] || 0;
            if (qty <= 0) return;

            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${snack.name} x${qty}</div>
                    <div class="item-desc">${snack.desc}</div>
                </div>
                <button type="button" class="item-btn">사용</button>
            `;
            card.querySelector('button').addEventListener('click', () => {
                if (ns.Sound) ns.Sound.playFeed();
                recordCare('feed', 1);
                state.inventory[snack.id] -= 1;
                state.hunger = clamp(state.hunger + snack.effect.hunger, 0, 100);
                state.happy = clamp(state.happy + snack.effect.happy, 0, 100);
                state.fatigue = clamp(state.fatigue + snack.effect.fatigue, 0, 100);
                addExp(snack.effect.exp);
                foodModal.style.display = 'none';
                showBubble(`${snack.name} 최고!`);
                updateUI();
                save(true);
            });
            foodList.appendChild(card);
        });
    }

    // 상점 모달
    function openShopModal() {
        closeAllModals();
        renderShopList();
        shopModal.style.display = 'flex';
    }

    function renderShopList() {
        shopCoinDisplay.textContent = state.coins;
        shopList.innerHTML = '';

        const items = ns.SHOP_ITEMS.filter((it) => it.category === activeShopTab);

        if (activeShopTab === 'accessory' && state.equippedAccessory) {
            const unequipCard = document.createElement('div');
            unequipCard.className = 'item-card';
            unequipCard.innerHTML = `
                <div class="item-info">
                    <div class="item-name">✨ 액세서리 벗기</div>
                    <div class="item-desc">기본 망고 모습으로 돌아갑니다</div>
                </div>
                <button type="button" class="item-btn">해제</button>
            `;
            unequipCard.querySelector('button').addEventListener('click', () => {
                if (ns.Sound) ns.Sound.playClick();
                state.equippedAccessory = null;
                updateUI();
                renderShopList();
                save(true);
            });
            shopList.appendChild(unequipCard);
        }

        if (activeShopTab === 'theme' && state.equippedTheme !== 'theme-default') {
            const defaultThemeCard = document.createElement('div');
            defaultThemeCard.className = 'item-card';
            defaultThemeCard.innerHTML = `
                <div class="item-info">
                    <div class="item-name">☁️ 기본 하늘 배경</div>
                    <div class="item-desc">초기 푸른 하늘 배경 적용</div>
                </div>
                <button type="button" class="item-btn">적용</button>
            `;
            defaultThemeCard.querySelector('button').addEventListener('click', () => {
                if (ns.Sound) ns.Sound.playClick();
                state.equippedTheme = 'theme-default';
                updateUI();
                renderShopList();
                save(true);
            });
            shopList.appendChild(defaultThemeCard);
        }

        items.forEach((item) => {
            const ownedQty = state.inventory[item.id] || 0;
            const isPermanent = item.category !== 'snack';
            const isOwned = isPermanent && ownedQty > 0;
            const isEquipped =
                (item.category === 'accessory' && state.equippedAccessory === item.id) ||
                (item.category === 'theme' && state.equippedTheme === item.themeClass);

            let btnLabel = `🪙 ${item.price}`;
            let btnClass = 'item-btn';
            let disabled = false;

            if (isEquipped) {
                btnLabel = '장착중';
                btnClass = 'item-btn equipped';
                disabled = true;
            } else if (isOwned) {
                btnLabel = '장착';
            } else if (state.coins < item.price) {
                btnClass = 'item-btn disabled';
                disabled = true;
            }

            const qtyText = item.category === 'snack' && ownedQty > 0 ? ` (보유 ${ownedQty})` : '';
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${item.name}${qtyText}</div>
                    <div class="item-desc">${item.desc}</div>
                </div>
                <button type="button" class="${btnClass}" ${disabled ? 'disabled' : ''}>${btnLabel}</button>
            `;

            card.querySelector('button').addEventListener('click', () => {
                if (isOwned) {
                    if (ns.Sound) ns.Sound.playClick();
                    if (item.category === 'accessory') state.equippedAccessory = item.id;
                    if (item.category === 'theme') state.equippedTheme = item.themeClass;
                    showBubble('스타일 변경!');
                } else {
                    if (state.coins < item.price) return;
                    if (ns.Sound) ns.Sound.playBuy();
                    state.coins -= item.price;
                    state.inventory[item.id] = ownedQty + 1;
                    if (item.category === 'accessory') state.equippedAccessory = item.id;
                    if (item.category === 'theme') state.equippedTheme = item.themeClass;
                    showBubble('구매 완료!');
                }
                updateUI();
                renderShopList();
                save(true);
            });
            shopList.appendChild(card);
        });
    }

    // 도감 모달
    function openDexModal() {
        closeAllModals();
        renderDexList();
        dexModal.style.display = 'flex';
    }

    function renderDexList() {
        const currentFormId = getCurrentFormId();
        const total = ns.EVOLUTION_FORMS.length;
        dexCountDisplay.textContent = `${state.unlockedDex.length}/${total}`;

        const { feed, play, sleep } = state.careStats;
        const predicted = getFormMeta(determineAdultForm());
        const forecastText = state.level < 11 ? ` · 예상 진화: ${predicted.name}` : ' · 성체 진화 완료';
        dexCareSummary.textContent = `케어 비율 — 밥 ${feed} · 놀이 ${play} · 수면 ${sleep}${forecastText}`;

        dexList.innerHTML = '';
        ns.EVOLUTION_FORMS.forEach((form) => {
            const unlocked = state.unlockedDex.includes(form.id);
            const isCurrent = currentFormId === form.id;
            const card = document.createElement('div');
            card.className = `item-card dex-card ${unlocked ? '' : 'locked'}`.trim();
            card.innerHTML = `
                <div class="item-info">
                    <div class="item-name">
                        ${unlocked ? `${form.icon} ${form.name}` : '🔒 ???'}
                        ${isCurrent ? '<span class="dex-now-tag">현재</span>' : ''}
                    </div>
                    <div class="item-desc">${unlocked ? form.desc : `조건: ${form.condition}`}</div>
                </div>
            `;
            dexList.appendChild(card);
        });

        dexFooter.style.display = state.level >= 11 ? 'block' : 'none';
    }

    function rebirthMango() {
        state.level = 1;
        state.exp = 0;
        state.hunger = 70;
        state.happy = 70;
        state.fatigue = 20;
        state.isSleeping = false;
        state.adultForm = null;
        state.careStats = { feed: 0, play: 0, sleep: 0 };
        closeAllModals();
        showBubble('새 망고 탄생! 🥚');
        if (ns.Sound) ns.Sound.playLevelUp();
        updateUI();
        save(true);
    }

    // 랭킹 모달
    async function openRankModal() {
        closeAllModals();
        nicknameInput.value = state.nickname || '망고집사';
        syncBadge.textContent = ns.StorageService.isCloudEnabled() ? 'CLOUD' : 'LOCAL';
        rankList.innerHTML = '<div class="item-desc">랭킹 불러오는 중...</div>';
        rankModal.style.display = 'flex';

        const { source, rows } = await ns.StorageService.fetchLeaderboard(10, state);
        rankList.innerHTML = '';
        if (!rows.length) {
            rankList.innerHTML = '<div class="item-desc">아직 등록된 기록이 없어요.</div>';
            return;
        }
        const myId = ns.StorageService.getUserId();
        rows.forEach((row, idx) => {
            const isMe = (myId && row.user_id === myId) || row.user_id === 'local';
            const el = document.createElement('div');
            el.className = `rank-card ${isMe ? 'me' : ''}`.trim();
            el.innerHTML = `<span>#${idx + 1} ${row.nickname}</span><span>${row.best_score} pts</span>`;
            rankList.appendChild(el);
        });
        if (source === 'local') {
            const note = document.createElement('div');
            note.className = 'item-desc';
            note.style.marginTop = '4px';
            note.textContent = 'js/supabase-config.js에 키를 넣으면 전체 랭킹이 연동됩니다.';
            rankList.appendChild(note);
        }
    }

    // 홈 케어 액션
    function playMango() {
        if (state.isSleeping) {
            showBubble('ZZZ... SLEEPING');
            return;
        }
        if (state.fatigue >= 90) {
            showBubble('TOO TIRED...');
            return;
        }
        recordCare('play', 1);
        state.happy = clamp(state.happy + 20, 0, 100);
        state.hunger = clamp(state.hunger - 10, 0, 100);
        state.fatigue = clamp(state.fatigue + 15, 0, 100);
        addExp(25);
        showBubble('SO FUN! +EXP');
        updateUI();
        save();
    }

    function toggleSleep() {
        closeAllModals();
        state.isSleeping = !state.isSleeping;
        if (state.isSleeping) {
            recordCare('sleep', 1);
        }
        showBubble(state.isSleeping ? 'GOOD NIGHT...' : 'GOOD MORNING!');
        updateUI();
        save(true);
    }

    // 미니게임 인스턴스
    const minigame = new ns.CatchMinigame({
        screenEl: gameScreen,
        mangoEl: document.getElementById('game-mango'),
        scoreEl: document.getElementById('score-display'),
        timeEl: document.getElementById('time-display'),
        heartsEl: document.getElementById('hearts-display'),
        comboEl: document.getElementById('combo-badge'),
        guideEl: document.getElementById('game-guide'),
        resultEl: document.getElementById('game-result'),
        resultTitleEl: document.getElementById('result-title'),
        resultDetailsEl: document.getElementById('result-details'),
        onStatGain: ({ happy, exp }) => {
            state.happy = clamp(state.happy + happy, 0, 100);
            addExp(exp);
        },
        onComplete: ({ score, baseCoins, clearBonus, goldCoins, survivedAll }) => {
            recordCare('play', 2);
            const isNewRecord = score > state.highScore;
            const recordBonus = isNewRecord ? ns.MINIGAME_CONFIG.newRecordBonusCoins : 0;
            if (isNewRecord) {
                state.highScore = score;
            }
            const totalCoins = baseCoins + clearBonus + goldCoins + recordBonus;
            state.coins += totalCoins;
            state.fatigue = clamp(state.fatigue + ns.MINIGAME_CONFIG.fatigueCost, 0, 100);
            updateUI();
            save(true);
            ns.StorageService.recordScore({
                score,
                coinsEarned: totalCoins,
                survivedAll,
                nickname: state.nickname
            });
            return { score, baseCoins, clearBonus, goldCoins, recordBonus, totalCoins, isNewRecord };
        }
    });

    function toggleScreen() {
        if (isHome) {
            if (state.isSleeping) {
                showBubble('ZZZ... SLEEPING');
                return;
            }
            if (state.fatigue >= ns.MINIGAME_CONFIG.entryMaxFatigue) {
                showBubble('피곤해요! 잠이나 드링크!');
                return;
            }
            closeAllModals();
            homeScreen.style.display = 'none';
            homeBtns.style.display = 'none';
            gameScreen.style.display = 'flex';
            gameBtns.style.display = 'flex';
            isHome = false;
            minigame.reset();
        } else {
            minigame.stopLoop();
            gameScreen.style.display = 'none';
            gameBtns.style.display = 'none';
            homeScreen.style.display = 'flex';
            homeBtns.style.display = 'flex';
            isHome = true;
            updateUI();
        }
    }

    // 홈 화면 망고 산책 모션
    let mangoX = 110;
    let mangoDir = 1;
    setInterval(() => {
        if (!isHome || state.isSleeping) return;
        const maxW = Math.max(20, homeScreen.clientWidth - homeMangoSvg.clientWidth - 16);
        mangoX += mangoDir * 3;
        if (mangoX >= maxW) {
            mangoX = maxW;
            mangoDir = -1;
        } else if (mangoX <= 10) {
            mangoX = 10;
            mangoDir = 1;
        }
        homeMango.style.left = `${mangoX}px`;
        homeMango.style.transform = `scaleX(${mangoDir})`;
    }, 90);

    // 시간 경과 스탯 변화
    setInterval(() => {
        if (state.isSleeping) {
            state.fatigue = clamp(state.fatigue - 8, 0, 100);
            state.hunger = clamp(state.hunger - 2, 0, 100);
            if (state.fatigue === 0) {
                state.isSleeping = false;
                showBubble('GOOD MORNING!');
            }
        } else if (isHome) {
            state.hunger = clamp(state.hunger - 2, 0, 100);
            state.happy = clamp(state.happy - 2, 0, 100);
            state.fatigue = clamp(state.fatigue + 2, 0, 100);
        }
        updateUI();
        save();
    }, 4000);

    // 효과음 토글 버튼 초기화
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    function updateSoundBtn() {
        if (!soundToggleBtn || !ns.Sound) return;
        soundToggleBtn.textContent = ns.Sound.isMuted() ? '🔇' : '🔊';
    }
    if (soundToggleBtn && ns.Sound) {
        updateSoundBtn();
        soundToggleBtn.addEventListener('click', () => {
            ns.Sound.toggleMute();
            updateSoundBtn();
        });
    }

    function withClickSound(fn) {
        return (...args) => {
            if (ns.Sound) ns.Sound.playClick();
            return fn(...args);
        };
    }

    // 이벤트 연결
    document.getElementById('btn-food').addEventListener('click', withClickSound(openFoodModal));
    document.getElementById('btn-play').addEventListener('click', withClickSound(playMango));
    document.getElementById('btn-sleep').addEventListener('click', withClickSound(toggleSleep));
    document.getElementById('btn-outside').addEventListener('click', withClickSound(toggleScreen));

    document.getElementById('dex-btn').addEventListener('click', withClickSound(openDexModal));
    document.getElementById('rank-btn').addEventListener('click', withClickSound(openRankModal));
    document.getElementById('coin-shop-btn').addEventListener('click', withClickSound(openShopModal));
    document.getElementById('close-food-btn').addEventListener('click', withClickSound(() => { foodModal.style.display = 'none'; }));
    document.getElementById('close-shop-btn').addEventListener('click', withClickSound(() => { shopModal.style.display = 'none'; }));
    document.getElementById('close-dex-btn').addEventListener('click', withClickSound(() => { dexModal.style.display = 'none'; }));
    document.getElementById('close-rank-btn').addEventListener('click', withClickSound(() => { rankModal.style.display = 'none'; }));
    document.getElementById('rebirth-btn').addEventListener('click', withClickSound(rebirthMango));
    document.getElementById('save-nickname-btn').addEventListener('click', withClickSound(() => {
        const nextName = nicknameInput.value.trim();
        if (!nextName) return;
        state.nickname = nextName.slice(0, 12);
        save(true);
        showBubble('닉네임 저장!');
        openRankModal();
    }));

    document.querySelectorAll('.shop-tab').forEach((tab) => {
        tab.addEventListener('click', withClickSound(() => {
            document.querySelectorAll('.shop-tab').forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');
            activeShopTab = tab.dataset.tab;
            renderShopList();
        }));
    });

    document.getElementById('btn-toggle-game').addEventListener('click', withClickSound(() => minigame.toggle()));
    document.getElementById('btn-go-home').addEventListener('click', withClickSound(toggleScreen));
    document.getElementById('result-replay-btn').addEventListener('click', withClickSound(() => {
        if (state.fatigue >= ns.MINIGAME_CONFIG.entryMaxFatigue) {
            toggleScreen();
            showBubble('피곤해요! 휴식 필요!');
            return;
        }
        minigame.reset();
        minigame.start();
    }));
    document.getElementById('result-home-btn').addEventListener('click', withClickSound(toggleScreen));

    // 모바일 터치 & 마우스/키보드 조작
    function bindHoldButton(btn, setFlag) {
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); setFlag(true); }, { passive: false });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); setFlag(false); });
        btn.addEventListener('touchcancel', () => setFlag(false));
        btn.addEventListener('mousedown', () => setFlag(true));
        btn.addEventListener('mouseup', () => setFlag(false));
        btn.addEventListener('mouseleave', () => setFlag(false));
    }

    bindHoldButton(document.getElementById('btn-left'), (val) => { minigame.moveLeft = val; });
    bindHoldButton(document.getElementById('btn-right'), (val) => { minigame.moveRight = val; });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') minigame.moveLeft = true;
        if (e.key === 'ArrowRight') minigame.moveRight = true;
    });
    window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') minigame.moveLeft = false;
        if (e.key === 'ArrowRight') minigame.moveRight = false;
    });

    updateUI();

    // Supabase 설정 시 비동기로 클라우드 상태 동기화
    ns.StorageService.initCloud(state).then(({ connected, state: syncedState }) => {
        if (connected && syncedState) {
            state = syncedState;
            updateUI();
        }
    });
})(window.MangoGame);
