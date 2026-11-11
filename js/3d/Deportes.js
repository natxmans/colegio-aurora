// =========================================================
// COMPLEJO DEPORTIVO: gimnasio, fitness, vestuarios, piscina,
// campo de fútbol con pista de atletismo, baloncesto y pádel
// =========================================================
import { html, THREE, useMemo, useRef, useFrame, useLayoutEffect } from '../lib.js';
import { B, C, S, Cono, Ico, Toro, V, G, Panel, COL, COLORES_VIVOS, Banco, Farola, Pantalla, Planta } from './piezas.js';
import { tocar } from './kit.js';
import { leer } from '../estado.js';
import { Alumno } from './Alumno.js';
import { Zonas } from './Interaccion.js';
import { texPistaGym, texPistaBasket, texPadel, texCampoFutbol, texPiscinaFondo, texPantalla, texCartel, texRotulo } from './texturas.js';

const PI = Math.PI;

// Techo que se levanta y desaparece (botón "Techo" o al visitar el edificio)
function TechoMovil({ y, ids, children }) {
  const ref = useRef();
  const e = useRef({ o: 0 });
  useLayoutEffect(() => { ref.current.updateMatrix(); tocar(); }, []);
  useFrame((_, dt) => {
    const s = leer();
    const oculto = !s.techo || ids.includes(s.sel);
    const obj = oculto ? 22 : 0;
    const g = ref.current; let cambio = false;
    if (Math.abs(obj - e.current.o) > 0.003) {
      e.current.o += (obj - e.current.o) * (1 - Math.exp(-Math.min(dt, 0.05) * 3.4));
      if (Math.abs(obj - e.current.o) < 0.003) e.current.o = obj;
      g.position.y = y + e.current.o; g.updateMatrix(); cambio = true;
    }
    const vis = !(oculto && Math.abs(obj - e.current.o) < 0.8);
    if (g.visible !== vis) { g.visible = vis; cambio = true; }
    if (cambio) tocar();
  });
  return html`<group ref=${ref} position=${[0, y, 0]} matrixAutoUpdate=${false}>${children}</group>`;
}

function Suelo({ p, w, d, tex, y = 0.06 }) {
  return html`<${Panel} p=${[p[0], y, p[1]]} r=${[-PI / 2, 0, 0]} w=${w} h=${d} tex=${tex} luz=${false} />`;
}

function Canasta({ p, lado }) {
  // lado: 1 = tablero mirando a +x
  return html`<${G} p=${p} r=${[0, lado > 0 ? 0 : PI, 0]}>
    <${C} m="M" p=${[-1.2, 1.6, 0]} s=${[0.16, 3.2, 0.16]} c=${COL.grisO} />
    <${B} m="M" p=${[-0.6, 3.25, 0]} s=${[1.2, 0.1, 0.1]} c=${COL.grisO} />
    <${V} p=${[0, 3.35, 0]} s=${[0.05, 1.05, 1.8]} c="#ffffff" />
    <${B} m="L" p=${[0.03, 3.1, 0]} s=${[0.01, 0.45, 0.6]} c="#ffffff" />
    <${Toro} m="M" p=${[0.3, 3.05, 0]} r=${[PI / 2, 0, 0]} s=${[0.46, 0.46, 0.4]} c="#f97316" />
    <${Cono} p=${[0.3, 2.85, 0]} r=${[PI, 0, 0]} s=${[0.42, 0.4, 0.42]} c="#f1f5f9" />
  <//>`;
}

function Balon({ c = '#f97316', radio = 0.12, mover }) {
  const ref = useRef();
  useFrame(({ clock }) => { if (ref.current) mover(ref.current.position, clock.elapsedTime); });
  return html`<mesh ref=${ref} castShadow><sphereGeometry args=${[radio, 16, 12]} /><meshStandardMaterial color=${c} roughness=${0.5} /></mesh>`;
}

function Gradas({ p, r, largo = 26, filas = 4, publico = 0, seed = 1 }) {
  const items = [];
  for (let i = 0; i < filas; i++) {
    const y = 0.45 * (i + 1), z = -i * 0.95;
    items.push(html`<${B} key=${'g' + i} p=${[0, y / 2, z]} s=${[largo, y, 0.95]} c=${i % 2 ? '#dfe5ee' : '#cfd6e0'} />`);
    items.push(html`<${B} key=${'l' + i} m="L" p=${[0, y - 0.02, z + 0.48]} s=${[largo, 0.02, 0.02]} c=${COL.cian} />`);
    const n = Math.floor(largo / 0.62);
    for (let k = 0; k < n; k++) items.push(html`<${B} key=${'s' + i + '-' + k} m="B" p=${[-largo / 2 + 0.31 + k * 0.62, y + 0.06, z - 0.05]} s=${[0.48, 0.1, 0.42]} c=${['#2f6bff', '#22d3ee', '#8b5cf6'][(i + k) % 3]} />`);
  }
  for (let j = 0; j < publico; j++) {
    const i = j % filas, k = (j * 7) % Math.floor(largo / 0.62);
    items.push(html`<${Alumno} key=${'a' + j} p=${[-largo / 2 + 0.31 + k * 0.62, 0, -i * 0.95]} pose=${j % 3 ? 'aplaudiendo' : 'sentado'} asiento=${0.45 * (i + 1) + 0.1} seed=${seed + j * 13} />`);
  }
  return html`<${G} p=${p} r=${r}>${items}<//>`;
}

