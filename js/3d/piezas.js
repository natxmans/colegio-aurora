// =========================================================
// Piezas básicas y muebles reutilizables
// =========================================================
import { html, THREE, useMemo, useRef, useFrame } from '../lib.js';
import { Pieza, Grupo } from './kit.js';

// Paleta del Colegio Pablo Picasso: azul marino, blanco y beige (+ madera y luz cálida)
export const COL = {
  blanco: '#f7f4ee', gris: '#ddd7cc', grisM: '#a7a49c', grisO: '#3a4256', negro: '#1a1d26',
  noche: '#14285a', azul: '#1f4e9a', elec: '#2a62b8', cian: '#f3dfb2', violeta: '#7d8fb8',
  madera: '#b98a5a', maderaC: '#dcc39c', verde: '#5c9a48', verdeO: '#3f7a3c', calido: '#ffd9a0',
  beige: '#e6d6b8', arena: '#d2bc94', piedra: '#cdb894',
};
export const COLORES_VIVOS = ['#2a62b8', '#c9a978', '#14285a', '#b84a55', '#3f8a5a', '#d9a441', '#8a4f8f', '#5b8fd6', '#a77b4f', '#c46a2e'];

// Generador pseudoaleatorio (siempre igual para una misma semilla)
export function azar(semilla) {
  let s = (Math.abs(Math.floor(semilla * 7919 + 17)) % 2147483646) + 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const tipo = (base, m, dyn) => {
  const k = m === 'V' ? 'vidrio' : base + (m || '');
  return dyn ? 'a' + k[0].toUpperCase() + k.slice(1) : k;
};

// B = caja · C = cilindro · S = esfera · m: '' mate, 'B' brillo, 'M' metal, 'L' luz, 'V' vidrio
export const B = ({ m, dyn, ...p }) => html`<${Pieza} t=${tipo('caja', m, dyn)} ...${p} />`;
export const C = ({ m, dyn, ...p }) => html`<${Pieza} t=${tipo('cil', m, dyn)} ...${p} />`;
export const S = ({ m, dyn, ...p }) => html`<${Pieza} t=${tipo('esfera', m, dyn)} ...${p} />`;
export const Cono = ({ dyn, ...p }) => html`<${Pieza} t=${dyn ? 'aCono' : 'cono'} ...${p} />`;
export const Tronco = ({ dyn, ...p }) => html`<${Pieza} t=${dyn ? 'aTronco' : 'tronco'} ...${p} />`;
export const Ico = ({ dyn, ...p }) => html`<${Pieza} t=${dyn ? 'aIco' : 'ico'} ...${p} />`;
export const Toro = ({ m, dyn, ...p }) => html`<${Pieza} t=${tipo('toro', m, dyn)} ...${p} />`;
export const V = ({ c = '#cfe6ff', ...p }) => html`<${Pieza} t="vidrio" c=${c} ...${p} />`;
// Cristal tintado de cubierta (lucernarios): más opaco que V
export const VT = ({ c = '#a9cbe0', ...p }) => html`<${Pieza} t="vidrioT" c=${c} ...${p} />`;
export const G = Grupo;

// Panel con textura (pizarras, pósteres, pantallas)
const cacheMat = new Map();
export function Panel({ p, r, w, h, tex, luz = true, doble = false, transp = false }) {
  const mat = useMemo(() => {
    const k = tex.uuid + (luz ? 'L' : 'S') + (doble ? 'D' : '') + (transp ? 'T' : '');
    const comun = { map: tex, side: doble ? THREE.DoubleSide : THREE.FrontSide, transparent: transp, alphaTest: transp ? 0.04 : 0 };
    if (!cacheMat.has(k)) cacheMat.set(k, luz
      ? new THREE.MeshBasicMaterial({ ...comun, toneMapped: false })
      : new THREE.MeshStandardMaterial({ ...comun, roughness: 0.6 }));
    return cacheMat.get(k);
  }, [tex, luz, doble, transp]);
  return html`<mesh position=${p} rotation=${r || [0, 0, 0]} material=${mat}><planeGeometry args=${[w, h]} /></mesh>`;
}

// ---------------- Muebles ----------------
export function Pupitre({ p, r, ancho = 1.4, c = COL.blanco, led = COL.cian }) {
  return html`<${G} p=${p} r=${r}>
    <${B} m="B" p=${[0, 0.72, 0]} s=${[ancho, 0.04, 0.62]} c=${c} />
    <${B} m="M" p=${[-ancho / 2 + 0.04, 0.36, 0]} s=${[0.04, 0.7, 0.56]} c=${COL.grisO} />
    <${B} m="M" p=${[ancho / 2 - 0.04, 0.36, 0]} s=${[0.04, 0.7, 0.56]} c=${COL.grisO} />
    <${B} p=${[0, 0.5, 0.25]} s=${[ancho - 0.1, 0.3, 0.02]} c=${COL.gris} />
    <${B} m="L" p=${[0, 0.7, 0.315]} s=${[ancho, 0.012, 0.012]} c=${led} />
  <//>`;
}

export function Silla({ p, r, c = COL.elec }) {
  return html`<${G} p=${p} r=${r}>
    <${B} m="B" p=${[0, 0.42, 0]} s=${[0.44, 0.05, 0.42]} c=${c} />
    <${B} m="B" p=${[0, 0.7, -0.21]} r=${[-0.12, 0, 0]} s=${[0.44, 0.42, 0.04]} c=${c} />
    <${C} m="M" p=${[0, 0.21, 0]} s=${[0.05, 0.38, 0.05]} c=${COL.grisO} />
    <${C} m="M" p=${[0, 0.02, 0]} s=${[0.46, 0.03, 0.46]} c=${COL.grisO} />
  <//>`;
}

export function Taburete({ p, c = COL.elec }) {
  return html`<${G} p=${p}>
    <${C} m="B" p=${[0, 0.46, 0]} s=${[0.38, 0.06, 0.38]} c=${c} />
    <${C} m="M" p=${[0, 0.23, 0]} s=${[0.05, 0.44, 0.05]} c=${COL.grisO} />
    <${C} m="M" p=${[0, 0.02, 0]} s=${[0.34, 0.03, 0.34]} c=${COL.grisO} />
  <//>`;
}

export function Portatil({ p, r, pantalla = '#7cc4ff' }) {
  return html`<${G} p=${p} r=${r}>
    <${B} m="M" p=${[0, 0.008, 0]} s=${[0.32, 0.016, 0.22]} c="#b8c0cc" />
    <${G} p=${[0, 0.016, 0.11]} r=${[0.25, 0, 0]}>
      <${B} m="M" p=${[0, 0.105, 0]} s=${[0.32, 0.21, 0.012]} c="#b8c0cc" />
      <${B} m="L" p=${[0, 0.105, -0.008]} s=${[0.29, 0.18, 0.004]} c=${pantalla} />
    <//>
  <//>`;
}

export function Monitor({ p, r, pantalla = '#3d8bff', ancho = 0.55 }) {
  return html`<${G} p=${p} r=${r}>
    <${B} m="M" p=${[0, 0.01, 0.05]} s=${[0.22, 0.02, 0.16]} c=${COL.grisO} />
    <${B} m="M" p=${[0, 0.17, 0.08]} s=${[0.04, 0.32, 0.03]} c=${COL.grisO} />
    <${B} m="B" p=${[0, 0.36, 0.05]} s=${[ancho, ancho * 0.6, 0.03]} c=${COL.negro} />
    <${B} m="L" p=${[0, 0.36, 0.033]} s=${[ancho - 0.04, ancho * 0.6 - 0.04, 0.005]} c=${pantalla} />
    <${B} m="B" p=${[0, 0.01, -0.18]} s=${[0.44, 0.02, 0.14]} c=${COL.grisO} />
    <${B} m="L" p=${[0, 0.022, -0.18]} s=${[0.4, 0.003, 0.1]} c="#4a5a8a" />
  <//>`;
}

export function Cuaderno({ p, r, c = '#3d8bff' }) {
  return html`<${G} p=${p} r=${r}>
    <${B} p=${[0, 0.004, 0]} s=${[0.31, 0.008, 0.22]} c=${c} />
    <${B} p=${[0, 0.011, 0]} s=${[0.29, 0.006, 0.2]} c="#fdfdfb" />
    <${C} p=${[0.1, 0.02, 0.02]} r=${[0, 0.6, Math.PI / 2]} s=${[0.012, 0.14, 0.012]} c=${COL.noche} />
  <//>`;
}

export function Libro({ p, r, c = '#8b5cf6', abierto = false }) {
  if (abierto) return html`<${G} p=${p} r=${r}>
    <${B} p=${[-0.08, 0.01, 0]} r=${[0, 0, 0.06]} s=${[0.16, 0.012, 0.22]} c="#fafaf5" />
    <${B} p=${[0.08, 0.01, 0]} r=${[0, 0, -0.06]} s=${[0.16, 0.012, 0.22]} c="#fafaf5" />
    <${B} p=${[0, 0.002, 0]} s=${[0.34, 0.006, 0.23]} c=${c} />
  <//>`;
  return html`<${B} p=${p} r=${r} s=${[0.16, 0.04, 0.23]} c=${c} />`;
}

export function Planta({ p, s = 1, tipo = 0, maceta = COL.blanco }) {
  const v = ['#3f9d5a', '#2f8f4e', '#5cb86a'];
  return html`<${G} p=${p} s=${s}>
    <${C} m="B" p=${[0, 0.2, 0]} s=${[0.36, 0.4, 0.36]} c=${maceta} />
    <${C} p=${[0, 0.41, 0]} s=${[0.32, 0.02, 0.32]} c="#5b4636" />
    ${tipo === 0 ? html`<${Ico} p=${[0, 0.75, 0]} s=${[0.62, 0.7, 0.62]} c=${v[0]} />` : null}
    ${tipo === 1 ? html`<${Cono} p=${[0, 0.95, 0]} s=${[0.4, 1.1, 0.4]} c=${v[1]} />` : null}
    ${tipo === 2 ? html`<${Ico} p=${[0, 0.62, 0]} s=${0.5} c=${v[2]} /><${Ico} p=${[0.1, 0.92, 0.05]} s=${0.42} c=${v[0]} /><${Ico} p=${[-0.08, 1.15, -0.04]} s=${0.32} c=${v[2]} />` : null}
  <//>`;
}

export function Estanteria({ p, r, w = 1.6, h = 2.2, prof = 0.34, niveles = 5, c = COL.blanco, tex = null, led = COL.cian }) {
  const est = [];
  for (let i = 0; i <= niveles; i++) {
    const y = 0.06 + (i * (h - 0.12)) / niveles;
    est.push(html`<${B} key=${'e' + i} p=${[0, y, 0]} s=${[w, 0.035, prof]} c=${c} />`);
  }
  return html`<${G} p=${p} r=${r}>
    <${B} p=${[-w / 2, h / 2, 0]} s=${[0.04, h, prof]} c=${c} />
    <${B} p=${[w / 2, h / 2, 0]} s=${[0.04, h, prof]} c=${c} />
    <${B} p=${[0, h / 2, -prof / 2 + 0.01]} s=${[w, h, 0.02]} c=${COL.gris} />
    ${est}
    ${tex ? html`<${Panel} p=${[0, h / 2, -prof / 2 + 0.06]} w=${w - 0.06} h=${h - 0.14} tex=${tex} luz=${false} />` : null}
    <${B} m="L" p=${[0, h + 0.005, prof / 2 - 0.02]} s=${[w, 0.012, 0.012]} c=${led} />
  <//>`;
}

export function Sofa({ p, r, w = 2, c = COL.noche, cojin = COL.cian }) {
  return html`<${G} p=${p} r=${r}>
    <${B} p=${[0, 0.22, 0]} s=${[w, 0.44, 0.85]} c=${c} />
    <${B} p=${[0, 0.62, -0.34]} s=${[w, 0.5, 0.2]} c=${c} />
    <${B} p=${[-w / 2 + 0.1, 0.5, 0]} s=${[0.2, 0.3, 0.85]} c=${c} />
    <${B} p=${[w / 2 - 0.1, 0.5, 0]} s=${[0.2, 0.3, 0.85]} c=${c} />
    <${B} p=${[-w / 4, 0.62, -0.18]} r=${[-0.2, 0, 0]} s=${[0.42, 0.36, 0.12]} c=${cojin} />
    <${B} p=${[w / 4, 0.62, -0.18]} r=${[-0.2, 0, 0]} s=${[0.42, 0.36, 0.12]} c="#8b5cf6" />
    <${B} m="L" p=${[0, 0.03, 0.43]} s=${[w - 0.1, 0.02, 0.02]} c=${cojin} />
  <//>`;
}

export function Puf({ p, c = COL.violeta }) {
  return html`<${S} p=${[p[0], 0.24, p[2]]} s=${[0.75, 0.48, 0.75]} c=${c} />`;
}

export function MesaRedonda({ p, d = 1.2, alto = 0.74, c = COL.blanco }) {
  return html`<${G} p=${p}>
    <${C} m="B" p=${[0, alto, 0]} s=${[d, 0.04, d]} c=${c} />
    <${C} m="M" p=${[0, alto / 2, 0]} s=${[0.08, alto, 0.08]} c=${COL.grisO} />
    <${C} m="M" p=${[0, 0.02, 0]} s=${[0.55, 0.03, 0.55]} c=${COL.grisO} />
  <//>`;
}

export function Mesa({ p, r, w = 1.6, d = 0.8, alto = 0.74, c = COL.blanco, pata = COL.grisO }) {
  return html`<${G} p=${p} r=${r}>
    <${B} m="B" p=${[0, alto, 0]} s=${[w, 0.04, d]} c=${c} />
    ${[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => html`<${B} key=${i} m="M" p=${[a * (w / 2 - 0.06), alto / 2, b * (d / 2 - 0.06)]} s=${[0.05, alto, 0.05]} c=${pata} />`)}
  <//>`;
}

export function Lampara({ p, c = COL.calido }) {
  return html`<${G} p=${p}>
    <${C} m="M" p=${[0, 0.015, 0]} s=${[0.14, 0.03, 0.14]} c=${COL.grisO} />
    <${C} m="M" p=${[0, 0.2, 0]} s=${[0.02, 0.38, 0.02]} c=${COL.grisO} />
    <${S} m="L" p=${[0, 0.42, 0]} s=${0.14} c=${c} />
  <//>`;
}

export function Pantalla({ p, r, w = 1.6, h = 0.9, tex = null, c = '#2f6bff' }) {
  return html`<${G} p=${p} r=${r}>
    <${B} m="B" p=${[0, 0, -0.03]} s=${[w + 0.08, h + 0.08, 0.05]} c=${COL.negro} />
    ${tex ? html`<${Panel} p=${[0, 0, 0.001]} w=${w} h=${h} tex=${tex} />` : html`<${B} m="L" p=${[0, 0, 0]} s=${[w, h, 0.005]} c=${c} />`}
  <//>`;
}

export function Cama({ p, r, manta = COL.elec, led = COL.cian }) {
  // Cabecero hacia -z
  return html`<${G} p=${p} r=${r}>
    <${B} m="B" p=${[0, 0.16, 0]} s=${[1.0, 0.32, 2.05]} c=${COL.blanco} />
    <${B} m="L" p=${[0, 0.03, 0]} s=${[0.9, 0.02, 1.9]} c=${led} />
    <${B} p=${[0, 0.41, 0]} s=${[0.92, 0.18, 1.95]} c="#f2f5fa" />
    <${B} p=${[0, 0.52, 0.32]} s=${[0.97, 0.08, 1.36]} c=${manta} />
    <${B} p=${[0, 0.53, -0.97]} s=${[0.97, 0.05, 0.08]} c=${manta} />
    <${B} p=${[0, 0.56, -0.74]} r=${[-0.15, 0, 0]} s=${[0.62, 0.12, 0.34]} c="#ffffff" />
    <${B} m="B" p=${[0, 0.62, -1.06]} s=${[1.04, 0.95, 0.1]} c=${COL.noche} />
    <${B} m="L" p=${[0, 1.1, -1.0]} s=${[1.0, 0.025, 0.02]} c=${led} />
  <//>`;
}

export function Armario({ p, r, w = 1.0, h = 2.2, prof = 0.6, c = COL.blanco, led = COL.cian }) {
  return html`<${G} p=${p} r=${r}>
    <${B} m="B" p=${[0, h / 2, 0]} s=${[w, h, prof]} c=${c} />
    <${B} p=${[0, h / 2, prof / 2 + 0.005]} s=${[0.01, h - 0.1, 0.01]} c=${COL.gris} />
    <${B} m="L" p=${[-0.07, h / 2, prof / 2 + 0.012]} s=${[0.015, 0.5, 0.012]} c=${led} />
    <${B} m="L" p=${[0.07, h / 2, prof / 2 + 0.012]} s=${[0.015, 0.5, 0.012]} c=${led} />
  <//>`;
}

export function Arbol({ p, s = 1, c = '#4f9e5b', tipo = 0 }) {
  if (tipo === 1) return html`<${G} p=${p} s=${s}>
    <${C} p=${[0, 0.6, 0]} s=${[0.22, 1.2, 0.22]} c="#6b4f3a" />
    <${Cono} p=${[0, 3.0, 0]} s=${[1.5, 4.2, 1.5]} c="#2f7d4a" />
  <//>`;
  return html`<${G} p=${p} s=${s}>
    <${Tronco} p=${[0, 1.1, 0]} s=${[0.32, 2.2, 0.32]} c="#7a5a40" />
    <${Ico} p=${[0, 3.1, 0]} s=${[2.8, 2.5, 2.8]} c=${c} />
    <${Ico} p=${[0.55, 3.7, 0.3]} s=${[1.7, 1.5, 1.7]} c=${c} />
    <${Ico} p=${[-0.5, 3.5, -0.35]} s=${[1.6, 1.4, 1.6]} c=${c} />
  <//>`;
}

export function Palmera({ p, s = 1, gira = 0 }) {
  const hojas = [];
  for (let i = 0; i < 7; i++) {
    const a = gira + (i / 7) * Math.PI * 2;
    hojas.push(html`<${G} key=${i} p=${[0, 6.1, 0]} r=${[0, a, 0]}>
      <${B} p=${[0, -0.25, 1.15]} r=${[0.45, 0, 0]} s=${[0.5, 0.05, 2.4]} c=${i % 2 ? '#3f8f4a' : '#4ea55a'} />
    <//>`);
  }
  return html`<${G} p=${p} s=${s}>
    <${Tronco} p=${[0, 1.5, 0]} s=${[0.42, 3, 0.42]} c="#9c7b55" />
    <${Tronco} p=${[0.1, 4.4, 0]} r=${[0, 0, -0.05]} s=${[0.32, 3.2, 0.32]} c="#a88560" />
    <${S} p=${[0.18, 6.05, 0]} s=${0.55} c="#7a5a3b" />
    ${hojas}
  <//>`;
}

export function Banco({ p, r, w = 1.8, c = COL.madera }) {
  return html`<${G} p=${p} r=${r}>
    <${B} p=${[0, 0.45, 0]} s=${[w, 0.06, 0.48]} c=${c} />
    <${B} p=${[0, 0.72, -0.22]} r=${[-0.15, 0, 0]} s=${[w, 0.36, 0.05]} c=${c} />
    <${B} m="B" p=${[-w / 2 + 0.15, 0.22, 0]} s=${[0.08, 0.44, 0.44]} c=${COL.blanco} />
    <${B} m="B" p=${[w / 2 - 0.15, 0.22, 0]} s=${[0.08, 0.44, 0.44]} c=${COL.blanco} />
    <${B} m="L" p=${[0, 0.41, 0.2]} s=${[w - 0.3, 0.015, 0.015]} c=${COL.cian} />
  <//>`;
}

export function Farola({ p, h = 4.2 }) {
  return html`<${G} p=${p}>
    <${C} m="M" p=${[0, h / 2, 0]} s=${[0.12, h, 0.12]} c=${COL.grisO} />
    <${B} m="B" p=${[0.35, h, 0]} s=${[0.9, 0.08, 0.22]} c=${COL.blanco} />
    <${B} m="L" p=${[0.4, h - 0.05, 0]} s=${[0.7, 0.03, 0.14]} c="#e9f6ff" />
    <${C} m="L" p=${[0, 0.6, 0]} s=${[0.14, 0.4, 0.14]} c=${COL.cian} />
  <//>`;
}

// Pared de cristal del pasillo con puerta (coordenadas canónicas de la sala)
export function Frente({ w, d, h, puerta = null, macizo = null, c = COL.blanco }) {
  const z = d / 2;
  const pz = puerta ?? w / 2 - 1.2;
  const huecos = [[pz - 0.55, pz + 0.55]];
  if (macizo) huecos.push(macizo);
  huecos.sort((a, b) => a[0] - b[0]);
  const tramos = [];
  let x = -w / 2 + 0.1;
  for (const [a, b] of huecos) { if (a > x + 0.05) tramos.push([x, a]); x = Math.max(x, b); }
  if (w / 2 - 0.1 > x + 0.05) tramos.push([x, w / 2 - 0.1]);
  return html`<${G}>
    ${tramos.map(([a, b], i) => html`<${V} key=${'v' + i} p=${[(a + b) / 2, h / 2, z]} s=${[b - a, h - 0.1, 0.05]} />`)}
    ${tramos.map(([a, b], i) => html`<${B} key=${'m' + i} m="M" p=${[(a + b) / 2, 1.05, z]} s=${[b - a, 0.04, 0.07]} c=${COL.grisO} />`)}
    ${macizo ? html`<${B} p=${[(macizo[0] + macizo[1]) / 2, h / 2, z]} s=${[macizo[1] - macizo[0], h, 0.16]} c=${c} />` : null}
    <${B} m="M" p=${[pz - 0.58, h / 2, z]} s=${[0.07, h, 0.12]} c=${COL.grisO} />
    <${B} m="M" p=${[pz + 0.58, h / 2, z]} s=${[0.07, h, 0.12]} c=${COL.grisO} />
    <${B} m="M" p=${[pz, 2.25, z]} s=${[1.2, 0.08, 0.12]} c=${COL.grisO} />
    <${V} p=${[pz + 0.95, 1.1, z + 0.06]} s=${[1.05, 2.15, 0.04]} c="#d8ecff" />
    <${B} m="L" p=${[pz, 2.32, z + 0.07]} s=${[1.1, 0.03, 0.02]} c=${COL.cian} />
    <${B} m="M" p=${[0, h - 0.04, z]} s=${[w - 0.2, 0.08, 0.1]} c=${COL.grisO} />
  <//>`;
}

// Tiras LED en lo alto de las paredes (vista desde arriba = contorno luminoso)
export function TirasLed({ w, d, h, c = COL.cian }) {
  return html`<${G}>
    <${B} m="L" p=${[-w / 2 + 0.14, h - 0.06, 0]} s=${[0.03, 0.03, d - 0.4]} c=${c} />
    <${B} m="L" p=${[w / 2 - 0.14, h - 0.06, 0]} s=${[0.03, 0.03, d - 0.4]} c=${c} />
  <//>`;
}

export function Suelo({ w, d, c = '#e6eaf0', borde = null }) {
  return html`<${G}>
    <${B} p=${[0, 0.015, 0]} s=${[w - 0.18, 0.03, d - 0.12]} c=${c} />
    ${borde ? html`<${B} m="L" p=${[0, 0.032, d / 2 - 0.4]} s=${[w - 0.6, 0.006, 0.05]} c=${borde} />` : null}
  <//>`;
}

// Objeto que gira (escultura, átomo, globo...)
export function Gira({ p, vel = 0.5, eje = 'y', children }) {
  const ref = useRef();
  useFrame((_, dt) => { if (ref.current) ref.current.rotation[eje] += dt * vel; });
  return html`<group ref=${ref} position=${p}>${children}</group>`;
}
