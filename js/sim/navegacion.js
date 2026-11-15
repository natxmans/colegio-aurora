// =========================================================
// PLANO DE NAVEGACIÓN: por dónde pueden caminar las personas
// Se construye A PARTIR DE LA MAQUETA: cada muro, cristal, mueble o árbol
// bloquea las casillas que ocupa (más el ancho de una persona). Así nadie
// atraviesa un muro: los caminos pasan por las puertas y los pasillos.
// · Capa 0: el suelo (exteriores + plantas bajas)
// · Capa 1: primer piso del edificio principal (y = 4.2)
// · Capa 2: primer piso de la residencia (y = 3.8)
// Las escaleras unen las capas. Los caminos se calculan con A* y se suavizan.
// =========================================================

const CEL = 0.25;          // tamaño de una casilla (m)
const RADIO = 0.22;        // radio de una persona (m)
const PASO_MAX = 0.26;     // escalón que se puede subir sin escalera (m)

export const NAV = { listo: false, capas: [], escaleras: [], piezas: 0, ms: 0 };

class Capa {
  constructor(id, x0, z0, x1, z1, y, sueloPorDefecto) {
    Object.assign(this, { id, x0, z0, y });
    this.nx = Math.ceil((x1 - x0) / CEL); this.nz = Math.ceil((z1 - z0) / CEL);
    this.n = this.nx * this.nz;
    this.bloq = new Uint8Array(this.n);       // 1 = obstáculo (con el ancho de una persona)
    this.duro = new Uint8Array(this.n);       // 1 = dentro de un muro o de un mueble (sin margen)
    this.suelo = new Float32Array(this.n).fill(sueloPorDefecto ? y : -99); // altura del suelo
    this.offset = 0;
  }
  celda(x, z) {
    const i = Math.floor((x - this.x0) / CEL), k = Math.floor((z - this.z0) / CEL);
    if (i < 0 || k < 0 || i >= this.nx || k >= this.nz) return -1;
    return k * this.nx + i;
  }
  cx(c) { return this.x0 + ((c % this.nx) + 0.5) * CEL; }
  cz(c) { return this.z0 + (Math.floor(c / this.nx) + 0.5) * CEL; }
  libreC(c) { return c >= 0 && this.bloq[c] === 0 && this.suelo[c] > this.y - 0.5; }
  libre(x, z) { return this.libreC(this.celda(x, z)); }
  altura(x, z) { const c = this.celda(x, z); return c < 0 || this.suelo[c] < -50 ? this.y : this.suelo[c]; }
  // recorre las casillas de un rectángulo (con borde extra) y llama f(c)
  rect(ax0, az0, ax1, az1, f) {
    const i0 = Math.max(0, Math.floor((ax0 - this.x0) / CEL - 0.5 + 0.5)), i1 = Math.min(this.nx - 1, Math.floor((ax1 - this.x0) / CEL));
    const k0 = Math.max(0, Math.floor((az0 - this.z0) / CEL)), k1 = Math.min(this.nz - 1, Math.floor((az1 - this.z0) / CEL));
    for (let k = k0; k <= k1; k++) {
      const zc = this.z0 + (k + 0.5) * CEL;
      if (zc < az0 || zc > az1) continue;
      for (let i = i0; i <= i1; i++) {
        const xc = this.x0 + (i + 0.5) * CEL;
        if (xc < ax0 || xc > ax1) continue;
        f(k * this.nx + i);
      }
    }
  }
}

// Medio tamaño de cada geometría "unidad" del kit
const MITAD = { caja: [0.5, 0.5, 0.5], cil: [0.5, 0.5, 0.5], esfera: [0.5, 0.5, 0.5], cono: [0.5, 0.5, 0.5], tronco: [0.5, 0.5, 0.5], ico: [0.5, 0.5, 0.5], capsula: [0.5, 1, 0.5], toro: [0.59, 0.59, 0.09], vidrio: [0.5, 0.5, 0.5] };
function mitadDe(tipo) {
  if (tipo.startsWith('vidrio')) return MITAD.vidrio;
  for (const k of ['caja', 'cil', 'esfera', 'cono', 'tronco', 'ico', 'capsula', 'toro']) if (tipo.startsWith(k)) return MITAD[k];
  return MITAD.caja;
}