// ---------------- GIMNASIO ----------------
function Gimnasio() {
  const cx = 62, R = 25.5, yc = 9.6 + 3 - R;
  const segs = [];
  for (let i = 0; i < 12; i++) {
    const a = -0.49 + (i + 0.5) * (0.98 / 12);
    const props = { p: [cx, yc + R * Math.cos(a), R * Math.sin(a)], r: [a, 0, 0], s: [33, 0.3, 2.2] };
    segs.push(i % 3 === 1 ? html`<${V} key=${i} ...${props} c="#cfe9ff" />` : html`<${B} key=${i} m="B" ...${props} c=${COL.blanco} />`);
  }
  const columnas = [];
  for (let x = 46; x <= 78.01; x += 4) for (const z of [-12, 12]) columnas.push(html`<${B} key=${'c' + x + z} m="M" p=${[x, 4.8, z]} s=${[0.3, 9.6, 0.3]} c=${COL.grisO} />`);
  return html`<${G}>
    <${B} p=${[cx, 0.05, 0]} s=${[32, 0.1, 24]} c="#c99a62" />
    <${Suelo} p=${[cx, 1.5]} w=${28} d=${17.5} tex=${texPistaGym()} y=${0.11} />
    <${V} p=${[cx, 1.9, -12]} s=${[32, 3.8, 0.08]} /><${V} p=${[cx, 1.9, 12]} s=${[32, 3.8, 0.08]} />
    <${V} p=${[46, 1.9, 0]} s=${[0.08, 3.8, 24]} /><${V} p=${[78, 1.9, 0]} s=${[0.08, 3.8, 24]} />
    <${B} m="B" p=${[cx, 6.7, -12]} s=${[32, 5.8, 0.3]} c=${COL.blanco} />
    <${B} m="B" p=${[cx, 6.7, 12]} s=${[32, 5.8, 0.3]} c=${COL.blanco} />
    <${B} m="B" p=${[46, 6.7, 0]} s=${[0.3, 5.8, 24]} c=${COL.blanco} />
    <${B} m="B" p=${[78, 6.7, 0]} s=${[0.3, 5.8, 24]} c=${COL.blanco} />
    <${B} m="L" p=${[cx, 3.85, 12.17]} s=${[32, 0.06, 0.04]} c=${COL.cian} />
    <${B} m="L" p=${[cx, 3.85, -12.17]} s=${[32, 0.06, 0.04]} c=${COL.cian} />
    ${columnas}
    <${Panel} p=${[cx, 6.6, 12.17]} w=${9} h=${2.25} transp tex=${texRotulo('GIMNASIO', 'Complejo deportivo Aurora', '#38bdf8')} />
    <${Canasta} p=${[cx - 14.2, 0, 1.5]} lado=${1} />
    <${Canasta} p=${[cx + 14.2, 0, 1.5]} lado=${-1} />
    <${C} m="M" p=${[cx, 1.25, -4.5]} s=${[0.1, 2.5, 0.1]} c=${COL.grisO} />
    <${C} m="M" p=${[cx, 1.25, 7.5]} s=${[0.1, 2.5, 0.1]} c=${COL.grisO} />
    <${V} p=${[cx, 2.0, 1.5]} s=${[0.03, 1.0, 12]} c="#ffffff" />
    <${B} m="L" p=${[cx, 2.5, 1.5]} s=${[0.04, 0.05, 12]} c="#ffffff" />
    <${Gradas} p=${[cx, 0.1, -7.6]} largo=${26} filas=${4} publico=${10} seed=${1500} />
    <${Pantalla} p=${[46.25, 6.4, 1.5]} r=${[0, PI / 2, 0]} w=${5} h=${2.8} tex=${texPantalla('marcador')} />
    ${[[-4, -2], [-3.5, 5], [-8, 2], [4, -1], [3.5, 5.5], [8, 2.5]].map(([dx, dz], i) => html`<${Alumno} key=${'v' + i} p=${[cx + dx, 0.1, 1.5 + dz]}
      ry=${dx < 0 ? PI / 2 : -PI / 2} pose=${i % 3 === 0 ? 'saltando' : 'portero'} deporte=${dx < 0 ? true : '#8b5cf6'} seed=${1600 + i}
      ruta=${i % 3 === 0 ? null : { tipo: 'vaiven', c: [cx + dx, 1.5 + dz], ax: 0.8, az: 1.2, w1: 0.9 + i * 0.1, w2: 0.7 }} />`)}
    <${Balon} c="#fbbf24" radio=${0.11} mover=${(p, t) => p.set(cx + Math.sin(t * 1.1) * 5, 3.0 + Math.abs(Math.sin(t * 2.2)) * 2, 1.5 + Math.sin(t * 0.8) * 3)} />
    <${Alumno} p=${[cx + 11.5, 0.1, 2]} ry=${PI / 2} pose="saltando" deporte seed=${1650} />
    <${TechoMovil} y=${0} ids=${['gimnasio']}>
      ${segs}
      <${B} m="L" p=${[cx, 9.62, -12.1]} s=${[33, 0.06, 0.06]} c=${COL.cian} />
      <${B} m="L" p=${[cx, 9.62, 12.1]} s=${[33, 0.06, 0.06]} c=${COL.cian} />
    <//>
  <//>`;
}

