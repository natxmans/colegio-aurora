// =========================================================
// EXTERIORES: césped, patio central, jardines, entrada con el logo,
// muro del campus y, alrededor, olivares y colinas (un entorno tranquilo en España)
// =========================================================
import { html, THREE, useMemo } from '../lib3d.js';
import { B, C, S, Cono, Ico, Toro, V, G, Panel, COL, Banco, Farola, Arbol, Palmera, Planta, Mesa } from './piezas.js';
import { Punto } from './puntos.js';
import { Zonas } from './Interaccion.js';
import { texRotuloTexto, texBandera, texLogo, texCesped, texAdoquin } from './texturas.js';
import { CAMPUS } from '../datos/salas.js';

const PI = Math.PI;
const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

function Plano({ p, w, d, tex, rep = 1, c = '#ffffff', y = 0 }) {
  const mat = useMemo(() => {
    const t = tex.clone(); t.needsUpdate = true; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(w / rep, d / rep);
    return new THREE.MeshStandardMaterial({ map: t, color: c, roughness: 0.95 });
  }, [tex, w, d, rep, c]);
  return html`<mesh position=${[p[0], y, p[1]]} rotation=${[-PI / 2, 0, 0]} material=${mat} receiveShadow><planeGeometry args=${[w, d]} /></mesh>`;
}

function Terreno() {
  return html`<group>
    <mesh rotation=${[-PI / 2, 0, 0]} position=${[20, -0.06, -6]} receiveShadow>
      <planeGeometry args=${[2600, 2600]} />
      <meshStandardMaterial color="#a9b47c" roughness=${1} />
    </mesh>
    <${Plano} p=${[(CAMPUS.x0 + CAMPUS.x1) / 2, (CAMPUS.z0 + CAMPUS.z1) / 2]} w=${CAMPUS.x1 - CAMPUS.x0} d=${CAMPUS.z1 - CAMPUS.z0} tex=${texCesped()} rep=${8} c="#a6c98a" y=${-0.03} />
  </group>`;
}

// Colinas suaves en el horizonte
function Colinas() {
  const m = [];
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * PI * 2, r = 520 + rnd(i) * 160;
    const x = 20 + Math.cos(a) * r, z = -6 + Math.sin(a) * r, h = 40 + rnd(i + 9) * 70;
    m.push(html`<mesh key=${i} position=${[x, h / 2 - 8, z]} scale=${[1, 1, 0.8]}><coneGeometry args=${[150 + rnd(i + 3) * 90, h, 7]} /><meshStandardMaterial color=${i % 2 ? '#b3b98c' : '#a3ad7f'} flatShading=${true} roughness=${1} /></mesh>`);
  }
  return html`<group>${m}</group>`;
}

// Olivares alrededor del campus (rellenan el paisaje sin tapar el colegio)
function Olivares() {
  const arboles = [];
  const fuera = (x, z) => x < CAMPUS.x0 - 6 || x > CAMPUS.x1 + 6 || z < CAMPUS.z0 - 6 || z > CAMPUS.z1 + 6;
  let k = 0;
  for (let x = CAMPUS.x0 - 70; x <= CAMPUS.x1 + 70; x += 8) for (let z = CAMPUS.z0 - 60; z <= CAMPUS.z1 + 60; z += 8) {
    if (!fuera(x, z)) continue;
    if (z > CAMPUS.z1 + 6 && Math.abs(x - 0) < 10) continue; // camino de entrada
    const j = k++;
    if (rnd(j) < 0.12) continue;
    const xx = x + (rnd(j + 1) - 0.5) * 2, zz = z + (rnd(j + 2) - 0.5) * 2, s = 0.75 + rnd(j + 3) * 0.35;
    arboles.push(html`<${G} key=${j} p=${[xx, 0, zz]} s=${s}>
      <${C} p=${[0, 0.7, 0]} s=${[0.35, 1.4, 0.35]} c="#7a6248" />
      <${Ico} p=${[0, 2.0, 0]} s=${[2.9, 1.9, 2.9]} c=${rnd(j + 4) < 0.5 ? '#7d9165' : '#8d9e73'} />
    <//>`);
  }
  return arboles;
}

