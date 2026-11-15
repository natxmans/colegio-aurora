// =========================================================
// ESPACIOS DEL EDIFICIO PRINCIPAL (además de las aulas):
// planta baja: biblioteca digital, entrada, comedor
// primer piso: vida escolar, permanencia, sala de profesores, sala de estudio,
//              salón de lectura, salón de descanso, salón común y sala de juegos
// Coordenadas canónicas: pasillo hacia +z, fachada exterior hacia -z.
// Las personas NO están dibujadas aquí: cada silla, sofá o puesto deja un
// <Punto> que la simulación de la vida del colegio usa para colocarlas.
// =========================================================
import { html } from '../lib3d.js';
import { B, C, S, Ico, Toro, V, G, Panel, COL, COLORES_VIVOS, Silla, Portatil, Monitor, Libro, Planta, Estanteria, Frente, TirasLed, Suelo, Mesa, MesaRedonda, Sofa, Puf, Lampara, Pantalla, Armario, Pupitre } from './piezas.js';
import { Punto } from './puntos.js';
import { texPantalla, texLomos, texCartel, texLogo, texRotuloTexto, texPoster } from './texturas.js';

const PI = Math.PI;

// Sillón individual
export function Sillon({ p, r, c = COL.noche }) {
  return html`<${G} p=${p} r=${r}>
    <${B} p=${[0, 0.22, 0]} s=${[0.85, 0.44, 0.8]} c=${c} />
    <${B} p=${[0, 0.6, -0.32]} s=${[0.85, 0.5, 0.18]} c=${c} />
    <${B} p=${[-0.37, 0.45, 0]} s=${[0.14, 0.3, 0.8]} c=${c} />
    <${B} p=${[0.37, 0.45, 0]} s=${[0.14, 0.3, 0.8]} c=${c} />
    <${B} p=${[0, 0.47, -0.1]} s=${[0.56, 0.08, 0.5]} c=${COL.beige} />
  <//>`;
}

// Sofá con sus plazas (n plazas, mirando hacia +z del sofá)
export function SofaPlazas({ p, ry = 0, w = 2, c, cojin, sala, t = 'sofa', accion = 'charlar', i0 = 0 }) {
  const n = Math.max(1, Math.round(w / 0.85));
  const plazas = [];
  for (let k = 0; k < n; k++) {
    const lx = -w / 2 + (k + 0.5) * (w / n);
    const x = p[0] + lx * Math.cos(ry), z = p[2] - lx * Math.sin(ry);
    plazas.push(html`<${Punto} key=${k} t=${t} sala=${sala} i=${i0 + k} p=${[x, 0, z]} ry=${ry} asiento=${0.46} ap=${[0, 0.75]} accion=${accion} />`);
  }
  return html`<${G}><${Sofa} p=${p} r=${[0, ry, 0]} w=${w} c=${c} cojin=${cojin} />${plazas}<//>`;
}

// Silla con su plaza (la persona llega por detrás de la silla)
function SillaPlaza({ p, ry = 0, c, sala, t, i, accion, ap = [0, -0.65] }) {
  return html`<${G}>
    <${Silla} p=${p} r=${[0, ry, 0]} c=${c} />
    <${Punto} t=${t} sala=${sala} i=${i} p=${p} ry=${ry} asiento=${0.45} ap=${ap} accion=${accion} />
  <//>`;
}

