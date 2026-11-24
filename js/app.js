window.MangoGame = window.MangoGame || {};

(function (ns) {
    let state = ns.StorageService.loadState();
    let isHome = true;
    let activeShopTab = 'snack';
    let renderedCharId = null;
    let renderedSleeping = null;

    // DOM 요소
    const deviceTitle = document.getElementById('device-title');
    const homeScreen = document.getElementById('home-screen');
    const gameScreen = document.getElementById('game-screen');
    const jumpScreen = document.getElementById('jump-screen');
    const themeDecor = document.getElementById('theme-decor');
    const homeBtns = document.getElementById('home-buttons');
    const gameBtns = document.getElementById('game-buttons');
    const jumpBtns = document.getElementById('jump-buttons');

    const levelDisplay = document.getElementById('level-display');
    const coinDisplay = document.getElementById('coin-display');
    const shopCoinDisplay = document.getElementById('shop-coin-display');
    const homeBestScore = document.getElementById('home-best-score');
    const homeFormName = document.getElementById('home-form-name');
    const homeBuffBadge = document.getElementById('home-buff-badge');
    const hungerBar = document.getElementById('hunger-bar');
    const happyBar = document.getElementById('happy-bar');
    const fatigueBar = document.getElementById('fatigue-bar');
    const statusBubble = document.getElementById('status-bubble');
    const zzzIcon = document.getElementById('zzz-icon');

    const homeMango = document.getElementById('home-mango');
    const homeMangoSvg = document.getElementById('home-mango-svg');
    const gameMangoSvg = document.getElementById('game-mango-svg');
    const jumpMangoSvg = document.getElementById('jump-mango-svg');

    const foodModal = document.getElementById('food-modal');
    const foodList = document.getElementById('food-list');
    const shopModal = document.getElementById('shop-modal');
    const shopList = document.getElementById('shop-list');
    const charModal = document.getElementById('char-modal');
    const charList = document.getElementById('char-list');
    const onboardingModal = document.getElementById('onboarding-modal');
    const onboardingList = document.getElementById('onboarding-list');
    const dexModal = document.getElementById('dex-modal');
    const dexList = document.getElementById('dex-list');
    const dexCountDisplay = document.getElementById('dex-count-display');
    const dexCareSummary = document.getElementById('dex-care-summary');
    const dexFooter = document.getElementById('dex-footer');
    const rankModal = document.getElementById('rank-modal');
    const outsideModal = document.getElementById('outside-modal');
    const rankList = document.getElementById('rank-list');
    const syncBadge = document.getElementById('sync-badge');
    const nicknameInput = document.getElementById('nickname-input');
    const saveBtn = document.getElementById('save-btn');
    const saveModal = document.getElementById('save-modal');
    const saveStatusBadge = document.getElementById('save-status-badge');
    const saveSummary = document.getElementById('save-summary');
    const saveQuickCard = document.getElementById('save-quick-card');
    const saveQuickTitle = document.getElementById('save-quick-title');
    const saveQuickMeta = document.getElementById('save-quick-meta');
    const saveForm = document.getElementById('save-form');
    const saveNicknameInput = document.getElementById('save-nickname-input');
    const saveEmailInput = document.getElementById('save-email-input');
    const saveMsg = document.getElementById('save-msg');
    const saveSubmitBtn = document.getElementById('save-submit-btn');
    let saveMode = 'save';

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

    function getCurrentCharacter() {
        return ns.CHARACTERS.find((c) => c.id === state.character) || ns.CHARACTERS[0];
    }

    function getFormDisplayName(formMeta) {
        const char = getCurrentCharacter();
        return `${formMeta.namePrefix} ${char.name}`;
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

    function meetsFormRequirement(form) {
        const req = form.requirement || { minLevel: 1 };
        const cs = state.careStats || { feed: 0, play: 0, sleep: 0 };
        if (state.level < (req.minLevel || 1)) return false;
        if (req.feed && (cs.feed || 0) < req.feed) return false;
        if (req.play && (cs.play || 0) < req.play) return false;
        if (req.sleep && (cs.sleep || 0) < req.sleep) return false;
        return true;
    }

    function getFormProgressText(form) {
        const req = form.requirement || { minLevel: 1 };
        const cs = state.careStats || { feed: 0, play: 0, sleep: 0 };
        const parts = [`Lv.${Math.min(state.level, req.minLevel)}/${req.minLevel}`];
        if (req.feed) parts.push(`밥 ${Math.min(cs.feed || 0, req.feed)}/${req.feed}`);
        if (req.play) parts.push(`놀이 ${Math.min(cs.play || 0, req.play)}/${req.play}`);
        if (req.sleep) parts.push(`수면 ${Math.min(cs.sleep || 0, req.sleep)}/${req.sleep}`);
        return parts.join(' · ');
    }

    function checkUnlockableForms(notify = false) {
        const newlyUnlocked = [];
        ns.EVOLUTION_FORMS.forEach((form) => {
            if (meetsFormRequirement(form) && !state.unlockedDex.includes(form.id)) {
                unlockDexForm(form.id);
                newlyUnlocked.push(form);
            }
        });

        if (state.level >= 11 && (!state.adultForm || !state.unlockedDex.includes(state.adultForm))) {
            const unlockedAdults = ns.EVOLUTION_FORMS.filter(
                (f) => f.stage === 'ADULT' && state.unlockedDex.includes(f.id)
            );
            if (unlockedAdults.length > 0) {
                state.adultForm = unlockedAdults[0].id;
            }
        }

        if (notify && newlyUnlocked.length > 0) {
            const latest = newlyUnlocked[newlyUnlocked.length - 1];
            showBubble(`도감 해금! ${getFormDisplayName(latest)} ✨`);
            if (ns.Sound) ns.Sound.playEvolution();
            save(true);
        }
        return newlyUnlocked;
    }

    function getCurrentFormId() {
        checkUnlockableForms(false);
        if (state.level >= 11) {
            if (state.adultForm && state.unlockedDex.includes(state.adultForm)) {
                return state.adultForm;
            }
            return 'teen';
        }
        if (state.level >= 6) {
            return 'teen';
        }
        return 'baby';
    }

    function getFormMeta(formId) {
        return ns.EVOLUTION_FORMS.find((f) => f.id === formId) || ns.EVOLUTION_FORMS[0];
    }

    function getActiveBuff() {
        const meta = getFormMeta(getCurrentFormId());
        return (meta && meta.buff) ? meta.buff : {};
    }

    function getLevelStaminaFactor() {
        return Math.max(0.45, 1 - Math.max(0, state.level - 1) * 0.02);
    }

    function recordCare(type, amount = 1) {
        if (!state.careStats) state.careStats = { feed: 0, play: 0, sleep: 0 };
        state.careStats[type] = (state.careStats[type] || 0) + amount;
        checkUnlockableForms(true);
    }

    function addExp(amount, opts = {}) {
        const buff = getActiveBuff();
        let mult = buff.allExpMult || 1;
        if (opts.isFeed && buff.feedExpMult) {
            mult *= buff.feedExpMult;
        }
        state.exp += Math.round(amount * mult);
        let leveledUp = false;
        while (state.exp >= 100) {
            state.exp -= 100;
            state.level += 1;
            leveledUp = true;
        }
        if (!leveledUp) return;

        const unlocked = checkUnlockableForms(true);
        if (unlocked.length === 0) {
            showBubble('LEVEL UP!');
            if (ns.Sound) ns.Sound.playLevelUp();
        }
    }

    function syncCharacterSprites() {
        const char = getCurrentCharacter();
        const isSleeping = Boolean(state.isSleeping);
        if ((renderedCharId !== char.id || renderedSleeping !== isSleeping) && ns.Sprites) {
            ns.Sprites.render(homeMangoSvg, char.id, { withBasket: false, isSleeping });
            if (renderedCharId !== char.id) {
                ns.Sprites.render(gameMangoSvg, char.id, { withBasket: true, isSleeping: false });
                if (jumpMangoSvg) {
                    ns.Sprites.render(jumpMangoSvg, char.id, { withBasket: false, isSleeping: false });
                }
            }
            renderedCharId = char.id;
            renderedSleeping = isSleeping;
        }
        if (deviceTitle) {
            deviceTitle.textContent = char.title;
        }
    }

    function applyTheme() {
        const themeClasses = ['theme-default', 'theme-sakura', 'theme-beach', 'theme-camping', 'theme-cozy-room', 'theme-autumn'];
        const activeTheme = state.equippedTheme || 'theme-default';
        [homeScreen, gameScreen, jumpScreen].forEach((el) => {
            if (!el) return;
            el.classList.remove(...themeClasses);
            el.classList.add(activeTheme);
        });

        const themeSvg = ns.Sprites && ns.Sprites.buildThemeSvg
            ? ns.Sprites.buildThemeSvg(activeTheme)
            : '';
        const gameThemeDecor = document.getElementById('game-theme-decor');
        const jumpThemeDecor = document.getElementById('jump-theme-decor');
        if (themeDecor) themeDecor.innerHTML = themeSvg;
        if (gameThemeDecor) gameThemeDecor.innerHTML = themeSvg;
        if (jumpThemeDecor) jumpThemeDecor.innerHTML = themeSvg;
    }

    function applyEvolutionVisual(formId) {
        const formClasses = ['form-adult_foodie', 'form-adult_sporty', 'form-adult_sleepy', 'form-adult_balanced', 'form-adult_royal'];
        [homeMangoSvg, gameMangoSvg, jumpMangoSvg].forEach((svg) => {
            if (!svg) return;
            svg.classList.remove(...formClasses);
            if (formId.startsWith('adult_')) {
                svg.classList.add(`form-${formId}`);
            }
            svg.querySelectorAll('.evo-layer').forEach((layer) => {
                layer.style.display = 'none';
            });
            if (formId.startsWith('adult_')) {
                svg.querySelectorAll(`.evo-${formId}`).forEach((layer) => {
                    layer.style.display = 'inline';
                });
            }
        });
    }

    function applyAccessories() {
        const item = state.equippedAccessory
            ? ns.SHOP_ITEMS.find((it) => it.id === state.equippedAccessory)
            : null;
        [homeMangoSvg, gameMangoSvg, jumpMangoSvg].forEach((svg) => {
            if (!svg) return;
            svg.querySelectorAll('.acc-layer').forEach((layer) => {
                layer.style.display = 'none';
            });
            if (item && item.cssClass) {
                svg.querySelectorAll(`.${item.cssClass}`).forEach((el) => {
                    el.style.display = 'inline';
                });
            }
        });
    }

    function updateUI() {
        syncCharacterSprites();
        const char = getCurrentCharacter();
        const formId = getCurrentFormId();
        const formMeta = getFormMeta(formId);

        let baseSize = 62;
        if (state.level >= 11) {
            baseSize = 78;
        } else if (state.level >= 6) {
            baseSize = 70;
        }
        const pixelSize = Math.round(baseSize * (char.sizeScale || 1));
        const gameSize = Math.round(62 * (char.sizeScale || 1));

        const lvStr = String(state.level).padStart(2, '0');
        levelDisplay.textContent = `LV.${lvStr} (${formMeta.stage})`;
        homeFormName.textContent = `${formMeta.icon} ${getFormDisplayName(formMeta)}`;
        if (homeBuffBadge) {
            if (formMeta.buffShort) {
                homeBuffBadge.textContent = formMeta.buffShort;
                homeBuffBadge.style.display = 'inline-block';
            } else {
                homeBuffBadge.style.display = 'none';
            }
        }
        coinDisplay.textContent = state.coins;
        shopCoinDisplay.textContent = state.coins;
        homeBestScore.textContent = state.highScore;

        hungerBar.style.width = `${clamp(state.hunger, 0, 100)}%`;
        happyBar.style.width = `${clamp(state.happy, 0, 100)}%`;
        fatigueBar.style.width = `${clamp(state.fatigue, 0, 100)}%`;

        homeMangoSvg.style.width = `${pixelSize}px`;
        homeMangoSvg.style.height = `${pixelSize}px`;
        gameMangoSvg.style.width = `${gameSize}px`;
        gameMangoSvg.style.height = `${gameSize}px`;
        if (jumpMangoSvg) {
            jumpMangoSvg.style.width = `${gameSize}px`;
            jumpMangoSvg.style.height = `${gameSize}px`;
        }

        homeScreen.classList.toggle('sleeping', state.isSleeping);
        zzzIcon.style.display = state.isSleeping ? 'block' : 'none';
        homeMangoSvg.classList.toggle('walking', !state.isSleeping);
        homeMangoSvg.classList.toggle('sleeping-breath', state.isSleeping);

        applyTheme();
        applyEvolutionVisual(formId);
        applyAccessories();
    }

    function closeAllModals() {
        foodModal.style.display = 'none';
        shopModal.style.display = 'none';
        charModal.style.display = 'none';
        dexModal.style.display = 'none';
        rankModal.style.display = 'none';
        if (saveModal) saveModal.style.display = 'none';
        if (outsideModal) outsideModal.style.display = 'none';
    }

    function formatSavedTime(isoStr) {
        if (!isoStr) return '';
        const d = new Date(isoStr);
        if (Number.isNaN(d.getTime())) return '';
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        return `${mm}/${dd} ${hh}:${min}`;
    }

    function updateSaveBtnUI() {
        if (!saveBtn) return;
        const profile = ns.StorageService.getLinkedProfile();
        saveBtn.classList.toggle('saved', Boolean(profile));
        saveBtn.title = profile ? `저장 연동됨 (${profile.nickname})` : '닉네임으로 저장/불러오기';
    }

    function setSaveMode(mode) {
        saveMode = mode === 'load' ? 'load' : 'save';
        document.querySelectorAll('.save-tab').forEach((tab) => {
            tab.classList.toggle('active', tab.dataset.mode === saveMode);
        });
        saveMsg.textContent = '';
        saveMsg.classList.remove('ok');

        const profile = ns.StorageService.getLinkedProfile();
        if (saveMode === 'save') {
            saveSubmitBtn.textContent = '지금까지 키운 데이터 저장';
            if (saveSummary) saveSummary.style.display = 'block';
            if (saveQuickCard) {
                saveQuickCard.style.display = profile ? 'flex' : 'none';
                if (profile) {
                    saveQuickTitle.textContent = `연동 닉네임: ${profile.nickname}`;
                    const t = formatSavedTime(profile.savedAt);
                    saveQuickMeta.textContent = t ? `최근 저장 ${t}` : '이메일 재입력 없이 바로 저장 가능';
                }
            }
        } else {
            saveSubmitBtn.textContent = '저장된 데이터 불러오기';
            if (saveSummary) saveSummary.style.display = 'none';
            if (saveQuickCard) saveQuickCard.style.display = 'none';
        }
    }

    function getPetStageLabel(pet) {
        if (!pet) return '아기';
        if (pet.level >= 11) {
            const meta = pet.adultForm ? getFormMeta(pet.adultForm) : null;
            return meta && meta.stage === 'ADULT' ? meta.namePrefix : '성견';
        }
        if (pet.level >= 6) return '청소년';
        return '아기';
    }

    function openSaveModal(defaultMode = 'save') {
        closeAllModals();
        if (saveStatusBadge) {
            saveStatusBadge.textContent = ns.StorageService.isCloudConfigured() ? 'CLOUD' : 'LOCAL';
        }
        const pets = ns.StorageService.getPetsSnapshot(state);
        if (saveSummary) {
            const petParts = ns.CHARACTERS.map((c) => {
                const p = pets[c.id] || { level: 1 };
                return `${c.name} Lv.${String(p.level).padStart(2, '0')}`;
            });
            saveSummary.textContent = `${petParts.join(' · ')} · 🪙 ${state.coins}`;
        }
        const profile = ns.StorageService.getLinkedProfile();
        if (saveNicknameInput) {
            const defaultNick = (profile && profile.nickname) || (state.nickname && state.nickname !== '망고집사' ? state.nickname : '');
            saveNicknameInput.value = defaultNick;
        }
        if (saveEmailInput) saveEmailInput.value = '';
        setSaveMode(defaultMode);
        if (saveModal) saveModal.style.display = 'flex';
    }

    // 캐릭터 선택 모달 (토리 / 망고 / 미미 — 강아지별 독립 성장)
    function openCharModal() {
        closeAllModals();
        renderCharList();
        charModal.style.display = 'flex';
    }

    function renderCharList() {
        charList.innerHTML = '';
        const pets = ns.StorageService.getPetsSnapshot(state);
        const totalDex = ns.EVOLUTION_FORMS.length;

        ns.CHARACTERS.forEach((char) => {
            const isSelected = state.character === char.id;
            const pet = pets[char.id] || { level: 1, unlockedDex: ['baby'], isSleeping: false };
            const lvStr = String(pet.level || 1).padStart(2, '0');
            const stageLabel = getPetStageLabel(pet);
            const dexCnt = Array.isArray(pet.unlockedDex) ? pet.unlockedDex.length : 1;

            const card = document.createElement('div');
            card.className = `char-card ${isSelected ? 'selected' : ''}`.trim();

            const previewBox = document.createElement('div');
            previewBox.className = 'char-preview-box';
            if (ns.Sprites) {
                previewBox.appendChild(ns.Sprites.createPreviewSvg(char.id));
            }

            const info = document.createElement('div');
            info.className = 'item-info';
            info.style.flex = '1';
            info.innerHTML = `
                <div class="item-name">${char.name}${pet.isSleeping ? ' 💤' : ''}</div>
                <div class="char-growth-pill">Lv.${lvStr} ${stageLabel} · 도감 ${dexCnt}/${totalDex}</div>
                <div class="item-desc">${char.desc}</div>
            `;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = isSelected ? 'item-btn equipped' : 'item-btn';
            btn.textContent = isSelected ? '돌보는 중' : '전환하기';
            btn.disabled = isSelected;
            btn.addEventListener('click', () => {
                if (ns.Sound) ns.Sound.playLevelUp();
                ns.StorageService.switchCharacter(state, char.id);
                renderedCharId = null;
                renderedSleeping = null;
                closeAllModals();
                showBubble(`${char.name} Lv.${String(state.level).padStart(2, '0')}! 🐾`);
                updateUI();
                save(true);
            });

            card.appendChild(previewBox);
            card.appendChild(info);
            card.appendChild(btn);
            charList.appendChild(card);
        });
    }

    // 최초 진입 강아지 선택 온보딩 모달
    function openOnboardingModal() {
        if (!onboardingModal || !onboardingList) return;
        closeAllModals();
        onboardingList.innerHTML = '';
        ns.CHARACTERS.forEach((char) => {
            const card = document.createElement('div');
            card.className = 'char-card';

            const previewBox = document.createElement('div');
            previewBox.className = 'char-preview-box';
            if (ns.Sprites) {
                previewBox.appendChild(ns.Sprites.createPreviewSvg(char.id));
            }

            const info = document.createElement('div');
            info.className = 'item-info';
            info.style.flex = '1';
            info.innerHTML = `
                <div class="item-name">${char.name}</div>
                <div class="item-desc">${char.desc}</div>
            `;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'item-btn';
            btn.textContent = `${char.name} 선택`;
            btn.addEventListener('click', () => {
                if (ns.Sound) ns.Sound.playLevelUp();
                ns.StorageService.switchCharacter(state, char.id);
                renderedCharId = null;
                renderedSleeping = null;
                onboardingModal.style.display = 'none';
                showBubble(`${char.name}와 함께 시작! 🐾`);
                updateUI();
                save(true);
            });

            card.appendChild(previewBox);
            card.appendChild(info);
            card.appendChild(btn);
            onboardingList.appendChild(card);
        });
        onboardingModal.style.display = 'flex';
    }

    function closeOnboardingModal() {
        if (onboardingModal) onboardingModal.style.display = 'none';
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

    function getSnackEffectForChar(snack, charId) {
        const custom = snack.charEffects && snack.charEffects[charId];
        if (custom) {
            return { ...snack.effect, ...custom, isFavorite: true };
        }
        return { ...snack.effect, isFavorite: false };
    }

    function formatSnackEffectDesc(eff) {
        const parts = [];
        if (eff.hunger > 0) parts.push(`배고픔 +${eff.hunger}`);
        if (eff.happy > 0) parts.push(`행복 +${eff.happy}`);
        if (eff.fatigue < 0) parts.push(`피로 ${eff.fatigue}`);
        if (eff.fatigue > 0) parts.push(`피로 +${eff.fatigue}`);
        if (eff.exp > 0) parts.push(`경험치 +${eff.exp}`);
        return parts.join(', ');
    }

    function renderFoodList() {
        foodList.innerHTML = '';
        const char = getCurrentCharacter();

        const basicCard = document.createElement('div');
        basicCard.className = 'item-card';
        basicCard.innerHTML = `
            <div class="item-info">
                <div class="item-name">🍖 기본 사료 (무료)</div>
                <div class="item-desc">배고픔 +20, 피로 +3, 경험치 +20</div>
            </div>
            <button type="button" class="item-btn">먹이기</button>
        `;
        basicCard.querySelector('button').addEventListener('click', () => {
            if (ns.Sound) ns.Sound.playFeed();
            const buff = getActiveBuff();
            recordCare('feed', 1);
            const hungerGain = Math.round(20 * (buff.feedHungerMult || 1));
            state.hunger = clamp(state.hunger + hungerGain, 0, 100);
            state.fatigue = clamp(state.fatigue + 3, 0, 100);
            addExp(20, { isFeed: true });
            foodModal.style.display = 'none';
            showBubble(buff.feedHungerMult ? 'YUMMY! +25% 버프' : 'YUMMY! +EXP');
            updateUI();
            save();
        });
        foodList.appendChild(basicCard);

        const snacks = ns.SHOP_ITEMS.filter((it) => it.category === 'snack');
        snacks.forEach((snack) => {
            const qty = state.inventory[snack.id] || 0;
            if (qty <= 0) return;

            const eff = getSnackEffectForChar(snack, char.id);
            const favTag = eff.isFavorite ? `<span class="fav-snack-tag">💖 ${char.name} 취향</span>` : '';
            const card = document.createElement('div');
            card.className = `item-card ${eff.isFavorite ? 'fav-snack-card' : ''}`.trim();
            card.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${snack.name} x${qty} ${favTag}</div>
                    <div class="item-desc">${formatSnackEffectDesc(eff)}</div>
                </div>
                <button type="button" class="item-btn">사용</button>
            `;
            card.querySelector('button').addEventListener('click', () => {
                if (ns.Sound) ns.Sound.playFeed();
                const buff = getActiveBuff();
                recordCare('feed', 1);
                state.inventory[snack.id] -= 1;
                const hungerGain = Math.round(eff.hunger * (buff.feedHungerMult || 1));
                state.hunger = clamp(state.hunger + hungerGain, 0, 100);
                state.happy = clamp(state.happy + eff.happy, 0, 100);
                state.fatigue = clamp(state.fatigue + eff.fatigue, 0, 100);
                addExp(eff.exp, { isFeed: true });
                foodModal.style.display = 'none';
                showBubble(eff.bubble || `${snack.name} 최고!`);
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
                    <div class="item-desc">기본 모습으로 돌아갑니다</div>
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
            let favTag = '';
            let itemDesc = item.desc;
            let isFavSnack = false;
            if (item.category === 'snack') {
                const curChar = getCurrentCharacter();
                const eff = getSnackEffectForChar(item, curChar.id);
                isFavSnack = eff.isFavorite;
                itemDesc = formatSnackEffectDesc(eff);
                if (isFavSnack) {
                    favTag = `<span class="fav-snack-tag">💖 ${curChar.name} 취향</span>`;
                }
            }
            const card = document.createElement('div');
            card.className = `item-card ${isFavSnack ? 'fav-snack-card' : ''}`.trim();
            card.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${item.name}${qtyText} ${favTag}</div>
                    <div class="item-desc">${itemDesc}</div>
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
        checkUnlockableForms(false);
        const char = getCurrentCharacter();
        const dexTitleEl = document.getElementById('dex-modal-title');
        if (dexTitleEl) dexTitleEl.textContent = `📖 ${char.name} 도감`;
        const currentFormId = getCurrentFormId();
        const total = ns.EVOLUTION_FORMS.length;
        dexCountDisplay.textContent = `${state.unlockedDex.length}/${total}`;

        const { feed, play, sleep } = state.careStats;
        const adultHint = state.level >= 11
            ? '해금된 성견 스킨을 선택하면 전용 효과가 바로 적용돼요!'
            : 'Lv.11 성견 달성 후 해금된 스킨과 효과를 자유롭게 변경할 수 있어요.';
        dexCareSummary.innerHTML = `
            <div class="dex-care-chips">
                <span class="dex-chip">🍖 밥 ${feed}</span>
                <span class="dex-chip">⚽ 놀이 ${play}</span>
                <span class="dex-chip">💤 수면 ${sleep}</span>
            </div>
            <div class="dex-care-hint">${adultHint}</div>
        `;

        dexList.innerHTML = '';
        ns.EVOLUTION_FORMS.forEach((form) => {
            const unlocked = state.unlockedDex.includes(form.id);
            const isCurrent = currentFormId === form.id;
            const canSelectAdult = unlocked && form.stage === 'ADULT' && state.level >= 11;
            const card = document.createElement('div');
            card.className = `dex-card ${unlocked ? '' : 'locked'} ${isCurrent ? 'active' : ''}`.trim();

            const topRow = document.createElement('div');
            topRow.className = 'dex-card-top';

            const titleWrap = document.createElement('div');
            titleWrap.className = 'dex-title-wrap';
            const stageLabel = form.stage === 'ADULT' ? '성견' : (form.stage === 'TEEN' ? '청소년' : '아기');
            titleWrap.innerHTML = `
                <span class="dex-stage-tag stage-${form.stage.toLowerCase()}">${stageLabel}</span>
                <span class="dex-name">${unlocked ? `${form.icon} ${getFormDisplayName(form)}` : '🔒 미해금 스킨'}</span>
            `;
            topRow.appendChild(titleWrap);

            if (canSelectAdult) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = isCurrent ? 'dex-apply-btn equipped' : 'dex-apply-btn';
                btn.textContent = isCurrent ? '적용중' : '적용';
                btn.disabled = isCurrent;
                btn.addEventListener('click', () => {
                    if (ns.Sound) ns.Sound.playLevelUp();
                    state.adultForm = form.id;
                    showBubble(`외형 변경! ${getFormDisplayName(form)}`);
                    updateUI();
                    renderDexList();
                    save(true);
                });
                topRow.appendChild(btn);
            } else if (isCurrent) {
                const nowTag = document.createElement('span');
                nowTag.className = 'dex-now-tag';
                nowTag.textContent = '현재';
                topRow.appendChild(nowTag);
            }
            card.appendChild(topRow);

            if (unlocked) {
                const descEl = document.createElement('div');
                descEl.className = 'dex-desc';
                descEl.textContent = form.desc;
                card.appendChild(descEl);
            }

            if (form.buffLabel) {
                const buffEl = document.createElement('div');
                const isNoBuff = !form.buffShort;
                buffEl.className = `dex-buff-box ${isNoBuff ? 'neutral' : ''}`.trim();
                buffEl.innerHTML = `<span class="dex-buff-label">효과</span><span>${form.buffLabel}</span>`;
                card.appendChild(buffEl);
            }

            const condEl = document.createElement('div');
            condEl.className = 'dex-cond';
            condEl.innerHTML = unlocked
                ? `<span class="dex-cond-badge done">달성</span><span>${form.condition}</span>`
                : `<span class="dex-cond-badge">조건</span><span>${form.condition}</span><span class="dex-progress">(${getFormProgressText(form)})</span>`;
            card.appendChild(condEl);

            dexList.appendChild(card);
        });

        dexFooter.style.display = state.level >= 11 ? 'block' : 'none';
    }

    function rebirthMango() {
        const char = getCurrentCharacter();
        state.level = 1;
        state.exp = 0;
        state.hunger = 70;
        state.happy = 70;
        state.fatigue = 20;
        state.isSleeping = false;
        state.adultForm = null;
        state.careStats = { feed: 0, play: 0, sleep: 0 };
        closeAllModals();
        showBubble(`새 ${char.name} 탄생! 🥚`);
        if (ns.Sound) ns.Sound.playLevelUp();
        updateUI();
        save(true);
    }

    // 랭킹 모달 (등록된 사용자 닉네임 + 최고 점수)
    async function openRankModal() {
        closeAllModals();
        const profile = ns.StorageService.getLinkedProfile();
        syncBadge.textContent = ns.StorageService.isCloudConfigured() ? 'CLOUD' : 'LOCAL';
        rankList.innerHTML = '<div class="item-desc">랭킹 불러오는 중...</div>';
        const rankFooter = document.getElementById('rank-register-footer');
        if (rankFooter) rankFooter.style.display = profile ? 'none' : 'block';
        rankModal.style.display = 'flex';

        const { source, rows } = await ns.StorageService.fetchLeaderboard(20, state);
        rankList.innerHTML = '';
        if (source === 'needs_sql') {
            rankList.innerHTML = '<div class="item-desc">Supabase SQL Editor에서 최신 schema.sql을 먼저 실행해 주세요.</div>';
            return;
        }
        if (!rows.length) {
            rankList.innerHTML = '<div class="item-desc">아직 등록된 사용자가 없어요. 저장하기에서 닉네임을 등록해 첫 랭커가 되어보세요!</div>';
            return;
        }
        const myNickKey = profile ? profile.nickname.trim().toLowerCase() : null;
        rows.forEach((row, idx) => {
            const rowKey = (row.nickname || '').trim().toLowerCase();
            const isMe = Boolean((myNickKey && rowKey === myNickKey) || row.isLocalOnly);
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
        const staminaFactor = getLevelStaminaFactor();
        recordCare('play', 1);
        state.happy = clamp(state.happy + 20, 0, 100);
        state.hunger = clamp(state.hunger - Math.max(4, Math.round(8 * staminaFactor)), 0, 100);
        state.fatigue = clamp(state.fatigue + Math.max(5, Math.round(10 * staminaFactor)), 0, 100);
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

    function handleMinigameComplete({ score, baseCoins, clearBonus, goldCoins, survivedAll }) {
        const buff = getActiveBuff();
        recordCare('play', 2);
        const isNewRecord = score > state.highScore;
        const recordBonus = isNewRecord ? ns.MINIGAME_CONFIG.newRecordBonusCoins : 0;
        if (isNewRecord) {
            state.highScore = score;
        }
        const rawCoins = baseCoins + clearBonus + goldCoins + recordBonus;
        const coinMult = buff.coinBonusMult || 1;
        const skinCoinBonus = coinMult > 1 ? Math.round(rawCoins * (coinMult - 1)) : 0;
        const totalCoins = rawCoins + skinCoinBonus;
        const baseFatigueCost = buff.minigameFatigueCost != null ? buff.minigameFatigueCost : ns.MINIGAME_CONFIG.fatigueCost;
        const fatigueCost = Math.max(4, Math.round(baseFatigueCost * getLevelStaminaFactor()));
        state.coins += totalCoins;
        state.fatigue = clamp(state.fatigue + fatigueCost, 0, 100);
        updateUI();
        save(true);
        // 닉네임+이메일이 연동되어 있으면 게임 스코어와 성장 데이터를 DB에 자동 저장
        if (ns.StorageService.getLinkedProfile()) {
            ns.StorageService.quickSaveLinkedProfile(state);
        }
        ns.StorageService.recordScore({
            score,
            coinsEarned: totalCoins,
            survivedAll,
            nickname: state.nickname
        });
        return { score, baseCoins, clearBonus, goldCoins, recordBonus, skinCoinBonus, totalCoins, isNewRecord };
    }

    // 미니게임 1: 캐치 게임
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
        getCharacterId: () => state.character,
        getActiveBuff: () => getActiveBuff(),
        onStatGain: ({ happy, exp }) => {
            state.happy = clamp(state.happy + happy, 0, 100);
            addExp(exp);
        },
        onComplete: handleMinigameComplete
    });

    // 미니게임 2: 산책 점프 런
    const jumpGame = new ns.JumpRunMinigame({
        screenEl: jumpScreen,
        mangoEl: document.getElementById('jump-mango'),
        scoreEl: document.getElementById('jump-score-display'),
        timeEl: document.getElementById('jump-time-display'),
        heartsEl: document.getElementById('jump-hearts-display'),
        comboEl: document.getElementById('jump-combo-badge'),
        guideEl: document.getElementById('jump-guide'),
        resultEl: document.getElementById('jump-result'),
        resultTitleEl: document.getElementById('jump-result-title'),
        resultDetailsEl: document.getElementById('jump-result-details'),
        getCharacterId: () => state.character,
        getActiveBuff: () => getActiveBuff(),
        onStatGain: ({ happy, exp }) => {
            state.happy = clamp(state.happy + happy, 0, 100);
            addExp(exp);
        },
        onComplete: handleMinigameComplete
    });

    const btnGoHome = document.getElementById('btn-go-home');

    function canEnterOutside() {
        if (state.isSleeping) {
            showBubble('ZZZ... SLEEPING');
            return false;
        }
        if (state.fatigue >= ns.MINIGAME_CONFIG.entryMaxFatigue) {
            showBubble('피곤해요! 잠이나 드링크!');
            return false;
        }
        return true;
    }

    function openOutsideModal() {
        if (!canEnterOutside()) return;
        closeAllModals();
        if (outsideModal) outsideModal.style.display = 'flex';
    }

    function enterCatchGame() {
        if (!canEnterOutside()) return;
        closeAllModals();
        homeScreen.style.display = 'none';
        homeBtns.style.display = 'none';
        jumpScreen.style.display = 'none';
        jumpBtns.style.display = 'none';
        gameScreen.style.display = 'flex';
        gameBtns.style.display = 'flex';
        if (btnGoHome) btnGoHome.style.display = 'inline-flex';
        isHome = false;
        minigame.reset();
    }

    function enterJumpGame() {
        if (!canEnterOutside()) return;
        closeAllModals();
        homeScreen.style.display = 'none';
        homeBtns.style.display = 'none';
        gameScreen.style.display = 'none';
        gameBtns.style.display = 'none';
        jumpScreen.style.display = 'flex';
        jumpBtns.style.display = 'flex';
        if (btnGoHome) btnGoHome.style.display = 'inline-flex';
        isHome = false;
        jumpGame.reset();
    }

    function goHome() {
        minigame.stopLoop();
        jumpGame.stopLoop();
        gameScreen.style.display = 'none';
        gameBtns.style.display = 'none';
        jumpScreen.style.display = 'none';
        jumpBtns.style.display = 'none';
        homeScreen.style.display = 'flex';
        homeBtns.style.display = 'flex';
        if (btnGoHome) btnGoHome.style.display = 'none';
        isHome = true;
        updateUI();
    }

    // 홈 화면 산책 모션
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

    // 시간 경과 스탯 변화 (기본 1.5배 완만 + 레벨이 오를수록 배고픔·피로도 더 천천히 변화)
    let decayTick = 0;
    let hungerDecayAcc = 0;
    let fatigueGainAcc = 0;
    setInterval(() => {
        if (!state.hasSelectedCharacter) return;
        decayTick += 1;
        const buff = getActiveBuff();
        const levelFactor = getLevelStaminaFactor();
        if (state.isSleeping) {
            const healAmt = Math.round(12 * (buff.sleepHealMult || 1));
            state.fatigue = clamp(state.fatigue - healAmt, 0, 100);
            state.hunger = clamp(state.hunger - 1, 0, 100);
            if (state.fatigue === 0) {
                state.isSleeping = false;
                showBubble('GOOD MORNING!');
            }
        } else if (isHome) {
            const decayMult = buff.decaySlowMult || 1;
            hungerDecayAcc += 2 * levelFactor * decayMult;
            const hungerDrop = Math.floor(hungerDecayAcc);
            if (hungerDrop >= 1) {
                hungerDecayAcc -= hungerDrop;
                state.hunger = clamp(state.hunger - hungerDrop, 0, 100);
            }

            const skipHappy = decayMult < 1 && (decayTick % 4 === 0);
            if (!skipHappy) {
                state.happy = clamp(state.happy - 2, 0, 100);
            }

            const fatigueMult = buff.fatigueGainMult || 1;
            fatigueGainAcc += 2 * levelFactor * fatigueMult;
            const fatigueUp = Math.floor(fatigueGainAcc);
            if (fatigueUp >= 1) {
                fatigueGainAcc -= fatigueUp;
                state.fatigue = clamp(state.fatigue + fatigueUp, 0, 100);
            }
        }
        updateUI();
        save();
    }, 6000);

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
            if (!state.hasSelectedCharacter) return;
            if (ns.Sound) ns.Sound.playClick();
            return fn(...args);
        };
    }

    // 이벤트 연결
    document.getElementById('btn-food').addEventListener('click', withClickSound(openFoodModal));
    document.getElementById('btn-play').addEventListener('click', withClickSound(playMango));
    document.getElementById('btn-sleep').addEventListener('click', withClickSound(toggleSleep));
    document.getElementById('btn-outside').addEventListener('click', withClickSound(openOutsideModal));
    document.getElementById('close-outside-btn').addEventListener('click', withClickSound(() => { if (outsideModal) outsideModal.style.display = 'none'; }));
    document.getElementById('pick-catch-btn').addEventListener('click', withClickSound(enterCatchGame));
    document.getElementById('pick-jump-btn').addEventListener('click', withClickSound(enterJumpGame));

    document.getElementById('char-btn').addEventListener('click', withClickSound(openCharModal));
    document.getElementById('dex-btn').addEventListener('click', withClickSound(openDexModal));
    document.getElementById('rank-btn').addEventListener('click', withClickSound(openRankModal));
    if (saveBtn) saveBtn.addEventListener('click', withClickSound(() => openSaveModal('save')));
    document.getElementById('coin-shop-btn').addEventListener('click', withClickSound(openShopModal));
    document.getElementById('close-food-btn').addEventListener('click', withClickSound(() => { foodModal.style.display = 'none'; }));
    document.getElementById('close-shop-btn').addEventListener('click', withClickSound(() => { shopModal.style.display = 'none'; }));
    document.getElementById('close-char-btn').addEventListener('click', withClickSound(() => { charModal.style.display = 'none'; }));
    document.getElementById('close-dex-btn').addEventListener('click', withClickSound(() => { dexModal.style.display = 'none'; }));
    document.getElementById('close-rank-btn').addEventListener('click', withClickSound(() => { rankModal.style.display = 'none'; }));
    const closeSaveBtn = document.getElementById('close-save-btn');
    if (closeSaveBtn) {
        closeSaveBtn.addEventListener('click', () => {
            if (ns.Sound) ns.Sound.playClick();
            if (saveModal) saveModal.style.display = 'none';
            if (!state.hasSelectedCharacter) openOnboardingModal();
        });
    }

    const onboardingLoadBtn = document.getElementById('onboarding-load-btn');
    if (onboardingLoadBtn) {
        onboardingLoadBtn.addEventListener('click', () => {
            if (ns.Sound) ns.Sound.playClick();
            closeOnboardingModal();
            openSaveModal('load');
        });
    }

    document.querySelectorAll('.save-tab').forEach((tab) => {
        tab.addEventListener('click', () => {
            if (ns.Sound) ns.Sound.playClick();
            setSaveMode(tab.dataset.mode);
        });
    });

    const quickSaveBtn = document.getElementById('quick-save-btn');
    if (quickSaveBtn) {
        quickSaveBtn.addEventListener('click', async () => {
            if (ns.Sound) ns.Sound.playClick();
            saveMsg.classList.remove('ok');
            saveMsg.textContent = '클라우드에 저장 중...';
            quickSaveBtn.disabled = true;
            const res = await ns.StorageService.quickSaveLinkedProfile(state);
            quickSaveBtn.disabled = false;
            if (!res.ok) {
                saveMsg.textContent = res.error;
                return;
            }
            state = res.state;
            updateUI();
            updateSaveBtnUI();
            setSaveMode('save');
            saveMsg.classList.add('ok');
            saveMsg.textContent = `${res.nickname}님 데이터가 최신 상태로 저장됐어요!`;
            if (ns.Sound) ns.Sound.playLevelUp();
            showBubble('클라우드 저장 완료! 💾');
        });
    }

    const unlinkSaveBtn = document.getElementById('unlink-save-btn');
    if (unlinkSaveBtn) {
        unlinkSaveBtn.addEventListener('click', () => {
            if (ns.Sound) ns.Sound.playClick();
            ns.StorageService.clearLinkedProfile();
            updateSaveBtnUI();
            setSaveMode('save');
            saveMsg.textContent = '다른 닉네임과 이메일로 새로 저장할 수 있어요.';
        });
    }

    if (saveForm) {
        saveForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            saveMsg.classList.remove('ok');
            saveMsg.textContent = saveMode === 'save' ? '저장 중...' : '불러오는 중...';
            saveSubmitBtn.disabled = true;

            const nickVal = saveNicknameInput.value;
            const emailVal = saveEmailInput.value;
            const res = saveMode === 'save'
                ? await ns.StorageService.saveByNickname(nickVal, emailVal, state)
                : await ns.StorageService.loadByNickname(nickVal, emailVal);

            saveSubmitBtn.disabled = false;
            if (!res.ok) {
                saveMsg.textContent = res.error;
                return;
            }

            state = res.state;
            saveEmailInput.value = '';
            closeOnboardingModal();
            updateUI();
            updateSaveBtnUI();
            if (ns.Sound) ns.Sound.playLevelUp();
            if (saveMode === 'save') {
                setSaveMode('save');
                saveMsg.classList.add('ok');
                saveMsg.textContent = `${res.nickname}님 데이터 저장 완료! 다른 기기에서도 불러올 수 있어요.`;
                showBubble(`${res.nickname} 저장 완료! 💾`);
            } else {
                closeAllModals();
                showBubble(`${res.nickname} 데이터 불러오기 완료! 🐾`);
            }
        });
    }
    document.getElementById('rebirth-btn').addEventListener('click', withClickSound(rebirthMango));
    const rankGoSaveBtn = document.getElementById('rank-go-save-btn');
    if (rankGoSaveBtn) {
        rankGoSaveBtn.addEventListener('click', withClickSound(() => {
            openSaveModal('save');
        }));
    }

    document.querySelectorAll('.shop-tab').forEach((tab) => {
        tab.addEventListener('click', withClickSound(() => {
            document.querySelectorAll('.shop-tab').forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');
            activeShopTab = tab.dataset.tab;
            renderShopList();
        }));
    });

    document.getElementById('btn-toggle-game').addEventListener('click', withClickSound(() => minigame.toggle()));
    document.getElementById('btn-go-home').addEventListener('click', withClickSound(goHome));
    document.getElementById('result-replay-btn').addEventListener('click', withClickSound(() => {
        if (state.fatigue >= ns.MINIGAME_CONFIG.entryMaxFatigue) {
            goHome();
            showBubble('피곤해요! 휴식 필요!');
            return;
        }
        minigame.reset();
        minigame.start();
    }));
    document.getElementById('result-home-btn').addEventListener('click', withClickSound(goHome));

    const btnJump = document.getElementById('btn-jump');
    if (btnJump) {
        btnJump.addEventListener('touchstart', (e) => { e.preventDefault(); jumpGame.jump(); }, { passive: false });
        btnJump.addEventListener('mousedown', () => jumpGame.jump());
    }
    if (jumpScreen) {
        jumpScreen.addEventListener('touchstart', (e) => {
            if (e.target.closest('.screen-modal')) return;
            e.preventDefault();
            jumpGame.jump();
        }, { passive: false });
        jumpScreen.addEventListener('mousedown', (e) => {
            if (e.target.closest('.screen-modal')) return;
            jumpGame.jump();
        });
    }
    document.getElementById('btn-toggle-jump').addEventListener('click', withClickSound(() => jumpGame.toggle()));
    document.getElementById('jump-replay-btn').addEventListener('click', withClickSound(() => {
        if (state.fatigue >= ns.MINIGAME_CONFIG.entryMaxFatigue) {
            goHome();
            showBubble('피곤해요! 휴식 필요!');
            return;
        }
        jumpGame.reset();
        jumpGame.start();
    }));
    document.getElementById('jump-home-btn').addEventListener('click', withClickSound(goHome));

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
        if ((e.key === ' ' || e.key === 'ArrowUp') && jumpScreen && jumpScreen.style.display === 'flex') {
            e.preventDefault();
            jumpGame.jump();
        }
    });
    window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') minigame.moveLeft = false;
        if (e.key === 'ArrowRight') minigame.moveRight = false;
    });

    updateUI();
    updateSaveBtnUI();
    if (!state.hasSelectedCharacter) {
        openOnboardingModal();
    }

    // Supabase 설정 시 비동기로 클라우드 상태 동기화
    ns.StorageService.initCloud(state).then(({ connected, state: syncedState }) => {
        if (connected && syncedState) {
            state = syncedState;
            if (state.hasSelectedCharacter) {
                closeOnboardingModal();
            }
            updateUI();
        }
    });
})(window.MangoGame);