// ---------------- FITNESS + VESTUARIOS ----------------
function Cinta({ p, r }) {
  return html`<${G} p=${p} r=${r}>
    <${B} m="B" p=${[0, 0.12, 0]} s=${[0.85, 0.24, 2.0]} c=${COL.negro} />
    <${B} p=${[0, 0.25, 0.05]} s=${[0.62, 0.02, 1.7]} c="#1f2937" />
    <${B} m="M" p=${[-0.38, 0.75, 0.85]} s=${[0.05, 1.1, 0.05]} c=${COL.grisM} /><${B} m="M" p=${[0.38, 0.75, 0.85]} s=${[0.05, 1.1, 0.05]} c=${COL.grisM} />
    <${B} m="B" p=${[0, 1.3, 0.9]} r=${[-0.5, 0, 0]} s=${[0.8, 0.08, 0.32]} c=${COL.negro} />
    <${B} m="L" p=${[0, 1.35, 0.88]} r=${[-0.5, 0, 0]} s=${[0.5, 0.01, 0.2]} c=${COL.cian} />
  <//>`;
}
function Bici({ p, r }) {
  return html`<${G} p=${p} r=${r}>
    <${B} m="B" p=${[0, 0.05, 0]} s=${[0.5, 0.1, 1.1]} c=${COL.negro} />
    <${B} m="B" p=${[0, 0.45, 0.25]} r=${[0.4, 0, 0]} s=${[0.12, 0.8, 0.12]} c=${COL.violeta} />
    <${B} m="B" p=${[0, 0.45, -0.25]} r=${[-0.2, 0, 0]} s=${[0.1, 0.7, 0.1]} c=${COL.violeta} />
    <${B} m="B" p=${[0, 0.8, -0.3]} s=${[0.26, 0.08, 0.32]} c=${COL.negro} />
    <${B} m="M" p=${[0, 1.05, 0.45]} s=${[0.5, 0.05, 0.05]} c=${COL.grisM} />
    <${C} m="L" p=${[0, 0.35, 0.05]} r=${[0, 0, PI / 2]} s=${[0.4, 0.06, 0.4]} c=${COL.cian} />
  <//>`;
}

