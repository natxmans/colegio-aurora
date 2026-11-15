// =========================================================
// LA RESIDENCIA: edificio independiente de dos plantas para los dormitorios
// x de -60 a -44, z de -20 a 20. Pasillo central (x de -53.5 a -50.5).
// · Planta baja: entrada (escalera + educador de noche), salón y habitaciones.
// · Primer piso: habitaciones dobles y un rincón de estar.
// Cada habitación doble: 2 camas, 2 escritorios, 2 armarios y 2 rincones personales.
// Los techos y la planta de arriba se levantan para ver el interior.
// =========================================================
import { html, useRef, useFrame, useLayoutEffect } from '../lib3d.js';
import { B, C, S, V, VT, G, Panel, COL, Silla, Portatil, Libro, Planta, Estanteria, Frente, TirasLed, Suelo, Mesa, MesaRedonda, Cama, Armario, Lampara, Pantalla, Arbol, Banco } from './piezas.js';
import { tocar } from './kit.js';
import { Punto } from './puntos.js';
import { SofaPlazas } from './Salas.js';
import { Sala } from './Edificio.js';
import { Zonas } from './Interaccion.js';
import { pisosRes } from './etiquetas.js';
import { leer } from '../estado.js';
import { POR_PLANTA, SALAS, RES, RY1, RH } from '../datos/salas.js';
import { texPoster, texLogo, texRotuloTexto, texPantalla, texLomos, texCartel } from './texturas.js';

const PI = Math.PI;
const { x0: X0, x1: X1, z0: Z0, z1: Z1 } = RES;
const [PX0, PX1] = RES.pasillo;
const CX = (X0 + X1) / 2;
const MURO = '#f4f0e8';

const MANTAS = ['#1f4e9a', '#14285a', '#2a62b8', '#c9a978', '#3b5fa8', '#8a5a3a'];
const POSTERS = ['espacio', 'futbol', 'musica', 'naturaleza', 'espana'];

// ---------------- HABITACIÓN DOBLE (coordenadas canónicas: pasillo hacia +z) ----------------
function Rincon({ lado, w, i, s }) {
  // Rincón personal de cada alumno: escritorio, silla, estante, corcho, póster y armario
  const xw = lado * (w / 2 - 0.38);
  const color = MANTAS[(i + (lado > 0 ? 3 : 0)) % 6];
  const k = lado < 0 ? 0 : 1;
  return html`<${G}>
    <${B} m="B" p=${[xw, 0.75, 0.05]} s=${[0.6, 0.04, 1.15]} c=${COL.maderaC} />
    <${B} m="B" p=${[xw, 0.37, -0.48]} s=${[0.56, 0.74, 0.04]} c=${COL.maderaC} />
    <${B} m="B" p=${[xw, 0.37, 0.58]} s=${[0.56, 0.74, 0.04]} c=${COL.maderaC} />
    <${Portatil} p=${[xw + lado * 0.05, 0.77, 0.15]} r=${[0, -lado * PI / 2, 0]} pantalla="#7fa7dc" />
    <${Lampara} p=${[xw + lado * 0.12, 0.77, -0.32]} />
    <${B} m="B" p=${[lado * (w / 2 - 0.19), 1.55, 0.05]} s=${[0.22, 0.03, 1.1]} c=${COL.madera} />
    <${Libro} p=${[lado * (w / 2 - 0.2), 1.67, -0.25]} r=${[0, 0, PI / 2]} c=${color} />
    <${Libro} p=${[lado * (w / 2 - 0.2), 1.67, -0.2]} r=${[0, 0, PI / 2]} c=${COL.beige} />
    <${Libro} p=${[lado * (w / 2 - 0.2), 1.67, -0.15]} r=${[0, 0, PI / 2]} c="#ffffff" />
    <${B} p=${[lado * (w / 2 - 0.095), 2.05, 0.05]} s=${[0.03, 0.55, 0.9]} c="#c9a978" />
    ${[0, 1, 2].map(n => html`<${B} key=${n} p=${[lado * (w / 2 - 0.115), 2.0 + (n % 2) * 0.16, -0.2 + n * 0.26]} s=${[0.01, 0.16, 0.2]} c=${['#ffffff', '#f2d06b', '#9bd0f0'][n]} />`)}
    <${Panel} p=${[lado * (w / 2 - 0.09), 2.1, -1.95]} r=${[0, -lado * PI / 2, 0]} w=${0.6} h=${0.84} tex=${texPoster(POSTERS[(i + k * 2) % 5])} luz=${false} />
    <${Silla} p=${[lado * (w / 2 - 0.95), 0, 0.05]} r=${[0, lado * PI / 2, 0]} c=${color} />
    <${Punto} t="escritorio" sala=${s.id} i=${k} p=${[lado * (w / 2 - 0.95), 0, 0.05]} ry=${lado * PI / 2} asiento=${0.45} ap=${[0, -0.6]} accion="escribir" />
    <${Armario} p=${[lado * (w / 2 - 0.38), 0, 1.95]} r=${[0, -lado * PI / 2, 0]} w=${1.0} h=${2.1} prof=${0.6} c=${COL.blanco} led=${COL.maderaC} />
    <${Punto} t="armario" sala=${s.id} i=${k} p=${[lado * (w / 2 - 1.02), 0, 1.95]} ry=${lado * PI / 2} accion="armario" />
    <${Cama} p=${[lado * (w / 2 - 0.6), 0, -1.95]} manta=${color} led=${COL.maderaC} />
    <${Punto} t="cama" sala=${s.id} i=${k} p=${[lado * (w / 2 - 0.6), 0.55, -1.95]} ap=${[-lado * 0.95, 0.5]} accion="dormir" />
    <${B} p=${[lado * (w / 2 - 1.45), 0.02, -1.6]} s=${[0.7, 0.02, 1.1]} c=${lado < 0 ? '#2b4a86' : '#b9863b'} />
  <//>`;
}

