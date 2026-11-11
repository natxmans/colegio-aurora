// =========================================================
// LAS 8 AULAS DE LA PLANTA BAJA (cada una diferente)
// Coordenadas "canónicas": pasillo y pizarra hacia +z, ventanas hacia -z
// =========================================================
import { html, THREE, useMemo, useRef, useFrame } from '../lib.js';
import { B, C, S, Cono, Ico, Toro, V, G, Panel, COL, Pupitre, Silla, Portatil, Monitor, Cuaderno, Libro, Planta, Estanteria, Frente, TirasLed, Suelo, Mesa, Taburete, Gira, azar, Pantalla } from './piezas.js';
import { Alumno } from './Alumno.js';
import { texPizarra, texPoster, texMapa, texGlobo, texTabla, texLomos } from './texturas.js';

const SUELO = { mates: '#e4eaf4', frances: '#e7e8f5', ingles: '#f2e8ea', historia: '#f2ece1', svt: '#e4f2ea', fisica: '#e3eff3', tecno: '#ebe7f5', musica: '#f2e7f2' };

function Pizarra({ m, d, col }) {
  const z = d / 2 - 0.1;
  return html`<${G}>
    <${B} m="B" p=${[0, 1.75, z - 0.02]} s=${[3.56, 1.86, 0.06]} c=${COL.negro} />
    <${Panel} p=${[0, 1.75, z - 0.06]} r=${[0, Math.PI, 0]} w=${3.38} h=${1.69} tex=${texPizarra(m)} />
    <${B} m="L" p=${[0, 0.78, z - 0.06]} s=${[3.5, 0.025, 0.025]} c=${col} />
    <${B} m="B" p=${[0, 0.86, z - 0.12]} s=${[2.4, 0.04, 0.12]} c=${COL.grisM} />
    <${B} m="B" p=${[-2.05, 1.75, z - 0.06]} s=${[0.16, 0.9, 0.12]} c=${COL.negro} />
    <${B} m="B" p=${[2.05, 1.75, z - 0.06]} s=${[0.16, 0.9, 0.12]} c=${COL.negro} />
  <//>`;
}

function MesaProfesor({ d, conProfe, seed, m }) {
  const z = d / 2 - 1.55;
  return html`<${G}>
    <${Mesa} p=${[2.3, 0, z]} w=${1.6} d=${0.7} c=${COL.blanco} />
    <${Monitor} p=${[2.3, 0.76, z + 0.05]} r=${[0, Math.PI, 0]} pantalla="#5aa2ff" />
    <${Silla} p=${[2.3, 0, z + 0.65]} r=${[0, Math.PI, 0]} c=${COL.noche} />
    <${Libro} p=${[1.75, 0.78, z]} c="#f97316" />
    ${conProfe ? html`<${Alumno} p=${[-2.55, 0, d / 2 - 0.85]} ry=${Math.PI + 0.25} pose="explicando" adulto seed=${seed + 99} />` : null}
  <//>`;
}

// Pupitres dobles en 3 filas, con alumnos sentados mirando la pizarra
function Pupitres({ s, col, objeto = 'cuaderno', poses = ['escribiendo', 'sentado'], vacios = 2, seed }) {
  const r = useMemo(() => azar(seed), [seed]);
  const filas = [-2.7, -1.0, 0.7], columnas = [-1.8, 1.8];
  const items = [];
  let k = 0;
  const huecos = new Set();
  while (huecos.size < vacios) huecos.add(Math.floor(r() * 12));
  for (const z of filas) for (const x of columnas) {
    items.push(html`<${Pupitre} key=${'p' + x + z} p=${[x, 0, z]} ancho=${1.55} led=${col} />`);
    for (const dx of [-0.39, 0.39]) {
      const i = k++;
      const sx = x + dx;
      items.push(html`<${Silla} key=${'s' + i} p=${[sx, 0, z - 0.56]} c=${i % 2 ? col : COL.noche} />`);
      if (objeto === 'portatil') items.push(html`<${Portatil} key=${'o' + i} p=${[sx, 0.74, z - 0.02]} pantalla=${i % 3 ? '#7cc4ff' : '#c4b5fd'} />`);
      else if (objeto === 'monitor') items.push(html`<${Monitor} key=${'o' + i} p=${[sx, 0.74, z + 0.12]} ancho=${0.48} pantalla=${['#3d8bff', '#8b5cf6', '#22d3ee'][i % 3]} />`);
      else if (objeto === 'microscopio' && i % 3 === 0) items.push(html`<${Microscopio} key=${'o' + i} p=${[sx, 0.74, z + 0.05]} />`);
      else items.push(html`<${Cuaderno} key=${'o' + i} p=${[sx, 0.74, z - 0.06]} r=${[0, (r() - 0.5) * 0.3, 0]} c=${['#3d8bff', '#22d3ee', '#8b5cf6', '#f472b6', '#fbbf24'][i % 5]} />`);
      if (!huecos.has(i)) {
        const pose = poses[Math.floor(r() * poses.length)];
        items.push(html`<${Alumno} key=${'a' + i} p=${[sx, 0, z - 0.56]} pose=${pose} seed=${seed * 31 + i * 7} />`);
      }
    }
  }
  return items;
}