function FitnessVestuarios() {
  const cx = 88;
  const taquillas = [];
  for (let i = 0; i < 10; i++) taquillas.push(html`<${G} key=${i} p=${[95.6, 0, 1.0 + i * 0.55]}>
    <${B} m="B" p=${[0, 1.0, 0]} s=${[0.5, 2.0, 0.52]} c=${i % 2 ? '#2f6bff' : '#1e3a8a'} />
    <${B} m="L" p=${[-0.26, 1.2, 0]} s=${[0.01, 0.3, 0.03]} c=${COL.cian} />
  <//>`);
  const duchas = [];
  for (let i = 0; i < 4; i++) duchas.push(html`<${G} key=${i} p=${[81.5 + i * 2, 0, 10.6]}>
    <${B} p=${[0, 0.05, 0]} s=${[1.8, 0.06, 1.6]} c="#dbe8f4" />
    <${V} p=${[0.95, 1.05, 0]} s=${[0.03, 2.0, 1.6]} />
    <${C} m="M" p=${[0, 2.2, 0.6]} s=${[0.25, 0.04, 0.25]} c=${COL.grisM} />
    <${B} m="L" p=${[0, 2.17, 0.6]} s=${[0.18, 0.01, 0.18]} c=${COL.cian} />
  <//>`);
  return html`<${G}>
    <${B} p=${[cx, 0.05, 0]} s=${[16, 0.1, 24]} c="#dfe6ef" />
    <${B} p=${[cx, 0.11, -6]} s=${[15.6, 0.02, 11.6]} c="#2b3352" />
    <${V} p=${[cx, 1.6, -12]} s=${[16, 3.2, 0.08]} /><${V} p=${[cx, 1.6, 12]} s=${[16, 3.2, 0.08]} />
    <${V} p=${[96, 1.6, 0]} s=${[0.08, 3.2, 24]} />
    <${B} p=${[80, 1.6, 0]} s=${[0.25, 3.2, 24]} c=${COL.blanco} />
    <${B} p=${[cx, 1.6, 0]} s=${[16, 3.2, 0.18]} c=${COL.blanco} />
    <${B} m="B" p=${[cx, 4.1, 0]} s=${[16.3, 1.8, 24.3]} c=${COL.blanco} />
    <${B} m="L" p=${[cx, 3.25, 12.18]} s=${[16, 0.05, 0.04]} c="#a78bfa" />
    <${B} m="L" p=${[cx, 3.25, -12.18]} s=${[16, 0.05, 0.04]} c="#a78bfa" />
    <${Panel} p=${[cx, 4.2, 12.17]} w=${6} h=${1.5} transp tex=${texRotulo('FITNESS', 'Vestuarios y duchas', '#a78bfa')} />
    <${B} m="M" p=${[80.2, 1.4, -6]} s=${[0.04, 2.2, 10]} c="#e2ecf7" />
    ${[0, 1, 2, 3].map(i => html`<${Cinta} key=${'c' + i} p=${[82.5 + i * 2.6, 0.1, -10.2]} r=${[0, PI, 0]} />`)}
    <${Alumno} p=${[82.5, 0.36, -10.3]} ry=${PI} pose="cinta" deporte seed=${1700} />
    <${Alumno} p=${[87.7, 0.36, -10.3]} ry=${PI} pose="cinta" deporte="#8b5cf6" seed=${1701} />
    ${[0, 1, 2].map(i => html`<${Bici} key=${'b' + i} p=${[83 + i * 2.4, 0.1, -6.6]} r=${[0, PI, 0]} />`)}
    <${Alumno} p=${[83, 0.1, -6.3]} ry=${PI} pose="pedaleando" asiento=${0.82} deporte seed=${1702} />
    <${Alumno} p=${[87.8, 0.1, -6.3]} ry=${PI} pose="pedaleando" asiento=${0.82} deporte="#22d3ee" seed=${1703} />
    <${G} p=${[94.4, 0.1, -4.5]}>
      <${B} m="M" p=${[0, 0.5, 0]} s=${[0.6, 1.0, 2.4]} c=${COL.grisO} />
      ${[...Array(6)].map((_, i) => html`<${C} key=${i} m="M" p=${[0, 1.05, -1.0 + i * 0.4]} r=${[0, 0, PI / 2]} s=${[0.16, 0.4, 0.16]} c=${COL.negro} />`)}
    <//>
    <${Alumno} p=${[92.8, 0.1, -3.5]} ry=${PI / 2} pose="pesas" objeto="pesas" deporte seed=${1704} />
    <${B} p=${[92, 0.13, -8.6]} s=${[1.0, 0.03, 2]} c=${COL.violeta} /><${B} p=${[93.4, 0.13, -8.6]} s=${[1.0, 0.03, 2]} c=${COL.cian} />
    <${Alumno} p=${[92, 0.14, -9.2]} pose="sentado_suelo" deporte="#22d3ee" seed=${1705} />
    ${taquillas}
    <${Banco} p=${[88, 0.1, 3.5]} r=${[0, PI / 2, 0]} w=${3} />
    <${Banco} p=${[86, 0.1, 3.5]} r=${[0, -PI / 2, 0]} w=${3} />
    <${Alumno} p=${[88.2, 0.1, 3.0]} ry=${-PI / 2} pose="sentado" asiento=${0.45} deporte seed=${1706} />
    <${Alumno} p=${[94.2, 0.1, 4.5]} ry=${PI / 2} pose="de_pie" seed=${1707} />
    ${duchas}
    <${G} p=${[80.4, 0.1, 6]}>
      <${B} m="B" p=${[0.3, 0.85, 0]} s=${[0.5, 0.1, 3]} c=${COL.blanco} />
      <${B} m="M" p=${[0.05, 1.7, 0]} s=${[0.03, 1.0, 3]} c="#dbe7f5" />
      <${B} m="L" p=${[0.07, 2.25, 0]} s=${[0.02, 0.03, 2.9]} c=${COL.cian} />
    <//>
    <${TechoMovil} y=${0} ids=${['fitness', 'vestuarios']}>
      <${B} m="B" p=${[cx, 5.2, 0]} s=${[16.8, 0.4, 24.8]} c=${COL.blanco} />
      <${B} m="L" p=${[cx, 5.0, 12.42]} s=${[16.8, 0.05, 0.04]} c="#a78bfa" />
      <${B} m="L" p=${[cx, 5.0, -12.42]} s=${[16.8, 0.05, 0.04]} c="#a78bfa" />
      ${[-5, 0, 5].map(z => html`<${V} key=${z} p=${[cx, 5.45, z * 2]} s=${[12, 0.12, 2.5]} />`)}
    <//>
  <//>`;
}

// ---------------- PISCINA ----------------
function Agua({ p, w, d }) {
  const ref = useRef();
  useFrame(({ clock }) => { if (ref.current) ref.current.material.opacity = 0.55 + Math.sin(clock.elapsedTime * 1.3) * 0.04; });
  return html`<mesh ref=${ref} position=${p} rotation=${[-PI / 2, 0, 0]} renderOrder=${3}>
    <planeGeometry args=${[w, d]} />
    <meshStandardMaterial color="#0284c7" transparent opacity=${0.55} roughness=${0.05} metalness=${0.25} depthWrite=${false} envMapIntensity=${1.5} />
  </mesh>`;
}