function Mastil({ p, tex }) {
  return html`<${G} p=${p}>
    <${C} m="M" p=${[0, 4, 0]} s=${[0.12, 8, 0.12]} c=${COL.grisM} />
    <${S} m="M" p=${[0, 8.05, 0]} s=${0.2} c=${COL.grisM} />
    <${Panel} p=${[0.95, 7.0, 0]} w=${1.8} h=${1.2} tex=${tex} luz=${false} doble />
  <//>`;
}

function Olivo({ p, s = 1 }) {
  return html`<${G} p=${p} s=${s}>
    <${C} p=${[0, 0.9, 0]} r=${[0, 0, 0.12]} s=${[0.4, 1.8, 0.4]} c="#7a6248" />
    <${Ico} p=${[0.15, 2.4, 0]} s=${[3.0, 1.8, 3.0]} c="#8a9c70" />
    <${Ico} p=${[-0.6, 2.1, 0.4]} s=${[1.8, 1.2, 1.8]} c="#7d9165" />
  <//>`;
}

function Flores({ p, w, d, seed = 1 }) {
  const items = [];
  const cols = ['#e7c35a', '#f1f1ee', '#b84a55', '#8a7fc0', '#e6a0b0'];
  for (let i = 0; i < Math.round(w * d * 1.6); i++) {
    items.push(html`<${S} key=${i} p=${[p[0] + (rnd(seed + i) - 0.5) * w, 0.22, p[1] + (rnd(seed + i + 50) - 0.5) * d]} s=${0.22} c=${cols[i % 5]} />`);
  }
  return html`<${G}>
    <${B} p=${[p[0], 0.1, p[1]]} s=${[w, 0.2, d]} c="#6f8f4c" />
    <${B} p=${[p[0], 0.08, p[1]]} s=${[w + 0.3, 0.16, d + 0.3]} c=${COL.piedra} />
    ${items}
  <//>`;
}

// Farolas del campus (se encienden al atardecer): [x, z]
export const FAROLAS = [
  [-31, 14], [-31, 44], [-10, 14], [6, 14], [6, 44], [-15, 21], [-15, 37],
  [-56, 24], [-56, 44], [-36, 44], [-36, 24], [-50, -26], [-50, -50],
  [33.5, 13.5], [8, -14], [-20, -14], [66, -14], [66, 14],
];

