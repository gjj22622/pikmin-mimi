import { Entity } from './entity.js';
import { CONFIG } from '../config.js';
import { drawOnion } from '../rendering/sprites.js';

export class Onion extends Entity {
  constructor(x, y, type = 'RED') {
    super(x, y, CONFIG.ONION_RADIUS);
    this.type = type;
    this.absorbing = false;
    this.absorbTimer = 0;
  }

  update(dt) {
    this.frame += dt;
    if (this.absorbing) {
      this.absorbTimer -= dt;
      if (this.absorbTimer <= 0) {
        this.absorbing = false;
      }
    }
  }

  startAbsorb() {
    this.absorbing = true;
    this.absorbTimer = 1;
  }

  render(ctx) {
    drawOnion(ctx, this.x, this.y, this.type, this.frame);

    // 吸收動畫
    if (this.absorbing) {
      ctx.save();
      ctx.globalAlpha = this.absorbTimer;
      ctx.strokeStyle = CONFIG.PIKMIN_TYPES[this.type]?.color || '#FFF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + 30);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();

      // 光柱
      ctx.fillStyle = CONFIG.PIKMIN_TYPES[this.type]?.color || '#FFF';
      ctx.globalAlpha = this.absorbTimer * 0.3;
      ctx.fillRect(this.x - 5, this.y, 10, 30);
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }
}