function Piscina() {
  const cx = 63, cz = 32, w = 25, d = 12.5;
  const x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2;
  const cuerdas = [];
  for (let i = 1; i < 5; i++) {
    const z = z0 + i * 2.5;
    cuerdas.push(html`<${C} key=${'a' + i} p=${[cx - 6.25, 0.04, z]} r=${[0, 0, PI / 2]} s=${[0.09, 12.5, 0.09]} c=${i % 2 ? '#ef4444' : '#fbbf24'} />`);
    cuerdas.push(html`<${C} key=${'b' + i} p=${[cx + 6.25, 0.04, z]} r=${[0, 0, PI / 2]} s=${[0.09, 12.5, 0.09]} c="#ffffff" />`);
  }
  const tumbonas = [];
  for (let i = 0; i < 6; i++) {
    const x = 50 + i * 2.6;
    tumbonas.push(html`<${G} key=${'t' + i} p=${[x, 0.2, 41.2]}>
      <${B} m="B" p=${[0, 0.3, 0.2]} s=${[0.7, 0.1, 1.4]} c=${COL.blanco} />
      <${B} m="B" p=${[0, 0.55, -0.7]} r=${[-0.7, 0, 0]} s=${[0.7, 0.1, 0.8]} c=${COL.blanco} />
      <${B} p=${[0, 0.37, 0.1]} s=${[0.62, 0.05, 1.5]} c=${i % 2 ? COL.cian : COL.elec} />
      <${B} m="M" p=${[0, 0.13, 0.6]} s=${[0.6, 0.26, 0.05]} c=${COL.grisM} /><${B} m="M" p=${[0, 0.13, -0.3]} s=${[0.6, 0.26, 0.05]} c=${COL.grisM} />
    <//>`);
    if (i % 2 === 0) tumbonas.push(html`<${G} key=${'s' + i} p=${[x + 1.3, 0.2, 41.0]}>
      <${C} m="M" p=${[0, 1.2, 0]} s=${[0.06, 2.4, 0.06]} c=${COL.grisM} />
      <${Cono} p=${[0, 2.45, 0]} s=${[2.6, 0.55, 2.6]} c=${i % 4 ? '#22d3ee' : '#ffffff'} />
    <//>`);
  }
  return html`<${G}>
    <${B} p=${[63, 0.1, 22.9]} s=${[34, 0.2, 5.8]} c="#e8eef5" />
    <${B} p=${[63, 0.1, 41.1]} s=${[34, 0.2, 5.8]} c="#e8eef5" />
    <${B} p=${[48.25, 0.1, 32]} s=${[4.5, 0.2, 12.5]} c="#e8eef5" />
    <${B} p=${[77.75, 0.1, 32]} s=${[4.5, 0.2, 12.5]} c="#e8eef5" />
    <${B} m="L" p=${[cx, 0.21, z0 - 0.08]} s=${[w + 0.3, 0.02, 0.06]} c=${COL.cian} />
    <${B} m="L" p=${[cx, 0.21, z1 + 0.08]} s=${[w + 0.3, 0.02, 0.06]} c=${COL.cian} />
    <${B} m="L" p=${[x0 - 0.08, 0.21, cz]} s=${[0.06, 0.02, d + 0.3]} c=${COL.cian} />
    <${B} m="L" p=${[x1 + 0.08, 0.21, cz]} s=${[0.06, 0.02, d + 0.3]} c=${COL.cian} />
    <${Suelo} p=${[cx, cz]} w=${w} d=${d} tex=${texPiscinaFondo()} y=${-1.6} />
    <${B} p=${[cx, -0.7, z0 - 0.05]} s=${[w, 1.8, 0.1]} c="#7fd7f5" /><${B} p=${[cx, -0.7, z1 + 0.05]} s=${[w, 1.8, 0.1]} c="#7fd7f5" />
    <${B} p=${[x0 - 0.05, -0.7, cz]} s=${[0.1, 1.8, d]} c="#7fd7f5" /><${B} p=${[x1 + 0.05, -0.7, cz]} s=${[0.1, 1.8, d]} c="#7fd7f5" />
    <${Agua} p=${[cx, 0.02, cz]} w=${w} d=${d} />
    ${cuerdas}
    ${[0, 1, 2, 3, 4].map(i => html`<${G} key=${'p' + i} p=${[x0 - 0.5, 0.2, z0 + 1.25 + i * 2.5]}>
      <${B} m="B" p=${[0, 0.35, 0]} s=${[0.6, 0.7, 0.55]} c=${COL.blanco} />
      <${B} m="L" p=${[0.31, 0.45, 0]} s=${[0.01, 0.2, 0.2]} c=${COL.cian} />
    <//>`)}
    ${[0, 1, 2, 3].map(i => html`<${Alumno} key=${'n' + i} p=${[0, -0.08, 0]} pose="nadando" banador seed=${1800 + i}
      velocidad=${0.8 + i * 0.12} ruta=${{ tipo: 'linea', a: [x0 + 1.5, z0 + 1.25 + i * 2.5 + (i > 1 ? 2.5 : 0)], b: [x1 - 1.5, z0 + 1.25 + i * 2.5 + (i > 1 ? 2.5 : 0)], vel: 1.1 }} />`)}
    ${tumbonas}
    <${Alumno} p=${[50, 0.68, 41.7]} pose="tumbado" banador seed=${1810} />
    <${Alumno} p=${[55.2, 0.68, 41.7]} pose="tumbado" banador seed=${1811} />
    <${Alumno} p=${[60.4, 0.2, 39.6]} ry=${PI} pose="hablando" banador seed=${1812} />
    <${G} p=${[x1 + 1.6, 0.2, cz]}>
      ${[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => html`<${B} key=${i} m="B" p=${[a * 0.35, 0.9, b * 0.35]} s=${[0.07, 1.8, 0.07]} c=${COL.blanco} />`)}
      <${B} m="B" p=${[0, 1.8, 0]} s=${[0.8, 0.08, 0.8]} c=${COL.blanco} />
      <${B} m="B" p=${[0.3, 2.15, 0]} s=${[0.08, 0.6, 0.8]} c="#ef4444" />
    <//>
    <${Alumno} p=${[x1 + 1.6, 0.2, cz]} ry=${-PI / 2} pose="sentado" asiento=${1.84} adulto ropa=${{ sudadera: '#ef4444', ribete: '#ef4444' }} seed=${1813} />
    <${G}>
      <${B} m="B" p=${[63, 3.4, 22.6]} s=${[30, 0.18, 4.2]} c=${COL.blanco} />
      <${B} m="L" p=${[63, 3.3, 22.6]} s=${[29, 0.02, 3.8]} c="#cfe9ff" />
      ${[50, 58, 68, 76].map(x => html`<${B} key=${x} m="M" p=${[x, 1.8, 24.4]} s=${[0.16, 3.2, 0.16]} c=${COL.grisO} />`)}
    <//>
    <${V} p=${[63, 0.75, 19.9]} s=${[34, 1.1, 0.04]} /><${V} p=${[63, 0.75, 44.1]} s=${[34, 1.1, 0.04]} />
    <${V} p=${[45.9, 0.75, 32]} s=${[0.04, 1.1, 24.2]} /><${V} p=${[80.1, 0.75, 32]} s=${[0.04, 1.1, 24.2]} />
    <${Panel} p=${[63, 4.0, 20.6]} w=${6} h=${1.5} transp doble tex=${texRotulo('PISCINA', '25 metros', '#0ea5e9')} />
  <//>`;
}

