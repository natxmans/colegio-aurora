// =========================================================
// Interfaz de la VISITA 3D (botones, lista de lugares, ficha de cada sala)
// =========================================================
import { html, useEffect, useState, useRef } from '../lib.js';
import { useEstado, poner, leer, volverInicio, cambiarVista, seleccionar, cerrarSala, alternarInterior, alternarTecho, alternarNoche, alternarLugares } from '../estado.js';
import { SALAS, ZONAS, AULAS, ESPACIOS_PB, HABITACIONES, COMUNES_INT, POR_PLANTA, RECORRIDO } from '../datos/salas.js';
import { Icono, Logo } from './Iconos.js';
import { CapaEtiquetas } from '../3d/etiquetas.js';

const VISTAS_BTN = [
  { id: 'completa', t: 'Vista completa', i: 'cubo' },
  { id: 'baja', t: 'Planta baja', i: 'baja' },
  { id: 'primer', t: 'Primer piso', i: 'primer' },
  { id: 'corte', t: 'Vista en corte', i: 'corte' },
];

const INSIGNIA = {
  completa: ['VISTA COMPLETA', 'Gira, acerca y haz clic en un edificio'],
  baja: ['PLANTA BAJA', 'Aulas, laboratorios, biblioteca y comedor'],
  primer: ['PRIMER PISO', 'Todos los dormitorios y los salones'],
  corte: ['VISTA EN CORTE', 'Planta baja + primer piso'],
};

function zonaDe(s) {
  if (s.planta === 'baja') return ZONAS.baja;
  if (s.planta === 'primer') return ZONAS.primer;
  if (s.planta === 'deporte') return ZONAS.deporte;
  if (s.planta === 'edif') return ZONAS.edif;
  return ZONAS.exterior;
}

function Lugares() {
  const sel = useEstado(s => s.sel);
  const item = (s) => html`<button key=${s.id} className=${'lugar' + (sel === s.id ? ' activo' : '')} style=${{ '--c': s.color }} onClick=${() => seleccionar(s.id, { mantenerLugares: true })}><i></i>${s.nombre}</button>`;
  return html`<div className="lugares panel" role="dialog" aria-label="Lugares del colegio">
    <div className="lugares-cab"><h3>Lugares del colegio</h3><button className="cerrar" onClick=${alternarLugares} aria-label="Cerrar"><${Icono} n="cerrar" /></button></div>
    <div className="lugares-lista">
      <div className="grupo-lugares"><h4>Edificio y exteriores</h4>${[SALAS.edificio, ...POR_PLANTA.exterior].map(item)}</div>
      <div className="grupo-lugares"><h4>Planta baja · Aulas y laboratorios</h4>${AULAS.map(item)}</div>
      <div className="grupo-lugares"><h4>Planta baja · Biblioteca, entrada y comedor</h4>${ESPACIOS_PB.map(item)}</div>
      <div className="grupo-lugares"><h4>Primer piso · Habitaciones</h4>
        <div className="habs">${HABITACIONES.map(s => html`<button key=${s.id} className=${sel === s.id ? 'activo' : ''} onClick=${() => seleccionar(s.id, { mantenerLugares: true })}>${s.num}</button>`)}</div>
      </div>
      <div className="grupo-lugares"><h4>Primer piso · Salones</h4>${COMUNES_INT.map(item)}</div>
      <div className="grupo-lugares"><h4>Complejo deportivo</h4>${POR_PLANTA.deporte.map(item)}</div>
    </div>
  </div>`;
}

// Orden para los botones "Anterior / Siguiente"
const ORDEN = [SALAS.edificio, ...AULAS, ...ESPACIOS_PB, ...HABITACIONES, ...COMUNES_INT, ...POR_PLANTA.deporte, ...POR_PLANTA.exterior].map(s => s.id);

function Ficha() {
  const sel = useEstado(s => s.sel);
  const interior = useEstado(s => s.interior);
  const guiada = useEstado(s => s.guiada);
  const s = SALAS[sel];
  if (!s) return null;
  const z = zonaDe(s);
  const lista = guiada ? RECORRIDO : ORDEN;
  const i = lista.indexOf(sel);
  const ir = (d) => { const n = lista[(i + d + lista.length) % lista.length]; seleccionar(n); if (guiada) poner({ guiada: true }); };
  const puedeEntrar = s.planta === 'baja' || s.planta === 'primer' || !!s.interior;
  return html`<div className="info panel" key=${sel} role="dialog" aria-label=${s.nombre}>
    <div className="info-cab">
      <span className="chip" style=${{ '--c': z.color }}>${z.titulo} · ${z.sub}</span>
      <button className="cerrar" onClick=${cerrarSala} aria-label="Cerrar"><${Icono} n="cerrar" /></button>
    </div>
    <h3>${s.nombre}</h3>
    <p>${s.desc}</p>
    <div className="hay"><b>Aquí hay…</b><div className="chips">${s.hay.map(h => html`<span key=${h} className="chip" style=${{ '--c': s.color }}>${h}</span>`)}</div></div>
    <div className="info-acciones">
      ${s.id === 'edificio' ? html`
        <button className="btn btn-primario btn-peq" onClick=${() => cambiarVista('baja')}><${Icono} n="baja" />Ver la planta baja</button>
        <button className="btn btn-secundario btn-peq" onClick=${() => cambiarVista('primer')}><${Icono} n="primer" />Ver el primer piso</button>
        <button className="btn btn-secundario btn-peq" onClick=${() => cambiarVista('corte')}><${Icono} n="corte" />Vista en corte</button>
      ` : puedeEntrar ? html`
        <button className="btn btn-primario btn-peq" onClick=${alternarInterior}><${Icono} n=${interior ? 'cubo' : 'ojo'} />${interior ? 'Vista desde arriba' : 'Entrar en la sala'}</button>
      ` : null}
    </div>
    <div className="info-nav">
      <button onClick=${() => ir(-1)}><${Icono} n="izq" />Anterior</button>
      <button onClick=${() => ir(1)}>Siguiente<${Icono} n="der" /></button>
    </div>
    ${guiada ? html`<div className="progreso-guia"><span key=${sel} style=${{ animationDuration: '8s' }}></span></div>` : null}
  </div>`;
}