function HabitacionRes({ s }) {
  const w = s.w, d = s.d, h = s.h, i = s.num;
  const zc = d / 2 - 0.07, pa = -0.5, pb = 0.5; // puerta en el centro
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#dcc7a6" />
    <${B} p=${[(-w / 2 + pa) / 2, h / 2, zc]} s=${[pa + w / 2, h, 0.14]} c=${MURO} />
    <${B} p=${[(w / 2 + pb) / 2, h / 2, zc]} s=${[w / 2 - pb, h, 0.14]} c=${MURO} />
    <${B} p=${[0, 2.2 + (h - 2.2) / 2, zc]} s=${[pb - pa, h - 2.2, 0.14]} c=${MURO} />
    <${B} m="M" p=${[pa - 0.04, 1.1, zc + 0.08]} s=${[0.06, 2.2, 0.04]} c=${COL.noche} />
    <${B} m="M" p=${[pb + 0.04, 1.1, zc + 0.08]} s=${[0.06, 2.2, 0.04]} c=${COL.noche} />
    <${B} m="M" p=${[0, 2.23, zc + 0.08]} s=${[pb - pa + 0.14, 0.06, 0.04]} c=${COL.noche} />
    <${Panel} p=${[pb + 0.45, 1.6, zc + 0.08]} w=${0.32} h=${0.2} tex=${texCartel(String(i), '#c9a978')} />
    <${B} m="B" p=${[pa - 0.04 - 0.02, 1.05, zc - 0.42]} r=${[0, -1.2, 0]} s=${[0.04, 2.1, 0.9]} c=${COL.madera} />
    <${Rincon} lado=${-1} w=${w} i=${i} s=${s} />
    <${Rincon} lado=${1} w=${w} i=${i} s=${s} />
    <${G} p=${[0, 0, -2.85]}>
      <${B} m="B" p=${[0, 0.25, 0]} s=${[0.45, 0.5, 0.38]} c=${COL.madera} />
      <${Lampara} p=${[0, 0.5, 0]} c=${COL.calido} />
    <//>
    <${S} m="L" p=${[0, h - 0.06, -0.4]} s=${[0.5, 0.06, 0.5]} c=${COL.calido} />
  <//>`;
}