function Microscopio({ p }) {
  return html`<${G} p=${p}>
    <${B} m="B" p=${[0, 0.02, 0]} s=${[0.16, 0.04, 0.2]} c=${COL.blanco} />
    <${B} m="B" p=${[0, 0.17, 0.06]} r=${[-0.2, 0, 0]} s=${[0.05, 0.3, 0.06]} c=${COL.blanco} />
    <${C} m="M" p=${[0, 0.3, 0.0]} r=${[0.5, 0, 0]} s=${[0.045, 0.22, 0.045]} c=${COL.grisO} />
    <${B} m="M" p=${[0, 0.11, -0.01]} s=${[0.12, 0.015, 0.1]} c=${COL.grisM} />
  <//>`;
}

function MuebleTrasero({ w, d, col }) {
  const z = -d / 2 + 0.38;
  return html`<${G}>
    <${B} m="B" p=${[0, 0.42, z]} s=${[w - 0.5, 0.84, 0.5]} c=${COL.blanco} />
    <${B} m="L" p=${[0, 0.86, z + 0.25]} s=${[w - 0.5, 0.015, 0.015]} c=${col} />
    ${[-2.7, -0.9, 0.9, 2.7].map((x, i) => html`<${B} key=${i} p=${[x, 0.42, z + 0.255]} s=${[0.01, 0.7, 0.01]} c=${COL.gris} />`)}
  <//>`;
}

// ---------------- Decoración por asignatura ----------------
function Eiffel({ p, h = 1.2 }) {
  const c = '#8a6f4e';
  const patas = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => html`<${B} key=${i} m="M" p=${[a * h * 0.12, h * 0.28, b * h * 0.12]} r=${[b * 0.32, 0, -a * 0.32]} s=${[0.035, h * 0.6, 0.035]} c=${c} />`);
  return html`<${G} p=${p}>
    ${patas}
    <${B} m="M" p=${[0, h * 0.2, 0]} s=${[h * 0.32, 0.03, h * 0.32]} c=${c} />
    <${B} m="M" p=${[0, h * 0.5, 0]} s=${[h * 0.14, 0.03, h * 0.14]} c=${c} />
    <${Cono} p=${[0, h * 0.75, 0]} s=${[h * 0.12, h * 0.5, h * 0.12]} c=${c} />
    <${C} m="L" p=${[0, h * 1.02, 0]} s=${[0.015, 0.1, 0.015]} c="#ffd36b" />
  <//>`;
}

function BigBen({ p }) {
  return html`<${G} p=${p}>
    <${B} m="B" p=${[0, 0.7, 0]} s=${[0.36, 1.4, 0.36]} c="#d6b77a" />
    <${B} m="B" p=${[0, 1.5, 0]} s=${[0.42, 0.22, 0.42]} c="#c9a96a" />
    ${[0, 1, 2, 3].map(i => html`<${G} key=${i} r=${[0, (i * Math.PI) / 2, 0]}><${C} m="L" p=${[0, 1.5, 0.215]} r=${[Math.PI / 2, 0, 0]} s=${[0.17, 0.01, 0.17]} c="#fff7e0" /><//>`)}
    <${Cono} p=${[0, 1.86, 0]} s=${[0.42, 0.5, 0.42]} c="#4b5563" />
  <//>`;
}

function Cabina({ p, r }) {
  const rojo = '#d62839';
  return html`<${G} p=${p} r=${r}>
    <${B} m="B" p=${[0, 0.06, 0]} s=${[1, 0.12, 1]} c=${rojo} />
    <${B} m="B" p=${[-0.44, 1.2, -0.44]} s=${[0.12, 2.2, 0.12]} c=${rojo} />
    <${B} m="B" p=${[0.44, 1.2, -0.44]} s=${[0.12, 2.2, 0.12]} c=${rojo} />
    <${B} m="B" p=${[-0.44, 1.2, 0.44]} s=${[0.12, 2.2, 0.12]} c=${rojo} />
    <${B} m="B" p=${[0.44, 1.2, 0.44]} s=${[0.12, 2.2, 0.12]} c=${rojo} />
    <${B} m="B" p=${[0, 2.35, 0]} s=${[1.04, 0.2, 1.04]} c=${rojo} />
    <${B} m="B" p=${[0, 2.5, 0]} s=${[0.8, 0.12, 0.8]} c=${rojo} />
    <${B} m="L" p=${[0, 2.2, 0.47]} s=${[0.7, 0.1, 0.02]} c="#ffffff" />
    <${V} p=${[0, 1.25, 0.46]} s=${[0.76, 1.7, 0.03]} c="#ffe3e6" />
    <${V} p=${[0.46, 1.25, 0]} s=${[0.03, 1.7, 0.76]} c="#ffe3e6" />
    <${V} p=${[-0.46, 1.25, 0]} s=${[0.03, 1.7, 0.76]} c="#ffe3e6" />
    <${B} p=${[0, 1.25, -0.46]} s=${[0.78, 1.9, 0.04]} c=${rojo} />
  <//>`;
}

