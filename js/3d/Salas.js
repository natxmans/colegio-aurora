// =========================================================
// ESPACIOS DEL EDIFICIO (además de las aulas):
// planta baja: biblioteca digital, entrada, comedor
// primer piso: dormitorios (2 camas, 2 escritorios, 2 armarios) y salones
// Coordenadas canónicas: pasillo hacia +z, fachada exterior hacia -z
// =========================================================
import { html } from '../lib.js';
import { B, C, S, Ico, Toro, V, G, Panel, COL, COLORES_VIVOS, Silla, Portatil, Monitor, Libro, Planta, Estanteria, Frente, TirasLed, Suelo, Mesa, MesaRedonda, Sofa, Puf, Lampara, Pantalla, Cama, Armario } from './piezas.js';
import { Alumno, ROPA_RECEPCION } from './Alumno.js';
import { texPantalla, texPoster, texLomos, texCartel, texLogo, texRotuloTexto } from './texturas.js';

const PI = Math.PI;

// Sillón individual
function Sillon({ p, r, c = COL.noche }) {
  return html`<${G} p=${p} r=${r}>
    <${B} p=${[0, 0.22, 0]} s=${[0.85, 0.44, 0.8]} c=${c} />
    <${B} p=${[0, 0.6, -0.32]} s=${[0.85, 0.5, 0.18]} c=${c} />
    <${B} p=${[-0.37, 0.45, 0]} s=${[0.14, 0.3, 0.8]} c=${c} />
    <${B} p=${[0.37, 0.45, 0]} s=${[0.14, 0.3, 0.8]} c=${c} />
    <${B} p=${[0, 0.47, -0.1]} s=${[0.56, 0.08, 0.5]} c=${COL.beige} />
  <//>`;
}

// =================== PLANTA BAJA ===================
export function Biblioteca({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h, col = s.color;
  const items = [];
  // Estanterías (lado oeste) en tres filas paralelas
  [-3.3, -1.3, 0.7].forEach((z, f) => [-11.9, -10.0, -8.1].forEach((x, k) => items.push(
    html`<${Estanteria} key=${'e' + f + k} p=${[x, 0, z]} w=${1.85} h=${2.3} niveles=${5} tex=${texLomos(30 + f * 3 + k, 5)} led=${COL.maderaC} c=${COL.maderaC} />`)));
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
      items.push(html`<${Silla} key=${'s' + i} p=${[x + dx, 0, sz]} r=${[0, lado < 0 ? 0 : PI, 0]} c=${i % 2 ? COL.noche : COL.elec} />`);
      if (dx !== 0) items.push(html`<${Monitor} key=${'o' + i} p=${[x + dx, 0.76, z + lado * 0.36]} r=${[0, lado < 0 ? 0 : PI, 0]} ancho=${0.42} pantalla=${['#7fa7dc', '#9bb8e0', '#5b8fd6'][i % 3]} />`);
      else items.push(html`<${Libro} key=${'b' + i} p=${[x + dx, 0.76, z + lado * 0.3]} r=${[0, lado < 0 ? 0 : PI, 0]} abierto c=${COLORES_VIVOS[i % 10]} />`);
      if ((i * 5) % 7 < 4) items.push(html`<${Alumno} key=${'a' + i} p=${[x + dx, 0, sz]} ry=${lado < 0 ? 0 : PI} pose=${dx === 0 ? 'escribiendo' : 'tecleando'} seed=${400 + i} />`);
    }
  }
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#e9dfcf" borde=${COL.maderaC} />
    <${Frente} w=${w} d=${d} h=${h} puerta=${11.6} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${COL.cian} />
    ${items}
    <${Alumno} p=${[-10.0, 0, -0.3]} ry=${PI} pose="de_pie" seed=${450} />
    <${Alumno} p=${[-8.4, 0, 1.7]} ry=${0} pose="leyendo" objeto="libro" asiento=${0} seed=${451} />
    <${B} p=${[10.2, 0.02, -1.6]} s=${[6.2, 0.02, 4.8]} c="#2b3f72" />
    <${Sillon} p=${[8.6, 0, -3.4]} c=${COL.noche} /><${Sillon} p=${[10.4, 0, -3.4]} c=${COL.elec} /><${Sillon} p=${[12.2, 0, -3.4]} c=${COL.noche} />
    <${Sillon} p=${[8.6, 0, 0.3]} r=${[0, PI, 0]} c=${COL.elec} /><${Sillon} p=${[11.2, 0, 0.3]} r=${[0, PI, 0]} c=${COL.noche} />
    <${MesaRedonda} p=${[10.4, 0, -1.6]} d=${1.0} alto=${0.42} />
    <${Alumno} p=${[8.6, 0, -3.4]} pose="leyendo" objeto="libro" asiento=${0.46} seed=${452} />
    <${Alumno} p=${[12.2, 0, -3.4]} pose="leyendo" objeto="libro" asiento=${0.46} seed=${453} />
    <${Alumno} p=${[11.2, 0, 0.3]} ry=${PI} pose="charlando" asiento=${0.46} seed=${454} />
    <${G} p=${[9.6, 0, 3.0]}>
      <${B} m="B" p=${[0, 0.5, 0]} s=${[2.6, 1.0, 0.7]} c=${COL.blanco} />
      <${B} m="B" p=${[0, 1.02, 0]} s=${[2.7, 0.05, 0.8]} c=${COL.maderaC} />
      <${Monitor} p=${[0.5, 1.04, 0.05]} r=${[0, PI, 0]} pantalla="#7fa7dc" />
    <//>
    <${Alumno} p=${[9.6, 0, 3.75]} ry=${PI} pose="hablando" adulto seed=${455} ropa=${{ sudadera: '#6b5a8e' }} />
    <${Pantalla} p=${[w / 2 - 0.12, 2.0, -1.4]} r=${[0, -PI / 2, 0]} w=${2.6} h=${1.46} tex=${texPantalla('biblioteca')} />
    <${Panel} p=${[2.0, 3.1, d / 2 - 0.06]} r=${[0, PI, 0]} w=${2.6} h=${0.8} tex=${texCartel('Biblioteca digital', COL.maderaC)} />
    ${[-5.6, 5.6].map((x, i) => html`<${Planta} key=${'pl' + i} p=${[x, 0, -4.0]} s=${1.15} tipo=${i % 3} />`)}
  <//>`;
}

