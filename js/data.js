window.MangoGame = window.MangoGame || {};

window.MangoGame.CHARACTERS = [
    {
        id: 'tori',
        name: '토리',
        title: 'GROW UP TORI',
        breed: '2kg 말티즈',
        desc: '아담하고 여리여리한 2kg 하얀 강아지',
        sizeScale: 0.94
    },
    {
        id: 'mango',
        name: '망고',
        title: 'GROW UP MANGO',
        breed: '4.5kg 포메라니안',
        desc: '노릇한 귀·등과 풍성한 하얀 목털의 4.5kg 강아지',
        sizeScale: 1.05
    },
    {
        id: 'mimi',
        name: '미미',
        title: 'GROW UP MIMI',
        breed: '6kg 복슬 강아지',
        desc: '구름처럼 몽실몽실한 복슬털의 듬직한 6kg 강아지',
        sizeScale: 1.16
    }
];

window.MangoGame.DEFAULT_STATE = {
    character: 'mango',
    hasSelectedCharacter: false,
    level: 1,
    exp: 0,
    hunger: 70,
    happy: 70,
    fatigue: 20,
    coins: 30,
    highScore: 0,
    isSleeping: false,
    equippedAccessory: null,
    equippedTheme: 'theme-default',
    careStats: {
        feed: 0,
        play: 0,
        sleep: 0
    },
    adultForm: null,
    unlockedDex: ['baby'],
    inventory: {
        milk: 1
    },
    lastActiveAt: Date.now()
};

window.MangoGame.EVOLUTION_FORMS = [
    {
        id: 'baby',
        stage: 'BABY',
        namePrefix: '아기',
        icon: '🐶',
        condition: 'Lv.01 기본 형태',
        requirement: { minLevel: 1 },
        desc: '호기심 많은 아기 강아지 시절이에요.'
    },
    {
        id: 'teen',
        stage: 'TEEN',
        namePrefix: '청소년',
        icon: '🐕',
        condition: 'Lv.06 달성',
        requirement: { minLevel: 6 },
        desc: '부쩍 자라서 산책과 놀이를 좋아해요.'
    },
    {
        id: 'adult_basic',
        stage: 'ADULT',
        namePrefix: '성견',
        icon: '🐾',
        condition: 'Lv.11 달성',
        requirement: { minLevel: 11 },
        desc: '별도 장식 없이 본연의 모습으로 늠름하게 자란 기본 성견이에요.'
    },
    {
        id: 'adult_foodie',
        stage: 'ADULT',
        namePrefix: '먹보',
        icon: '🍖',
        condition: 'Lv.11 달성 + 누적 밥 주기 10회',
        requirement: { minLevel: 11, feed: 10 },
        desc: '맛있는 간식을 제일 좋아하는 빨간 턱받이 스타일!'
    },
    {
        id: 'adult_sleepy',
        stage: 'ADULT',
        namePrefix: '잠꾸러기',
        icon: '💤',
        condition: 'Lv.15 달성 + 누적 재우기 5회',
        requirement: { minLevel: 15, sleep: 5 },
        desc: '수면 모자를 쓰고 늘 포근하게 졸고 있는 스타일!'
    },
    {
        id: 'adult_sporty',
        stage: 'ADULT',
        namePrefix: '에너자이저',
        icon: '⚽',
        condition: 'Lv.20 달성 + 누적 놀이·미니게임 10회',
        requirement: { minLevel: 20, play: 10 },
        desc: '스포츠 머리띠와 앞발 아대를 두른 체력왕 스타일!'
    },
    {
        id: 'adult_balanced',
        stage: 'ADULT',
        namePrefix: '황금 밸런스',
        icon: '✨',
        condition: 'Lv.25 달성 + 밥 10 · 놀이 10 · 수면 5 모두 달성',
        requirement: { minLevel: 25, feed: 10, play: 10, sleep: 5 },
        desc: '모든 케어를 고르게 채워 황금 헤일로로 빛나는 희귀 형태!'
    },
    {
        id: 'adult_royal',
        stage: 'ADULT',
        namePrefix: '로얄',
        icon: '👑',
        condition: 'Lv.30 달성 + 밥 20 · 놀이 20 · 수면 10 모두 달성',
        requirement: { minLevel: 30, feed: 20, play: 20, sleep: 10 },
        desc: '최고의 사랑으로 자라난 왕실 망토와 보석 왕관 스타일!'
    }
];