// PATIO DE RECREO delante de la entrada (x -32→8, z 13→44): fuente, olivos, bancos,
// porche, rayuela y mesas de ping-pong. A las 10:00 los alumnos salen aquí 20 minutos.
const FX = -15, FZ = 29; // centro de la fuente
export const FUENTE = { x: FX, z: FZ, r: 5.6 };
function Patio() {
  const bancos = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * PI * 2 + PI / 8, ry = a + PI;
    const bx = FX + Math.sin(a) * 8.6, bz = FZ + Math.cos(a) * 8.6;
    bancos.push(html`<${Banco} key=${i} p=${[bx, 0.05, bz]} r=${[0, ry, 0]} w=${2.2} c=${COL.madera} />`);
    for (const lx of [-0.5, 0.5]) bancos.push(html`<${Punto} key=${'q' + i + lx} t="banco" sala="patio" i=${i * 2 + (lx > 0 ? 1 : 0)}
      p=${[bx + lx * Math.cos(ry), 0.05, bz - lx * Math.sin(ry)]} ry=${ry} asiento=${0.45} ap=${[0, 0.8]} accion="charlar" />`);
  }
  // sitios libres para hablar, pasear y jugar (la simulación elige los que están libres)
  const sitios = [];
  let k = 0;
  for (let x = -29; x <= 6.1; x += 2.5) for (let z = 15.8; z <= 41; z += 2.5) {
    const d = Math.hypot(x - FX, z - FZ);
    if (d < 10.4) continue;
    if (x < -24 && z > 20.5 && z < 37.5) continue;          // jardín verde
    if (x > 4.6 && z > 20.4 && z < 37.6) continue;           // flores
    if (z > 39.3 && x > -23 && x < -9) continue;             // porche
    if ([[-6, 21], [-6, 37], [-28, 24], [-28, 34]].some(([a, b]) => Math.hypot(x - a, z - b) < 2.4)) continue;
    if (Math.abs(x + 3) < 2.4 && Math.abs(z - 33) < 1.6) continue; // ping-pong
    if (Math.abs(x - 2) < 1.4 && Math.abs(z - 27.5) < 3.2) continue; // rayuela
    sitios.push(html`<${Punto} key=${'s' + k} t="patio" sala="patio" i=${k++} p=${[x, 0.05, z]} accion="charlar" />`);
  }
  const rayuela = [];
  [[0, 0], [0, 1], [-0.3, 2], [0.3, 2], [0, 3], [-0.3, 4], [0.3, 4], [0, 5]].forEach(([dx, n], i) => rayuela.push(html`<${B} key=${'r' + i} p=${[2 + dx * 2, 0.045, 25 + n * 0.62]} s=${[0.56, 0.01, 0.56]} c=${i % 2 ? '#f7f4ee' : '#e9d9a8'} />`));
  return html`<${G}>
    <${Plano} p=${[-12, 28.5]} w=${40} d=${31} tex=${texAdoquin()} rep=${4} y=${0.03} />
    <${G}><${B} p=${[-28, 0.08, 29]} s=${[6.4, 0.1, 15]} c="#7fa864" /><${B} p=${[-28, 0.06, 29]} s=${[6.8, 0.08, 15.4]} c=${COL.piedra} /><//>
    <${C} p=${[FX, 0.2, FZ]} s=${[11, 0.4, 11]} c=${COL.piedra} />
    <${C} m="B" p=${[FX, 0.41, FZ]} s=${[10.2, 0.04, 10.2]} c="#4aa3d6" />
    <${C} m="B" p=${[FX, 0.9, FZ]} s=${[2.4, 1.0, 2.4]} c=${COL.blanco} />
    <${C} m="B" p=${[FX, 1.6, FZ]} s=${[1.2, 0.5, 1.2]} c=${COL.blanco} />
    <${S} p=${[FX, 2.0, FZ]} s=${[0.5, 0.9, 0.5]} c="#bfe3f5" />
    ${bancos}
    ${sitios}
    ${[[-28, 24], [-28, 34], [-6, 21], [-6, 37]].map(([x, z], i) => html`<${Olivo} key=${'o' + i} p=${[x, 0.1, z]} s=${0.95} />`)}
    <${Flores} p=${[-24, 15.6]} w=${10} d=${2.0} seed=${15} />
    <${Flores} p=${[-9, 15.6]} w=${6} d=${2.0} seed=${21} />
    <${Flores} p=${[6.2, 29]} w=${2.4} d=${16} seed=${27} />
    <${Flores} p=${[-27, 42]} w=${6} d=${2.0} seed=${3} />
    <${G} p=${[-16, 0, 41.8]}>
      ${[-6, 0, 6].map(x => [-1.5, 1.5].map(z => html`<${B} key=${x + '' + z} m="M" p=${[x, 1.45, z]} s=${[0.18, 2.9, 0.18]} c=${COL.noche} />`))}
      <${B} m="B" p=${[0, 3.0, 0]} s=${[13, 0.18, 3.8]} c=${COL.blanco} />
      ${[-5, -3, -1, 1, 3, 5].map(x => html`<${B} key=${'l' + x} m="B" p=${[x, 2.85, 0]} s=${[0.2, 0.12, 3.6]} c=${COL.madera} />`)}
      <${B} p=${[0, 0.04, 0]} s=${[13, 0.05, 3.6]} c="#d9cdb6" />
      ${[-3, 3].map((x, i) => html`<${G} key=${'pb' + i}>
        <${Banco} p=${[x, 0, 1.0]} r=${[0, PI, 0]} w=${2.4} />
        <${Punto} t="banco" sala="patio" i=${16 + i * 2} p=${[x - 0.55, 0, 1.0]} ry=${PI} asiento=${0.45} ap=${[0, 0.8]} accion="charlar" />
        <${Punto} t="banco" sala="patio" i=${17 + i * 2} p=${[x + 0.55, 0, 1.0]} ry=${PI} asiento=${0.45} ap=${[0, 0.8]} accion="charlar" />
      <//>`)}
      <${Panel} p=${[0, 3.2, -1.95]} w=${2.4} h=${0.6} tex=${texRotuloTexto('PORCHE', COL.noche)} transp doble />
    <//>
    <${G} p=${[-3, 0, 33]}>
      <${B} m="B" p=${[0, 0.74, 0]} s=${[2.74, 0.08, 1.52]} c="#6f8a9c" />
      <${B} p=${[0, 0.86, 0]} s=${[0.03, 0.16, 1.55]} c=${COL.grisM} />
      <${B} p=${[0, 0.36, 0]} s=${[1.6, 0.72, 0.3]} c=${COL.piedra} />
    <//>
    <${Punto} t="ping" sala="patio" i=${0} p=${[-5.05, 0.05, 33]} ry=${PI / 2} accion="pingpong" />
    <${Punto} t="ping" sala="patio" i=${1} p=${[-0.95, 0.05, 33]} ry=${-PI / 2} accion="pingpong" />
    ${rayuela}
    <${Punto} t="rayuela" sala="patio" i=${0} p=${[2, 0.05, 24.2]} accion="rayuela" />
    ${[-30, -22].map((x, i) => html`<${Arbol} key=${'c' + i} p=${[x, 0, 46]} tipo=${1} s=${0.9} />`)}
    ${FAROLAS.slice(0, 7).map(([x, z], i) => html`<${Farola} key=${'f' + i} p=${[x, 0, z]} />`)}
  <//>`;
}

