// Estado global muy simple (sin librerías) + acciones de la visita 3D
// (este archivo no carga Three.js: la página y la presentación funcionan sin 3D)
import { useSyncExternalStore } from './lib.js';
import { SALAS, VISTAS, camaraSala, camaraInterior } from './datos/salas.js';

let estado = {
  modo: 'inicio',      // 'inicio' (página) | 'explorar' (visita 3D a pantalla completa)
  vista: 'completa',   // 'completa' | 'baja' | 'primer' | 'corte' | 'deportes' | 'residencia'
  resVista: null,      // residencia: null | 'res1' (primer piso) | 'res0' (planta baja)
  techo: true,
  verPersonas: true,  // mostrar los personajes (si se ocultan, la vida sigue igual)
  sel: null,           // id de la sala seleccionada
  interior: false,     // cámara dentro de la sala
  noche: false,        // lo calcula la simulación (sol bajo el horizonte)
  hover: null,
  guiada: false,
  lugares: false,
  campusVisible: false, // la sección del campus está en pantalla
  persona: null,       // persona seleccionada (ficha + asistente)
  seguir: null,        // persona que sigue la cámara
  chat: null,          // persona con la que se habla (asistente IA)
  calidad: null,       // 'alta' | 'normal' | 'ligera'
  aviso: null,         // mensaje corto en la vista 3D
  listo3d: false,
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

// ¿El navegador puede mostrar 3D (WebGL)? Se comprueba una sola vez
let _webgl = null;
export function hayWebGL() {
  if (_webgl === null) {
    if (window.__diag && typeof window.__diag.webgl === 'boolean') _webgl = window.__diag.webgl;
    else {
      try {
        const c = document.createElement('canvas');
        _webgl = !!(c.getContext('webgl2') || c.getContext('webgl'));
      } catch (e) { _webgl = false; }
    }
  }
  return _webgl;
}

// Cámara: la escena 3D rellena camara.ctrl y camara.encuadre cuando está lista.
// fov: ángulo de visión deseado (las vistas generales usan un ángulo más cerrado)
export const FOV_BASE = 45;
export const camara = { ctrl: null, introHecha: false, fov: FOV_BASE, encuadre: null, pendiente: null };

export function volar(v, suave = true) {
  const c = camara.ctrl;
  if (!v) return;
  if (!c || !camara.encuadre) { camara.pendiente = v; return; }
  if (v.ajuste) v = camara.encuadre(v);
  camara.fov = v.fov || FOV_BASE;
  c.setFocalOffset(-(v.desp || 0), 0, 0, suave);
  c.setLookAt(v.pos[0], v.pos[1], v.pos[2], v.mira[0], v.mira[1], v.mira[2], suave);
}

function modoExplorar() {
  document.documentElement.classList.add('explorando');
}

export function abrirExplorador(vista = 'completa') {
  modoExplorar();
  poner({ modo: 'explorar', vista, sel: null, interior: false, lugares: false, guiada: false, resVista: vista === 'residencia' ? 'res1' : null });
  volar(VISTAS[vista]);
}

export function volverInicio() {
  document.documentElement.classList.remove('explorando');
  poner({ modo: 'inicio', vista: 'completa', sel: null, interior: false, guiada: false, lugares: false, hover: null, techo: true, resVista: null, seguir: null });
  document.body.style.cursor = '';
  volar(VISTAS.completa);
  const el = document.getElementById('campus');
  if (el) el.scrollIntoView({ block: 'start' });
}

export function cambiarVista(vista) {
  poner({ vista, sel: null, interior: false, seguir: null, resVista: vista === 'residencia' ? 'res1' : null });
  volar(VISTAS[vista]);
}

export function verResidencia(planta) {
  poner({ vista: 'completa', resVista: planta, sel: null, interior: false, seguir: null });
  volar(VISTAS.residencia);
}

export function seleccionar(id, opciones = {}) {
  const s = SALAS[id];
  if (!s) return;
  if (estado.modo !== 'explorar') modoExplorar();
  let vista = estado.vista, resVista = null;
  if (s.planta === 'baja') vista = 'baja';
  else if (s.planta === 'primer') vista = 'primer';
  else if (s.planta === 'res0' || s.planta === 'res1') { vista = 'completa'; resVista = s.planta; }
  else if (s.planta === 'residencia') { vista = 'completa'; resVista = 'res1'; }
  else vista = 'completa';
  const interior = !!opciones.interior;
  poner({ modo: 'explorar', sel: id, vista, resVista, interior, seguir: null, lugares: opciones.mantenerLugares ? estado.lugares : false });
  const v = s.planta === 'residencia' ? VISTAS.residencia : interior ? camaraInterior(s) : camaraSala(s);
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
  poner({ sel: null, interior: false, guiada: false, resVista: null });
  volar(VISTAS[estado.vista] || VISTAS.completa);
}

export const alternarTecho = () => poner({ techo: !estado.techo });
export const alternarLugares = () => poner({ lugares: !estado.lugares });
