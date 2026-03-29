import { CONFIG } from '../config.js';
import { Pikmin, PikminState } from '../entities/pikmin.js';
import { distance, angle, normalize } from '../core/utils.js';

export class Squad {
  constructor(game) {
    this.game = game;

    // 吹哨狀態
    this.whistling = false;
    this.whistleX = 0;
    this.whistleY = 0;
    this.whistleRadius = 0;

    // 投擲冷卻
    this.throwCooldown = 0;
  }

  update(dt, input) {
    const game = this.game;
    const captain = game.captain;
    if (!captain) return;

    // 更新按鈕位置
    input.updateButtonPositions(game.canvas.width, game.canvas.height);

    // 投擲冷卻
    this.throwCooldown = Math.max(0, this.throwCooldown - dt);

    // 處理吹哨
    if (input.isWhistling()) {
      if (!this.whistling) {
        this.whistling = true;
        this.whistleX = captain.x;
        this.whistleY = captain.y;
        this.whistleRadius = CONFIG.WHISTLE_MIN_RADIUS;
      }
      this.whistleX = captain.x;
      this.whistleY = captain.y;
      this.whistleRadius = Math.min(
        this.whistleRadius + CONFIG.WHISTLE_EXPAND_SPEED * dt,
        CONFIG.WHISTLE_MAX_RADIUS
      );

      // 召回範圍內的皮克敏
      for (const p of game.pikminList) {
        if (!p.active) continue;
        if (p.state === PikminState.IDLE || p.state === PikminState.DROWNING) {
          if (distance(p, { x: this.whistleX, y: this.whistleY }) < this.whistleRadius) {
            p.state = PikminState.FOLLOWING;
            p.drowning = false;
          }
        }
      }
    } else {
      this.whistling = false;
      this.whistleRadius = 0;
    }

    // 處理投擲
    if (input.isThrowPressed() && this.throwCooldown <= 0) {
      this._throwPikmin(input, captain);
    }

    // 處理切換皮克敏類型
    if (input.switchTypeJustPressed) {
      this._switchType();
    }

    // 更新跟隨中的皮克敏目標位置（群聚 AI）
    this._updateFlocking(captain);

    // 更新所有皮克敏
    for (const p of game.pikminList) {
      p.update(dt);
    }
  }

  _throwPikmin(input, captain) {
    const game = this.game;
    const target = input.getWorldTarget(game.camera);

    // 找到最近的跟隨中且類型匹配的皮克敏
    let closest = null;
    let closestDist = Infinity;

    for (const p of game.pikminList) {
      if (p.state !== PikminState.FOLLOWING || !p.active) continue;
      if (p.type !== game.selectedType) continue;
      const d = distance(p, captain);
      if (d < closestDist) {
        closestDist = d;
        closest = p;
      }
    }

    // 如果找不到選定類型，找任何跟隨中的
    if (!closest) {
      for (const p of game.pikminList) {
        if (p.state !== PikminState.FOLLOWING || !p.active) continue;
        const d = distance(p, captain);
        if (d < closestDist) {
          closestDist = d;
          closest = p;
        }
      }
    }

    if (closest) {
      closest.throwTo(target.x, target.y);
      this.throwCooldown = 0.15; // 投擲間隔

      // 粒子效果
      game.particles.emitThrow(captain.x, captain.y);
    }
  }

  _switchType() {
    const types = Object.keys(CONFIG.PIKMIN_TYPES);
    const idx = types.indexOf(this.game.selectedType);
    this.game.selectedType = types[(idx + 1) % types.length];
  }

  _updateFlocking(captain) {
    const followers = this.game.pikminList.filter(
      p => p.state === PikminState.FOLLOWING && p.active
    );

    if (followers.length === 0) return;

    // 計算隊長移動方向（用來決定隊伍在身後展開）
    const captainMoving = Math.abs(captain.vx) > 5 || Math.abs(captain.vy) > 5;
    const behindAngle = captain.facingAngle + Math.PI; // 背後方向

    for (let i = 0; i < followers.length; i++) {
      const p = followers[i];

      // 計算目標位置：隊長身後的半圓形散佈
      let targetX, targetY;

      if (captainMoving) {
        // 移動中：在隊長身後排成隊伍
        const row = Math.floor(i / 5);
        const col = i % 5 - 2;
        const spread = 12;
        const rowDist = CONFIG.PIKMIN_FOLLOW_DISTANCE + row * spread;

        targetX = captain.x + Math.cos(behindAngle) * rowDist + Math.cos(behindAngle + Math.PI / 2) * col * spread;
        targetY = captain.y + Math.sin(behindAngle) * rowDist + Math.sin(behindAngle + Math.PI / 2) * col * spread;
      } else {
        // 靜止：環繞隊長散開
        const ring = Math.floor(i / 8);
        const posInRing = i % 8;
        const ringAngle = (posInRing / 8) * Math.PI * 2 + ring * 0.5;
        const ringDist = 30 + ring * 15;

        targetX = captain.x + Math.cos(ringAngle) * ringDist;
        targetY = captain.y + Math.sin(ringAngle) * ringDist;
      }

      p.targetX = targetX;
      p.targetY = targetY;

      // 分離力：避免重疊
      let sepX = 0, sepY = 0;
      for (let j = 0; j < followers.length; j++) {
        if (i === j) continue;
        const other = followers[j];
        const dx = p.x - other.x;
        const dy = p.y - other.y;
        const distSq = dx * dx + dy * dy;
        const minDist = CONFIG.PIKMIN_SEPARATION;

        if (distSq < minDist * minDist && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (minDist - dist) / dist * 2;
          sepX += dx * force;
          sepY += dy * force;
        }
      }

      p.separationVx = sepX;
      p.separationVy = sepY;
    }
  }

  spawnInitialPikmin() {
    const game = this.game;
    const onion = game.onions[0];
    if (!onion) return;

    // 從 Onion 儲備中叫出皮克敏
    const spawnCount = { RED: 5, BLUE: 3 };

    for (const [type, count] of Object.entries(spawnCount)) {
      const available = game.pikminInOnion[type] || 0;
      const toSpawn = Math.min(count, available);

      for (let i = 0; i < toSpawn; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 20;
        const p = new Pikmin(
          onion.x + Math.cos(angle) * dist,
          onion.y + Math.sin(angle) * dist,
          type
        );
        p.state = PikminState.FOLLOWING;
        game.pikminList.push(p);
        game.pikminInOnion[type] -= 1;
      }
    }
  }

  // 吹哨視覺效果渲染
  renderWhistle(ctx) {
    if (!this.whistling || this.whistleRadius <= 0) return;

    // 擴散波紋
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(this.whistleX, this.whistleY, this.whistleRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 內圈
    ctx.fillStyle = 'rgba(255, 255, 100, 0.1)';
    ctx.beginPath();
    ctx.arc(this.whistleX, this.whistleY, this.whistleRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}
