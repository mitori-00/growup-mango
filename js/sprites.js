window.MangoGame = window.MangoGame || {};

(function (ns) {
    // 24x24 픽셀 아트 SVG 빌더 (실제 망고·토리 사진 기반 업그레이드 버전)
    function buildMangoBody() {
        return `
            <!-- Fluffy Curled Tail -->
            <rect x="2" y="10" width="4" height="5" fill="#f2cfa5" class="fur-part"/>
            <rect x="3" y="11" width="2" height="3" fill="#fff4d9"/>
            <rect x="1" y="11" width="1" height="3" fill="#222"/>
            <rect x="2" y="9" width="4" height="1" fill="#222"/>
            <rect x="2" y="15" width="3" height="1" fill="#222"/>
            <rect x="6" y="10" width="1" height="2" fill="#222"/>
            <rect x="4" y="12" width="1" height="1" fill="#222"/>

            <!-- Back & Body (Lightly Toasted Cream-Tan) -->
            <rect x="5" y="12" width="8" height="6" fill="#f2cfa5" class="fur-part"/>
            <rect x="6" y="11" width="6" height="2" fill="#e6b98a" class="fur-dark"/>
            <rect x="6" y="10" width="5" height="1" fill="#222"/>
            <!-- White Belly -->
            <rect x="7" y="17" width="6" height="2" fill="#ffffff"/>
            <rect x="7" y="19" width="5" height="1" fill="#222"/>

            <!-- Legs (Cream-Tan + White Paws) -->
            <rect x="5" y="17" width="3" height="3" fill="#f2cfa5" class="fur-part"/>
            <rect x="5" y="20" width="3" height="1" fill="#ffffff"/>
            <rect x="4" y="16" width="1" height="5" fill="#222"/>
            <rect x="8" y="18" width="1" height="3" fill="#222"/>
            <rect x="5" y="21" width="3" height="1" fill="#222"/>

            <rect x="13" y="17" width="3" height="3" fill="#f2cfa5" class="fur-part"/>
            <rect x="13" y="20" width="3" height="1" fill="#ffffff"/>
            <rect x="12" y="18" width="1" height="3" fill="#222"/>
            <rect x="16" y="18" width="1" height="3" fill="#222"/>
            <rect x="13" y="21" width="3" height="1" fill="#222"/>

            <!-- Extra Fluffy White Cloud Neck Ruff (Mane) -->
            <rect x="10" y="12" width="8" height="6" fill="#ffffff"/>
            <rect x="11" y="17" width="6" height="2" fill="#eef2f7"/>
            <rect x="18" y="13" width="1" height="4" fill="#222"/>
            <rect x="17" y="17" width="1" height="2" fill="#222"/>
            <rect x="9" y="13" width="1" height="3" fill="#e8dcc8"/>

            <!-- Pomeranian Pointy Ears (Toasted Tan Tips + Pink Inside) -->
            <rect x="10" y="3" width="3" height="4" fill="#e6b98a" class="fur-dark"/>
            <rect x="11" y="4" width="1" height="2" fill="#ffb6c1"/>
            <rect x="9" y="3" width="1" height="4" fill="#222"/>
            <rect x="10" y="2" width="2" height="1" fill="#222"/>
            <rect x="13" y="4" width="1" height="2" fill="#222"/>

            <rect x="16" y="3" width="3" height="4" fill="#e6b98a" class="fur-dark"/>
            <rect x="17" y="4" width="1" height="2" fill="#ffb6c1"/>
            <rect x="16" y="2" width="2" height="1" fill="#222"/>
            <rect x="19" y="3" width="1" height="4" fill="#222"/>
            <rect x="15" y="4" width="1" height="2" fill="#222"/>

            <!-- Head (Pale Creamy Ivory) -->
            <rect x="10" y="6" width="10" height="7" fill="#fff4d9" class="fur-light"/>
            <rect x="11" y="5" width="8" height="2" fill="#f7e3be" class="fur-part"/>
            <rect x="13" y="5" width="3" height="1" fill="#222"/>
            <rect x="9" y="7" width="1" height="6" fill="#222"/>
            <rect x="20" y="7" width="1" height="4" fill="#222"/>
            <!-- White Muzzle -->
            <rect x="14" y="10" width="7" height="4" fill="#ffffff"/>
            <rect x="21" y="10" width="1" height="3" fill="#222"/>
            <rect x="20" y="13" width="1" height="1" fill="#222"/>

            <!-- Sparkly Dark Eyes -->
            <rect x="14" y="8" width="2" height="2" fill="#1a1a1a"/>
            <rect x="14" y="8" width="1" height="1" fill="#ffffff"/>
            <rect x="19" y="8" width="1" height="2" fill="#1a1a1a"/>

            <!-- Tiny Nose, Blush Cheek & Happy Tongue Smile -->
            <rect x="18" y="10" width="2" height="1" fill="#222"/>
            <rect x="12" y="10" width="2" height="1" fill="#ff9fb2"/>
            <rect x="16" y="11" width="3" height="1" fill="#222"/>
            <rect x="17" y="12" width="2" height="1" fill="#ff6b81"/>
        `;
    }

    function buildToriBody() {
        return `
            <!-- Feathery White Tail -->
            <rect x="2" y="10" width="4" height="5" fill="#ffffff" class="fur-part"/>
            <rect x="3" y="12" width="2" height="2" fill="#e6e8f4"/>
            <rect x="1" y="11" width="1" height="3" fill="#222"/>
            <rect x="2" y="9" width="3" height="1" fill="#222"/>
            <rect x="2" y="15" width="3" height="1" fill="#222"/>
            <rect x="5" y="10" width="1" height="2" fill="#222"/>

            <!-- Petite Fluffy White Body -->
            <rect x="5" y="12" width="11" height="6" fill="#ffffff" class="fur-part"/>
            <rect x="6" y="16" width="9" height="2" fill="#eef0f8"/>
            <rect x="6" y="11" width="5" height="1" fill="#222"/>
            <rect x="8" y="19" width="5" height="1" fill="#222"/>

            <!-- Tiny Dainty Legs -->
            <rect x="5" y="17" width="3" height="4" fill="#ffffff" class="fur-part"/>
            <rect x="4" y="15" width="1" height="6" fill="#222"/>
            <rect x="8" y="18" width="1" height="3" fill="#222"/>
            <rect x="5" y="21" width="3" height="1" fill="#222"/>

            <rect x="13" y="17" width="3" height="4" fill="#ffffff" class="fur-part"/>
            <rect x="12" y="18" width="1" height="3" fill="#222"/>
            <rect x="16" y="17" width="1" height="4" fill="#222"/>
            <rect x="13" y="21" width="3" height="1" fill="#222"/>

            <!-- Wispy Hair Tuft on Top of Head -->
            <rect x="14" y="3" width="2" height="2" fill="#ffffff"/>
            <rect x="14" y="2" width="2" height="1" fill="#222"/>
            <rect x="13" y="3" width="1" height="1" fill="#222"/>
            <rect x="16" y="3" width="1" height="1" fill="#222"/>

            <!-- Head (Pure White Fluffy Maltese) -->
            <rect x="10" y="5" width="10" height="8" fill="#ffffff" class="fur-light"/>
            <rect x="11" y="4" width="8" height="2" fill="#ffffff"/>
            <rect x="11" y="4" width="3" height="1" fill="#222"/>
            <rect x="16" y="4" width="3" height="1" fill="#222"/>
            <rect x="11" y="13" width="7" height="3" fill="#ffffff"/>
            <rect x="17" y="13" width="1" height="4" fill="#222"/>
            <rect x="20" y="9" width="1" height="4" fill="#222"/>
            <rect x="19" y="13" width="1" height="1" fill="#222"/>

            <!-- Short High-Set Wispy Flared Maltese Ears -->
            <rect x="7" y="6" width="4" height="5" fill="#ffffff"/>
            <rect x="8" y="8" width="2" height="3" fill="#e6e8f4"/>
            <rect x="7" y="5" width="4" height="1" fill="#222"/>
            <rect x="6" y="6" width="1" height="4" fill="#222"/>
            <rect x="7" y="10" width="1" height="2" fill="#222"/>
            <rect x="8" y="11" width="2" height="1" fill="#222"/>
            <rect x="10" y="8" width="1" height="3" fill="#555"/>

            <rect x="19" y="6" width="3" height="4" fill="#ffffff"/>
            <rect x="20" y="7" width="1" height="2" fill="#e6e8f4"/>
            <rect x="19" y="5" width="2" height="1" fill="#222"/>
            <rect x="22" y="6" width="1" height="3" fill="#222"/>
            <rect x="21" y="9" width="1" height="1" fill="#222"/>

            <!-- Big Soulful Sparkly Dark Eyes -->
            <rect x="14" y="8" width="2" height="2" fill="#1a1a1a"/>
            <rect x="14" y="8" width="1" height="1" fill="#ffffff"/>
            <rect x="18" y="8" width="2" height="2" fill="#1a1a1a"/>
            <rect x="18" y="8" width="1" height="1" fill="#ffffff"/>

            <!-- Tiny Button Nose, Rosy Blush & Gentle Closed Smile -->
            <rect x="17" y="10" width="2" height="1" fill="#222"/>
            <rect x="12" y="10" width="2" height="1" fill="#ff9fb2"/>
            <rect x="16" y="11" width="3" height="1" fill="#222"/>
        `;
    }

    function buildOverlays(withBasket) {
        const basket = withBasket ? `
            <!-- Minigame Basket on Head -->
            <rect x="11" y="-1" width="8" height="3" fill="#8b4513"/>
            <rect x="10" y="-1" width="1" height="3" fill="#222"/>
            <rect x="19" y="-1" width="1" height="3" fill="#222"/>
            <rect x="11" y="-2" width="8" height="1" fill="#222"/>
            <rect x="12" y="0" width="6" height="1" fill="#a0522d"/>
        ` : '';

        return `
            ${basket}

            <!-- Evolution Layer: Foodie (빨간 턱받이 + 빵빵한 볼) -->
            <g class="evo-layer evo-adult_foodie" style="display:none;">
                <rect x="13" y="13" width="5" height="3" fill="#ff4757"/>
                <rect x="14" y="16" width="3" height="1" fill="#ff6b81"/>
                <rect x="12" y="10" width="2" height="2" fill="#ff85a2"/>
            </g>
            <!-- Evolution Layer: Sporty (스포츠 머리띠) -->
            <g class="evo-layer evo-adult_sporty" style="display:none;">
                <rect x="10" y="5" width="10" height="2" fill="#ff4757"/>
                <rect x="14" y="5" width="2" height="2" fill="#ffffff"/>
                <rect x="8" y="6" width="2" height="1" fill="#ff4757"/>
            </g>
            <!-- Evolution Layer: Sleepy (수면 모자 + 졸린 눈) -->
            <g class="evo-layer evo-adult_sleepy" style="display:none;">
                <rect x="11" y="1" width="8" height="3" fill="#74b9ff"/>
                <rect x="9" y="2" width="3" height="2" fill="#74b9ff"/>
                <rect x="8" y="3" width="2" height="2" fill="#ffffff"/>
                <rect x="14" y="9" width="2" height="1" fill="#222"/>
            </g>
            <!-- Evolution Layer: Balanced (황금 별빛 오라) -->
            <g class="evo-layer evo-adult_balanced" style="display:none;">
                <rect x="15" y="-2" width="1" height="3" fill="#ffd32a"/>
                <rect x="14" y="-1" width="3" height="1" fill="#ffd32a"/>
                <rect x="4" y="6" width="1" height="1" fill="#ffeaa7"/>
                <rect x="21" y="4" width="1" height="1" fill="#ffeaa7"/>
            </g>

            <!-- Accessory: Ribbon -->
            <g class="acc-layer acc-ribbon" style="display:none;">
                <rect x="8" y="2" width="2" height="3" fill="#ff4757"/>
                <rect x="10" y="3" width="1" height="1" fill="#ff6b81"/>
                <rect x="11" y="2" width="2" height="3" fill="#ff4757"/>
            </g>
            <!-- Accessory: Sunglasses -->
            <g class="acc-layer acc-sunglasses" style="display:none;">
                <rect x="13" y="8" width="8" height="2" fill="#111111"/>
                <rect x="14" y="8" width="1" height="1" fill="#70a1ff"/>
                <rect x="18" y="8" width="1" height="1" fill="#70a1ff"/>
            </g>
            <!-- Accessory: Crown -->
            <g class="acc-layer acc-crown" style="display:none;">
                <rect x="12" y="0" width="6" height="3" fill="#ffd32a"/>
                <rect x="12" y="-1" width="1" height="1" fill="#ffd32a"/>
                <rect x="14" y="-1" width="2" height="1" fill="#ffd32a"/>
                <rect x="17" y="-1" width="1" height="1" fill="#ffd32a"/>
                <rect x="14" y="1" width="2" height="1" fill="#ff3f34"/>
            </g>
        `;
    }

    ns.Sprites = {
        render(svgEl, charId, options = {}) {
            if (!svgEl) return;
            const body = charId === 'tori' ? buildToriBody() : buildMangoBody();
            const overlays = buildOverlays(Boolean(options.withBasket));
            svgEl.setAttribute('viewBox', '0 -3 24 26');
            svgEl.innerHTML = body + overlays;
        },

        createPreviewSvg(charId) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'char-preview-svg');
            this.render(svg, charId, { withBasket: false });
            return svg;
        }
    };
})(window.MangoGame);
