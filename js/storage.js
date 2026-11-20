window.MangoGame = window.MangoGame || {};

(function (ns) {
    const STORAGE_KEY = 'grow_up_mango_state_v2';
    let supabaseClient = null;
    let currentUserId = null;
    let syncTimer = null;

    function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }

    function normalizeState(rawState) {
        const base = JSON.parse(JSON.stringify(ns.DEFAULT_STATE));
        const parsed = rawState || {};
        const unlocked = Array.isArray(parsed.unlockedDex)
            ? Array.from(new Set(['baby', ...parsed.unlockedDex]))
            : ['baby'];

        return {
            ...base,
            ...parsed,
            character: parsed.character === 'tori' ? 'tori' : 'mango',
            nickname: parsed.nickname || '망고집사',
            careStats: { ...base.careStats, ...(parsed.careStats || {}) },
            unlockedDex: unlocked,
            inventory: { ...base.inventory, ...(parsed.inventory || {}) }
        };
    }

    function toDbRow(state, userId) {
        return {
            user_id: userId,
            nickname: state.nickname || '망고집사',
            level: state.level,
            exp: state.exp,
            hunger: Math.round(state.hunger),
            happy: Math.round(state.happy),
            fatigue: Math.round(state.fatigue),
            coins: Math.round(state.coins),
            high_score: Math.round(state.highScore || 0),
            is_sleeping: Boolean(state.isSleeping),
            equipped_accessory: state.equippedAccessory || null,
            equipped_theme: state.equippedTheme || 'theme-default',
            care_stats: {
                feed: (state.careStats && state.careStats.feed) || 0,
                play: (state.careStats && state.careStats.play) || 0,
                sleep: (state.careStats && state.careStats.sleep) || 0,
                character: state.character || 'mango'
            },
            adult_form: state.adultForm || null,
            unlocked_dex: state.unlockedDex || ['baby'],
            inventory: state.inventory || {},
            last_active_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }

    function fromDbRow(row) {
        const cs = row.care_stats || {};
        return normalizeState({
            character: cs.character || 'mango',
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
            inventory: row.inventory,
            lastActiveAt: row.last_active_at ? new Date(row.last_active_at).getTime() : Date.now()
        });
    }

    function saveLocal(state) {
        try {
            const payload = {
                ...state,
                lastActiveAt: Date.now()
            };
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

    ns.StorageService = {
        isCloudEnabled() {
            return Boolean(supabaseClient && currentUserId);
        },

        getUserId() {
            return currentUserId;
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
            const last = state.lastActiveAt || now;
            const elapsedSec = Math.floor((now - last) / 1000);
            const cappedMinutes = Math.min(720, Math.floor(elapsedSec / 60));
            if (cappedMinutes >= 1) {
                if (state.isSleeping) {
                    state.fatigue = clamp(state.fatigue - cappedMinutes * 2, 0, 100);
                    state.hunger = clamp(state.hunger - Math.floor(cappedMinutes * 0.5), 0, 100);
                    if (state.fatigue === 0) state.isSleeping = false;
                } else {
                    state.hunger = clamp(state.hunger - cappedMinutes, 0, 100);
                    state.happy = clamp(state.happy - Math.floor(cappedMinutes * 0.8), 0, 100);
                    state.fatigue = clamp(state.fatigue + Math.floor(cappedMinutes * 0.5), 0, 100);
                }
            }
            state.lastActiveAt = now;
            return state;
        },

        // Supabase 초기화 + 익명 로그인 + 클라우드 상태 동기화
        async initCloud(localState) {
            const cfg = ns.SUPABASE_CONFIG;
            const apiKey = cfg && (cfg.publishableKey || cfg.anonKey);
            if (!cfg || !cfg.url || !apiKey || !window.supabase) {
                return { connected: false, state: localState };
            }

            try {
                supabaseClient = window.supabase.createClient(cfg.url, apiKey);
                const { data: sessionData } = await supabaseClient.auth.getSession();
                let session = sessionData && sessionData.session;

                if (!session) {
                    const { data: signInData, error: signInErr } = await supabaseClient.auth.signInAnonymously();
                    if (signInErr || !signInData.session) {
                        return { connected: false, state: localState };
                    }
                    session = signInData.session;
                }

                currentUserId = session.user.id;

                const { data: row, error: fetchErr } = await supabaseClient
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

                // 최초 접속 시 현재 로컬 상태를 클라우드에 등록
                await pushToCloud(localState);
                return { connected: true, state: localState };
            } catch (e) {
                return { connected: false, state: localState };
            }
        },

        // 4초 주기 저장 등 잦은 호출은 디바운스로 클라우드 쓰기 최소화
        saveState(state) {
            saveLocal(state);
            if (!this.isCloudEnabled()) return;
            clearTimeout(syncTimer);
            syncTimer = setTimeout(() => {
                pushToCloud(state);
            }, 1500);
        },

        // 구매·진화·미니게임 완료 등 중요 이벤트는 즉시 클라우드 반영
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

        async fetchLeaderboard(limit = 10, localState = null) {
            if (!this.isCloudEnabled()) {
                return {
                    source: 'local',
                    rows: localState
                        ? [{
                            user_id: 'local',
                            nickname: localState.nickname || '망고집사',
                            best_score: localState.highScore || 0
                        }]
                        : []
                };
            }

            try {
                const { data, error } = await supabaseClient
                    .from('leaderboard_top')
                    .select('user_id, nickname, best_score, last_played_at')
                    .limit(limit);

                if (error || !Array.isArray(data)) {
                    return { source: 'error', rows: [] };
                }
                return { source: 'cloud', rows: data };
            } catch (e) {
                return { source: 'error', rows: [] };
            }
        }
    };
})(window.MangoGame);
