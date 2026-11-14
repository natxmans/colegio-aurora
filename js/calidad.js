// =========================================================
// LOS TRES NIVELES DE CALIDAD DE LA MAQUETA 3D
// El diagnóstico del aparato (js/diagnostico.js, al cargar la página) propone uno;
// el visitante puede cambiarlo. El campus se vuelve a montar con el nuevo nivel.
// =========================================================
export const NIVELES = {
  alta: {
    t: 'Alta', desc: 'Modelos detallados, sombras, todas las animaciones y todos los alumnos.',
    dpr: [1, 1.75], sombras: true, mapaSombra: 2048, alumnos: 44, reflejos: true, detalle: true, animLejos: 2,
  },
  normal: {
    t: 'Normal', desc: 'Detalles intermedios, sombras más sencillas y animaciones normales.',
    dpr: [1, 1.25], sombras: true, mapaSombra: 1024, alumnos: 32, reflejos: true, detalle: true, animLejos: 3,
  },
  ligera: {
    t: 'Ligera', desc: 'Menos detalles y efectos, menos personajes y animaciones simplificadas.',
    dpr: [1, 1], sombras: false, mapaSombra: 512, alumnos: 16, reflejos: false, detalle: false, animLejos: 5,
  },
};

const CLAVE = 'colegio-calidad';
export function calidadGuardada() {
  try { const v = localStorage.getItem(CLAVE); return NIVELES[v] ? v : null; } catch (e) { return null; }
}
export function guardarCalidad(v) {
  try { if (v) localStorage.setItem(CLAVE, v); else localStorage.removeItem(CLAVE); } catch (e) { /* sin almacenamiento */ }
}
// Calidad elegida: ?calidad=... en la dirección > elección guardada > propuesta del diagnóstico
export function calidadInicial() {
  const q = new URLSearchParams(location.search).get('calidad');
  if (NIVELES[q]) return q;
  return calidadGuardada() || (window.__diag && window.__diag.calidad) || 'normal';
}
