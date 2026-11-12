// =========================================================
// NUESTRA PRESENTACIÓN: las 12 diapositivas del PowerPoint dentro del sitio
// (anterior / siguiente, número de diapositiva, miniaturas, teclado,
//  deslizar con el dedo, pantalla completa y descarga del .pptx)
// =========================================================
import { html, useState, useEffect, useRef, useCallback } from '../lib.js';
import { DIAPOSITIVAS } from '../datos/contenido.js';
import { TEXTOS } from '../datos/diapositivas.js';
import { Icono } from './Iconos.js';

const N = 12;
const src = i => `img/diapositivas/diapositiva-${String(i + 1).padStart(2, '0')}.jpg`;
const PPTX = 'presentacion/nuestro_colegio_ideal.pptx';

export function Presentacion() {
  const [i, setI] = useState(0);
  const [completa, setCompleta] = useState(false);
  const [texto, setTexto] = useState(false);
  const caja = useRef();
  const toque = useRef(null);
  const ir = useCallback(d => setI(v => Math.min(N - 1, Math.max(0, v + d))), []);

  // Pantalla completa (con plan B para los teléfonos que no la permiten)
  const alternarCompleta = () => {
    const el = caja.current;
    if (!completa) {
      if (el.requestFullscreen) el.requestFullscreen().catch(() => setCompleta(true));
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else setCompleta(true);
    } else if (document.fullscreenElement || document.webkitFullscreenElement) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    } else setCompleta(false);
  };
  useEffect(() => {
    const f = () => setCompleta(!!(document.fullscreenElement || document.webkitFullscreenElement));
    document.addEventListener('fullscreenchange', f);
    document.addEventListener('webkitfullscreenchange', f);
    return () => { document.removeEventListener('fullscreenchange', f); document.removeEventListener('webkitfullscreenchange', f); };
  }, []);

  // Teclado: flechas cuando la presentación está a la vista o en pantalla completa
  useEffect(() => {
    const tecla = e => {
      const r = caja.current && caja.current.getBoundingClientRect();
      const aLaVista = r && r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.4;
      if (!completa && !aLaVista) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); ir(1); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); ir(-1); }
      if (e.key === 'Escape' && completa && !document.fullscreenElement) setCompleta(false);
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [completa]);

  // Precarga de la diapositiva siguiente
  useEffect(() => { if (i < N - 1) { const im = new Image(); im.src = src(i + 1); } }, [i]);

  return html`<div className=${'presentacion revelar' + (completa ? ' pseudo-completa' : '')} ref=${caja}>
    <div className="diapo-marco"
      onPointerDown=${e => { toque.current = e.clientX; }}
      onPointerUp=${e => { if (toque.current !== null) { const d = e.clientX - toque.current; if (Math.abs(d) > 50) ir(d < 0 ? 1 : -1); } toque.current = null; }}>
      ${Array.from({ length: N }, (_, k) => Math.abs(k - i) <= 1 ? html`<img key=${k} src=${src(k)} alt=${'Diapositiva ' + (k + 1) + ': ' + DIAPOSITIVAS[k]}
        className=${'diapo' + (k === i ? ' activa' : k < i ? ' antes' : ' despues')} draggable="false" />` : null)}
      <button className="diapo-flecha izq" onClick=${() => ir(-1)} disabled=${i === 0} aria-label="Diapositiva anterior"><${Icono} n="izq" /></button>
      <button className="diapo-flecha der" onClick=${() => ir(1)} disabled=${i === N - 1} aria-label="Diapositiva siguiente"><${Icono} n="der" /></button>
    </div>
    <div className="diapo-barra">
      <button className="btn btn-secundario btn-peq" onClick=${() => ir(-1)} disabled=${i === 0}><${Icono} n="izq" />Anterior</button>
      <span className="diapo-num" aria-live="polite"><b>${i + 1}</b> / ${N}</span>
      <button className="btn btn-secundario btn-peq" onClick=${() => ir(1)} disabled=${i === N - 1}>Siguiente<${Icono} n="der" /></button>
      <span className="diapo-espacio"></span>
      <button className="btn btn-texto btn-peq" onClick=${() => setTexto(!texto)} aria-expanded=${texto}><${Icono} n="libro" />${texto ? 'Ocultar el texto' : 'Ver el texto'}</button>
      <button className="btn btn-secundario btn-peq" onClick=${alternarCompleta}><${Icono} n=${completa ? 'salirPantalla' : 'pantalla'} />${completa ? 'Salir' : 'Pantalla completa'}</button>
      <a className="btn btn-primario btn-peq" href=${PPTX} download="Colegio_Pablo_Picasso_Nuestro_colegio_ideal.pptx"><${Icono} n="descarga" />Descargar (.pptx)</a>
    </div>
    ${texto ? html`<div className="diapo-texto">${(TEXTOS[i] || []).map((l, k) => html`<p key=${k} className=${k === 0 ? 'tit' : ''}>${l}</p>`)}</div>` : null}
    <div className="diapo-miniaturas" role="tablist" aria-label="Diapositivas">
      ${Array.from({ length: N }, (_, k) => html`<button key=${k} role="tab" aria-selected=${k === i} className=${k === i ? 'activa' : ''} onClick=${() => setI(k)} aria-label=${'Ir a la diapositiva ' + (k + 1)}>
        <img src=${src(k)} alt="" loading="lazy" /><span>${k + 1}</span>
      </button>`)}
    </div>
  </div>`;
}
