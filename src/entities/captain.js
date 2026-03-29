import { Entity } from './entity.js';
import { CONFIG } from '../config.js';
import { clamp } from '../core/utils.js';
import { drawCaptain } from '../rendering/sprites.js';

export class Captain extends Entity {
  constructor(x, y) {
    super(x, y, CONFIG.CAPTAIN_RADIUS);
    this.speed = CONFIG.CAPTAIN_SPEED;
  }

  update(dt, input, game) {
    const move = input.getMovement();
    this.vx = move.x * this.speed;
    this.vy = move.y * this.speed;

    super.update(dt);

    // 限制在世界邊界
    this.x = clamp(this.x, this.radius, CONFIG.WORLD_WIDTH - this.radius);
    this.y = clamp(this.y, this.radius, CONFIG.WORLD_HEIGHT - this.radius);

    // 障礙物碰撞
    if (game.obstacles) {
      for (const obs of game.obstacles) {
        this._pushOutOfObstacle(obs);
      }
    }
  }

  _pushOutOfObstacle(obs) {
    // 簡易圓形障礙物碰撞推出
    if (!obs.radius) return;
    const dx = this.x - obs.x;
    const dy = this.y - obs.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const minDist = this.radius + obs.radius;
    if (dist < minDist && dist > 0) {
      const push = (minDist - dist) / dist;
      this.x += dx * push;
      this.y += dy * push;
    }
  }

  render(ctx) {
    drawCaptain(ctx, this.x, this.y, this.facingAngle, this.frame);
  }
}