// ---------------- CAMPO DE FÚTBOL + PISTA DE ATLETISMO ----------------
function rectRedondo(hx, hz, r) {
  const s = new THREE.Shape();
  s.moveTo(-hx + r, -hz); s.lineTo(hx - r, -hz); s.absarc(hx - r, -hz + r, r, -PI / 2, 0, false);
  s.lineTo(hx, hz - r); s.absarc(hx - r, hz - r, r, 0, PI / 2, false);
  s.lineTo(-hx + r, hz); s.absarc(-hx + r, hz - r, r, PI / 2, PI, false);
  s.lineTo(-hx, -hz + r); s.absarc(-hx + r, -hz + r, r, PI, PI * 1.5, false);
  return s;
}
function anillo(hx, hz, r, ancho) {
  const s = rectRedondo(hx + ancho / 2, hz + ancho / 2, r + ancho / 2);
  s.holes.push(rectRedondo(hx - ancho / 2, hz - ancho / 2, Math.max(0.1, r - ancho / 2)));
  return new THREE.ShapeGeometry(s, 24);
}

function Pista({ c }) {
  const geos = useMemo(() => {
    const pista = anillo(37.6, 24.6, 11.6, 7.2);
    const lineas = [];
    for (let i = 0; i <= 6; i++) lineas.push(anillo(34 + i * 1.2, 21 + i * 1.2, 8 + i * 1.2, 0.07));
    return { pista, lineas };
  }, []);
  return html`<group position=${[c[0], 0.05, c[1]]} rotation=${[-PI / 2, 0, 0]}>
    <mesh geometry=${geos.pista} receiveShadow><meshStandardMaterial color="#c4553d" roughness=${0.9} /></mesh>
    ${geos.lineas.map((g, i) => html`<mesh key=${i} geometry=${g} position=${[0, 0, 0.01]}><meshBasicMaterial color="#f8fafc" /></mesh>`)}
  </group>`;
}

function Porteria({ p, lado }) {
  return html`<${G} p=${p} r=${[0, lado > 0 ? 0 : PI, 0]}>
    <${C} m="B" p=${[0, 1.22, -3.66]} s=${[0.12, 2.44, 0.12]} c="#ffffff" />
    <${C} m="B" p=${[0, 1.22, 3.66]} s=${[0.12, 2.44, 0.12]} c="#ffffff" />
    <${C} m="B" p=${[0, 2.44, 0]} r=${[PI / 2, 0, 0]} s=${[0.12, 7.44, 0.12]} c="#ffffff" />
    <${V} p=${[-1.0, 1.22, 0]} s=${[2.0, 2.44, 7.3]} c="#ffffff" />
  <//>`;
}

function Torre({ p, r }) {
  return html`<${G} p=${p} r=${r}>
    <${C} m="M" p=${[0, 8, 0]} s=${[0.5, 16, 0.5]} c=${COL.grisO} />
    <${B} m="B" p=${[0, 16.3, 0]} s=${[3.2, 1.6, 0.4]} c=${COL.blanco} />
    <${B} m="L" p=${[0, 16.3, 0.21]} s=${[3.0, 1.4, 0.02]} c="#f0f9ff" />
    <${B} m="L" p=${[0, 15.3, 0]} s=${[3.2, 0.05, 0.42]} c=${COL.cian} />
  <//>`;
}