function aabb(o, h) {
  const e = o.matrixWorld.elements;
  // |M| * h  (caja alineada a los ejes que contiene la pieza girada)
  const cx = e[12], cy = e[13], cz = e[14];
  const ex = Math.abs(e[0]) * h[0] + Math.abs(e[4]) * h[1] + Math.abs(e[8]) * h[2];
  const ey = Math.abs(e[1]) * h[0] + Math.abs(e[5]) * h[1] + Math.abs(e[9]) * h[2];
  const ez = Math.abs(e[2]) * h[0] + Math.abs(e[6]) * h[1] + Math.abs(e[10]) * h[2];
  return [cx - ex, cy - ey, cz - ez, cx + ex, cy + ey, cz + ez];
}

// Construye el plano a partir de las piezas del kit (se llama una vez, con la escena montada)
// extra: { bloqueos: [{tipo:'rect'|'elipse', ...}], abiertos: [rects que siempre se pueden pisar], escaleras }
export function construir(KIT, extra) {
  const t0 = performance.now();
  const capas = [
    new Capa(0, -70, -74, 76, 82, 0, true),
    new Capa(1, -33.5, -12.5, 33.5, 12.5, 4.2, false),
    new Capa(2, -61, -21, -43, 21, 3.8, false),
  ];
  let off = 0;
  for (const c of capas) { c.offset = off; off += c.n; }
  NAV.total = off;
  let piezas = 0;
  for (const tipo in KIT.reg) {
    if (tipo[0] === 'a') continue; // piezas animadas: no son obstáculos
    const h = mitadDe(tipo);
    for (const o of KIT.reg[tipo]) {
      if (!o.parent) continue;
      piezas++;
      const [x0, y0, z0, x1, y1, z1] = aabb(o, h);
      for (const c of capas) {
        if (x1 < c.x0 || x0 > c.x0 + c.nx * CEL || z1 < c.z0 || z0 > c.z0 + c.nz * CEL) continue;
        const alto = y1 - y0, area = (x1 - x0) * (z1 - z0);
        const esSuelo = alto <= 0.5 && area >= 1.0 && y1 >= c.y - 0.15 && y1 <= c.y + PASO_MAX;
        if (esSuelo) { c.rect(x0, z0, x1, z1, k => { if (y1 > c.suelo[k]) c.suelo[k] = y1; }); continue; }
        if (y1 > c.y + 0.18 && y0 < c.y + 1.75) { c.rect(x0 - RADIO, z0 - RADIO, x1 + RADIO, z1 + RADIO, k => { c.bloq[k] = 1; }); c.rect(x0, z0, x1, z1, k => { c.duro[k] = 1; }); }
      }
    }
  }
  const c0 = capas[0];
  // fuera del campus solo se puede pisar el camino de la entrada
  for (let k = 0; k < c0.n; k++) {
    const x = c0.cx(k), z = c0.cz(k);
    const dentro = x > -67.6 && x < 73.6 && z > -69.6 && z < 49.8;
    const camino = Math.abs(x) < 4.6 && z >= 49.5;
    if (!dentro && !camino) c0.bloq[k] = 1;
  }
  for (const b of extra.bloqueos || []) {
    const c = capas[b.capa || 0];
    if (b.tipo === 'rect') c.rect(b.x0 - RADIO, b.z0 - RADIO, b.x1 + RADIO, b.z1 + RADIO, k => { c.bloq[k] = 1; });
    else if (b.tipo === 'elipse') c.rect(b.x - b.rx - 1, b.z - b.rz - 1, b.x + b.rx + 1, b.z + b.rz + 1, k => {
      const dx = (c.cx(k) - b.x) / (b.rx + RADIO), dz = (c.cz(k) - b.z) / (b.rz + RADIO);
      if (dx * dx + dz * dz < 1) c.bloq[k] = 1;
    });
  }
  NAV.capas = capas;
  NAV.escaleras = (extra.escaleras || []).map(e => ({ ...e }));
  // los dos extremos de cada escalera siempre se pueden pisar (pequeño rellano)
  for (const e of NAV.escaleras) {
    for (const [cap, x, z] of [[e.capaA, e.a[0], e.a[1]], [e.capaB, e.b[0], e.b[1]]]) {
      const c = capas[cap];
      c.rect(x - 0.2, z - 0.2, x + 0.2, z + 0.2, k => { c.bloq[k] = 0; if (c.suelo[k] < c.y - 0.5) c.suelo[k] = c.y; });
      e[cap === e.capaA ? 'celA' : 'celB'] = c.offset + c.celda(x, z);
    }
  }
  NAV.piezas = piezas;
  NAV.ms = Math.round(performance.now() - t0);
  NAV.listo = true;
  prepararBusqueda();
  return NAV;
}