function VisitaGuiada() {
  const guiada = useEstado(s => s.guiada);
  const sel = useEstado(s => s.sel);
  const [pausa, setPausa] = useState(false);
  useEffect(() => {
    if (!guiada || pausa) return;
    const t = setTimeout(() => {
      const i = RECORRIDO.indexOf(leer().sel);
      if (i === RECORRIDO.length - 1) { poner({ guiada: false }); cerrarSala(); return; }
      seleccionar(RECORRIDO[i + 1]); poner({ guiada: true });
    }, 8000);
    return () => clearTimeout(t);
  }, [guiada, sel, pausa]);
  if (!guiada) return null;
  const i = RECORRIDO.indexOf(sel);
  return html`<div className="guia-barra panel">
    <span>Visita guiada · ${i + 1} / ${RECORRIDO.length}</span>
    <button className="btn btn-secundario btn-peq" onClick=${() => setPausa(!pausa)}><${Icono} n=${pausa ? 'play' : 'pausa'} />${pausa ? 'Seguir' : 'Pausa'}</button>
    <button className="btn btn-secundario btn-peq" onClick=${() => { poner({ guiada: false }); cerrarSala(); }}><${Icono} n="cerrar" />Salir</button>
  </div>`;
}

export function Explorador() {
  const vista = useEstado(s => s.vista);
  const techo = useEstado(s => s.techo);
  const noche = useEstado(s => s.noche);
  const lugares = useEstado(s => s.lugares);
  const sel = useEstado(s => s.sel);
  const guiada = useEstado(s => s.guiada);
  const [ayuda, setAyuda] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setAyuda(false), 14000);
    const tecla = (e) => {
      if (e.key === 'Escape') { if (leer().sel) cerrarSala(); else if (leer().lugares) alternarLugares(); }
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.key === '1') cambiarVista('completa');
      if (e.key === '2') cambiarVista('baja');
      if (e.key === '3') cambiarVista('primer');
      if (e.key === '4') cambiarVista('corte');
    };
    window.addEventListener('keydown', tecla);
    return () => { clearTimeout(t); window.removeEventListener('keydown', tecla); };
  }, []);
  const ins = INSIGNIA[vista];
  const empezarGuia = () => { seleccionar(RECORRIDO[0]); poner({ guiada: true }); };
  return html`<div className="exp">
    <${CapaEtiquetas} />
    <div className="exp-sup">
      <div className="exp-inicio panel">
        <button className="volver" onClick=${volverInicio}><${Icono} n="izq" />Inicio</button>
        <div className="marca"><${Logo} size=${38} /><div><b>PABLO PICASSO</b><small>Visita en 3D</small></div></div>
      </div>
      <div className="vistas panel" role="toolbar" aria-label="Vistas">
        ${VISTAS_BTN.map(v => html`<button key=${v.id} className=${vista === v.id && !sel ? 'activo' : ''} onClick=${() => cambiarVista(v.id)} title=${v.t}><${Icono} n=${v.i} /><span>${v.t}</span></button>`)}
      </div>
      <div className="toggles panel">
        <button className=${!techo ? 'on' : ''} onClick=${alternarTecho} title=${techo ? 'Ocultar el techo' : 'Mostrar el techo'}><${Icono} n="techo" /><span>${techo ? 'Ocultar techo' : 'Mostrar techo'}</span></button>
        <button className=${noche ? 'on' : ''} onClick=${alternarNoche} title="Día / Noche"><${Icono} n=${noche ? 'luna' : 'sol'} /><span>${noche ? 'Noche' : 'Día'}</span></button>
        <button className=${guiada ? 'on' : ''} onClick=${empezarGuia} title="Visita guiada"><${Icono} n="guia" /><span>Visita guiada</span></button>
        <button className=${lugares ? 'on' : ''} onClick=${alternarLugares} title="Lugares"><${Icono} n="lista" /><span>Lugares</span></button>
      </div>
    </div>
    ${!sel && ins ? html`<div className="insignia-planta panel" key=${vista}><i></i><b>${ins[0]}</b>${ins[1]}</div>` : null}
    ${lugares ? html`<${Lugares} />` : null}
    <${Ficha} />
    <${VisitaGuiada} />
    ${ayuda && !sel ? html`<div className="ayuda panel">
      <div className="gestos">
        <span><${Icono} n="raton" size=${16} /><kbd>Clic + arrastrar</kbd> girar</span>
        <span><kbd>Rueda</kbd> zoom</span>
        <span><kbd>Clic derecho</kbd> mover</span>
        <span><${Icono} n="mano" size=${16} /><kbd>Clic</kbd> en una sala para visitarla</span>
      </div>
      <button className="cerrar" onClick=${() => setAyuda(false)} aria-label="Cerrar ayuda"><${Icono} n="cerrar" /></button>
    </div>` : null}
  </div>`;
}
