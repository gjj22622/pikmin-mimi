import { CONFIG } from '../config.js';
import { Sprout } from '../entities/sprout.js';
import { PikminState } from '../entities/pikmin.js';

export class Breeding {
  constructor(game) {
    this.game = game;
    this.spawnQueue = []; // { type, count, onion }
  }

  update(dt) {
    // 處理產出佇列
    for (let i = this.spawnQueue.length - 1; i >= 0; i--) {
      const entry = this.spawnQueue[i];
      entry.timer -= dt;
      if (entry.timer <= 0) {
        this._spawnSprout(entry);
        entry.count--;
        entry.timer = 0.3; // 每 0.3 秒產一個
        if (entry.count <= 0) {
          this.spawnQueue.splice(i, 1);
        }
      }
    }
  }

  // 物品被 Onion 吸收
  absorbItem(item, onion) {
    const game = this.game;

    // 釋放搬運的皮克敏
    for (const p of game.pikminList) {
      if (p.carryTarget === item) {
        p.state = PikminState.IDLE;
        p.carryTarget = null;
      }
    }

    item.active = false;

    // 開始吸收動畫
    onion.startAbsorb();

    // 計算產出數量
    let spawnCount = item.value || 1;

    // 如果皮克敏類型匹配 Onion 類型，產出更多
    if (item.colorType === onion.type) {
      spawnCount = item.value || 1;
    } else {
      spawnCount = Math.max(1, Math.floor((item.value || 1) / 2));
    }

    // 寶物加分
    if (item.treasureType) {
      game.score += item.value;
    }

    // 加入產出佇列
    this.spawnQueue.push({
      type: onion.type,
      count: spawnCount,
      onion: onion,
      timer: 0.5, // 吸收動畫後開始
    });

    game.particles.emitAbsorb(item.x, item.y, onion.x, onion.y);
  }

  _spawnSprout(entry) {
    const game = this.game;
    const onion = entry.onion;

    // 在 Onion 下方隨機位置長出苗
    const angle = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * 30;
    const sx = onion.x + Math.cos(angle) * dist;
    const sy = onion.y + 35 + Math.sin(angle) * dist * 0.3;

    const sprout = new Sprout(sx, sy, entry.type);
    game.sprouts.push(sprout);

    // 同時更新 Onion 儲備計數
    game.pikminInOnion[entry.type] = (game.pikminInOnion[entry.type] || 0) + 1;
  }
}