export const capa = (i) => NAV.capas[i];
export function dentroDeMuro(ci, x, z) { const c = NAV.capas[ci]; if (!c) return false; const k = c.celda(x, z); return k >= 0 && c.duro[k] === 1; }
export function libre(ci, x, z) { const c = NAV.capas[ci]; return !!c && c.libre(x, z); }
export function altura(ci, x, z) { const c = NAV.capas[ci]; return c ? c.altura(x, z) : 0; }

// Casilla libre más cercana (búsqueda en espiral, hasta "max" metros)
export function cercaLibre(ci, x, z, max = 3) {
  const c = NAV.capas[ci];
  if (!c) return null;
  if (c.libre(x, z)) return [x, z];
  const r = Math.ceil(max / CEL);
  let mejor = null, md = 1e9;
  for (let d = 1; d <= r; d++) {
    for (let a = -d; a <= d; a++) for (const [dx, dz] of [[a, -d], [a, d], [-d, a], [d, a]]) {
      const px = x + dx * CEL, pz = z + dz * CEL;
      if (!c.libre(px, pz)) continue;
      const dd = dx * dx + dz * dz;
      if (dd < md) { md = dd; mejor = [c.cx(c.celda(px, pz)), c.cz(c.celda(px, pz))]; }
    }
    if (mejor) return mejor;
  }
  return null;
}

// ¿Se ve un punto desde otro sin pasar por un obstáculo? (misma capa)
export function visible(ci, ax, az, bx, bz) {
  const c = NAV.capas[ci];
  const L = Math.hypot(bx - ax, bz - az);
  const n = Math.ceil(L / (CEL * 0.5));
  for (let i = 1; i < n; i++) {
    const t = i / n;
    if (!c.libre(ax + (bx - ax) * t, az + (bz - az) * t)) return false;
  }
  return true;
}

// ---------------- Búsqueda de caminos (A*) ----------------
let G, CERR, PADRE, MARCA, VUELTA = 1, HEAP, HK, hn = 0;
function prepararBusqueda() {
  const N = NAV.total;
  G = new Float32Array(N); PADRE = new Int32Array(N); MARCA = new Uint32Array(N); CERR = new Uint32Array(N);
  HEAP = new Int32Array(1 << 18); HK = new Float32Array(1 << 18);
}
function push(i, f) {
  if (hn >= HEAP.length) { const h2 = new Int32Array(HEAP.length * 2); h2.set(HEAP); HEAP = h2; const k2 = new Float32Array(HK.length * 2); k2.set(HK); HK = k2; }
  let k = hn++;
  while (k > 0) { const p = (k - 1) >> 1; if (HK[p] <= f) break; HEAP[k] = HEAP[p]; HK[k] = HK[p]; k = p; }
  HEAP[k] = i; HK[k] = f;
}
function pop() {
  const r = HEAP[0], ul = HEAP[--hn], uf = HK[hn];
  let k = 0;
  while (true) {
    let c = 2 * k + 1; if (c >= hn) break;
    if (c + 1 < hn && HK[c + 1] < HK[c]) c++;
    if (HK[c] >= uf) break;
    HEAP[k] = HEAP[c]; HK[k] = HK[c]; k = c;
  }
  HEAP[k] = ul; HK[k] = uf;
  return r;
}
function capaDeIndice(g) { const cs = NAV.capas; for (let i = cs.length - 1; i >= 0; i--) if (g >= cs[i].offset) return cs[i]; return cs[0]; }