// ---------------- ESPACIOS COMUNES DE LA RESIDENCIA ----------------
// Entrada (planta baja, lado este): escalera, educador de noche, sofá y buzones.
// Canónicas: x = z del mundo, +z = pasillo, -z = fachada este (puerta en x de -1.1 a 1.1)
function HallRes({ s }) {
  const escalones = [];
  for (let i = 0; i < 14; i++) {
    const yTop = (i + 1) * (RY1 / 14), lx = 3.75 - i * 0.5;
    escalones.push(html`<${B} key=${'e' + i} m="B" p=${[lx, yTop - 0.05, 2.3]} s=${[0.52, 0.1, 1.3]} c=${COL.maderaC} />`);
  }
  return html`<${G}>
    <${Suelo} w=${s.w} d=${s.d} c="#e8dfd0" />
    ${escalones}
    <${B} p=${[-1.1, 0.9, 2.3]} s=${[3.8, 1.8, 1.3]} c=${MURO} />
    <${B} m="M" p=${[0.4, 2.85, 1.62]} r=${[0, 0, -Math.atan2(RY1, 7)]} s=${[7.9, 0.06, 0.05]} c=${COL.maderaC} />
    <${V} p=${[0.4, 2.35, 1.63]} r=${[0, 0, -Math.atan2(RY1, 7)]} s=${[7.8, 0.9, 0.03]} />
    <${Mesa} p=${[2.75, 0, -1.6]} r=${[0, PI / 2, 0]} w=${1.5} d=${0.7} c=${COL.madera} />
    <${Portatil} p=${[2.7, 0.77, -1.6]} r=${[0, -PI / 2, 0]} />
    <${Silla} p=${[3.5, 0, -1.6]} r=${[0, -PI / 2, 0]} c=${COL.noche} />
    <${Punto} t="trabajo" sala=${s.id} rol="educador" p=${[3.5, 0, -1.6]} ry=${-PI / 2} asiento=${0.45} ap=${[0, -0.7]} accion="vigilar" />
    <${SofaPlazas} p=${[-3.4, 0, -2.6]} w=${2.0} c=${COL.noche} cojin=${COL.beige} sala=${s.id} accion="charlar" />
    <${MesaRedonda} p=${[-3.4, 0, -1.5]} d=${0.7} alto=${0.42} />
    ${[0, 1, 2, 3, 4, 5].map(k => html`<${B} key=${'bz' + k} m="M" p=${[-4.86, 1.3 + (k % 2) * 0.32, -0.9 + Math.floor(k / 2) * 0.5]} s=${[0.1, 0.28, 0.44]} c=${k % 2 ? '#a7a49c' : '#c9cfd8'} />`)}
    <${Planta} p=${[-4.4, 0, 0.9]} s=${1.1} tipo=${1} /><${Planta} p=${[4.5, 0, -2.8]} s=${1.0} tipo=${2} />
    <${Panel} p=${[0, 2.6, -3.08]} w=${2.2} h=${0.66} tex=${texCartel('Residencia', COL.maderaC)} />
  <//>`;
}

// Salón de la residencia (planta baja, lado oeste). Canónicas: x = -z del mundo, +z = pasillo
function SalonRes({ s }) {
  const w = s.w, d = s.d, h = s.h;
  const juegos = [];
  let k = 0;
  for (const [x, z] of [[2.6, -1.0], [5.6, 1.1]]) {
    juegos.push(html`<${Mesa} key=${'m' + x} p=${[x, 0, z]} w=${1.5} d=${0.9} c=${COL.maderaC} />`);
    juegos.push(html`<${B} key=${'t' + x} p=${[x, 0.77, z]} s=${[0.5, 0.02, 0.5]} c=${['#b84a55', '#2a62b8'][k % 2]} />`);
    for (const lado of [-1, 1]) {
      juegos.push(html`<${Silla} key=${'s' + x + lado} p=${[x, 0, z + lado * 0.75]} r=${[0, lado < 0 ? 0 : PI, 0]} c=${COL.noche} />`);
      juegos.push(html`<${Punto} key=${'q' + x + lado} t="juego_mesa" sala=${s.id} i=${k++} p=${[x, 0, z + lado * 0.75]} ry=${lado < 0 ? 0 : PI} asiento=${0.45} ap=${[0, -0.6]} accion="juego_mesa" />`);
    }
  }
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#e6d9c3" borde=${COL.maderaC} />
    <${Frente} w=${w} d=${d} h=${h} puerta=${[-3.0, 4.0]} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${COL.calido} />
    <${B} p=${[-4.6, 0.02, -0.6]} s=${[5.6, 0.02, 3.6]} c="#2b3f72" />
    <${Pantalla} p=${[-w / 2 + 0.2, 1.55, -0.6]} r=${[0, PI / 2, 0]} w=${2.6} h=${1.46} tex=${texPantalla('pelicula')} />
    <${B} m="B" p=${[-w / 2 + 0.35, 0.3, -0.6]} s=${[0.45, 0.6, 3.0]} c=${COL.madera} />
    <${SofaPlazas} p=${[-3.4, 0, -0.6]} ry=${-PI / 2} w=${2.6} c=${COL.noche} cojin=${COL.beige} sala=${s.id} accion="tele" />
    <${SofaPlazas} p=${[-5.2, 0, -2.6]} w=${2.2} c=${s.color} cojin=${COL.beige} sala=${s.id} accion="tele" i0=${3} />
    <${SofaPlazas} p=${[-5.2, 0, 1.6]} ry=${PI} w=${2.2} c=${s.color} cojin=${COL.beige} sala=${s.id} accion="tele" i0=${6} />
    ${juegos}
    <${Estanteria} p=${[w / 2 - 0.27, 0, -0.5]} r=${[0, -PI / 2, 0]} w=${2.0} h=${2.2} niveles=${5} tex=${texLomos(101, 5)} c=${COL.maderaC} led=${COL.maderaC} />
    ${[-0.6, 7.2].map((x, i) => html`<${Planta} key=${'p' + i} p=${[x, 0, -2.75]} s=${1.1} tipo=${i % 3} />`)}
    <${Panel} p=${[1.0, 2.7, d / 2 - 0.06]} r=${[0, PI, 0]} w=${2.4} h=${0.72} tex=${texCartel('Salón', COL.maderaC)} />
  <//>`;
}

