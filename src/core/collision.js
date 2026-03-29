import { distance, circleCollide } from './utils.js';

export function checkCollisions(game) {
  const { captain, pikminList, enemies, treasures, pellets, sprouts, onions, waterZones } = game;

  // 皮克敏 vs 敵人（戰鬥由 combat 系統在投擲命中時處理）
  // 這裡處理敵人主動攻擊範圍內的皮克敏

  for (const enemy of enemies) {
    if (!enemy.active) continue;

    // 敵人吞食：嘴巴範圍內的皮克敏
    if (enemy.biteReady) {
      for (const p of pikminList) {
        if (!p.active || p.state === 'THROWN' || p.state === 'DEAD') continue;
        if (p.state === 'ATTACKING' && p.attachedTo === enemy) continue;
        if (circleCollide(enemy.mouthPos || enemy, p)) {
          game.combat.pikminEaten(p, enemy);
          enemy.biteReady = false;
          break;
        }
      }
    }
  }

  // 投擲中的皮克敏命中目標
  for (const p of pikminList) {
    if (p.state !== 'THROWN' || !p.active) continue;

    // 命中敵人
    for (const enemy of enemies) {
      if (!enemy.active) continue;
      if (circleCollide(p, enemy)) {
        game.combat.pikminHitEnemy(p, enemy);
        break;
      }
    }

    // 命中寶物/Pellet
    if (p.state === 'THROWN') {
      for (const t of [...treasures, ...pellets]) {
        if (!t.active || t.beingCarried) continue;
        if (circleCollide(p, t)) {
          game.carrying.startCarry(p, t);
          break;
        }
      }
    }
  }

  // 隊長接觸苗 → 拔出
  for (const s of sprouts) {
    if (!s.active || s.beingPlucked) continue;
    if (circleCollide(captain, s)) {
      s.pluck(game);
    }
  }

  // 搬運物接觸 Onion → 吸收
  for (const item of [...treasures, ...pellets]) {
    if (!item.active || !item.beingCarried) continue;
    for (const onion of onions) {
      if (distance(item, onion) < onion.radius + 10) {
        game.breeding.absorbItem(item, onion);
      }
    }
  }

  // 皮克敏在水中（非藍色會溺水）
  for (const p of pikminList) {
    if (!p.active || p.type === 'BLUE') continue;
    for (const zone of waterZones) {
      if (isInWaterZone(p, zone)) {
        if (!p.drowning) {
          p.drowning = true;
          p.drownTimer = 3; // 3 秒後死亡
        }
      }
    }
  }
}

function isInWaterZone(entity, zone) {
  // 簡易矩形水域
  return entity.x >= zone.x && entity.x <= zone.x + zone.w &&
         entity.y >= zone.y && entity.y <= zone.y + zone.h;
}