export function Recepcion({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h;
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
    <${Alumno} p=${[-1.2, 0, -0.3]} ry=${PI} pose="hablando" adulto ropa=${ROPA_RECEPCION} seed=${501} />
    ${escalones}
    <${B} m="M" p=${[2.06, 2.0, 0]} r=${[-ang, 0, 0]} s=${[0.1, 0.22, 8.25]} c=${COL.grisO} />
    <${V} p=${[2.06, 2.65, 0]} r=${[-ang, 0, 0]} s=${[0.03, 1.0, 8.2]} />
    <${B} m="M" p=${[2.06, 3.18, 0]} r=${[-ang, 0, 0]} s=${[0.05, 0.05, 8.2]} c=${COL.maderaC} />
    <${Pantalla} p=${[-w / 2 + 0.12, 2.0, -1.6]} r=${[0, PI / 2, 0]} w=${2.4} h=${1.35} tex=${texPantalla('bienvenida')} />
    <${Sofa} p=${[-2.4, 0, -3.6]} w=${2.0} c=${COL.noche} cojin=${COL.beige} />
    <${MesaRedonda} p=${[-2.4, 0, -2.6]} d=${0.7} alto=${0.42} />
    <${Planta} p=${[-3.5, 0, -4.1]} s=${1.2} tipo=${1} /><${Planta} p=${[1.4, 0, -4.0]} s=${1.1} tipo=${2} />
    <${Alumno} p=${[0.2, 0, -2.0]} ry=${2.6} pose="saludando" seed=${502} />
    <${Alumno} p=${[-2.9, 0, -3.6]} ry=${0} pose="charlando" asiento=${0.44} seed=${503} />
  <//>`;
}

export function Comedor({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h;
  const mesas = [];
  let k = 0;
  const comida = ['#e9a23b', '#7cc66a', '#c9553f', '#f2d06b'];
  for (const x of [-11.2, -7.0, -2.8, 1.4, 5.6]) for (const z of [-2.6, 0.7]) {
    const xx = x + (z > 0 ? 1.2 : 0);
    mesas.push(html`<${MesaRedonda} key=${'m' + k} p=${[xx, 0, z]} d=${1.3} c=${COL.maderaC} />`);
    for (let j = 0; j < 4; j++) {
      const a = j * PI / 2 + 0.4, sx = xx + Math.sin(a) * 0.95, sz = z + Math.cos(a) * 0.95, ry = a + PI;
      const i = k * 4 + j;
      mesas.push(html`<${Silla} key=${'s' + i} p=${[sx, 0, sz]} r=${[0, ry, 0]} c=${i % 2 ? COL.noche : COL.elec} />`);
      const tx = xx + Math.sin(a) * 0.38, tz = z + Math.cos(a) * 0.38;
      if (j !== 3 || k % 3 === 0) {
        mesas.push(html`<${G} key=${'b' + i} p=${[tx, 0.76, tz]} r=${[0, ry, 0]}>
          <${B} p=${[0, 0.01, 0]} s=${[0.42, 0.02, 0.3]} c=${COL.noche} />
          <${C} m="B" p=${[0, 0.03, 0]} s=${[0.24, 0.02, 0.24]} c="#ffffff" />
          <${S} p=${[0, 0.05, 0]} s=${[0.16, 0.05, 0.16]} c=${comida[i % 4]} />
          <${C} m="B" p=${[0.15, 0.06, 0.08]} s=${[0.06, 0.1, 0.06]} c="#cfe6f5" />
        <//>`);
        mesas.push(html`<${Alumno} key=${'a' + i} p=${[sx, 0, sz]} ry=${ry} pose=${i % 3 ? 'comiendo' : 'charlando'} seed=${600 + i} />`);
      }
    }
    k++;
  }
  const xb = w / 2 - 1.0;
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#e7dac6" borde=${COL.maderaC} />
    <${Frente} w=${w} d=${d} h=${h} puerta=${-11.8} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${COL.cian} />
    ${mesas}
    <${G}>
      <${B} m="B" p=${[xb, 0.48, -0.8]} s=${[0.8, 0.96, 6.4]} c=${COL.blanco} />
      <${B} m="M" p=${[xb, 0.97, -0.8]} s=${[0.84, 0.03, 6.44]} c=${COL.grisM} />
      <${V} p=${[xb - 0.15, 1.35, -0.8]} r=${[0, 0, 0.25]} s=${[0.02, 0.5, 6.2]} />
      ${[...Array(8)].map((_, i) => html`<${B} key=${i} p=${[xb, 1.02, -3.6 + i * 0.78]} s=${[0.5, 0.06, 0.6]} c=${['#e9a23b', '#7cc66a', '#c9553f', '#f2d06b', '#c9a978', '#e9a23b', '#7cc66a', '#c46a2e'][i]} />`)}
      <${Pantalla} p=${[w / 2 - 0.12, 2.35, -0.8]} r=${[0, -PI / 2, 0]} w=${2.6} h=${1.46} tex=${texPantalla('menu')} />
      <${Alumno} p=${[xb + 0.7, 0, -1.6]} ry=${-PI / 2} pose="hablando" adulto ropa=${{ sudadera: '#f7f4ee', ribete: '#f7f4ee', cremallera: '#f7f4ee' }} seed=${650} />
      <${Alumno} p=${[xb - 0.85, 0, 0.2]} ry=${PI / 2} pose="de_pie" seed=${651} />
      <${Alumno} p=${[xb - 0.85, 0, 1.0]} ry=${PI / 2} pose="de_pie" seed=${652} />
      <${Alumno} p=${[xb - 0.85, 0, 1.8]} ry=${PI / 2} pose="hablando" seed=${653} />
    <//>
    ${[-13.2, -4.8, 3.4, 9.0].map((x, i) => html`<${Planta} key=${'pl' + i} p=${[x, 0, -4.05]} s=${1.1} tipo=${i % 3} />`)}
  <//>`;
}

// =================== PRIMER PISO · INTERNADO ===================
const MANTAS = ['#1f4e9a', '#14285a', '#2a62b8', '#c9a978', '#3b5fa8', '#14285a'];
const POSTERS = ['espacio', 'futbol', 'musica', 'naturaleza', 'espana'];

export function Habitacion({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h, col = s.color, n = s.num;
  const i = n - 101;
  const xL = -w / 2 + 0.62, xR = w / 2 - 0.62;
  const mA = MANTAS[i % 6], mB = MANTAS[(i + 3) % 6];
  const tipo = i % 4;
  const escritorio = (lado) => {
    const x = lado * (w / 2 - 0.42);
    return html`<${G} key=${'esc' + lado}>
      <${B} m="B" p=${[x, 0.75, -0.75]} s=${[0.65, 0.04, 1.45]} c=${COL.madera} />
      <${B} m="B" p=${[x, 0.37, -1.42]} s=${[0.62, 0.74, 0.04]} c=${COL.madera} />
      <${B} m="B" p=${[x, 0.37, -0.08]} s=${[0.62, 0.74, 0.04]} c=${COL.madera} />
      <${B} m="B" p=${[x + lado * 0.18, 1.55, -0.75]} s=${[0.28, 0.03, 1.3]} c=${COL.madera} />
      <${Libro} p=${[x + lado * 0.2, 1.68, -1.1]} r=${[0, 0, PI / 2]} c=${mA} /><${Libro} p=${[x + lado * 0.2, 1.68, -1.05]} r=${[0, 0, PI / 2]} c=${COL.beige} /><${Libro} p=${[x + lado * 0.2, 1.68, -1.0]} r=${[0, 0, PI / 2]} c="#ffffff" />
      <${Portatil} p=${[x - lado * 0.05, 0.77, -0.6]} r=${[0, lado * PI / 2, 0]} pantalla="#7fa7dc" />
      <${G} p=${[x + lado * 0.15, 0.77, -1.2]}>
        <${C} m="M" p=${[0, 0.01, 0]} s=${[0.14, 0.02, 0.14]} c=${COL.grisO} />
        <${B} m="M" p=${[0, 0.2, 0]} r=${[0, 0, -lado * 0.3]} s=${[0.02, 0.4, 0.02]} c=${COL.grisO} />
        <${B} m="L" p=${[-lado * 0.1, 0.4, 0]} s=${[0.16, 0.03, 0.08]} c=${COL.calido} />
      <//>
      <${Silla} p=${[lado * (w / 2 - 1.15), 0, -0.6]} r=${[0, lado * PI / 2, 0]} c=${COL.noche} />
      <${Panel} p=${[lado * (w / 2 - 0.11), 2.15, -0.75]} r=${[0, -lado * PI / 2, 0]} w=${0.7} h=${0.98} tex=${texPoster(POSTERS[(i + (lado > 0 ? 2 : 0)) % 5])} luz=${false} />
    <//>`;
  };
  let alumnos = null;
  if (tipo === 0) alumnos = html`
    <${Alumno} p=${[-(w / 2 - 1.15), 0, -0.6]} ry=${-PI / 2} pose="escribiendo" seed=${900 + i * 3} />
    <${Alumno} p=${[xR - 0.38, 0, -3.0]} ry=${-PI / 2} pose="leyendo" objeto="libro" asiento=${0.5} seed=${901 + i * 3} />`;
  else if (tipo === 1) alumnos = html`
    <${Alumno} p=${[xL, 0.58, -2.45]} pose="durmiendo" seed=${902 + i * 3} />
    <${B} p=${[xL, 0.66, -2.75]} s=${[0.98, 0.1, 1.0]} c=${mA} />`;
  else if (tipo === 2) alumnos = html`
    <${Alumno} p=${[-0.5, 0, -1.3]} ry=${0.9} pose="hablando" seed=${903 + i * 3} />
    <${Alumno} p=${[0.45, 0, -0.9]} ry=${-2.3} pose="de_pie" seed=${904 + i * 3} />`;
  else alumnos = html`
    <${Alumno} p=${[w / 2 - 1.15, 0, -0.6]} ry=${PI / 2} pose="tecleando" seed=${905 + i * 3} />`;

  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#e2d4bd" />
    <${Frente} w=${w} d=${d} h=${h} puerta=${0} macizo=${[-w / 2 + 0.1, -0.7]} />
    <${B} p=${[w / 2 - 1.3, h / 2, d / 2 - 0.08]} s=${[2.4, h, 0.16]} c=${COL.blanco} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${COL.cian} />
    <${B} p=${[0, 0.03, -2.0]} s=${[2.2, 0.02, 2.6]} c=${i % 2 ? '#1f3a6e' : '#2b4a86'} />
    <${Cama} p=${[xL, 0, -3.3]} manta=${mA} led=${COL.cian} />
    <${Cama} p=${[xR, 0, -3.3]} manta=${mB} led=${COL.cian} />
    <${G} p=${[0, 0, -4.15]}>
      <${B} m="B" p=${[0, 0.25, 0]} s=${[0.5, 0.5, 0.4]} c=${COL.madera} />
      <${Lampara} p=${[0, 0.5, 0]} c=${COL.calido} />
    <//>
    ${escritorio(-1)} ${escritorio(1)}
    <${Armario} p=${[xL - 0.2, 0, 2.3]} r=${[0, PI / 2, 0]} w=${1.7} prof=${0.6} c=${COL.madera} led=${COL.maderaC} />
    <${Armario} p=${[xR + 0.2, 0, 2.3]} r=${[0, -PI / 2, 0]} w=${1.7} prof=${0.6} c=${COL.madera} led=${COL.maderaC} />
    <${Planta} p=${[1.0, 0, -4.15]} s=${0.8} tipo=${i % 3} />
    ${alumnos}
  <//>`;
}

export function ZonaDescanso({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h;
  return html`<${G}>
    <${B} p=${[-1.0, 0.015, 0]} s=${[5.9, 0.03, d - 0.12]} c="#e6dccb" />
    <${Frente} w=${w} d=${d} h=${h} puerta=${3.0} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${COL.cian} />
    <${V} p=${[1.98, 0.55, 0]} s=${[0.03, 1.0, 7.0]} />
    <${B} m="M" p=${[1.98, 1.07, 0]} s=${[0.06, 0.05, 7.0]} c=${COL.maderaC} />
    <${V} p=${[3.0, 0.55, -3.5]} s=${[2.0, 1.0, 0.03]} />
    <${Sofa} p=${[-1.2, 0, 2.6]} r=${[0, PI, 0]} w=${2.4} c=${COL.noche} cojin=${COL.beige} />
    <${Sofa} p=${[-1.2, 0, -3.6]} w=${2.4} c=${COL.elec} cojin=${COL.beige} />
    <${MesaRedonda} p=${[-1.2, 0, -0.5]} d=${0.9} alto=${0.42} />
    <${Alumno} p=${[-1.8, 0, 2.55]} ry=${PI - 0.3} pose="charlando" asiento=${0.44} seed=${961} />
    <${Alumno} p=${[-0.6, 0, 2.55]} ry=${PI + 0.3} pose="charlando" asiento=${0.44} seed=${962} />
    <${Alumno} p=${[-1.6, 0, -3.55]} pose="leyendo" objeto="libro" asiento=${0.44} seed=${960} />
    <${Puf} p=${[0.9, 0, -1.4]} c=${COL.beige} /><${Puf} p=${[0.8, 0, 0.6]} c=${COL.elec} />
    <${Estanteria} p=${[-w / 2 + 0.27, 0, 0.2]} r=${[0, PI / 2, 0]} w=${1.8} h=${1.8} niveles=${4} tex=${texLomos(77, 4)} c=${COL.maderaC} led=${COL.maderaC} />
    <${Planta} p=${[1.3, 0, -4.0]} s=${1.3} tipo=${1} /><${Planta} p=${[-3.5, 0, -4.0]} s=${1.1} tipo=${2} /><${Planta} p=${[-3.4, 0, 3.6]} s=${1.0} tipo=${0} />
  <//>`;
}

// Salón común del internado (sofás, televisión, mesas y libros)
export function Salon({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h;
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#e7dccb" borde=${COL.maderaC} />
    <${Frente} w=${w} d=${d} h=${h} puerta=${-6.6} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${COL.cian} />
    <${B} p=${[-3.6, 0.02, -2.0]} s=${[5.4, 0.02, 3.6]} c="#2b3f72" />
    <${Sofa} p=${[-3.6, 0, -0.4]} r=${[0, PI, 0]} w=${3.4} c=${COL.noche} cojin=${COL.beige} />
    <${Sofa} p=${[-6.2, 0, -2.2]} r=${[0, PI / 2, 0]} w=${2.4} c=${COL.noche} cojin=${COL.beige} />
    <${B} m="B" p=${[-3.6, 0.22, -2.0]} s=${[1.6, 0.44, 0.8]} c=${COL.maderaC} />
    <${Pantalla} p=${[-3.6, 1.75, -d / 2 + 0.25]} w=${2.8} h=${1.58} tex=${texPantalla('pelicula')} />
    <${B} m="B" p=${[-3.6, 0.3, -d / 2 + 0.35]} s=${[3.4, 0.6, 0.45]} c=${COL.madera} />
    <${Alumno} p=${[-4.5, 0, -0.5]} ry=${PI} pose="sentado" asiento=${0.44} seed=${980} />
    <${Alumno} p=${[-3.5, 0, -0.5]} ry=${PI} pose="charlando" asiento=${0.44} seed=${981} />
    <${Alumno} p=${[-2.4, 0, -0.5]} ry=${PI} pose="sentado" asiento=${0.44} seed=${986} />
    <${Alumno} p=${[-6.1, 0, -2.6]} ry=${PI / 2} pose="sentado" asiento=${0.44} seed=${982} />
    <${B} p=${[3.4, 0.02, -1.4]} s=${[4.6, 0.02, 4.2]} c="#c9a978" />
    <${Sofa} p=${[3.4, 0, -3.5]} w=${2.6} c=${COL.elec} cojin=${COL.beige} />
    <${Sillon} p=${[1.6, 0, -1.2]} r=${[0, PI / 2, 0]} c=${COL.noche} />
    <${Sillon} p=${[5.2, 0, -1.2]} r=${[0, -PI / 2, 0]} c=${COL.noche} />
    <${MesaRedonda} p=${[3.4, 0, -1.6]} d=${1.0} alto=${0.42} />
    <${Alumno} p=${[2.9, 0, -3.45]} pose="charlando" asiento=${0.44} seed=${983} />
    <${Alumno} p=${[3.9, 0, -3.45]} pose="leyendo" objeto="libro" asiento=${0.44} seed=${984} />
    <${Alumno} p=${[5.2, 0, -1.2]} ry=${-PI / 2} pose="charlando" asiento=${0.46} seed=${985} />
    <${Mesa} p=${[4.6, 0, 2.3]} w=${2.4} d=${1.0} c=${COL.maderaC} />
    ${[-0.7, 0.7].map((dx, i) => html`<${Silla} key=${'s' + i} p=${[4.6 + dx, 0, 3.05]} r=${[0, PI, 0]} c=${COL.noche} />`)}
    <${Alumno} p=${[3.9, 0, 3.05]} ry=${PI} pose="escribiendo" seed=${987} />
    <${Libro} p=${[3.9, 0.76, 2.6]} r=${[0, PI, 0]} abierto c=${COL.elec} />
    <${Estanteria} p=${[w / 2 - 0.27, 0, 0.0]} r=${[0, -PI / 2, 0]} w=${1.85} h=${2.2} niveles=${5} tex=${texLomos(88, 5)} c=${COL.maderaC} led=${COL.maderaC} />
    <${Estanteria} p=${[w / 2 - 0.27, 0, -2.0]} r=${[0, -PI / 2, 0]} w=${1.85} h=${2.2} niveles=${5} tex=${texLomos(89, 5)} c=${COL.maderaC} led=${COL.maderaC} />
    ${[-7.2, -0.6, 7.2].map((x, i) => html`<${Planta} key=${'pl' + i} p=${[x, 0, -4.05]} s=${1.15} tipo=${i % 3} />`)}
  <//>`;
}