// Rincón de estar (primer piso, junto a la escalera). Mismas coordenadas que la entrada.
function EstarRes({ s }) {
  return html`<${G}>
    <${Suelo} w=${s.w} d=${s.d} c="#e2d3bb" />
    <${V} p=${[0.55, 0.55, 1.6]} s=${[7.2, 1.0, 0.04]} />
    <${B} m="M" p=${[0.55, 1.07, 1.6]} s=${[7.2, 0.05, 0.07]} c=${COL.maderaC} />
    <${V} p=${[4.15, 0.55, 2.3]} s=${[0.04, 1.0, 1.4]} />
    <${B} m="M" p=${[4.15, 1.07, 2.3]} s=${[0.07, 0.05, 1.4]} c=${COL.maderaC} />
    <${V} p=${[0.55, 0.55, 3.0]} s=${[7.2, 1.0, 0.04]} />
    <${SofaPlazas} p=${[1.3, 0, -2.6]} w=${2.4} c=${COL.noche} cojin=${COL.beige} sala=${s.id} accion="charlar" />
    <${SofaPlazas} p=${[3.9, 0, -1.2]} ry=${-PI / 2} w=${1.8} c=${'#a0673f'} cojin=${COL.beige} sala=${s.id} accion="charlar" i0=${3} />
    <${MesaRedonda} p=${[1.6, 0, -1.4]} d=${0.8} alto=${0.42} />
    <${Estanteria} p=${[-2.2, 0, -2.95]} w=${1.8} h=${1.6} niveles=${4} tex=${texLomos(111, 4)} c=${COL.maderaC} led=${COL.maderaC} />
    <${Planta} p=${[-4.3, 0, -2.6]} s=${1.1} tipo=${0} />
    <${Punto} t="trabajo" sala=${s.id} rol="educador" i=${1} p=${[-1.5, 0, -1.0]} ry=${PI / 2} accion="vigilar" />
  <//>`;
}

const COMP_RES = { habitacion: HabitacionRes, hallres: HallRes, salonres: SalonRes, estarres: EstarRes };