// =================== PLANTA BAJA ===================
export function Biblioteca({ s }) {
  const w = s.w, d = s.d, h = s.h;
  const items = [];
  // Estanterías (lado oeste) en tres filas paralelas
  [-3.3, -1.3, 0.7].forEach((z, f) => [-11.9, -10.0, -8.1].forEach((x, k) => items.push(
    html`<${Estanteria} key=${'e' + f + k} p=${[x, 0, z]} w=${1.85} h=${2.3} niveles=${5} tex=${texLomos(30 + f * 3 + k, 5)} led=${COL.maderaC} c=${COL.maderaC} />`)));
  // Sitios para mirar los libros (entre las estanterías)
  [[-10.95, -2.3], [-9.05, -0.3], [-10.0, 1.7]].forEach(([x, z], k) => items.push(html`<${Punto} key=${'mi' + k} t="estante" sala=${s.id} i=${k} p=${[x, 0, z]} ry=${PI} accion="mirar_estante" />`));
  // Estanterías en las paredes laterales
  [-3.0, -1.0, 1.0].forEach((z, k) => items.push(html`<${Estanteria} key=${'p' + k} p=${[-w / 2 + 0.27, 0, z]} r=${[0, PI / 2, 0]} w=${1.85} h=${2.6} niveles=${6} tex=${texLomos(50 + k, 6)} led=${COL.maderaC} c=${COL.maderaC} />`));
  // Mesas de estudio con ordenadores (biblioteca digital)
  let k = 0;
  for (const x of [-3.2, 2.6]) for (const z of [-2.5, 0.7]) {
    items.push(html`<${Mesa} key=${'m' + x + z} p=${[x, 0, z]} w=${3.2} d=${1.2} c=${COL.maderaC} />`);
    items.push(html`<${Lampara} key=${'l' + x + z} p=${[x, 0.76, z]} />`);
    for (const dx of [-1.0, 0, 1.0]) for (const lado of [-1, 1]) {
      const i = k++;
      const sz = z + lado * 0.92;
      items.push(html`<${SillaPlaza} key=${'s' + i} p=${[x + dx, 0, sz]} ry=${lado < 0 ? 0 : PI} c=${i % 2 ? COL.noche : COL.elec} sala=${s.id} t="biblio" i=${i} accion=${dx !== 0 ? 'ordenador' : 'leer'} />`);
      if (dx !== 0) items.push(html`<${Monitor} key=${'o' + i} p=${[x + dx, 0.76, z + lado * 0.36]} r=${[0, lado < 0 ? 0 : PI, 0]} ancho=${0.42} pantalla=${['#7fa7dc', '#9bb8e0', '#5b8fd6'][i % 3]} />`);
      else items.push(html`<${Libro} key=${'b' + i} p=${[x + dx, 0.76, z + lado * 0.3]} r=${[0, lado < 0 ? 0 : PI, 0]} abierto c=${COLORES_VIVOS[i % 10]} />`);
    }
  }
  const sillones = [[8.6, -3.4, 0], [10.4, -3.4, 0], [12.2, -3.4, 0], [8.6, 0.3, PI], [11.2, 0.3, PI]];
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#e9dfcf" borde=${COL.maderaC} />
    <${Frente} w=${w} d=${d} h=${h} puerta=${[11.6, -2.0]} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${COL.cian} />
    ${items}
    <${B} p=${[10.2, 0.02, -1.6]} s=${[6.2, 0.02, 4.8]} c="#2b3f72" />
    ${sillones.map(([x, z, r], i) => html`<${G} key=${'si' + i}>
      <${Sillon} p=${[x, 0, z]} r=${[0, r, 0]} c=${i % 2 ? COL.elec : COL.noche} />
      <${Punto} t="sillon" sala=${s.id} i=${i} p=${[x, 0, z]} ry=${r} asiento=${0.46} ap=${[0, 0.8]} accion="leer" />
    <//>`)}
    <${MesaRedonda} p=${[10.4, 0, -1.6]} d=${1.0} alto=${0.42} />
    <${G} p=${[9.6, 0, 3.0]}>
      <${B} m="B" p=${[0, 0.5, 0]} s=${[2.6, 1.0, 0.7]} c=${COL.blanco} />
      <${B} m="B" p=${[0, 1.02, 0]} s=${[2.7, 0.05, 0.8]} c=${COL.maderaC} />
      <${Monitor} p=${[0.5, 1.04, 0.05]} r=${[0, PI, 0]} pantalla="#7fa7dc" />
    <//>
    <${Punto} t="trabajo" sala=${s.id} rol="biblioteca" p=${[9.6, 0, 3.8]} ry=${PI} accion="atender" />
    <${Pantalla} p=${[w / 2 - 0.12, 2.0, -1.4]} r=${[0, -PI / 2, 0]} w=${2.6} h=${1.46} tex=${texPantalla('biblioteca')} />
    <${Panel} p=${[2.0, 3.1, d / 2 - 0.06]} r=${[0, PI, 0]} w=${2.6} h=${0.8} tex=${texCartel('Biblioteca digital', COL.maderaC)} />
    ${[-5.6, 5.6].map((x, i) => html`<${Planta} key=${'pl' + i} p=${[x, 0, -4.0]} s=${1.15} tipo=${i % 3} />`)}
  <//>`;
}

