import { Bulborb, DwarfBulborb } from '../entities/bulborb.js';
import { Treasure } from '../entities/treasure.js';
import { Pellet } from '../entities/pellet.js';
import { Sprout } from '../entities/sprout.js';

// The Impact Site — 第一關
export const LEVEL_01 = {
  name: 'The Garden',
  nameCh: '花園入口',

  worldWidth: 3200,
  worldHeight: 2400,

  captainStart: { x: 400, y: 1200 },

  onions: [
    { x: 350, y: 1100, type: 'RED' },
    { x: 500, y: 1100, type: 'BLUE' },
  ],

  enemies: [
    // 大 Bulborb（睡覺中）
    {
      create: () => {
        const b = new Bulborb(1200, 800, [
          { x: 1200, y: 800 },
          { x: 1400, y: 900 },
        ]);
        b.sleeping = true;
        return b;
      }
    },
    // 小眼蟲群
    {
      create: () => new DwarfBulborb(900, 600, [
        { x: 900, y: 600 },
        { x: 1000, y: 650 },
      ])
    },
    {
      create: () => new DwarfBulborb(950, 650, [
        { x: 950, y: 650 },
        { x: 850, y: 700 },
      ])
    },
    // 遠處的大 Bulborb
    {
      create: () => {
        const b = new Bulborb(2200, 1400, [
          { x: 2200, y: 1400 },
          { x: 2400, y: 1500 },
          { x: 2300, y: 1600 },
        ]);
        b.sleeping = true;
        return b;
      }
    },
    // 另一群小眼蟲
    {
      create: () => new DwarfBulborb(1600, 1200, [
        { x: 1600, y: 1200 },
        { x: 1700, y: 1250 },
      ])
    },
    {
      create: () => new DwarfBulborb(1650, 1250, [
        { x: 1650, y: 1250 },
        { x: 1550, y: 1300 },
      ])
    },
  ],

  treasures: [
    {
      create: () => new Treasure(1500, 500, 'bottle_cap', 5, 100),
    },
    {
      create: () => new Treasure(2500, 1800, 'coin', 3, 50),
    },
    {
      create: () => new Treasure(800, 1800, 'battery', 8, 200),
    },
  ],

  pellets: [
    // 散佈的花蜜球
    { create: () => new Pellet(600, 500, 1, 'RED') },
    { create: () => new Pellet(700, 400, 1, 'RED') },
    { create: () => new Pellet(1100, 1000, 5, 'RED') },
    { create: () => new Pellet(1800, 600, 1, 'BLUE') },
    { create: () => new Pellet(500, 1600, 1, 'BLUE') },
  ],

  sprouts: [
    // 初始可拔的苗
    { create: () => new Sprout(300, 1250, 'RED') },
    { create: () => new Sprout(350, 1280, 'RED') },
    { create: () => new Sprout(420, 1260, 'RED') },
    { create: () => new Sprout(480, 1240, 'BLUE') },
    { create: () => new Sprout(460, 1290, 'BLUE') },
  ],

  obstacles: [
    // 大石頭
    { x: 700, y: 900, radius: 40, type: 'rock' },
    { x: 1300, y: 1100, radius: 35, type: 'rock' },
    { x: 2000, y: 800, radius: 50, type: 'rock' },
    // 灌木叢
    { x: 1000, y: 1400, radius: 30, type: 'bush' },
    { x: 1100, y: 1450, radius: 25, type: 'bush' },
    { x: 2600, y: 1000, radius: 35, type: 'bush' },
    // 邊界岩石
    { x: 100, y: 500, radius: 60, type: 'rock' },
    { x: 3000, y: 2200, radius: 55, type: 'rock' },
  ],

  waterZones: [
    // 池塘
    { x: 1600, y: 1600, w: 300, h: 200 },
    // 小溪
    { x: 2000, y: 400, w: 100, h: 400 },
  ],
};
