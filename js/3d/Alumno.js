// =========================================================
// ALUMNOS EN 3D con el uniforme del Colegio Pablo Picasso
// Uniforme (según el PowerPoint): polo blanco con cuello azul,
// chaqueta azul marino con el logo y pantalón.
// Personaje articulado (hombros, codos, caderas, rodillas, cabeza)
// con muchas posturas: sentado, escribiendo, caminando, nadando...
// =========================================================
import { html, useRef, useMemo, useFrame, useLayoutEffect } from '../lib.js';
import { Pieza } from './kit.js';
import { azar } from './piezas.js';

const PIEL = ['#f5d3b8', '#ebbd98', '#d39b72', '#a8714b', '#6f4a2f'];
const PELO = ['#2b1d14', '#4a2f1d', '#7a4a26', '#c08a45', '#e3c27c', '#151515', '#6b2f1a'];

export const UNIFORME = {
  sudadera: '#14285a',  // chaqueta azul marino
  polo: '#ffffff',      // polo blanco
  cuello: '#1f4e9a',    // cuello azul del polo
  pantalon: '#1b2440',  // pantalón azul marino
  falda: '#1b2440',
  medias: '#1b2440',
  zapatilla: '#5a3a24', // zapatos marrones
  suela: '#2a1a10',
  logo: true,           // logo del colegio en el lado izquierdo del pecho
  ribete: '#14285a',
  cremallera: '#8f9ab3',
};
// Ropa de diario (fin de semana): sudadera gris, vaqueros y zapatillas blancas
export const ROPA_DIARIO = { sudadera: '#a9adb3', polo: '#a9adb3', cuello: '#9a9ea5', pantalon: '#4a6a9a', zapatilla: '#f2f2f2', suela: '#dcdcdc', logo: null, ribete: '#a9adb3', cremallera: '#a9adb3' };
const ADULTO = { sudadera: '#4b5363', pantalon: '#2a2f3a', polo: '#f1ede4', cuello: '#f1ede4', logo: null, ribete: '#4b5363', zapatilla: '#2a1d14', suela: '#1a120c', cremallera: '#4b5363' };
export const ROPA_RECEPCION = { sudadera: '#14285a', pantalon: '#1f2937', ribete: '#14285a', logo: true, cuello: '#ffffff' };

const P = (t, p, s, c, r) => html`<${Pieza} t=${t} p=${p} s=${s} c=${c} r=${r} />`;

// Posición sobre un recorrido (para los alumnos que se mueven)
function enRuta(ru, t) {
  const v = ru.vel ?? 1.2;
  if (ru.tipo === 'linea') {
    const [ax, az] = ru.a, [bx, bz] = ru.b;
    const L = Math.hypot(bx - ax, bz - az) || 1;
    let u = (t * v) % (2 * L);
    if (u > L) u = 2 * L - u;
    const k = u / L;
    return [ax + (bx - ax) * k, az + (bz - az) * k];
  }
  if (ru.tipo === 'circulo') {
    const ang = (t * v) / ru.r + (ru.fase || 0);
    return [ru.c[0] + Math.cos(ang) * ru.r, ru.c[1] + Math.sin(ang) * ru.r];
  }
  if (ru.tipo === 'ovalo') {
    const { L, R } = ru, P = 4 * L + 2 * Math.PI * R;
    let s = ((t * v) % P + P) % P;
    const [cx, cz] = ru.c;
    if (s < 2 * L) return [cx - L + s, cz + R];
    s -= 2 * L;
    if (s < Math.PI * R) { const a = Math.PI / 2 - s / R; return [cx + L + Math.cos(a) * R, cz + Math.sin(a) * R]; }
    s -= Math.PI * R;
    if (s < 2 * L) return [cx + L - s, cz - R];
    s -= 2 * L;
    const a = -Math.PI / 2 - s / R; return [cx - L + Math.cos(a) * R, cz + Math.sin(a) * R];
  }
  if (ru.tipo === 'rect') {
    // rectángulo con esquinas redondeadas (pista de atletismo)
    const { hx, hz, r } = ru, [cx, cz] = ru.c;
    const lx = 2 * (hx - r), lz = 2 * (hz - r), q = (Math.PI * r) / 2, P = 2 * lx + 2 * lz + 4 * q;
    let s = ((t * v) % P + P) % P;
    if (s < lx) return [cx - hx + r + s, cz + hz]; s -= lx;
    if (s < q) { const a = Math.PI / 2 - s / r; return [cx + hx - r + Math.cos(a) * r, cz + hz - r + Math.sin(a) * r]; } s -= q;
    if (s < lz) return [cx + hx, cz + hz - r - s]; s -= lz;
    if (s < q) { const a = -s / r; return [cx + hx - r + Math.cos(a) * r, cz - hz + r + Math.sin(a) * r]; } s -= q;
    if (s < lx) return [cx + hx - r - s, cz - hz]; s -= lx;
    if (s < q) { const a = -Math.PI / 2 - s / r; return [cx - hx + r + Math.cos(a) * r, cz - hz + r + Math.sin(a) * r]; } s -= q;
    if (s < lz) return [cx - hx, cz - hz + r + s]; s -= lz;
    const a = Math.PI - s / r; return [cx - hx + r + Math.cos(a) * r, cz + hz - r + Math.sin(a) * r];
  }
  // 'vaiven': movimiento libre de jugador
  const [cx, cz] = ru.c;
  return [cx + ru.ax * Math.sin(t * (ru.w1 || 0.7)), cz + ru.az * Math.sin(t * (ru.w2 || 0.53) + 1.3)];
}