export function Recepcion({ s }) {
  const w = s.w, d = s.d, h = s.h;
  // Escalera hacia el primer piso: x de 2 a 4, sube de z -3.5 (y=0) a z 3.5 (y=4.2)
  const escalones = [];
  for (let i = 0; i < 14; i++) {
    const y = (i + 1) * 0.3, z = -3.5 + 0.25 + i * 0.5;
    escalones.push(html`<${B} key=${'e' + i} m="B" p=${[3.0, y - 0.06, z]} s=${[1.85, 0.12, 0.52]} c=${COL.maderaC} />`);
  }
  const ang = Math.atan2(4.2, 7);
  const mostrador = [];
  for (let i = 0; i < 5; i++) {
    const a = -0.7 + i * 0.35;
    mostrador.push(html`<${G} key=${i} p=${[-1.2, 0, 0.6]} r=${[0, a, 0]}>
      <${B} m="B" p=${[0, 0.55, -1.6]} s=${[0.62, 1.1, 0.45]} c=${COL.blanco} />
      <${B} m="B" p=${[0, 1.12, -1.62]} s=${[0.64, 0.04, 0.55]} c=${COL.noche} />
    <//>`);
  }
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#ece6da" />
    <${C} p=${[-1.2, 0.035, -1.8]} s=${[2.6, 0.004, 2.6]} c=${COL.noche} />
    <${Toro} p=${[-1.2, 0.04, -1.8]} r=${[PI / 2, 0, 0]} s=${[2.6, 2.6, 0.3]} c=${COL.maderaC} />
    <${B} p=${[-2.3, h / 2, d / 2 - 0.08]} s=${[3.2, h, 0.16]} c=${COL.blanco} />
    <${B} p=${[1.3, h / 2, d / 2 - 0.08]} s=${[0.8, h, 0.16]} c=${COL.blanco} />
    <${Panel} p=${[-2.3, 2.75, d / 2 - 0.17]} r=${[0, PI, 0]} w=${1.3} h=${1.3} transp tex=${texLogo()} />
    <${Panel} p=${[-2.3, 1.75, d / 2 - 0.17]} r=${[0, PI, 0]} w=${3.0} h=${0.55} transp tex=${texRotuloTexto('COLEGIO PABLO PICASSO', COL.noche)} />
    ${mostrador}
    <${Monitor} p=${[-1.2, 1.14, -0.9]} r=${[0, PI, 0]} pantalla="#7fa7dc" />
    <${Punto} t="trabajo" sala=${s.id} rol="recepcion" p=${[-1.2, 0, -0.25]} ry=${PI} accion="atender" />
    ${escalones}
    <${B} m="M" p=${[2.06, 2.0, 0]} r=${[-ang, 0, 0]} s=${[0.1, 0.22, 8.25]} c=${COL.grisO} />
    <${V} p=${[2.06, 2.65, 0]} r=${[-ang, 0, 0]} s=${[0.03, 1.0, 8.2]} />
    <${B} m="M" p=${[2.06, 3.18, 0]} r=${[-ang, 0, 0]} s=${[0.05, 0.05, 8.2]} c=${COL.maderaC} />
    <${Pantalla} p=${[-w / 2 + 0.12, 2.0, -1.6]} r=${[0, PI / 2, 0]} w=${2.4} h=${1.35} tex=${texPantalla('bienvenida')} />
    <${SofaPlazas} p=${[-2.95, 0, -3.65]} w=${1.9} c=${COL.noche} cojin=${COL.beige} sala=${s.id} accion="esperar" />
    <${Planta} p=${[-3.55, 0, -2.6]} s=${1.0} tipo=${1} />
  <//>`;
}

export function Comedor({ s }) {
  const w = s.w, d = s.d, h = s.h;
  const mesas = [];
  let k = 0;
  // 8 mesas largas de 8 plazas = 64 plazas: todos los alumnos comen juntos a las 12:20
  for (const x of [-10.5, -5.5, -0.5, 4.5]) for (const z of [-2.3, 1.5]) {
    mesas.push(html`<${Mesa} key=${'m' + x + z} p=${[x, 0, z]} w=${3.4} d=${0.9} c=${COL.maderaC} />`);
    for (const dx of [-1.275, -0.425, 0.425, 1.275]) for (const lado of [-1, 1]) {
      const i = k++;
      mesas.push(html`<${SillaPlaza} key=${'s' + i} p=${[x + dx, 0, z + lado * 0.75]} ry=${lado < 0 ? 0 : PI} c=${i % 2 ? COL.noche : COL.elec} sala=${s.id} t="comedor" i=${i} accion="comer" />`);
    }
  }
  // Mesa de los profesores (6 plazas)
  mesas.push(html`<${Mesa} key="mp" p=${[8.8, 0, -2.3]} w=${2.6} d=${0.9} c=${COL.blanco} />`);
  let j = 0;
  for (const dx of [-0.85, 0, 0.85]) for (const lado of [-1, 1]) {
    mesas.push(html`<${SillaPlaza} key=${'sp' + j} p=${[8.8 + dx, 0, -2.3 + lado * 0.75]} ry=${lado < 0 ? 0 : PI} c=${COL.grisO} sala=${s.id} t="comedorprof" i=${j} accion="comer" />`);
    j++;
  }
  const xb = w / 2 - 1.6;
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#e7dac6" borde=${COL.maderaC} />
    <${Frente} w=${w} d=${d} h=${h} puerta=${[-11.8, 6.5]} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${COL.cian} />
    ${mesas}
    <${G}>
      <${B} m="B" p=${[xb, 0.48, -0.8]} s=${[0.8, 0.96, 6.4]} c=${COL.blanco} />
      <${B} m="M" p=${[xb, 0.97, -0.8]} s=${[0.84, 0.03, 6.44]} c=${COL.grisM} />
      <${V} p=${[xb - 0.15, 1.35, -0.8]} r=${[0, 0, 0.25]} s=${[0.02, 0.5, 6.2]} />
      ${[...Array(8)].map((_, i) => html`<${B} key=${i} p=${[xb, 1.02, -3.6 + i * 0.78]} s=${[0.5, 0.06, 0.6]} c=${['#e9a23b', '#7cc66a', '#c9553f', '#f2d06b', '#c9a978', '#e9a23b', '#7cc66a', '#c46a2e'][i]} />`)}
      <${Pantalla} p=${[w / 2 - 0.12, 2.35, -0.8]} r=${[0, -PI / 2, 0]} w=${2.6} h=${1.46} tex=${texPantalla('menu')} />
      <${Punto} t="trabajo" sala=${s.id} rol="cocina" i=${0} p=${[xb + 0.85, 0, -2.0]} ry=${-PI / 2} accion="servir" />
      <${Punto} t="trabajo" sala=${s.id} rol="cocina" i=${1} p=${[xb + 0.85, 0, 0.4]} ry=${-PI / 2} accion="servir" />
      ${[-8.0, -3.0, 2.0].map((x, i) => html`<${Punto} key=${'mo' + i} t="trabajo" sala=${s.id} rol="monitor" i=${i} p=${[x, 0, -0.4]} ry=${i % 2 ? PI / 2 : -PI / 2} accion="vigilar" />`)}
      ${[-3.0, -1.6, -0.2, 1.2].map((z, i) => html`<${Punto} key=${'c' + i} t="cola" sala=${s.id} i=${i} p=${[xb - 0.95, 0, z]} ry=${PI / 2} accion="servirse" />`)}
    <//>
    ${[-13.2, -8.0, -3.0, 2.0].map((x, i) => html`<${Planta} key=${'pl' + i} p=${[x, 0, -4.05]} s=${1.1} tipo=${i % 3} />`)}
  <//>`;
}