// ---------------- MUROS CON VENTANAS ----------------
// Ventanas de cada sala: [centro z, ancho, id de la sala]
function ventanasDe(planta, lado) {
  return POR_PLANTA[planta].filter(s => s.lado === lado).flatMap(s => {
    if (s.tipo === 'habitacion') return [[s.cz, Math.min(2.0, s.w - 1.2), s.id]];
    if (s.tipo === 'salonres') return [[s.cz - 5, 2.6, s.id], [s.cz, 2.6, s.id], [s.cz + 5, 2.6, s.id]];
    if (s.tipo === 'estarres') return [[s.cz - 2.4, 2.4, s.id], [s.cz + 2.4, 2.4, s.id]];
    if (s.tipo === 'hallres') return [[-3.0, 1.6, s.id], [3.0, 1.6, s.id]];
    return [];
  });
}
// Ventanas de la residencia (las usa la iluminación de noche): { x, y, z, w, h, lado, sala }
export const VENTANAS_RES = [];
for (const [planta, y0] of [['res0', 0], ['res1', RY1]]) for (const lado of ['oeste', 'este']) for (const [c, an, sid] of ventanasDe(planta, lado)) {
  VENTANAS_RES.push({ x: lado === 'oeste' ? X0 - 0.03 : X1 + 0.03, y: y0 + 1.75, z: c, w: an - 0.1, h: 1.6, lado: lado === 'oeste' ? -1 : 1, sala: sid });
}
// Muro a lo largo de z (fachadas este y oeste) con ventanas [centro, ancho]
function MuroZ({ x, lado, a, b, h, ventanas, alf = 0.9, alto = 1.7, sala, y0 }) {
  const piezas = [];
  let z = a;
  const ord = ventanas.filter(v => v[0] > a && v[0] < b).sort((p, q) => p[0] - q[0]);
  const yv = alf + alto / 2;
  ord.forEach(([c, an, sid], k) => {
    const v0 = c - an / 2, v1 = c + an / 2;
    if (v0 > z + 0.01) piezas.push(html`<${B} key=${'m' + k} p=${[x, h / 2, (z + v0) / 2]} s=${[0.25, h, v0 - z]} c=${MURO} />`);
    piezas.push(html`<${B} key=${'i' + k} p=${[x, alf / 2, c]} s=${[0.25, alf, an]} c=${MURO} />`);
    piezas.push(html`<${B} key=${'s' + k} p=${[x, (alf + alto + h) / 2, c]} s=${[0.25, h - alf - alto, an]} c=${MURO} />`);
    piezas.push(html`<${V} key=${'v' + k} p=${[x, yv, c]} s=${[0.05, alto, an]} c="#cfe0ea" />`);
    const xf = x + lado * 0.13;
    piezas.push(html`<${B} key=${'f1' + k} m="M" p=${[xf, alf + alto + 0.04, c]} s=${[0.06, 0.08, an + 0.12]} c=${COL.noche} />`);
    piezas.push(html`<${B} key=${'f2' + k} m="M" p=${[xf, yv, v0 - 0.03]} s=${[0.06, alto + 0.08, 0.06]} c=${COL.noche} />`);
    piezas.push(html`<${B} key=${'f3' + k} m="M" p=${[xf, yv, v1 + 0.03]} s=${[0.06, alto + 0.08, 0.06]} c=${COL.noche} />`);
    piezas.push(html`<${B} key=${'f4' + k} m="M" p=${[xf, yv, c]} s=${[0.05, alto, 0.05]} c=${COL.noche} />`);
    piezas.push(html`<${B} key=${'f5' + k} m="B" p=${[x + lado * 0.2, alf - 0.04, c]} s=${[0.22, 0.08, an + 0.2]} c=${COL.blanco} />`);
    // lamas de madera junto a la ventana
    piezas.push(html`<${B} key=${'l' + k} m="B" p=${[x + lado * 0.2, h / 2, v1 + 0.35]} s=${[0.14, h - 0.2, 0.32]} c=${COL.madera} />`);
    z = v1;
  });
  if (b > z + 0.01) piezas.push(html`<${B} key="fin" p=${[x, h / 2, (z + b) / 2]} s=${[0.25, h, b - z]} c=${MURO} />`);
  return piezas;
}

