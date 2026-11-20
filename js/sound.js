window.MangoGame = window.MangoGame || {};

(function (ns) {
    const MUTE_KEY = 'grow_up_mango_muted';
    let audioCtx = null;
    let muted = false;

    try {
        muted = localStorage.getItem(MUTE_KEY) === '1';
    } catch (e) {
        muted = false;
    }

    function getCtx() {
        if (muted) return null;
        if (!audioCtx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return null;
            audioCtx = new AudioCtx();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
        }
        return audioCtx;
    }

    function playTone(freq, duration, options = {}) {
        const ctx = getCtx();
        if (!ctx) return;

        const now = ctx.currentTime + (options.delay || 0);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = options.type || 'square';
        osc.frequency.setValueAtTime(freq, now);
        if (options.endFreq) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(20, options.endFreq), now + duration);
        }

        const vol = options.volume ?? 0.08;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.01);
    }

    function playNoise(duration, volume = 0.09) {
        const ctx = getCtx();
        if (!ctx) return;

        const sampleRate = ctx.sampleRate;
        const length = Math.floor(sampleRate * duration);
        const buffer = ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + duration);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        source.start();
    }

    ns.Sound = {
        isMuted() {
            return muted;
        },

        toggleMute() {
            muted = !muted;
            try {
                localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
            } catch (e) {
                // ignore storage errors
            }
            if (!muted) {
                this.playClick();
            }
            return muted;
        },

        playClick() {
            playTone(660, 0.055, { type: 'square', endFreq: 880, volume: 0.06 });
        },

        playFeed() {
            playTone(440, 0.07, { type: 'square', volume: 0.07, delay: 0 });
            playTone(587.33, 0.09, { type: 'square', volume: 0.07, delay: 0.07 });
        },

        playBuy() {
            playTone(987.77, 0.07, { type: 'square', volume: 0.07, delay: 0 });
            playTone(1318.51, 0.14, { type: 'square', volume: 0.08, delay: 0.07 });
        },

        playCatchBall() {
            playTone(523.25, 0.06, { type: 'square', endFreq: 783.99, volume: 0.07 });
        },

        playCatchBone() {
            playTone(587.33, 0.06, { type: 'square', volume: 0.07, delay: 0 });
            playTone(880, 0.09, { type: 'square', volume: 0.07, delay: 0.055 });
        },

        playCatchGold() {
            playTone(880, 0.05, { type: 'square', volume: 0.07, delay: 0 });
            playTone(1174.66, 0.05, { type: 'square', volume: 0.07, delay: 0.05 });
            playTone(1567.98, 0.12, { type: 'square', volume: 0.08, delay: 0.1 });
        },

        playBomb() {
            playNoise(0.22, 0.11);
            playTone(190, 0.24, { type: 'sawtooth', endFreq: 48, volume: 0.1 });
        },

        playLevelUp() {
            const notes = [523.25, 659.25, 783.99, 1046.5];
            notes.forEach((freq, idx) => {
                playTone(freq, idx === notes.length - 1 ? 0.22 : 0.08, {
                    type: 'square',
                    volume: 0.08,
                    delay: idx * 0.08
                });
            });
        },

        playEvolution() {
            const notes = [523.25, 659.25, 783.99, 659.25, 1046.5, 1318.51];
            notes.forEach((freq, idx) => {
                playTone(freq, idx === notes.length - 1 ? 0.3 : 0.08, {
                    type: 'square',
                    volume: 0.08,
                    delay: idx * 0.08
                });
            });
        },

        playGameClear() {
            const notes = [523.25, 659.25, 783.99, 1046.5];
            notes.forEach((freq, idx) => {
                playTone(freq, idx === 3 ? 0.26 : 0.09, {
                    type: 'triangle',
                    volume: 0.12,
                    delay: idx * 0.09
                });
            });
        },

        playGameOver() {
            const notes = [392.0, 349.23, 311.13, 261.63];
            notes.forEach((freq, idx) => {
                playTone(freq, idx === 3 ? 0.28 : 0.1, {
                    type: 'square',
                    volume: 0.07,
                    delay: idx * 0.11
                });
            });
        }
    };
})(window.MangoGame);
