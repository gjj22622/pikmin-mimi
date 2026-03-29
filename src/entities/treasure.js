import { Entity } from './entity.js';
import { drawTreasure } from '../rendering/sprites.js';

export class Treasure extends Entity {
  constructor(x, y, type, weight, value) {
    super(x, y, 12);
    this.treasureType = type; // 'bottle_cap', 'coin', 'battery'
    this.weight = weight;     // 需要幾隻皮克敏搬
    this.value = value;       // 分數
    this.beingCarried = false;
    this.carriers = [];
    this.carrierCount = 0;
  }

  render(ctx) {
    if (!this.active) return;
    drawTreasure(ctx, this.x, this.y, this.treasureType, this.frame);

    // 顯示搬運需求
    if (!this.beingCarried) {
      ctx.fillStyle = '#FFF';
      ctx.font = '8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${this.carrierCount}/${this.weight}`, this.x, this.y + 20);
    }
  }
}