const D8 = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.4142], [1, -1, 1.4142], [-1, 1, 1.4142], [-1, -1, 1.4142]];

// Devuelve una lista de puntos [{x, z, capa, esc?}] o null
export const FALLOS = [];
function fallo(m, desde, hasta) { FALLOS.push({ m, d: [+desde.x.toFixed(1), +desde.z.toFixed(1), desde.capa], h: [+hasta.x.toFixed(1), +hasta.z.toFixed(1), hasta.capa] }); if (FALLOS.length > 60) FALLOS.shift(); return null; }
export function buscar(desde, hasta, maxNodos = 700000) {
  if (!NAV.listo) return null;
  const ca = NAV.capas[desde.capa], cb = NAV.capas[hasta.capa];
  // misma tolerancia para salir de un sitio que para llegar a él (si no, alguien podía llegar a una plaza y no poder salir)
  let pa = cercaLibre(desde.capa, desde.x, desde.z, 3), pb = cercaLibre(hasta.capa, hasta.x, hasta.z, 3);
  if (!pa) return fallo('inicio', desde, hasta);
  if (!pb) return fallo('destino', desde, hasta);
  const ini = ca.offset + ca.celda(pa[0], pa[1]), fin = cb.offset + cb.celda(pb[0], pb[1]);
  if (ini === fin) return [{ x: hasta.x, z: hasta.z, capa: hasta.capa }];
  VUELTA++; if (VUELTA > 4e9) { MARCA.fill(0); CERR.fill(0); VUELTA = 1; }
  hn = 0;
  const bx = pb[0], bz = pb[1];
  // heurística: distancia octil (si hay que cambiar de piso, pasando por la escalera más cercana)
  const esc = NAV.escaleras;
  const h = (cap, x, z) => {
    if (cap.id === cb.id) { const dx = Math.abs(x - bx), dz = Math.abs(z - bz); return (Math.max(dx, dz) + 0.4142 * Math.min(dx, dz)); }
    let m = 1e9;
    for (const e of esc) {
      let p1, p2;
      if (e.capaA === cap.id && e.capaB === cb.id) { p1 = e.a; p2 = e.b; }
      else if (e.capaB === cap.id && e.capaA === cb.id) { p1 = e.b; p2 = e.a; }
      else if (e.capaA === cap.id || e.capaB === cap.id) { p1 = e.capaA === cap.id ? e.a : e.b; p2 = p1; }
      else continue;
      const v = Math.hypot(x - p1[0], z - p1[1]) + Math.hypot(p2[0] - bx, p2[1] - bz);
      if (v < m) m = v;
    }
    return m === 1e9 ? Math.hypot(x - bx, z - bz) : m;
  };
  G[ini] = 0; MARCA[ini] = VUELTA; PADRE[ini] = -1;
  push(ini, h(ca, ca.cx(ini - ca.offset), ca.cz(ini - ca.offset)) * CEL / CEL);
  let nodos = 0, ok = false;
  while (hn > 0) {
    const g = pop();
    if (CERR[g] === VUELTA) continue;
    CERR[g] = VUELTA;
    if (g === fin) { ok = true; break; }
    if (++nodos > maxNodos) break;
    const cap = capaDeIndice(g), c = g - cap.offset;
    const i = c % cap.nx, k = (c - i) / cap.nx;
    const gg = G[g];
    for (const [di, dk, coste] of D8) {
      const ni = i + di, nk = k + dk;
      if (ni < 0 || nk < 0 || ni >= cap.nx || nk >= cap.nz) continue;
      const nc = nk * cap.nx + ni;
      if (!cap.libreC(nc)) continue;
      if (di && dk && (!cap.libreC(k * cap.nx + ni) || !cap.libreC(nk * cap.nx + i))) continue; // sin cortar esquinas
      // escalones: no subir más de PASO_MAX de golpe
      if (Math.abs(cap.suelo[nc] - cap.suelo[c]) > PASO_MAX) continue;
      const ng = cap.offset + nc, val = gg + coste * CEL;
      if (MARCA[ng] === VUELTA && val >= G[ng]) continue;
      MARCA[ng] = VUELTA; G[ng] = val; PADRE[ng] = g;
      push(ng, val + h(cap, cap.cx(nc), cap.cz(nc)) * 1.15);
    }
    // escaleras
    for (const e of esc) {
      let dest = -1, L = e.largo;
      if (e.celA === g) dest = e.celB; else if (e.celB === g) dest = e.celA;
      if (dest < 0) continue;
      const val = gg + L * 1.3;
      if (MARCA[dest] === VUELTA && val >= G[dest]) continue;
      MARCA[dest] = VUELTA; G[dest] = val; PADRE[dest] = g;
      const dc = capaDeIndice(dest), dl = dest - dc.offset;
      push(dest, val + h(dc, dc.cx(dl), dc.cz(dl)));
    }
  }
  if (!ok) return fallo(nodos > maxNodos ? 'nodos' : 'sin-salida', desde, hasta);
  // reconstruir
  const celdas = [];
  for (let g = fin; g !== -1; g = PADRE[g]) celdas.push(g);
  celdas.reverse();
  const pts = celdas.map(g => { const cap = capaDeIndice(g), c = g - cap.offset; return { x: cap.cx(c), z: cap.cz(c), capa: cap.id, g }; });
  // marcar los tramos de escalera
  for (let j = 1; j < pts.length; j++) if (pts[j].capa !== pts[j - 1].capa) pts[j].esc = true;
  // suavizar (línea de vista) sin saltar las escaleras
  const out = [pts[0]];
  let a = 0;
  while (a < pts.length - 1) {
    const sig = pts[a + 1];
    if (sig.esc || sig.capa !== pts[a].capa) { out.push(sig); a++; continue; }
    let lim = a + 1;
    while (lim + 1 < pts.length && !pts[lim + 1].esc && pts[lim + 1].capa === pts[a].capa) lim++;
    const ve = (j) => visible(pts[a].capa, pts[a].x, pts[a].z, pts[j].x, pts[j].z) && llano(pts[a], pts[j]);
    let b = a + 1;
    if (lim > a + 1 && ve(lim)) b = lim;
    else for (let j = a + 3; j <= lim; j += 3) { if (ve(j)) b = j; else break; }
    out.push(pts[b]);
    a = b;
  }
  out[0] = { x: desde.x, z: desde.z, capa: desde.capa };
  out.push({ x: hasta.x, z: hasta.z, capa: hasta.capa });
  return out.map(({ x, z, capa, esc }) => ({ x, z, capa, esc }));
}

// sin escalones grandes entre dos puntos (para el suavizado)
function llano(p, q) {
  const c = NAV.capas[p.capa];
  const L = Math.hypot(q.x - p.x, q.z - p.z), n = Math.ceil(L / CEL);
  let y = c.altura(p.x, p.z);
  for (let i = 1; i <= n; i++) {
    const t = i / n, y2 = c.altura(p.x + (q.x - p.x) * t, p.z + (q.z - p.z) * t);
    if (Math.abs(y2 - y) > PASO_MAX) return false;
    y = y2;
  }
  return true;
}