function angulos(pose, t, asiento) {
  const s = Math.sin, mx = Math.max;
  const A = { cy: 0, tor: 0, cab: [0, 0.12 * s(t * 0.5)], hom: [[0.05, -0.1], [0.05, 0.1]], codo: [-0.15, -0.15], cad: [0, 0], rod: [0, 0], bote: 0 };
  const sentar = (alt = asiento) => { A.cy = alt + 0.068 - 0.88; A.cad = [-1.57, -1.57]; A.rod = [1.57, 1.57]; };
  switch (pose) {
    case 'sentado': sentar(); A.hom = [[-0.45, -0.04], [-0.45, 0.04]]; A.codo = [-0.8, -0.8]; A.cab = [-0.05 + 0.04 * s(t * 0.7), 0.15 * s(t * 0.3)]; break;
    case 'escribiendo': sentar(); A.tor = 0.12; A.hom = [[-0.6, 0.05], [-0.7, -0.05]]; A.codo = [-1.0, -0.9 + 0.09 * s(t * 7)]; A.cab = [0.32 + 0.03 * s(t * 0.8), 0.05 * s(t * 0.5)]; break;
    case 'tecleando': sentar(); A.tor = 0.06; A.hom = [[-0.75, 0.1], [-0.75, -0.1]]; A.codo = [-0.82 + 0.05 * s(t * 11), -0.82 + 0.05 * s(t * 13)]; A.cab = [0.08, 0.05 * s(t * 0.4)]; break;
    case 'leyendo': sentar(); A.hom = [[-0.95, 0.3], [-0.95, -0.3]]; A.codo = [-1.25, -1.25]; A.cab = [0.36, 0.04 * s(t * 0.5)]; break;
    case 'jugando': sentar(); A.hom = [[-0.6, 0.25], [-0.6, -0.25]]; A.codo = [-1.2 + 0.06 * s(t * 9), -1.2 + 0.06 * s(t * 8)]; A.cab = [0.05, 0]; A.tor = 0.05 * s(t * 2); break;
    case 'comiendo': { const k = mx(0, s(t * 1.5)); sentar(); A.hom = [[-0.5, 0.05], [-0.6 + 0.25 * k, -0.05]]; A.codo = [-0.9, -1.0 - 0.9 * k]; A.cab = [0.12 - 0.1 * k, 0]; break; }
    case 'charlando': sentar(); A.hom = [[-0.3, -0.05], [-0.5 + 0.2 * s(t * 1.3), 0.05]]; A.codo = [-0.8, -1.2 + 0.3 * s(t * 1.7)]; A.cab = [0, 0.45 * s(t * 0.4)]; break;
    case 'pedaleando': sentar(); A.tor = 0.35; A.hom = [[-1.1, 0], [-1.1, 0]]; A.codo = [-0.3, -0.3]; A.cad = [-1.15 + 0.35 * s(t * 5), -1.15 - 0.35 * s(t * 5)]; A.rod = [1.3 - 0.35 * s(t * 5), 1.3 + 0.35 * s(t * 5)]; break;
    case 'sentado_suelo': A.cy = 0.09 - 0.88; A.cad = [-1.45, -1.45]; A.rod = [0.25, 0.35]; A.hom = [[0.55, -0.15], [0.55, 0.15]]; A.codo = [0, 0]; A.tor = -0.15; A.cab = [0.15, 0.2 * s(t * 0.3)]; break;
    case 'caminando': { const w = s(t * 5); A.cad = [0.45 * w, -0.45 * w]; A.rod = [0.1 + 0.55 * mx(0, -w), 0.1 + 0.55 * mx(0, w)]; A.hom = [[-0.35 * w, -0.08], [0.35 * w, 0.08]]; A.codo = [-0.3, -0.3]; A.bote = 0.025 * Math.abs(Math.cos(t * 5)); A.cab = [0, 0.1 * s(t * 0.6)]; break; }
    case 'corriendo': case 'cinta': { const w = s(t * 9); A.tor = 0.18; A.cad = [0.85 * w, -0.85 * w]; A.rod = [0.3 + 1.1 * mx(0, -w), 0.3 + 1.1 * mx(0, w)]; A.hom = [[-0.8 * w, -0.1], [0.8 * w, 0.1]]; A.codo = [-1.4, -1.4]; A.bote = 0.07 * Math.abs(Math.cos(t * 9)); A.cab = [-0.1, 0]; break; }
    case 'nadando': A.hom = [[t * 3.2, 0], [t * 3.2 + Math.PI, 0]]; A.codo = [-0.25, -0.25]; A.cad = [0.25 * s(t * 9), -0.25 * s(t * 9)]; A.rod = [0.15, 0.15]; A.cab = [-0.3, 0.3 * s(t * 1.6)]; break;
    case 'tumbado': case 'durmiendo': A.hom = [[0, -0.12], [0, 0.12]]; A.codo = [-0.1, -0.1]; A.cab = [0, pose === 'durmiendo' ? 0.3 : 0.2 * s(t * 0.3)]; break;
    case 'saltando': { const k = mx(0, s(t * 3)); A.bote = 0.4 * k; A.hom = [[-2.7 + 0.3 * k, -0.1], [-2.7 + 0.3 * k, 0.1]]; A.codo = [-0.5, -0.5]; A.cad = [-0.35 * (1 - k), -0.35 * (1 - k)]; A.rod = [0.65 * (1 - k), 0.65 * (1 - k)]; A.cy = -0.06 * (1 - k); A.cab = [-0.3, 0]; break; }
    case 'pintando': A.hom = [[-0.5, -0.1], [-1.25 + 0.12 * s(t * 2.2), 0.15]]; A.codo = [-1.2, -0.5 + 0.2 * s(t * 3)]; A.cab = [0.05, 0.1 * s(t * 0.5)]; break;
    case 'hablando': A.hom = [[0.05, -0.12], [-0.4 + 0.15 * s(t * 1.7), 0.1]]; A.codo = [-0.2, -1.1 + 0.3 * s(t * 2.3)]; A.cab = [0, 0.3 * s(t * 0.7)]; break;
    case 'explicando': A.hom = [[-0.2, -0.1], [-1.4 + 0.2 * s(t * 1.2), 0.5]]; A.codo = [-0.3, -0.25]; A.cab = [0, 0.35 * s(t * 0.6)]; break;
    case 'saludando': A.hom = [[0.05, -0.12], [0, 2.6]]; A.codo = [-0.15, -0.3 + 0.35 * s(t * 6)]; A.cab = [-0.05, 0.1]; break;
    case 'pingpong': A.cy = -0.06; A.cad = [-0.35, -0.35]; A.rod = [0.6, 0.6]; A.tor = 0.2; A.hom = [[-0.4, -0.2], [-0.9 + 0.5 * s(t * 4), 0.35]]; A.codo = [-0.9, -0.9]; A.cab = [-0.15, 0]; break;
    case 'futbolin': A.cy = -0.04; A.cad = [-0.2, -0.2]; A.rod = [0.4, 0.4]; A.tor = 0.25; A.hom = [[-1.15, 0.1], [-1.15, -0.1]]; A.codo = [-0.35 + 0.15 * s(t * 6), -0.35 - 0.15 * s(t * 6)]; A.cab = [0.1, 0]; break;
    case 'vr': A.hom = [[-1.3 + 0.3 * s(t * 1.4), -0.25], [-1.2 + 0.3 * s(t * 1.1), 0.25]]; A.codo = [-0.3, -0.3]; A.cab = [-0.1 + 0.1 * s(t * 0.8), 0.6 * s(t * 0.5)]; break;
    case 'pesas': { const k = 0.5 + 0.5 * s(t * 2.4); A.hom = [[0.05, -0.15], [0.05, 0.15]]; A.codo = [-0.3 - 1.9 * k, -0.3 - 1.9 * k]; break; }
    case 'agachado': A.cy = -0.3; A.cad = [-1.3, -1.3]; A.rod = [1.9, 1.9]; A.tor = 0.45; A.hom = [[-1.2, -0.1], [-1.0 + 0.2 * s(t * 2), 0.1]]; A.codo = [-0.3, -0.3]; A.cab = [0.2, 0]; break;
    case 'portero': A.cy = -0.1; A.cad = [-0.45, -0.45]; A.rod = [0.8, 0.8]; A.tor = 0.25; A.hom = [[-0.6, -0.7 - 0.2 * s(t * 2)], [-0.6, 0.7 + 0.2 * s(t * 2)]]; A.codo = [-0.4, -0.4]; break;
    case 'aplaudiendo': sentar(); A.hom = [[-1.0, 0.35 + 0.15 * s(t * 10)], [-1.0, -0.35 - 0.15 * s(t * 10)]]; A.codo = [-0.9, -0.9]; A.cab = [-0.1, 0]; break;
    default: A.hom = [[0.05 + 0.03 * s(t * 1.1), -0.1], [0.05 - 0.03 * s(t * 1.1), 0.1]];
  }
  return A;
}

