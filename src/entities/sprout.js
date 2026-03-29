import { Entity } from './entity.js';
import { CONFIG } from '../config.js';
import { Pikmin, PikminState } from './pikmin.js';
import { drawSprout } from '../rendering/sprites.js';

export class Sprout extends Entity {
  constructor(x, y, type = 'RED') {
    super(x, y, 8);
    this.type = type;
    this.beingPlucked = false;
    this.pluckTimer = 0;
  }

  pluck(game) {
    if (this.beingPlucked) return;
    this.beingPlucked = true;
    this.pluckTimer = 0.3; // 拔出動畫時間

    // 建立新皮克敏
    setTimeout(() => {
      if (!this.active) return;
      const p = new Pikmin(this.x, this.y - 5, this.type);
      p.state = PikminState.FOLLOWING;
      game.pikminList.push(p);
      this.active = false;
      game.particles.emitPluck(this.x, this.y);
    }, 300);
  }

  render(ctx) {
    if (!this.active) return;

    // 拔出動畫
    if (this.beingPlucked) {
      ctx.save();
      ctx.globalAlpha = 0.5 + Math.sin(this.frame * 20) * 0.5;
      drawSprout(ctx, this.x, this.y, this.type, this.frame);
      ctx.restore();
      return;
    }

    drawSprout(ctx, this.x, this.y, this.type, this.frame);
  }
}