// =================== PRIMER PISO ===================
export function ZonaDescanso({ s }) {
  const w = s.w, d = s.d, h = s.h;
  return html`<${G}>
    <${B} p=${[-1.0, 0.015, 0]} s=${[5.9, 0.03, d - 0.12]} c="#e6dccb" />
    <${Frente} w=${w} d=${d} h=${h} puerta=${3.0} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${COL.cian} />
    <${V} p=${[1.98, 0.55, 0]} s=${[0.03, 1.0, 7.0]} />
    <${B} m="M" p=${[1.98, 1.07, 0]} s=${[0.06, 0.05, 7.0]} c=${COL.maderaC} />
    <${V} p=${[3.0, 0.55, -3.5]} s=${[2.0, 1.0, 0.03]} />
    <${SofaPlazas} p=${[-1.2, 0, 2.6]} ry=${PI} w=${2.4} c=${COL.noche} cojin=${COL.beige} sala=${s.id} />
    <${SofaPlazas} p=${[-1.2, 0, -3.6]} w=${2.4} c=${COL.elec} cojin=${COL.beige} sala=${s.id} i0=${3} />
    <${MesaRedonda} p=${[-1.2, 0, -0.5]} d=${0.9} alto=${0.42} />
    <${Puf} p=${[0.9, 0, -1.4]} c=${COL.beige} /><${Puf} p=${[0.8, 0, 0.6]} c=${COL.elec} />
    <${Estanteria} p=${[-w / 2 + 0.27, 0, 0.2]} r=${[0, PI / 2, 0]} w=${1.8} h=${1.8} niveles=${4} tex=${texLomos(77, 4)} c=${COL.maderaC} led=${COL.maderaC} />
    <${Planta} p=${[1.3, 0, -4.0]} s=${1.3} tipo=${1} /><${Planta} p=${[-3.5, 0, -4.0]} s=${1.1} tipo=${2} /><${Planta} p=${[-3.4, 0, 3.6]} s=${1.0} tipo=${0} />
  <//>`;
}

// Salón común (sofás, televisión, mesas y libros)
export function Salon({ s }) {
  const w = s.w, d = s.d, h = s.h;
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#e7dccb" borde=${COL.maderaC} />
    <${Frente} w=${w} d=${d} h=${h} puerta=${[-6.6, 6.0]} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${COL.cian} />
    <${B} p=${[-3.6, 0.02, -2.0]} s=${[5.4, 0.02, 3.6]} c="#2b3f72" />
    <${SofaPlazas} p=${[-3.6, 0, -0.4]} ry=${PI} w=${3.4} c=${COL.noche} cojin=${COL.beige} sala=${s.id} accion="tele" />
    <${SofaPlazas} p=${[-6.2, 0, -2.2]} ry=${PI / 2} w=${2.4} c=${COL.noche} cojin=${COL.beige} sala=${s.id} accion="tele" i0=${4} />
    <${B} m="B" p=${[-3.6, 0.22, -2.0]} s=${[1.6, 0.44, 0.8]} c=${COL.maderaC} />
    <${Pantalla} p=${[-3.6, 1.75, -d / 2 + 0.25]} w=${2.8} h=${1.58} tex=${texPantalla('pelicula')} />
    <${B} m="B" p=${[-3.6, 0.3, -d / 2 + 0.35]} s=${[3.4, 0.6, 0.45]} c=${COL.madera} />
    <${B} p=${[3.4, 0.02, -1.4]} s=${[4.6, 0.02, 4.2]} c="#c9a978" />
    <${SofaPlazas} p=${[3.4, 0, -3.5]} w=${2.6} c=${COL.elec} cojin=${COL.beige} sala=${s.id} i0=${8} />
    <${Sillon} p=${[1.6, 0, -1.2]} r=${[0, PI / 2, 0]} c=${COL.noche} />
    <${Punto} t="sillon" sala=${s.id} i=${0} p=${[1.6, 0, -1.2]} ry=${PI / 2} asiento=${0.46} ap=${[0, 0.8]} accion="charlar" />
    <${Sillon} p=${[5.2, 0, -1.2]} r=${[0, -PI / 2, 0]} c=${COL.noche} />
    <${Punto} t="sillon" sala=${s.id} i=${1} p=${[5.2, 0, -1.2]} ry=${-PI / 2} asiento=${0.46} ap=${[0, 0.8]} accion="charlar" />
    <${MesaRedonda} p=${[3.4, 0, -1.6]} d=${1.0} alto=${0.42} />
    <${Mesa} p=${[4.6, 0, 2.3]} w=${2.4} d=${1.0} c=${COL.maderaC} />
    ${[-0.7, 0.7].map((dx, i) => html`<${SillaPlaza} key=${'s' + i} p=${[4.6 + dx, 0, 3.05]} ry=${PI} c=${COL.noche} sala=${s.id} t="mesa" i=${i} accion="escribir" />`)}
    <${Libro} p=${[3.9, 0.76, 2.6]} r=${[0, PI, 0]} abierto c=${COL.elec} />
    <${Estanteria} p=${[w / 2 - 0.27, 0, 0.0]} r=${[0, -PI / 2, 0]} w=${1.85} h=${2.2} niveles=${5} tex=${texLomos(88, 5)} c=${COL.maderaC} led=${COL.maderaC} />
    <${Estanteria} p=${[w / 2 - 0.27, 0, -2.0]} r=${[0, -PI / 2, 0]} w=${1.85} h=${2.2} niveles=${5} tex=${texLomos(89, 5)} c=${COL.maderaC} led=${COL.maderaC} />
    ${[-7.2, -0.6, 7.2].map((x, i) => html`<${Planta} key=${'pl' + i} p=${[x, 0, -4.05]} s=${1.15} tipo=${i % 3} />`)}
  <//>`;
}

