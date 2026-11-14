// =========================================================
// COLEGIO PABLO PICASSO · aplicación principal
// La presentación (arriba) funciona sin este archivo. Aquí se montan:
// · el campus 3D (carga progresiva), · el resto de secciones, · el asistente.
// =========================================================
import { html, createRoot } from './lib.js';
import { poner, seleccionar, abrirExplorador } from './estado.js';
import { SALAS, VISTAS } from './datos/salas.js';
import { saltarA, aMin, ponerRitmo, RITMOS } from './sim/reloj.js';
import { Sitio } from './ui/Secciones.js';
import { Campus3D } from './ui/Campus3D.js';
import { Asistente } from './ui/Asistente.js';

function montar() {
  // campus 3D: dentro de la sección (encima de la imagen de espera)
  const caja = document.getElementById('campus3d');
  const r3d = document.createElement('div');
  r3d.className = 'campus-raiz';
  caja.appendChild(r3d);
  createRoot(r3d).render(html`<${Campus3D} />`);
  // el resto del sitio
  createRoot(document.getElementById('raiz')).render(html`<${Sitio} />`);
  // el asistente (ventana encima de todo)
  const rc = document.createElement('div');
  document.body.appendChild(rc);
  createRoot(rc).render(html`<${Asistente} />`);
  enlaceDirecto();
}

// Enlaces directos: ?hora=10:00 · ?vista=completa|baja|primer|corte|deportes|residencia · ?sala=mates (&dentro=1) · ?ritmo=rapido · ?seccion=vida
function enlaceDirecto() {
  const q = new URLSearchParams(location.search);
  const h = q.get('hora');
  if (h && /^\d{1,2}:\d{2}$/.test(h)) saltarA(aMin(h), true);
  if (q.get('ritmo') && RITMOS[q.get('ritmo')]) ponerRitmo(q.get('ritmo'));
  if (q.get('techo') === '0') poner({ techo: false });
  const vista = q.get('vista'), sala = q.get('sala'), seccion = q.get('seccion');
  if (sala && SALAS[sala]) { if (window.__empezar3d) window.__empezar3d(); seleccionar(sala, { interior: q.get('dentro') === '1' }); }
  else if (vista && VISTAS[vista]) { if (window.__empezar3d) window.__empezar3d(); abrirExplorador(vista); }
  else if (seccion) setTimeout(() => { const el = document.getElementById(seccion); if (el) el.scrollIntoView(); }, 400);
}

montar();