function Globo({ p }) {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ map: texGlobo(), roughness: 0.4 }), []);
  const ref = useRef();
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.4; });
  return html`<${G} p=${p}>
    <${C} m="M" p=${[0, 0.03, 0]} s=${[0.3, 0.06, 0.3]} c=${COL.grisO} />
    <${C} m="M" p=${[0, 0.25, 0]} s=${[0.03, 0.42, 0.03]} c=${COL.grisO} />
    <${Toro} m="M" p=${[0, 0.62, 0]} r=${[0, Math.PI / 2, 0.4]} s=${0.72} c="#c9a96a" />
    <group position=${[0, 0.62, 0]} rotation=${[0, 0, 0.4]}>
      <mesh ref=${ref} material=${mat} castShadow><sphereGeometry args=${[0.32, 32, 20]} /></mesh>
    </group>
  <//>`;
}

function Piramide({ p, s = 0.6 }) {
  const geo = useMemo(() => new THREE.ConeGeometry(0.5, 1, 4), []);
  return html`<mesh position=${p} rotation=${[0, Math.PI / 4, 0]} scale=${[s, s * 0.75, s]} geometry=${geo} castShadow>
    <meshStandardMaterial color="#e3c27c" roughness=${0.8} flatShading=${true} />
  </mesh>`;
}

function Columna({ p, h = 0.9 }) {
  return html`<${G} p=${p}>
    <${B} p=${[0, 0.04, 0]} s=${[0.28, 0.08, 0.28]} c="#f1ede4" />
    <${C} p=${[0, h / 2, 0]} s=${[0.18, h - 0.1, 0.18]} c="#f1ede4" />
    <${B} p=${[0, h - 0.02, 0]} s=${[0.3, 0.07, 0.3]} c="#f1ede4" />
  <//>`;
}

function Acuario({ p }) {
  return html`<${G} p=${p}>
    <${V} p=${[0, 0.33, 0]} s=${[1.4, 0.64, 0.46]} c="#d8f3ff" />
    <${B} m="L" p=${[0, 0.28, 0]} s=${[1.34, 0.5, 0.4]} c="#48b9f0" />
    <${B} p=${[0, 0.035, 0]} s=${[1.36, 0.06, 0.42]} c="#e9dcc2" />
    <${B} m="M" p=${[0, 0.66, 0]} s=${[1.42, 0.04, 0.48]} c=${COL.grisO} />
    ${[[-0.4, 0.3, 0.21], [0.1, 0.4, 0.21], [0.45, 0.22, 0.21]].map((q, i) => html`<${S} key=${i} m="L" p=${q} s=${[0.12, 0.06, 0.03]} c=${i === 1 ? '#ffd36b' : '#ff8a3d'} />`)}
    <${Cono} p=${[-0.5, 0.2, -0.05]} s=${[0.08, 0.3, 0.08]} c="#2f9e5a" />
    <${Cono} p=${[0.55, 0.22, -0.08]} s=${[0.08, 0.34, 0.08]} c="#3fb36a" />
  <//>`;
}

function ADN({ p }) {
  const items = [];
  for (let i = 0; i < 14; i++) {
    const a = i * 0.55, y = 0.1 + i * 0.07, x = Math.cos(a) * 0.14, z = Math.sin(a) * 0.14;
    items.push(html`<${S} key=${'a' + i} dyn m="B" p=${[x, y, z]} s=${0.06} c="#22d3ee" />`);
    items.push(html`<${S} key=${'b' + i} dyn m="B" p=${[-x, y, -z]} s=${0.06} c="#f472b6" />`);
    items.push(html`<${C} key=${'c' + i} dyn p=${[0, y, 0]} r=${[0, -a, Math.PI / 2]} s=${[0.015, 0.28, 0.015]} c="#ffffff" />`);
  }
  return html`<${G} p=${p}><${C} m="M" p=${[0, 0.03, 0]} s=${[0.22, 0.04, 0.22]} c=${COL.grisO} /><${Gira} p=${[0, 0, 0]} vel=${0.6}>${items}<//><//>`;
}

function MuroVerde({ x, z0, z1 }) {
  const items = [];
  const n = Math.round((z1 - z0) / 0.42);
  for (let i = 0; i < n; i++) for (let j = 0; j < 5; j++) {
    items.push(html`<${Ico} key=${i + '-' + j} p=${[x, 0.95 + j * 0.42, z0 + 0.2 + i * 0.42]} s=${0.36 + ((i * 7 + j * 3) % 5) * 0.03} c=${['#2f8f4e', '#3fae5f', '#5cc46f', '#277a41'][(i + j * 2) % 4]} />`);
  }
  return html`<${G}><${B} p=${[x - 0.12, 1.8, (z0 + z1) / 2]} s=${[0.06, 2.3, z1 - z0 + 0.2]} c="#6b4f3a" />${items}<//>`;
}

