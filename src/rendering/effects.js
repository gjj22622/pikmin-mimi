// 目前特效由 particles.js 和 daycycle.js 處理
// 此檔案保留給未來擴充用（畫面震動、轉場效果等）
export class Effects {
  constructor() {
    this.shakeAmount = 0;
    this.shakeDecay = 10;
  }

  shake(amount) {
    this.shakeAmount = amount;
  }

  update(dt) {
    this.shakeAmount = Math.max(0, this.shakeAmount - this.shakeDecay * dt);
  }

  getOffset() {
    if (this.shakeAmount <= 0) return { x: 0, y: 0 };
    return {
      x: (Math.random() - 0.5) * this.shakeAmount * 2,
      y: (Math.random() - 0.5) * this.shakeAmount * 2,
    };
  }
}
