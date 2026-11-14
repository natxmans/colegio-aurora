// =========================================================
// Interfaz de la MAQUETA 3D (dentro de la página o a pantalla completa):
// vistas, techo, visita guiada, lugares, ficha de cada sala,
// el panel del tiempo y la ayuda.
// =========================================================
import { html, useEffect, useState } from '../lib.js';
import { useEstado, poner, leer, volverInicio, abrirExplorador, cambiarVista, seleccionar, cerrarSala, alternarInterior, alternarTecho, alternarLugares, verResidencia } from '../estado.js';
import { SALAS, ZONAS, AULAS, ESPACIOS_PB, HABITACIONES, POR_PLANTA, RECORRIDO } from '../datos/salas.js';
import { Icono, Logo } from './Iconos.js';
import { CapaEtiquetas } from './Etiquetas.js';
import { Reloj } from './Reloj.js';

const VISTAS_BTN = [
  { id: 'completa', t: 'Vista general', i: 'cubo' },
  { id: 'baja', t: 'Planta baja', i: 'baja' },
  { id: 'primer', t: 'Primer piso', i: 'primer' },
  { id: 'residencia', t: 'Residencia', i: 'residencia' },
  { id: 'deportes', t: 'Deportes', i: 'balon' },
  { id: 'corte', t: 'En corte', i: 'corte' },
];

const INSIGNIA = {
  completa: ['VISTA GENERAL', 'Haz clic en un edificio o en un alumno'],
  baja: ['PLANTA BAJA', 'Aulas, laboratorios, biblioteca y comedor'],
  primer: ['PRIMER PISO', 'Vida escolar, permanencia, sala de estudio y salones'],
  corte: ['VISTA EN CORTE', 'Planta baja + primer piso'],
  deportes: ['COMPLEJO DEPORTIVO', 'Gimnasio, piscina, fútbol y baloncesto'],
  res1: ['RESIDENCIA · PRIMER PISO', 'Las habitaciones dobles'],
  res0: ['RESIDENCIA · PLANTA BAJA', 'Entrada, salón y habitaciones'],
};

function zonaDe(s) { return ZONAS[s.planta] || ZONAS.exterior; }

function Lugares() {
  const sel = useEstado(s => s.sel);
  const item = (s) => html`<button key=${s.id} className=${'lugar' + (sel === s.id ? ' activo' : '')} style=${{ '--c': s.color }} onClick=${() => seleccionar(s.id, { mantenerLugares: true })}><i></i>${s.nombre}</button>`;
  return html`<div className="lugares panel" role="dialog" aria-label="Lugares del colegio">
    <div className="lugares-cab"><h3>Lugares del colegio</h3><button className="cerrar" onClick=${alternarLugares} aria-label="Cerrar"><${Icono} n="cerrar" /></button></div>
    <div className="lugares-lista">
      <div className="grupo-lugares"><h4>Edificios y exteriores</h4>${[SALAS.edificio, SALAS.residencia, ...POR_PLANTA.exterior].map(item)}</div>
      <div className="grupo-lugares"><h4>Planta baja · Aulas y laboratorios</h4>${AULAS.map(item)}</div>
      <div className="grupo-lugares"><h4>Planta baja · Biblioteca, entrada y comedor</h4>${ESPACIOS_PB.map(item)}</div>
      <div className="grupo-lugares"><h4>Primer piso · Vida escolar, permanencia y salones</h4>${POR_PLANTA.primer.map(item)}</div>
      <div className="grupo-lugares"><h4>Residencia · Espacios comunes</h4>${[SALAS.hallres, SALAS.salonres, SALAS.estarres].map(item)}</div>
      <div className="grupo-lugares"><h4>Residencia · Habitaciones dobles</h4>
        <div className="habs">${HABITACIONES.map(s => html`<button key=${s.id} className=${sel === s.id ? 'activo' : ''} onClick=${() => seleccionar(s.id, { mantenerLugares: true })}>${s.num}</button>`)}</div>
      </div>
      <div className="grupo-lugares"><h4>Complejo deportivo</h4>${POR_PLANTA.deporte.map(item)}</div>
    </div>
  </div>`;
}

// Orden para los botones "Anterior / Siguiente"
const ORDEN = [SALAS.edificio, ...AULAS, ...ESPACIOS_PB, ...POR_PLANTA.primer, SALAS.residencia, SALAS.hallres, SALAS.salonres, SALAS.estarres, ...HABITACIONES, ...POR_PLANTA.deporte, ...POR_PLANTA.exterior].map(s => s.id);

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
  const puedeEntrar = ['baja', 'primer', 'res0', 'res1'].includes(s.planta) || !!s.interior;
  return html`<div className="info panel" key=${sel} role="dialog" aria-label=${s.nombre}>
    <div className="info-cab">
      <span className="chip" style=${{ '--c': z.color }}>${z.titulo}</span>
      <button className="cerrar" onClick=${cerrarSala} aria-label="Cerrar"><${Icono} n="cerrar" /></button>
    </div>
    <h3>${s.nombre}</h3>
    <p>${s.desc}</p>
    <div className="hay"><b>Aquí hay…</b><div className="chips">${s.hay.map(h => html`<span key=${h} className="chip" style=${{ '--c': s.color }}>${h}</span>`)}</div></div>
    <div className="info-acciones">
      ${s.id === 'edificio' ? html`
        <button className="btn btn-primario btn-peq" onClick=${() => cambiarVista('baja')}><${Icono} n="baja" />Planta baja</button>
        <button className="btn btn-secundario btn-peq" onClick=${() => cambiarVista('primer')}><${Icono} n="primer" />Primer piso</button>
        <button className="btn btn-secundario btn-peq" onClick=${() => cambiarVista('corte')}><${Icono} n="corte" />En corte</button>
      ` : s.id === 'residencia' ? html`
        <button className="btn btn-primario btn-peq" onClick=${() => verResidencia('res1')}><${Icono} n="primer" />Las habitaciones</button>
        <button className="btn btn-secundario btn-peq" onClick=${() => verResidencia('res0')}><${Icono} n="baja" />La planta baja</button>
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