function Laboratorio({ d }) {
  const z = d / 2 - 1.45;
  const tubos = ['#22d3ee', '#f472b6', '#a3e635', '#8b5cf6', '#fbbf24', '#fb7185'];
  return html`<${G}>
    <${B} m="B" p=${[-1.7, 0.45, z]} s=${[2.8, 0.9, 0.75]} c=${COL.blanco} />
    <${B} m="B" p=${[-1.7, 0.92, z]} s=${[2.86, 0.05, 0.8]} c="#1f2937" />
    <${B} m="L" p=${[-1.7, 0.6, z - 0.38]} s=${[2.7, 0.02, 0.01]} c=${COL.cian} />
    <${C} m="M" p=${[-0.6, 0.96, z]} s=${[0.3, 0.04, 0.3]} c=${COL.grisM} />
    <${C} m="M" p=${[-0.6, 1.15, z + 0.25]} s=${[0.03, 0.35, 0.03]} c=${COL.grisM} />
    <${B} p=${[-2.4, 1.0, z]} s=${[0.5, 0.06, 0.16]} c=${COL.grisO} />
    ${tubos.map((c, i) => html`<${C} key=${i} m="L" p=${[-2.6 + i * 0.08, 1.1, z]} s=${[0.04, 0.2, 0.04]} c=${c} />`)}
    ${[['#22d3ee', -1.6], ['#f472b6', -1.25], ['#a3e635', -0.95]].map(([c, x], i) => html`<${G} key=${'f' + i} p=${[x, 0.95, z - 0.1]}>
      <${S} m="L" p=${[0, 0.11, 0]} s=${0.2} c=${c} />
      <${C} p=${[0, 0.26, 0]} s=${[0.05, 0.14, 0.05]} c="#e6f6ff" />
    <//>`)}
  <//>`;
}

function Atomo({ p }) {
  return html`<${G} p=${p}>
    <${C} m="M" p=${[0, 0.02, 0]} s=${[0.25, 0.04, 0.25]} c=${COL.grisO} />
    <${C} m="M" p=${[0, 0.25, 0]} s=${[0.03, 0.45, 0.03]} c=${COL.grisO} />
    <${Gira} p=${[0, 0.62, 0]} vel=${1.2}>
      <${S} dyn m="L" p=${[0, 0, 0]} s=${0.13} c="#ff5d73" />
      <${Toro} dyn m="L" r=${[Math.PI / 2, 0, 0]} s=${[0.55, 0.55, 0.3]} c="#22d3ee" />
      <${Toro} dyn m="L" r=${[Math.PI / 2, 1.05, 0]} s=${[0.55, 0.55, 0.3]} c="#22d3ee" />
      <${Toro} dyn m="L" r=${[Math.PI / 2, -1.05, 0]} s=${[0.55, 0.55, 0.3]} c="#22d3ee" />
      <${S} dyn m="L" p=${[0.275, 0, 0]} s=${0.05} c="#ffffff" />
      <${S} dyn m="L" p=${[-0.14, 0.0, 0.24]} s=${0.05} c="#ffffff" />
    <//>
  <//>`;
}

function Impresora3D({ p }) {
  return html`<${G} p=${p}>
    ${[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => html`<${B} key=${i} m="M" p=${[a * 0.28, 0.35, b * 0.22]} s=${[0.04, 0.7, 0.04]} c=${COL.grisO} />`)}
    <${B} m="M" p=${[0, 0.71, 0]} s=${[0.6, 0.04, 0.48]} c=${COL.grisO} />
    <${B} m="B" p=${[0, 0.06, 0]} s=${[0.6, 0.12, 0.48]} c=${COL.negro} />
    <${B} m="L" p=${[0, 0.125, 0]} s=${[0.4, 0.01, 0.34]} c="#3d8bff" />
    <${Ico} p=${[0, 0.22, 0]} s=${0.18} c=${COL.violeta} />
    <${B} m="M" p=${[0.05, 0.5, 0]} s=${[0.5, 0.04, 0.04]} c=${COL.grisM} />
    <${B} m="L" p=${[0.05, 0.44, 0]} s=${[0.05, 0.08, 0.05]} c=${COL.cian} />
    <${V} p=${[0, 0.4, 0.24]} s=${[0.58, 0.6, 0.01]} />
  <//>`;
}

