import { Game } from './core/game.js';

const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);

let displayWidth = 0;
let displayHeight = 0;

// 調整畫面大小
function resize() {
  displayWidth = window.innerWidth;
  displayHeight = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;
  canvas.style.width = displayWidth + 'px';
  canvas.style.height = displayHeight + 'px';

  game.resize(canvas.width, canvas.height);
}

window.addEventListener('resize', resize);
resize();

// 遊戲主迴圈
let lastTime = 0;

function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05); // 限制最大 dt
  lastTime = timestamp;

  game.update(dt);
  game.render();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