// VIDA ESCOLAR: acogida, despacho de los educadores y mesas para hablar
export function VidaEscolar({ s }) {
  const w = s.w, d = s.d, h = s.h;
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#e3ece9" borde=${s.color} />
    <${Frente} w=${w} d=${d} h=${h} puerta=${[-5.5, 4.5]} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${COL.cian} />
    <${Panel} p=${[0, 3.0, d / 2 - 0.06]} r=${[0, PI, 0]} w=${2.6} h=${0.8} tex=${texCartel('Vida escolar', '#7fd0dc')} />
    <${B} m="B" p=${[3.0, 0.55, 2.2]} s=${[3.0, 1.1, 0.6]} c=${COL.blanco} />
    <${B} m="B" p=${[3.0, 1.12, 2.25]} s=${[3.1, 0.05, 0.75]} c=${s.color} />
    <${Monitor} p=${[2.5, 1.14, 2.0]} pantalla="#7fd0dc" />
    <${Punto} t="trabajo" sala=${s.id} rol="vidaescolar" i=${0} p=${[3.0, 0, 1.4]} accion="atender" />
    ${[2.3, 3.7].map((x, i) => html`<${Punto} key=${'ay' + i} t="ayuda" sala=${s.id} i=${i} p=${[x, 0, 3.15]} ry=${PI} accion="pedir_ayuda" />`)}
    <${Mesa} p=${[-5.0, 0, -2.6]} w=${1.8} d=${0.8} c=${COL.maderaC} />
    <${Monitor} p=${[-5.0, 0.76, -2.85]} pantalla="#9bb8e0" />
    <${Silla} p=${[-5.0, 0, -3.35]} c=${COL.noche} />
    <${Punto} t="trabajo" sala=${s.id} rol="vidaescolar" i=${1} p=${[-5.0, 0, -3.35]} asiento=${0.45} ap=${[0.9, 0]} accion="ordenador" />
    ${[-5.5, -4.5].map((x, i) => html`<${SillaPlaza} key=${'v' + i} p=${[x, 0, -1.7]} ry=${PI} c=${s.color} sala=${s.id} t="ayuda_sentado" i=${i} accion="charlar" />`)}
    <${MesaRedonda} p=${[-0.6, 0, 0.4]} d=${1.2} c=${COL.blanco} />
    ${[0, 1, 2].map(k => { const a = k * 2.1 + 0.3; return html`<${SillaPlaza} key=${'r' + k} p=${[-0.6 + Math.sin(a) * 0.95, 0, 0.4 + Math.cos(a) * 0.95]} ry=${a + PI} c=${COL.noche} sala=${s.id} t="ayuda_sentado" i=${2 + k} accion="charlar" />`; })}
    <${B} p=${[-w / 2 + 0.12, 1.8, 1.2]} s=${[0.06, 1.2, 2.4]} c="#c9a978" />
    ${[0, 1, 2, 3, 4].map(i => html`<${B} key=${'n' + i} p=${[-w / 2 + 0.16, 1.6 + (i % 2) * 0.4, 0.3 + i * 0.42]} s=${[0.02, 0.3, 0.28]} c=${['#ffffff', '#f2d06b', '#9bd0f0', '#f6c1c1', '#ffffff'][i]} />`)}
    <${Pantalla} p=${[-w / 2 + 0.12, 2.0, -2.2]} r=${[0, PI / 2, 0]} w=${2.0} h=${1.12} tex=${texPantalla('horario')} />
    <${SofaPlazas} p=${[5.2, 0, -3.65]} w=${2.4} c=${s.color} cojin=${COL.beige} sala=${s.id} accion="esperar" />
    <${Planta} p=${[7.2, 0, -4.0]} s=${1.1} tipo=${1} /><${Planta} p=${[1.4, 0, -4.0]} s=${1.0} tipo=${2} />
  <//>`;
}

