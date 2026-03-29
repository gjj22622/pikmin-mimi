import { Entity } from './entity.js';
import { CONFIG } from '../config.js';
import { drawPellet } from '../rendering/sprites.js';

export class Pellet extends Entity {
  constructor(x, y, value = 1, colorType = 'RED') {
    super(x, y, CONFIG.PELLET_RADIUS);
    this.value = value;       // 搬回 Onion 產出的皮克敏數量
    this.colorType = colorType;
    this.weight = Math.max(1, Math.ceil(value / 2)); // 需要的搬運皮克敏數
    this.beingCarried = false;
    this.carriers = [];
    this.carrierCount = 0;
    this.color = CONFIG.PIKMIN_TYPES[colorType]?.color || '#FFF';
  }

  render(ctx) {
    if (!this.active) return;
    drawPellet(ctx, this.x, this.y, this.value, this.color, this.frame);

    // 顯示搬運需求
    if (this.carrierCount > 0 && !this.beingCarried) {
      ctx.fillStyle = '#FFF';
      ctx.font = '7px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${this.carrierCount}/${this.weight}`, this.x, this.y + 16);
    }
  }
}
