import { Entity } from './entity.js';
import { CONFIG } from '../config.js';
import { clamp, distance } from '../core/utils.js';
import { drawPikmin } from '../rendering/sprites.js';

export const PikminState = {
  FOLLOWING: 'FOLLOWING',
  THROWN: 'THROWN',
  ATTACKING: 'ATTACKING',
  CARRYING: 'CARRYING',
  IDLE: 'IDLE',
  IDLE_AT_ONION: 'IDLE_AT_ONION',
  DEAD: 'DEAD',
  PLUCKING: 'PLUCKING',
  DROWNING: 'DROWNING',
};

export class Pikmin extends Entity {
  constructor(x, y, type = 'RED') {
    super(x, y, CONFIG.PIKMIN_RADIUS);
    this.type = type;
    this.stage = 'LEAF'; // LEAF, BUD, FLOWER
    this.state = PikminState.FOLLOWING;

    this.speed = CONFIG.PIKMIN_SPEED;
    this.attackDps = CONFIG.PIKMIN_ATTACK_DPS;

    // 投擲相關
    this.throwTimer = 0;
    this.throwStartX = 0;
    this.throwStartY = 0;
    this.throwTargetX = 0;
    this.throwTargetY = 0;
    this.throwHeight = 0; // 目前拋物線高度（視覺用）

    // 攻擊相關
    this.attachedTo = null;
    this.attachAngle = 0;
    this.attachDist = 0;

    // 搬運相關
    this.carryTarget = null;

    // 溺水
    this.drowning = false;
    this.drownTimer = 3;

    // 落單（日落時）
    this.lost = false;
    this.lostTimer = 1.5;

    // 群聚 AI 用
    this.targetX = x;
    this.targetY = y;
    this.separationVx = 0;
    this.separationVy = 0;
  }

  update(dt) {
    this.frame += dt;

    switch (this.state) {
      case PikminState.FOLLOWING:
        this._updateFollowing(dt);
        break;
      case PikminState.THROWN:
        this._updateThrown(dt);
        break;
      case PikminState.ATTACKING:
        this._updateAttacking(dt);
        break;
      case PikminState.CARRYING:
        // 由 carrying 系統控制位置
        break;
      case PikminState.IDLE:
        this._updateIdle(dt);
        break;
      case PikminState.DROWNING:
        this._updateDrowning(dt);
        break;
    }
  }

  _updateFollowing(dt) {
    // 朝目標位置移動（由 squad.js 設定 targetX/targetY）
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 2) {
      const stageBonus = CONFIG.PIKMIN_STAGES[this.stage].speed;
      const spd = this.speed * stageBonus;
      const moveX = (dx / dist) * spd + this.separationVx;
      const moveY = (dy / dist) * spd + this.separationVy;

      this.vx = moveX;
      this.vy = moveY;
      this.x += this.vx * dt;
      this.y += this.vy * dt;

      this.facingAngle = Math.atan2(dy, dx);
    } else {
      this.vx = 0;
      this.vy = 0;
    }

    // 世界邊界
    this.x = clamp(this.x, this.radius, CONFIG.WORLD_WIDTH - this.radius);
    this.y = clamp(this.y, this.radius, CONFIG.WORLD_HEIGHT - this.radius);
  }

  _updateThrown(dt) {
    this.throwTimer += dt;
    const t = this.throwTimer / CONFIG.PIKMIN_THROW_DURATION;

    if (t >= 1) {
      // 落地
      this.x = this.throwTargetX;
      this.y = this.throwTargetY;
      this.throwHeight = 0;
      this.state = PikminState.IDLE;
      this.vx = 0;
      this.vy = 0;
      return;
    }

    // 線性插值位置
    this.x = this.throwStartX + (this.throwTargetX - this.throwStartX) * t;
    this.y = this.throwStartY + (this.throwTargetY - this.throwStartY) * t;

    // 拋物線高度
    this.throwHeight = CONFIG.PIKMIN_THROW_ARC * 4 * t * (1 - t);
  }

  _updateAttacking(dt) {
    if (!this.attachedTo || !this.attachedTo.active) {
      this.state = PikminState.IDLE;
      this.attachedTo = null;
      return;
    }

    // 繞著敵人旋轉
    this.attachAngle += dt * 2;
    this.x = this.attachedTo.x + Math.cos(this.attachAngle) * this.attachDist;
    this.y = this.attachedTo.y + Math.sin(this.attachAngle) * this.attachDist;
  }

  _updateIdle(dt) {
    // 閒置時微微晃動
    this.vx = Math.sin(this.frame * 2 + this.x) * 5;
    this.vy = Math.cos(this.frame * 2 + this.y) * 5;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  _updateDrowning(dt) {
    this.drownTimer -= dt;
    // 掙扎動畫
    this.x += Math.sin(this.frame * 15) * 0.5;
    if (this.drownTimer <= 0) {
      this.active = false;
      this.state = PikminState.DEAD;
    }
  }

  throwTo(targetX, targetY) {
    this.state = PikminState.THROWN;
    this.throwTimer = 0;
    this.throwStartX = this.x;
    this.throwStartY = this.y;
    this.throwTargetX = targetX;
    this.throwTargetY = targetY;
    this.throwHeight = 0;
  }

  attachToEnemy(enemy) {
    this.state = PikminState.ATTACKING;
    this.attachedTo = enemy;
    this.attachAngle = Math.atan2(this.y - enemy.y, this.x - enemy.x);
    this.attachDist = enemy.radius * 0.8;
  }

  detach() {
    this.state = PikminState.IDLE;
    this.attachedTo = null;
    // 被甩飛
    const flingAngle = Math.random() * Math.PI * 2;
    this.x += Math.cos(flingAngle) * 20;
    this.y += Math.sin(flingAngle) * 20;
  }

  render(ctx) {
    if (!this.active) return;

    ctx.save();
    // 投擲時往上偏移模擬高度
    const visualY = this.y - (this.throwHeight || 0);
    drawPikmin(ctx, this.x, visualY, this.type, this.stage, this.state, this.frame, this.attachAngle);

    // 溺水效果
    if (this.state === PikminState.DROWNING) {
      ctx.fillStyle = 'rgba(30, 136, 229, 0.4)';
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, 6, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
