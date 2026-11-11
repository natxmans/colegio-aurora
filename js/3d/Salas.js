// =========================================================
// OTROS ESPACIOS DE LA PLANTA BAJA + TODO EL INTERNADO (primer piso)
// Coordenadas canónicas: pasillo hacia +z, fachada exterior hacia -z
// =========================================================
import { html, THREE, useMemo, useRef, useFrame } from '../lib.js';
import { B, C, S, Cono, Ico, Toro, V, G, Panel, COL, COLORES_VIVOS, Pupitre, Silla, Portatil, Monitor, Cuaderno, Libro, Planta, Estanteria, Frente, TirasLed, Suelo, Mesa, MesaRedonda, Taburete, Sofa, Puf, Lampara, Pantalla, Cama, Armario, Gira, azar } from './piezas.js';
import { Alumno, ROPA_ENFERMERA, ROPA_RECEPCION } from './Alumno.js';
import { texPantalla, texPoster, texCuadro, texLomos, texCruz, texCartel, texRotulo } from './texturas.js';

const PI = Math.PI;

// =================== PLANTA BAJA ===================
export function SalaArte({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h, col = s.color;
  const caballete = (x, z, ry, sem) => html`<${G} key=${'c' + sem} p=${[x, 0, z]} r=${[0, ry, 0]}>
    <${B} p=${[-0.32, 0.85, 0.05]} r=${[0.1, 0, 0.12]} s=${[0.05, 1.75, 0.05]} c=${COL.madera} />
    <${B} p=${[0.32, 0.85, 0.05]} r=${[0.1, 0, -0.12]} s=${[0.05, 1.75, 0.05]} c=${COL.madera} />
    <${B} p=${[0, 0.8, -0.35]} r=${[-0.35, 0, 0]} s=${[0.05, 1.7, 0.05]} c=${COL.madera} />
    <${B} p=${[0, 0.85, 0.12]} s=${[0.8, 0.04, 0.08]} c=${COL.madera} />
    <${B} p=${[0, 1.33, 0.1]} r=${[0.1, 0, 0]} s=${[0.86, 0.96, 0.03]} c="#ffffff" />
    <${Panel} p=${[0, 1.33, 0.119]} r=${[0.1, PI, 0]} w=${0.8} h=${0.9} tex=${texCuadro(sem)} luz=${false} />
  <//>`;
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#efe9e4" borde=${col} />
    <${Frente} w=${w} d=${d} h=${h} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${col} />
    ${caballete(-2.4, -1.4, 0.3, 1)} ${caballete(-0.6, -2.4, 0.1, 2)} ${caballete(1.6, -2.2, -0.25, 3)} ${caballete(2.8, -0.2, -0.9, 4)}
    <${Alumno} p=${[-2.15, 0, -0.75]} ry=${PI + 0.3} pose="pintando" objeto="paleta" seed=${201} />
    <${Alumno} p=${[-0.5, 0, -1.75]} ry=${PI + 0.1} pose="pintando" objeto="paleta" seed=${202} />
    <${Alumno} p=${[1.4, 0, -1.55]} ry=${PI - 0.25} pose="pintando" objeto="paleta" seed=${203} />
    <${Mesa} p=${[0, 0, 1.4]} w=${2.6} d=${1.1} c="#ffffff" />
    ${COLORES_VIVOS.slice(0, 7).map((c, i) => html`<${C} key=${'b' + i} m="B" p=${[-1 + i * 0.32, 0.82, 1.3]} s=${[0.12, 0.12, 0.12]} c=${c} />`)}
    <${B} p=${[0.6, 0.77, 1.55]} s=${[0.6, 0.01, 0.42]} c="#fffdf5" /><${B} p=${[-0.5, 0.77, 1.6]} r=${[0, 0.4, 0]} s=${[0.42, 0.01, 0.3]} c="#ffe8f0" />
    <${Taburete} p=${[-0.8, 0, 2.2]} c=${col} /><${Taburete} p=${[0.8, 0, 2.2]} c=${COL.violeta} />
    <${Alumno} p=${[0.8, 0, 2.2]} ry=${PI} pose="escribiendo" asiento=${0.49} seed=${204} />
    <${G} p=${[2.8, 0, 2.6]}>
      <${B} m="B" p=${[0, 0.5, 0]} s=${[0.6, 1.0, 0.6]} c=${COL.blanco} />
      <${Gira} p=${[0, 1.45, 0]} vel=${0.5}>
        <mesh castShadow><torusKnotGeometry args=${[0.26, 0.08, 128, 16]} /><meshStandardMaterial color="#8b5cf6" metalness=${0.9} roughness=${0.18} /></mesh>
      <//>
      <${B} m="L" p=${[0, 1.01, 0]} s=${[0.62, 0.02, 0.62]} c=${col} />
    <//>
    ${[0, 1, 2].map(i => html`<${G} key=${'g' + i}>
      <${B} p=${[-w / 2 + 0.12, 2.0, -2.4 + i * 1.5]} s=${[0.04, 1.0, 1.2]} c=${COL.negro} />
      <${Panel} p=${[-w / 2 + 0.15, 2.0, -2.4 + i * 1.5]} r=${[0, PI / 2, 0]} w=${1.1} h=${0.9} tex=${texCuadro(5 + i)} luz=${false} />
    <//>`)}
    <${Estanteria} p=${[w / 2 - 0.27, 0, 0.6]} r=${[0, -PI / 2, 0]} w=${1.8} h=${1.6} niveles=${3} led=${col} />
    ${[0, 1, 2].map(i => [0, 1, 2, 3].map(j => html`<${B} key=${'k' + i + j} p=${[w / 2 - 0.3, 0.2 + i * 0.5, -0.1 + j * 0.42]} s=${[0.25, 0.22, 0.3]} c=${COLORES_VIVOS[(i * 4 + j) % 10]} />`))}
    ${[[-1.2, 0.3, '#ef4444'], [1.0, -0.8, '#3d8bff'], [-0.2, 0.6, '#fbbf24']].map(([x, z, c], i) => html`<${C} key=${'m' + i} p=${[x, 0.034, z]} s=${[0.5, 0.004, 0.36]} c=${c} />`)}
  <//>`;
}

export function SalaInformatica({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h, col = s.color;
  const items = [];
  let k = 0;
  for (const z of [-2.9, -1.3, 0.3]) for (const x of [-1.85, 1.85]) {
    items.push(html`<${Pupitre} key=${'p' + k} p=${[x, 0, z]} ancho=${1.7} c=${COL.negro} led=${col} />`);
    for (const dx of [-0.42, 0.42]) {
      const i = k++;
      items.push(html`<${Monitor} key=${'m' + i} p=${[x + dx, 0.74, z + 0.1]} ancho=${0.52} pantalla=${['#3d8bff', '#22d3ee', '#8b5cf6', '#34d399'][i % 4]} />`);
      items.push(html`<${G} key=${'s' + i} p=${[x + dx, 0, z - 0.55]}>
        <${Silla} c=${i % 2 ? COL.violeta : col} />
        <${B} m="B" p=${[0, 1.05, -0.24]} s=${[0.4, 0.3, 0.05]} c=${i % 2 ? COL.violeta : col} />
      <//>`);
      if (i !== 2 && i !== 9) items.push(html`<${Alumno} key=${'a' + i} p=${[x + dx, 0, z - 0.55]} pose="tecleando" seed=${300 + i} objeto=${i === 5 ? 'cascos' : null} />`);
    }
  }
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#dfe5f0" borde=${col} />
    <${Frente} w=${w} d=${d} h=${h} macizo=${[-2.6, 2.4]} puerta=${3.05} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${col} />
    ${items}
    <${G} p=${[0, 1.85, d / 2 - 0.12]} r=${[0, PI, 0]}>
      <${Pantalla} p=${[-0.92, 0.48, 0]} w=${1.8} h=${0.95} tex=${texPantalla('codigo')} />
      <${Pantalla} p=${[0.92, 0.48, 0]} w=${1.8} h=${0.95} tex=${texPantalla('juego')} />
      <${Pantalla} p=${[-0.92, -0.52, 0]} w=${1.8} h=${0.95} tex=${texPantalla('mapa-campus')} />
      <${Pantalla} p=${[0.92, -0.52, 0]} w=${1.8} h=${0.95} tex=${texPantalla('horario')} />
    <//>
    <${G} p=${[w / 2 - 0.5, 0, -d / 2 + 0.6]}>
      <${B} m="B" p=${[0, 1.0, 0]} s=${[0.7, 2.0, 0.8]} c=${COL.negro} />
      ${[...Array(10)].map((_, i) => html`<${B} key=${i} m="L" p=${[-0.36, 0.25 + i * 0.17, (i % 3 - 1) * 0.15]} s=${[0.01, 0.025, 0.06]} c=${i % 3 ? COL.cian : '#34d399'} />`)}
    <//>
    <${Alumno} p=${[-2.6, 0, 2.6]} ry=${PI * 0.85} pose="vr" objeto="gafasvr" seed=${311} />
    <${C} m="L" p=${[-2.6, 0.012, 2.6]} s=${[1.6, 0.01, 1.6]} c="#1e3a8a" />
    <${Toro} m="L" p=${[-2.6, 0.02, 2.6]} r=${[PI / 2, 0, 0]} s=${[1.6, 1.6, 0.3]} c=${COL.cian} />
  <//>`;
}

export function Biblioteca({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h, col = s.color;
  const estantes = [];
  for (let i = 0; i < 4; i++) {
    estantes.push(html`<${Estanteria} key=${'o' + i} p=${[-w / 2 + 0.26, 0, -3.3 + i * 1.95]} r=${[0, PI / 2, 0]} w=${1.85} h=${2.6} niveles=${6} tex=${texLomos(40 + i, 6)} led=${col} />`);
    estantes.push(html`<${Estanteria} key=${'e' + i} p=${[w / 2 - 0.26, 0, -3.3 + i * 1.95]} r=${[0, -PI / 2, 0]} w=${1.85} h=${2.6} niveles=${6} tex=${texLomos(50 + i, 6)} led=${col} />`);
  }
  const mesas = [];
  let k = 0;
  for (const x of [-2.4, 0.8]) {
    mesas.push(html`<${Mesa} key=${'m' + x} p=${[x, 0, 0.2]} w=${2.6} d=${1.1} c=${COL.maderaC} />`);
    mesas.push(html`<${Lampara} key=${'l' + x} p=${[x, 0.76, 0.2]} />`);
    for (const dx of [-0.8, 0, 0.8]) for (const lado of [-1, 1]) {
      const i = k++;
      const sz = 0.2 + lado * 0.85;
      mesas.push(html`<${Silla} key=${'s' + i} p=${[x + dx, 0, sz]} r=${[0, lado < 0 ? 0 : PI, 0]} c=${i % 2 ? col : COL.noche} />`);
      if ((i * 5) % 7 < 4) {
        mesas.push(html`<${Alumno} key=${'a' + i} p=${[x + dx, 0, sz]} ry=${lado < 0 ? 0 : PI} pose=${i % 3 ? 'escribiendo' : 'leyendo'} objeto=${i % 3 ? null : 'libro'} seed=${400 + i} />`);
        mesas.push(html`<${Libro} key=${'b' + i} p=${[x + dx, 0.76, 0.2 + lado * 0.32]} r=${[0, lado < 0 ? 0 : PI, 0]} abierto c=${COLORES_VIVOS[i % 10]} />`);
      }
    }
  }
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#ece4d8" borde=${col} />
    <${Frente} w=${w} d=${d} h=${h} puerta=${-4.6} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${col} />
    ${estantes}
    ${mesas}
    <${C} p=${[-1.0, 0.02, -3.0]} s=${[3.2, 0.02, 2.4]} c="#3d4f9a" />
    <${G} p=${[-1.0, 0, -3.3]}>
      ${[-0.9, -0.3, 0.3, 0.9].map((a, i) => html`<${G} key=${i} r=${[0, a, 0]}><${B} p=${[0, 0.22, -1.25]} s=${[0.66, 0.44, 0.7]} c=${i % 2 ? '#8b5cf6' : '#3d8bff'} /><${B} p=${[0, 0.55, -1.55]} s=${[0.66, 0.5, 0.18]} c=${i % 2 ? '#8b5cf6' : '#3d8bff'} /><//>`)}
    <//>
    <${Puf} p=${[0.4, 0, -3.4]} c="#f472b6" /><${Puf} p=${[1.3, 0, -2.9]} c="#fbbf24" /><${Puf} p=${[2.3, 0, -3.5]} c=${COL.cian} />
    <${Alumno} p=${[0.4, 0, -3.4]} ry=${PI * 0.9} pose="leyendo" objeto="libro" asiento=${0.4} seed=${431} />
    <${Alumno} p=${[-1.0, 0, -4.2]} ry=${0} pose="leyendo" objeto="libro" asiento=${0.44} seed=${432} />
    <${Alumno} p=${[3.6, 0, -1.4]} ry=${PI / 2} pose="de_pie" seed=${433} />
    <${G} p=${[3.4, 0, 2.9]}>
      <${B} m="B" p=${[0, 0.5, 0]} s=${[2.2, 1.0, 0.7]} c=${COL.blanco} />
      <${B} m="L" p=${[0, 0.12, -0.36]} s=${[2.1, 0.02, 0.02]} c=${col} />
      <${Monitor} p=${[0.4, 1.0, 0.05]} r=${[0, PI, 0]} pantalla=${col} />
    <//>
    <${Alumno} p=${[3.6, 0, 3.6]} ry=${PI} pose="hablando" adulto seed=${434} ropa=${{ sudadera: '#7c3aed' }} />
    <${Panel} p=${[-1.4, 3.1, d / 2 - 0.05]} r=${[0, PI, 0]} w=${2.0} h=${0.62} tex=${texCartel('Biblioteca', col)} />
  <//>`;
}

export function Recepcion({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h, col = s.color;
  // Escalera hacia el primer piso: x de 2 a 4, sube de z -3.5 (y=0) a z 3.5 (y=4.2)
  const escalones = [];
  for (let i = 0; i < 14; i++) {
    const y = (i + 1) * 0.3, z = -3.5 + 0.25 + i * 0.5;
    escalones.push(html`<${B} key=${'e' + i} m="B" p=${[3.0, y - 0.06, z]} s=${[1.85, 0.12, 0.52]} c=${COL.blanco} />`);
    escalones.push(html`<${B} key=${'l' + i} m="L" p=${[3.0, y - 0.1, z - 0.26]} s=${[1.8, 0.02, 0.02]} c=${COL.cian} />`);
  }
  const ang = Math.atan2(4.2, 7);
  const mostrador = [];
  for (let i = 0; i < 5; i++) {
    const a = -0.7 + i * 0.35;
    mostrador.push(html`<${G} key=${i} p=${[-1.2, 0, 0.6]} r=${[0, a, 0]}>
      <${B} m="B" p=${[0, 0.55, -1.6]} s=${[0.62, 1.1, 0.45]} c=${COL.blanco} />
      <${B} m="L" p=${[0, 0.06, -1.83]} s=${[0.6, 0.03, 0.02]} c=${COL.cian} />
      <${B} m="B" p=${[0, 1.12, -1.62]} s=${[0.64, 0.04, 0.55]} c=${COL.noche} />
    <//>`);
  }
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#e8edf5" />
    <${C} m="L" p=${[-1.2, 0.035, -1.8]} s=${[2.4, 0.004, 2.4]} c="#1e3a8a" />
    <${Toro} m="L" p=${[-1.2, 0.04, -1.8]} r=${[PI / 2, 0, 0]} s=${[2.4, 2.4, 0.4]} c=${COL.cian} />
    <${B} p=${[-2.3, h / 2, d / 2 - 0.08]} s=${[3.2, h, 0.16]} c=${COL.blanco} />
    <${B} p=${[1.3, h / 2, d / 2 - 0.08]} s=${[0.8, h, 0.16]} c=${COL.blanco} />
    <${Panel} p=${[-2.3, 2.6, d / 2 - 0.17]} r=${[0, PI, 0]} w=${3.0} h=${0.75} transp tex=${texRotulo('AURORA', 'Colegio-internado', COL.cian)} />
    ${mostrador}
    <${Monitor} p=${[-1.2, 1.14, -0.9]} r=${[0, PI, 0]} pantalla=${col} />
    <${Alumno} p=${[-1.2, 0, -0.3]} ry=${PI} pose="hablando" adulto ropa=${ROPA_RECEPCION} seed=${501} />
    ${escalones}
    <${B} m="M" p=${[2.06, 2.0, 0]} r=${[-ang, 0, 0]} s=${[0.1, 0.22, 8.25]} c=${COL.grisO} />
    <${V} p=${[2.06, 2.65, 0]} r=${[-ang, 0, 0]} s=${[0.03, 1.0, 8.2]} />
    <${B} m="L" p=${[2.06, 3.18, 0]} r=${[-ang, 0, 0]} s=${[0.05, 0.03, 8.2]} c=${COL.cian} />
    <${Pantalla} p=${[-w / 2 + 0.12, 2.0, -1.6]} r=${[0, PI / 2, 0]} w=${2.4} h=${1.35} tex=${texPantalla('bienvenida')} />
    <${Sofa} p=${[-2.4, 0, -3.6]} r=${[0, 0, 0]} w=${2.0} />
    <${MesaRedonda} p=${[-2.4, 0, -2.6]} d=${0.7} alto=${0.42} />
    <${Planta} p=${[-3.5, 0, -4.1]} s=${1.2} tipo=${1} /><${Planta} p=${[1.4, 0, -4.0]} s=${1.1} tipo=${2} />
    <${Alumno} p=${[0.2, 0, -2.0]} ry=${2.6} pose="saludando" seed=${502} />
    <${Alumno} p=${[-2.9, 0, -3.6]} ry=${0} pose="charlando" asiento=${0.44} seed=${503} />
  <//>`;
}

export function Comedor({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h, col = s.color;
  const mesas = [];
  let k = 0;
  const comida = ['#e9a23b', '#7cc66a', '#e85d4a', '#f6d365'];
  for (const x of [-3.6, -0.6, 2.4]) for (const z of [-2.6, 0.4]) {
    const xx = x + (z > 0 ? 0.8 : 0);
    mesas.push(html`<${MesaRedonda} key=${'m' + k} p=${[xx, 0, z]} d=${1.25} />`);
    for (let j = 0; j < 4; j++) {
      const a = j * PI / 2 + 0.4, sx = xx + Math.sin(a) * 0.92, sz = z + Math.cos(a) * 0.92, ry = a + PI;
      const i = k * 4 + j;
      mesas.push(html`<${Silla} key=${'s' + i} p=${[sx, 0, sz]} r=${[0, ry, 0]} c=${i % 2 ? col : '#fbbf24'} />`);
      const tx = xx + Math.sin(a) * 0.36, tz = z + Math.cos(a) * 0.36;
      if (j !== 3 || k % 2) {
        mesas.push(html`<${G} key=${'b' + i} p=${[tx, 0.76, tz]} r=${[0, ry, 0]}>
          <${B} p=${[0, 0.01, 0]} s=${[0.42, 0.02, 0.3]} c=${COL.noche} />
          <${C} m="B" p=${[0, 0.03, 0]} s=${[0.24, 0.02, 0.24]} c="#ffffff" />
          <${S} p=${[0, 0.05, 0]} s=${[0.16, 0.05, 0.16]} c=${comida[i % 4]} />
          <${C} m="B" p=${[0.15, 0.06, 0.08]} s=${[0.06, 0.1, 0.06]} c="#bfe6ff" />
        <//>`);
        mesas.push(html`<${Alumno} key=${'a' + i} p=${[sx, 0, sz]} ry=${ry} pose=${i % 3 ? 'comiendo' : 'charlando'} seed=${600 + i} />`);
      }
    }
    k++;
  }
  const xb = -w / 2 + 0.7;
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#e7d8c4" borde=${col} />
    <${Frente} w=${w} d=${d} h=${h} puerta=${5.5} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${col} />
    ${mesas}
    <${G} p=${[0, 0, 0]}>
      <${B} m="B" p=${[5.6, 0.48, -1.0]} s=${[0.8, 0.96, 6.0]} c=${COL.blanco} />
      <${B} m="M" p=${[5.6, 0.97, -1.0]} s=${[0.84, 0.03, 6.04]} c=${COL.grisM} />
      <${B} m="L" p=${[5.18, 0.12, -1.0]} s=${[0.02, 0.03, 5.9]} c=${col} />
      <${V} p=${[5.45, 1.35, -1.0]} r=${[0, 0, 0.25]} s=${[0.02, 0.5, 5.8]} />
      ${[...Array(8)].map((_, i) => html`<${B} key=${i} p=${[5.6, 1.02, -3.6 + i * 0.72]} s=${[0.5, 0.06, 0.55]} c=${['#e9a23b', '#7cc66a', '#e85d4a', '#f6d365', '#c084fc', '#e9a23b', '#7cc66a', '#f97316'][i]} />`)}
      <${Pantalla} p=${[w / 2 - 0.12, 2.35, -1.0]} r=${[0, -PI / 2, 0]} w=${2.6} h=${1.46} tex=${texPantalla('menu')} />
      <${Alumno} p=${[6.3, 0, -1.6]} ry=${-PI / 2} pose="hablando" adulto ropa=${{ sudadera: '#f8fafc', ribete: '#f97316' }} seed=${650} />
      <${Alumno} p=${[4.75, 0, 0.2]} ry=${PI / 2} pose="de_pie" seed=${651} />
      <${Alumno} p=${[4.75, 0, 1.0]} ry=${PI / 2} pose="de_pie" seed=${652} />
    <//>
    <${G} p=${[xb, 0, -3.6]}>
      <${B} m="B" p=${[0, 0.95, 0]} s=${[0.7, 1.9, 0.8]} c=${COL.blanco} />
      <${B} m="L" p=${[0.36, 1.2, 0]} s=${[0.01, 0.9, 0.6]} c="#9fdcff" />
    <//>
    <${Planta} p=${[xb, 0, 3.4]} s=${1.1} tipo=${1} /><${Planta} p=${[-2.2, 0, -4.1]} s=${1.0} tipo=${2} /><${Planta} p=${[2.4, 0, -4.1]} s=${1.0} tipo=${0} />
  <//>`;
}

export function Enfermeria({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h, col = s.color;
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#e6f2ec" borde=${col} />
    <${Frente} w=${w} d=${d} h=${h} puerta=${1.5} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${col} />
    <${G} p=${[-1.7, 0, -2.6]}>
      <${B} m="M" p=${[0, 0.32, 0]} s=${[0.85, 0.08, 1.95]} c=${COL.grisM} />
      ${[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => html`<${B} key=${i} m="M" p=${[a * 0.36, 0.16, b * 0.88]} s=${[0.04, 0.32, 0.04]} c=${COL.grisM} />`)}
      <${B} p=${[0, 0.45, 0]} s=${[0.8, 0.14, 1.9]} c="#d6ecff" />
      <${B} p=${[0, 0.57, -0.75]} s=${[0.55, 0.1, 0.3]} c="#ffffff" />
    <//>
    <${Alumno} p=${[-1.25, 0, -2.4]} ry=${PI / 2} pose="sentado" asiento=${0.53} seed=${701} />
    <${V} p=${[-0.6, 1.1, -2.0]} s=${[0.03, 2.0, 2.4]} c="#cdeaff" />
    <${B} m="M" p=${[-0.6, 2.12, -2.0]} s=${[0.04, 0.04, 2.5]} c=${COL.grisM} />
    <${Mesa} p=${[1.4, 0, 0.4]} w=${1.4} d=${0.7} />
    <${Monitor} p=${[1.4, 0.76, 0.45]} r=${[0, PI, 0]} pantalla="#4ade80" />
    <${Silla} p=${[1.4, 0, 1.05]} r=${[0, PI, 0]} c=${col} />
    <${Alumno} p=${[0.4, 0, -0.6]} ry=${-2.4} pose="hablando" adulto ropa=${ROPA_ENFERMERA} seed=${702} />
    <${G} p=${[w / 2 - 0.35, 0, -2.4]}>
      <${B} m="B" p=${[0, 1.1, 0]} s=${[0.5, 2.0, 1.6]} c=${COL.blanco} />
      ${[0, 1, 2, 3].map(i => html`<${B} key=${i} p=${[-0.1, 0.5 + i * 0.42, 0]} s=${[0.3, 0.02, 1.4]} c=${COL.gris} />`)}
      ${[0, 1, 2, 3].map(i => [0, 1, 2].map(j => html`<${B} key=${'c' + i + j} p=${[-0.12, 0.6 + i * 0.42, -0.45 + j * 0.45]} s=${[0.22, 0.16, 0.3]} c=${['#ffffff', '#86efac', '#93c5fd', '#fca5a5'][(i + j) % 4]} />`))}
      <${V} p=${[-0.27, 1.1, 0]} s=${[0.02, 1.9, 1.55]} />
    <//>
    <${Panel} p=${[-1.0, 2.5, d / 2 - 0.1]} r=${[0, PI, 0]} w=${0.6} h=${0.6} tex=${texCruz()} />
    <${B} m="L" p=${[-1.0, 3.2, d / 2 - 0.12]} s=${[0.12, 0.42, 0.04]} c="#22c55e" /><${B} m="L" p=${[-1.0, 3.2, d / 2 - 0.12]} s=${[0.42, 0.12, 0.04]} c="#22c55e" />
    <${Planta} p=${[2.3, 0, -4.0]} s=${0.9} tipo=${1} />
  <//>`;
}

function Futbolin({ p, r }) {
  const barras = [];
  for (let i = 0; i < 8; i++) {
    const x = -0.5 + i * 0.143, c = i % 2 ? '#ef4444' : '#3d8bff';
    barras.push(html`<${C} key=${'b' + i} m="M" p=${[x, 0.92, 0]} r=${[PI / 2, 0, 0]} s=${[0.02, 1.0, 0.02]} c=${COL.grisM} />`);
    for (let j = 0; j < (i === 0 || i === 7 ? 1 : 3); j++) barras.push(html`<${B} key=${'j' + i + j} p=${[x, 0.86, (j - (i === 0 || i === 7 ? 0 : 1)) * 0.2]} s=${[0.04, 0.14, 0.05]} c=${c} />`);
  }
  return html`<${G} p=${p} r=${r}>
    <${B} m="B" p=${[0, 0.82, 0]} s=${[1.2, 0.22, 0.72]} c=${COL.noche} />
    <${B} p=${[0, 0.82, 0]} s=${[1.12, 0.2, 0.64]} c="#2f8f4e" />
    <${B} m="L" p=${[0, 0.93, 0]} s=${[0.01, 0.002, 0.62]} c="#ffffff" />
    ${[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => html`<${B} key=${i} m="M" p=${[a * 0.52, 0.36, b * 0.28]} s=${[0.06, 0.72, 0.06]} c=${COL.grisO} />`)}
    ${barras}
  <//>`;
}

function Expendedora({ p, r }) {
  const botellas = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) botellas.push(html`<${C} key=${i + '-' + j} m="L" p=${[-0.24 + j * 0.16, 0.7 + i * 0.32, 0.25]} s=${[0.07, 0.2, 0.07]} c=${COLORES_VIVOS[(i * 3 + j) % 10]} />`);
  return html`<${G} p=${p} r=${r}>
    <${B} m="B" p=${[0, 0.95, 0]} s=${[0.8, 1.9, 0.6]} c=${COL.noche} />
    <${B} m="L" p=${[0, 1.15, 0.25]} s=${[0.66, 1.3, 0.02]} c="#0f2a5e" />
    ${botellas}
    <${V} p=${[0, 1.15, 0.31]} s=${[0.66, 1.3, 0.02]} />
    <${B} m="L" p=${[0.33, 1.4, 0.31]} s=${[0.02, 0.6, 0.02]} c=${COL.cian} />
  <//>`;
}

export function SalaComun({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h, col = s.color;
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#e2eef0" borde=${col} />
    <${Frente} w=${w} d=${d} h=${h} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${col} />
    <${B} p=${[-0.6, 0.02, -2.0]} s=${[4.4, 0.02, 3.0]} c="#344a8f" />
    <${Sofa} p=${[-0.6, 0, -3.6]} w=${3.2} c=${COL.noche} cojin=${col} />
    <${Sofa} p=${[-2.9, 0, -1.9]} r=${[0, PI / 2, 0]} w=${2.0} c=${COL.noche} cojin=${col} />
    <${B} m="B" p=${[-0.6, 0.22, -2.0]} s=${[1.4, 0.44, 0.8]} c=${COL.blanco} />
    <${Pantalla} p=${[w / 2 - 0.12, 1.7, -2.0]} r=${[0, -PI / 2, 0]} w=${2.4} h=${1.35} tex=${texPantalla('partido')} />
    <${Alumno} p=${[-1.3, 0, -3.5]} ry=${0.5} pose="charlando" asiento=${0.44} seed=${801} />
    <${Alumno} p=${[-0.1, 0, -3.5]} ry=${0} pose="sentado" asiento=${0.44} seed=${802} />
    <${Alumno} p=${[-2.8, 0, -1.6]} ry=${PI / 2} pose="charlando" asiento=${0.44} seed=${803} />
    <${Futbolin} p=${[0.4, 0, 1.6]} />
    <${Alumno} p=${[0.4, 0, 0.95]} ry=${0} pose="futbolin" seed=${804} />
    <${Alumno} p=${[0.4, 0, 2.25]} ry=${PI} pose="futbolin" seed=${805} />
    <${Expendedora} p=${[-w / 2 + 0.45, 0, 2.6]} r=${[0, PI / 2, 0]} />
    <${Puf} p=${[2.4, 0, 0.4]} c="#f472b6" /><${Puf} p=${[2.8, 0, 1.4]} c=${COL.violeta} />
    <${Alumno} p=${[2.4, 0, 0.4]} ry=${-2.2} pose="leyendo" objeto="libro" asiento=${0.42} seed=${806} />
    <${Planta} p=${[3.3, 0, -4.0]} s=${1.1} tipo=${0} /><${Planta} p=${[-3.4, 0, -4.0]} s=${1.0} tipo=${1} />
  <//>`;
}

// =================== PRIMER PISO · INTERNADO ===================
const MANTAS = ['#3d8bff', '#8b5cf6', '#22d3ee', '#f472b6', '#34d399', '#fbbf24'];
const POSTERS = ['espacio', 'futbol', 'musica', 'naturaleza', 'valencia'];

export function Habitacion({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h, col = s.color, n = s.num;
  const i = n - 101;
  const xL = -w / 2 + 0.62, xR = w / 2 - 0.62;
  const mA = MANTAS[i % 6], mB = MANTAS[(i + 3) % 6];
  const tipo = i % 4;
  const escritorio = (lado) => {
    const x = lado * (w / 2 - 0.42);
    return html`<${G} key=${'esc' + lado}>
      <${B} m="B" p=${[x, 0.75, -0.75]} s=${[0.65, 0.04, 1.45]} c=${COL.maderaC} />
      <${B} m="B" p=${[x + lado * 0.0, 0.37, -1.42]} s=${[0.62, 0.74, 0.04]} c=${COL.blanco} />
      <${B} m="B" p=${[x, 0.37, -0.08]} s=${[0.62, 0.74, 0.04]} c=${COL.blanco} />
      <${B} m="B" p=${[x + lado * 0.18, 1.55, -0.75]} s=${[0.28, 0.03, 1.3]} c=${COL.blanco} />
      <${B} m="L" p=${[x + lado * 0.05, 1.53, -0.75]} s=${[0.02, 0.012, 1.25]} c=${col} />
      <${Libro} p=${[x + lado * 0.2, 1.68, -1.1]} r=${[0, 0, PI / 2]} c=${mA} /><${Libro} p=${[x + lado * 0.2, 1.68, -1.05]} r=${[0, 0, PI / 2]} c=${mB} /><${Libro} p=${[x + lado * 0.2, 1.68, -1.0]} r=${[0, 0, PI / 2]} c="#ffffff" />
      <${Portatil} p=${[x - lado * 0.05, 0.77, -0.6]} r=${[0, lado * PI / 2, 0]} pantalla=${col} />
      <${G} p=${[x + lado * 0.15, 0.77, -1.2]}>
        <${C} m="M" p=${[0, 0.01, 0]} s=${[0.14, 0.02, 0.14]} c=${COL.grisO} />
        <${B} m="M" p=${[0, 0.2, 0]} r=${[0, 0, -lado * 0.3]} s=${[0.02, 0.4, 0.02]} c=${COL.grisO} />
        <${B} m="L" p=${[-lado * 0.1, 0.4, 0]} s=${[0.16, 0.03, 0.08]} c=${COL.calido} />
      <//>
      <${Silla} p=${[lado * (w / 2 - 1.15), 0, -0.6]} r=${[0, lado * PI / 2, 0]} c=${lado < 0 ? mA : mB} />
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
    <${Alumno} p=${[w / 2 - 1.15, 0, -0.6]} ry=${PI / 2} pose="tecleando" seed=${905 + i * 3} objeto="cascos" />`;

  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#e9dcc8" />
    <${Frente} w=${w} d=${d} h=${h} puerta=${0} macizo=${[-w / 2 + 0.1, -0.7]} />
    <${B} p=${[w / 2 - 1.3, h / 2, d / 2 - 0.08]} s=${[2.4, h, 0.16]} c=${COL.blanco} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${col} />
    <${B} p=${[0, 0.03, -2.0]} s=${[2.4, 0.02, 2.6]} c=${i % 2 ? '#2c3d7a' : '#4b3a7a'} />
    <${Cama} p=${[xL, 0, -3.3]} manta=${mA} led=${col} />
    <${Cama} p=${[xR, 0, -3.3]} manta=${mB} led=${col} />
    <${G} p=${[0, 0, -4.15]}>
      <${B} m="B" p=${[0, 0.25, 0]} s=${[0.5, 0.5, 0.4]} c=${COL.blanco} />
      <${B} m="L" p=${[0, 0.03, 0.2]} s=${[0.46, 0.02, 0.02]} c=${col} />
      <${Lampara} p=${[0, 0.5, 0]} c=${COL.calido} />
    <//>
    ${escritorio(-1)} ${escritorio(1)}
    <${Armario} p=${[xL - 0.2, 0, 2.3]} r=${[0, PI / 2, 0]} w=${1.7} prof=${0.6} led=${col} />
    <${Armario} p=${[xR + 0.2, 0, 2.3]} r=${[0, -PI / 2, 0]} w=${1.7} prof=${0.6} led=${col} />
    <${Puf} p=${[0.2, 0, -1.6]} c=${col} />
    <${Planta} p=${[1.2, 0, -4.15]} s=${0.8} tipo=${i % 3} />
    <${B} m="L" p=${[0, h - 0.05, -d / 2 + 0.2]} s=${[w - 0.4, 0.03, 0.03]} c=${col} />
    ${alumnos}
  <//>`;
}

export function Banos({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h, col = s.color;
  const duchas = [];
  for (let i = 0; i < 4; i++) {
    const x = -w / 2 + 1.1 + i * 1.9;
    duchas.push(html`<${G} key=${i} p=${[x, 0, -3.4]}>
      <${B} p=${[0, 0.04, 0]} s=${[1.6, 0.06, 1.8]} c="#d8e8f4" />
      <${V} p=${[0.82, 1.05, 0]} s=${[0.03, 2.0, 1.8]} c="#e2f2ff" />
      <${V} p=${[0, 1.05, 0.9]} s=${[1.1, 2.0, 0.03]} c="#e2f2ff" />
      <${C} m="M" p=${[0, 2.2, -0.75]} s=${[0.25, 0.04, 0.25]} c=${COL.grisM} />
      <${C} m="M" p=${[0, 1.4, -0.86]} s=${[0.03, 1.6, 0.03]} c=${COL.grisM} />
      <${B} m="L" p=${[0, 2.18, -0.75]} s=${[0.2, 0.01, 0.2]} c=${col} />
      <${B} p=${[-0.6, 1.3, 0.92]} s=${[0.35, 0.6, 0.06]} c=${MANTAS[i]} />
    <//>`);
  }
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#dce8f2" borde=${col} />
    <${Frente} w=${w} d=${d} h=${h} puerta=${2.8} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${col} />
    ${duchas}
    <${G} p=${[-w / 2 + 0.4, 0, 0.6]}>
      <${B} m="B" p=${[0, 0.85, 0]} s=${[0.6, 0.12, 3.6]} c=${COL.blanco} />
      ${[-1.1, 0, 1.1].map((z, i) => html`<${G} key=${i}><${C} m="B" p=${[0.05, 0.93, z]} s=${[0.4, 0.06, 0.4]} c="#ffffff" /><${C} m="M" p=${[-0.18, 1.02, z]} s=${[0.03, 0.18, 0.03]} c=${COL.grisM} /><//>`)}
      <${B} m="M" p=${[-0.26, 1.7, 0]} s=${[0.04, 1.1, 3.6]} c="#dbe7f5" />
      <${B} m="L" p=${[-0.25, 2.3, 0]} s=${[0.03, 0.03, 3.5]} c=${col} />
    <//>
    <${B} m="B" p=${[1.0, 0.25, 0.8]} s=${[2.4, 0.5, 0.5]} c=${COL.maderaC} />
    ${[0, 1, 2].map(i => html`<${B} key=${'t' + i} p=${[0.3 + i * 0.6, 0.55, 0.8]} s=${[0.4, 0.1, 0.32]} c=${MANTAS[i + 2]} />`)}
    <${Alumno} p=${[-w / 2 + 1.0, 0, 0]} ry=${-PI / 2} pose="de_pie" seed=${950} />
    <${Planta} p=${[3.4, 0, 3.6]} s=${0.9} tipo=${1} />
  <//>`;
}

export function Aseos({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h, col = s.color;
  const cubiculos = [];
  for (let i = 0; i < 4; i++) {
    const x = -w / 2 + 0.9 + i * 1.7 + (i > 1 ? 0.3 : 0);
    cubiculos.push(html`<${G} key=${i} p=${[x, 0, -3.5]}>
      <${B} m="B" p=${[0.8, 1.05, 0]} s=${[0.05, 2.0, 1.8]} c=${i < 2 ? '#8b5cf6' : '#3d8bff'} />
      <${B} m="B" p=${[0.35, 1.05, 0.9]} r=${[0, i % 2 ? 0.6 : 0, 0]} s=${[0.75, 2.0, 0.04]} c=${i < 2 ? '#a78bfa' : '#60a5fa'} />
      <${C} m="B" p=${[0, 0.22, -0.45]} s=${[0.4, 0.42, 0.5]} c="#ffffff" />
      <${B} m="B" p=${[0, 0.55, -0.82]} s=${[0.4, 0.5, 0.16]} c="#ffffff" />
    <//>`);
  }
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#e3e8ef" borde=${col} />
    <${Frente} w=${w} d=${d} h=${h} puerta=${-1.8} />
    <${B} p=${[0, h / 2, 0.2]} s=${[0.15, h, 8.4]} c=${COL.blanco} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${col} />
    ${cubiculos}
    ${[-1, 1].map(lado => html`<${G} key=${lado} p=${[lado * 1.8, 0, 1.6]}>
      <${B} m="B" p=${[0, 0.85, 0]} s=${[2.2, 0.12, 0.6]} c=${COL.blanco} />
      <${C} m="B" p=${[-0.5, 0.93, 0]} s=${[0.38, 0.06, 0.38]} c="#ffffff" /><${C} m="B" p=${[0.5, 0.93, 0]} s=${[0.38, 0.06, 0.38]} c="#ffffff" />
      <${B} m="M" p=${[0, 1.7, -0.32]} s=${[2.2, 1.0, 0.03]} c="#dbe7f5" />
      <${B} m="L" p=${[0, 2.25, -0.3]} s=${[2.1, 0.03, 0.03]} c=${lado < 0 ? '#a78bfa' : '#60a5fa'} />
      <${Panel} p=${[0, 2.9, -0.28]} w=${1.4} h=${0.44} tex=${texCartel(lado < 0 ? 'Chicas' : 'Chicos', lado < 0 ? '#a78bfa' : '#60a5fa')} />
    <//>`)}
  <//>`;
}

export function ZonaDescanso({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h, col = s.color;
  return html`<${G}>
    <${B} p=${[-1.0, 0.015, 0]} s=${[5.9, 0.03, d - 0.12]} c="#e3efe6" />
    <${Frente} w=${w} d=${d} h=${h} puerta=${3.0} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${col} />
    <${V} p=${[1.98, 0.55, 0]} s=${[0.03, 1.0, 7.0]} />
    <${B} m="M" p=${[1.98, 1.07, 0]} s=${[0.06, 0.05, 7.0]} c=${COL.grisO} />
    <${V} p=${[3.0, 0.55, -3.5]} s=${[2.0, 1.0, 0.03]} />
    <${B} m="L" p=${[1.98, 0.04, 0]} s=${[0.05, 0.02, 7.0]} c=${COL.cian} />
    <${G} p=${[-2.6, 0, -2.8]}>
      <${C} m="M" p=${[0, 1.95, 0]} s=${[0.03, 3.3, 0.03]} c=${COL.grisO} />
      <${G} p=${[0, 0.9, 0]}>
        <${S} m="B" p=${[0, 0.2, 0]} s=${[1.0, 1.15, 1.0]} c=${COL.blanco} />
        <${S} p=${[0, 0.12, 0.12]} s=${[0.86, 0.6, 0.86]} c=${col} />
      <//>
    <//>
    <${Alumno} p=${[-2.6, 0.72, -2.75]} ry=${0.4} pose="leyendo" objeto="libro" asiento=${0.2} seed=${960} />
    <${Sofa} p=${[-1.2, 0, 2.6]} r=${[0, PI, 0]} w=${2.2} c=${COL.noche} cojin=${col} />
    <${MesaRedonda} p=${[-1.2, 0, 1.4]} d=${0.8} alto=${0.42} />
    <${Alumno} p=${[-1.7, 0, 2.55]} ry=${PI - 0.3} pose="charlando" asiento=${0.44} seed=${961} />
    <${Alumno} p=${[-0.7, 0, 2.55]} ry=${PI + 0.3} pose="charlando" asiento=${0.44} seed=${962} />
    <${Puf} p=${[0.4, 0, -1.2]} c="#f472b6" /><${Puf} p=${[-0.6, 0, -2.0]} c="#fbbf24" /><${Puf} p=${[1.0, 0, -2.6]} c=${COL.violeta} />
    <${Alumno} p=${[0.4, 0, -1.2]} ry=${-0.8} pose="jugando" objeto="mando" asiento=${0.4} seed=${963} />
    <${Estanteria} p=${[-w / 2 + 0.27, 0, 0.2]} r=${[0, PI / 2, 0]} w=${1.8} h=${1.8} niveles=${4} tex=${texLomos(77, 4)} led=${col} />
    <${Planta} p=${[1.3, 0, -4.0]} s=${1.3} tipo=${1} /><${Planta} p=${[-3.5, 0, -4.0]} s=${1.1} tipo=${2} /><${Planta} p=${[-3.4, 0, 3.6]} s=${1.0} tipo=${0} />
  <//>`;
}

function PingPong({ p, r }) {
  const bola = useRef();
  useFrame(({ clock }) => {
    if (!bola.current) return;
    const t = clock.elapsedTime * 1.3, u = (t % 2) / 2, z = (u < 0.5 ? u * 2 : 2 - u * 2) * 2.4 - 1.2;
    bola.current.position.set(Math.sin(t * 1.7) * 0.3, 0.86 + Math.abs(Math.sin(t * PI)) * 0.35, z);
  });
  return html`<${G} p=${p} r=${r}>
    <${B} m="B" p=${[0, 0.76, 0]} s=${[1.525, 0.04, 2.74]} c="#1e4fd8" />
    <${B} m="L" p=${[0, 0.782, 0]} s=${[0.015, 0.003, 2.7]} c="#ffffff" />
    <${B} p=${[0, 0.85, 0]} s=${[1.6, 0.15, 0.01]} c="#f8fafc" />
    ${[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => html`<${B} key=${i} m="M" p=${[a * 0.65, 0.37, b * 1.2]} s=${[0.05, 0.74, 0.05]} c=${COL.grisO} />`)}
    <mesh ref=${bola}><sphereGeometry args=${[0.03, 10, 8]} /><meshBasicMaterial color="#ffffff" /></mesh>
  <//>`;
}

function Billar({ p, r }) {
  const bolas = [];
  for (let i = 0; i < 10; i++) bolas.push(html`<${S} key=${i} m="B" p=${[(i % 4) * 0.08 - 0.12, 0.84, -0.6 + Math.floor(i / 4) * 0.07]} s=${0.06} c=${COLORES_VIVOS[i]} />`);
  return html`<${G} p=${p} r=${r}>
    <${B} m="B" p=${[0, 0.7, 0]} s=${[1.5, 0.18, 2.7]} c="#3b2a1f" />
    <${B} p=${[0, 0.8, 0]} s=${[1.3, 0.02, 2.5]} c="#167a4a" />
    <${B} m="L" p=${[0, 0.6, 1.36]} s=${[1.4, 0.02, 0.02]} c=${COL.violeta} />
    ${[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => html`<${B} key=${i} p=${[a * 0.6, 0.31, b * 1.15]} s=${[0.14, 0.62, 0.14]} c="#3b2a1f" />`)}
    ${bolas}
    <${S} m="B" p=${[0, 0.84, 0.7]} s=${0.06} c="#ffffff" />
    <${C} p=${[0.3, 0.86, 1.2]} r=${[PI / 2 - 0.08, 0, 0.2]} s=${[0.025, 1.4, 0.025]} c="#c89b6d" />
  <//>`;
}

function Recreativa({ p, r, c = COL.violeta }) {
  return html`<${G} p=${p} r=${r}>
    <${B} m="B" p=${[0, 0.9, 0]} s=${[0.7, 1.8, 0.75]} c=${COL.negro} />
    <${B} m="L" p=${[0, 1.35, 0.33]} r=${[-0.2, 0, 0]} s=${[0.56, 0.45, 0.02]} c=${c} />
    <${B} m="B" p=${[0, 0.95, 0.42]} r=${[0.3, 0, 0]} s=${[0.66, 0.06, 0.3]} c=${COL.grisO} />
    <${S} m="L" p=${[-0.15, 1.0, 0.45]} s=${0.06} c="#ef4444" /><${S} m="L" p=${[0.05, 1.0, 0.45]} s=${0.06} c="#fbbf24" /><${S} m="L" p=${[0.18, 1.0, 0.45]} s=${0.06} c=${COL.cian} />
    <${B} m="L" p=${[0, 1.75, 0.3]} s=${[0.66, 0.14, 0.02]} c=${c} />
    <${B} m="L" p=${[-0.36, 0.9, 0]} s=${[0.01, 1.7, 0.6]} c=${c} />
  <//>`;
}

export function SalaJuegos({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h, col = s.color;
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#e7e0f0" borde=${col} />
    <${Frente} w=${w} d=${d} h=${h} puerta=${3.8} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${col} />
    <${PingPong} p=${[-2.4, 0, -1.2]} />
    <${Alumno} p=${[-2.4, 0, -3.05]} ry=${0} pose="pingpong" objeto="raqueta" seed=${970} />
    <${Alumno} p=${[-2.4, 0, 0.65]} ry=${PI} pose="pingpong" objeto="raqueta" seed=${971} />
    <${Billar} p=${[1.2, 0, -2.2]} r=${[0, PI / 2, 0]} />
    <${Alumno} p=${[1.2, 0, -0.95]} ry=${PI} pose="hablando" seed=${972} />
    <${Recreativa} p=${[w / 2 - 0.5, 0, 0.2]} r=${[0, -PI / 2, 0]} c=${COL.violeta} />
    <${Recreativa} p=${[w / 2 - 0.5, 0, 1.1]} r=${[0, -PI / 2, 0]} c=${COL.cian} />
    <${Alumno} p=${[w / 2 - 1.25, 0, 0.2]} ry=${PI / 2} pose="futbolin" seed=${973} />
    <${Pantalla} p=${[-w / 2 + 0.12, 1.6, 2.6]} r=${[0, PI / 2, 0]} w=${2.2} h=${1.24} tex=${texPantalla('juego')} />
    <${Sofa} p=${[-2.4, 0, 2.6]} r=${[0, -PI / 2, 0]} w=${2.2} c=${COL.noche} cojin=${col} />
    <${Alumno} p=${[-2.35, 0, 2.15]} ry=${-PI / 2} pose="jugando" objeto="mando" asiento=${0.44} seed=${974} />
    <${Alumno} p=${[-2.35, 0, 3.05]} ry=${-PI / 2} pose="jugando" objeto="mando" asiento=${0.44} seed=${975} />
    ${[0, 1, 2, 3].map(i => html`<${B} key=${i} m="L" p=${[w / 2 - 0.1, 2.2 + (i % 2) * 0.35, -3.6 + i * 0.6]} r=${[(i % 2 ? 1 : -1) * 0.6, 0, 0]} s=${[0.03, 0.04, 0.75]} c=${i % 2 ? col : COL.cian} />`)}
  <//>`;
}

export function ComunInternado({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h, col = s.color;
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#ebe2d3" borde=${col} />
    <${Frente} w=${w} d=${d} h=${h} puerta=${-3.8} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${col} />
    <${B} p=${[-1.2, 0.02, -1.8]} s=${[4.6, 0.02, 3.4]} c="#3d3a7a" />
    <${Sofa} p=${[-1.2, 0, -0.4]} r=${[0, PI, 0]} w=${3.4} c=${COL.noche} cojin=${col} />
    <${Sofa} p=${[-3.6, 0, -2.0]} r=${[0, PI / 2, 0]} w=${2.4} c=${COL.noche} cojin=${col} />
    <${B} m="B" p=${[-1.2, 0.22, -1.9]} s=${[1.6, 0.44, 0.8]} c=${COL.maderaC} />
    <${Pantalla} p=${[-1.2, 1.7, -d / 2 + 0.25]} w=${2.8} h=${1.58} tex=${texPantalla('pelicula')} />
    <${B} m="B" p=${[-1.2, 0.3, -d / 2 + 0.35]} s=${[3.2, 0.6, 0.45]} c=${COL.blanco} />
    <${Alumno} p=${[-2.1, 0, -0.5]} ry=${PI} pose="sentado" asiento=${0.44} seed=${980} />
    <${Alumno} p=${[-1.1, 0, -0.5]} ry=${PI} pose="charlando" asiento=${0.44} seed=${981} />
    <${Alumno} p=${[-3.5, 0, -2.4]} ry=${PI / 2} pose="sentado" asiento=${0.44} seed=${982} />
    <${G} p=${[w / 2 - 0.4, 0, 0]}>
      <${B} m="B" p=${[0, 0.45, -1.2]} s=${[0.65, 0.9, 3.6]} c=${COL.blanco} />
      <${B} m="B" p=${[0, 0.92, -1.2]} s=${[0.68, 0.04, 3.64]} c="#1f2937" />
      <${B} m="B" p=${[0.1, 2.0, -1.2]} s=${[0.4, 0.7, 3.6]} c=${COL.blanco} />
      <${B} m="L" p=${[-0.12, 1.63, -1.2]} s=${[0.02, 0.02, 3.5]} c=${col} />
      <${B} m="M" p=${[0, 1.0, 1.3]} s=${[0.7, 2.0, 0.75]} c="#cbd5e1" />
      <${B} m="B" p=${[-0.05, 1.06, -2.4]} s=${[0.4, 0.26, 0.5]} c=${COL.negro} />
      <${C} m="M" p=${[-0.05, 1.04, -0.3]} s=${[0.16, 0.2, 0.16]} c=${COL.grisM} />
    <//>
    <${Alumno} p=${[w / 2 - 1.1, 0, -1.4]} ry=${PI / 2} pose="de_pie" seed=${983} />
    <${MesaRedonda} p=${[2.0, 0, 2.2]} d=${1.1} />
    <${C} m="B" p=${[2.0, 0.8, 2.2]} s=${[0.3, 0.08, 0.3]} c="#ffffff" />
    <${S} p=${[1.95, 0.86, 2.2]} s=${0.1} c="#f97316" /><${S} p=${[2.05, 0.86, 2.25]} s=${0.1} c="#ef4444" /><${S} p=${[2.0, 0.88, 2.12]} s=${0.1} c="#84cc16" />
    ${[0, 1, 2, 3].map(j => { const a = j * PI / 2 + 0.6; return html`<${Silla} key=${j} p=${[2.0 + Math.sin(a) * 0.85, 0, 2.2 + Math.cos(a) * 0.85]} r=${[0, a + PI, 0]} c=${col} />`; })}
    <${Alumno} p=${[2.0 + Math.sin(0.6) * 0.85, 0, 2.2 + Math.cos(0.6) * 0.85]} ry=${0.6 + PI} pose="comiendo" seed=${984} />
    <${Alumno} p=${[2.0 + Math.sin(0.6 + PI) * 0.85, 0, 2.2 + Math.cos(0.6 + PI) * 0.85]} ry=${0.6} pose="charlando" seed=${985} />
    <${Planta} p=${[-4.4, 0, 3.6]} s=${1.1} tipo=${2} />
  <//>`;
}

function Lavadora({ p, r, secadora = false }) {
  return html`<${G} p=${p} r=${r}>
    <${B} m="B" p=${[0, 0.43, 0]} s=${[0.6, 0.86, 0.6]} c=${secadora ? '#e8edf5' : COL.blanco} />
    <${Toro} m="M" p=${[0, 0.42, 0.3]} s=${0.42} c=${COL.grisM} />
    <${C} m="L" p=${[0, 0.42, 0.302]} r=${[PI / 2, 0, 0]} s=${[0.34, 0.01, 0.34]} c=${secadora ? '#334155' : '#1e3a8a'} />
    <${B} m="L" p=${[0.15, 0.78, 0.302]} s=${[0.2, 0.05, 0.005]} c=${COL.cian} />
  <//>`;
}

export function Lavanderia({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h, col = s.color;
  const maquinas = [];
  for (let i = 0; i < 6; i++) {
    const z = -3.6 + i * 0.68;
    maquinas.push(html`<${Lavadora} key=${'l' + i} p=${[-w / 2 + 0.45, 0, z]} r=${[0, PI / 2, 0]} />`);
    if (i % 2 === 0) maquinas.push(html`<${Lavadora} key=${'s' + i} p=${[-w / 2 + 0.45, 0.88, z]} r=${[0, PI / 2, 0]} secadora />`);
  }
  const ropa = [];
  const colores = ['#16224f', '#ffffff', '#c9d1dd', '#16224f', '#ffffff', '#3d8bff'];
  for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) ropa.push(html`<${B} key=${i + '-' + j} p=${[0.4 + (i % 3) * 0.5, 0.8 + j * 0.06, -1.2 + Math.floor(i / 3) * 0.6]} s=${[0.4, 0.05, 0.32]} c=${colores[(i + j) % 6]} />`);
  return html`<${G}>
    <${Suelo} w=${w} d=${d} c="#e1e9f2" borde=${col} />
    <${Frente} w=${w} d=${d} h=${h} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${col} />
    ${maquinas}
    <${Mesa} p=${[0.9, 0, -0.9]} w=${1.8} d=${1.3} />
    ${ropa}
    <${Alumno} p=${[-w / 2 + 1.25, 0, -2.2]} ry=${-PI / 2} pose="agachado" seed=${990} />
    <${Alumno} p=${[0.9, 0, 0.05]} ry=${PI} pose="hablando" seed=${991} />
    ${[[2.6, -3.4], [2.6, -2.6], [-1.0, 1.4]].map(([x, z], i) => html`<${G} key=${'c' + i} p=${[x, 0, z]}>
      <${C} p=${[0, 0.22, 0]} s=${[0.5, 0.44, 0.5]} c=${['#3d8bff', '#8b5cf6', '#22d3ee'][i]} />
      <${S} p=${[0, 0.44, 0]} s=${[0.42, 0.14, 0.42]} c=${colores[i + 1]} />
    <//>`)}
    <${G} p=${[2.2, 0, 1.6]} r=${[0, 0.3, 0]}>
      <${B} m="B" p=${[0, 0.85, 0]} s=${[1.3, 0.04, 0.36]} c="#dbeafe" />
      <${B} m="M" p=${[0, 0.42, 0]} r=${[0, 0, 0.5]} s=${[0.03, 0.95, 0.03]} c=${COL.grisM} />
      <${B} m="M" p=${[0, 0.42, 0]} r=${[0, 0, -0.5]} s=${[0.03, 0.95, 0.03]} c=${COL.grisM} />
      <${B} m="M" p=${[0.4, 0.9, 0]} s=${[0.22, 0.08, 0.12]} c=${COL.grisO} />
    <//>
    <${G} p=${[w / 2 - 0.5, 0, -1.0]}>
      ${[0.6, 1.2, 1.8].map((y, i) => html`<${B} key=${i} p=${[0, y, 0]} s=${[0.45, 0.03, 2.4]} c=${COL.blanco} />`)}
      ${[...Array(8)].map((_, i) => html`<${C} key=${'d' + i} m="B" p=${[0, 0.76 + (i % 2) * 0.6, -1.0 + i * 0.28]} s=${[0.14, 0.28, 0.14]} c=${COLORES_VIVOS[i]} />`)}
    <//>
    <${G} p=${[0.8, 0, 2.8]}>
      <${B} m="M" p=${[-0.9, 0.85, 0]} s=${[0.04, 1.7, 0.04]} c=${COL.grisM} /><${B} m="M" p=${[0.9, 0.85, 0]} s=${[0.04, 1.7, 0.04]} c=${COL.grisM} />
      <${B} m="M" p=${[0, 1.7, 0]} s=${[1.84, 0.04, 0.04]} c=${COL.grisM} />
      ${[0, 1, 2, 3].map(i => html`<${B} key=${i} p=${[-0.6 + i * 0.4, 1.35, 0]} s=${[0.34, 0.65, 0.02]} c=${colores[i]} />`)}
    <//>
  <//>`;
}
