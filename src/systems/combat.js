import { CONFIG } from '../config.js';
import { PikminState } from '../entities/pikmin.js';

export class Combat {
  constructor(game) {
    this.game = game;
  }

  update(dt) {
    const game = this.game;

    // 處理附著的皮克敏造成傷害
    for (const enemy of game.enemies) {
      if (!enemy.active) continue;

      for (const p of enemy.attachedPikmin) {
        if (!p.active || p.state !== PikminState.ATTACKING) continue;

        const typeConfig = CONFIG.PIKMIN_TYPES[p.type];
        const stageConfig = CONFIG.PIKMIN_STAGES[p.stage];
        const dps = CONFIG.PIKMIN_ATTACK_DPS * typeConfig.attackMultiplier * stageConfig.attack;

        enemy.takeDamage(dps * dt);
      }

      // 敵人死亡 → 掉落 pellet
      if (!enemy.active && enemy._droppedPellet) {
        game.pellets.push(enemy._droppedPellet);
        enemy._droppedPellet = null;
        game.particles.emitDeath(enemy.x, enemy.y);
      }
    }
  }

  // 投擲的皮克敏命中敵人
  pikminHitEnemy(pikmin, enemy) {
    pikmin.attachToEnemy(enemy);
    enemy.attachedPikmin.push(pikmin);
    enemy.sleeping = false; // 被攻擊一定會醒

    this.game.particles.emitImpact(pikmin.x, pikmin.y);
  }

  // 敵人吞食皮克敏
  pikminEaten(pikmin, enemy) {
    pikmin.active = false;
    pikmin.state = PikminState.DEAD;
    enemy.biteCooldown = 1.5; // 吞食後的冷卻

    this.game.particles.emitDeath(pikmin.x, pikmin.y, pikmin.type);
  }
}
