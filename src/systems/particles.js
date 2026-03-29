import { CONFIG } from '../config.js';

class Particle {
  constructor(x, y, vx, vy, life, color, size) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
    this.color = color;
    this.size = size;
    this.active = true;
  }
}

export class Particles {
  constructor() {
    this.particles = [];
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 50 * dt; // 重力
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  render(ctx) {
    for (const p of this.particles) {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // 投擲時的粒子
  emitThrow(x, y) {
    for (let i = 0; i < 5; i++) {
      this.particles.push(new Particle(
        x, y,
        (Math.random() - 0.5) * 60,
        -Math.random() * 40 - 20,
        0.3 + Math.random() * 0.2,
        '#FFF',
        2
      ));
    }
  }

  // 撞擊效果
  emitImpact(x, y) {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      this.particles.push(new Particle(
        x, y,
        Math.cos(a) * 80,
        Math.sin(a) * 80,
        0.3,
        '#FFE082',
        3
      ));
    }
  }

  // 死亡效果（皮克敏靈魂飄走）
  emitDeath(x, y, type) {
    const color = CONFIG.PIKMIN_TYPES[type]?.color || '#FFF';
    // 靈魂粒子（向上飄）
    for (let i = 0; i < 6; i++) {
      this.particles.push(new Particle(
        x + (Math.random() - 0.5) * 10,
        y,
        (Math.random() - 0.5) * 20,
        -60 - Math.random() * 40,
        1 + Math.random() * 0.5,
        color,
        3
      ));
    }
    // 白色靈魂
    this.particles.push(new Particle(
      x, y, 0, -80, 1.5, 'rgba(255,255,255,0.8)', 5
    ));
  }

  // 拔苗效果（泥土飛濺）
  emitPluck(x, y) {
    for (let i = 0; i < 8; i++) {
      this.particles.push(new Particle(
        x, y,
        (Math.random() - 0.5) * 80,
        -Math.random() * 60 - 20,
        0.4 + Math.random() * 0.3,
        '#795548',
        2 + Math.random() * 2
      ));
    }
  }

  // Onion 吸收效果
  emitAbsorb(fromX, fromY, toX, toY) {
    for (let i = 0; i < 10; i++) {
      const t = i / 10;
      this.particles.push(new Particle(
        fromX + (toX - fromX) * t,
        fromY + (toY - fromY) * t,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        0.5 + t * 0.5,
        '#FFF9C4',
        2 + Math.random() * 2
      ));
    }
  }

  // 敵人死亡效果
  emitEnemyDeath(x, y) {
    for (let i = 0; i < 15; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 40 + Math.random() * 80;
      this.particles.push(new Particle(
        x, y,
        Math.cos(a) * spd,
        Math.sin(a) * spd - 30,
        0.5 + Math.random() * 0.5,
        Math.random() > 0.5 ? '#FFEB3B' : '#FFF',
        3 + Math.random() * 3
      ));
    }
  }
}