// Una planta de la residencia (muros exteriores, tabiques, suelo y salas)
function PlantaRes({ planta, y0 }) {
  const salas = POR_PLANTA[planta];
  const h = 3.8; // de suelo a suelo (las salas miden 3.4 + 0.4 de forjado)
  const ventanas = (lado) => ventanasDe(planta, lado);
  // tabiques entre salas (a lo largo de x)
  const tabiques = [];
  for (const lado of ['oeste', 'este']) {
    const [a, b] = lado === 'oeste' ? [X0, PX0] : [PX1, X1];
    const cortes = [...new Set(salas.filter(s => s.lado === lado).flatMap(s => [s.z0, s.z1]))].filter(z => z > Z0 + 0.1 && z < Z1 - 0.1);
    for (const z of cortes) tabiques.push(html`<${B} key=${lado + z} p=${[(a + b) / 2, RH / 2, z]} s=${[b - a, RH, 0.14]} c=${MURO} />`);
  }
  const esBaja = planta === 'res0';
  const hall = SALAS.hallres;
  return html`<${G}>
    ${esBaja ? html`<${B} p=${[CX, -0.2, 0]} s=${[X1 - X0 + 0.5, 0.4, Z1 - Z0 + 0.5]} c="#e3dccf" />` : html`
      <${B} p=${[(X0 - 0.25 - 50.3) / 2, -0.2, 0]} s=${[-50.3 - X0 + 0.25, 0.4, Z1 - Z0 + 0.5]} c="#e3dccf" />
      <${B} p=${[(-48.8 + X1 + 0.25) / 2, -0.2, 0]} s=${[X1 + 0.25 + 48.8, 0.4, Z1 - Z0 + 0.5]} c="#e3dccf" />
      <${B} p=${[-49.55, -0.2, (-3.0 + Z0 - 0.25) / 2]} s=${[1.5, 0.4, -3.0 - Z0 + 0.25]} c="#e3dccf" />
      <${B} p=${[-49.55, -0.2, (4.15 + Z1 + 0.25) / 2]} s=${[1.5, 0.4, Z1 + 0.25 - 4.15]} c="#e3dccf" />
    `}
    <${B} p=${[(PX0 + PX1) / 2, 0.02, 0]} s=${[PX1 - PX0, 0.04, Z1 - Z0 - 0.3]} c="#c9b48e" />
    <${B} p=${[(PX0 + PX1) / 2, 0.045, 0]} s=${[0.8, 0.01, Z1 - Z0 - 1]} c="#20345f" />
    ${salas.map(s => html`<${Sala} key=${s.id} s=${s} comp=${COMP_RES} />`)}
    ${tabiques}
    <${MuroZ} x=${X0 - 0.12} lado=${-1} a=${Z0} b=${Z1} h=${h} ventanas=${ventanas('oeste')} y0=${y0} />
    ${esBaja ? html`
      <${MuroZ} x=${X1 + 0.12} lado=${1} a=${Z0} b=${hall.z0} h=${h} ventanas=${ventanas('este')} y0=${y0} />
      <${MuroZ} x=${X1 + 0.12} lado=${1} a=${hall.z1} b=${Z1} h=${h} ventanas=${ventanas('este')} y0=${y0} />
      <${MuroZ} x=${X1 + 0.12} lado=${1} a=${hall.z0} b=${-1.1} h=${h} ventanas=${ventanas('este')} y0=${y0} />
      <${MuroZ} x=${X1 + 0.12} lado=${1} a=${1.1} b=${hall.z1} h=${h} ventanas=${ventanas('este')} y0=${y0} />
      <${B} p=${[X1 + 0.12, 2.6 + (h - 2.6) / 2, 0]} s=${[0.25, h - 2.6, 2.2]} c=${MURO} />
      <${B} m="M" p=${[X1 + 0.02, 1.3, -1.12]} s=${[0.06, 2.6, 0.06]} c=${COL.noche} />
      <${B} m="M" p=${[X1 + 0.02, 1.3, 1.12]} s=${[0.06, 2.6, 0.06]} c=${COL.noche} />
      <${B} m="M" p=${[X1 + 0.02, 2.6, 0]} s=${[0.06, 0.08, 2.3]} c=${COL.noche} />
      <${B} p=${[X1, 0.01, 0]} s=${[0.5, 0.02, 2.2]} c="#ddd3c2" />
    ` : html`<${MuroZ} x=${X1 + 0.12} lado=${1} a=${Z0} b=${Z1} h=${h} ventanas=${ventanas('este')} y0=${y0} />`}
    <${B} p=${[(X0 + PX0) / 2, h / 2, Z0 - 0.12]} s=${[PX0 - X0, h, 0.25]} c=${MURO} />
    <${B} p=${[(PX1 + X1) / 2, h / 2, Z0 - 0.12]} s=${[X1 - PX1, h, 0.25]} c=${MURO} />
    <${B} p=${[(X0 + PX0) / 2, h / 2, Z1 + 0.12]} s=${[PX0 - X0, h, 0.25]} c=${MURO} />
    <${B} p=${[(PX1 + X1) / 2, h / 2, Z1 + 0.12]} s=${[X1 - PX1, h, 0.25]} c=${MURO} />
    <${B} p=${[(PX0 + PX1) / 2, 0.45, Z0 - 0.12]} s=${[PX1 - PX0, 0.9, 0.25]} c=${MURO} />
    <${B} p=${[(PX0 + PX1) / 2, (2.6 + h) / 2, Z0 - 0.12]} s=${[PX1 - PX0, h - 2.6, 0.25]} c=${MURO} />
    <${V} p=${[(PX0 + PX1) / 2, 1.75, Z0 - 0.12]} s=${[PX1 - PX0, 1.7, 0.05]} c="#cfe0ea" />
    ${esBaja ? html`
      <${B} p=${[(PX0 + PX1) / 2, (2.4 + h) / 2, Z1 + 0.12]} s=${[PX1 - PX0, h - 2.4, 0.25]} c=${MURO} />
      <${B} p=${[(PX0 + PX1) / 2, 0.01, Z1]} s=${[PX1 - PX0 - 0.6, 0.02, 0.5]} c="#ddd3c2" />
      <${B} m="M" p=${[PX0 + 0.25, 1.2, Z1 + 0.02]} s=${[0.06, 2.4, 0.08]} c=${COL.noche} />
      <${B} m="M" p=${[PX1 - 0.25, 1.2, Z1 + 0.02]} s=${[0.06, 2.4, 0.08]} c=${COL.noche} />
      <${B} p=${[PX0 + 0.12, 1.2, Z1 + 0.12]} s=${[0.25, 2.4, 0.25]} c=${MURO} />
      <${B} p=${[PX1 - 0.12, 1.2, Z1 + 0.12]} s=${[0.25, 2.4, 0.25]} c=${MURO} />
    ` : html`
      <${B} p=${[(PX0 + PX1) / 2, 0.45, Z1 + 0.12]} s=${[PX1 - PX0, 0.9, 0.25]} c=${MURO} />
      <${B} p=${[(PX0 + PX1) / 2, (2.6 + h) / 2, Z1 + 0.12]} s=${[PX1 - PX0, h - 2.6, 0.25]} c=${MURO} />
      <${V} p=${[(PX0 + PX1) / 2, 1.75, Z1 + 0.12]} s=${[PX1 - PX0, 1.7, 0.05]} c="#cfe0ea" />
    `}
    <${B} m="L" p=${[(PX0 + PX1) / 2, RH - 0.05, 0]} s=${[0.06, 0.03, Z1 - Z0 - 1]} c=${COL.calido} />
    <${B} m="B" p=${[CX, h - 0.2, Z0 - 0.27]} s=${[X1 - X0 + 0.6, 0.4, 0.06]} c=${COL.blanco} />
    <${B} m="B" p=${[CX, h - 0.2, Z1 + 0.27]} s=${[X1 - X0 + 0.6, 0.4, 0.06]} c=${COL.blanco} />
    <${B} m="B" p=${[X0 - 0.27, h - 0.2, 0]} s=${[0.06, 0.4, Z1 - Z0 + 0.6]} c=${COL.blanco} />
    <${B} m="B" p=${[X1 + 0.27, h - 0.2, 0]} s=${[0.06, 0.4, Z1 - Z0 + 0.6]} c=${COL.blanco} />
    <${Zonas} planta=${planta} />
  <//>`;
}

