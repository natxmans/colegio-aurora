// Estado global muy simple (sin librerías) + acciones de la visita
import { useSyncExternalStore } from './lib.js';
import { SALAS, VISTAS, camaraSala, camaraInterior } from './datos/salas.js';

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

export function volar(v, suave = true) {
  const c = camara.ctrl;
  if (!c || !v) return;
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
