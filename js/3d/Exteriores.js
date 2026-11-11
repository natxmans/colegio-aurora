// =========================================================
// EXTERIORES: terreno, patio central, jardines, entrada, palmeras,
// el mar Mediterráneo y las montañas (estamos en Valencia, España)
// =========================================================
import { html, THREE, useMemo, useRef, useFrame } from '../lib.js';
import { B, C, S, Cono, Ico, Toro, V, G, Panel, COL, COLORES_VIVOS, Banco, Farola, Arbol, Palmera, Planta, Mesa } from './piezas.js';
import { Alumno } from './Alumno.js';
import { Zonas } from './Interaccion.js';
import { texRotulo, texBandera, texCartel } from './texturas.js';

const PI = Math.PI;

function Terreno() {
  return html`<group>
    <mesh rotation=${[-PI / 2, 0, 0]} position=${[20, -0.05, -700]} receiveShadow>
      <planeGeometry args=${[3200, 2040]} />
      <meshStandardMaterial color="#9cbf78" roughness=${1} />
    </mesh>
    <mesh rotation=${[-PI / 2, 0, 0]} position=${[20, -0.04, 330]}>
      <planeGeometry args=${[1600, 40]} />
      <meshStandardMaterial color="#ead9b0" roughness=${1} />
    </mesh>
    <mesh rotation=${[-PI / 2, 0, 0]} position=${[20, -0.3, 700]}>
      <planeGeometry args=${[2400, 700]} />
      <meshStandardMaterial color="#2f86d1" roughness=${0.15} metalness=${0.3} />
    </mesh>
  </group>`;
}