function BrazoRobot({ p }) {
  const g1 = useRef(), g2 = useRef(), g3 = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (g1.current) g1.current.rotation.y = Math.sin(t * 0.7) * 1.2;
    if (g2.current) g2.current.rotation.z = -0.5 + Math.sin(t * 1.1) * 0.35;
    if (g3.current) g3.current.rotation.z = 1.2 + Math.sin(t * 1.3 + 1) * 0.4;
  });
  return html`<${G} p=${p}>
    <${C} m="M" p=${[0, 0.05, 0]} s=${[0.32, 0.1, 0.32]} c=${COL.grisO} />
    <group ref=${g1} position=${[0, 0.1, 0]}>
      <${C} dyn m="B" p=${[0, 0.06, 0]} s=${[0.22, 0.12, 0.22]} c="#f97316" />
      <group ref=${g2} position=${[0, 0.12, 0]}>
        <${B} dyn m="B" p=${[0, 0.22, 0]} s=${[0.09, 0.44, 0.09]} c="#f97316" />
        <${S} dyn m="M" p=${[0, 0.44, 0]} s=${0.12} c=${COL.grisO} />
        <group ref=${g3} position=${[0, 0.44, 0]}>
          <${B} dyn m="B" p=${[0, 0.17, 0]} s=${[0.07, 0.34, 0.07]} c="#f97316" />
          <${B} dyn m="M" p=${[0, 0.36, 0]} s=${[0.14, 0.05, 0.05]} c=${COL.grisO} />
          <${B} dyn m="L" p=${[0, 0.39, 0]} s=${[0.03, 0.03, 0.03]} c=${COL.cian} />
        <//>
      <//>
    <//>
  <//>`;
}

function Robotito({ p, r, c = COL.blanco }) {
  return html`<${G} p=${p} r=${r}>
    <${B} m="B" p=${[0, 0.08, 0]} s=${[0.14, 0.12, 0.12]} c=${c} />
    <${B} m="B" p=${[0, 0.2, 0]} s=${[0.12, 0.09, 0.1]} c=${c} />
    <${B} m="L" p=${[-0.03, 0.2, 0.052]} s=${[0.025, 0.025, 0.005]} c=${COL.cian} />
    <${B} m="L" p=${[0.03, 0.2, 0.052]} s=${[0.025, 0.025, 0.005]} c=${COL.cian} />
    <${C} p=${[-0.075, 0.035, 0]} r=${[0, 0, Math.PI / 2]} s=${[0.07, 0.02, 0.07]} c=${COL.negro} />
    <${C} p=${[0.075, 0.035, 0]} r=${[0, 0, Math.PI / 2]} s=${[0.07, 0.02, 0.07]} c=${COL.negro} />
  <//>`;
}

function Dron({ p }) {
  return html`<${G} p=${p}>
    <${B} m="B" p=${[0, 0.05, 0]} s=${[0.16, 0.06, 0.16]} c=${COL.negro} />
    ${[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => html`<${G} key=${i}>
      <${B} m="B" p=${[a * 0.1, 0.06, b * 0.1]} r=${[0, a * b > 0 ? -0.78 : 0.78, 0]} s=${[0.02, 0.02, 0.2]} c=${COL.negro} />
      <${C} m="L" p=${[a * 0.17, 0.08, b * 0.17]} s=${[0.14, 0.006, 0.14]} c=${COL.cian} />
    <//>`)}
  <//>`;
}

function Piano({ p, r }) {
  const teclas = [];
  for (let i = 0; i < 9; i++) if (i % 7 !== 2 && i % 7 !== 6) teclas.push(html`<${B} key=${i} p=${[-0.6 + i * 0.15, 0.775, 0.17]} s=${[0.06, 0.03, 0.1]} c=${COL.negro} />`);
  return html`<${G} p=${p} r=${r}>
    <${B} m="B" p=${[0, 0.65, -0.05]} s=${[1.5, 1.3, 0.5]} c="#101420" />
    <${B} m="B" p=${[0, 0.72, 0.22]} s=${[1.44, 0.06, 0.22]} c="#101420" />
    <${B} p=${[0, 0.755, 0.2]} s=${[1.36, 0.02, 0.18]} c="#fbfbf7" />
    ${teclas}
    <${B} m="L" p=${[0, 1.31, -0.05]} s=${[1.5, 0.015, 0.5]} c=${COL.violeta} />
    <${B} m="B" p=${[0, 0.48, 0.65]} s=${[0.9, 0.05, 0.36]} c="#101420" />
    <${B} m="M" p=${[0, 0.24, 0.65]} s=${[0.8, 0.46, 0.04]} c=${COL.grisO} />
  <//>`;
}

