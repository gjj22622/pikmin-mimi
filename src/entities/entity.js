export class Entity {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = radius;
    this.active = true;
    this.facingAngle = 0;
    this.frame = 0;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.frame += dt;

    if (this.vx !== 0 || this.vy !== 0) {
      this.facingAngle = Math.atan2(this.vy, this.vx);
    }
  }

  render(ctx) {
    // 由子類別實作
  }
}
