// =========================================================
// EXTERIORES: césped, patio central, jardines, entrada con el logo,
// muro del campus y, alrededor, olivares y colinas (un entorno tranquilo en España)
// =========================================================
import { html, THREE, useMemo } from '../lib.js';
import { B, C, S, Cono, Ico, Toro, V, G, Panel, COL, Banco, Farola, Arbol, Palmera, Planta, Mesa } from './piezas.js';
import { Alumno } from './Alumno.js';
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

// Patio delante de la entrada (x -32→8, z 13→44): fuente, olivos, bancos y flores
const FX = -15, FZ = 29; // centro de la fuente
function Patio() {
  const bancos = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * PI * 2 + PI / 8;
    bancos.push(html`<${Banco} key=${i} p=${[FX + Math.sin(a) * 8.6, 0.05, FZ + Math.cos(a) * 8.6]} r=${[0, a + PI, 0]} w=${2.2} c=${COL.madera} />`);
  }
  const enBanco = k => { const a = (k / 8) * PI * 2 + PI / 8; return [FX + Math.sin(a) * 8.6, 0.05, FZ + Math.cos(a) * 8.6]; };
  return html`<${G}>
    <${Plano} p=${[-12, 28.5]} w=${40} d=${31} tex=${texAdoquin()} rep=${4} y=${0.03} />
    <${G}><${B} p=${[-28, 0.08, 29]} s=${[6.4, 0.1, 15]} c="#7fa864" /><${B} p=${[-28, 0.06, 29]} s=${[6.8, 0.08, 15.4]} c=${COL.piedra} /><//>
    <${C} p=${[FX, 0.2, FZ]} s=${[11, 0.4, 11]} c=${COL.piedra} />
    <${C} p=${[FX, 0.36, FZ]} s=${[10.2, 0.04, 10.2]} c="#4aa3d6" />
    <${C} m="B" p=${[FX, 0.9, FZ]} s=${[2.4, 1.0, 2.4]} c=${COL.blanco} />
    <${C} m="B" p=${[FX, 1.6, FZ]} s=${[1.2, 0.5, 1.2]} c=${COL.blanco} />
    <${S} p=${[FX, 2.0, FZ]} s=${[0.5, 0.9, 0.5]} c="#bfe3f5" />
    ${bancos}
    ${[[-28, 24], [-28, 34], [-6, 21], [-6, 37]].map(([x, z], i) => html`<${Olivo} key=${'o' + i} p=${[x, 0.1, z]} s=${0.95} />`)}
    <${Flores} p=${[-24, 41]} w=${10} d=${2.4} seed=${3} />
    <${Flores} p=${[-8, 41]} w=${6} d=${2.4} seed=${9} />
    <${Flores} p=${[-24, 15.6]} w=${10} d=${2.0} seed=${15} />
    <${Flores} p=${[-9, 15.6]} w=${6} d=${2.0} seed=${21} />
    <${Flores} p=${[6.2, 29]} w=${2.4} d=${16} seed=${27} />
    ${[-30, -22].map((x, i) => html`<${Arbol} key=${'c' + i} p=${[x, 0, 46]} tipo=${1} s=${0.9} />`)}
    <${Alumno} p=${[-3.5, 0.05, 37]} ry=${2.6} pose="hablando" seed=${2203} />
    <${Alumno} p=${[-4.4, 0.05, 36.2]} ry=${0.9} pose="de_pie" seed=${2204} />
    <${Alumno} p=${[-2.6, 0.05, 36.0]} ry=${-0.8} pose="saludando" seed=${2205} />
    <${Alumno} p=${[4, 0.05, 21]} ry=${0} pose="hablando" seed=${2206} />
    <${Alumno} p=${[4.6, 0.05, 22.1]} ry=${PI + 0.6} pose="de_pie" seed=${2207} />
    <${Alumno} p=${enBanco(0)} ry=${PI / 8 + PI} pose="leyendo" objeto="libro" asiento=${0.45} seed=${2210} />
    <${Alumno} p=${enBanco(2)} ry=${5 * PI / 8 + PI} pose="charlando" asiento=${0.45} seed=${2215} />
    <${Alumno} p=${[-28, 0.1, 31.5]} ry=${0.3} pose="sentado_suelo" seed=${2208} />
    <${Alumno} p=${[-26.8, 0.1, 31.8]} ry=${-0.6} pose="leyendo" objeto="libro" asiento=${0.05} seed=${2209} />
    <${Alumno} p=${[0, 0.05, 0]} pose="caminando" seed=${2211} ruta=${{ tipo: 'circulo', c: [FX, FZ], r: 6.9, vel: 1.1 }} />
    <${Alumno} p=${[0, 0.05, 0]} pose="caminando" seed=${2212} ruta=${{ tipo: 'linea', a: [-28, 13.4], b: [62, 13.4], vel: 1.2 }} />
    <${Alumno} p=${[0, 0.05, 0]} pose="caminando" seed=${2213} ruta=${{ tipo: 'linea', a: [1.5, 50], b: [1.5, 13.5], vel: 1.0 }} />
    ${[[-31, 14], [-31, 44], [-10, 14], [6, 14], [6, 44]].map(([x, z], i) => html`<${Farola} key=${'f' + i} p=${[x, 0, z]} />`)}
  <//>`;
}

