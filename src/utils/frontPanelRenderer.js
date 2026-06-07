/**
 * Renders a CLEAN front-of-pack design (brand artwork only) to a canvas.
 *
 * This is what we feed to the Nano Banana image-to-image wrap — NOT the dense
 * 3-column compliance label. A brand-forward panel (logo + product name +
 * tagline + net weight) wraps onto packaging far more realistically, the same
 * way the pre-baked hero shots look good. The full compliance label stays a
 * separate print/download artifact.
 */

const KHMER = "'Noto Sans Khmer', 'Kantumruy Pro', sans-serif";
const SANS = "'Outfit', 'Inter', sans-serif";

// Theme presets keyed loosely to the label templates so the mockup feels related.
export const PANEL_THEMES = {
  amber: { bg: '#ffffff', panel: '#ffffff', ink: '#0f172a', sub: '#475569', accent: '#ea580c', accent2: '#f59e0b', kicker: '#94a3b8' },
  kraft: { bg: '#f3e7d3', panel: '#f6eedf', ink: '#3d2e24', sub: '#6b5848', accent: '#a0522d', accent2: '#c98a3c', kicker: '#9c8771' },
  forest: { bg: '#0f3d2e', panel: '#124a37', ink: '#f4f1e8', sub: '#bcd9c9', accent: '#f2b84b', accent2: '#e7e0cd', kicker: '#85a895' },
};

export function themeForTemplate(t) {
  if (t === 'kraft') return 'kraft';
  if (t === 'panel') return 'forest';
  return 'amber';
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * @param {HTMLCanvasElement} canvas  target (will be sized to 1000x1250)
 * @param {object} opts  { productName, productNameKh, weight, tagline, theme, logoSvg, logoUrl }
 */
export async function drawFrontPanel(canvas, opts = {}) {
  const {
    productName = '',
    productNameKh = 'ឈ្មោះផលិតផល',
    weight = '100g',
    tagline = '100% NATURAL · PRODUCT OF CAMBODIA',
    theme = 'amber',
    logoSvg = null,
    logoUrl = null,
  } = opts;

  const T = PANEL_THEMES[theme] || PANEL_THEMES.amber;

  const W = 1000;
  const H = 1250;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch { /* fonts best-effort */ }

  // Background
  ctx.fillStyle = T.bg;
  ctx.fillRect(0, 0, W, H);

  // Inner panel with a thin accent frame
  const M = 70;
  ctx.fillStyle = T.panel;
  roundRect(ctx, M, M, W - M * 2, H - M * 2, 28);
  ctx.fill();
  ctx.strokeStyle = T.accent;
  ctx.lineWidth = 4;
  roundRect(ctx, M + 16, M + 16, W - (M + 16) * 2, H - (M + 16) * 2, 18);
  ctx.stroke();

  const cx = W / 2;
  let y = M + 110;

  // Top kicker
  ctx.fillStyle = T.kicker;
  ctx.font = `800 22px ${SANS}`;
  ctx.textAlign = 'center';
  ctx.fillText('KHMER CO·OP', cx, y);
  // accent divider
  ctx.strokeStyle = T.accent2;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 44, y + 18);
  ctx.lineTo(cx + 44, y + 18);
  ctx.stroke();
  y += 70;

  // Logo (largest visual element)
  const logoBox = 380;
  let logoImg = null;
  let resolvedLogo = logoUrl;
  if (!resolvedLogo && logoSvg) {
    try { resolvedLogo = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(logoSvg))); } catch { resolvedLogo = null; }
  }
  if (resolvedLogo) {
    try { logoImg = await loadImage(resolvedLogo); } catch { logoImg = null; }
  }
  if (logoImg) {
    const ratio = Math.min(logoBox / logoImg.width, logoBox / logoImg.height);
    const lw = logoImg.width * ratio;
    const lh = logoImg.height * ratio;
    ctx.save();
    // multiply so a white logo background melts into the panel
    if (theme !== 'forest') ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(logoImg, cx - lw / 2, y, lw, lh);
    ctx.restore();
    y += logoBox + 30;
  } else {
    // No logo applied yet — draw a simple default mango emblem so the panel never
    // looks unfinished (the AI wrap reads an empty ring as blank space).
    const r = logoBox / 2 - 10;
    const mcx = cx;
    const mcy = y + logoBox / 2;
    ctx.strokeStyle = T.accent2;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(mcx, mcy, r, 0, Math.PI * 2);
    ctx.stroke();
    // mango body
    ctx.fillStyle = T.accent2;
    ctx.beginPath();
    ctx.ellipse(mcx, mcy + 8, r * 0.42, r * 0.55, -0.25, 0, Math.PI * 2);
    ctx.fill();
    // leaf
    ctx.fillStyle = theme === 'forest' ? '#bcd9c9' : '#15803d';
    ctx.beginPath();
    ctx.ellipse(mcx + r * 0.34, mcy - r * 0.42, r * 0.26, r * 0.11, -0.7, 0, Math.PI * 2);
    ctx.fill();
    y += logoBox + 30;
  }

  // Khmer product name (hero)
  ctx.fillStyle = T.ink;
  ctx.font = `700 76px ${KHMER}`;
  ctx.textAlign = 'center';
  ctx.fillText(productNameKh, cx, y);
  y += 70;

  // English product name
  if (productName) {
    ctx.fillStyle = T.sub;
    ctx.font = `700 36px ${SANS}`;
    const upper = productName.toUpperCase();
    ctx.save();
    ctx.translate(cx, y);
    // simulate letter-spacing
    const spaced = upper.split('').join(' ');
    ctx.fillText(spaced, 0, 0);
    ctx.restore();
    y += 58;
  }

  // Tagline
  ctx.fillStyle = T.accent;
  ctx.font = `800 22px ${SANS}`;
  ctx.fillText(tagline, cx, y);
  y += 70;

  // Net weight pill anchored near the bottom
  const pillW = 240;
  const pillH = 64;
  const pillY = H - M - 110;
  ctx.fillStyle = T.accent;
  roundRect(ctx, cx - pillW / 2, pillY, pillW, pillH, pillH / 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 30px ${SANS}`;
  ctx.textBaseline = 'middle';
  ctx.fillText(`NET ${weight}`, cx, pillY + pillH / 2 + 2);
  ctx.textBaseline = 'alphabetic';

  return canvas;
}
