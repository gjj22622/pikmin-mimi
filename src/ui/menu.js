import { CONFIG } from '../config.js';
import { TEXTS } from './i18n.js';
import { GameState } from '../core/game.js';

export class Menu {
  constructor(ctx, game) {
    this.ctx = ctx;
    this.game = game;
    this.titleFrame = 0;
    this.pikminBobs = [];

    // 標題畫面的裝飾皮克敏
    for (let i = 0; i < 12; i++) {
      this.pikminBobs.push({
        x: 0.15 + Math.random() * 0.7,
        y: 0.55 + Math.random() * 0.25,
        type: ['RED', 'BLUE', 'RED', 'RED', 'BLUE'][Math.floor(Math.random() * 5)],
        speed: 0.5 + Math.random() * 1.5,
        offset: Math.random() * Math.PI * 2,
      });
    }
  }

  update(dt, input) {
    this.titleFrame += dt;

    // 點擊開始
    if (input.tapJustPressed || input.mouseJustPressed || input.keys.has('Space') || input.keys.has('Enter')) {
      this.game.startDay();
    }
  }

  updateNightResult(dt, input) {
    this.titleFrame += dt;

    // 點擊繼續
    if (this.titleFrame > 1.5 && (input.tapJustPressed || input.mouseJustPressed || input.keys.has('Space') || input.keys.has('Enter'))) {
      this.titleFrame = 0;
      this.game.startDay();
    }
  }