// Techo plano completo: forjado, peto, paneles solares y lucernario sobre el pasillo
function TechoRes() {
  const paneles = [];
  for (const x of [-58.2, -46.0]) for (let z = -17.5; z <= 17.6; z += 2.5) paneles.push(html`<${G} key=${'p' + x + z} p=${[x, 0.62, z]} r=${[0, 0, x < CX ? 0.28 : -0.28]}>
    <${B} m="B" s=${[1.35, 0.05, 2.2]} c="#1d2f57" />
    <${B} m="M" p=${[0, -0.03, 0]} s=${[1.4, 0.03, 2.25]} c=${COL.grisM} />
  <//>`);
  return html`<${G}>
    <${B} m="B" p=${[CX, 0.25, 0]} s=${[X1 - X0 + 0.7, 0.5, Z1 - Z0 + 0.7]} c="#f4f1ea" />
    <${B} m="B" p=${[CX, 0.6, Z0 - 0.25]} s=${[X1 - X0 + 0.7, 0.7, 0.22]} c=${COL.blanco} />
    <${B} m="B" p=${[CX, 0.6, Z1 + 0.25]} s=${[X1 - X0 + 0.7, 0.7, 0.22]} c=${COL.blanco} />
    <${B} m="B" p=${[X0 - 0.25, 0.6, 0]} s=${[0.22, 0.7, Z1 - Z0 + 0.7]} c=${COL.blanco} />
    <${B} m="B" p=${[X1 + 0.25, 0.6, 0]} s=${[0.22, 0.7, Z1 - Z0 + 0.7]} c=${COL.blanco} />
    <${B} m="M" p=${[CX, 0.97, Z1 + 0.37]} s=${[X1 - X0 + 0.7, 0.06, 0.04]} c=${COL.noche} />
    <${B} m="M" p=${[CX, 0.97, Z0 - 0.37]} s=${[X1 - X0 + 0.7, 0.06, 0.04]} c=${COL.noche} />
    <${B} m="M" p=${[X1 + 0.37, 0.97, 0]} s=${[0.04, 0.06, Z1 - Z0 + 0.7]} c=${COL.noche} />
    <${B} m="M" p=${[X0 - 0.37, 0.97, 0]} s=${[0.04, 0.06, Z1 - Z0 + 0.7]} c=${COL.noche} />
    ${paneles}
    <${VT} p=${[(PX0 + PX1) / 2, 0.85, 0]} s=${[2.6, 0.7, 30]} c="#bcd6e8" />
    ${[-1.3, 1.3].map(d => html`<${B} key=${'rl' + d} m="M" p=${[(PX0 + PX1) / 2 + d, 1.22, 0]} s=${[0.08, 0.08, 30.1]} c=${COL.noche} />`)}
    ${[-15, -10, -5, 0, 5, 10, 15].map(z => html`<${B} key=${'rt' + z} m="M" p=${[(PX0 + PX1) / 2, 1.22, z]} s=${[2.7, 0.06, 0.08]} c=${COL.noche} />`)}
    <${B} p=${[-52, 0.55, -15.5]} s=${[1.6, 0.6, 1.2]} c=${COL.grisM} />
  <//>`;
}