function Montanas() {
  const m = [];
  const r = (i) => ((i * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 18; i++) {
    const x = -760 + i * 95 + r(i) * 40, z = -820 - r(i + 3) * 200, h = 70 + r(i + 7) * 110;
    m.push(html`<mesh key=${i} position=${[x, h / 2 - 5, z]}><coneGeometry args=${[140 + r(i + 1) * 90, h, 6]} /><meshStandardMaterial color=${i % 2 ? '#a9b9d4' : '#b8c6dd'} flatShading=${true} roughness=${1} /></mesh>`);
  }
  return html`<group>${m}</group>`;
}

function Mastil({ p, tex }) {
  return html`<${G} p=${p}>
    <${C} m="M" p=${[0, 4, 0]} s=${[0.12, 8, 0.12]} c=${COL.grisM} />
    <${S} m="M" p=${[0, 8.05, 0]} s=${0.2} c=${COL.grisM} />
    <${Panel} p=${[0.95, 7.0, 0]} w=${1.8} h=${1.2} tex=${tex} luz=${false} doble />
  <//>`;
}

// Patio central con fuente, árboles, bancos y pérgola solar
function Patio() {
  const arboles = [[-24, 18], [-24, 40], [24, 18], [24, 40], [-12, 44], [12, 44]];
  const bancos = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * PI * 2 + PI / 8;
    bancos.push(html`<${Banco} key=${i} p=${[Math.sin(a) * 10.5, 0.05, 29 + Math.cos(a) * 10.5]} r=${[0, a + PI, 0]} w=${2.2} />`);
  }
  return html`<${G}>
    <${B} p=${[0, 0.025, 30.5]} s=${[64, 0.05, 35]} c="#d9dee6" />
    ${[-16, 16].map(x => html`<${B} key=${'gz' + x} p=${[x, 0.06, 29]} s=${[11, 0.06, 13]} c="#79b35e" />`)}
    ${[-16, 16].map(x => html`<${B} key=${'gl' + x} m="L" p=${[x, 0.095, 29]} s=${[11.1, 0.01, 0.06]} c=${COL.cian} />`)}
    <${C} p=${[0, 0.15, 29]} s=${[12, 0.3, 12]} c=${COL.blanco} />
    <${C} m="L" p=${[0, 0.3, 29]} s=${[11.2, 0.02, 11.2]} c="#5cc8f5" />
    <${Toro} m="L" p=${[0, 0.32, 29]} r=${[PI / 2, 0, 0]} s=${[11.6, 11.6, 0.5]} c=${COL.cian} />
    <${C} m="B" p=${[0, 1.0, 29]} s=${[1.4, 1.6, 1.4]} c=${COL.blanco} />
    <${S} m="L" p=${[0, 2.2, 29]} s=${[0.8, 1.6, 0.8]} c="#a5e8ff" />
    <${Toro} m="L" p=${[0, 3.2, 29]} r=${[PI / 2, 0, 0]} s=${2.6} c=${COL.violeta} />
    ${bancos}
    ${arboles.map(([x, z], i) => html`<${G} key=${'a' + i}><${C} m="B" p=${[x, 0.3, z]} s=${[3, 0.6, 3]} c=${COL.blanco} /><${Arbol} p=${[x, 0.6, z]} s=${0.9} c=${i % 2 ? '#4f9e5b' : '#5aa865'} /><//>`)}
    <${G} p=${[-16, 0, 29]}>
      ${[[-5, -5], [5, -5], [-5, 5], [5, 5]].map(([a, b], i) => html`<${B} key=${i} m="M" p=${[a, 1.6, b]} s=${[0.2, 3.2, 0.2]} c=${COL.grisO} />`)}
      ${[-4, -2, 0, 2, 4].map(z => html`<${B} key=${'s' + z} m="B" p=${[0, 3.3, z]} r=${[0.2, 0, 0]} s=${[10.6, 0.06, 1.7]} c="#18306b" />`)}
      <${B} m="L" p=${[0, 3.22, 0]} s=${[10.6, 0.02, 0.06]} c=${COL.cian} />
      <${Mesa} p=${[-2.5, 0.06, 0]} w=${2.4} d=${1} c=${COL.maderaC} /><${Mesa} p=${[2.5, 0.06, 0]} w=${2.4} d=${1} c=${COL.maderaC} />
    <//>
    <${G} p=${[16, 0.06, 29]}>
      <${B} m="B" p=${[0, 0.76, 0]} s=${[1.525, 0.04, 2.74]} c="#1e4fd8" />
      <${B} p=${[0, 0.85, 0]} s=${[1.6, 0.15, 0.01]} c="#f8fafc" />
      ${[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => html`<${B} key=${i} m="M" p=${[a * 0.65, 0.37, b * 1.2]} s=${[0.05, 0.74, 0.05]} c=${COL.grisO} />`)}
    <//>
    <${Alumno} p=${[16, 0.06, 27.2]} pose="pingpong" objeto="raqueta" seed=${2201} />
    <${Alumno} p=${[16, 0.06, 30.8]} ry=${PI} pose="pingpong" objeto="raqueta" seed=${2202} />
    <${Alumno} p=${[-3.5, 0.05, 36]} ry=${2.6} pose="hablando" seed=${2203} />
    <${Alumno} p=${[-4.4, 0.05, 35.2]} ry=${0.9} pose="de_pie" seed=${2204} />
    <${Alumno} p=${[-2.6, 0.05, 35.0]} ry=${-0.8} pose="saludando" seed=${2205} />
    <${Alumno} p=${[5, 0.05, 22]} ry=${0} pose="hablando" seed=${2206} />
    <${Alumno} p=${[5.6, 0.05, 23.1]} ry=${PI + 0.6} pose="de_pie" seed=${2207} />
    <${Alumno} p=${[-17.2, 0.06, 29.8]} ry=${PI} pose="escribiendo" asiento=${0.45} seed=${2208} />
    <${Alumno} p=${[-15.6, 0.06, 28.2]} ry=${0} pose="charlando" asiento=${0.45} seed=${2209} />
    <${Alumno} p=${[Math.sin(PI / 8) * 10.5, 0.05, 29 + Math.cos(PI / 8) * 10.5]} ry=${PI / 8 + PI} pose="leyendo" objeto="libro" asiento=${0.45} seed=${2210} />
    <${Alumno} p=${[0, 0.05, 0]} pose="caminando" seed=${2211} ruta=${{ tipo: 'circulo', c: [0, 29], r: 8.2, vel: 1.1 }} />
    <${Alumno} p=${[0, 0.05, 0]} pose="caminando" seed=${2212} ruta=${{ tipo: 'linea', a: [-28, 21], b: [36, 15.5], vel: 1.2 }} />
    <${Alumno} p=${[0, 0.05, 0]} pose="corriendo" seed=${2213} ruta=${{ tipo: 'vaiven', c: [-8, 40], ax: 4, az: 2, w1: 0.8, w2: 1.1 }} />
    <${Alumno} p=${[0, 0.05, 0]} pose="corriendo" seed=${2214} ruta=${{ tipo: 'vaiven', c: [-7, 40], ax: 3, az: 2.5, w1: 0.9, w2: 0.7 }} />
    ${[[-30, 14], [30, 14], [-30, 46], [30, 46], [-10, 14], [10, 14]].map(([x, z], i) => html`<${Farola} key=${'f' + i} p=${[x, 0, z]} />`)}
  <//>`;
}

