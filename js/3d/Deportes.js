// =========================================================
// COMPLEJO DEPORTIVO (según el PowerPoint):
// gimnasio cubierto, campo de fútbol, cancha de baloncesto
// y piscina olímpica cubierta y climatizada
// =========================================================
import { html, THREE, useMemo, useRef, useFrame, useLayoutEffect } from '../lib.js';
import { B, C, S, Cono, Ico, Toro, V, VT, G, Panel, COL, Banco, Farola, Pantalla, Planta, Arbol } from './piezas.js';
import { tocar } from './kit.js';
import { leer } from '../estado.js';
import { Alumno } from './Alumno.js';
import { Zonas } from './Interaccion.js';
import { texPistaGym, texPistaBasket, texCampoFutbol, texPiscinaFondo, texPantalla, texLogo, texRotuloTexto } from './texturas.js';

const PI = Math.PI;

// Techo que se levanta y desaparece (botón "Techo" o al visitar el edificio)
function TechoMovil({ y, ids, children }) {
  const ref = useRef();
  const e = useRef({ o: 0 });
  useLayoutEffect(() => { ref.current.updateMatrix(); tocar(); }, []);
  useFrame((_, dt) => {
    const s = leer();
    const oculto = !s.techo || ids.includes(s.sel);
    const obj = oculto ? 24 : 0;
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

function Suelo({ p, w, d, tex, y = 0.06, r = 0 }) {
  return html`<${Panel} p=${[p[0], y, p[1]]} r=${[-PI / 2, 0, r]} w=${w} h=${d} tex=${tex} luz=${false} />`;
}

function Canasta({ p, lado }) {
  return html`<${G} p=${p} r=${[0, lado > 0 ? 0 : PI, 0]}>
    <${C} m="M" p=${[-1.2, 1.6, 0]} s=${[0.16, 3.2, 0.16]} c=${COL.noche} />
    <${B} m="M" p=${[-0.6, 3.25, 0]} s=${[1.2, 0.1, 0.1]} c=${COL.noche} />
    <${V} p=${[0, 3.35, 0]} s=${[0.05, 1.05, 1.8]} c="#ffffff" />
    <${B} p=${[0.03, 3.1, 0]} s=${[0.01, 0.45, 0.6]} c="#ffffff" />
    <${Toro} m="M" p=${[0.3, 3.05, 0]} r=${[PI / 2, 0, 0]} s=${[0.46, 0.46, 0.4]} c="#d0612a" />
    <${Cono} p=${[0.3, 2.85, 0]} r=${[PI, 0, 0]} s=${[0.42, 0.4, 0.42]} c="#f4f1ea" />
  <//>`;
}

function Balon({ c = '#d0612a', radio = 0.12, mover }) {
  const ref = useRef();
  useFrame(({ clock }) => { if (ref.current) mover(ref.current.position, clock.elapsedTime); });
  return html`<mesh ref=${ref} castShadow><sphereGeometry args=${[radio, 16, 12]} /><meshStandardMaterial color=${c} roughness=${0.5} /></mesh>`;
}

function Gradas({ p, r, largo = 26, filas = 4, publico = 0, seed = 1 }) {
  const items = [];
  for (let i = 0; i < filas; i++) {
    const y = 0.45 * (i + 1), z = -i * 0.95;
    items.push(html`<${B} key=${'g' + i} p=${[0, y / 2, z]} s=${[largo, y, 0.95]} c=${i % 2 ? '#e6dfd2' : '#d9d1c2'} />`);
    const n = Math.floor(largo / 0.62);
    for (let k = 0; k < n; k++) items.push(html`<${B} key=${'s' + i + '-' + k} m="B" p=${[-largo / 2 + 0.31 + k * 0.62, y + 0.06, z - 0.05]} s=${[0.48, 0.1, 0.42]} c=${(i + k) % 3 ? COL.noche : COL.elec} />`);
  }
  for (let j = 0; j < publico; j++) {
    const i = j % filas, k = (j * 7) % Math.floor(largo / 0.62);
    items.push(html`<${Alumno} key=${'a' + j} p=${[-largo / 2 + 0.31 + k * 0.62, 0, -i * 0.95]} pose=${j % 3 ? 'aplaudiendo' : 'sentado'} asiento=${0.45 * (i + 1) + 0.1} seed=${seed + j * 13} />`);
  }
  return html`<${G} p=${p} r=${r}>${items}<//>`;
}

// Geometría de un arco de cubierta: radio, centro y ángulo (luz = anchura, flecha = altura del arco)
function arco(luz, flecha, alto) {
  const R = ((luz / 2) ** 2 + flecha ** 2) / (2 * flecha);
  return { R, yc: alto + flecha - R, a0: Math.asin(luz / 2 / R) };
}

// Bóveda CERRADA: paneles que se solapan (sin huecos) y algunas bandas de cristal tintado.
// eje = dirección de la bóveda ('x' o 'z'); vidrio(i, n) dice qué paneles son lucernarios.
function Boveda({ cx, cz, largo, luz, flecha, alto, eje = 'x', vidrio = () => false, color = COL.blanco }) {
  const { R, yc, a0 } = arco(luz, flecha, alto);
  const n = 16, segs = [];
  for (let i = 0; i < n; i++) {
    const a = -a0 + (i + 0.5) * (2 * a0 / n), lado = R * Math.sin(a), y = yc + R * Math.cos(a);
    const ancho = (2 * a0 * R) / n + 0.12; // solape: no queda ninguna rendija
    const props = eje === 'x'
      ? { p: [cx, y, cz + lado], r: [a, 0, 0], s: [largo, 0.3, ancho] }
      : { p: [cx + lado, y, cz], r: [0, 0, -a], s: [ancho, 0.3, largo] };
    segs.push(vidrio(i, n)
      ? html`<${VT} key=${i} ...${props} />`
      : html`<${B} key=${i} m="B" ...${props} c=${color} />`);
  }
  return segs;
}

// Tímpano: pared con forma de segmento de círculo que CIERRA el extremo de la bóveda
function Timpano({ p, ry = 0, luz, flecha, color = COL.piedra, cristal = false }) {
  const geo = useMemo(() => {
    const { R } = arco(luz, flecha, 0);
    const forma = new THREE.Shape();
    forma.moveTo(-luz / 2, 0);
    for (let k = 1; k < 40; k++) {
      const u = -luz / 2 + (k / 40) * luz;
      forma.lineTo(u, flecha - R + Math.sqrt(R * R - u * u));
    }
    forma.lineTo(luz / 2, 0);
    forma.closePath();
    const g = new THREE.ExtrudeGeometry(forma, { depth: 0.3, bevelEnabled: false });
    g.translate(0, 0, -0.15);
    return g;
  }, [luz, flecha]);
  return html`<mesh geometry=${geo} position=${p} rotation=${[0, ry, 0]} castShadow=${!cristal} receiveShadow renderOrder=${cristal ? 4 : 0}>
    ${cristal
      ? html`<meshStandardMaterial color="#a9cbe0" transparent opacity=${0.62} roughness=${0.12} metalness=${0.35} depthWrite=${false} side=${THREE.DoubleSide} />`
      : html`<meshStandardMaterial color=${color} roughness=${0.75} side=${THREE.DoubleSide} />`}
  </mesh>`;
}

// Costilla metálica que sigue el arco del techo (eje z)
function Costilla({ cx, cz, luz, flecha, alto }) {
  const { R, yc, a0 } = arco(luz, flecha, alto);
  const n = 16, segs = [], r = R + 0.26; // por fuera de la cubierta
  for (let i = 0; i < n; i++) {
    const a = -a0 + (i + 0.5) * (2 * a0 / n);
    segs.push(html`<${B} key=${i} m="M" p=${[cx + r * Math.sin(a), yc + r * Math.cos(a), cz]} r=${[0, 0, -a]} s=${[(2 * a0 * r) / n + 0.05, 0.24, 0.32]} c=${COL.noche} />`);
  }
  return segs;
}

// ---------------- GIMNASIO CUBIERTO ----------------
function Gimnasio() {
  const cx = 49, cz = 0, w = 28, d = 24;
  const columnas = [];
  for (let x = cx - w / 2; x <= cx + w / 2 + 0.01; x += 4) for (const z of [cz - d / 2, cz + d / 2]) columnas.push(html`<${B} key=${'c' + x + z} m="M" p=${[x, 4.8, z]} s=${[0.3, 9.6, 0.3]} c=${COL.noche} />`);
  return html`<${G}>
    <${B} p=${[cx, 0.05, cz]} s=${[w, 0.1, d]} c="#c99a62" />
    <${Suelo} p=${[cx, cz + 1.5]} w=${25} d=${15.6} tex=${texPistaGym()} y=${0.11} />
    <${V} p=${[cx, 1.9, cz - d / 2]} s=${[w, 3.8, 0.08]} /><${V} p=${[cx, 1.9, cz + d / 2]} s=${[w, 3.8, 0.08]} />
    <${V} p=${[cx - w / 2, 1.9, cz]} s=${[0.08, 3.8, d]} /><${V} p=${[cx + w / 2, 1.9, cz]} s=${[0.08, 3.8, d]} />
    <${B} m="B" p=${[cx, 6.7, cz - d / 2]} s=${[w, 5.8, 0.3]} c=${COL.piedra} />
    <${B} m="B" p=${[cx, 6.7, cz + d / 2]} s=${[w, 5.8, 0.3]} c=${COL.piedra} />
    <${B} m="B" p=${[cx - w / 2, 6.7, cz]} s=${[0.3, 5.8, d]} c=${COL.piedra} />
    <${B} m="B" p=${[cx + w / 2, 6.7, cz]} s=${[0.3, 5.8, d]} c=${COL.piedra} />
    ${[-10, -6, -2, 2, 6, 10].map(x => html`<${B} key=${'l' + x} m="B" p=${[cx + x, 6.7, cz + d / 2 + 0.22]} s=${[0.16, 5.6, 0.25]} c=${COL.madera} />`)}
    ${columnas}
    <${Panel} p=${[cx - 9.5, 7.6, cz + d / 2 + 0.37]} w=${3.2} h=${3.2} transp tex=${texLogo()} />
    <${Panel} p=${[cx + 2.5, 7.6, cz + d / 2 + 0.37]} w=${12} h=${1.45} transp tex=${texRotuloTexto('GIMNASIO', '#ffffff')} />
    <${Canasta} p=${[cx - 12.3, 0, cz + 1.5]} lado=${1} />
    <${Canasta} p=${[cx + 12.3, 0, cz + 1.5]} lado=${-1} />
    <${Gradas} p=${[cx, 0.1, cz - 7.6]} largo=${24} filas=${4} publico=${10} seed=${1500} />
    <${Pantalla} p=${[cx - w / 2 + 0.25, 6.4, cz + 1.5]} r=${[0, PI / 2, 0]} w=${5} h=${2.8} tex=${texPantalla('marcador')} />
    ${[[-4, -2], [-3.5, 5], [-8, 2], [4, -1], [3.5, 5.5], [8, 2.5]].map(([dx, dz], i) => html`<${Alumno} key=${'v' + i} p=${[cx + dx, 0.1, cz + 1.5 + dz]}
      ry=${dx < 0 ? PI / 2 : -PI / 2} pose=${i % 3 === 0 ? 'saltando' : 'corriendo'} deporte=${dx < 0 ? true : '#c9a978'} seed=${1600 + i}
      ruta=${i % 3 === 0 ? null : { tipo: 'vaiven', c: [cx + dx, cz + 1.5 + dz], ax: 1.6, az: 1.6, w1: 0.6 + i * 0.1, w2: 0.5 }} />`)}
    <${Balon} radio=${0.12} mover=${(p, t) => p.set(cx + Math.sin(t * 0.9) * 6, 0.4 + Math.abs(Math.sin(t * 2.6)) * 1.6, cz + 1.5 + Math.sin(t * 0.7) * 3)} />
    <${B} p=${[cx + 9, 0.13, cz - 5.4]} s=${[2.0, 0.06, 1.2]} c=${COL.elec} /><${B} p=${[cx + 9, 0.13, cz - 4.0]} s=${[2.0, 0.06, 1.2]} c=${COL.noche} />
    <${Alumno} p=${[cx + 9, 0.16, cz - 4.6]} ry=${-PI / 2} pose="sentado_suelo" deporte seed=${1650} />
    <${TechoMovil} y=${0} ids=${['gimnasio']}>
      <${Boveda} cx=${cx} cz=${cz} largo=${w + 1.2} luz=${d + 0.6} flecha=${3.1} alto=${9.6} eje="x" color="#e9e6df"
        vidrio=${(i, n) => i >= n / 2 - 2 && i < n / 2 + 2} />
      <${Timpano} p=${[cx - w / 2, 9.6, cz]} ry=${PI / 2} luz=${d} flecha=${3} />
      <${Timpano} p=${[cx + w / 2, 9.6, cz]} ry=${PI / 2} luz=${d} flecha=${3} />
      <${B} m="M" p=${[cx, 9.65, cz - d / 2]} s=${[w + 1.2, 0.16, 0.36]} c=${COL.noche} />
      <${B} m="M" p=${[cx, 9.65, cz + d / 2]} s=${[w + 1.2, 0.16, 0.36]} c=${COL.noche} />
      <${B} m="M" p=${[cx, 12.92, cz]} s=${[w + 1.3, 0.18, 0.6]} c=${COL.noche} />
    <//>
  <//>`;
}

// ---------------- PISCINA OLÍMPICA CUBIERTA Y CLIMATIZADA ----------------
function Agua({ p, w, d }) {
  const ref = useRef();
  useFrame(({ clock }) => { if (ref.current) ref.current.material.opacity = 0.55 + Math.sin(clock.elapsedTime * 1.3) * 0.04; });
  return html`<mesh ref=${ref} position=${p} rotation=${[-PI / 2, 0, 0]} renderOrder=${3}>
    <planeGeometry args=${[w, d]} />
    <meshStandardMaterial color="#0f86c6" transparent opacity=${0.55} roughness=${0.05} metalness=${0.25} depthWrite=${false} envMapIntensity=${1.5} />
  </mesh>`;
}

function Piscina() {
  // Nave de 30 × 60 m; vaso olímpico de 50 × 21 m (8 calles).
  // Se dibuja a lo largo de z y luego se gira: queda en x 10→70, z 15→45
  const cx = 0, cz = 0, W = 30, D = 60, pw = 21, pd = 50;
  const x0 = cx - pw / 2, x1 = cx + pw / 2, z0 = cz - pd / 2, z1 = cz + pd / 2;
  const cuerdas = [];
  for (let i = 1; i < 8; i++) {
    const x = x0 + i * (pw / 8);
    cuerdas.push(html`<${C} key=${'a' + i} p=${[x, 0.05, cz]} r=${[PI / 2, 0, 0]} s=${[0.09, pd, 0.09]} c=${i % 2 ? '#c9a978' : '#ffffff'} />`);
  }
  const columnas = [];
  for (let z = cz - D / 2; z <= cz + D / 2 + 0.01; z += 6) for (const x of [cx - W / 2, cx + W / 2]) columnas.push(html`<${B} key=${'k' + x + z} m="M" p=${[x, 3.5, z]} s=${[0.3, 7, 0.3]} c=${COL.noche} />`);
  return html`<${G}>
    <${B} p=${[cx, 0.1, cz - 27.75]} s=${[W, 0.2, 4.5]} c="#ece6da" />
    <${B} p=${[cx, 0.1, cz + 27.75]} s=${[W, 0.2, 4.5]} c="#ece6da" />
    <${B} p=${[cx - 12.75, 0.1, cz]} s=${[4.5, 0.2, pd]} c="#ece6da" />
    <${B} p=${[cx + 12.75, 0.1, cz]} s=${[4.5, 0.2, pd]} c="#ece6da" />
    <${Suelo} p=${[cx, cz]} w=${pd} d=${pw} tex=${texPiscinaFondo()} y=${-1.8} r=${PI / 2} />
    <${B} p=${[cx, -0.8, z0 - 0.05]} s=${[pw, 2, 0.1]} c="#5fc0e8" /><${B} p=${[cx, -0.8, z1 + 0.05]} s=${[pw, 2, 0.1]} c="#5fc0e8" />
    <${B} p=${[x0 - 0.05, -0.8, cz]} s=${[0.1, 2, pd]} c="#5fc0e8" /><${B} p=${[x1 + 0.05, -0.8, cz]} s=${[0.1, 2, pd]} c="#5fc0e8" />
    <${Agua} p=${[cx, 0.02, cz]} w=${pw} d=${pd} />
    ${cuerdas}
    ${[...Array(8)].map((_, i) => html`<${B} key=${'p' + i} m="B" p=${[x0 + (i + 0.5) * (pw / 8), 0.55, z1 + 0.5]} s=${[0.55, 0.7, 0.6]} c=${COL.blanco} />`)}
    ${[1, 2, 4, 5, 6].map((carril, i) => html`<${Alumno} key=${'n' + i} p=${[0, -0.08, 0]} pose="nadando" banador seed=${1800 + i}
      velocidad=${0.8 + i * 0.1} ruta=${{ tipo: 'linea', a: [x0 + (carril + 0.5) * (pw / 8), z0 + 1.5], b: [x0 + (carril + 0.5) * (pw / 8), z1 - 1.5], vel: 1.2 }} />`)}
    <${Gradas} p=${[cx - W / 2 + 4.6, 0.2, cz]} r=${[0, PI / 2, 0]} largo=${40} filas=${3} publico=${9} seed=${1830} />
    <${G} p=${[x1 + 2.2, 0.2, cz]}>
      ${[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => html`<${B} key=${i} m="B" p=${[a * 0.35, 0.9, b * 0.35]} s=${[0.07, 1.8, 0.07]} c=${COL.blanco} />`)}
      <${B} m="B" p=${[0, 1.8, 0]} s=${[0.8, 0.08, 0.8]} c=${COL.blanco} />
    <//>
    <${Alumno} p=${[x1 + 2.2, 0.2, cz]} ry=${-PI / 2} pose="sentado" asiento=${1.84} adulto ropa=${{ sudadera: '#b84a55', ribete: '#b84a55', cremallera: '#b84a55' }} seed=${1813} />
    <${Alumno} p=${[x1 + 2.6, 0.2, cz + 12]} ry=${-PI / 2} pose="hablando" banador seed=${1814} />
    <${Alumno} p=${[x1 + 2.6, 0.2, cz + 13]} ry=${-PI / 2 + 0.4} pose="de_pie" banador seed=${1815} />
    <${V} p=${[cx - W / 2, 3.5, cz]} s=${[0.08, 7, D]} c="#d6e8f2" />
    <${V} p=${[cx + W / 2, 3.5, cz]} s=${[0.08, 7, D]} c="#d6e8f2" />
    <${B} m="B" p=${[cx, 3.5, cz - D / 2]} s=${[W, 7, 0.4]} c=${COL.piedra} />
    <${V} p=${[cx, 3.5, cz + D / 2]} s=${[W, 7, 0.08]} c="#d6e8f2" />
    <${B} m="B" p=${[cx, 0.45, cz + D / 2]} s=${[W, 0.9, 0.3]} c=${COL.piedra} />
    ${columnas}
    <${Panel} p=${[cx - 9, 5.4, cz + D / 2 + 0.06]} w=${2.6} h=${2.6} transp tex=${texLogo()} />
    <${B} m="B" p=${[cx + 3, 5.4, cz + D / 2 + 0.04]} s=${[15, 1.6, 0.06]} c=${COL.noche} />
    <${Panel} p=${[cx + 3, 5.4, cz + D / 2 + 0.08]} w=${13} h=${1.55} transp tex=${texRotuloTexto('PISCINA OLÍMPICA', '#ffffff')} />
    <${B} m="B" p=${[cx + W / 2 + 0.24, 5.6, cz + 2]} s=${[0.08, 2.3, 22]} c=${COL.noche} />
    <${Panel} p=${[cx + W / 2 + 0.3, 5.6, cz + 10.6]} r=${[0, PI / 2, 0]} w=${2.4} h=${2.4} transp tex=${texLogo()} />
    <${Panel} p=${[cx + W / 2 + 0.3, 5.6, cz + 0.6]} r=${[0, PI / 2, 0]} w=${16} h=${1.9} transp tex=${texRotuloTexto('PISCINA OLÍMPICA CLIMATIZADA', '#ffffff')} />
    <${TechoMovil} y=${0} ids=${['piscina', 'gimnasio']}>
      <${Boveda} cx=${cx} cz=${cz} largo=${D + 0.8} luz=${W + 0.6} flecha=${4.6} alto=${7} eje="z" color=${COL.blanco}
        vidrio=${(i, n) => i % 4 === 1 || i % 4 === 2} />
      <${Timpano} p=${[cx, 7, cz + D / 2]} luz=${W} flecha=${4.5} cristal />
      <${Timpano} p=${[cx, 7, cz - D / 2]} luz=${W} flecha=${4.5} color=${COL.piedra} />
      <${B} m="M" p=${[cx - W / 2, 7.05, cz]} s=${[0.3, 0.14, D + 0.6]} c=${COL.noche} />
      <${B} m="M" p=${[cx + W / 2, 7.05, cz]} s=${[0.3, 0.14, D + 0.6]} c=${COL.noche} />
      ${[-24, -12, 0, 12, 24].map(z => html`<${Costilla} key=${'v' + z} cx=${cx} cz=${cz + z} luz=${W + 0.6} flecha=${4.6} alto=${7} />`)}
    <//>
  <//>`;
}

// ---------------- CAMPO DE FÚTBOL ----------------
function Porteria({ p, lado }) {
  return html`<${G} p=${p} r=${[0, lado > 0 ? 0 : PI, 0]}>
    <${C} m="B" p=${[0, 1.22, -3.66]} s=${[0.12, 2.44, 0.12]} c="#ffffff" />
    <${C} m="B" p=${[0, 1.22, 3.66]} s=${[0.12, 2.44, 0.12]} c="#ffffff" />
    <${C} m="B" p=${[0, 2.44, 0]} r=${[PI / 2, 0, 0]} s=${[0.12, 7.44, 0.12]} c="#ffffff" />
    <${V} p=${[-1.0, 1.22, 0]} s=${[2.0, 2.44, 7.3]} c="#ffffff" />
  <//>`;
}

function Foco({ p, r }) {
  return html`<${G} p=${p} r=${r}>
    <${C} m="M" p=${[0, 7, 0]} s=${[0.35, 14, 0.35]} c=${COL.grisO} />
    <${B} m="B" p=${[0, 14.2, 0]} s=${[2.6, 1.2, 0.4]} c=${COL.blanco} />
    <${B} m="L" p=${[0, 14.2, 0.21]} s=${[2.4, 1.0, 0.02]} c="#fff7e6" />
  <//>`;
}

function Futbol() {
  const cx = -1, cz = -39;
  const jugadores = [];
  for (let i = 0; i < 10; i++) {
    const eq = i < 5;
    const fx = cx + (eq ? -1 : 1) * (5 + (i % 5) * 4.5), fz = cz + ((i * 7) % 5 - 2) * 5.5;
    jugadores.push(html`<${Alumno} key=${i} p=${[0, 0.07, 0]} pose="corriendo" deporte=${eq ? true : '#c9a978'} seed=${1900 + i}
      velocidad=${0.9} ruta=${{ tipo: 'vaiven', c: [fx, fz], ax: 4 + (i % 3) * 2, az: 3 + (i % 4), w1: 0.25 + (i % 5) * 0.04, w2: 0.2 + (i % 3) * 0.05 }} />`);
  }
  return html`<${G}>
    <${B} p=${[cx, 0.02, cz]} s=${[68, 0.04, 44]} c="#4f9a4c" />
    <${Suelo} p=${[cx, cz]} w=${64} d=${40} tex=${texCampoFutbol()} y=${0.045} />
    <${Porteria} p=${[cx - 31.5, 0, cz]} lado=${1} />
    <${Porteria} p=${[cx + 31.5, 0, cz]} lado=${-1} />
    ${jugadores}
    <${Alumno} p=${[cx - 30.6, 0.07, cz]} ry=${PI / 2} pose="portero" deporte="#14285a" seed=${1920} />
    <${Alumno} p=${[cx + 30.6, 0.07, cz]} ry=${-PI / 2} pose="portero" deporte="#14285a" seed=${1921} />
    <${Balon} c="#ffffff" radio=${0.13} mover=${(p, t) => p.set(cx + Math.sin(t * 0.3) * 18, 0.2 + Math.abs(Math.sin(t * 2.4)) * 0.6, cz + Math.sin(t * 0.47) * 10)} />
    <${Gradas} p=${[cx, 0, cz - 23.2]} largo=${34} filas=${4} publico=${12} seed=${1950} />
    <${B} m="B" p=${[cx, 4.6, cz - 25.6]} r=${[0.16, 0, 0]} s=${[38, 0.25, 5.2]} c=${COL.blanco} />
    ${[-16, -8, 0, 8, 16].map(x => html`<${B} key=${x} m="M" p=${[cx + x, 2.4, cz - 27.6]} s=${[0.25, 4.8, 0.25]} c=${COL.noche} />`)}
    <${Foco} p=${[cx - 35, 0, cz - 23]} r=${[0, PI * 0.25, 0]} />
    <${Foco} p=${[cx + 35, 0, cz - 23]} r=${[0, -PI * 0.25, 0]} />
    <${Foco} p=${[cx - 35, 0, cz + 23]} r=${[0, PI * 0.75, 0]} />
    <${Foco} p=${[cx + 35, 0, cz + 23]} r=${[0, -PI * 0.75, 0]} />
  <//>`;
}

// ---------------- CANCHA DE BALONCESTO ----------------
function Valla({ x0, x1, z0, z1, h = 3 }) {
  const w = x1 - x0, d = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  const postes = [];
  for (let x = x0; x <= x1 + 0.01; x += w / 6) for (const z of [z0, z1]) postes.push(html`<${C} key=${'a' + x + z} m="M" p=${[x, h / 2, z]} s=${[0.08, h, 0.08]} c=${COL.noche} />`);
  return html`<${G}>
    <${V} p=${[cx, h / 2, z0]} s=${[w, h, 0.03]} c="#e2e8f0" /><${V} p=${[cx, h / 2, z1]} s=${[w, h, 0.03]} c="#e2e8f0" />
    <${V} p=${[x0, h / 2, cz]} s=${[0.03, h, d]} c="#e2e8f0" /><${V} p=${[x1, h / 2, cz]} s=${[0.03, h, d]} c="#e2e8f0" />
    ${postes}
  <//>`;
}

function Baloncesto() {
  const cx = 50, cz = -27;
  return html`<${G}>
    <${B} p=${[cx, 0.03, cz]} s=${[30, 0.06, 19]} c="#3a4a6a" />
    <${Suelo} p=${[cx, cz]} w=${28} d=${15} tex=${texPistaBasket()} y=${0.065} />
    <${Canasta} p=${[cx - 13.4, 0, cz]} lado=${1} />
    <${Canasta} p=${[cx + 13.4, 0, cz]} lado=${-1} />
    <${Valla} x0=${cx - 15} x1=${cx + 15} z0=${cz - 9.5} z1=${cz + 9.5} h=${2.6} />
    ${[0, 1, 2, 3, 4].map(i => html`<${Alumno} key=${i} p=${[0, 0.07, 0]} pose="corriendo" deporte=${i % 2 ? '#c9a978' : true} seed=${2000 + i}
      velocidad=${0.8} ruta=${{ tipo: 'vaiven', c: [cx + 5 + (i % 3) * 1.5, cz + (i - 2) * 1.6], ax: 3.5, az: 3, w1: 0.45 + i * 0.05, w2: 0.38 + i * 0.04 }} />`)}
    <${Alumno} p=${[cx + 10.2, 0.07, cz]} ry=${PI / 2} pose="saltando" deporte seed=${2006} />
    <${Balon} mover=${(p, t) => p.set(cx + 8 + Math.sin(t * 0.9) * 4, 0.3 + Math.abs(Math.sin(t * 3.5)) * 1.1, cz + Math.sin(t * 0.7) * 3)} />
    <${Banco} p=${[cx - 6, 0.06, cz + 8.4]} r=${[0, PI, 0]} w=${2.4} /><${Banco} p=${[cx + 6, 0.06, cz + 8.4]} r=${[0, PI, 0]} w=${2.4} />
    <${Alumno} p=${[cx - 6.4, 0.06, cz + 8.4]} ry=${PI} pose="aplaudiendo" asiento=${0.45} seed=${2007} />
  <//>`;
}

export function Deportes() {
  return html`<${G}>
    <${Gimnasio} />
    <${G} p=${[40, 0, 30]} r=${[0, -PI / 2, 0]}><${Piscina} /><//>
    <${Futbol} />
    <${Baloncesto} />
    <${Zonas} planta="deporte" />
  <//>`;
}