// JARDINES al suroeste (x -64→-34, z 24→46): estanque, caminos, árboles, flores y bancos;
// y una franja de árboles al noroeste (x -64→-36, z -64→-24)
export const ESTANQUE = { x: -43, z: 35, rx: 5.6, rz: 3.9 };
function Jardin() {
  const arboles = [[-62, 26, 0], [-62, 34, 1], [-62, 43, 0], [-50, 44, 1], [-36.5, 28.5, 0], [-58, -28, 0], [-46, -30, 1], [-60, -40, 0], [-42, -44, 1], [-58, -54, 0], [-46, -58, 1], [-38, -36, 0]];
  const bancos = [[-50.5, 30.5, 0], [-36.5, 35, -PI / 2], [-50.5, 39.5, PI], [-53.5, -40, PI / 2], [-46.5, -48, -PI / 2]];
  return html`<${G}>
    <${S} p=${[ESTANQUE.x, -0.6, ESTANQUE.z]} s=${[11.4, 1.4, 8]} c="#c9b48e" />
    <mesh position=${[ESTANQUE.x, 0.07, ESTANQUE.z]} rotation=${[-PI / 2, 0, 0]} scale=${[1, 0.66, 1]}>
      <circleGeometry args=${[5.2, 48]} />
      <meshStandardMaterial color="#3f97cf" roughness=${0.08} metalness=${0.3} transparent opacity=${0.88} />
    </mesh>
    ${[0, 1, 2, 3, 4, 5, 6].map(i => html`<${Ico} key=${'pi' + i} p=${[ESTANQUE.x + Math.cos(i * 0.9) * 5.4, 0.2, ESTANQUE.z + Math.sin(i * 0.9) * 3.6]} s=${[0.8, 0.45, 0.7]} c="#b9b2a2" />`)}
    <${B} p=${[-56, 0.04, 33.5]} s=${[2.2, 0.04, 25]} c="#e1d3b6" />
    <${B} p=${[-48.5, 0.04, 26]} s=${[31, 0.04, 2.2]} c="#e1d3b6" />
    <${B} p=${[-52, 0.04, 22.5]} s=${[2.4, 0.04, 5]} c="#e1d3b6" />
    <${B} p=${[-50, 0.04, -44]} s=${[2.2, 0.04, 40]} c="#e1d3b6" />
    ${arboles.map(([x, z, t], i) => html`<${Arbol} key=${'ar' + i} p=${[x, 0, z]} s=${0.95 + (i % 3) * 0.12} tipo=${t} c=${i % 2 ? '#5e8a4c' : '#6f9a55'} />`)}
    <${Flores} p=${[-60.5, 30]} w=${4} d=${3} seed=${31} />
    <${Flores} p=${[-41.5, 43]} w=${7} d=${2.4} seed=${41} />
    <${Flores} p=${[-60.5, 39]} w=${4} d=${3} seed=${51} />
    <${Flores} p=${[-41, -27]} w=${5} d=${2.4} seed=${61} />
    ${bancos.map(([x, z, r], i) => html`<${G} key=${'b' + i}>
      <${Banco} p=${[x, 0.05, z]} r=${[0, r, 0]} w=${2.2} c=${COL.madera} />
      <${Punto} t="banco" sala="jardin" i=${i * 2} p=${[x - 0.5 * Math.cos(r), 0.05, z + 0.5 * Math.sin(r)]} ry=${r} asiento=${0.45} ap=${[0, 0.8]} accion=${i % 2 ? 'leer' : 'charlar'} />
      <${Punto} t="banco" sala="jardin" i=${i * 2 + 1} p=${[x + 0.5 * Math.cos(r), 0.05, z - 0.5 * Math.sin(r)]} ry=${r} asiento=${0.45} ap=${[0, 0.8]} accion=${i % 2 ? 'leer' : 'charlar'} />
    <//>`)}
    ${[[-56, 28], [-56, 38], [-56, 44], [-44, 26], [-38, 26], [-50, -30], [-50, -38], [-50, -46], [-50, -56]].map(([x, z], i) => html`<${Punto} key=${'pa' + i} t="paseo" sala="jardin" i=${i} p=${[x, 0.05, z]} accion="pasear" />`)}
    ${FAROLAS.slice(7, 13).map(([x, z], i) => html`<${Farola} key=${'fa' + i} p=${[x, 0, z]} />`)}
  <//>`;
}