function Bateria({ p, r }) {
  return html`<${G} p=${p} r=${r}>
    <${C} m="B" p=${[0, 0.3, 0.35]} r=${[Math.PI / 2, 0, 0]} s=${[0.56, 0.4, 0.56]} c=${COL.blanco} />
    <${Toro} m="L" p=${[0, 0.3, 0.56]} s=${[0.56, 0.56, 0.4]} c=${COL.violeta} />
    <${C} m="B" p=${[-0.35, 0.62, 0.1]} s=${[0.36, 0.14, 0.36]} c=${COL.blanco} />
    <${C} m="M" p=${[-0.35, 0.3, 0.1]} s=${[0.03, 0.55, 0.03]} c=${COL.grisM} />
    <${C} m="B" p=${[-0.12, 0.72, 0.42]} r=${[0.3, 0, 0]} s=${[0.26, 0.18, 0.26]} c=${COL.violeta} />
    <${C} m="B" p=${[0.18, 0.72, 0.42]} r=${[0.3, 0, 0]} s=${[0.28, 0.2, 0.28]} c=${COL.violeta} />
    <${C} m="B" p=${[0.45, 0.42, 0.05]} s=${[0.42, 0.36, 0.42]} c=${COL.blanco} />
    ${[[-0.6, 1.05, 0.35], [0.6, 1.1, 0.45], [-0.45, 0.85, -0.1]].map((q, i) => html`<${G} key=${i}>
      <${C} m="M" p=${q} r=${[0.15, 0, 0]} s=${[0.42, 0.012, 0.42]} c="#d4a73c" />
      <${C} m="M" p=${[q[0], q[1] / 2, q[2]]} s=${[0.02, q[1], 0.02]} c=${COL.grisM} />
    <//>`)}
    <${Taburete} p=${[0, 0, -0.3]} c=${COL.noche} />
  <//>`;
}

function Guitarra({ p, r, c = '#ef4444' }) {
  return html`<${G} p=${p} r=${r}>
    <${B} m="M" p=${[0, 0.25, -0.05]} r=${[-0.2, 0, 0]} s=${[0.03, 0.5, 0.03]} c=${COL.grisO} />
    <${S} m="B" p=${[0, 0.42, 0]} s=${[0.36, 0.42, 0.09]} c=${c} />
    <${S} m="B" p=${[0, 0.68, 0]} s=${[0.28, 0.3, 0.09]} c=${c} />
    <${B} p=${[0, 1.02, 0]} s=${[0.055, 0.55, 0.035]} c="#5b4636" />
    <${B} p=${[0, 1.33, 0]} s=${[0.09, 0.14, 0.035]} c=${COL.negro} />
    <${C} p=${[0, 0.58, 0.046]} r=${[Math.PI / 2, 0, 0]} s=${[0.08, 0.005, 0.08]} c=${COL.negro} />
  <//>`;
}

function Altavoz({ p, r }) {
  return html`<${G} p=${p} r=${r}>
    <${B} m="B" p=${[0, 0.5, 0]} s=${[0.45, 1.0, 0.4]} c=${COL.negro} />
    <${C} m="M" p=${[0, 0.68, 0.2]} r=${[Math.PI / 2, 0, 0]} s=${[0.26, 0.02, 0.26]} c=${COL.grisO} />
    <${C} m="M" p=${[0, 0.32, 0.2]} r=${[Math.PI / 2, 0, 0]} s=${[0.32, 0.02, 0.32]} c=${COL.grisO} />
    <${Toro} m="L" p=${[0, 0.32, 0.21]} s=${[0.34, 0.34, 0.2]} c=${COL.violeta} />
  <//>`;
}

function Atril({ p, r }) {
  return html`<${G} p=${p} r=${r}>
    <${C} m="M" p=${[0, 0.55, 0]} s=${[0.025, 1.1, 0.025]} c=${COL.grisO} />
    <${B} m="M" p=${[0, 1.15, 0.05]} r=${[-0.4, 0, 0]} s=${[0.5, 0.36, 0.02]} c=${COL.grisO} />
    <${B} p=${[0, 1.16, 0.062]} r=${[-0.4, 0, 0]} s=${[0.4, 0.28, 0.005]} c="#fffdf5" />
  <//>`;
}

function SillasMusica({ col, seed }) {
  const items = [];
  const r = azar(seed);
  let k = 0;
  for (const [radio, angs] of [[3.0, [-0.75, -0.38, 0, 0.38, 0.75]], [4.6, [-0.55, -0.28, 0, 0.28, 0.55]]]) {
    for (const a of angs) {
      const x = Math.sin(a) * radio, z = 2.7 - Math.cos(a) * radio, ry = -a;
      items.push(html`<${Silla} key=${'s' + k} p=${[x, 0, z]} r=${[0, ry, 0]} c=${k % 2 ? col : COL.noche} />`);
      if (k !== 3 && k !== 8) items.push(html`<${Alumno} key=${'a' + k} p=${[x, 0, z]} ry=${ry} pose=${r() < 0.3 ? 'aplaudiendo' : 'sentado'} seed=${seed * 13 + k} />`);
      k++;
    }
  }
  return items;
}

function PanelesAcusticos({ x, z0 }) {
  const items = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) {
    items.push(html`<${B} key=${i + '-' + j} p=${[x, 1.3 + j * 0.62, z0 + i * 0.62]} s=${[0.08, 0.56, 0.56]} c=${['#8b5cf6', '#3d8bff', '#e879f9', '#22d3ee'][(i + j) % 4]} />`);
  }
  return items;
}

