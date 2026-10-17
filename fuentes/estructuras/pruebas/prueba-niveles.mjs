import { analizar, barrido, MATERIALES, longitudTotal, largo } from '../src/motor.js';
function modelo(apoyos,cargas,pares){
  const nodos=[],idx={},k=(x,y)=>x+','+y;
  const nn=(x,y,ex)=>{const q=k(x,y);if(idx[q]===undefined){idx[q]=nodos.length;nodos.push({x,y,...ex})}return idx[q]};
  apoyos.forEach(a=>nn(a.x,a.y,{apoyo:a.t}));
  cargas.forEach(c=>nn(c.x,c.y,{fx:c.fx||0,fy:c.fy||0}));
  const piezas=pares.map(([x1,y1,x2,y2,m])=>({a:nn(x1,y1),b:nn(x2,y2),mat:m||'madera'}));
  return {nodos,piezas};
}
function fsPuente(nombre,apoyos,peso,pares,xi,xd){
  const {nodos,piezas}=modelo(apoyos,[],pares);
  const b=barrido(nodos,piezas,{xi,xd,peso,yTab:6,paso:0.25});
  const fs=1/Math.max(b.peor.res.maxRazon,1e-9);
  console.log(nombre.padEnd(28),'FS',fs.toFixed(2),'| mec',b.peor.res.mecanismo,'| largo',longitudTotal(nodos,piezas).toFixed(1),'| peor x',b.peor.x);
}
function fsEst(nombre,apoyos,cargas,pares){
  const {nodos,piezas}=modelo(apoyos,cargas,pares);
  const r=analizar(nodos,piezas);
  console.log(nombre.padEnd(28),'FS',(1/Math.max(r.maxRazon,1e-9)).toFixed(2),'| mec',r.mecanismo,'| largo',longitudTotal(nodos,piezas).toFixed(1));
}
const A1=[{x:2,y:6,t:'fijo'},{x:8,y:6,t:'rodillo'}];
const pratt=[[2,6,5,6],[5,6,8,6],[2,6,3,4],[3,4,5,4],[5,4,7,4],[7,4,8,6],[3,4,5,6],[5,6,7,4]];
fsPuente('L1 Pratt madera 3t',A1,3,pratt,2,8);
fsPuente('L1 Pratt madera 2.5t',A1,2.5,pratt,2,8);
const pratt2=[[2,6,4,6],[4,6,6,6],[6,6,8,6],[2,6,3,4],[3,4,5,4],[5,4,7,4],[7,4,8,6],[3,4,4,6],[4,6,5,4],[5,4,6,6],[6,6,7,4]];
fsPuente('L1 Warren fino 3t',A1,3,pratt2,2,8);
fsPuente('L1 Warren fino 4t',A1,4,pratt2,2,8);
const A2=[{x:1,y:6,t:'fijo'},{x:11,y:6,t:'rodillo'}];
const warren=[[1,6,4,6],[4,6,8,6],[8,6,11,6],[1,6,3,4],[3,4,4,6],[3,4,6,4],[4,6,6,4],[6,4,8,6],[6,4,9,4],[8,6,9,4],[9,4,11,6]];
fsPuente('L2 Warren 3t',A2,3,warren,1,11);
const warren2=[[1,6,3,6],[3,6,5,6],[5,6,7,6],[7,6,9,6],[9,6,11,6],[1,6,2,4],[2,4,4,4],[4,4,6,4],[6,4,8,4],[8,4,10,4],[10,4,11,6],[2,4,3,6],[3,6,4,4],[4,4,5,6],[5,6,6,4],[6,4,7,6],[7,6,8,4],[8,4,9,6],[9,6,10,4]];
fsPuente('L2 Warren fino 3t',A2,3,warren2,1,11);
fsPuente('L2 Warren fino 4t',A2,4,warren2,1,11);
// Torre
const A3=[{x:6,y:7,t:'fijo'},{x:8,y:7,t:'fijo'}],C3=[{x:7,y:2,fx:0.8,fy:1.5}];
const torre=[[6,7,6,5],[8,7,8,5],[6,7,8,5],[6,5,8,5],[6,5,7,3],[8,5,7,3],[6,5,7,2],[8,5,7,2],[7,3,7,2]];
fsEst('L3 torre madera',A3,C3,torre);
// Voladizo: pared en x=1
const A4=[{x:1,y:3,t:'fijo'},{x:1,y:6,t:'fijo'}],C4=[{x:8,y:5,fx:0,fy:1.5}];
const vol=[[1,3,4,3],[4,3,7,3],[1,6,4,6],[4,6,7,6],[4,3,4,6],[7,3,7,6],[1,3,4,6],[4,3,7,6],[7,6,8,5],[7,3,8,5]];
fsEst('L4 voladizo madera 1.5t',A4,C4,vol);
const vol2=[[1,3,4,3],[4,3,7,3],[1,6,3,6],[3,6,5,6],[5,6,7,6],[3,3,3,6]].filter(()=>false);
console.log('--- ajustes');
// L1: mezclar acero en piezas críticas
const prattM=pratt.map((p,i)=>[...p,[0,1,6,7].includes(i)?'acero':'madera']);
fsPuente('L1 Pratt mixto',A1,3,prattM,2,8);
const prattAc=pratt.map(p=>[...p,'acero']);
fsPuente('L1 Pratt acero',A1,3,prattAc,2,8);
// L1 con cables (colgante simple): torres en (3,3),(7,3)
const cab=[[2,6,5,6],[5,6,8,6],[2,6,3,3,'madera'],[8,6,7,3,'madera'],[3,3,7,3,'madera'],[3,3,5,6,'cable'],[7,3,5,6,'cable']];
fsPuente('L1 atirantado con cables',A1,3,cab,2,8);
// Voladizo: otras geometrías
for (const w of [1.0,1.2,1.5]){
  const C=[{x:7,y:4,fx:0,fy:w}];
  const v1=[[1,3,4,3],[4,3,7,3],[1,6,4,6],[4,6,7,6],[4,3,4,6],[7,3,7,6],[1,3,4,6],[4,3,7,6],[7,3,7,4],[7,4,7,6]];
  fsEst('voladizo carga '+w+' L(7,4)',A4,C,v1);
}
const C5=[{x:6,y:4,fx:0,fy:1.5}];
const v2=[[1,3,3,3],[3,3,6,3],[1,6,3,6],[3,6,6,6],[3,3,3,6],[6,3,6,4],[6,4,6,6],[1,3,3,6],[3,3,6,6],[3,6,6,4]].map(p=>[...p,'acero']);
fsEst('voladizo acero 1.5t (6,4)',A4,C5,v2);
const v3=[[1,3,3,3],[3,3,6,3],[1,6,3,6],[3,6,6,6],[3,3,3,6],[6,3,6,4],[6,4,6,6],[1,3,3,6],[3,3,6,6],[3,6,6,4]];
fsEst('voladizo madera 1.5t (6,4)',A4,C5,v3);
fsEst('voladizo madera 1t (6,4)',A4,[{x:6,y:4,fy:1}],v3);
// con cable
const v4=[[1,3,4,3],[4,3,6,3],[1,6,4,6],[4,6,6,6],[4,3,4,6],[6,3,6,6],[1,3,4,6],[4,3,6,6],[6,3,6,4,'madera'],[6,4,6,6]];
fsEst('voladizo (6,4) 1.2t',A4,[{x:6,y:4,fy:1.2}],v4);