// Jardines al oeste: estanque, huerto, anfiteatro y caminos
function Jardin() {
  const huerto = [];
  for (let i = 0; i < 4; i++) {
    huerto.push(html`<${B} key=${'h' + i} p=${[-74 + i * 3.2, 0.3, -22]} s=${[2.4, 0.6, 7]} c=${COL.madera} />`);
    huerto.push(html`<${B} key=${'t' + i} p=${[-74 + i * 3.2, 0.61, -22]} s=${[2.2, 0.04, 6.8]} c="#5b4636" />`);
    for (let j = 0; j < 6; j++) huerto.push(html`<${Ico} key=${'v' + i + j} p=${[-74 + i * 3.2 + (j % 2 ? 0.5 : -0.5), 0.85, -24.8 + j * 1.1]} s=${0.5} c=${['#4ade80', '#22c55e', '#84cc16', '#f97316'][(i + j) % 4]} />`);
  }
  const anfi = [];
  for (let i = 0; i < 4; i++) {
    const r = 5 + i * 1.4;
    for (let k = 0; k < 9; k++) {
      const a = -PI / 2 + (k / 8) * PI;
      anfi.push(html`<${B} key=${i + '-' + k} p=${[-60 + Math.sin(a) * r, 0.22 + i * 0.4, 30 + Math.cos(a) * r]} r=${[0, a, 0]} s=${[r * 0.38, 0.44 + i * 0.8, 1.2]} c=${i % 2 ? '#e5e7eb' : '#d1d5db'} />`);
    }
  }
  const arboles = [[-78, -8, 0], [-70, 2, 1], [-46, -30, 0], [-50, -10, 0], [-76, 14, 1], [-44, 8, 0], [-48, 40, 0], [-78, 40, 1], [-68, -32, 0], [-56, -4, 1]];
  return html`<${G}>
    <${S} p=${[-62, -0.6, 4]} s=${[16, 1.4, 10]} c="#c7b98f" />
    <mesh position=${[-62, 0.06, 4]} rotation=${[-PI / 2, 0, 0]} scale=${[1, 0.62, 1]}>
      <circleGeometry args=${[7.4, 40]} />
      <meshStandardMaterial color="#3fa4dd" roughness=${0.08} metalness=${0.3} transparent opacity=${0.85} />
    </mesh>
    ${[0, 1, 2, 3, 4, 5].map(i => html`<${Ico} key=${'pi' + i} p=${[-62 + Math.cos(i) * 7.6, 0.2, 4 + Math.sin(i) * 4.6]} s=${[0.9, 0.5, 0.8]} c="#9ca3af" />`)}
    <${B} m="B" p=${[-62, 0.35, 4]} s=${[1.4, 0.12, 9.2]} c=${COL.madera} />
    <${B} m="L" p=${[-62, 0.29, 4]} s=${[1.42, 0.02, 9.2]} c=${COL.cian} />
    ${[[-52, -16, 8, 0.4], [-56, 18, 9, -0.3], [-66, 20, 7, 0.9], [-46, 24, 10, 0.2]].map(([x, z, l, a], i) => html`<${B} key=${'c' + i} p=${[x, 0.04, z]} r=${[0, a, 0]} s=${[2, 0.04, l]} c="#e5d8bd" />`)}
    ${huerto}
    <${Panel} p=${[-69.2, 1.1, -26.2]} w=${2.6} h=${0.8} tex=${texCartel('Huerto escolar', '#4ade80')} />
    ${anfi}
    <${B} p=${[-60, 0.15, 30]} s=${[6, 0.3, 3]} c="#e5e7eb" />
    <${Alumno} p=${[-60, 0.3, 30.4]} ry=${PI} pose="explicando" adulto seed=${2301} />
    ${[[-55.2, 31.2, 0.45, -1.2], [-56.5, 33.8, 0.85, -0.8], [-60, 35.3, 0.85, 0], [-63.5, 33.8, 0.85, 0.8], [-64.8, 31.2, 0.45, 1.2], [-61.6, 36.5, 1.25, 0.2]].map(([x, z, y, ry], i) => html`<${Alumno} key=${'an' + i} p=${[x, 0, z]} ry=${ry + PI} pose=${i % 2 ? 'escribiendo' : 'sentado'} asiento=${y} seed=${2310 + i} />`)}
    ${arboles.map(([x, z, t], i) => html`<${Arbol} key=${'ar' + i} p=${[x, 0, z]} s=${0.95 + (i % 3) * 0.15} tipo=${t} c=${i % 2 ? '#4f9e5b' : '#64b06a'} />`)}
    <${Alumno} p=${[-52, 0, 0]} ry=${-1} pose="sentado_suelo" seed=${2320} />
    <${Alumno} p=${[-50.8, 0, 0.6]} ry=${-2} pose="leyendo" objeto="libro" asiento=${0.02} seed=${2321} />
    <${Alumno} p=${[-71, 0, -18.4]} ry=${PI} pose="agachado" seed=${2322} />
    ${[[-44, -20], [-44, 20], [-76, 26]].map(([x, z], i) => html`<${Farola} key=${'fa' + i} p=${[x, 0, z]} />`)}
  <//>`;
}

