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

    function buildMimiBody() {
        return `
            <!-- Plush Feathery White Tail -->
            <rect x="1" y="9" width="5" height="6" fill="#ffffff" class="fur-part"/>
            <rect x="2" y="12" width="3" height="2" fill="#e4e7f2"/>
            <rect x="0" y="10" width="1" height="4" fill="#222222"/>
            <rect x="1" y="8" width="4" height="1" fill="#222222"/>
            <rect x="1" y="15" width="4" height="1" fill="#222222"/>
            <rect x="5" y="9" width="1" height="2" fill="#222222"/>

            <!-- Plump Curly Cloud-Like 6kg White Body -->
            <rect x="4" y="11" width="14" height="8" fill="#ffffff" class="fur-part"/>
            <rect x="5" y="16" width="12" height="3" fill="#eef0f8"/>
            <rect x="6" y="13" width="2" height="1" fill="#e2e5f0"/>
            <rect x="10" y="15" width="2" height="1" fill="#e2e5f0"/>
            <rect x="14" y="14" width="2" height="1" fill="#e2e5f0"/>
            <rect x="5" y="10" width="6" height="1" fill="#222222"/>
            <rect x="18" y="12" width="1" height="6" fill="#222222"/>
            <rect x="8" y="19" width="5" height="1" fill="#222222"/>

            <!-- Sturdy Fluffy Thick Legs -->
            <rect x="4" y="17" width="4" height="4" fill="#ffffff" class="fur-part"/>
            <rect x="5" y="20" width="2" height="1" fill="#d9c5be"/>
            <rect x="3" y="14" width="1" height="7" fill="#222222"/>
            <rect x="8" y="18" width="1" height="3" fill="#222222"/>
            <rect x="4" y="21" width="4" height="1" fill="#222222"/>

            <rect x="13" y="17" width="4" height="4" fill="#ffffff" class="fur-part"/>
            <rect x="14" y="20" width="2" height="1" fill="#d9c5be"/>
            <rect x="12" y="18" width="1" height="3" fill="#222222"/>
            <rect x="17" y="17" width="1" height="4" fill="#222222"/>
            <rect x="13" y="21" width="4" height="1" fill="#222222"/>

            <!-- Fluffy Tousled Crown Fur (Mimi's Signature Dandelion Top) -->
            <rect x="11" y="2" width="8" height="3" fill="#ffffff"/>
            <rect x="13" y="1" width="4" height="2" fill="#ffffff"/>
            <rect x="13" y="0" width="4" height="1" fill="#222222"/>
            <rect x="11" y="1" width="2" height="1" fill="#222222"/>
            <rect x="17" y="1" width="2" height="1" fill="#222222"/>
            <rect x="10" y="2" width="1" height="2" fill="#222222"/>
            <rect x="19" y="2" width="1" height="2" fill="#222222"/>

            <!-- Big Round Plush White Head -->
            <rect x="9" y="4" width="12" height="9" fill="#ffffff" class="fur-light"/>
            <rect x="11" y="12" width="8" height="3" fill="#ffffff"/>
            <rect x="11" y="13" width="7" height="1" fill="#f3ece9"/>
            <rect x="21" y="8" width="1" height="4" fill="#222222"/>
            <rect x="20" y="12" width="1" height="1" fill="#222222"/>

            <!-- Full Curly Drooping Maltese Ears -->
            <rect x="6" y="5" width="4" height="7" fill="#ffffff"/>
            <rect x="7" y="8" width="2" height="4" fill="#e4e7f2"/>
            <rect x="6" y="4" width="4" height="1" fill="#222222"/>
            <rect x="5" y="5" width="1" height="6" fill="#222222"/>
            <rect x="6" y="11" width="1" height="2" fill="#222222"/>
            <rect x="7" y="12" width="3" height="1" fill="#222222"/>
            <rect x="10" y="8" width="1" height="3" fill="#666666"/>

            <rect x="20" y="5" width="3" height="6" fill="#ffffff"/>
            <rect x="21" y="7" width="1" height="3" fill="#e4e7f2"/>
            <rect x="20" y="4" width="2" height="1" fill="#222222"/>
            <rect x="23" y="5" width="1" height="5" fill="#222222"/>
            <rect x="22" y="10" width="1" height="1" fill="#222222"/>

            <!-- Expressive Dark Eyes, Cute Button Nose & Soft Curious Mouth -->
            <rect x="13" y="7" width="2" height="2" fill="#1a1a1a"/>
            <rect x="13" y="7" width="1" height="1" fill="#ffffff"/>
            <rect x="18" y="7" width="2" height="2" fill="#1a1a1a"/>
            <rect x="18" y="7" width="1" height="1" fill="#ffffff"/>
            <rect x="16" y="9" width="2" height="1" fill="#222222"/>
            <rect x="11" y="9" width="2" height="1" fill="#ffb0c0"/>
            <rect x="16" y="11" width="2" height="1" fill="#333333"/>
        `;
    }

    function buildMimiSleepingBody() {
        return `
            <!-- Big Cozy Curled Tail -->
            <rect x="1" y="14" width="5" height="6" fill="#ffffff" class="fur-part"/>
            <rect x="2" y="16" width="3" height="3" fill="#e4e7f2"/>
            <rect x="0" y="15" width="1" height="4" fill="#222222"/>
            <rect x="1" y="13" width="4" height="1" fill="#222222"/>
            <rect x="1" y="20" width="4" height="1" fill="#222222"/>

            <!-- Plump Curled Cloud Body -->
            <rect x="4" y="12" width="12" height="9" fill="#ffffff" class="fur-part"/>
            <rect x="5" y="18" width="10" height="3" fill="#eef0f8"/>
            <rect x="6" y="15" width="2" height="1" fill="#e2e5f0"/>
            <rect x="5" y="11" width="8" height="1" fill="#222222"/>
            <rect x="3" y="12" width="1" height="8" fill="#222222"/>
            <rect x="4" y="21" width="17" height="1" fill="#222222"/>

            <!-- Tucked Fluffy Paws -->
            <rect x="17" y="19" width="4" height="2" fill="#ffffff"/>
            <rect x="21" y="19" width="1" height="2" fill="#222222"/>

            <!-- Tousled Crown & Round Sleeping Head -->
            <rect x="12" y="9" width="6" height="2" fill="#ffffff"/>
            <rect x="13" y="8" width="4" height="1" fill="#222222"/>
            <rect x="10" y="11" width="11" height="8" fill="#ffffff" class="fur-light"/>
            <rect x="10" y="10" width="3" height="1" fill="#222222"/>
            <rect x="17" y="10" width="3" height="1" fill="#222222"/>
            <rect x="21" y="12" width="1" height="7" fill="#222222"/>

            <!-- Full Drooping Ears -->
            <rect x="7" y="12" width="4" height="6" fill="#ffffff"/>
            <rect x="8" y="15" width="2" height="3" fill="#e4e7f2"/>
            <rect x="7" y="11" width="3" height="1" fill="#222222"/>
            <rect x="6" y="12" width="1" height="5" fill="#222222"/>
            <rect x="7" y="17" width="3" height="1" fill="#222222"/>

            <!-- Closed Sleeping Eyes, Nose & Blush -->
            <rect x="13" y="14" width="2" height="1" fill="#222222"/>
            <rect x="18" y="14" width="2" height="1" fill="#222222"/>
            <rect x="11" y="15" width="2" height="1" fill="#ffb0c0"/>
            <rect x="16" y="16" width="2" height="1" fill="#222222"/>
        `;
    }

    function buildEvolutionOverlays(charId) {
        if (charId === 'tori' || charId === 'mimi') {
            return `
            <!-- Tori Evolution: Foodie (하트 포인트 빨간 턱받이 + 빵빵한 볼 + 혀) -->
            <g class="evo-layer evo-adult_foodie" style="display:none;">
                <rect x="11" y="13" width="7" height="1" fill="#c0392b"/>
                <rect x="12" y="14" width="5" height="3" fill="#ff4757"/>
                <rect x="13" y="17" width="3" height="1" fill="#ff4757"/>
                <rect x="14" y="15" width="1" height="1" fill="#ffffff"/>
                <rect x="11" y="10" width="2" height="2" fill="#ff85a2"/>
                <rect x="17" y="12" width="2" height="1" fill="#ff6b81"/>
            </g>
            <!-- Tori Evolution: Sporty (빨간 스포츠 머리띠 + 휘날리는 끈 + 앞발 아대) -->
            <g class="evo-layer evo-adult_sporty" style="display:none;">
                <rect x="10" y="5" width="10" height="2" fill="#ff4757"/>
                <rect x="14" y="5" width="2" height="2" fill="#ffffff"/>
                <rect x="8" y="4" width="2" height="1" fill="#ff4757"/>
                <rect x="7" y="5" width="2" height="1" fill="#ff6b81"/>
                <rect x="13" y="19" width="3" height="1" fill="#ff4757"/>
            </g>
            <!-- Tori Evolution: Sleepy (줄무늬 수면 모자 + 노란 방울 + 졸린 눈) -->
            <g class="evo-layer evo-adult_sleepy" style="display:none;">
                <rect x="11" y="1" width="8" height="3" fill="#54a0ff"/>
                <rect x="11" y="3" width="8" height="1" fill="#2e86de"/>
                <rect x="9" y="2" width="3" height="2" fill="#54a0ff"/>
                <rect x="7" y="3" width="2" height="2" fill="#ffeaa7"/>
                <rect x="7" y="4" width="1" height="1" fill="#feca57"/>
                <rect x="14" y="8" width="2" height="1" fill="#ffffff"/>
                <rect x="14" y="9" width="2" height="1" fill="#222222"/>
                <rect x="18" y="8" width="2" height="1" fill="#ffffff"/>
                <rect x="18" y="9" width="2" height="1" fill="#222222"/>
                <rect x="21" y="11" width="1" height="2" fill="#74b9ff"/>
            </g>
            <!-- Tori/Mimi Evolution: Balanced (황금 헤일로 + 황금 방울 목걸이 + 별빛 오라) -->
            <g class="evo-layer evo-adult_balanced" style="display:none;">
                <rect x="12" y="-1" width="6" height="1" fill="#ffd32a"/>
                <rect x="11" y="0" width="1" height="1" fill="#ff9f1a"/>
                <rect x="18" y="0" width="1" height="1" fill="#ff9f1a"/>
                <rect x="12" y="13" width="6" height="1" fill="#ff9f1a"/>
                <rect x="14" y="14" width="2" height="2" fill="#ffd32a"/>
                <rect x="3" y="5" width="1" height="3" fill="#ffd32a"/>
                <rect x="2" y="6" width="3" height="1" fill="#ffd32a"/>
                <rect x="21" y="3" width="1" height="3" fill="#ffd32a"/>
                <rect x="20" y="4" width="3" height="1" fill="#ffd32a"/>
                <rect x="21" y="15" width="1" height="1" fill="#ff9f1a"/>
            </g>
            <!-- Tori/Mimi Evolution: Royal (보석 황금 왕관 + 왕실 레드 망토 + 하트 별빛) -->
            <g class="evo-layer evo-adult_royal" style="display:none;">
                <rect x="12" y="-1" width="6" height="3" fill="#ffd32a"/>
                <rect x="12" y="-2" width="1" height="1" fill="#ffd32a"/>
                <rect x="14" y="-2" width="2" height="1" fill="#ffd32a"/>
                <rect x="17" y="-2" width="1" height="1" fill="#ffd32a"/>
                <rect x="14" y="0" width="2" height="1" fill="#ff4757"/>
                <rect x="12" y="0" width="1" height="1" fill="#70a1ff"/>
                <rect x="17" y="0" width="1" height="1" fill="#70a1ff"/>
                <rect x="5" y="12" width="8" height="5" fill="#d63031"/>
                <rect x="5" y="17" width="8" height="1" fill="#fff5d6"/>
                <rect x="12" y="13" width="3" height="1" fill="#ffd32a"/>
                <rect x="3" y="4" width="1" height="3" fill="#ff85a2"/>
                <rect x="2" y="5" width="3" height="1" fill="#ff85a2"/>
                <rect x="21" y="2" width="1" height="3" fill="#ffd32a"/>
                <rect x="20" y="3" width="3" height="1" fill="#ffd32a"/>
            </g>
            `;
        }

        return `
            <!-- Mango Evolution: Foodie (하트 포인트 빨간 턱받이 + 빵빵한 볼) -->
            <g class="evo-layer evo-adult_foodie" style="display:none;">
                <rect x="12" y="13" width="7" height="1" fill="#c0392b"/>
                <rect x="13" y="14" width="5" height="3" fill="#ff4757"/>
                <rect x="14" y="17" width="3" height="1" fill="#ff4757"/>
                <rect x="15" y="15" width="1" height="1" fill="#ffffff"/>
                <rect x="11" y="10" width="2" height="2" fill="#ff85a2"/>
            </g>
            <!-- Mango Evolution: Sporty (빨간 스포츠 머리띠 + 휘날리는 끈 + 앞발 아대) -->
            <g class="evo-layer evo-adult_sporty" style="display:none;">
                <rect x="10" y="6" width="10" height="2" fill="#ff4757"/>
                <rect x="14" y="6" width="2" height="2" fill="#ffffff"/>
                <rect x="8" y="5" width="2" height="1" fill="#ff4757"/>
                <rect x="7" y="6" width="2" height="1" fill="#ff6b81"/>
                <rect x="13" y="19" width="3" height="1" fill="#ff4757"/>
            </g>
            <!-- Mango Evolution: Sleepy (줄무늬 수면 모자 + 노란 방울 + 양쪽 졸린 눈) -->
            <g class="evo-layer evo-adult_sleepy" style="display:none;">
                <rect x="11" y="1" width="8" height="3" fill="#54a0ff"/>
                <rect x="11" y="3" width="8" height="1" fill="#2e86de"/>
                <rect x="9" y="2" width="3" height="2" fill="#54a0ff"/>
                <rect x="7" y="3" width="2" height="2" fill="#ffeaa7"/>
                <rect x="7" y="4" width="1" height="1" fill="#feca57"/>
                <rect x="14" y="8" width="2" height="1" fill="#fff4d9"/>
                <rect x="14" y="9" width="2" height="1" fill="#222222"/>
                <rect x="19" y="8" width="1" height="1" fill="#fff4d9"/>
                <rect x="19" y="9" width="1" height="1" fill="#222222"/>
                <rect x="21" y="11" width="1" height="2" fill="#74b9ff"/>
            </g>
            <!-- Mango Evolution: Balanced (황금 헤일로 + 황금 방울 목걸이 + 별빛 오라) -->
            <g class="evo-layer evo-adult_balanced" style="display:none;">
                <rect x="12" y="-1" width="6" height="1" fill="#ffd32a"/>
                <rect x="11" y="0" width="1" height="1" fill="#ff9f1a"/>
                <rect x="18" y="0" width="1" height="1" fill="#ff9f1a"/>
                <rect x="12" y="13" width="6" height="1" fill="#ff9f1a"/>
                <rect x="14" y="14" width="2" height="2" fill="#ffd32a"/>
                <rect x="3" y="5" width="1" height="3" fill="#ffd32a"/>
                <rect x="2" y="6" width="3" height="1" fill="#ffd32a"/>
                <rect x="21" y="3" width="1" height="3" fill="#ffd32a"/>
                <rect x="20" y="4" width="3" height="1" fill="#ffd32a"/>
                <rect x="21" y="15" width="1" height="1" fill="#ff9f1a"/>
            </g>
            <!-- Mango Evolution: Royal (보석 황금 왕관 + 왕실 레드 망토 + 하트 별빛) -->
            <g class="evo-layer evo-adult_royal" style="display:none;">
                <rect x="12" y="-1" width="6" height="3" fill="#ffd32a"/>
                <rect x="12" y="-2" width="1" height="1" fill="#ffd32a"/>
                <rect x="14" y="-2" width="2" height="1" fill="#ffd32a"/>
                <rect x="17" y="-2" width="1" height="1" fill="#ffd32a"/>
                <rect x="14" y="0" width="2" height="1" fill="#ff4757"/>
                <rect x="12" y="0" width="1" height="1" fill="#70a1ff"/>
                <rect x="17" y="0" width="1" height="1" fill="#70a1ff"/>
                <rect x="5" y="12" width="7" height="5" fill="#d63031"/>
                <rect x="5" y="17" width="7" height="1" fill="#fff5d6"/>
                <rect x="11" y="13" width="3" height="1" fill="#ffd32a"/>
                <rect x="3" y="4" width="1" height="3" fill="#ff85a2"/>
                <rect x="2" y="5" width="3" height="1" fill="#ff85a2"/>
                <rect x="21" y="2" width="1" height="3" fill="#ffd32a"/>
                <rect x="20" y="3" width="3" height="1" fill="#ffd32a"/>
            </g>
        `;
    }

    function buildOverlays(withBasket, charId) {
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
            ${buildEvolutionOverlays(charId)}

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

    function buildDefaultThemeSvg() {
        return `
        <svg class="theme-bg-svg" viewBox="0 0 64 74" preserveAspectRatio="xMidYMax slice" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
            <!-- Pastel Sky Bands -->
            <rect x="0" y="0" width="64" height="20" fill="#8ecae6"/>
            <rect x="0" y="20" width="64" height="22" fill="#a8d8ea"/>
            <rect x="0" y="42" width="64" height="32" fill="#cdeef9"/>
            <!-- Pixel Sun & Rays -->
            <rect x="48" y="7" width="8" height="8" fill="#ffd32a"/>
            <rect x="49" y="8" width="6" height="6" fill="#fff275"/>
            <g class="beach-sun-rays">
                <rect x="51" y="3" width="2" height="3" fill="#ffd32a"/><rect x="51" y="16" width="2" height="3" fill="#ffd32a"/>
                <rect x="44" y="10" width="3" height="2" fill="#ffd32a"/><rect x="57" y="10" width="3" height="2" fill="#ffd32a"/>
                <rect x="45" y="5" width="2" height="2" fill="#ffd32a"/><rect x="57" y="5" width="2" height="2" fill="#ffd32a"/>
                <rect x="45" y="15" width="2" height="2" fill="#ffd32a"/><rect x="57" y="15" width="2" height="2" fill="#ffd32a"/>
            </g>
            <!-- Fluffy Clouds -->
            <g class="bg-cloud-slow">
                <rect x="8" y="11" width="14" height="3" fill="#ffffff"/>
                <rect x="11" y="10" width="8" height="1" fill="#ffffff"/>
                <rect x="9" y="14" width="12" height="1" fill="#dff6ff"/>
                <rect x="26" y="22" width="12" height="3" fill="#ffffff"/>
                <rect x="28" y="21" width="8" height="1" fill="#ffffff"/>
                <rect x="27" y="25" width="10" height="1" fill="#dff6ff"/>
            </g>
            <!-- Distant Rolling Hills -->
            <rect x="0" y="61" width="28" height="13" fill="#a8e6cf"/>
            <rect x="5" y="59" width="18" height="2" fill="#a8e6cf"/>
            <rect x="24" y="63" width="40" height="11" fill="#88d8b0"/>
            <rect x="34" y="60" width="24" height="3" fill="#88d8b0"/>
            <!-- White Yard Fence -->
            <rect x="24" y="68" width="40" height="1" fill="#ffffff"/>
            <rect x="24" y="71" width="40" height="1" fill="#ffffff"/>
            <rect x="28" y="66" width="2" height="8" fill="#ffffff"/><rect x="34" y="66" width="2" height="8" fill="#ffffff"/>
            <rect x="40" y="66" width="2" height="8" fill="#ffffff"/><rect x="46" y="66" width="2" height="8" fill="#ffffff"/>
            <rect x="52" y="66" width="2" height="8" fill="#ffffff"/><rect x="58" y="66" width="2" height="8" fill="#ffffff"/>
            <!-- Cozy Pixel Doghouse on Left -->
            <rect x="5" y="59" width="18" height="15" fill="#fff3d6"/>
            <rect x="5" y="63" width="18" height="1" fill="#e6cfa8"/>
            <rect x="5" y="68" width="18" height="1" fill="#e6cfa8"/>
            <rect x="4" y="59" width="1" height="15" fill="#333333"/>
            <rect x="23" y="59" width="1" height="15" fill="#333333"/>
            <!-- Red Sloped Roof -->
            <rect x="3" y="57" width="22" height="3" fill="#ff6b6b"/>
            <rect x="5" y="54" width="18" height="3" fill="#ff6b6b"/>
            <rect x="8" y="51" width="12" height="3" fill="#ff6b6b"/>
            <rect x="11" y="49" width="6" height="2" fill="#ff6b6b"/>
            <rect x="3" y="59" width="22" height="1" fill="#c0392b"/>
            <rect x="11" y="48" width="6" height="1" fill="#333333"/>
            <rect x="8" y="50" width="3" height="1" fill="#333333"/><rect x="17" y="50" width="3" height="1" fill="#333333"/>
            <rect x="5" y="53" width="3" height="1" fill="#333333"/><rect x="20" y="53" width="3" height="1" fill="#333333"/>
            <rect x="2" y="56" width="3" height="1" fill="#333333"/><rect x="23" y="56" width="3" height="1" fill="#333333"/>
            <!-- Bone Nameplate -->
            <rect x="11" y="60" width="6" height="2" fill="#ffd32a"/>
            <rect x="12" y="60" width="4" height="1" fill="#ffffff"/>
            <!-- Arched Doorway -->
            <rect x="10" y="65" width="8" height="9" fill="#4a3728"/>
            <rect x="11" y="64" width="6" height="1" fill="#4a3728"/>
            <rect x="12" y="63" width="4" height="1" fill="#4a3728"/>
            <!-- Little Yard Flowers -->
            <rect x="31" y="72" width="2" height="2" fill="#ff8fab"/>
            <rect x="44" y="72" width="2" height="2" fill="#ffd32a"/>
            <rect x="55" y="72" width="2" height="2" fill="#ff8fab"/>
        </svg>`;
    }

    function buildSakuraThemeSvg() {
        return `
        <svg class="theme-bg-svg" viewBox="0 0 64 74" preserveAspectRatio="xMidYMax slice" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="64" height="18" fill="#ffc2d4"/>
            <rect x="0" y="18" width="64" height="18" fill="#ffd6e4"/>
            <rect x="0" y="36" width="64" height="22" fill="#ffe8f0"/>
            <rect x="0" y="58" width="64" height="16" fill="#fff5f8"/>
            <g class="bg-cloud-slow">
                <rect x="36" y="9" width="12" height="3" fill="#ffffff"/>
                <rect x="38" y="8" width="8" height="1" fill="#ffffff"/>
                <rect x="37" y="12" width="10" height="1" fill="#ffe0eb"/>
                <rect x="12" y="15" width="12" height="3" fill="#ffffff"/>
                <rect x="14" y="14" width="8" height="1" fill="#ffffff"/>
                <rect x="13" y="18" width="10" height="1" fill="#ffe0eb"/>
                <rect x="48" y="23" width="12" height="3" fill="#ffffff"/>
                <rect x="50" y="22" width="8" height="1" fill="#ffffff"/>
            </g>
            <rect x="0" y="58" width="26" height="16" fill="#f7b2c4"/>
            <rect x="4" y="56" width="18" height="2" fill="#f7b2c4"/>
            <rect x="22" y="60" width="42" height="14" fill="#f4a2b8"/>
            <rect x="30" y="57" width="26" height="3" fill="#f4a2b8"/>
            <rect x="0" y="68" width="64" height="1" fill="#ffffff"/>
            <rect x="0" y="71" width="64" height="1" fill="#ffffff"/>
            <rect x="2" y="66" width="2" height="8" fill="#ffffff"/><rect x="8" y="66" width="2" height="8" fill="#ffffff"/>
            <rect x="14" y="66" width="2" height="8" fill="#ffffff"/><rect x="20" y="66" width="2" height="8" fill="#ffffff"/>
            <rect x="26" y="66" width="2" height="8" fill="#ffffff"/><rect x="32" y="66" width="2" height="8" fill="#ffffff"/>
            <rect x="38" y="66" width="2" height="8" fill="#ffffff"/><rect x="44" y="66" width="2" height="8" fill="#ffffff"/>
            <rect x="50" y="66" width="2" height="8" fill="#ffffff"/><rect x="56" y="66" width="2" height="8" fill="#ffffff"/>
            <rect x="62" y="66" width="2" height="8" fill="#ffffff"/>
            <rect x="41" y="64" width="16" height="2" fill="#a47148"/>
            <rect x="41" y="67" width="16" height="2" fill="#8b5a2b"/>
            <rect x="40" y="69" width="18" height="2" fill="#c68b59"/>
            <rect x="42" y="71" width="2" height="3" fill="#5c3d2e"/>
            <rect x="54" y="71" width="2" height="3" fill="#5c3d2e"/>
            <rect x="8" y="42" width="6" height="32" fill="#6d4c41"/>
            <rect x="9" y="44" width="2" height="28" fill="#8d6e63"/>
            <rect x="6" y="72" width="10" height="2" fill="#5d4037"/>
            <rect x="14" y="48" width="6" height="3" fill="#6d4c41"/>
            <rect x="4" y="46" width="4" height="2" fill="#6d4c41"/>
            <rect x="1" y="24" width="24" height="18" fill="#ff8fab"/>
            <rect x="4" y="20" width="18" height="6" fill="#ff8fab"/>
            <rect x="22" y="28" width="10" height="12" fill="#ff8fab"/>
            <rect x="3" y="22" width="20" height="14" fill="#ffb3c6"/>
            <rect x="20" y="30" width="9" height="8" fill="#ffb3c6"/>
            <rect x="6" y="23" width="12" height="8" fill="#ffe5ec"/>
            <rect x="14" y="31" width="8" height="5" fill="#ffe5ec"/>
            <rect x="24" y="32" width="4" height="3" fill="#ffe5ec"/>
            <rect x="52" y="26" width="12" height="10" fill="#ff8fab"/>
            <rect x="54" y="28" width="10" height="6" fill="#ffb3c6"/>
            <rect x="56" y="29" width="6" height="3" fill="#ffe5ec"/>
            <g class="sakura-petals-a">
                <rect x="28" y="40" width="2" height="1" fill="#ff8fab"/>
                <rect x="42" y="42" width="2" height="1" fill="#ffb3c6"/>
                <rect x="26" y="52" width="2" height="1" fill="#ffffff"/>
                <rect x="56" y="45" width="2" height="1" fill="#ffb3c6"/>
            </g>
            <g class="sakura-petals-b">
                <rect x="34" y="34" width="2" height="1" fill="#ffffff"/>
                <rect x="50" y="39" width="2" height="1" fill="#ff8fab"/>
                <rect x="38" y="50" width="2" height="1" fill="#ff8fab"/>
                <rect x="31" y="58" width="2" height="1" fill="#ffffff"/>
            </g>
        </svg>`;
    }

    function buildBeachThemeSvg() {
        return `
        <svg class="theme-bg-svg" viewBox="0 0 64 74" preserveAspectRatio="xMidYMax slice" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="64" height="18" fill="#4aa3ff"/>
            <rect x="0" y="18" width="64" height="18" fill="#74b9ff"/>
            <rect x="0" y="36" width="64" height="18" fill="#a8e6ff"/>
            <rect x="48" y="7" width="8" height="8" fill="#ffd32a"/>
            <rect x="49" y="8" width="6" height="6" fill="#fff275"/>
            <g class="beach-sun-rays">
                <rect x="51" y="3" width="2" height="3" fill="#ffd32a"/><rect x="51" y="16" width="2" height="3" fill="#ffd32a"/>
                <rect x="44" y="10" width="3" height="2" fill="#ffd32a"/><rect x="57" y="10" width="3" height="2" fill="#ffd32a"/>
                <rect x="45" y="5" width="2" height="2" fill="#ffd32a"/><rect x="57" y="5" width="2" height="2" fill="#ffd32a"/>
                <rect x="45" y="15" width="2" height="2" fill="#ffd32a"/><rect x="57" y="15" width="2" height="2" fill="#ffd32a"/>
            </g>
            <g class="bg-cloud-slow">
                <rect x="10" y="11" width="14" height="3" fill="#ffffff"/>
                <rect x="13" y="10" width="8" height="1" fill="#ffffff"/>
                <rect x="11" y="14" width="12" height="1" fill="#dff6ff"/>
                <rect x="26" y="23" width="14" height="3" fill="#ffffff"/>
                <rect x="29" y="22" width="8" height="1" fill="#ffffff"/>
                <rect x="27" y="26" width="12" height="1" fill="#dff6ff"/>
            </g>
            <rect x="0" y="54" width="64" height="10" fill="#00a8cc"/>
            <rect x="0" y="64" width="64" height="10" fill="#00cec9"/>
            <g class="beach-waves-a">
                <rect x="4" y="57" width="6" height="1" fill="#ffffff"/><rect x="38" y="58" width="6" height="1" fill="#ffffff"/>
                <rect x="12" y="62" width="6" height="1" fill="#ffffff"/><rect x="48" y="63" width="6" height="1" fill="#ffffff"/>
                <rect x="26" y="67" width="6" height="1" fill="#ffffff"/>
            </g>
            <g class="beach-waves-b">
                <rect x="20" y="56" width="6" height="1" fill="#ffffff"/><rect x="52" y="56" width="6" height="1" fill="#ffffff"/>
                <rect x="30" y="61" width="6" height="1" fill="#ffffff"/><rect x="8" y="68" width="6" height="1" fill="#ffffff"/>
                <rect x="44" y="69" width="6" height="1" fill="#ffffff"/>
            </g>
            <rect x="0" y="72" width="64" height="2" fill="#dff9fb"/>
            <rect x="8" y="70" width="4" height="4" fill="#a47148"/><rect x="8" y="66" width="4" height="4" fill="#8b5a2b"/>
            <rect x="9" y="62" width="4" height="4" fill="#a47148"/><rect x="9" y="58" width="4" height="4" fill="#8b5a2b"/>
            <rect x="10" y="54" width="4" height="4" fill="#a47148"/><rect x="11" y="50" width="4" height="4" fill="#8b5a2b"/>
            <rect x="12" y="46" width="4" height="4" fill="#a47148"/><rect x="13" y="42" width="4" height="4" fill="#8b5a2b"/>
            <rect x="13" y="38" width="4" height="4" fill="#a47148"/>
            <rect x="4" y="34" width="12" height="3" fill="#2ecc71"/><rect x="2" y="37" width="6" height="3" fill="#27ae60"/>
            <rect x="14" y="32" width="14" height="3" fill="#2ecc71"/><rect x="24" y="35" width="6" height="3" fill="#27ae60"/>
            <rect x="8" y="30" width="12" height="3" fill="#55efc4"/><rect x="15" y="37" width="10" height="3" fill="#27ae60"/>
            <rect x="12" y="38" width="2" height="2" fill="#5c3d2e"/><rect x="15" y="38" width="2" height="2" fill="#5c3d2e"/>
            <rect x="49" y="58" width="2" height="16" fill="#dfe6e9"/>
            <rect x="40" y="54" width="20" height="4" fill="#ff4757"/>
            <rect x="43" y="51" width="14" height="3" fill="#ff4757"/>
            <rect x="46" y="49" width="8" height="2" fill="#ff4757"/>
            <rect x="44" y="54" width="4" height="4" fill="#ffffff"/>
            <rect x="52" y="54" width="4" height="4" fill="#ffffff"/>
            <rect x="47" y="51" width="6" height="3" fill="#ffffff"/>
        </svg>`;
    }

    function buildCampingThemeSvg() {
        return `
        <svg class="theme-bg-svg" viewBox="0 0 64 74" preserveAspectRatio="xMidYMax slice" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="64" height="20" fill="#101626"/>
            <rect x="0" y="20" width="64" height="20" fill="#1b2440"/>
            <rect x="0" y="40" width="64" height="18" fill="#263354"/>
            <rect x="0" y="58" width="64" height="16" fill="#314266"/>
            <rect x="49" y="6" width="5" height="1" fill="#ffeaa7"/>
            <rect x="47" y="7" width="4" height="2" fill="#ffeaa7"/>
            <rect x="46" y="9" width="3" height="3" fill="#ffeaa7"/>
            <rect x="47" y="12" width="5" height="2" fill="#ffeaa7"/>
            <rect x="49" y="14" width="5" height="1" fill="#ffeaa7"/>
            <g class="camp-stars-a">
                <rect x="8" y="7" width="1" height="3" fill="#ffd32a"/><rect x="7" y="8" width="3" height="1" fill="#ffd32a"/><rect x="8" y="8" width="1" height="1" fill="#ffffff"/>
                <rect x="28" y="23" width="1" height="3" fill="#ffd32a"/><rect x="27" y="24" width="3" height="1" fill="#ffd32a"/><rect x="28" y="24" width="1" height="1" fill="#ffffff"/>
                <rect x="22" y="12" width="1" height="1" fill="#ffffff"/><rect x="56" y="22" width="1" height="1" fill="#ffffff"/>
            </g>
            <g class="camp-stars-b">
                <rect x="34" y="6" width="1" height="3" fill="#ffd32a"/><rect x="33" y="7" width="3" height="1" fill="#ffd32a"/><rect x="34" y="7" width="1" height="1" fill="#ffffff"/>
                <rect x="44" y="27" width="1" height="3" fill="#ffd32a"/><rect x="43" y="28" width="3" height="1" fill="#ffd32a"/><rect x="44" y="28" width="1" height="1" fill="#ffffff"/>
                <rect x="40" y="18" width="1" height="1" fill="#ffffff"/><rect x="14" y="22" width="1" height="1" fill="#ffffff"/><rect x="6" y="30" width="1" height="1" fill="#ffffff"/>
            </g>
            <polygon points="12,56 26,42 40,56" fill="#1e2a45"/>
            <polygon points="38,58 48,48 58,58" fill="#182238"/>
            <rect x="7" y="66" width="2" height="8" fill="#3e2723"/><rect x="4" y="62" width="8" height="5" fill="#1e4d45"/><rect x="5" y="57" width="6" height="5" fill="#245c52"/><rect x="6" y="53" width="4" height="4" fill="#2d7064"/><rect x="7" y="51" width="2" height="2" fill="#2d7064"/>
            <rect x="27" y="66" width="2" height="8" fill="#3e2723"/><rect x="24" y="62" width="8" height="5" fill="#1e4d45"/><rect x="25" y="57" width="6" height="5" fill="#245c52"/><rect x="26" y="53" width="4" height="4" fill="#2d7064"/><rect x="27" y="51" width="2" height="2" fill="#2d7064"/>
            <rect x="37" y="66" width="2" height="8" fill="#3e2723"/><rect x="34" y="62" width="8" height="5" fill="#1e4d45"/><rect x="35" y="57" width="6" height="5" fill="#245c52"/><rect x="36" y="53" width="4" height="4" fill="#2d7064"/><rect x="37" y="51" width="2" height="2" fill="#2d7064"/>
            <rect x="59" y="66" width="2" height="8" fill="#3e2723"/><rect x="56" y="62" width="8" height="5" fill="#1e4d45"/><rect x="57" y="57" width="6" height="5" fill="#245c52"/><rect x="58" y="53" width="4" height="4" fill="#2d7064"/><rect x="59" y="51" width="2" height="2" fill="#2d7064"/>
            <polygon points="5,74 16,62 27,74" fill="#ff9f43"/>
            <polygon points="10,74 16,66 22,74" fill="#2c3a47"/>
            <g class="camp-lantern">
                <rect x="15" y="68" width="2" height="3" fill="#ffeaa7"/>
                <rect x="15" y="69" width="2" height="1" fill="#ffd32a"/>
            </g>
            <rect x="46" y="72" width="10" height="2" fill="#6d4c41"/>
            <rect x="48" y="70" width="6" height="2" fill="#5d4037"/>
            <g class="camp-fire-outer">
                <rect x="47" y="66" width="8" height="5" fill="#ff4757"/>
                <rect x="48" y="63" width="6" height="5" fill="#ff9f43"/>
            </g>
            <g class="camp-fire-inner">
                <rect x="49" y="65" width="4" height="4" fill="#ffd32a"/>
                <rect x="50" y="67" width="2" height="2" fill="#fff275"/>
            </g>
            <g class="camp-sparks">
                <rect x="49" y="59" width="1" height="1" fill="#ffd32a"/>
                <rect x="53" y="56" width="1" height="1" fill="#ff9f43"/>
                <rect x="50" y="53" width="1" height="1" fill="#ffeaa7"/>
            </g>
        </svg>`;
    }

    function buildMangoSleepingBody() {
        return `
            <!-- Curled Fluffy Tail Wrapped Around Back -->
            <rect x="2" y="15" width="4" height="5" fill="#f2cfa5" class="fur-part"/>
            <rect x="3" y="16" width="2" height="3" fill="#fff4d9"/>
            <rect x="1" y="16" width="1" height="3" fill="#222222"/>
            <rect x="2" y="14" width="3" height="1" fill="#222222"/>
            <rect x="2" y="20" width="4" height="1" fill="#222222"/>

            <!-- Curled Sleeping Body (Toasted Cream-Tan + White Belly) -->
            <rect x="5" y="13" width="9" height="7" fill="#f2cfa5" class="fur-part"/>
            <rect x="6" y="12" width="7" height="2" fill="#e6b98a" class="fur-dark"/>
            <rect x="6" y="11" width="6" height="1" fill="#222222"/>
            <rect x="4" y="13" width="1" height="7" fill="#222222"/>
            <rect x="6" y="19" width="7" height="2" fill="#ffffff"/>
            <rect x="5" y="21" width="15" height="1" fill="#222222"/>

            <!-- Fluffy White Mane & Tucked Front Paws -->
            <rect x="10" y="17" width="8" height="4" fill="#ffffff"/>
            <rect x="11" y="19" width="6" height="2" fill="#eef2f7"/>
            <rect x="18" y="19" width="2" height="2" fill="#ffffff"/>
            <rect x="20" y="19" width="1" height="2" fill="#222222"/>

            <!-- Pointy Pomeranian Ears (Lowered in Sleep) -->
            <rect x="11" y="10" width="3" height="3" fill="#e6b98a" class="fur-dark"/>
            <rect x="12" y="11" width="1" height="1" fill="#ffb6c1"/>
            <rect x="10" y="10" width="1" height="3" fill="#222222"/>
            <rect x="11" y="9" width="2" height="1" fill="#222222"/>

            <rect x="17" y="10" width="3" height="3" fill="#e6b98a" class="fur-dark"/>
            <rect x="18" y="11" width="1" height="1" fill="#ffb6c1"/>
            <rect x="17" y="9" width="2" height="1" fill="#222222"/>
            <rect x="20" y="10" width="1" height="3" fill="#222222"/>

            <!-- Resting Head (Pale Creamy Ivory) -->
            <rect x="11" y="13" width="9" height="6" fill="#fff4d9" class="fur-light"/>
            <rect x="12" y="12" width="7" height="1" fill="#f7e3be" class="fur-part"/>
            <rect x="14" y="12" width="3" height="1" fill="#222222"/>
            <rect x="10" y="13" width="1" height="5" fill="#222222"/>
            <rect x="20" y="13" width="1" height="6" fill="#222222"/>
            <!-- White Muzzle -->
            <rect x="15" y="16" width="6" height="3" fill="#ffffff"/>
            <rect x="21" y="16" width="1" height="3" fill="#222222"/>

            <!-- Peacefully Closed Sleeping Eyes, Tiny Nose & Blush -->
            <rect x="13" y="15" width="2" height="1" fill="#222222"/>
            <rect x="18" y="15" width="2" height="1" fill="#222222"/>
            <rect x="12" y="16" width="2" height="1" fill="#ff9fb2"/>
            <rect x="18" y="17" width="2" height="1" fill="#222222"/>
        `;
    }

    function buildToriSleepingBody() {
        return `
            <!-- Curled Feathery White Tail -->
            <rect x="2" y="15" width="4" height="5" fill="#ffffff" class="fur-part"/>
            <rect x="3" y="17" width="2" height="2" fill="#e6e8f4"/>
            <rect x="1" y="16" width="1" height="3" fill="#222222"/>
            <rect x="2" y="14" width="3" height="1" fill="#222222"/>
            <rect x="2" y="20" width="4" height="1" fill="#222222"/>

            <!-- Petite Curled White Maltese Body -->
            <rect x="5" y="14" width="10" height="7" fill="#ffffff" class="fur-part"/>
            <rect x="6" y="19" width="8" height="2" fill="#eef0f8"/>
            <rect x="6" y="13" width="6" height="1" fill="#222222"/>
            <rect x="4" y="14" width="1" height="6" fill="#222222"/>
            <rect x="5" y="21" width="15" height="1" fill="#222222"/>

            <!-- Tucked Tiny Paws -->
            <rect x="17" y="19" width="3" height="2" fill="#ffffff"/>
            <rect x="20" y="19" width="1" height="2" fill="#222222"/>

            <!-- Wispy Hair Tuft on Top -->
            <rect x="14" y="10" width="2" height="2" fill="#ffffff"/>
            <rect x="14" y="9" width="2" height="1" fill="#222222"/>

            <!-- Resting Pure White Round Head -->
            <rect x="11" y="12" width="9" height="7" fill="#ffffff" class="fur-light"/>
            <rect x="11" y="11" width="3" height="1" fill="#222222"/>
            <rect x="16" y="11" width="3" height="1" fill="#222222"/>
            <rect x="20" y="13" width="1" height="6" fill="#222222"/>

            <!-- Short Soft Flared Maltese Ears -->
            <rect x="8" y="13" width="3" height="5" fill="#ffffff"/>
            <rect x="9" y="15" width="2" height="3" fill="#e6e8f4"/>
            <rect x="8" y="12" width="3" height="1" fill="#222222"/>
            <rect x="7" y="13" width="1" height="4" fill="#222222"/>
            <rect x="8" y="17" width="2" height="1" fill="#222222"/>

            <rect x="19" y="13" width="3" height="4" fill="#ffffff"/>
            <rect x="20" y="14" width="1" height="2" fill="#e6e8f4"/>
            <rect x="19" y="12" width="2" height="1" fill="#222222"/>
            <rect x="22" y="13" width="1" height="3" fill="#222222"/>
            <rect x="21" y="16" width="1" height="1" fill="#222222"/>

            <!-- Peacefully Closed Sleeping Eyes, Tiny Nose & Blush -->
            <rect x="13" y="15" width="2" height="1" fill="#222222"/>
            <rect x="17" y="15" width="2" height="1" fill="#222222"/>
            <rect x="12" y="16" width="2" height="1" fill="#ff9fb2"/>
            <rect x="16" y="17" width="2" height="1" fill="#222222"/>
        `;
    }

    ns.Sprites = {
        render(svgEl, charId, options = {}) {
            if (!svgEl) return;
            const isTori = charId === 'tori';
            const isMimi = charId === 'mimi';
            const isSleeping = Boolean(options.isSleeping);
            svgEl.classList.toggle('char-tori', isTori);
            svgEl.classList.toggle('char-mimi', isMimi);
            svgEl.classList.toggle('char-mango', !isTori && !isMimi);
            svgEl.setAttribute('viewBox', '0 -3 24 26');

            if (isSleeping) {
                svgEl.innerHTML = isTori
                    ? buildToriSleepingBody()
                    : (isMimi ? buildMimiSleepingBody() : buildMangoSleepingBody());
                return;
            }

            const body = isTori
                ? buildToriBody()
                : (isMimi ? buildMimiBody() : buildMangoBody());
            const includeOverlays = options.withOverlays !== false;
            const overlays = includeOverlays ? buildOverlays(Boolean(options.withBasket), charId) : '';
            svgEl.innerHTML = body + overlays;
        },

        createPreviewSvg(charId) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'char-preview-svg');
            this.render(svg, charId, { withBasket: false, withOverlays: false });
            return svg;
        },

        buildThemeSvg(themeClass) {
            if (themeClass === 'theme-sakura') return buildSakuraThemeSvg();
            if (themeClass === 'theme-beach') return buildBeachThemeSvg();
            if (themeClass === 'theme-camping') return buildCampingThemeSvg();
            return buildDefaultThemeSvg();
        }
    };
})(window.MangoGame);
