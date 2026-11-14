// Capa HTML con las etiquetas de los edificios (la colocación la hace la escena 3D)
import { html, useLayoutEffect } from '../lib.js';
import { useEstado, poner, seleccionar } from '../estado.js';
import { POR_PLANTA } from '../datos/salas.js';
import { capa } from '../compartido.js';

function listaVisible(vista, sel, modo, resVista) {
  if (sel) return [];
  if (resVista) return modo === 'explorar' ? POR_PLANTA[resVista] : [];
  if (modo !== 'explorar') return vista === 'completa' ? [...POR_PLANTA.edif, ...POR_PLANTA.residencia, ...POR_PLANTA.deporte, ...POR_PLANTA.exterior] : [];
  if (vista === 'baja') return POR_PLANTA.baja;
  if (vista === 'primer') return POR_PLANTA.primer;
  if (vista === 'completa' || vista === 'deportes') return [...POR_PLANTA.edif, ...POR_PLANTA.residencia, ...POR_PLANTA.deporte, ...POR_PLANTA.exterior];
  return [];
}

export function CapaEtiquetas() {
  const vista = useEstado(s => s.vista), sel = useEstado(s => s.sel), modo = useEstado(s => s.modo), hover = useEstado(s => s.hover), resVista = useEstado(s => s.resVista);
  const lista = listaVisible(vista, sel, modo, resVista);
  useLayoutEffect(() => () => capa.items.clear(), []);
  return html`<div className="capa-etiquetas" aria-hidden=${lista.length ? 'false' : 'true'}>
    ${lista.map((s, i) => html`<button key=${s.id} className=${'etq3d' + (hover === s.id ? ' hover' : '')} style=${{ '--c': s.color }}
      ref=${el => { if (el) capa.items.set(s.id, { s, el, orden: i, w: 0, h: 0 }); else capa.items.delete(s.id); }}
      onClick=${() => seleccionar(s.id)} onPointerEnter=${() => poner({ hover: s.id })} onPointerLeave=${() => poner({ hover: null })}>
      <i></i>${s.corto || s.nombre}
    </button>`)}
  </div>`;
}
