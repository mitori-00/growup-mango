window.MangoGame = window.MangoGame || {};

window.MangoGame.CHARACTERS = [
    {
        id: 'mango',
        name: '망고',
        title: 'GROW UP MANGO',
        breed: '포메라니안',
        desc: '노릇한 귀·등과 풍성한 하얀 목털의 해맑은 포메',
        sizeScale: 1.0
    },
    {
        id: 'tori',
        name: '토리',
        title: 'GROW UP TORI',
        breed: '2kg 말티즈',
        desc: '작고 복슬복슬한 순한 눈망울의 하얀 말티즈',
        sizeScale: 0.88
    }
];

window.MangoGame.DEFAULT_STATE = {
    character: 'mango',
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
        desc: '호기심 많은 아기 강아지 시절이에요.'
    },
    {
        id: 'teen',
        stage: 'TEEN',
        namePrefix: '청소년',
        icon: '🐕',
        condition: 'Lv.06 도달',
        desc: '부쩍 자라서 산책과 놀이를 좋아해요.'
    },
    {
        id: 'adult_foodie',
        stage: 'ADULT',
        namePrefix: '먹보',
        icon: '🍖',
        condition: 'Lv.11 달성 시 밥 비율 1위',
        desc: '맛있는 간식을 제일 좋아하는 빨간 턱받이 스타일!'
    },
    {
        id: 'adult_sporty',
        stage: 'ADULT',
        namePrefix: '에너자이저',
        icon: '⚽',
        condition: 'Lv.11 달성 시 놀이 비율 1위',
        desc: '스포츠 머리띠를 두른 체력왕 스타일!'
    },
    {
        id: 'adult_sleepy',
        stage: 'ADULT',
        namePrefix: '잠꾸러기',
        icon: '💤',
        condition: 'Lv.11 달성 시 수면 비율 1위',
        desc: '수면 모자를 쓰고 늘 포근하게 졸고 있는 스타일!'
    },
    {
        id: 'adult_balanced',
        stage: 'ADULT',
        namePrefix: '황금 밸런스',
        icon: '✨',
        condition: 'Lv.11 달성 시 밥·놀이·수면 균형',
        desc: '고르게 사랑받아 황금빛으로 빛나는 희귀 형태!'
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
