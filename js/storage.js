window.MangoGame = window.MangoGame || {};

(function (ns) {
    const STORAGE_KEY = 'grow_up_mango_state_v2';
    const PROFILE_KEY = 'grow_up_mango_save_profile_v1';
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const VALID_CHARS = ['tori', 'yulmu', 'mango', 'mimi'];

    let supabaseClient = null;
    let currentUserId = null;
    let syncTimer = null;

    function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }

    function ensureClient() {
        if (supabaseClient) return supabaseClient;
        const cfg = ns.SUPABASE_CONFIG;
        const apiKey = cfg && (cfg.publishableKey || cfg.anonKey);
        if (!cfg || !cfg.url || !apiKey || !window.supabase) {
            return null;
        }
        supabaseClient = window.supabase.createClient(cfg.url, apiKey);
        return supabaseClient;
    }

    // 이메일 원문을 DB에 저장하지 않고 SHA-256 해시로 변환 (로컬 HTTP 환경용 폴백 포함)
    async function hashPasskey(rawEmail) {
        const normalized = `mango_save_v1:${(rawEmail || '').trim().toLowerCase()}`;
        if (window.crypto && window.crypto.subtle && window.TextEncoder) {
            const data = new TextEncoder().encode(normalized);
            const buf = await window.crypto.subtle.digest('SHA-256', data);
            return Array.from(new Uint8Array(buf))
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('');
        }
        let h1 = 0xdeadbeef;
        let h2 = 0x41c6ce57;
        for (let i = 0; i < normalized.length; i++) {
            const ch = normalized.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
        const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
        return `fb_${part1}${part2}${part1}${part2}`;
    }

    function loadSavedProfile() {
        try {
            const raw = localStorage.getItem(PROFILE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || !parsed.nickname || !parsed.passkeyHash) return null;
            return parsed;
        } catch (e) {
            return null;
        }
    }

    function saveLinkedProfile(profile) {
        try {
            if (!profile) {
                localStorage.removeItem(PROFILE_KEY);
                return;
            }
            localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        } catch (e) {
            // ignore storage errors
        }
    }

    function createDefaultPet(nowTs) {
        const basePet = ns.DEFAULT_PET_STATE || {
            level: 1,
            exp: 0,
            hunger: 70,
            happy: 70,
            fatigue: 20,
            isSleeping: false,
            equippedAccessory: null,
            careStats: { feed: 0, play: 0, sleep: 0 },
            adultForm: null,
            unlockedDex: ['baby']
        };
        return {
            level: basePet.level,
            exp: basePet.exp,
            hunger: basePet.hunger,
            happy: basePet.happy,
            fatigue: basePet.fatigue,
            isSleeping: Boolean(basePet.isSleeping),
            equippedAccessory: basePet.equippedAccessory || null,
            careStats: {
                feed: (basePet.careStats && basePet.careStats.feed) || 0,
                play: (basePet.careStats && basePet.careStats.play) || 0,
                sleep: (basePet.careStats && basePet.careStats.sleep) || 0
            },
            adultForm: basePet.adultForm || null,
            unlockedDex: Array.isArray(basePet.unlockedDex) ? [...basePet.unlockedDex] : ['baby'],
            lastActiveAt: nowTs || Date.now()
        };
    }

    function normalizePet(rawPet, fallbackNow) {
        const def = createDefaultPet(fallbackNow);
        if (!rawPet || typeof rawPet !== 'object') return def;
        const unlocked = Array.isArray(rawPet.unlockedDex)
            ? Array.from(new Set(['baby', ...rawPet.unlockedDex]))
            : ['baby'];
        const cs = rawPet.careStats || {};
        return {
            level: Math.max(1, Math.round(Number(rawPet.level) || 1)),
            exp: Math.max(0, Math.round(Number(rawPet.exp) || 0)),
            hunger: clamp(Number.isFinite(Number(rawPet.hunger)) ? Number(rawPet.hunger) : def.hunger, 0, 100),
            happy: clamp(Number.isFinite(Number(rawPet.happy)) ? Number(rawPet.happy) : def.happy, 0, 100),
            fatigue: clamp(Number.isFinite(Number(rawPet.fatigue)) ? Number(rawPet.fatigue) : def.fatigue, 0, 100),
            isSleeping: Boolean(rawPet.isSleeping),
            equippedAccessory: rawPet.equippedAccessory || null,
            careStats: {
                feed: Math.max(0, Math.round(Number(cs.feed) || 0)),
                play: Math.max(0, Math.round(Number(cs.play) || 0)),
                sleep: Math.max(0, Math.round(Number(cs.sleep) || 0))
            },
            adultForm: rawPet.adultForm || null,
            unlockedDex: unlocked,
            lastActiveAt: rawPet.lastActiveAt || fallbackNow || Date.now()
        };
    }

    function extractRootAsPet(state, nowTs) {
        return normalizePet({
            level: state.level,
            exp: state.exp,
            hunger: state.hunger,
            happy: state.happy,
            fatigue: state.fatigue,
            isSleeping: state.isSleeping,
            equippedAccessory: state.equippedAccessory,
            careStats: state.careStats,
            adultForm: state.adultForm,
            unlockedDex: state.unlockedDex,
            lastActiveAt: state.lastActiveAt || nowTs
        }, nowTs);
    }

    function applyPetToRoot(state, pet) {
        state.level = pet.level;
        state.exp = pet.exp;
        state.hunger = pet.hunger;
        state.happy = pet.happy;
        state.fatigue = pet.fatigue;
        state.isSleeping = pet.isSleeping;
        state.equippedAccessory = pet.equippedAccessory;
        state.careStats = {
            feed: pet.careStats.feed,
            play: pet.careStats.play,
            sleep: pet.careStats.sleep
        };
        state.adultForm = pet.adultForm;
        state.unlockedDex = [...pet.unlockedDex];
        state.lastActiveAt = pet.lastActiveAt;
    }

    function syncRootIntoPets(state) {
        const now = Date.now();
        const charId = VALID_CHARS.includes(state.character) ? state.character : 'mango';
        if (!state.pets || typeof state.pets !== 'object') {
            state.pets = {};
        }
        VALID_CHARS.forEach((id) => {
            if (!state.pets[id]) {
                state.pets[id] = createDefaultPet(now);
            }
        });
        state.pets[charId] = extractRootAsPet({ ...state, lastActiveAt: now }, now);
        return state;
    }

    function applyElapsedToPet(pet, now) {
        const last = pet.lastActiveAt || now;
        const elapsedSec = Math.floor((now - last) / 1000);
        const cappedMinutes = Math.min(720, Math.floor(elapsedSec / 60));
        if (cappedMinutes >= 1) {
            const levelFactor = Math.max(0.45, 1 - Math.max(0, (pet.level || 1) - 1) * 0.02);
            if (pet.isSleeping) {
                pet.fatigue = clamp(pet.fatigue - cappedMinutes * 2, 0, 100);
                pet.hunger = clamp(pet.hunger - Math.floor(cappedMinutes * 0.4 * levelFactor), 0, 100);
                if (pet.fatigue === 0) pet.isSleeping = false;
            } else {
                pet.hunger = clamp(pet.hunger - Math.floor(cappedMinutes * 0.7 * levelFactor), 0, 100);
                pet.happy = clamp(pet.happy - Math.floor(cappedMinutes * 0.6), 0, 100);
                pet.fatigue = clamp(pet.fatigue + Math.floor(cappedMinutes * 0.4 * levelFactor), 0, 100);
            }
        }
        pet.lastActiveAt = now;
        return pet;
    }

    function normalizeState(rawState) {
        const now = Date.now();
        const base = JSON.parse(JSON.stringify(ns.DEFAULT_STATE));
        const hasRaw = Boolean(rawState && typeof rawState === 'object');
        const parsed = hasRaw ? rawState : {};
        const hasSelectedCharacter = hasRaw
            ? (typeof parsed.hasSelectedCharacter === 'boolean' ? parsed.hasSelectedCharacter : true)
            : false;

        const charId = VALID_CHARS.includes(parsed.character) ? parsed.character : 'mango';
        const rawPets = parsed.pets && typeof parsed.pets === 'object' ? parsed.pets : null;

        const pets = {};
        VALID_CHARS.forEach((id) => {
            if (rawPets && rawPets[id]) {
                pets[id] = normalizePet(rawPets[id], now);
            } else if (!rawPets && hasRaw && id === charId) {
                // 기존 단일 성장 데이터를 현재 선택된 강아지 슬롯으로 자동 마이그레이션
                pets[id] = extractRootAsPet(parsed, parsed.lastActiveAt || now);
            } else {
                pets[id] = createDefaultPet(now);
            }
        });

        const merged = {
            ...base,
            ...parsed,
            character: charId,
            hasSelectedCharacter,
            nickname: parsed.nickname || '망고집사',
            coins: Math.max(0, Math.round(Number.isFinite(Number(parsed.coins)) ? Number(parsed.coins) : base.coins)),
            highScore: Math.max(0, Math.round(Number(parsed.highScore) || 0)),
            equippedTheme: parsed.equippedTheme || 'theme-default',
            inventory: { ...base.inventory, ...(parsed.inventory || {}) },
            pets
        };

        applyPetToRoot(merged, pets[charId]);
        return merged;
    }

    function toDbRow(state, userId) {
        const synced = syncRootIntoPets({ ...state });
        return {
            user_id: userId,
            nickname: synced.nickname || '망고집사',
            level: synced.level,
            exp: synced.exp,
            hunger: Math.round(synced.hunger),
            happy: Math.round(synced.happy),
            fatigue: Math.round(synced.fatigue),
            coins: Math.round(synced.coins),
            high_score: Math.round(synced.highScore || 0),
            is_sleeping: Boolean(synced.isSleeping),
            equipped_accessory: synced.equippedAccessory || null,
            equipped_theme: synced.equippedTheme || 'theme-default',
            care_stats: {
                feed: (synced.careStats && synced.careStats.feed) || 0,
                play: (synced.careStats && synced.careStats.play) || 0,
                sleep: (synced.careStats && synced.careStats.sleep) || 0,
                character: synced.character || 'mango',
                hasSelectedCharacter: Boolean(synced.hasSelectedCharacter),
                pets: synced.pets
            },
            adult_form: synced.adultForm || null,
            unlocked_dex: synced.unlockedDex || ['baby'],
            inventory: synced.inventory || {},
            last_active_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }

    function fromDbRow(row) {
        const cs = row.care_stats || {};
        return normalizeState({
            character: cs.character || 'mango',
            hasSelectedCharacter: typeof cs.hasSelectedCharacter === 'boolean' ? cs.hasSelectedCharacter : true,
            nickname: row.nickname,
            level: row.level,
            exp: row.exp,
            hunger: row.hunger,
            happy: row.happy,
            fatigue: row.fatigue,
            coins: row.coins,
            highScore: row.high_score,
            isSleeping: row.is_sleeping,
            equippedAccessory: row.equipped_accessory,
            equippedTheme: row.equipped_theme,
            careStats: { feed: cs.feed || 0, play: cs.play || 0, sleep: cs.sleep || 0 },
            adultForm: row.adult_form,
            unlockedDex: row.unlocked_dex,
            pets: cs.pets || null,
            inventory: row.inventory,
            lastActiveAt: row.last_active_at ? new Date(row.last_active_at).getTime() : Date.now()
        });
    }

    function saveLocal(state) {
        try {
            const payload = syncRootIntoPets({
                ...state,
                lastActiveAt: Date.now()
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {
            // ignore quota errors
        }
    }

    async function pushToCloud(state) {
        if (!supabaseClient || !currentUserId) return;
        try {
            await supabaseClient
                .from('mango_states')
                .upsert(toDbRow(state, currentUserId), { onConflict: 'user_id' });
        } catch (e) {
            // 오프라인 또는 네트워크 오류 시 로컬 저장으로 계속 동작
        }
    }

    function mapRpcError(error, code) {
        if (error) {
            const msg = (error.message || '').toLowerCase();
            if (msg.includes('could not find the function') || msg.includes('does not exist')) {
                return 'Supabase SQL Editor에서 최신 schema.sql을 먼저 실행해 주세요.';
            }
            return '클라우드 연결에 실패했어요. 잠시 후 다시 시도해 주세요.';
        }
        if (code === 'INVALID_NICKNAME') return '닉네임은 2~12자로 입력해 주세요.';
        if (code === 'INVALID_PASSKEY') return '이메일 형식을 다시 확인해 주세요.';
        if (code === 'NICKNAME_TAKEN') return '이미 사용 중인 닉네임이에요. 본인 계정이라면 이메일을 확인해 주세요.';
        if (code === 'NOT_FOUND') return '해당 닉네임으로 저장된 데이터가 없어요.';
        if (code === 'WRONG_PASSKEY') return '닉네임과 이메일이 일치하지 않아요.';
        return '처리에 실패했어요. 잠시 후 다시 시도해 주세요.';
    }

    ns.StorageService = {
        isCloudConfigured() {
            return Boolean(ensureClient());
        },

        isCloudEnabled() {
            return Boolean(supabaseClient && currentUserId);
        },

        getUserId() {
            return currentUserId;
        },

        getLinkedProfile() {
            return loadSavedProfile();
        },

        clearLinkedProfile() {
            saveLinkedProfile(null);
        },

        // 현재 강아지 데이터를 보존하고 다른 강아지 슬롯으로 전환
        switchCharacter(state, nextCharId) {
            if (!VALID_CHARS.includes(nextCharId)) return state;
            const now = Date.now();
            syncRootIntoPets(state);
            state.character = nextCharId;
            state.hasSelectedCharacter = true;
            const targetPet = normalizePet(state.pets[nextCharId], now);
            applyElapsedToPet(targetPet, now);
            state.pets[nextCharId] = targetPet;
            applyPetToRoot(state, targetPet);
            return state;
        },

        // 현재 강아지의 최신 상태를 pets 슬롯에 동기화해 반환 (모달 요약용)
        getPetsSnapshot(state) {
            syncRootIntoPets(state);
            return state.pets;
        },

        loadState() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) return normalizeState(null);
                return this.applyOfflineElapsed(normalizeState(JSON.parse(raw)));
            } catch (e) {
                return normalizeState(null);
            }
        },

        applyOfflineElapsed(state) {
            const now = Date.now();
            syncRootIntoPets(state);
            const activeId = state.character;
            const activePet = applyElapsedToPet(state.pets[activeId], now);
            state.pets[activeId] = activePet;
            applyPetToRoot(state, activePet);
            return state;
        },

        // 닉네임 + 이메일(해시)로 지금까지 키운 데이터를 Supabase에 저장
        async saveByNickname(rawNickname, rawEmail, currentState) {
            const client = ensureClient();
            if (!client) {
                return { ok: false, error: 'Supabase 설정(js/supabase-config.js)이 필요합니다.' };
            }

            const nickname = (rawNickname || '').trim();
            const email = (rawEmail || '').trim();
            if (nickname.length < 2 || nickname.length > 12) {
                return { ok: false, error: '닉네임은 2~12자로 입력해 주세요.' };
            }
            if (!EMAIL_REGEX.test(email)) {
                return { ok: false, error: '올바른 이메일 형식을 입력해 주세요.' };
            }

            try {
                const passkeyHash = await hashPasskey(email);
                const synced = syncRootIntoPets({ ...currentState, nickname, lastActiveAt: Date.now() });
                const payload = normalizeState(synced);

                const { data, error } = await client.rpc('save_mango_by_nickname', {
                    p_nickname: nickname,
                    p_passkey_hash: passkeyHash,
                    p_game_state: payload
                });

                if (error || !data || !data.ok) {
                    return { ok: false, error: mapRpcError(error, data && data.code) };
                }

                saveLocal(payload);
                saveLinkedProfile({
                    nickname: data.nickname || nickname,
                    passkeyHash,
                    savedAt: data.updated_at || new Date().toISOString()
                });
                if (this.isCloudEnabled()) {
                    pushToCloud(payload);
                }

                return {
                    ok: true,
                    mode: data.mode,
                    nickname: data.nickname || nickname,
                    savedAt: data.updated_at || new Date().toISOString(),
                    state: payload
                };
            } catch (e) {
                return { ok: false, error: '저장 중 오류가 발생했어요.' };
            }
        },

        // 이 기기에 기억된 닉네임 프로필로 이메일 재입력 없이 바로 저장
        async quickSaveLinkedProfile(currentState) {
            const client = ensureClient();
            const profile = loadSavedProfile();
            if (!client || !profile) {
                return { ok: false, error: '먼저 닉네임과 이메일로 저장해 주세요.' };
            }

            try {
                const synced = syncRootIntoPets({ ...currentState, nickname: profile.nickname, lastActiveAt: Date.now() });
                const payload = normalizeState(synced);

                const { data, error } = await client.rpc('save_mango_by_nickname', {
                    p_nickname: profile.nickname,
                    p_passkey_hash: profile.passkeyHash,
                    p_game_state: payload
                });

                if (error || !data || !data.ok) {
                    return { ok: false, error: mapRpcError(error, data && data.code) };
                }

                saveLocal(payload);
                saveLinkedProfile({
                    ...profile,
                    savedAt: data.updated_at || new Date().toISOString()
                });
                if (this.isCloudEnabled()) {
                    pushToCloud(payload);
                }

                return {
                    ok: true,
                    nickname: profile.nickname,
                    savedAt: data.updated_at || new Date().toISOString(),
                    state: payload
                };
            } catch (e) {
                return { ok: false, error: '빠른 저장 중 오류가 발생했어요.' };
            }
        },

        // 닉네임 + 이메일(해시)로 클라우드 데이터 불러오기
        async loadByNickname(rawNickname, rawEmail) {
            const client = ensureClient();
            if (!client) {
                return { ok: false, error: 'Supabase 설정(js/supabase-config.js)이 필요합니다.' };
            }

            const nickname = (rawNickname || '').trim();
            const email = (rawEmail || '').trim();
            if (nickname.length < 2 || nickname.length > 12) {
                return { ok: false, error: '닉네임은 2~12자로 입력해 주세요.' };
            }
            if (!EMAIL_REGEX.test(email)) {
                return { ok: false, error: '올바른 이메일 형식을 입력해 주세요.' };
            }

            try {
                const passkeyHash = await hashPasskey(email);
                const { data, error } = await client.rpc('load_mango_by_nickname', {
                    p_nickname: nickname,
                    p_passkey_hash: passkeyHash
                });

                if (error || !data || !data.ok || !data.game_state) {
                    return { ok: false, error: mapRpcError(error, data && data.code) };
                }

                const loadedState = this.applyOfflineElapsed(normalizeState({
                    ...data.game_state,
                    nickname: data.nickname || nickname,
                    hasSelectedCharacter: true
                }));

                saveLocal(loadedState);
                saveLinkedProfile({
                    nickname: data.nickname || nickname,
                    passkeyHash,
                    savedAt: data.updated_at || new Date().toISOString()
                });
                if (this.isCloudEnabled()) {
                    pushToCloud(loadedState);
                }

                return {
                    ok: true,
                    nickname: data.nickname || nickname,
                    savedAt: data.updated_at,
                    state: loadedState
                };
            } catch (e) {
                return { ok: false, error: '불러오는 중 오류가 발생했어요.' };
            }
        },

        // Supabase 초기화 + 익명 로그인 + 클라우드 상태 동기화
        async initCloud(localState) {
            const client = ensureClient();
            if (!client) {
                return { connected: false, state: localState };
            }

            try {
                const { data: sessionData } = await client.auth.getSession();
                let session = sessionData && sessionData.session;

                if (!session) {
                    const { data: signInData, error: signInErr } = await client.auth.signInAnonymously();
                    if (signInErr || !signInData.session) {
                        return { connected: false, state: localState };
                    }
                    session = signInData.session;
                }

                currentUserId = session.user.id;

                const { data: row, error: fetchErr } = await client
                    .from('mango_states')
                    .select('*')
                    .eq('user_id', currentUserId)
                    .maybeSingle();

                if (fetchErr) {
                    return { connected: false, state: localState };
                }

                if (row) {
                    const cloudState = this.applyOfflineElapsed(fromDbRow(row));
                    saveLocal(cloudState);
                    return { connected: true, state: cloudState };
                }

                if (localState && localState.hasSelectedCharacter) {
                    await pushToCloud(localState);
                }
                return { connected: true, state: localState };
            } catch (e) {
                return { connected: false, state: localState };
            }
        },

        saveState(state) {
            saveLocal(state);
            if (!this.isCloudEnabled()) return;
            clearTimeout(syncTimer);
            syncTimer = setTimeout(() => {
                pushToCloud(state);
            }, 1500);
        },

        saveStateImmediate(state) {
            saveLocal(state);
            if (!this.isCloudEnabled()) return;
            clearTimeout(syncTimer);
            pushToCloud(state);
        },

        async recordScore({ score, coinsEarned, survivedAll, nickname }) {
            if (!this.isCloudEnabled()) return false;
            try {
                const { error } = await supabaseClient
                    .from('minigame_scores')
                    .insert({
                        user_id: currentUserId,
                        nickname: nickname || '망고집사',
                        score: Math.round(score),
                        coins_earned: Math.round(coinsEarned || 0),
                        survived_all: Boolean(survivedAll)
                    });
                return !error;
            } catch (e) {
                return false;
            }
        },

        async fetchLeaderboard(limit = 20, localState = null) {
            const client = ensureClient();
            if (!client) {
                return {
                    source: 'local',
                    rows: localState
                        ? [{
                            nickname: localState.nickname || '망고집사',
                            best_score: localState.highScore || 0,
                            isLocalOnly: true
                        }]
                        : []
                };
            }

            try {
                const { data, error } = await client.rpc('get_nickname_leaderboard', {
                    p_limit: limit
                });

                if (error || !Array.isArray(data)) {
                    const msg = (error && error.message || '').toLowerCase();
                    if (msg.includes('could not find the function') || msg.includes('does not exist')) {
                        return { source: 'needs_sql', rows: [] };
                    }
                    return { source: 'error', rows: [] };
                }
                return { source: 'cloud', rows: data };
            } catch (e) {
                return { source: 'error', rows: [] };
            }
        }
    };
})(window.MangoGame);
