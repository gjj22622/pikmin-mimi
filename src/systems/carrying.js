import { CONFIG } from '../config.js';
import { distance, angle } from '../core/utils.js';
import { PikminState } from '../entities/pikmin.js';

export class Carrying {
  constructor(game) {
    this.game = game;
  }

  update(dt) {
    const game = this.game;
    const items = [...game.treasures, ...game.pellets];

    for (const item of items) {
      if (!item.active) continue;

      // 計算附近想搬運的皮克敏
      if (!item.beingCarried) {
        this._recruitCarriers(item);
      }

      // 搬運中移動
      if (item.beingCarried) {
        this._moveToOnion(item, dt);
      }
    }
  }

  _recruitCarriers(item) {
    // 檢查 IDLE 狀態附近的皮克敏自動靠過來搬
    const game = this.game;
    let count = 0;

    for (const p of game.pikminList) {
      if (!p.active) continue;
      if (p.carryTarget === item) {
        count++;
        continue;
      }
    }

    item.carrierCount = count;

    // 足夠的皮克敏 → 開始搬運
    if (count >= item.weight) {
      item.beingCarried = true;
      item.carriers = game.pikminList.filter(p => p.active && p.carryTarget === item);
    }
  }

  startCarry(pikmin, item) {
    if (item.beingCarried) return;
    pikmin.state = PikminState.CARRYING;
    pikmin.carryTarget = item;
    item.carrierCount = (item.carrierCount || 0) + 1;

    // 檢查是否達到搬運門檻
    if (item.carrierCount >= item.weight) {
      item.beingCarried = true;
    }
  }

  _moveToOnion(item, dt) {
    const game = this.game;
    const onion = this._findNearestOnion(item);
    if (!onion) return;

    // 朝 Onion 移動
    const a = angle(item, onion);
    const speedBonus = Math.min(item.carrierCount / item.weight, 2);
    const spd = CONFIG.TREASURE_CARRY_SPEED * speedBonus;

    item.x += Math.cos(a) * spd * dt;
    item.y += Math.sin(a) * spd * dt;

    // 搬運的皮克敏跟著走
    const carriers = game.pikminList.filter(p => p.active && p.carryTarget === item);
    for (let i = 0; i < carriers.length; i++) {
      const p = carriers[i];
      const ca = (i / carriers.length) * Math.PI * 2;
      p.x = item.x + Math.cos(ca) * (item.radius + 5);
      p.y = item.y + Math.sin(ca) * (item.radius + 5);
    }
  }

  _findNearestOnion(item) {
    const game = this.game;
    let nearest = null;
    let minDist = Infinity;
    for (const onion of game.onions) {
      const d = distance(item, onion);
      if (d < minDist) {
        minDist = d;
        nearest = onion;
      }
    }
    return nearest;
  }
}
