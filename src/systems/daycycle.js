import { CONFIG } from '../config.js';

export class DayCycle {
  constructor() {
    this.timeRemaining = CONFIG.DAY_DURATION;
    this.totalTime = CONFIG.DAY_DURATION;
    this.warned = false;
  }

  reset() {
    this.timeRemaining = CONFIG.DAY_DURATION;
    this.warned = false;
  }

  update(dt) {
    this.timeRemaining = Math.max(0, this.timeRemaining - dt);

    if (this.timeRemaining <= CONFIG.SUNSET_WARNING && !this.warned) {
      this.warned = true;
    }
  }

  isNight() {
    return this.timeRemaining <= 0;
  }

  isSunsetWarning() {
    return this.warned && this.timeRemaining > 0;
  }

  // 取得太陽位置（0 = 日出, 0.5 = 正午, 1 = 日落）
  getSunPosition() {
    return 1 - (this.timeRemaining / this.totalTime);
  }

  // 取得格式化時間
  getFormattedTime() {
    const mins = Math.floor(this.timeRemaining / 60);
    const secs = Math.floor(this.timeRemaining % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // 繪製天空漸變（日落效果）
  renderSkyTint(ctx, canvas) {
    const sunPos = this.getSunPosition();

    if (sunPos < 0.7) return; // 白天不需要漸變

    // 日落漸變
    const intensity = (sunPos - 0.7) / 0.3; // 0 到 1
    const r = Math.floor(255 * intensity * 0.3);
    const g = Math.floor(100 * intensity * 0.2);
    const b = Math.floor(50 * intensity * 0.1);
    const alpha = intensity * 0.35;

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 日落警告時閃爍邊框
    if (this.isSunsetWarning()) {
      const flash = Math.sin(Date.now() / 300) * 0.5 + 0.5;
      ctx.strokeStyle = `rgba(255, 100, 0, ${flash * 0.4})`;
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
    }
  }
}
