import { CONFIG } from '../config.js';
import { Input } from './input.js';
import { Camera } from './camera.js';
import { checkCollisions } from './collision.js';
import { Captain } from '../entities/captain.js';
import { Onion } from '../entities/onion.js';
import { Squad } from '../systems/squad.js';
import { Combat } from '../systems/combat.js';
import { Carrying } from '../systems/carrying.js';
import { Breeding } from '../systems/breeding.js';
import { DayCycle } from '../systems/daycycle.js';
import { Particles } from '../systems/particles.js';
import { Renderer } from '../rendering/renderer.js';
import { UI } from '../rendering/ui.js';
import { LevelManager } from '../levels/level-manager.js';
import { Menu } from '../ui/menu.js';

export const GameState = {
  TITLE: 'TITLE',
  PLAYING: 'PLAYING',
  DAY_END: 'DAY_END',
  NIGHT_RESULT: 'NIGHT_RESULT',
};

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = GameState.TITLE;
    this.day = 1;

    // 核心系統
    this.input = new Input(canvas);
    this.camera = new Camera();
    this.renderer = new Renderer(this.ctx);
    this.ui = new UI(this.ctx);
    this.menu = new Menu(this.ctx, this);
    this.particles = new Particles();
    this.dayCycle = new DayCycle();
    this.levelManager = new LevelManager();

    // 實體列表
    this.captain = null;
    this.pikminList = [];
    this.enemies = [];
    this.treasures = [];
    this.pellets = [];
    this.sprouts = [];
    this.onions = [];
    this.obstacles = [];
    this.waterZones = [];

    // 系統
    this.squad = new Squad(this);
    this.combat = new Combat(this);
    this.carrying = new Carrying(this);
    this.breeding = new Breeding(this);

    // 遊戲統計
    this.score = 0;
    this.pikminInOnion = { RED: 10, BLUE: 5, YELLOW: 0 };
    this.selectedType = 'RED';
    this.lostPikmin = 0;
  }

  startDay() {
    this.state = GameState.PLAYING;
    this.dayCycle.reset();
    this.lostPikmin = 0;

    // 載入關卡
    const levelData = this.levelManager.getCurrentLevel();
    this.loadLevel(levelData);
  }

  loadLevel(data) {
    this.captain = new Captain(data.captainStart.x, data.captainStart.y);
    this.camera.target = this.captain;
    this.camera.x = this.captain.x;
    this.camera.y = this.captain.y;

    this.enemies = data.enemies.map(e => e.create());
    this.treasures = data.treasures.map(t => t.create());
    this.pellets = data.pellets.map(p => p.create());
    this.sprouts = data.sprouts.map(s => s.create());
    this.obstacles = data.obstacles || [];
    this.waterZones = data.waterZones || [];

    this.onions = data.onions.map(o => new Onion(o.x, o.y, o.type));

    // 從 Onion 叫出初始皮克敏
    this.pikminList = [];
    this.squad.spawnInitialPikmin();
  }

  update(dt) {
    this.input.update();

    switch (this.state) {
      case GameState.TITLE:
        this.menu.update(dt, this.input);
        break;

      case GameState.PLAYING:
        this.updatePlaying(dt);
        break;

      case GameState.DAY_END:
        this.updateDayEnd(dt);
        break;

      case GameState.NIGHT_RESULT:
        this.menu.updateNightResult(dt, this.input);
        break;
    }
  }

  updatePlaying(dt) {
    // 隊長移動
    this.captain.update(dt, this.input, this);

    // 皮克敏 AI
    this.squad.update(dt, this.input);

    // 敵人
    for (const enemy of this.enemies) {
      enemy.update(dt, this);
    }

    // 搬運系統
    this.carrying.update(dt);

    // 繁殖系統
    this.breeding.update(dt);

    // 戰鬥系統
    this.combat.update(dt);

    // 碰撞偵測
    checkCollisions(this);

    // 日夜循環
    this.dayCycle.update(dt);
    if (this.dayCycle.isNight()) {
      this.startDayEnd();
    }

    // 粒子
    this.particles.update(dt);

    // 鏡頭
    this.camera.update(dt);

    // 清除死亡實體
    this.cleanup();
  }

  startDayEnd() {
    this.state = GameState.DAY_END;
    this.dayEndTimer = 3; // 3 秒日落動畫

    // 計算落單的皮克敏
    const onionPos = this.onions[0];
    for (const p of this.pikminList) {
      if (p.state !== 'FOLLOWING' && p.state !== 'IDLE_AT_ONION') {
        p.lost = true;
        this.lostPikmin++;
      }
    }
  }

  updateDayEnd(dt) {
    this.dayEndTimer -= dt;
    this.particles.update(dt);

    // 日落動畫中，落單皮克敏被吃掉的視覺效果
    for (const p of this.pikminList) {
      if (p.lost && p.active) {
        p.lostTimer = (p.lostTimer || 1.5) - dt;
        if (p.lostTimer <= 0) {
          p.active = false;
          this.particles.emitDeath(p.x, p.y, p.type);
        }
      }
    }

    if (this.dayEndTimer <= 0) {
      // 移除落單的皮克敏
      this.pikminList = this.pikminList.filter(p => !p.lost);
      this.state = GameState.NIGHT_RESULT;
      this.day++;
    }
  }

  cleanup() {
    this.enemies = this.enemies.filter(e => e.active);
    this.pellets = this.pellets.filter(p => p.active);
    this.treasures = this.treasures.filter(t => t.active);
    this.sprouts = this.sprouts.filter(s => s.active);
    this.pikminList = this.pikminList.filter(p => p.active);
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    switch (this.state) {
      case GameState.TITLE:
        this.menu.render(ctx);
        break;

      case GameState.PLAYING:
      case GameState.DAY_END:
        this.renderPlaying(ctx);
        break;

      case GameState.NIGHT_RESULT:
        this.menu.renderNightResult(ctx, this);
        break;
    }
  }

  renderPlaying(ctx) {
    ctx.save();
    this.camera.apply(ctx, this.canvas);

    // 世界場景
    this.renderer.renderWorld(this);

    // 水域
    this.renderer.renderWater(this.waterZones);

    // Onion
    for (const onion of this.onions) {
      onion.render(ctx);
    }

    // 寶物 & Pellets
    for (const t of this.treasures) t.render(ctx);
    for (const p of this.pellets) p.render(ctx);

    // 苗
    for (const s of this.sprouts) s.render(ctx);

    // 敵人
    for (const enemy of this.enemies) enemy.render(ctx);

    // 皮克敏
    for (const p of this.pikminList) p.render(ctx);

    // 隊長
    this.captain.render(ctx);

    // 粒子
    this.particles.render(ctx);

    // 吹哨視覺效果
    this.squad.renderWhistle(ctx);

    ctx.restore();

    // HUD（螢幕座標）
    this.ui.render(this);

    // 虛擬搖桿
    this.input.renderJoystick(ctx);

    // 日落效果
    if (this.state === GameState.DAY_END) {
      this.renderer.renderSunsetOverlay(ctx, this.canvas, this.dayEndTimer / 3);
    }

    // 日夜天空漸變
    this.dayCycle.renderSkyTint(ctx, this.canvas);
  }

  resize(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
  }
}