// Entrada al campus con el logo original, muro y banderas
function Perimetro() {
  const { x0, x1, z0, z1 } = CAMPUS;
  const muro = (a, b, c, d, k) => {
    const L = Math.hypot(c - a, d - b), ang = Math.atan2(c - a, d - b);
    return html`<${G} key=${k} p=${[(a + c) / 2, 0, (b + d) / 2]} r=${[0, ang, 0]}>
      <${B} m="B" p=${[0, 0.6, 0]} s=${[0.45, 1.2, L]} c=${COL.blanco} />
      <${B} m="B" p=${[0, 1.24, 0]} s=${[0.55, 0.08, L]} c=${COL.piedra} />
    <//>`;
  };
  const setos = [];
  for (let x = x0 + 4; x < x1 - 2; x += 6) if (Math.abs(x) > 9) setos.push(html`<${B} key=${'s' + x} p=${[x, 0.5, z1 - 1.6]} s=${[4.6, 1.0, 1.1]} c="#5f7f45" />`);
  return html`<${G}>
    <${B} p=${[0, 0.03, z1 + 14]} s=${[12, 0.05, 28]} c="#d9cdb6" />
    <${B} p=${[0, 0.03, (z1 + 44) / 2]} s=${[5, 0.05, z1 - 44]} c="#d9cdb6" />
    ${[0, 1, 2, 3, 4].map(i => html`<${Palmera} key=${'pl' + i} p=${[-8, 0, z1 + 4 + i * 6]} s=${0.95 + (i % 3) * 0.06} gira=${i} />`)}
    ${[0, 1, 2, 3, 4].map(i => html`<${Palmera} key=${'pr' + i} p=${[8, 0, z1 + 4 + i * 6]} s=${0.95 + ((i + 1) % 3) * 0.06} gira=${i + 2} />`)}
    <${G} p=${[0, 0, z1]}>
      <${B} m="B" p=${[-6.5, 3.2, 0]} s=${[1.4, 6.4, 1.4]} c=${COL.piedra} />
      <${B} m="B" p=${[6.5, 3.2, 0]} s=${[1.4, 6.4, 1.4]} c=${COL.piedra} />
      <${B} m="B" p=${[0, 6.6, 0]} s=${[14.4, 1.4, 1.6]} c=${COL.noche} />
      <${Panel} p=${[-4.9, 6.6, 0.82]} w=${1.7} h=${1.7} transp tex=${texLogo()} />
      <${Panel} p=${[1.1, 6.6, 0.82]} w=${9.4} h=${1.1} transp tex=${texRotuloTexto('COLEGIO PABLO PICASSO', '#ffffff')} />
      <${Panel} p=${[4.9, 6.6, -0.82]} r=${[0, PI, 0]} w=${1.7} h=${1.7} transp tex=${texLogo()} />
      <${Panel} p=${[-1.1, 6.6, -0.82]} r=${[0, PI, 0]} w=${9.4} h=${1.1} transp tex=${texRotuloTexto('COLEGIO PABLO PICASSO', '#ffffff')} />
    <//>
    <${Mastil} p=${[-16, 0, z1 - 4]} tex=${texBandera('es')} />
    <${Mastil} p=${[-13, 0, z1 - 4]} tex=${texBandera('eu')} />
    <${Mastil} p=${[-10, 0, z1 - 4]} tex=${texBandera('colegio')} />
    ${muro(x0, z1, -8, z1, 'm1')} ${muro(8, z1, x1, z1, 'm2')} ${muro(x1, z1, x1, z0, 'm3')} ${muro(x1, z0, x0, z0, 'm4')} ${muro(x0, z0, x0, z1, 'm5')}
    ${setos}
    ${FAROLAS.slice(13).map(([x, z], i) => html`<${Farola} key=${'fp' + i} p=${[x, 0, z]} />`)}
    ${[[-48, 47], [-48, -66], [70, 47], [70, 2], [70, -24], [70, -44], [40, -46], [52, -58], [62, -48], [44, -64], [-30, 47.5]].map(([x, z], i) => html`<${Arbol} key=${'x' + i} p=${[x, 0, z]} s=${0.95} tipo=${i % 3 === 0 ? 1 : 0} c=${i % 2 ? '#5e8a4c' : '#6f9a55'} />`)}
    <${B} p=${[49, 0.03, 13.5]} s=${[34, 0.05, 2.6]} c="#d9cdb6" />
    <${B} p=${[67, 0.03, -12]} s=${[3, 0.05, 54]} c="#d9cdb6" />
    <${B} p=${[-33, 0.03, 20]} s=${[4, 0.05, 2.4]} c="#d9cdb6" />
    <${B} m="B" p=${[33.7, 3.0, 0]} s=${[3.2, 0.18, 3.8]} c=${COL.noche} />
    <${B} m="B" p=${[33.7, 2.89, 0]} s=${[3.0, 0.04, 3.6]} c=${COL.maderaC} />
    <${B} p=${[33.7, 0.03, 0]} s=${[3.6, 0.06, 3.0]} c="#d9cdb6" />
  <//>`;
}

export function Exteriores() {
  return html`<${G}>
    <${Terreno} />
    <${Colinas} />
    <${Olivares} />
    <${Patio} />
    <${Jardin} />
    <${Perimetro} />
    <${Zonas} planta="exterior" />
  <//>`;
}