// PERMANENCIA: mesas individuales y la mesa del adulto que vigila
export function Permanencia({ s }) {
  const w = s.w, d = s.d, h = s.h;
  const items = [];
  let k = 0;
  for (const z of [-3.0, -1.5, 0.0, 1.45]) for (const x of [-6.0, -4.2, -2.4, -0.6, 1.2, 3.0]) {
    const i = k++;
    items.push(html`<${Pupitre} key=${'p' + i} p=${[x, 0, z]} ancho=${0.9} c=${COL.blanco} led=${COL.maderaC} />`);
    items.push(html`<${Silla} key=${'s' + i} p=${[x, 0, z - 0.56]} c=${i % 2 ? s.color : COL.noche} />`);
    items.push(html`<${Punto} key=${'q' + i} t="perma" sala=${s.id} i=${i} p=${[x, 0, z - 0.56]} asiento=${0.45} ap=${[0.9, 0]} accion="escribir" />`);
  }
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#e6e8ef" borde=${s.color} />
    <${Frente} w=${w} d=${d} h=${h} puerta=${[5.6]} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${COL.cian} />
    <${Panel} p=${[-3.5, 3.0, d / 2 - 0.06]} r=${[0, PI, 0]} w=${2.6} h=${0.8} tex=${texCartel('Permanencia', '#c9cfe0')} />
    ${items}
    <${Mesa} p=${[-1.5, 0, 2.75]} w=${1.8} d=${0.75} c=${COL.maderaC} />
    <${Silla} p=${[-1.5, 0, 3.5]} r=${[0, PI, 0]} c=${COL.noche} />
    <${Punto} t="trabajo" sala=${s.id} rol="permanencia" p=${[-1.5, 0, 3.5]} ry=${PI} asiento=${0.45} ap=${[-0.9, 0]} accion="vigilar" />
    <${Libro} p=${[-1.9, 0.78, 2.7]} c="#2a62b8" />
    <${C} m="B" p=${[-1.5, 2.9, d / 2 - 0.12]} r=${[PI / 2, 0, 0]} s=${[0.5, 0.04, 0.5]} c=${COL.blanco} />
    <${B} p=${[-1.5, 2.95, d / 2 - 0.16]} s=${[0.02, 0.18, 0.01]} c=${COL.negro} />
    <${Estanteria} p=${[w / 2 - 0.27, 0, -1.8]} r=${[0, -PI / 2, 0]} w=${2.2} h=${2.1} niveles=${5} tex=${texLomos(61, 5)} c=${COL.maderaC} led=${COL.maderaC} />
    <${Planta} p=${[w / 2 - 0.6, 0, -4.0]} s=${1.1} tipo=${0} />
  <//>`;
}

// SALA DE PROFESORES
export function SalaProfesores({ s }) {
  const w = s.w, d = s.d, h = s.h;
  const sillas = [];
  let k = 0;
  for (const x of [-3.0, -1.7, -0.4, 0.9]) for (const lado of [-1, 1]) {
    sillas.push(html`<${SillaPlaza} key=${k} p=${[x, 0, -1.0 + lado * 1.0]} ry=${lado < 0 ? 0 : PI} c=${COL.grisO} sala=${s.id} t="sala_prof" i=${k} accion="corregir" />`);
    k++;
  }
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#ece5d8" borde=${COL.maderaC} />
    <${Frente} w=${w} d=${d} h=${h} puerta=${[-5.5]} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${COL.calido} />
    <${Panel} p=${[2.5, 3.0, d / 2 - 0.06]} r=${[0, PI, 0]} w=${2.8} h=${0.8} tex=${texCartel('Sala de profesores', COL.maderaC)} />
    <${Mesa} p=${[-1.05, 0, -1.0]} w=${5.0} d=${1.4} c=${COL.madera} />
    ${sillas}
    ${[-2.4, 0.3].map((x, i) => html`<${Libro} key=${'l' + i} p=${[x, 0.78, -1.2]} c=${['#2a62b8', '#b84a55'][i]} />`)}
    <${Portatil} p=${[-1.1, 0.77, -0.8]} r=${[0, PI, 0]} />
    <${Mesa} p=${[4.6, 0, -3.75]} w=${3.0} d=${0.8} c=${COL.blanco} />
    ${[3.9, 5.3].map((x, i) => html`<${G} key=${'pc' + i}>
      <${Monitor} p=${[x, 0.76, -3.95]} pantalla="#9bb8e0" />
      <${SillaPlaza} p=${[x, 0, -3.0]} ry=${PI} c=${COL.noche} sala=${s.id} t="sala_prof" i=${8 + i} accion="ordenador" ap=${[0, -0.7]} />
    <//>`)}
    ${[0, 1, 2, 3, 4, 5].map(i => html`<${Armario} key=${'c' + i} p=${[w / 2 - 0.35, 0, 3.2 - i * 0.62]} r=${[0, -PI / 2, 0]} w=${0.6} h=${1.9} prof=${0.5} c=${i % 2 ? COL.blanco : COL.beige} led=${COL.maderaC} />`)}
    <${SofaPlazas} p=${[4.0, 0, 1.4]} ry=${PI} w=${2.2} c=${COL.noche} cojin=${COL.beige} sala=${s.id} t="sofa" accion="charlar" />
    <${MesaRedonda} p=${[4.0, 0, 0.3]} d=${0.8} alto=${0.42} />
    <${B} m="B" p=${[-w / 2 + 0.4, 0.45, 3.2]} s=${[0.6, 0.9, 1.6]} c=${COL.blanco} />
    <${B} m="M" p=${[-w / 2 + 0.4, 1.05, 3.4]} s=${[0.3, 0.3, 0.25]} c=${COL.negro} />
    <${Planta} p=${[-w / 2 + 0.6, 0, -4.0]} s=${1.1} tipo=${2} /><${Planta} p=${[1.8, 0, -4.0]} s=${1.0} tipo=${0} />
  <//>`;
}

