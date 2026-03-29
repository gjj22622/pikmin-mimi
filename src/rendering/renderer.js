import { CONFIG } from '../config.js';
import { seededRandom } from '../core/utils.js';

export class Renderer {
  constructor(ctx) {
    this.ctx = ctx;
    this.worldCacheCanvas = null;
    this.worldCacheDirty = true;
  }

  renderWorld(game) {
    const ctx = this.ctx;

    // 繪製地面（草地紋理）
    this._drawGround(ctx, game);

    // 障礙物
    for (const obs of game.obstacles) {
      this._drawObstacle(ctx, obs);
    }
  }

  _drawGround(ctx, game) {
    // 如果已有快取，直接繪製
    if (this.worldCacheCanvas && !this.worldCacheDirty) {
      ctx.drawImage(this.worldCacheCanvas, 0, 0);
      return;
    }

    // 建立離屏快取
    this.worldCacheCanvas = document.createElement('canvas');
    this.worldCacheCanvas.width = CONFIG.WORLD_WIDTH;
    this.worldCacheCanvas.height = CONFIG.WORLD_HEIGHT;
    const wctx = this.worldCacheCanvas.getContext('2d');

    // 基礎草地
    wctx.fillStyle = CONFIG.COLORS.GROUND;
    wctx.fillRect(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);

    // 隨機草地色塊
    const rng = seededRandom(42);
    for (let i = 0; i < 500; i++) {
      const gx = rng() * CONFIG.WORLD_WIDTH;
      const gy = rng() * CONFIG.WORLD_HEIGHT;
      const gr = 20 + rng() * 40;
      wctx.fillStyle = rng() > 0.5 ? CONFIG.COLORS.GROUND_DARK : '#6B9B37';
      wctx.globalAlpha = 0.3;
      wctx.beginPath();
      wctx.ellipse(gx, gy, gr, gr * 0.6, rng() * Math.PI, 0, Math.PI * 2);
      wctx.fill();
    }
    wctx.globalAlpha = 1;

    // 小草裝飾
    for (let i = 0; i < 300; i++) {
      const gx = rng() * CONFIG.WORLD_WIDTH;
      const gy = rng() * CONFIG.WORLD_HEIGHT;
      wctx.strokeStyle = rng() > 0.5 ? '#7CB342' : '#558B2F';
      wctx.lineWidth = 1;
      const h = 4 + rng() * 8;
      wctx.beginPath();
      wctx.moveTo(gx, gy);
      wctx.quadraticCurveTo(gx + (rng() - 0.5) * 6, gy - h, gx + (rng() - 0.5) * 4, gy - h * 1.2);
      wctx.stroke();
    }

    // 小花裝飾
    for (let i = 0; i < 60; i++) {
      const fx = rng() * CONFIG.WORLD_WIDTH;
      const fy = rng() * CONFIG.WORLD_HEIGHT;
      const fc = ['#FFF', '#FFE082', '#F48FB1', '#CE93D8', '#81D4FA'][Math.floor(rng() * 5)];
      wctx.fillStyle = fc;
      for (let j = 0; j < 4; j++) {
        const a = (j / 4) * Math.PI * 2;
        wctx.beginPath();
        wctx.ellipse(fx + Math.cos(a) * 2.5, fy + Math.sin(a) * 2.5, 2, 1, a, 0, Math.PI * 2);
        wctx.fill();
      }
      wctx.fillStyle = '#FFD54F';
      wctx.beginPath();
      wctx.arc(fx, fy, 1.5, 0, Math.PI * 2);
      wctx.fill();
    }

    // 小石頭
    for (let i = 0; i < 30; i++) {
      const sx = rng() * CONFIG.WORLD_WIDTH;
      const sy = rng() * CONFIG.WORLD_HEIGHT;
      wctx.fillStyle = '#9E9E9E';
      wctx.beginPath();
      wctx.ellipse(sx, sy, 3 + rng() * 4, 2 + rng() * 2, rng() * Math.PI, 0, Math.PI * 2);
      wctx.fill();
    }

    this.worldCacheDirty = false;
    ctx.drawImage(this.worldCacheCanvas, 0, 0);
  }

  _drawObstacle(ctx, obs) {
    ctx.save();
    ctx.translate(obs.x, obs.y);

    if (obs.type === 'rock') {
      ctx.fillStyle = '#757575';
      ctx.beginPath();
      ctx.ellipse(0, 0, obs.radius, obs.radius * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.beginPath();
      ctx.ellipse(-obs.radius * 0.2, -obs.radius * 0.2, obs.radius * 0.4, obs.radius * 0.3, -0.3, 0, Math.PI * 2);
      ctx.fill();
    } else if (obs.type === 'bush') {
      ctx.fillStyle = '#388E3C';
      ctx.beginPath();
      ctx.arc(0, 0, obs.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2E7D32';
      ctx.beginPath();
      ctx.arc(-obs.radius * 0.3, -obs.radius * 0.2, obs.radius * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  renderWater(waterZones) {
    const ctx = this.ctx;
    for (const zone of waterZones) {
      ctx.fillStyle = CONFIG.COLORS.WATER;
      ctx.fillRect(zone.x, zone.y, zone.w, zone.h);

      // 水波紋
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      const t = Date.now() / 1000;
      for (let i = 0; i < 3; i++) {
        const wy = zone.y + zone.h * (0.25 + i * 0.25) + Math.sin(t * 2 + i) * 3;
        ctx.beginPath();
        for (let wx = zone.x; wx < zone.x + zone.w; wx += 10) {
          const sy = wy + Math.sin((wx + t * 50) * 0.05) * 2;
          if (wx === zone.x) ctx.moveTo(wx, sy);
          else ctx.lineTo(wx, sy);
        }
        ctx.stroke();
      }
    }
  }

  renderSunsetOverlay(ctx, canvas, progress) {
    // progress: 1 → 0 (日落過程)
    ctx.fillStyle = `rgba(0, 0, 0, ${(1 - progress) * 0.7})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}
