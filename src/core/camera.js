import { CONFIG } from '../config.js';
import { lerp, clamp } from './utils.js';

export class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.target = null;
  }

  update(dt) {
    if (!this.target) return;
    this.x = lerp(this.x, this.target.x, CONFIG.CAMERA_LERP);
    this.y = lerp(this.y, this.target.y, CONFIG.CAMERA_LERP);

    // 限制在世界邊界內
    // 留一些邊距讓畫面不超出
  }

  apply(ctx, canvas) {
    const offsetX = canvas.width / 2 - this.x;
    const offsetY = canvas.height / 2 - this.y;
    ctx.translate(Math.round(offsetX), Math.round(offsetY));
  }

  // 螢幕座標 → 世界座標
  screenToWorld(sx, sy, canvas) {
    return {
      x: sx - canvas.width / 2 + this.x,
      y: sy - canvas.height / 2 + this.y,
    };
  }

  // 世界座標 → 螢幕座標
  worldToScreen(wx, wy, canvas) {
    return {
      x: wx - this.x + canvas.width / 2,
      y: wy - this.y + canvas.height / 2,
    };
  }
}
