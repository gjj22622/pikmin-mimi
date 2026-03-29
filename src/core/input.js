import { CONFIG } from '../config.js';

export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;
    this.mouseJustPressed = false;
    this._mouseWasDown = false;

    // 虛擬搖桿狀態
    this.joystick = {
      active: false,
      touchId: null,
      baseX: 0,
      baseY: 0,
      knobX: 0,
      knobY: 0,
      dx: 0,  // -1 到 1
      dy: 0,
    };

    // 觸控動作（非搖桿的觸控 = 投擲/互動）
    this.tapX = 0;
    this.tapY = 0;
    this.tapJustPressed = false;
    this._tapPending = false;

    // 吹哨按鈕
    this.whistleActive = false;
    this.whistleTouchId = null;

    // 切換皮克敏類型
    this.switchTypeJustPressed = false;
    this._switchPending = false;

    // 鍵盤事件
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.code);
      e.preventDefault();
    });
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });

    // 滑鼠事件
    canvas.addEventListener('mousedown', (e) => {
      this.mouseDown = true;
      this._updateMouse(e);
    });
    canvas.addEventListener('mouseup', () => {
      this.mouseDown = false;
    });
    canvas.addEventListener('mousemove', (e) => {
      this._updateMouse(e);
    });

    // 觸控事件
    canvas.addEventListener('touchstart', (e) => this._onTouchStart(e), { passive: false });
    canvas.addEventListener('touchmove', (e) => this._onTouchMove(e), { passive: false });
    canvas.addEventListener('touchend', (e) => this._onTouchEnd(e), { passive: false });
    canvas.addEventListener('touchcancel', (e) => this._onTouchEnd(e), { passive: false });

    // UI 按鈕區域（在螢幕座標系中）
    this.buttons = {
      whistle: { x: 0, y: 0, radius: 35 },
      switchType: { x: 0, y: 0, radius: 28 },
    };
  }

  _updateMouse(e) {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.mouseX = (e.clientX - rect.left) * dpr;
    this.mouseY = (e.clientY - rect.top) * dpr;
  }

  _onTouchStart(e) {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const screenW = rect.width;
    const screenH = rect.height;

    for (const touch of e.changedTouches) {
      const tx = (touch.clientX - rect.left);
      const ty = (touch.clientY - rect.top);
      const cx = tx * dpr;
      const cy = ty * dpr;

      // 檢查吹哨按鈕
      const wb = this.buttons.whistle;
      if (this._hitButton(tx, ty, wb, screenW, screenH)) {
        this.whistleActive = true;
        this.whistleTouchId = touch.identifier;
        continue;
      }

      // 檢查切換類型按鈕
      const sb = this.buttons.switchType;
      if (this._hitButton(tx, ty, sb, screenW, screenH)) {
        this._switchPending = true;
        continue;
      }

      // 左半邊 → 虛擬搖桿
      if (tx < screenW * 0.4 && !this.joystick.active) {
        this.joystick.active = true;
        this.joystick.touchId = touch.identifier;
        this.joystick.baseX = cx;
        this.joystick.baseY = cy;
        this.joystick.knobX = cx;
        this.joystick.knobY = cy;
        this.joystick.dx = 0;
        this.joystick.dy = 0;
        continue;
      }

      // 其餘 → 點擊（投擲/互動）
      this.tapX = cx;
      this.tapY = cy;
      this._tapPending = true;
      this.mouseX = cx;
      this.mouseY = cy;
      this.mouseDown = true;
    }
  }

  _onTouchMove(e) {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    for (const touch of e.changedTouches) {
      const cx = (touch.clientX - rect.left) * dpr;
      const cy = (touch.clientY - rect.top) * dpr;

      if (this.joystick.active && touch.identifier === this.joystick.touchId) {
        const dx = cx - this.joystick.baseX;
        const dy = cy - this.joystick.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = CONFIG.JOYSTICK_RADIUS * dpr;

        if (dist > maxDist) {
          this.joystick.knobX = this.joystick.baseX + (dx / dist) * maxDist;
          this.joystick.knobY = this.joystick.baseY + (dy / dist) * maxDist;
        } else {
          this.joystick.knobX = cx;
          this.joystick.knobY = cy;
        }

        const clamped = Math.min(dist, maxDist);
        if (clamped < CONFIG.JOYSTICK_DEAD_ZONE * dpr) {
          this.joystick.dx = 0;
          this.joystick.dy = 0;
        } else {
          this.joystick.dx = (dx / dist) * (clamped / maxDist);
          this.joystick.dy = (dy / dist) * (clamped / maxDist);
        }
      }
    }
  }

  _onTouchEnd(e) {
    e.preventDefault();
    for (const touch of e.changedTouches) {
      if (this.joystick.active && touch.identifier === this.joystick.touchId) {
        this.joystick.active = false;
        this.joystick.touchId = null;
        this.joystick.dx = 0;
        this.joystick.dy = 0;
      }
      if (touch.identifier === this.whistleTouchId) {
        this.whistleActive = false;
        this.whistleTouchId = null;
      }
    }
    if (e.touches.length === 0) {
      this.mouseDown = false;
    }
  }

  _hitButton(tx, ty, btn, screenW, screenH) {
    // 按鈕位置用比例計算
    const bx = btn.screenX || 0;
    const by = btn.screenY || 0;
    const dx = tx - bx;
    const dy = ty - by;
    return dx * dx + dy * dy < btn.radius * btn.radius;
  }

  update() {
    // 計算 mouseJustPressed
    this.mouseJustPressed = this.mouseDown && !this._mouseWasDown;
    this._mouseWasDown = this.mouseDown;

    // 計算 tapJustPressed
    this.tapJustPressed = this._tapPending;
    this._tapPending = false;

    // 計算 switchType
    this.switchTypeJustPressed = this._switchPending;
    this._switchPending = false;
  }

  // 取得移動方向（搖桿或鍵盤）
  getMovement() {
    // 優先使用虛擬搖桿
    if (this.joystick.active) {
      return { x: this.joystick.dx, y: this.joystick.dy };
    }

    // 鍵盤
    let dx = 0, dy = 0;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) dy = -1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) dy = 1;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) dx = -1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) dx = 1;

    // 正規化對角線
    if (dx !== 0 && dy !== 0) {
      const inv = 1 / Math.SQRT2;
      dx *= inv;
      dy *= inv;
    }

    return { x: dx, y: dy };
  }

  // 是否按下投擲
  isThrowPressed() {
    return this.tapJustPressed || this.keys.has('Space') || this.mouseJustPressed;
  }

  // 是否正在吹哨
  isWhistling() {
    return this.whistleActive || this.keys.has('KeyZ');
  }

  // 取得世界座標的目標位置
  getWorldTarget(camera) {
    return {
      x: this.mouseX + camera.x - this.canvas.width / 2,
      y: this.mouseY + camera.y - this.canvas.height / 2,
    };
  }

  // 更新按鈕位置（每幀根據畫面大小計算）
  updateButtonPositions(canvasW, canvasH) {
    const dpr = window.devicePixelRatio || 1;
    const sw = canvasW / dpr;
    const sh = canvasH / dpr;

    // 吹哨按鈕：右下角
    this.buttons.whistle.screenX = sw - 70;
    this.buttons.whistle.screenY = sh - 80;

    // 切換類型：右上角
    this.buttons.switchType.screenX = sw - 55;
    this.buttons.switchType.screenY = 55;
  }

  // 渲染虛擬搖桿
  renderJoystick(ctx) {
    if (!this.joystick.active) return;

    const dpr = window.devicePixelRatio || 1;
    const baseR = CONFIG.JOYSTICK_RADIUS * dpr;
    const knobR = CONFIG.JOYSTICK_KNOB_RADIUS * dpr;

    // 底座
    ctx.beginPath();
    ctx.arc(this.joystick.baseX, this.joystick.baseY, baseR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 搖桿
    ctx.beginPath();
    ctx.arc(this.joystick.knobX, this.joystick.knobY, knobR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fill();
  }
}