// SALA DE ESTUDIO (la tarde: todo el trabajo se hace en el colegio)
export function SalaEstudio({ s }) {
  const w = s.w, d = s.d, h = s.h;
  const items = [];
  let k = 0;
  for (const x of [-4.0, 2.5]) for (const z of [-2.4, 1.0]) {
    items.push(html`<${Mesa} key=${'m' + x + z} p=${[x, 0, z]} w=${3.2} d=${1.0} c=${COL.maderaC} />`);
    items.push(html`<${Lampara} key=${'l' + x + z} p=${[x, 0.76, z]} />`);
    for (const dx of [-1.05, 0, 1.05]) for (const lado of [-1, 1]) {
      const i = k++;
      items.push(html`<${SillaPlaza} key=${'s' + i} p=${[x + dx, 0, z + lado * 0.8]} ry=${lado < 0 ? 0 : PI} c=${i % 2 ? s.color : COL.noche} sala=${s.id} t="estudio" i=${i} accion=${i % 3 === 0 ? 'ordenador' : 'escribir'} />`);
      if (i % 3 === 0) items.push(html`<${Portatil} key=${'o' + i} p=${[x + dx, 0.76, z + lado * 0.25]} r=${[0, lado < 0 ? PI : 0, 0]} />`);
      else items.push(html`<${Libro} key=${'b' + i} p=${[x + dx, 0.76, z + lado * 0.25]} abierto c=${COLORES_VIVOS[i % 10]} />`);
    }
  }
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#e4ebf0" borde=${s.color} />
    <${Frente} w=${w} d=${d} h=${h} puerta=${[-1.0, 6.4]} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${COL.cian} />
    <${Panel} p=${[2.8, 3.0, d / 2 - 0.06]} r=${[0, PI, 0]} w=${2.6} h=${0.8} tex=${texCartel('Sala de estudio', '#9bc4dc')} />
    ${items}
    <${Punto} t="trabajo" sala=${s.id} rol="estudio" i=${0} p=${[6.0, 0, -0.7]} ry=${-PI / 2} accion="vigilar" />
    <${Punto} t="trabajo" sala=${s.id} rol="estudio" i=${1} p=${[-0.75, 0, -0.7]} ry=${PI / 2} accion="vigilar" />
    ${[-2.0, 0.2].map((z, i) => html`<${Estanteria} key=${'e' + i} p=${[-w / 2 + 0.27, 0, z]} r=${[0, PI / 2, 0]} w=${2.0} h=${2.2} niveles=${5} tex=${texLomos(70 + i, 5)} c=${COL.maderaC} led=${COL.maderaC} />`)}
    <${Planta} p=${[w / 2 - 0.6, 0, -4.0]} s=${1.1} tipo=${1} /><${Planta} p=${[-0.8, 0, -4.0]} s=${1.0} tipo=${2} />
  <//>`;
}