function Aviso() {
  const aviso = useEstado(s => s.aviso);
  useEffect(() => { if (!aviso) return; const t = setTimeout(() => poner({ aviso: null }), 6000); return () => clearTimeout(t); }, [aviso]);
  return aviso ? html`<div className="aviso-3d panel" role="status">${aviso}</div>` : null;
}

export function Explorador({ embebido = false }) {
  const vista = useEstado(s => s.vista);
  const resVista = useEstado(s => s.resVista);
  const techo = useEstado(s => s.techo);
  const lugares = useEstado(s => s.lugares);
  const sel = useEstado(s => s.sel);
  const persona = useEstado(s => s.persona);
  const guiada = useEstado(s => s.guiada);
  const [ayuda, setAyuda] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setAyuda(false), 16000);
    const tecla = (e) => {
      if (leer().modo !== 'explorar') return;
      if (e.key === 'Escape') { if (leer().chat) return; if (leer().seguir) poner({ persona: null, seguir: null }); else if (leer().sel) cerrarSala(); else if (leer().lugares) alternarLugares(); else volverInicio(); }
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      const n = ['1', '2', '3', '4', '5', '6'].indexOf(e.key);
      if (n >= 0) { const v = VISTAS_BTN[n].id; if (v === 'residencia') verResidencia('res1'); else cambiarVista(v); }
    };
    window.addEventListener('keydown', tecla);
    return () => { clearTimeout(t); window.removeEventListener('keydown', tecla); };
  }, []);
  const ins = INSIGNIA[resVista || vista];
  const empezarGuia = () => { seleccionar(RECORRIDO[0]); poner({ guiada: true }); };
  const activa = (id) => !sel && (id === 'residencia' ? !!resVista : !resVista && vista === id);
  return html`<div className=${'exp' + (embebido ? ' embebido' : '')}>
    <${CapaEtiquetas} />
    <div className="exp-sup">
      ${embebido ? html`<button className="btn btn-primario btn-peq exp-abrir" onClick=${() => abrirExplorador(vista === 'completa' ? 'completa' : vista)}><${Icono} n="pantalla" />Explorar a pantalla completa</button>` : html`
        <div className="exp-inicio panel">
          <button className="volver" onClick=${volverInicio}><${Icono} n="izq" />Salir</button>
          <div className="marca"><${Logo} size=${36} /><div><b>PABLO PICASSO</b><small>Campus en 3D</small></div></div>
        </div>`}
      ${embebido ? null : html`<div className="vistas panel" role="toolbar" aria-label="Vistas">
        ${VISTAS_BTN.map(v => html`<button key=${v.id} className=${activa(v.id) ? 'activo' : ''} onClick=${() => v.id === 'residencia' ? verResidencia('res1') : cambiarVista(v.id)} title=${v.t}><${Icono} n=${v.i} /><span>${v.t}</span></button>`)}
      </div>`}
      ${embebido ? null : html`<div className="toggles panel">
        <button className=${!techo ? 'on' : ''} onClick=${alternarTecho} title=${techo ? 'Quitar los techos' : 'Poner los techos'}><${Icono} n="techo" /><span>${techo ? 'Quitar techos' : 'Poner techos'}</span></button>
        <button className=${guiada ? 'on' : ''} onClick=${empezarGuia} title="Visita guiada"><${Icono} n="guia" /><span>Visita guiada</span></button>
        <button className=${lugares ? 'on' : ''} onClick=${alternarLugares} title="Lugares"><${Icono} n="lista" /><span>Lugares</span></button>
      </div>`}
    </div>
    ${!embebido && !sel && !persona && ins ? html`<div className="insignia-planta panel" key=${resVista || vista}><i></i><b>${ins[0]}</b>${ins[1]}</div>` : null}
    ${lugares && !embebido ? html`<${Lugares} />` : null}
    <${Ficha} />
    <${VisitaGuiada} />
    <${Reloj} embebido=${embebido} />
    <${Aviso} />
    ${ayuda && !sel && !persona && !embebido ? html`<div className="ayuda panel">
      <div className="gestos">
        <span><${Icono} n="raton" size=${16} /><kbd>Arrastrar</kbd> girar</span>
        <span><kbd>Rueda</kbd> zoom</span>
        <span><kbd>Clic derecho</kbd> mover</span>
        <span><${Icono} n="mano" size=${16} /><kbd>Clic</kbd> en un edificio para visitarlo</span>
      </div>
      <button className="cerrar" onClick=${() => setAyuda(false)} aria-label="Cerrar ayuda"><${Icono} n="cerrar" /></button>
    </div>` : null}
  </div>`;
}
