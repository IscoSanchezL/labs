import * as THREE from 'three';
/* Texturas procedurales (sin archivos): ruido por valores + capas. */
function hash(x, y, s) { let h = x * 374761393 + y * 668265263 + s * 1442695041; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967295; }
function vnoise(x, y, s) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
function fbm(x, y, s, o = 5) { let t = 0, a = 0.5, f = 1; for (let i = 0; i < o; i++) { t += a * vnoise(x * f, y * f, s + i); a *= 0.5; f *= 2; } return t; }
const hex = (c) => { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
function lienzo(w, h, fn) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'), im = g.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const [r, gg, b] = fn(x / w, y / h); const i = (y * w + x) * 4; im.data[i] = r; im.data[i + 1] = gg; im.data[i + 2] = b; im.data[i + 3] = 255; }
  g.putImageData(im, 0, 0); return c;
}
const aTex = (c) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
const W = 512, H = 256;
export function texRocoso(base, oscuro, claro, s, cr = 0) {
  const A = hex(oscuro), B = hex(base), C = hex(claro);
  const c = lienzo(W, H, (u, v) => { const n = fbm(u * 8, v * 4, s), m = fbm(u * 30, v * 15, s + 9); let k = n * 0.75 + m * 0.35; const col = k < 0.5 ? mix(A, B, k * 2) : mix(B, C, (k - 0.5) * 2); return col; });
  const g = c.getContext('2d'); for (let i = 0; i < cr; i++) { const x = Math.random() * W, y = Math.random() * H, r = 2 + Math.random() * 9; g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = 1.4; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.arc(x - 1, y - 1, r * 0.7, 0, 7); g.fill(); }
  return aTex(c);
}
export function texTierra() {
  const oc1 = hex('#0b2a66'), oc2 = hex('#1b66c4'), t1 = hex('#2f7d3a'), t2 = hex('#b9a463'), nieve = [245, 248, 252];
  return aTex(lienzo(1024, 512, (u, v) => { const n = fbm(u * 6, v * 3, 4, 6), lat = Math.abs(v - 0.5) * 2; if (lat > 0.9 - n * 0.12) return nieve; if (n > 0.54) { const k = Math.min(1, (n - 0.54) * 5); return mix(t1, t2, k * (0.4 + lat * 0.8)); } return mix(oc1, oc2, Math.min(1, n * 1.6)); }));
}
export function texNubes() {
  const c = lienzo(512, 256, (u, v) => { const n = fbm(u * 7, v * 4, 31, 6); const a = Math.max(0, n - 0.5) * 3.4; const l = 255; return [l, l, l, Math.min(255, a * 255)]; });
  const g = c.getContext('2d'), im = g.getImageData(0, 0, 512, 256); for (let i = 0; i < im.data.length; i += 4) { const n = fbm(((i / 4) % 512) / 512 * 7, Math.floor(i / 4 / 512) / 256 * 4, 31, 6); im.data[i + 3] = Math.min(255, Math.max(0, n - 0.5) * 3.4 * 255); } g.putImageData(im, 0, 0);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
export function texBandas(colores, s, turb = 0.05, mancha = false) {
  const cs = colores.map(hex);
  return aTex(lienzo(W, H, (u, v) => { const t = fbm(u * 5, v * 14, s, 4); const vv = v + (t - 0.5) * turb * 2; const p = Math.min(0.9999, Math.max(0, vv)) * (cs.length - 1), i = Math.floor(p); let col = mix(cs[i], cs[i + 1], p - i); const d = fbm(u * 40, v * 60, s + 3) * 0.12; col = [col[0] * (0.92 + d), col[1] * (0.92 + d), col[2] * (0.92 + d)]; if (mancha) { const dx = (u - 0.62) * 4, dy = (v - 0.62) * 9; const q = Math.exp(-(dx * dx + dy * dy)); col = mix(col, [190, 80, 50], q * 0.85); } return col; }));
}
export function texVenus() { const A = hex('#cdb27a'), B = hex('#f1e2b8'); return aTex(lienzo(W, H, (u, v) => { const n = fbm(u * 5 + fbm(u * 3, v * 3, 8) * 2, v * 3, 12, 5); return mix(A, B, n); })); }
export function texSol() { const A = hex('#ff8a1f'), B = hex('#ffd36b'), C = hex('#fff2b8'); return aTex(lienzo(W, H, (u, v) => { const n = fbm(u * 9, v * 5, 5, 6), m = fbm(u * 28, v * 14, 6); const k = n * 0.7 + m * 0.5; return k < 0.55 ? mix(A, B, k / 0.55) : mix(B, C, (k - 0.55) * 2.2); })); }
export function texAnillo() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 1; const g = c.getContext('2d'), im = g.createImageData(512, 1);
  for (let x = 0; x < 512; x++) { const t = x / 511, n = vnoise(t * 60, 0, 2) * 0.5 + vnoise(t * 140, 0, 3) * 0.5; let a = 0; if (t > 0.12 && t < 0.38) a = 0.28; else if (t > 0.42 && t < 0.78) a = 0.85; else if (t > 0.82 && t < 0.95) a = 0.4; a *= 0.55 + n * 0.6; const col = mix(hex('#cbb68a'), hex('#efe0b8'), n); im.data.set([col[0], col[1], col[2], Math.min(255, a * 255)], x * 4); }
  g.putImageData(im, 0, 0); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
export function texBrillo() {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(255,240,190,1)'); gr.addColorStop(0.18, 'rgba(255,190,90,.65)'); gr.addColorStop(0.5, 'rgba(255,120,40,.18)'); gr.addColorStop(1, 'rgba(255,100,20,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