function Futbol() {
  const cx = 83, cz = -44.5;
  const jugadores = [];
  for (let i = 0; i < 10; i++) {
    const eq = i < 5;
    const fx = cx + (eq ? -1 : 1) * (6 + (i % 5) * 4.5), fz = cz + ((i * 7) % 5 - 2) * 6;
    jugadores.push(html`<${Alumno} key=${i} p=${[0, 0.07, 0]} pose="corriendo" deporte=${eq ? true : '#8b5cf6'} seed=${1900 + i}
      velocidad=${0.9} ruta=${{ tipo: 'vaiven', c: [fx, fz], ax: 5 + (i % 3) * 2, az: 4 + (i % 4), w1: 0.25 + (i % 5) * 0.04, w2: 0.2 + (i % 3) * 0.05 }} />`);
  }
  return html`<${G}>
    <${B} p=${[cx, 0.02, cz]} s=${[70, 0.04, 44]} c="#3f9a4c" />
    <${Suelo} p=${[cx, cz]} w=${64} d=${40} tex=${texCampoFutbol()} y=${0.045} />
    <${Pista} c=${[cx, cz]} />
    <${Porteria} p=${[cx - 31.5, 0, cz]} lado=${1} />
    <${Porteria} p=${[cx + 31.5, 0, cz]} lado=${-1} />
    ${jugadores}
    <${Alumno} p=${[cx - 30.6, 0.07, cz]} ry=${PI / 2} pose="portero" deporte="#fbbf24" seed=${1920} />
    <${Alumno} p=${[cx + 30.6, 0.07, cz]} ry=${-PI / 2} pose="portero" deporte="#fbbf24" seed=${1921} />
    <${Balon} c="#ffffff" radio=${0.13} mover=${(p, t) => p.set(cx + Math.sin(t * 0.3) * 18, 0.2 + Math.abs(Math.sin(t * 2.4)) * 0.6, cz + Math.sin(t * 0.47) * 10)} />
    ${[0, 1, 2].map(i => html`<${Alumno} key=${'r' + i} p=${[0, 0.06, 0]} pose="corriendo" deporte=${['#22d3ee', '#2f6bff', '#f472b6'][i]} seed=${1930 + i}
      ruta=${{ tipo: 'rect', c: [cx, cz], hx: 34.6 + i * 1.2, hz: 21.6 + i * 1.2, r: 8.6 + i * 1.2, vel: 3.2 + i * 0.2 }} />`)}
    <${Gradas} p=${[cx, 0, -74.5]} r=${[0, PI, 0]} largo=${40} filas=${5} publico=${14} seed=${1950} />
    <${G}>
      <${B} m="B" p=${[cx, 5.4, -78]} r=${[0.18, 0, 0]} s=${[44, 0.25, 6]} c=${COL.blanco} />
      <${B} m="L" p=${[cx, 5.0, -75.1]} s=${[44, 0.05, 0.05]} c=${COL.cian} />
      ${[-20, -10, 0, 10, 20].map(x => html`<${B} key=${x} m="M" p=${[cx + x, 2.8, -80.2]} s=${[0.25, 5.6, 0.25]} c=${COL.grisO} />`)}
    <//>
    <${Torre} p=${[cx - 40, 0, cz - 26]} r=${[0, PI * 0.25, 0]} />
    <${Torre} p=${[cx + 40, 0, cz - 26]} r=${[0, -PI * 0.25, 0]} />
    <${Torre} p=${[cx - 40, 0, cz + 26]} r=${[0, PI * 0.75, 0]} />
    <${Torre} p=${[cx + 40, 0, cz + 26]} r=${[0, -PI * 0.75, 0]} />
  <//>`;
}

// ---------------- BALONCESTO + PÁDEL ----------------
function Valla({ x0, x1, z0, z1, h = 3 }) {
  const w = x1 - x0, d = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  const postes = [];
  for (let x = x0; x <= x1 + 0.01; x += w / 6) for (const z of [z0, z1]) postes.push(html`<${C} key=${'a' + x + z} m="M" p=${[x, h / 2, z]} s=${[0.08, h, 0.08]} c=${COL.grisO} />`);
  return html`<${G}>
    <${V} p=${[cx, h / 2, z0]} s=${[w, h, 0.03]} c="#e2e8f0" /><${V} p=${[cx, h / 2, z1]} s=${[w, h, 0.03]} c="#e2e8f0" />
    <${V} p=${[x0, h / 2, cz]} s=${[0.03, h, d]} c="#e2e8f0" /><${V} p=${[x1, h / 2, cz]} s=${[0.03, h, d]} c="#e2e8f0" />
    ${postes}
  <//>`;
}

function Baloncesto() {
  const cx = 100, cz = 28;
  return html`<${G}>
    <${B} p=${[cx, 0.03, cz]} s=${[30, 0.06, 17]} c="#334155" />
    <${Suelo} p=${[cx, cz]} w=${28} d=${15} tex=${texPistaBasket()} y=${0.065} />
    <${Canasta} p=${[cx - 13.4, 0, cz]} lado=${1} />
    <${Canasta} p=${[cx + 13.4, 0, cz]} lado=${-1} />
    <${Valla} x0=${85.5} x1=${114.5} z0=${19.6} z1=${36.4} h=${2.6} />
    ${[0, 1, 2, 3, 4].map(i => html`<${Alumno} key=${i} p=${[0, 0.07, 0]} pose="corriendo" deporte=${i % 2 ? '#f97316' : true} seed=${2000 + i}
      velocidad=${0.8} ruta=${{ tipo: 'vaiven', c: [cx + 5 + (i % 3) * 1.5, cz + (i - 2) * 1.6], ax: 3.5, az: 3, w1: 0.45 + i * 0.05, w2: 0.38 + i * 0.04 }} />`)}
    <${Alumno} p=${[cx + 10.2, 0.07, cz]} ry=${PI / 2} pose="saltando" deporte seed=${2006} />
    <${Balon} mover=${(p, t) => p.set(cx + 8 + Math.sin(t * 0.9) * 4, 0.3 + Math.abs(Math.sin(t * 3.5)) * 1.1, cz + Math.sin(t * 0.7) * 3)} />
  <//>`;
}

