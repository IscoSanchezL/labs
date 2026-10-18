// uso: node tools/narracion_desde_lab.mjs <dir>  → escribe stem/actividades/<dir>/narracion.json a partir de los pasos del lab.js (LabKit con voz)
import fs from 'fs';
const d = process.argv[2], dir = `stem/actividades/${d}/`;
let cfg = null; const dummy = new Proxy(function () {}, { get: () => dummy, apply: () => dummy, set: () => true });
globalThis.window = dummy; globalThis.document = dummy; globalThis.LabKit = c => { cfg = c; return dummy; };
(0, eval)(fs.readFileSync(dir + 'lab.js', 'utf8'));
const out = []; cfg.pasos.forEach((P, i) => { out.push({ id: 'p' + (i + 1), texto: P.t + '. ' + P.x.replace(/<[^>]+>/g, '') }); out.push({ id: 'm' + (i + 1), texto: 'Tu misión. ' + P.m }); });
out.push({ id: 'ok', texto: '¡Muy bien! Misión cumplida.' });
fs.writeFileSync(dir + 'narracion.json', '[\n' + out.map(o => ' ' + JSON.stringify(o)).join(',\n') + '\n]\n'); console.log('narracion.json', out.length);
