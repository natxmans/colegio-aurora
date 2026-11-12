// Estado global muy simple (sin librerías) + acciones de la visita
import { useSyncExternalStore, THREE } from './lib.js';
import { SALAS, VISTAS, CAJAS, camaraSala, camaraInterior } from './datos/salas.js';

let estado = {
  modo: 'inicio',      // 'inicio' (portada) | 'explorar' (visita 3D)
  vista: 'completa',   // 'completa' | 'baja' | 'primer' | 'corte'
  techo: true,
  sel: null,           // id de la sala seleccionada
  interior: false,     // cámara dentro de la sala
  noche: false,
  hover: null,
  guiada: false,
  lugares: false,
  heroVisible: true,
};
const subs = new Set();
export const leer = () => estado;
export function poner(p) {
  const n = typeof p === 'function' ? p(estado) : p;
  estado = { ...estado, ...n };
  subs.forEach(f => f());
}
const suscribir = f => { subs.add(f); return () => subs.delete(f); };
export function useEstado(sel) { return useSyncExternalStore(suscribir, () => sel(estado)); }

// Referencia a los controles de cámara (CameraControls de Drei)
export const camara = { ctrl: null, introHecha: false };

// Encuadre automático: busca la distancia para que la caja ocupe ~85 % de la pantalla
// (funciona igual en ordenador, tableta y teléfono)
const _v = new THREE.Vector3();
export function encuadre(v) {
  const c = camara.ctrl;
  const box = CAJAS[v.ajuste];
  const cam = c.camera.clone();
  // el lienzo 3D ocupa toda la ventana: usamos su tamaño real (también en teléfono)
  cam.aspect = Math.max(0.3, innerWidth / Math.max(1, innerHeight));
  cam.updateProjectionMatrix();
  const mira = new THREE.Vector3((box.x0 + box.x1) / 2, v.y ?? 1, (box.z0 + box.z1) / 2);
  // En teléfono (pantalla vertical) giramos la cámara: el campus, que es ancho, ocupa la altura
  const vertical = cam.aspect < 0.9 && v.ajuste === 'campus';
  const dir = new THREE.Vector3().setFromSphericalCoords(1, vertical ? Math.min(v.polar, 0.72) : v.polar, vertical ? v.azimut - 1.32 : v.azimut);
  const esquinas = [];
  for (const x of [box.x0, box.x1]) for (const y of [box.y0, box.y1]) for (const z of [box.z0, box.z1]) esquinas.push(new THREE.Vector3(x, y, z));
  const movil = cam.aspect < 0.9;
  const margen = (v.margen || 0.85) * (movil ? 1.04 : 1);
  let lo = 4, hi = 3000;
  for (let i = 0; i < 32; i++) {
    const d = (lo + hi) / 2;
    cam.position.copy(mira).addScaledVector(dir, d);
    cam.lookAt(mira); cam.updateMatrixWorld();
    let m = 0;
    for (const p of esquinas) {
      _v.copy(p).project(cam);
      if (_v.z > 1 || _v.z < -1) { m = 9; break; }
      m = Math.max(m, Math.abs(_v.x), _v.y > 0 ? _v.y * (movil ? 1.3 : 1.14) : -_v.y * (movil ? 1.1 : 1.0));
    }
    if (m > margen) lo = d; else hi = d;
  }
  const pos = mira.clone().addScaledVector(dir, hi);
  // En la portada (pantalla ancha), el campus se desplaza a la derecha para dejar sitio al texto
  const desp = !movil && v.desplazar ? (box.x1 - box.x0) * v.desplazar : 0;
  return { pos: pos.toArray(), mira: mira.toArray(), desp };
}

export function volar(v, suave = true) {
  const c = camara.ctrl;
  if (!c || !v) return;
  if (v.ajuste) v = encuadre(v);
  c.setFocalOffset(-(v.desp || 0), 0, 0, suave);
  c.setLookAt(v.pos[0], v.pos[1], v.pos[2], v.mira[0], v.mira[1], v.mira[2], suave);
}

function modoExplorar() {
  document.documentElement.classList.add('explorando');
  window.scrollTo(0, 0);
}

export function abrirExplorador(vista = 'completa') {
  modoExplorar();
  poner({ modo: 'explorar', vista, sel: null, interior: false, lugares: false, guiada: false });
  volar(VISTAS[vista]);
}

export function volverInicio() {
  document.documentElement.classList.remove('explorando');
  poner({ modo: 'inicio', vista: 'completa', sel: null, interior: false, guiada: false, lugares: false, hover: null, techo: true });
  document.body.style.cursor = '';
  volar(VISTAS.inicio);
}

export function cambiarVista(vista) {
  poner({ vista, sel: null, interior: false });
  volar(VISTAS[vista]);
}

export function seleccionar(id, opciones = {}) {
  const s = SALAS[id];
  if (!s) return;
  if (estado.modo !== 'explorar') modoExplorar();
  let vista = estado.vista;
  if (s.planta === 'baja') vista = 'baja';
  else if (s.planta === 'primer') vista = 'primer';
  else if (s.planta === 'edif') vista = 'completa';
  const interior = !!opciones.interior;
  poner({ modo: 'explorar', sel: id, vista, interior, lugares: opciones.mantenerLugares ? estado.lugares : false, noche: opciones.noche ?? estado.noche });
  const v = interior ? camaraInterior(s) : camaraSala(s);
  volar(v);
}

export function alternarInterior() {
  const s = SALAS[estado.sel];
  if (!s) return;
  const interior = !estado.interior;
  poner({ interior });
  volar(interior ? camaraInterior(s) : camaraSala(s));
}

export function cerrarSala() {
  poner({ sel: null, interior: false, guiada: false });
  volar(VISTAS[estado.vista] || VISTAS.completa);
}

export const alternarTecho = () => poner({ techo: !estado.techo });
export const alternarNoche = () => poner({ noche: !estado.noche });
export const alternarLugares = () => poner({ lugares: !estado.lugares });