// Marquesina de la entrada y pasarela cubierta hasta el edificio principal
function Exterior() {
  const postes = [];
  for (const x of [-42.8, -39.9, -37.0, -34.1]) for (const z of [-1.7, 1.7]) postes.push(html`<${B} key=${x + '' + z} m="M" p=${[x, 1.45, z]} s=${[0.16, 2.9, 0.16]} c=${COL.noche} />`);
  return html`<${G}>
    <${B} m="B" p=${[-38.05, 3.0, 0]} s=${[11.3, 0.18, 4.0]} c=${COL.noche} />
    <${B} m="B" p=${[-38.05, 2.89, 0]} s=${[11.1, 0.04, 3.8]} c=${COL.maderaC} />
    <${B} m="L" p=${[-38.05, 2.86, 0]} s=${[10.6, 0.02, 0.1]} c=${COL.calido} />
    ${postes}
    <${B} p=${[-38.05, 0.03, 0]} s=${[11.3, 0.06, 3.2]} c="#d9cdb6" />
    <${Panel} p=${[X1 + 0.3, 5.55, 0]} r=${[0, PI / 2, 0]} w=${1.5} h=${1.5} transp tex=${texLogo()} />
    <${B} m="B" p=${[X1 + 0.29, 6.8, 0]} s=${[0.06, 0.62, 6.4]} c=${COL.noche} />
    <${Panel} p=${[X1 + 0.33, 6.8, 0]} r=${[0, PI / 2, 0]} w=${5.8} h=${0.56} transp tex=${texRotuloTexto('RESIDENCIA', '#ffffff')} />
    <${Planta} p=${[X1 + 1.2, 0, -2.6]} s=${1.3} tipo=${1} /><${Planta} p=${[X1 + 1.2, 0, 2.6]} s=${1.3} tipo=${1} />
    <${B} p=${[-52, 0.03, Z1 + 2.2]} s=${[3.2, 0.06, 4.4]} c="#d9cdb6" />
  <//>`;
}

export function Residencia() {
  const g1 = useRef(), gT = useRef();
  const st = useRef({ y1: 0, yT: 0 });
  useLayoutEffect(() => { g1.current.updateMatrix(); gT.current.updateMatrix(); tocar(); }, []);
  useFrame((_, dt) => {
    const s = leer();
    const k = 1 - Math.exp(-Math.min(dt, 0.05) * 3.4);
    const sel = SALAS[s.sel];
    const enRes = sel && sel.edificio === 'residencia';
    const vista = s.resVista; // null | 'res1' | 'res0'
    const oc1 = vista === 'res0' || (enRes && sel.planta === 'res0');
    const ocT = !s.techo || oc1 || vista === 'res1' || enRes;
    const t1 = oc1 ? 26 : 0, tT = ocT ? t1 + 24 : 0;
    const e = st.current;
    let cambio = false;
    const mover = (clave, ref, objetivo, oculto, base) => {
      const g = ref.current;
      if (Math.abs(objetivo - e[clave]) > 0.003) {
        e[clave] += (objetivo - e[clave]) * k;
        if (Math.abs(objetivo - e[clave]) < 0.003) e[clave] = objetivo;
        g.position.y = base + e[clave]; g.updateMatrix(); cambio = true;
      }
      const vis = !(oculto && Math.abs(objetivo - e[clave]) < 0.8);
      if (g.visible !== vis) { g.visible = vis; cambio = true; }
    };
    mover('y1', g1, t1, oc1, RY1);
    mover('yT', gT, tT, ocT, RY1 * 2);
    pisosRes.y1 = e.y1; pisosRes.v1 = g1.current.visible;
    if (cambio) tocar();
  });
  return html`<${G}>
    <${PlantaRes} planta="res0" y0=${0} />
    <group ref=${g1} position=${[0, RY1, 0]} matrixAutoUpdate=${false}><${PlantaRes} planta="res1" y0=${RY1} /></group>
    <group ref=${gT} position=${[0, RY1 * 2, 0]} matrixAutoUpdate=${false}><${TechoRes} /></group>
    <${Exterior} />
    <${Zonas} planta="residencia" />
  <//>`;
}