// Jardín al oeste (franja x -50→-34): estanque, camino, árboles y flores
function Jardin() {
  const arboles = [[-46, -56, 0], [-38, -46, 1], [-46, -34, 0], [-38, -22, 0], [-46, -10, 1], [-38, 0, 0], [-47, 30, 0], [-38, 36, 1], [-46, 43, 0], [-38, 8, 1]];
  return html`<${G}>
    <${S} p=${[-42, -0.6, 17]} s=${[11.4, 1.4, 8]} c="#c9b48e" />
    <mesh position=${[-42, 0.07, 17]} rotation=${[-PI / 2, 0, 0]} scale=${[1, 0.66, 1]}>
      <circleGeometry args=${[5.2, 48]} />
      <meshStandardMaterial color="#3f97cf" roughness=${0.08} metalness=${0.3} transparent opacity=${0.88} />
    </mesh>
    ${[0, 1, 2, 3, 4, 5, 6].map(i => html`<${Ico} key=${'pi' + i} p=${[-42 + Math.cos(i * 0.9) * 5.4, 0.2, 17 + Math.sin(i * 0.9) * 3.6]} s=${[0.8, 0.45, 0.7]} c="#b9b2a2" />`)}
    <${B} m="B" p=${[-42, 0.35, 17]} s=${[1.3, 0.12, 7.4]} c=${COL.madera} />
    <${B} p=${[-42, 0.04, -24]} s=${[2.2, 0.04, 66]} c="#e1d3b6" />
    <${B} p=${[-42, 0.04, 32.5]} s=${[2.2, 0.04, 23]} c="#e1d3b6" />
    <${B} p=${[-36, 0.04, 26]} s=${[10, 0.04, 2.2]} c="#e1d3b6" />
    ${arboles.map(([x, z, t], i) => html`<${Arbol} key=${'ar' + i} p=${[x, 0, z]} s=${0.95 + (i % 3) * 0.15} tipo=${t} c=${i % 2 ? '#5e8a4c' : '#6f9a55'} />`)}
    <${Flores} p=${[-46.5, 4]} w=${4} d=${3} seed=${31} />
    <${Flores} p=${[-37.5, -30]} w=${3} d=${4} seed=${41} />
    <${Flores} p=${[-46.5, 37]} w=${4} d=${3} seed=${51} />
    ${[[-46, 24, PI], [-38.6, -12, -PI / 2], [-45.6, -42, PI / 2]].map(([x, z, r], i) => html`<${Banco} key=${'b' + i} p=${[x, 0.05, z]} r=${[0, r, 0]} w=${2.2} c=${COL.madera} />`)}
    <${Alumno} p=${[-46, 0.05, 24]} ry=${PI} pose="leyendo" objeto="libro" asiento=${0.45} seed=${2320} />
    <${Alumno} p=${[-45, 0, 32]} ry=${-1} pose="sentado_suelo" seed=${2321} />
    <${Alumno} p=${[-43.8, 0, 32.6]} ry=${-2} pose="charlando" asiento=${0.02} seed=${2322} />
    <${Alumno} p=${[0, 0.05, 0]} pose="caminando" seed=${2323} ruta=${{ tipo: 'linea', a: [-41.5, -54], b: [-41.5, 10], vel: 0.9 }} />
    ${[[-36, -26], [-36, 42], [-48.5, 10]].map(([x, z], i) => html`<${Farola} key=${'fa' + i} p=${[x, 0, z]} />`)}
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
    ${[[-48, 47], [-48, -66], [70, 47], [70, 2], [70, -24], [70, -44], [40, -46], [52, -58], [62, -48], [44, -64], [-30, 47.5]].map(([x, z], i) => html`<${Arbol} key=${'x' + i} p=${[x, 0, z]} s=${0.95} tipo=${i % 3 === 0 ? 1 : 0} c=${i % 2 ? '#5e8a4c' : '#6f9a55'} />`)}
    <${B} p=${[49, 0.03, 13.5]} s=${[34, 0.05, 2.6]} c="#d9cdb6" />
    <${B} p=${[67, 0.03, -12]} s=${[3, 0.05, 54]} c="#d9cdb6" />
    <${B} p=${[-33, 0.03, 20]} s=${[4, 0.05, 2.4]} c="#d9cdb6" />
    <${Alumno} p=${[0, 0.05, 0]} pose="caminando" seed=${2401} ruta=${{ tipo: 'linea', a: [-1.5, z1 + 24], b: [-1.5, z1 - 2], vel: 1.3 }} />
    <${Alumno} p=${[0, 0.05, 0]} pose="caminando" seed=${2403} ruta=${{ tipo: 'linea', a: [34, 13.6], b: [64, 13.6], vel: 1.4 }} />
    <${Alumno} p=${[0, 0.05, 0]} pose="corriendo" deporte seed=${2404} ruta=${{ tipo: 'linea', a: [67, 12], b: [67, -38], vel: 3 }} />
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
