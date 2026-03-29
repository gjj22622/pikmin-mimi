import { Enemy } from './enemy.js';
import { CONFIG } from '../config.js';
import { drawBulborb, drawDwarfBulborb } from '../rendering/sprites.js';
import { Pellet } from './pellet.js';

export class Bulborb extends Enemy {
  constructor(x, y, patrolPath = []) {
    super(x, y, CONFIG.BULBORB_RADIUS, CONFIG.BULBORB_HP, CONFIG.BULBORB_SPEED);
    this.patrolPath = patrolPath.length > 0 ? patrolPath : [{ x, y }];
    this.pelletValue = CONFIG.BULBORB_PELLET_VALUE;
    this.shakeTimer = CONFIG.BULBORB_SHAKE_INTERVAL;
  }

  die() {
    super.die();
    // 死亡後留下 pellet（搬回 Onion 產出皮克敏）
    this._spawnPellet();
  }

  _spawnPellet() {
    const pellet = new Pellet(this.x, this.y, this.pelletValue, 'RED');
    // 由 game 來添加（通過 combat 系統）
    this._droppedPellet = pellet;
  }

  render(ctx) {
    if (!this.active) return;
    drawBulborb(ctx, this.x, this.y, this.hp, this.maxHp, this.frame, this.sleeping);
  }
}

export class DwarfBulborb extends Enemy {
  constructor(x, y, patrolPath = []) {
    super(x, y, CONFIG.DWARF_BULBORB_RADIUS, CONFIG.DWARF_BULBORB_HP, CONFIG.DWARF_BULBORB_SPEED);
    this.patrolPath = patrolPath.length > 0 ? patrolPath : [{ x, y }];
    this.pelletValue = CONFIG.DWARF_BULBORB_PELLET_VALUE;
    this.aggroRange = 80;
    this.shakeTimer = 2;
  }

  die() {
    super.die();
    this._spawnPellet();
  }

  _spawnPellet() {
    const pellet = new Pellet(this.x, this.y, this.pelletValue, 'RED');
    this._droppedPellet = pellet;
  }

  render(ctx) {
    if (!this.active) return;
    drawDwarfBulborb(ctx, this.x, this.y, this.hp, this.maxHp, this.frame);
  }
}