// ---------------- Aula completa ----------------
export function Aula({ s }) {
  const w = s.x1 - s.x0, d = s.z1 - s.z0, h = s.h, m = s.materia, col = s.color;
  const seed = 11 + ['mates', 'frances', 'ingles', 'historia', 'svt', 'fisica', 'tecno', 'musica'].indexOf(m) * 17;
  const zt = -d / 2 + 0.38, yt = 0.86; // encima del mueble trasero
  const posterE = (tipo, z = -1.2) => html`<${Panel} p=${[w / 2 - 0.11, 1.95, z]} r=${[0, -Math.PI / 2, 0]} w=${0.9} h=${1.27} tex=${texPoster(tipo)} luz=${false} />`;
  const estanteO = html`<${Estanteria} p=${[-w / 2 + 0.27, 0, -0.6]} r=${[0, Math.PI / 2, 0]} w=${2.2} h=${2.1} tex=${texLomos(seed)} led=${col} />`;

  let deco = null;
  if (m === 'mates') deco = html`
    <${B} m="B" p=${[-2.9, yt + 0.2, zt]} r=${[0, 0.5, 0]} s=${0.4} c=${col} />
    <${S} m="B" p=${[-1.9, yt + 0.21, zt]} s=${0.42} c=${COL.cian} />
    <${Cono} p=${[-0.9, yt + 0.27, zt]} s=${[0.42, 0.54, 0.42]} c=${COL.violeta} />
    <${Ico} p=${[0.1, yt + 0.22, zt]} s=${0.44} c="#f472b6" />
    <${Toro} m="B" p=${[1.1, yt + 0.24, zt]} s=${0.44} c="#fbbf24" />
    <${Planta} p=${[2.6, yt, zt]} s=${0.7} tipo=${2} />
    ${estanteO} ${posterE('pitagoras')}`;
  if (m === 'frances') deco = html`
    <${Eiffel} p=${[-2.8, yt, zt]} h=${1.3} />
    <${Planta} p=${[-1.5, yt, zt]} s=${0.6} tipo=${0} />
    <${Libro} p=${[0, yt + 0.02, zt]} c="#3d8bff" /><${Libro} p=${[0, yt + 0.06, zt]} c="#ffffff" /><${Libro} p=${[0, yt + 0.1, zt]} c="#ef4444" />
    <${G} p=${[1.9, 0.78, d / 2 - 1.6]}>
      <${C} m="M" p=${[0, 0.25, 0]} s=${[0.015, 0.5, 0.015]} c=${COL.grisM} />
      <${B} p=${[0.05, 0.42, 0]} s=${[0.07, 0.14, 0.005]} c="#2f4bd8" /><${B} p=${[0.12, 0.42, 0]} s=${[0.07, 0.14, 0.005]} c="#ffffff" /><${B} p=${[0.19, 0.42, 0]} s=${[0.07, 0.14, 0.005]} c="#e8414f" />
    <//>
    ${estanteO} ${posterE('paris')}`;
  if (m === 'ingles') deco = html`
    <${BigBen} p=${[-2.7, yt, zt]} />
    <${Planta} p=${[-1.4, yt, zt]} s=${0.6} tipo=${1} />
    <${Cabina} p=${[3.05, 0, -3.2]} r=${[0, -Math.PI / 2, 0]} />
    ${estanteO} ${posterE('londres', 0.2)}`;
  if (m === 'historia') deco = html`
    <${Panel} p=${[-w / 2 + 0.11, 1.95, -0.6]} r=${[0, Math.PI / 2, 0]} w=${3.0} h=${1.69} tex=${texMapa()} luz=${false} />
    <${B} m="B" p=${[-w / 2 + 0.09, 1.95, -0.6]} s=${[0.02, 1.8, 3.12]} c=${COL.negro} />
    <${Globo} p=${[2.6, yt, zt]} />
    <${Piramide} p=${[-2.6, yt + 0.22, zt]} s=${0.6} />
    <${Columna} p=${[-1.4, yt, zt]} /><${Columna} p=${[-0.9, yt, zt]} h=${0.7} />
    <${Planta} p=${[0.6, yt, zt]} s=${0.6} tipo=${2} />
    ${posterE('linea')}`;
  if (m === 'svt') deco = html`
    <${Acuario} p=${[-2.2, yt, zt]} />
    <${Planta} p=${[-0.4, yt, zt]} s=${0.65} tipo=${0} /><${Planta} p=${[0.5, yt, zt]} s=${0.55} tipo=${1} /><${Planta} p=${[1.4, yt, zt]} s=${0.65} tipo=${2} />
    <${ADN} p=${[1.8, 0.76, d / 2 - 1.55]} />
    <${MuroVerde} x=${-w / 2 + 0.2} z0=${-2.6} z1=${1.4} />
    ${posterE('celula', -2.0)} ${posterE('cuerpo', -0.6)}`;
  if (m === 'fisica') deco = html`
    <${Laboratorio} d=${d} />
    <${Atomo} p=${[1.8, 0.76, d / 2 - 1.55]} />
    <${G} p=${[2.3, yt, zt]}>
      <${B} m="B" p=${[0, 0.8, 0]} s=${[1.5, 1.6, 0.48]} c=${COL.blanco} />
      <${B} m="L" p=${[0, 0.75, 0.05]} s=${[1.3, 1.1, 0.38]} c="#cfefff" />
      <${V} p=${[0, 0.75, 0.25]} s=${[1.4, 1.2, 0.02]} />
      <${C} m="L" p=${[-0.3, 0.35, 0.05]} s=${[0.1, 0.25, 0.1]} c="#a3e635" />
    <//>
    <${Panel} p=${[-w / 2 + 0.11, 1.95, -0.6]} r=${[0, Math.PI / 2, 0]} w=${2.8} h=${1.75} tex=${texTabla()} luz=${false} />
    <${Planta} p=${[-0.3, yt, zt]} s=${0.55} tipo=${1} />`;
  if (m === 'tecno') deco = html`
    <${Impresora3D} p=${[-2.6, yt, zt]} />
    <${BrazoRobot} p=${[-0.6, yt, zt]} />
    <${Dron} p=${[1.2, yt, zt]} />
    <${Robotito} p=${[2.4, yt, zt]} c="#f97316" />
    <${Robotito} p=${[1.4, 0.74, -2.6]} r=${[0, 0.4, 0]} />
    <${Robotito} p=${[-2.2, 0.74, -0.95]} r=${[0, -0.3, 0]} c=${COL.cian} />
    ${estanteO} ${posterE('programacion')}`;
  if (m === 'musica') deco = html`
    <${Piano} p=${[-w / 2 + 0.45, 0, -0.8]} r=${[0, Math.PI / 2, 0]} />
    <${Alumno} p=${[-w / 2 + 1.12, 0, -0.8]} ry=${-Math.PI / 2} pose="tecleando" asiento=${0.5} seed=${seed + 5} />
    <${Bateria} p=${[2.6, 0, -3.1]} r=${[0, -0.4, 0]} />
    <${Guitarra} p=${[-2.4, 0, -3.95]} c="#ef4444" /><${Guitarra} p=${[-1.8, 0, -3.95]} c=${COL.elec} /><${Guitarra} p=${[-1.2, 0, -3.95]} c="#e2c49b" />
    <${Altavoz} p=${[-2.4, 0, d / 2 - 0.5]} r=${[0, Math.PI, 0]} /><${Altavoz} p=${[2.4, 0, d / 2 - 0.5]} r=${[0, Math.PI, 0]} />
    <${Atril} p=${[1.5, 0, 2.4]} r=${[0, Math.PI, 0]} />
    ${PanelesAcusticos({ x: w / 2 - 0.12, z0: -2.2 })}`;

  return html`<${G}>
    <${Suelo} w=${w} d=${d} c=${SUELO[m]} borde=${col} />
    <${Frente} w=${w} d=${d} h=${h} macizo=${[-2.4, 2.4]} puerta=${3.05} />
    <${TirasLed} w=${w} d=${d} h=${h} c=${col} />
    <${Pizarra} m=${m} d=${d} col=${col} />
    ${m !== 'musica' && m !== 'fisica' ? html`<${MesaProfesor} d=${d} conProfe=${m === 'mates' || m === 'historia' || m === 'ingles'} seed=${seed} m=${m} />` : null}
    ${m === 'fisica' ? html`<${Alumno} p=${[-1.7, 0, d / 2 - 0.85]} ry=${Math.PI} pose="explicando" adulto seed=${seed + 99} />` : null}
    ${m === 'musica' ? html`<${Alumno} p=${[0.6, 0, d / 2 - 1.2]} ry=${Math.PI} pose="hablando" adulto seed=${seed + 98} />` : null}
    ${m !== 'musica' && m !== 'fisica' && m !== 'svt' && m !== 'tecno' ? html`<${MuebleTrasero} w=${w} d=${d} col=${col} />` : null}
    ${m === 'svt' || m === 'fisica' || m === 'tecno' ? html`<${MuebleTrasero} w=${w} d=${d} col=${col} />` : null}
    ${m === 'musica' ? html`<${SillasMusica} col=${col} seed=${seed} />` : html`<${Pupitres} s=${s} col=${col} seed=${seed}
        objeto=${m === 'tecno' ? 'monitor' : m === 'frances' || m === 'ingles' ? 'portatil' : m === 'svt' ? 'microscopio' : 'cuaderno'}
        poses=${m === 'tecno' || m === 'frances' || m === 'ingles' ? ['tecleando', 'sentado'] : ['escribiendo', 'sentado', 'escribiendo']} vacios=${m === 'fisica' ? 3 : 2} />`}
    ${deco}
  <//>`;
}