function Padel() {
  const pista = (cx, k) => html`<${G} key=${k}>
    <${Suelo} p=${[cx, 50.5]} w=${10} d=${20} tex=${texPadel()} y=${0.06} />
    <${V} p=${[cx, 1.5, 40.5]} s=${[10, 3, 0.06]} c="#dff4ff" /><${V} p=${[cx, 1.5, 60.5]} s=${[10, 3, 0.06]} c="#dff4ff" />
    <${V} p=${[cx - 5, 1.5, 42.5]} s=${[0.06, 3, 4]} c="#dff4ff" /><${V} p=${[cx + 5, 1.5, 42.5]} s=${[0.06, 3, 4]} c="#dff4ff" />
    <${V} p=${[cx - 5, 1.5, 58.5]} s=${[0.06, 3, 4]} c="#dff4ff" /><${V} p=${[cx + 5, 1.5, 58.5]} s=${[0.06, 3, 4]} c="#dff4ff" />
    <${V} p=${[cx - 5, 1.0, 50.5]} s=${[0.03, 2, 12]} c="#a3b8cc" /><${V} p=${[cx + 5, 1.0, 50.5]} s=${[0.03, 2, 12]} c="#a3b8cc" />
    ${[40.5, 44.5, 50.5, 56.5, 60.5].map(z => html`<${B} key=${'p' + z} m="M" p=${[cx - 5, 2, z]} s=${[0.1, 4, 0.1]} c=${COL.grisO} />`)}
    ${[40.5, 44.5, 50.5, 56.5, 60.5].map(z => html`<${B} key=${'q' + z} m="M" p=${[cx + 5, 2, z]} s=${[0.1, 4, 0.1]} c=${COL.grisO} />`)}
    <${B} p=${[cx, 0.45, 50.5]} s=${[10, 0.9, 0.03]} c="#0f172a" />
    <${B} m="L" p=${[cx, 0.91, 50.5]} s=${[10, 0.03, 0.04]} c="#ffffff" />
    <${B} m="L" p=${[cx, 3.0, 40.45]} s=${[10, 0.04, 0.04]} c=${COL.cian} />
    <${B} m="L" p=${[cx, 3.0, 60.55]} s=${[10, 0.04, 0.04]} c=${COL.cian} />
    ${[[-2.2, 45], [2.2, 46], [-2.0, 56], [2.4, 55]].map(([dx, z], i) => html`<${Alumno} key=${'j' + i} p=${[0, 0.06, 0]} pose="pingpong" objeto="raqueta" deporte=${z < 50 ? '#22c55e' : true} seed=${2100 + k * 10 + i}
      ruta=${{ tipo: 'vaiven', c: [cx + dx, z], ax: 1.6, az: 0.8, w1: 1.1 + i * 0.1, w2: 0.8 }} />`)}
  <//>`;
  return html`<${G}>
    <${B} p=${[97, 0.03, 50.5]} s=${[23, 0.06, 21.5]} c="#334155" />
    ${pista(91, 0)} ${pista(103, 1)}
    <${Balon} c="#d9f99d" radio=${0.06} mover=${(p, t) => p.set(91 + Math.sin(t * 2.1) * 2, 0.4 + Math.abs(Math.sin(t * 3)) * 1.2, 50.5 + Math.sin(t * 1.6) * 5)} />
  <//>`;
}

export function Deportes() {
  return html`<${G}>
    <${B} p=${[84, 0.015, 16]} s=${[80, 0.03, 7]} c="#d6dde8" />
    <${B} m="L" p=${[84, 0.035, 16]} s=${[78, 0.01, 0.08]} c=${COL.cian} />
    <${B} p=${[83, 0.015, 49]} s=${[6, 0.03, 26]} c="#d6dde8" />
    ${[50, 60, 70, 80, 90, 100, 110].map(x => html`<${Farola} key=${x} p=${[x, 0, 13.2]} />`)}
    <${G} p=${[42.5, 0, 16]}>
      <${B} m="B" p=${[0, 2.2, 0]} s=${[0.6, 4.4, 2.2]} c=${COL.noche} />
      <${Panel} p=${[-0.31, 2.4, 0]} r=${[0, -PI / 2, 0]} w=${2} h=${0.62} tex=${texCartel('Deportes', '#38bdf8')} />
      <${B} m="L" p=${[-0.31, 4.3, 0]} s=${[0.02, 0.08, 2.2]} c=${COL.cian} />
    <//>
    <${Gimnasio} />
    <${FitnessVestuarios} />
    <${Piscina} />
    <${Futbol} />
    <${Baloncesto} />
    <${Padel} />
    <${Zonas} planta="deporte" />
  <//>`;
}
