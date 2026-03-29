import { CONFIG } from '../config.js';

export class UI {
  constructor(ctx) {
    this.ctx = ctx;
  }

  render(game) {
    const ctx = this.ctx;
    const w = game.canvas.width;
    const h = game.canvas.height;
    const dpr = window.devicePixelRatio || 1;

    // 皮克敏計數器（左上角）
    this._drawPikminCounter(ctx, 10 * dpr, 10 * dpr, game, dpr);

    // 太陽時鐘（頂部中間）
    this._drawSunClock(ctx, w / 2, 20 * dpr, game, dpr);

    // 日數（右上角）
    this._drawDayCounter(ctx, w - 80 * dpr, 10 * dpr, game, dpr);

    // 吹哨按鈕（右下角）
    this._drawWhistleButton(ctx, w, h, game, dpr);

    // 切換類型按鈕（右側）
    this._drawSwitchButton(ctx, w, h, game, dpr);

    // 分數（左下角）
    this._drawScore(ctx, 10 * dpr, h - 20 * dpr, game, dpr);
  }

  _drawPikminCounter(ctx, x, y, game, dpr) {
    const fieldCount = game.pikminList.filter(p => p.active).length;
    const types = ['RED', 'BLUE'];

    ctx.save();
    // 背景
    ctx.fillStyle = CONFIG.COLORS.UI_BG;
    const panelW = 120 * dpr;
    const panelH = 50 * dpr;
    ctx.beginPath();
    ctx.roundRect(x, y, panelW, panelH, 8 * dpr);
    ctx.fill();

    // 總數
    ctx.fillStyle = '#FFF';
    ctx.font = `bold ${14 * dpr}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(`Pikmin: ${fieldCount}`, x + 8 * dpr, y + 18 * dpr);

    // 各類型數量
    let tx = x + 8 * dpr;
    for (const type of types) {
      const count = game.pikminList.filter(p => p.active && p.type === type).length;
      const inOnion = game.pikminInOnion[type] || 0;
      const color = CONFIG.PIKMIN_TYPES[type].color;

      // 小圓點
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(tx + 4 * dpr, y + 36 * dpr, 4 * dpr, 0, Math.PI * 2);
      ctx.fill();

      // 數量
      ctx.fillStyle = '#FFF';
      ctx.font = `${10 * dpr}px sans-serif`;
      ctx.fillText(`${count}(${inOnion})`, tx + 10 * dpr, y + 40 * dpr);
      tx += 50 * dpr;
    }

    // 選中類型指示
    ctx.strokeStyle = CONFIG.PIKMIN_TYPES[game.selectedType].color;
    ctx.lineWidth = 2 * dpr;
    ctx.beginPath();
    ctx.roundRect(x, y, panelW, panelH, 8 * dpr);
    ctx.stroke();

    ctx.restore();
  }

  _drawSunClock(ctx, cx, y, game, dpr) {
    ctx.save();

    const sunPos = game.dayCycle.getSunPosition();
    const timeStr = game.dayCycle.getFormattedTime();

    // 背景弧
    const arcR = 40 * dpr;
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 3 * dpr;
    ctx.beginPath();
    ctx.arc(cx, y + 25 * dpr, arcR, Math.PI, 0);
    ctx.stroke();

    // 太陽位置
    const sunAngle = Math.PI + sunPos * Math.PI; // 從左到右
    const sunX = cx + Math.cos(sunAngle) * arcR;
    const sunY = y + 25 * dpr + Math.sin(sunAngle) * arcR;

    // 太陽
    const sunColor = sunPos > 0.7 ? '#FF6B35' : '#FFD54F';
    ctx.fillStyle = sunColor;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 6 * dpr, 0, Math.PI * 2);
    ctx.fill();

    // 光芒
    ctx.strokeStyle = sunColor;
    ctx.lineWidth = 1 * dpr;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(sunX + Math.cos(a) * 7 * dpr, sunY + Math.sin(a) * 7 * dpr);
      ctx.lineTo(sunX + Math.cos(a) * 10 * dpr, sunY + Math.sin(a) * 10 * dpr);
      ctx.stroke();
    }

    // 時間文字
    ctx.fillStyle = game.dayCycle.isSunsetWarning() ? '#FF6B35' : '#FFF';
    ctx.font = `bold ${12 * dpr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(timeStr, cx, y + 50 * dpr);

    ctx.restore();
  }

  _drawDayCounter(ctx, x, y, game, dpr) {
    ctx.save();
    ctx.fillStyle = CONFIG.COLORS.UI_BG;
    ctx.beginPath();
    ctx.roundRect(x, y, 70 * dpr, 25 * dpr, 6 * dpr);
    ctx.fill();

    ctx.fillStyle = '#FFF';
    ctx.font = `bold ${12 * dpr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`Day ${game.day}`, x + 35 * dpr, y + 17 * dpr);
    ctx.restore();
  }

  _drawWhistleButton(ctx, w, h, game, dpr) {
    const bx = w - 70 * dpr;
    const by = h - 80 * dpr;
    const r = 30 * dpr;

    // 更新按鈕位置
    game.input.buttons.whistle.screenX = (w - 70 * dpr) / dpr;
    game.input.buttons.whistle.screenY = (h - 80 * dpr) / dpr;

    ctx.save();
    // 背景圓
    ctx.fillStyle = game.input.isWhistling()
      ? 'rgba(255, 255, 100, 0.5)'
      : 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2 * dpr;
    ctx.stroke();

    // 哨子圖示
    ctx.fillStyle = '#FFF';
    ctx.font = `${16 * dpr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('📣', bx, by);

    ctx.restore();
  }

  _drawSwitchButton(ctx, w, h, game, dpr) {
    const bx = w - 55 * dpr;
    const by = 70 * dpr;

    game.input.buttons.switchType.screenX = bx / dpr;
    game.input.buttons.switchType.screenY = by / dpr;

    const color = CONFIG.PIKMIN_TYPES[game.selectedType].color;

    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.arc(bx, by, 22 * dpr, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(bx, by, 16 * dpr, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2 * dpr;
    ctx.beginPath();
    ctx.arc(bx, by, 22 * dpr, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  _drawScore(ctx, x, y, game, dpr) {
    ctx.save();
    ctx.fillStyle = CONFIG.COLORS.UI_BG;
    ctx.beginPath();
    ctx.roundRect(x, y - 18 * dpr, 90 * dpr, 22 * dpr, 6 * dpr);
    ctx.fill();

    ctx.fillStyle = '#FFD54F';
    ctx.font = `bold ${11 * dpr}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${game.score}`, x + 8 * dpr, y - 2 * dpr);
    ctx.restore();
  }
}
