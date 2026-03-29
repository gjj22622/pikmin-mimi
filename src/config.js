// 遊戲常數設定
export const CONFIG = {
  // Canvas / 畫面
  CANVAS_WIDTH: 960,
  CANVAS_HEIGHT: 640,
  WORLD_WIDTH: 3200,
  WORLD_HEIGHT: 2400,

  // 隊長
  CAPTAIN_SPEED: 160,       // px/s
  CAPTAIN_RADIUS: 16,
  CAPTAIN_COLOR: '#3B5998',

  // 皮克敏
  PIKMIN_SPEED: 150,        // px/s
  PIKMIN_RADIUS: 6,
  PIKMIN_THROW_SPEED: 400,  // px/s
  PIKMIN_THROW_ARC: 80,     // 拋物線高度
  PIKMIN_THROW_DURATION: 0.35, // 秒
  PIKMIN_ATTACK_DPS: 1.5,   // 每秒傷害
  PIKMIN_MAX_FIELD: 100,    // 場上最大數量
  PIKMIN_SEPARATION: 14,    // 分離距離
  PIKMIN_FOLLOW_DISTANCE: 50, // 跟隨距離

  // 皮克敏類型
  PIKMIN_TYPES: {
    RED: {
      color: '#E53935',
      name: 'Red Pikmin',
      nameCh: '紅皮克敏',
      attackMultiplier: 1.5,
      fireImmune: true,
      waterImmune: false,
      feature: 'nose', // 尖鼻子
    },
    BLUE: {
      color: '#1E88E5',
      name: 'Blue Pikmin',
      nameCh: '藍皮克敏',
      attackMultiplier: 1.0,
      fireImmune: false,
      waterImmune: true,
      feature: 'mouth', // 有嘴巴
    },
    YELLOW: {
      color: '#FDD835',
      name: 'Yellow Pikmin',
      nameCh: '黃皮克敏',
      attackMultiplier: 1.0,
      fireImmune: false,
      waterImmune: false,
      throwMultiplier: 1.5, // 投擲更高更遠
      feature: 'ears', // 大耳朵
    },
  },

  // 皮克敏成長階段
  PIKMIN_STAGES: {
    LEAF: { speed: 1.0, attack: 1.0 },
    BUD: { speed: 1.2, attack: 1.2 },
    FLOWER: { speed: 1.5, attack: 1.5 },
  },

  // 敵人
  BULBORB_HP: 15,
  BULBORB_RADIUS: 28,
  BULBORB_SPEED: 40,
  BULBORB_BITE_DAMAGE: 1,   // 吞食一隻皮克敏
  BULBORB_SHAKE_INTERVAL: 3, // 秒
  BULBORB_DETECT_RANGE: 120,
  BULBORB_PELLET_VALUE: 5,   // 搬回 Onion 產出的皮克敏數

  DWARF_BULBORB_HP: 3,
  DWARF_BULBORB_RADIUS: 14,
  DWARF_BULBORB_SPEED: 50,
  DWARF_BULBORB_PELLET_VALUE: 2,

  // Onion
  ONION_RADIUS: 30,

  // 寶物
  TREASURE_CARRY_SPEED: 40, // 搬運基礎速度

  // Pellet（花蜜球）
  PELLET_RADIUS: 10,
  PELLET_WEIGHTS: { SMALL: 1, MEDIUM: 5, LARGE: 10 },

  // 日數系統
  DAY_DURATION: 180,        // 秒（3 分鐘）
  SUNSET_WARNING: 30,       // 日落前 30 秒警告

  // 吹哨
  WHISTLE_MIN_RADIUS: 20,
  WHISTLE_MAX_RADIUS: 120,
  WHISTLE_EXPAND_SPEED: 200, // px/s

  // 鏡頭
  CAMERA_LERP: 0.08,        // 平滑跟隨速度

  // 虛擬搖桿
  JOYSTICK_RADIUS: 50,
  JOYSTICK_KNOB_RADIUS: 22,
  JOYSTICK_DEAD_ZONE: 8,

  // 顏色
  COLORS: {
    GROUND: '#5D8233',
    GROUND_DARK: '#4A6B28',
    WATER: 'rgba(30, 136, 229, 0.4)',
    WATER_DEEP: 'rgba(21, 101, 192, 0.6)',
    SKY_DAY: '#87CEEB',
    SKY_SUNSET: '#FF6B35',
    SKY_NIGHT: '#1A1A2E',
    UI_BG: 'rgba(0, 0, 0, 0.5)',
    UI_TEXT: '#FFFFFF',
  },
};
