import { CONFIG } from '../config.js';

// ========== 隊長（Olimar 風格）==========
export function drawCaptain(ctx, x, y, angle, frame) {
  ctx.save();
  ctx.translate(x, y);

  const bob = Math.sin(frame * 8) * 1.5;
  const walking = Math.abs(Math.sin(frame * 10));

  // 影子
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(0, 14, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // 身體（太空服）
  ctx.fillStyle = '#C62828'; // 紅色太空服
  ctx.beginPath();
  ctx.ellipse(0, 4 + bob, 8, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#8E0000';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 腿（行走動畫）
  ctx.strokeStyle = '#5D4037';
  ctx.lineWidth = 2.5;
  const legSwing = walking * Math.sin(frame * 12) * 4;
  // 左腿
  ctx.beginPath();
  ctx.moveTo(-4, 12 + bob);
  ctx.lineTo(-5 - legSwing, 18);
  ctx.stroke();
  // 右腿
  ctx.beginPath();
  ctx.moveTo(4, 12 + bob);
  ctx.lineTo(5 + legSwing, 18);
  ctx.stroke();

  // 手臂
  ctx.strokeStyle = '#FFCCBC';
  ctx.lineWidth = 2;
  const armAngle = Math.sin(frame * 10) * 0.3;
  // 左手
  ctx.beginPath();
  ctx.moveTo(-7, 2 + bob);
  ctx.lineTo(-12, 6 + bob + Math.sin(armAngle) * 3);
  ctx.stroke();
  // 右手
  ctx.beginPath();
  ctx.moveTo(7, 2 + bob);
  ctx.lineTo(12, 6 + bob - Math.sin(armAngle) * 3);
  ctx.stroke();

  // 頭盔（圓形玻璃罩）
  ctx.fillStyle = '#E0E0E0';
  ctx.beginPath();
  ctx.arc(0, -6 + bob, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#9E9E9E';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 頭盔玻璃反光
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.arc(-3, -9 + bob, 4, 0, Math.PI * 2);
  ctx.fill();

  // 臉（頭盔裡面）
  ctx.fillStyle = '#FFCCBC';
  ctx.beginPath();
  ctx.arc(0, -5 + bob, 7, 0, Math.PI * 2);
  ctx.fill();

  // 眼睛
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(-3, -6 + bob, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(3, -6 + bob, 2, 0, Math.PI * 2);
  ctx.fill();

  // 眼睛高光
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(-2.5, -7 + bob, 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(3.5, -7 + bob, 0.8, 0, Math.PI * 2);
  ctx.fill();

  // 鼻子
  ctx.fillStyle = '#E8967A';
  ctx.beginPath();
  ctx.arc(0, -4 + bob, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // 天線
  ctx.strokeStyle = '#9E9E9E';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -17 + bob);
  ctx.lineTo(0 + Math.sin(frame * 3) * 2, -26 + bob);
  ctx.stroke();
  // 天線頂球
  ctx.fillStyle = '#F44336';
  ctx.beginPath();
  ctx.arc(Math.sin(frame * 3) * 2, -27 + bob, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ========== 皮克敏 ==========
export function drawPikmin(ctx, x, y, type, stage, state, frame, attachAngle) {
  const typeConfig = CONFIG.PIKMIN_TYPES[type];
  const color = typeConfig.color;

  ctx.save();
  ctx.translate(x, y);

  const bob = state === 'IDLE' ? Math.sin(frame * 4) * 1 : Math.sin(frame * 10) * 1;

  if (state === 'ATTACKING' && attachAngle !== undefined) {
    ctx.rotate(attachAngle + Math.PI / 2);
  }

  // 影子
  if (state !== 'THROWN' && state !== 'ATTACKING') {
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(0, 8, 4, 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 腿
  if (state !== 'ATTACKING') {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    const legAnim = Math.sin(frame * 14) * 3;
    ctx.beginPath();
    ctx.moveTo(-2, 5 + bob);
    ctx.lineTo(-3 - legAnim, 9);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(2, 5 + bob);
    ctx.lineTo(3 + legAnim, 9);
    ctx.stroke();
  }

  // 身體（水滴形）
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 1 + bob, 4, 5.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = darken(color, 0.3);
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // 眼睛
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(-1.5, -1 + bob, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(1.5, -1 + bob, 2, 0, Math.PI * 2);
  ctx.fill();
  // 瞳孔
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(-1.5, -0.5 + bob, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(1.5, -0.5 + bob, 1, 0, Math.PI * 2);
  ctx.fill();

  // 類型特徵
  if (typeConfig.feature === 'nose') {
    // 紅皮克敏：尖鼻子
    ctx.fillStyle = '#B71C1C';
    ctx.beginPath();
    ctx.moveTo(0, 0 + bob);
    ctx.lineTo(-1.5, 3 + bob);
    ctx.lineTo(1.5, 3 + bob);
    ctx.closePath();
    ctx.fill();
  } else if (typeConfig.feature === 'mouth') {
    // 藍皮克敏：嘴巴
    ctx.strokeStyle = '#0D47A1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 2 + bob, 2, 0.2, Math.PI - 0.2);
    ctx.stroke();
  } else if (typeConfig.feature === 'ears') {
    // 黃皮克敏：大耳朵
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(-4, -2 + bob, 2, 3.5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(4, -2 + bob, 2, 3.5, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 莖（頭頂）
  ctx.strokeStyle = '#4CAF50';
  ctx.lineWidth = 1;
  const stemSway = Math.sin(frame * 5 + x) * 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -5 + bob);
  ctx.quadraticCurveTo(stemSway, -10 + bob, stemSway * 0.5, -13 + bob);
  ctx.stroke();

  // 成長階段裝飾
  if (stage === 'LEAF') {
    ctx.fillStyle = '#66BB6A';
    ctx.beginPath();
    ctx.ellipse(stemSway * 0.5, -14 + bob, 3, 1.5, stemSway * 0.1, 0, Math.PI * 2);
    ctx.fill();
  } else if (stage === 'BUD') {
    ctx.fillStyle = '#AED581';
    ctx.beginPath();
    ctx.arc(stemSway * 0.5, -14 + bob, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFF9C4';
    ctx.beginPath();
    ctx.arc(stemSway * 0.5, -14.5 + bob, 1.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (stage === 'FLOWER') {
    // 花朵：五片花瓣
    const cx = stemSway * 0.5;
    const cy = -14 + bob;
    ctx.fillStyle = '#FFF';
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + frame * 0.5;
      ctx.beginPath();
      ctx.ellipse(cx + Math.cos(a) * 2.5, cy + Math.sin(a) * 2.5, 2, 1.2, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#FFEB3B';
    ctx.beginPath();
    ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// ========== Bulborb（大眼蟲）==========
export function drawBulborb(ctx, x, y, hp, maxHp, frame, sleeping) {
  ctx.save();
  ctx.translate(x, y);

  const breathe = Math.sin(frame * 2) * 1;

  // 影子
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(0, 20, 22, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // 身體（白底+紅色斑點）
  ctx.fillStyle = '#FFFDE7';
  ctx.beginPath();
  ctx.ellipse(0, 2 + breathe, 24, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#D7CCC8';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 紅色斑點
  ctx.fillStyle = '#C62828';
  const spots = [
    { x: -8, y: -4, r: 5 },
    { x: 6, y: -6, r: 4 },
    { x: -2, y: 4, r: 6 },
    { x: 10, y: 2, r: 4 },
    { x: -12, y: 6, r: 3 },
    { x: 14, y: 8, r: 3.5 },
  ];
  for (const s of spots) {
    ctx.beginPath();
    ctx.arc(s.x, s.y + breathe, s.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 腿
  ctx.strokeStyle = '#795548';
  ctx.lineWidth = 3;
  const legAnim = Math.sin(frame * 6) * 3;
  ctx.beginPath(); ctx.moveTo(-16, 14 + breathe); ctx.lineTo(-20, 22 - legAnim); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-8, 16 + breathe); ctx.lineTo(-10, 24 + legAnim); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(8, 16 + breathe); ctx.lineTo(10, 24 - legAnim); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(16, 14 + breathe); ctx.lineTo(20, 22 + legAnim); ctx.stroke();

  // 臉/頭部
  ctx.fillStyle = '#FFFDE7';
  ctx.beginPath();
  ctx.ellipse(0, -12 + breathe, 16, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // 眼睛（巨大半球形）
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(-7, -16 + breathe, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(7, -16 + breathe, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(-7, -16 + breathe, 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(7, -16 + breathe, 8, 0, Math.PI * 2);
  ctx.stroke();

  // 瞳孔
  if (sleeping) {
    // 閉眼 (zzz)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-11, -16 + breathe);
    ctx.lineTo(-3, -16 + breathe);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(3, -16 + breathe);
    ctx.lineTo(11, -16 + breathe);
    ctx.stroke();

    // Zzz
    ctx.fillStyle = '#999';
    ctx.font = '8px sans-serif';
    const zFloat = Math.sin(frame * 2) * 3;
    ctx.fillText('z', 14, -22 + breathe + zFloat);
    ctx.fillText('Z', 20, -28 + breathe + zFloat * 0.8);
  } else {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-6, -15 + breathe, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(8, -15 + breathe, 4, 0, Math.PI * 2);
    ctx.fill();

    // 瞳孔高光
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(-5, -16 + breathe, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(9, -16 + breathe, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 嘴巴
  ctx.fillStyle = '#D32F2F';
  ctx.beginPath();
  ctx.ellipse(0, -6 + breathe, 10, sleeping ? 3 : 6, 0, 0, Math.PI);
  ctx.fill();
  if (!sleeping) {
    // 牙齒
    ctx.fillStyle = '#FFF';
    for (let i = -3; i <= 3; i += 2) {
      ctx.beginPath();
      ctx.moveTo(i * 2.5, -6 + breathe);
      ctx.lineTo(i * 2.5 - 1, -3 + breathe);
      ctx.lineTo(i * 2.5 + 1, -3 + breathe);
      ctx.closePath();
      ctx.fill();
    }
  }

  // HP bar
  if (hp < maxHp) {
    const barW = 30;
    const barH = 3;
    ctx.fillStyle = '#333';
    ctx.fillRect(-barW / 2, -30 + breathe, barW, barH);
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(-barW / 2, -30 + breathe, barW * (hp / maxHp), barH);
  }

  ctx.restore();
}

// ========== 小眼蟲 Dwarf Bulborb ==========
export function drawDwarfBulborb(ctx, x, y, hp, maxHp, frame) {
  ctx.save();
  ctx.translate(x, y);

  const breathe = Math.sin(frame * 3) * 0.5;

  // 影子
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  ctx.ellipse(0, 10, 10, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // 身體
  ctx.fillStyle = '#FFFDE7';
  ctx.beginPath();
  ctx.ellipse(0, 2 + breathe, 11, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // 斑點
  ctx.fillStyle = '#C62828';
  ctx.beginPath(); ctx.arc(-3, 0 + breathe, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(4, 2 + breathe, 2.5, 0, Math.PI * 2); ctx.fill();

  // 小腿
  ctx.strokeStyle = '#795548';
  ctx.lineWidth = 2;
  const legA = Math.sin(frame * 8) * 2;
  ctx.beginPath(); ctx.moveTo(-6, 8 + breathe); ctx.lineTo(-8, 12 - legA); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(6, 8 + breathe); ctx.lineTo(8, 12 + legA); ctx.stroke();

  // 眼睛
  ctx.fillStyle = '#FFF';
  ctx.beginPath(); ctx.arc(-4, -5 + breathe, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(4, -5 + breathe, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(-3, -4 + breathe, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(5, -4 + breathe, 2.5, 0, Math.PI * 2); ctx.fill();

  // HP bar
  if (hp < maxHp) {
    const barW = 18;
    ctx.fillStyle = '#333';
    ctx.fillRect(-barW / 2, -14, barW, 2);
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(-barW / 2, -14, barW * (hp / maxHp), 2);
  }

  ctx.restore();
}

// ========== Onion ==========
export function drawOnion(ctx, x, y, type, frame) {
  const color = CONFIG.PIKMIN_TYPES[type]?.color || '#E53935';

  ctx.save();
  ctx.translate(x, y);

  const hover = Math.sin(frame * 2) * 2;

  // 三隻腿
  ctx.strokeStyle = '#795548';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-8, 10 + hover); ctx.lineTo(-18, 30); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 12 + hover); ctx.lineTo(0, 32); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(8, 10 + hover); ctx.lineTo(18, 30); ctx.stroke();

  // 洋蔥主體
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -25 + hover);
  ctx.quadraticCurveTo(-22, -5 + hover, -18, 10 + hover);
  ctx.quadraticCurveTo(0, 18 + hover, 18, 10 + hover);
  ctx.quadraticCurveTo(22, -5 + hover, 0, -25 + hover);
  ctx.fill();
  ctx.strokeStyle = darken(color, 0.2);
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 頂部光芒
  ctx.fillStyle = '#FFF9C4';
  ctx.globalAlpha = 0.6 + Math.sin(frame * 4) * 0.3;
  ctx.beginPath();
  ctx.arc(0, -20 + hover, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // 光柱（活躍時）
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, 14 + hover);
  ctx.lineTo(0, 34);
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.restore();
}

// ========== Pellet（花蜜球）==========
export function drawPellet(ctx, x, y, value, color, frame) {
  ctx.save();
  ctx.translate(x, y);

  const bob = Math.sin(frame * 3) * 1;

  // 影子
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath();
  ctx.ellipse(0, 8, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // 圓形 pellet
  const r = 8 + (value > 1 ? value : 0);
  ctx.fillStyle = color || '#FFF';
  ctx.beginPath();
  ctx.arc(0, bob, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = darken(color || '#FFF', 0.2);
  ctx.lineWidth = 1;
  ctx.stroke();

  // 數字
  ctx.fillStyle = '#333';
  ctx.font = `bold ${r}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(value), 0, bob + 1);

  ctx.restore();
}

// ========== 寶物 ==========
export function drawTreasure(ctx, x, y, treasureType, frame) {
  ctx.save();
  ctx.translate(x, y);

  const sparkle = Math.sin(frame * 4) * 0.3 + 0.7;

  // 影子
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  ctx.ellipse(0, 12, 10, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  if (treasureType === 'bottle_cap') {
    // 瓶蓋
    ctx.fillStyle = '#F44336';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#B71C1C';
    ctx.lineWidth = 2;
    ctx.stroke();
    // 鋸齒邊
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      ctx.fillStyle = '#D32F2F';
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 11, Math.sin(a) * 11, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (treasureType === 'coin') {
    // 硬幣
    ctx.fillStyle = '#FFD54F';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#F9A825';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#F9A825';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', 0, 1);
  } else if (treasureType === 'battery') {
    // 電池
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(-6, -10, 12, 20);
    ctx.fillStyle = '#333';
    ctx.fillRect(-3, -13, 6, 3);
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 1;
    ctx.strokeRect(-6, -10, 12, 20);
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 7px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('+', 0, 2);
  }

  // 閃光
  ctx.globalAlpha = sparkle * 0.5;
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  drawStar(ctx, -6, -6, 3, 1.5, 4);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.restore();
}

// ========== 皮克敏苗 ==========
export function drawSprout(ctx, x, y, type, frame) {
  const color = CONFIG.PIKMIN_TYPES[type]?.color || '#4CAF50';

  ctx.save();
  ctx.translate(x, y);

  const sway = Math.sin(frame * 3 + x * 0.1) * 2;

  // 泥土堆
  ctx.fillStyle = '#795548';
  ctx.beginPath();
  ctx.ellipse(0, 2, 5, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // 莖
  ctx.strokeStyle = '#66BB6A';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(sway, -8, sway * 0.5, -14);
  ctx.stroke();

  // 葉子（帶顏色提示）
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.ellipse(sway * 0.5, -15, 3, 1.5, sway * 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.restore();
}

// ========== 工具函式 ==========
function darken(hex, amount) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.round(r * (1 - amount))},${Math.round(g * (1 - amount))},${Math.round(b * (1 - amount))})`;
}

function drawStar(ctx, cx, cy, outerR, innerR, points) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    if (i === 0) ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    else ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  }
  ctx.closePath();
}
