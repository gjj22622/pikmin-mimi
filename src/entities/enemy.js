import { Entity } from './entity.js';
import { CONFIG } from '../config.js';
import { distance, angle } from '../core/utils.js';

export class Enemy extends Entity {
  constructor(x, y, radius, hp, speed) {
    super(x, y, radius);
    this.hp = hp;
    this.maxHp = hp;
    this.speed = speed;
    this.sleeping = true;
    this.pelletValue = 0;

    // 巡邏
    this.patrolPath = [];
    this.patrolIndex = 0;
    this.patrolWait = 0;

    // 戰鬥
    this.aggroTarget = null;
    this.aggroRange = CONFIG.BULBORB_DETECT_RANGE;
    this.biteReady = false;
    this.biteCooldown = 0;
    this.shakeTimer = 0;
    this.attachedPikmin = [];

    // 嘴巴位置（碰撞判定用）
    this.mouthPos = { x: x, y: y, radius: radius * 0.4 };

    // 死亡
    this.deathTimer = 0;
  }

  update(dt, game) {
    this.frame += dt;

    if (!this.active) return;

    const captain = game.captain;
    const distToCaptain = distance(this, captain);

    // 檢測是否被驚醒
    if (this.sleeping) {
      // 被皮克敏攻擊或隊長太近時醒來
      if (this.attachedPikmin.length > 0 || distToCaptain < this.aggroRange * 0.6) {
        this.sleeping = false;
      }
      this._updateMouthPos();
      return;
    }

    // 甩動計時（甩掉附著的皮克敏）
    if (this.attachedPikmin.length > 0) {
      this.shakeTimer -= dt;
      if (this.shakeTimer <= 0) {
        this._shake(game);
        this.shakeTimer = CONFIG.BULBORB_SHAKE_INTERVAL;
      }
    }

    // 咬擊冷卻
    this.biteCooldown -= dt;
    this.biteReady = this.biteCooldown <= 0 && !this.sleeping;

    // AI: 追擊或巡邏
    if (distToCaptain < this.aggroRange || this.attachedPikmin.length > 0) {
      // 追擊隊長
      this._chaseTarget(captain, dt);
      this.biteCooldown = Math.max(this.biteCooldown, 0);
    } else {
      // 巡邏
      this._patrol(dt);
    }

    this._updateMouthPos();
  }

  _chaseTarget(target, dt) {
    const a = angle(this, target);
    this.vx = Math.cos(a) * this.speed * 1.5;
    this.vy = Math.sin(a) * this.speed * 1.5;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.facingAngle = a;
  }

  _patrol(dt) {
    if (this.patrolPath.length === 0) return;

    this.patrolWait -= dt;
    if (this.patrolWait > 0) return;

    const target = this.patrolPath[this.patrolIndex];
    const dist = distance(this, target);

    if (dist < 5) {
      this.patrolIndex = (this.patrolIndex + 1) % this.patrolPath.length;
      this.patrolWait = 1 + Math.random() * 2;
      this.vx = 0;
      this.vy = 0;
      return;
    }

    const a = angle(this, target);
    this.vx = Math.cos(a) * this.speed;
    this.vy = Math.sin(a) * this.speed;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.facingAngle = a;
  }

  _shake(game) {
    // 甩掉 1-2 隻皮克敏
    const count = Math.min(this.attachedPikmin.length, 1 + Math.floor(Math.random() * 2));
    for (let i = 0; i < count; i++) {
      const p = this.attachedPikmin.pop();
      if (p && p.active) {
        p.detach();
        game.particles.emitImpact(p.x, p.y);
      }
    }
  }

  _updateMouthPos() {
    // 嘴巴在面朝方向的前方
    this.mouthPos.x = this.x + Math.cos(this.facingAngle) * this.radius * 0.7;
    this.mouthPos.y = this.y + Math.sin(this.facingAngle) * this.radius * 0.7;
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.die();
    }
  }

  die() {
    // 釋放所有附著的皮克敏
    for (const p of this.attachedPikmin) {
      if (p.active) {
        p.state = 'IDLE';
        p.attachedTo = null;
      }
    }
    this.attachedPikmin = [];
    this.active = false;
  }

  render(ctx) {
    // 由子類別實作
  }
}