const SIN_MOVIMIENTO = new Set(['tumbado', 'durmiendo']);

export function Alumno({ p = [0, 0, 0], ry = 0, pose = 'de_pie', seed = 1, asiento = 0.42, ruta = null, ropa = null, adulto = false, objeto = null, falda = false, escala = 1, deporte = false, banador = false, velocidad = 1, logoTex = null }) {
  const a = useMemo(() => {
    const r = azar(seed);
    return { piel: PIEL[Math.floor(r() * PIEL.length)], pelo: PELO[Math.floor(r() * PELO.length)], estilo: Math.floor(r() * 4), falda: r() < 0.42, alt: 0.93 + r() * 0.1, fase: r() * 30, libro: ['#2a62b8', '#b84a55', '#d9a441', '#3f8a5a', '#8a4f8f'][Math.floor(r() * 5)] };
  }, [seed]);
  const R = adulto ? { ...UNIFORME, ...ADULTO, ...(ropa || {}) } : { ...UNIFORME, ...(ropa || {}) };
  const conFalda = !adulto && !deporte && !banador && falda === true;
  const piernas = conFalda ? R.medias : R.pantalon;
  const camiseta = deporte === true ? '#1f4e9a' : deporte;
  const col = {
    torso: banador ? '#14285a' : deporte ? camiseta : R.sudadera,
    brazo: banador ? a.piel : deporte ? camiseta : R.sudadera,
    antebrazo: banador || deporte ? a.piel : R.sudadera,
    muslo: banador ? '#14285a' : deporte ? '#14285a' : piernas,
    espinilla: banador ? a.piel : deporte ? '#f7f4ee' : piernas,
    pelo: banador ? '#f7f4ee' : a.pelo,
  };
  const raiz = useRef(), cuerpo = useRef(), torso = useRef(), cab = useRef();
  const hI = useRef(), hD = useRef(), cI = useRef(), cD = useRef(), pI = useRef(), pD = useRef(), rI = useRef(), rD = useRef();
  const rx0 = pose === 'nadando' ? Math.PI / 2 : (pose === 'tumbado' || pose === 'durmiendo') ? -Math.PI / 2 : 0;
  const sc = escala * (adulto ? 1.1 : a.alt);

  const grupos = [cuerpo, torso, cab, hI, hD, cI, cD, pI, pD, rI, rD];
  const aplicar = (A) => {
    if (!cuerpo.current) return;
    cuerpo.current.position.y = A.cy + A.bote;
    torso.current.rotation.x = A.tor;
    cab.current.rotation.set(A.cab[0], A.cab[1], 0);
    hI.current.rotation.set(A.hom[0][0], 0, A.hom[0][1]);
    hD.current.rotation.set(A.hom[1][0], 0, A.hom[1][1]);
    cI.current.rotation.x = A.codo[0]; cD.current.rotation.x = A.codo[1];
    pI.current.rotation.x = A.cad[0]; pD.current.rotation.x = A.cad[1];
    rI.current.rotation.x = A.rod[0]; rD.current.rotation.x = A.rod[1];
    for (const g of grupos) g.current.updateMatrix();
  };
  useLayoutEffect(() => { aplicar(angulos(pose, a.fase, asiento)); }, [pose, asiento]);
  useLayoutEffect(() => { if (raiz.current) raiz.current.updateMatrix(); });

  // Optimización: los alumnos lejanos se animan con menos frecuencia, los ocultos no se animan
  const cuenta = useRef(Math.floor(a.fase * 7) % 6);
  useFrame(({ clock, camera }) => {
    const r = raiz.current;
    if (!r) return;
    for (let q = r; q; q = q.parent) if (!q.visible) return;
    const e = r.matrixWorld.elements, cp = camera.position;
    const dx = e[12] - cp.x, dy = e[13] - cp.y, dz = e[14] - cp.z, d2 = dx * dx + dy * dy + dz * dz;
    const paso = d2 > 16000 ? 6 : d2 > 2500 ? 3 : 1;
    if (++cuenta.current % paso) return;
    const t = clock.elapsedTime * velocidad + a.fase;
    if (!SIN_MOVIMIENTO.has(pose)) aplicar(angulos(pose, t, asiento));
    if (ruta) {
      const [x, z] = enRuta(ruta, t);
      const [x2, z2] = enRuta(ruta, t + 0.06);
      r.position.set(x, p[1], z);
      if (Math.abs(x2 - x) + Math.abs(z2 - z) > 1e-4) r.rotation.set(rx0, Math.atan2(x2 - x, z2 - z), 0, 'YXZ');
      r.updateMatrix();
    }
  });

  const pierna = (pc, rc, x) => html`<group matrixAutoUpdate=${false} ref=${pc} position=${[x, 0.88, 0]}>
    ${P('aCapsula', [0, -0.205, 0], [0.13, 0.205, 0.13], col.muslo)}
    <group matrixAutoUpdate=${false} ref=${rc} position=${[0, -0.41, 0]}>
      ${P('aCapsula', [0, -0.2, 0], [0.11, 0.2, 0.11], col.espinilla)}
      ${!banador ? P('aCajaB', [0, -0.44, 0.045], [0.11, 0.075, 0.24], R.zapatilla) : null}
      ${!banador ? P('aCajaL', [0, -0.474, 0.045], [0.114, 0.018, 0.244], R.suela) : null}
    </group>
  </group>`;

  const enMano = (lado) => {
    if (objeto === 'pesas') return html`
      ${P('aCilM', [0, -0.3, 0], [0.035, 0.3, 0.035], '#64748b', [0, 0, Math.PI / 2])}
      ${P('aCilM', [-0.13, -0.3, 0], [0.12, 0.05, 0.12], '#111827', [0, 0, Math.PI / 2])}
      ${P('aCilM', [0.13, -0.3, 0], [0.12, 0.05, 0.12], '#111827', [0, 0, Math.PI / 2])}`;
    if (objeto === 'raqueta' && lado > 0) return html`${P('aCajaB', [0, -0.42, 0.05], [0.16, 0.2, 0.025], '#ef4444')}${P('aCil', [0, -0.3, 0.03], [0.03, 0.12, 0.03], '#7a5a40')}`;
    if (objeto === 'paleta' && lado < 0) return html`${P('aCaja', [0, -0.31, 0.1], [0.22, 0.012, 0.16], '#f5e6c8')}${P('aEsferaL', [0.05, -0.3, 0.12], [0.04, 0.02, 0.04], '#ef4444')}${P('aEsferaL', [-0.04, -0.3, 0.08], [0.04, 0.02, 0.04], '#3d8bff')}`;
    if (objeto === 'paleta' && lado > 0) return P('aCil', [0, -0.36, 0.06], [0.014, 0.2, 0.014], '#7a5a40', [0.7, 0, 0]);
    return null;
  };

  const brazo = (hc, cc, lado) => html`<group matrixAutoUpdate=${false} ref=${hc} position=${[lado * 0.215, 0.46, 0]}>
    ${P('aCapsula', [0, -0.145, 0], [0.095, 0.145, 0.095], col.brazo)}
    <group matrixAutoUpdate=${false} ref=${cc} position=${[0, -0.29, 0]}>
      ${P('aCapsula', [0, -0.13, 0], [0.085, 0.13, 0.085], col.antebrazo)}
      ${!banador && !deporte ? P('aCil', [0, -0.215, 0], [0.093, 0.03, 0.093], R.ribete) : null}
      ${P('aEsfera', [0, -0.29, 0], [0.085, 0.095, 0.085], a.piel)}
      ${enMano(lado)}
    </group>
  </group>`;

  const ojos = pose !== 'durmiendo';
  return html`<group matrixAutoUpdate=${false} ref=${raiz} position=${p} rotation=${[rx0, ry, 0, 'YXZ']} scale=${sc}>
    <group matrixAutoUpdate=${false} ref=${cuerpo}>
      ${pierna(pI, rI, -0.09)}
      ${pierna(pD, rD, 0.09)}
      ${conFalda ? P('aTronco', [0, 0.82, 0], [0.5, 0.3, 0.42], R.falda) : P('aCil', [0, 0.9, 0], [0.31, 0.17, 0.22], col.muslo)}
      <group matrixAutoUpdate=${false} ref=${torso} position=${[0, 0.9, 0]}>
        ${P('aCapsula', [0, 0.27, 0], [0.32, 0.27, 0.21], col.torso)}
        ${!banador && !deporte ? P('aCil', [0, 0.035, 0], [0.335, 0.05, 0.225], R.polo) : null}
        ${!banador ? P('aCil', [0, 0.55, 0], [0.17, 0.05, 0.14], deporte ? '#f7f4ee' : (R.cuello || R.polo)) : null}
        ${R.logo && !banador && !deporte ? (logoTex
          ? html`<mesh position=${[0.08, 0.39, 0.112]}><circleGeometry args=${[0.042, 40]} /><meshBasicMaterial map=${logoTex} transparent toneMapped=${false} /></mesh>`
          : html`${P('aCil', [0.08, 0.39, 0.103], [0.07, 0.012, 0.07], '#ffffff', [Math.PI / 2, 0, 0])}${P('aCil', [0.08, 0.39, 0.108], [0.05, 0.008, 0.05], '#1f4e9a', [Math.PI / 2, 0, 0])}`) : null}
        ${!adulto && !banador && !deporte ? P('aCaja', [0, 0.27, 0.106], [0.012, 0.36, 0.006], R.cremallera || '#8f9ab3') : null}
        <group matrixAutoUpdate=${false} ref=${cab} position=${[0, 0.6, 0]}>
          ${P('aCil', [0, 0, 0], [0.09, 0.1, 0.09], a.piel)}
          ${P('aEsfera', [0, 0.13, 0], [0.25, 0.25, 0.25], a.piel)}
          ${P('aPelo', [0, 0.14, -0.005], [0.272, 0.272, 0.272], col.pelo, [-0.45, 0, 0])}
          ${!banador && a.estilo === 1 ? P('aCapsula', [0, 0.04, -0.075], [0.24, 0.15, 0.11], a.pelo) : null}
          ${!banador && a.estilo === 2 ? P('aEsfera', [0, 0.1, -0.17], [0.09, 0.18, 0.09], a.pelo, [0.5, 0, 0]) : null}
          ${!banador && a.estilo === 3 ? P('aEsfera', [0, 0.27, -0.07], [0.12, 0.12, 0.12], a.pelo) : null}
          ${ojos ? P('aEsfera', [-0.045, 0.135, 0.112], [0.032, 0.036, 0.02], '#1d2233') : null}
          ${ojos ? P('aEsfera', [0.045, 0.135, 0.112], [0.032, 0.036, 0.02], '#1d2233') : null}
          ${P('aCaja', [0, 0.078, 0.119], [0.045, 0.009, 0.01], '#b4584a')}
          ${objeto === 'gafasvr' ? html`${P('aCajaB', [0, 0.14, 0.11], [0.24, 0.1, 0.1], '#1f2937')}${P('aCajaL', [0, 0.14, 0.162], [0.2, 0.025, 0.005], '#f3dfb2')}` : null}
          ${objeto === 'cascos' ? html`${P('aToro', [0, 0.15, 0], [0.28, 0.28, 0.28], '#14285a', [0, Math.PI / 2, 0])}` : null}
        </group>
        ${brazo(hI, cI, -1)}
        ${brazo(hD, cD, 1)}
        ${objeto === 'libro' ? P('aCaja', [0, 0.44, 0.42], [0.3, 0.22, 0.03], a.libro, [0.55, 0, 0]) : null}
        ${objeto === 'mando' ? P('aCajaB', [0, 0.36, 0.38], [0.17, 0.045, 0.09], '#1f2937') : null}
      </group>
    </group>
  </group>`;
}