  render(ctx) {
    const w = this.game.canvas.width;
    const h = this.game.canvas.height;
    const dpr = window.devicePixelRatio || 1;

    // 背景
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.6, '#98D8A0');
    gradient.addColorStop(1, '#5D8233');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // 裝飾草地
    ctx.fillStyle = '#4A6B28';
    ctx.beginPath();
    for (let x = 0; x < w; x += 20) {
      const gy = h * 0.75 + Math.sin(x * 0.02 + this.titleFrame) * 10;
      if (x === 0) ctx.moveTo(x, gy);
      else ctx.lineTo(x, gy);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // 裝飾皮克敏（走動的小點）
    for (const p of this.pikminBobs) {
      const px = p.x * w + Math.sin(this.titleFrame * p.speed + p.offset) * 20 * dpr;
      const py = p.y * h + Math.sin(this.titleFrame * 2 + p.offset) * 5;
      const color = CONFIG.PIKMIN_TYPES[p.type].color;

      // 身體
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(px, py, 4 * dpr, 6 * dpr, 0, 0, Math.PI * 2);
      ctx.fill();

      // 莖和葉子
      ctx.strokeStyle = '#66BB6A';
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();
      ctx.moveTo(px, py - 6 * dpr);
      ctx.lineTo(px + Math.sin(this.titleFrame * 3 + p.offset) * 2 * dpr, py - 14 * dpr);
      ctx.stroke();
      ctx.fillStyle = '#66BB6A';
      ctx.beginPath();
      ctx.ellipse(
        px + Math.sin(this.titleFrame * 3 + p.offset) * 2 * dpr,
        py - 15 * dpr, 3 * dpr, 1.5 * dpr, 0, 0, Math.PI * 2
      );
      ctx.fill();

      // 小眼睛
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.arc(px - 1.5 * dpr, py - 2 * dpr, 1.5 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px + 1.5 * dpr, py - 2 * dpr, 1.5 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(px - 1.5 * dpr, py - 1.5 * dpr, 0.8 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px + 1.5 * dpr, py - 1.5 * dpr, 0.8 * dpr, 0, Math.PI * 2);
      ctx.fill();
    }

    // 標題
    const titleSize = Math.min(48 * dpr, w * 0.08);
    ctx.fillStyle = '#FFF';
    ctx.font = `bold ${titleSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.fillText(TEXTS.title, w / 2, h * 0.2);

    ctx.font = `bold ${titleSize * 0.6}px sans-serif`;
    ctx.fillText(TEXTS.subtitle, w / 2, h * 0.2 + titleSize * 0.9);
    ctx.shadowBlur = 0;

    // 開始按鈕
    const btnW = 200 * dpr;
    const btnH = 50 * dpr;
    const btnX = w / 2 - btnW / 2;
    const btnY = h * 0.42;
    const pulse = 1 + Math.sin(this.titleFrame * 3) * 0.03;

    ctx.save();
    ctx.translate(w / 2, btnY + btnH / 2);
    ctx.scale(pulse, pulse);

    ctx.fillStyle = '#E53935';
    ctx.beginPath();
    ctx.roundRect(-btnW / 2, -btnH / 2, btnW, btnH, 12 * dpr);
    ctx.fill();
    ctx.strokeStyle = '#B71C1C';
    ctx.lineWidth = 2 * dpr;
    ctx.stroke();

    ctx.fillStyle = '#FFF';
    ctx.font = `bold ${16 * dpr}px sans-serif`;
    ctx.fillText(TEXTS.startCh, 0, -4 * dpr);
    ctx.font = `${11 * dpr}px sans-serif`;
    ctx.fillText(TEXTS.start, 0, 12 * dpr);

    ctx.restore();

    // 操作提示
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = `${10 * dpr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(TEXTS.tutorialMove, w / 2, h * 0.55);
    ctx.fillText(TEXTS.tutorialThrow, w / 2, h * 0.55 + 16 * dpr);
    ctx.fillText(TEXTS.tutorialWhistle, w / 2, h * 0.55 + 32 * dpr);
  }

  renderNightResult(ctx, game) {
    const w = game.canvas.width;
    const h = game.canvas.height;
    const dpr = window.devicePixelRatio || 1;

    // 暗夜背景
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, '#1A1A2E');
    gradient.addColorStop(1, '#16213E');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // 星星
    ctx.fillStyle = '#FFF';
    for (let i = 0; i < 30; i++) {
      const sx = ((i * 137.5) % w);
      const sy = ((i * 91.3) % (h * 0.5));
      const twinkle = Math.sin(this.titleFrame * 3 + i) * 0.5 + 0.5;
      ctx.globalAlpha = twinkle;
      ctx.beginPath();
      ctx.arc(sx, sy, 1.5 * dpr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 標題
    ctx.fillStyle = '#FF6B35';
    ctx.font = `bold ${32 * dpr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(TEXTS.nightTitle, w / 2, h * 0.2);

    // Day 完成
    ctx.fillStyle = '#FFF';
    ctx.font = `${18 * dpr}px sans-serif`;
    ctx.fillText(`Day ${game.day - 1} Complete`, w / 2, h * 0.3);

    // 統計
    const safe = game.pikminList.filter(p => p.active).length;
    const lost = game.lostPikmin;

    ctx.font = `${14 * dpr}px sans-serif`;
    ctx.fillStyle = '#4CAF50';
    ctx.fillText(`✓ ${TEXTS.pikminSafe}: ${safe}`, w / 2, h * 0.42);

    if (lost > 0) {
      ctx.fillStyle = '#EF5350';
      ctx.fillText(`✗ ${TEXTS.pikminLost}: ${lost}`, w / 2, h * 0.48);
    }

    // 分數
    ctx.fillStyle = '#FFD54F';
    ctx.fillText(`Score: ${game.score}`, w / 2, h * 0.56);

    // 繼續按鈕（延遲顯示）
    if (this.titleFrame > 1.5) {
      const pulse = 1 + Math.sin(this.titleFrame * 3) * 0.02;
      ctx.save();
      ctx.translate(w / 2, h * 0.7);
      ctx.scale(pulse, pulse);

      ctx.fillStyle = '#1E88E5';
      ctx.beginPath();
      ctx.roundRect(-80 * dpr, -20 * dpr, 160 * dpr, 40 * dpr, 10 * dpr);
      ctx.fill();

      ctx.fillStyle = '#FFF';
      ctx.font = `bold ${14 * dpr}px sans-serif`;
      ctx.fillText(TEXTS.nextDay, 0, 4 * dpr);

      ctx.restore();
    }
  }
}