window.MangoGame.MINIGAME_CONFIG = {
    durationSeconds: 60,
    maxHearts: 3,
    entryMaxFatigue: 85,
    fatigueCost: 15,
    invincibleMs: 800,
    survivalBonusCoins: 15,
    perfectBonusCoins: 25,
    newRecordBonusCoins: 20
};

// 캐릭터별 캐치볼 낙하 아이템 (1순위 > 2순위 > 3순위, 폭탄은 공통 유지)
window.MangoGame.MINIGAME_ITEMS = {
    mango: {
        tier1: { emoji: '🥐', label: '빵', points: 30, happy: 4, exp: 12, speedBonus: 18, style: 'gold' },
        tier2: { emoji: '🥭', label: '과일', points: 20, happy: 3, exp: 8, speedBonus: 10, style: 'gold' },
        tier3: { emoji: '🎾', label: '공', points: 10, happy: 1, exp: 4, speedBonus: 0, style: '' }
    },
    tori: {
        tier1: { emoji: '🥩', label: '고기', points: 30, happy: 4, exp: 12, speedBonus: 18, style: 'gold' },
        tier2: { emoji: '🍳', label: '계란', points: 20, happy: 3, exp: 8, speedBonus: 10, style: 'gold' },
        tier3: { emoji: '🧸', label: '장난감', points: 10, happy: 1, exp: 4, speedBonus: 0, style: '' }
    },
    mimi: {
        tier1: { emoji: '💖', label: '하트', points: 30, happy: 4, exp: 12, speedBonus: 18, style: 'gold' },
        tier2: { emoji: '🥐', label: '빵', points: 20, happy: 3, exp: 8, speedBonus: 10, style: 'gold' },
        tier3: { emoji: '🛏️', label: '베개', points: 10, happy: 1, exp: 4, speedBonus: 0, style: '' }
    }
};

window.MangoGame.SHOP_ITEMS = [
    // 간식 (소모품)
    {
        id: 'milk',
        category: 'snack',
        name: '🥛 우유',
        price: 25,
        desc: '배고픔 +35, 경험치 +25',
        effect: { hunger: 35, happy: 5, fatigue: 0, exp: 25 }
    },
    {
        id: 'energy_drink',
        category: 'snack',
        name: '⚡ 에너지 드링크',
        price: 45,
        desc: '피로도 -40 (미니게임 연속용)',
        effect: { hunger: 0, happy: 5, fatigue: -40, exp: 10 }
    },
    {
        id: 'steak',
        category: 'snack',
        name: '🥩 특제 스테이크',
        price: 60,
        desc: '배고픔 +70, 행복 +15, 경험치 +50',
        effect: { hunger: 70, happy: 15, fatigue: 0, exp: 50 }
    },

    // 액세서리 (영구 보유)
    {
        id: 'acc_ribbon',
        category: 'accessory',
        name: '🎀 빨간 리본',
        price: 120,
        desc: '귀 옆에 귀여운 픽셀 리본 장착',
        cssClass: 'acc-ribbon'
    },
    {
        id: 'acc_sunglasses',
        category: 'accessory',
        name: '🕶️ 선글라스',
        price: 200,
        desc: '멋쟁이 픽셀 선글라스 장착',
        cssClass: 'acc-sunglasses'
    },
    {
        id: 'acc_crown',
        category: 'accessory',
        name: '👑 미니 왕관',
        price: 350,
        desc: '머리 위 황금 왕관 장착',
        cssClass: 'acc-crown'
    },

    // 배경 테마 (영구 보유)
    {
        id: 'theme_sakura',
        category: 'theme',
        name: '🌸 벚꽃 공원',
        price: 250,
        desc: '파스텔 핑크 하늘과 꽃잎 배경',
        themeClass: 'theme-sakura'
    },
    {
        id: 'theme_beach',
        category: 'theme',
        name: '🏖️ 여름 해변',
        price: 300,
        desc: '시원한 바다와 모래사장 배경',
        themeClass: 'theme-beach'
    },
    {
        id: 'theme_camping',
        category: 'theme',
        name: '🌙 별빛 캠핑',
        price: 400,
        desc: '별빛 밤하늘과 모닥불 배경',
        themeClass: 'theme-camping'
    }
];