// Entrada al campus, palmeras, banderas y muro perimetral con LED
function Perimetro() {
  const palmeras = [];
  for (let i = 0; i < 9; i++) {
    palmeras.push(html`<${Palmera} key=${'l' + i} p=${[-11, 0, 56 + i * 7]} s=${0.95 + (i % 3) * 0.08} gira=${i} />`);
    palmeras.push(html`<${Palmera} key=${'r' + i} p=${[11, 0, 56 + i * 7]} s=${0.95 + ((i + 1) % 3) * 0.08} gira=${i + 2} />`);
  }
  const muro = (x0, z0, x1, z1, k) => {
    const L = Math.hypot(x1 - x0, z1 - z0), a = Math.atan2(x1 - x0, z1 - z0);
    return html`<${G} key=${k} p=${[(x0 + x1) / 2, 0, (z0 + z1) / 2]} r=${[0, a, 0]}>
      <${B} m="B" p=${[0, 0.5, 0]} s=${[0.35, 1.0, L]} c=${COL.blanco} />
      <${B} m="L" p=${[0, 1.02, 0]} s=${[0.37, 0.03, L]} c=${COL.elec} />
    <//>`;
  };
  const arbolesN = [];
  for (let x = -76; x <= 36; x += 8) arbolesN.push(html`<${Arbol} key=${'n' + x} p=${[x, 0, -24 - (Math.abs(x) % 3)]} s=${0.9 + (Math.abs(x) % 4) * 0.08} tipo=${(x / 8) % 2 ? 1 : 0} />`);
  return html`<${G}>
    <${B} p=${[0, 0.02, 82]} s=${[14, 0.04, 66]} c="#d9dee6" />
    <${B} m="L" p=${[-6.9, 0.045, 82]} s=${[0.08, 0.01, 66]} c=${COL.cian} />
    <${B} m="L" p=${[6.9, 0.045, 82]} s=${[0.08, 0.01, 66]} c=${COL.cian} />
    <${B} p=${[0, 0.02, 49]} s=${[2.5, 0.04, 4]} c="#d9dee6" />
    ${palmeras}
    <${G} p=${[0, 0, 52]}>
      <${B} m="B" p=${[-7.5, 3.5, 0]} s=${[1.2, 7, 1.2]} c=${COL.blanco} />
      <${B} m="B" p=${[7.5, 3.5, 0]} s=${[1.2, 7, 1.2]} c=${COL.blanco} />
      <${B} m="B" p=${[0, 7.3, 0]} s=${[16.2, 1.0, 1.4]} c=${COL.blanco} />
      <${B} m="L" p=${[0, 6.75, 0.72]} s=${[16, 0.05, 0.04]} c=${COL.cian} />
      <${B} m="L" p=${[-6.88, 3.3, 0]} s=${[0.03, 6.4, 0.5]} c=${COL.cian} />
      <${B} m="L" p=${[6.88, 3.3, 0]} s=${[0.03, 6.4, 0.5]} c=${COL.cian} />
      <${Panel} p=${[0, 7.35, 0.72]} w=${7.4} h=${1.85} transp tex=${texRotulo('COLEGIO AURORA', 'Valencia · España', COL.cian)} />
      <${Panel} p=${[0, 7.35, -0.72]} r=${[0, PI, 0]} w=${7.4} h=${1.85} transp tex=${texRotulo('COLEGIO AURORA', 'Valencia · España', COL.cian)} />
    <//>
    <${Mastil} p=${[-9, 0, 47.5]} tex=${texBandera('es')} />
    <${Mastil} p=${[-6, 0, 47.5]} tex=${texBandera('eu')} />
    <${Mastil} p=${[6, 0, 47.5]} tex=${texBandera('aurora')} />
    ${muro(-84, 50, -8, 50, 'm1')} ${muro(8, 50, 126, 50, 'm2')} ${muro(126, 50, 126, 66, 'm2b')} ${muro(110, 66, 126, 66, 'm2c')}
    ${muro(-84, -82, 132, -82, 'm3')} ${muro(-84, -82, -84, 50, 'm4')} ${muro(132, -82, 132, 14, 'm5')}
    ${arbolesN}
    ${[[-36, 46], [-36, 14], [36, 46], [38, 22], [40, -14], [-36, -14], [118, 14], [124, 30], [124, 44]].map(([x, z], i) => html`<${Arbol} key=${'x' + i} p=${[x, 0, z]} s=${0.9} c=${i % 2 ? '#4f9e5b' : '#5aa865'} />`)}
    ${[[-28, 54], [28, 54], [-50, 56], [50, 56], [-70, 56], [70, 56], [90, 70], [110, 72]].map(([x, z], i) => html`<${Palmera} key=${'p' + i} p=${[x, 0, z]} s=${1.05} gira=${i * 0.7} />`)}
    <${B} p=${[-34, 0.02, 16]} s=${[8, 0.04, 3]} c="#d9dee6" />
    <${B} p=${[-34, 0.02, -2]} s=${[4, 0.04, 30]} c="#d9dee6" />
    <${Alumno} p=${[0, 0.05, 0]} pose="caminando" seed=${2401} ruta=${{ tipo: 'linea', a: [-2, 108], b: [-2, 52], vel: 1.3 }} />
    <${Alumno} p=${[0, 0.05, 0]} pose="caminando" seed=${2402} ruta=${{ tipo: 'linea', a: [2, 60], b: [2, 104], vel: 1.2 }} />
    <${Alumno} p=${[0, 0.05, 0]} pose="caminando" seed=${2403} ruta=${{ tipo: 'linea', a: [44, 16.8], b: [112, 16.8], vel: 1.4 }} />
    <${Alumno} p=${[0, 0.05, 0]} pose="corriendo" deporte seed=${2404} ruta=${{ tipo: 'linea', a: [108, 15.2], b: [46, 15.2], vel: 3 }} />
  <//>`;
}

export function Exteriores() {
  return html`<${G}>
    <${Terreno} />
    <${Montanas} />
    <${Patio} />
    <${Jardin} />
    <${Perimetro} />
    <${Zonas} planta="exterior" />
  <//>`;
}
