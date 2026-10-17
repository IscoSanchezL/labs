/* Retos del Laboratorio de puentes. Coordenadas del modelo: x → derecha, y → abajo (rejilla de 1 m). */
const W = 'madera', A = 'acero';
const pratt = [[2,6,5,6],[5,6,8,6],[2,6,3,4],[3,4,5,4],[5,4,7,4],[7,4,8,6],[3,4,5,6],[5,6,7,4]].map((p) => [...p, W]);
const warren = [[1,6,3,6],[3,6,5,6],[5,6,7,6],[7,6,9,6],[9,6,11,6],[1,6,2,4],[2,4,4,4],[4,4,6,4],[6,4,8,4],[8,4,10,4],[10,4,11,6],
  [2,4,3,6],[3,6,4,4],[4,4,5,6],[5,6,6,4],[6,4,7,6],[7,6,8,4],[8,4,9,6],[9,6,10,4]].map((p) => [...p, W]);
const torre = [[6,7,6,5],[8,7,8,5],[6,7,8,5],[6,5,8,5],[6,5,7,3],[8,5,7,3],[6,5,7,2],[8,5,7,2],[7,3,7,2]].map((p) => [...p, W]);
const voladizo = [[1,3,3,3],[3,3,6,3],[1,6,3,6],[3,6,6,6],[3,3,3,6],[6,3,6,4],[6,4,6,6],[1,3,3,6],[3,3,6,6],[3,6,6,4]].map((p) => [...p, W]);

export const NIVELES = [
  { id: 'rio',      tipo: 'puente',   apoyos: [{ x: 2, y: 6, t: 'fijo' }, { x: 8, y: 6, t: 'rodillo' }],  yTab: 6, camion: 3, refLargo: 20.1, ejemplo: pratt },
  { id: 'canon',    tipo: 'puente',   apoyos: [{ x: 1, y: 6, t: 'fijo' }, { x: 11, y: 6, t: 'rodillo' }], yTab: 6, camion: 3, refLargo: 40.4, ejemplo: warren },
  { id: 'torre',    tipo: 'estatico', apoyos: [{ x: 6, y: 7, t: 'fijo' }, { x: 8, y: 7, t: 'fijo' }], cargas: [{ x: 7, y: 2, fx: 0.8, fy: 1.5 }], refLargo: 20.6, ejemplo: torre },
  { id: 'voladizo', tipo: 'estatico', pared: true, apoyos: [{ x: 1, y: 3, t: 'fijo' }, { x: 1, y: 6, t: 'fijo' }], cargas: [{ x: 6, y: 4, fx: 0, fy: 1.5 }], refLargo: 27.5, ejemplo: voladizo },
  { id: 'libre',    tipo: 'puente',   apoyos: [{ x: 2, y: 6, t: 'fijo' }, { x: 12, y: 6, t: 'rodillo' }], yTab: 6, camion: 3, libre: true, refLargo: 0, ejemplo: null }
];

export const COLS = 16, FILAS = 10;
/* mundo 3D: x - 8, 7 - y */
export const aMundo = (x, y) => ({ x: x - 8, y: 7 - y });
export const aModelo = (wx, wy) => ({ x: Math.round(wx + 8), y: Math.round(7 - wy) });

export function bloqueado(niv, x, y) {
  if (x < 0 || x > COLS || y < 1 || y > FILAS - 1) return true;
  if (niv.apoyos.some((a) => a.x === x && a.y === y)) return false;
  if (niv.tipo === 'puente') {
    const izq = Math.min(niv.apoyos[0].x, niv.apoyos[1].x), der = Math.max(niv.apoyos[0].x, niv.apoyos[1].x);
    if (y >= niv.yTab && (x <= izq || x >= der)) return true;
    if (y >= niv.yTab + 2) return true;
    return false;
  }
  if (niv.pared) return x <= 1 || y >= 7;
  return y >= 7;
}