// SALÓN DE LECTURA (rincones con sillones, alfombras y estanterías)
export function SalonLectura({ s }) {
  const w = s.w, d = s.d, h = s.h;
  const rincones = [];
  let k = 0;
  for (const x of [-10, -3.5, 3.0, 9.5]) {
    const c = rincones.length;
    rincones.push(html`<${G} key=${'r' + x}>
      <${C} p=${[x, 0.02, -1.6]} s=${[3.6, 0.02, 3.6]} c=${c % 2 ? '#c9a978' : '#2b3f72'} />
      <${MesaRedonda} p=${[x, 0, -1.6]} d=${0.8} alto=${0.42} />
      <${Lampara} p=${[x, 0.44, -1.6]} />
    <//>`);
    for (const [dx, dz, r] of [[-1.15, -2.5, 0.55], [1.15, -2.5, -0.55], [0, -0.4, PI]]) {
      const i = k++;
      rincones.push(html`<${G} key=${'s' + i}>
        <${Sillon} p=${[x + dx, 0, dz]} r=${[0, r, 0]} c=${i % 2 ? COL.elec : s.color} />
        <${Punto} t="sillon" sala=${s.id} i=${i} p=${[x + dx, 0, dz]} ry=${r} asiento=${0.46} ap=${[0, 0.8]} accion=${i % 3 === 2 ? 'charlar' : 'leer'} />
      <//>`);
    }
  }
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#ebe2d0" borde=${COL.maderaC} />
    <${Frente} w=${w} d=${d} h=${h} puerta=${[-10.5, 7.0]} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${COL.calido} />
    <${Panel} p=${[0, 3.0, d / 2 - 0.06]} r=${[0, PI, 0]} w=${2.6} h=${0.8} tex=${texCartel('Salón de lectura', COL.maderaC)} />
    ${rincones}
    ${[-1.6, 0.4, 2.4].map((z, i) => html`<${Estanteria} key=${'a' + i} p=${[-w / 2 + 0.27, 0, z - 1]} r=${[0, PI / 2, 0]} w=${1.9} h=${2.4} niveles=${6} tex=${texLomos(91 + i, 6)} c=${COL.maderaC} led=${COL.maderaC} />`)}
    ${[-1.6, 0.4].map((z, i) => html`<${Estanteria} key=${'b' + i} p=${[w / 2 - 0.27, 0, z - 1]} r=${[0, -PI / 2, 0]} w=${1.9} h=${2.4} niveles=${6} tex=${texLomos(95 + i, 6)} c=${COL.maderaC} led=${COL.maderaC} />`)}
    ${[-6.8, 6.3].map((x, i) => html`<${Planta} key=${'pl' + i} p=${[x, 0, -4.0]} s=${1.2} tipo=${i % 3} />`)}
  <//>`;
}

// SALA DE JUEGOS: ping-pong y futbolín
export function SalaJuegos({ s }) {
  const w = s.w, d = s.d, h = s.h;
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#ece2e2" borde=${s.color} />
    <${Frente} w=${w} d=${d} h=${h} puerta=${[3.6]} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${COL.cian} />
    <${Panel} p=${[-1.5, 3.0, d / 2 - 0.06]} r=${[0, PI, 0]} w=${2.6} h=${0.8} tex=${texCartel('Sala de juegos', '#f0a3ab')} />
    <${G} p=${[-1.6, 0, -1.4]}>
      <${B} m="B" p=${[0, 0.74, 0]} s=${[2.74, 0.04, 1.52]} c="#1f5f8a" />
      <${B} m="L" p=${[0, 0.762, 0]} s=${[2.74, 0.004, 0.02]} c="#ffffff" />
      <${B} p=${[0, 0.83, 0]} s=${[0.02, 0.15, 1.6]} c="#f2f2f2" />
      ${[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => html`<${B} key=${i} m="M" p=${[a * 1.1, 0.36, b * 0.6]} s=${[0.06, 0.72, 0.06]} c=${COL.grisO} />`)}
    <//>
    <${Punto} t="ping" sala=${s.id} i=${0} p=${[-3.65, 0, -1.4]} ry=${PI / 2} accion="pingpong" />
    <${Punto} t="ping" sala=${s.id} i=${1} p=${[0.45, 0, -1.4]} ry=${-PI / 2} accion="pingpong" />
    <${G} p=${[3.4, 0, -2.6]}>
      <${B} m="B" p=${[0, 0.78, 0]} s=${[1.3, 0.25, 0.75]} c=${COL.madera} />
      <${B} p=${[0, 0.9, 0]} s=${[1.2, 0.01, 0.65]} c="#3f8a4a" />
      ${[0, 1, 2, 3].map(i => html`<${C} key=${i} m="M" p=${[-0.45 + i * 0.3, 0.86, 0]} r=${[PI / 2, 0, 0]} s=${[0.03, 1.2, 0.03]} c=${COL.grisM} />`)}
      ${[[-0.6, -0.3], [0.6, -0.3], [-0.6, 0.3], [0.6, 0.3]].map(([a, b], i) => html`<${B} key=${'p' + i} m="M" p=${[a, 0.33, b]} s=${[0.08, 0.66, 0.08]} c=${COL.grisO} />`)}
    <//>
    <${Punto} t="futbolin" sala=${s.id} i=${0} p=${[3.4, 0, -3.35]} accion="futbolin" />
    <${Punto} t="futbolin" sala=${s.id} i=${1} p=${[3.4, 0, -1.85]} ry=${PI} accion="futbolin" />
    <${SofaPlazas} p=${[-2.2, 0, 2.7]} ry=${PI} w=${2.4} c=${s.color} cojin=${COL.beige} sala=${s.id} accion="charlar" />
    <${Puf} p=${[1.6, 0, 1.6]} c=${COL.beige} /><${Puf} p=${[2.6, 0, 1.9]} c=${COL.elec} />
    <${Panel} p=${[-w / 2 + 0.11, 1.9, -1.0]} r=${[0, PI / 2, 0]} w=${0.9} h=${1.27} tex=${texPoster('futbol')} luz=${false} />
    <${Planta} p=${[w / 2 - 0.6, 0, -4.0]} s=${1.1} tipo=${2} />
  <//>`;
}
