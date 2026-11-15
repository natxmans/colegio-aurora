// =========================================================
// EL PANEL DEL TIEMPO: hora del colegio, velocidad, pausa, ir a una hora,
// día / noche y «¿Qué pasa ahora?» (lo que hace cada grupo, ausencias...)
// =========================================================
import { html, useState, useEffect, useSyncExternalStore } from '../lib.js';
import { reloj, escuchar, avisar, hora, DIAS, RITMOS, ponerRitmo, alternarPausa, saltarA, aMin, luz, diaSiguiente } from '../sim/reloj.js';
import { GRUPOS, claseDeGrupo, ausenteDe, ausencias, MATERIAS, PROFES, HORAS, periodoEn, materiaDe } from '../sim/horario.js';
import { SIM } from '../sim/vida.js';
import { SALAS } from '../datos/salas.js';
import { poner, useEstado, leer } from '../estado.js';
import { Icono } from './Iconos.js';

// La interfaz se actualiza cada minuto simulado (o al cambiar la velocidad)
let ver = 0;
const sus = (f) => escuchar(() => { ver++; f(); });
export function useReloj() { return useSyncExternalStore(sus, () => ver); }

export const MOMENTOS_OFICIALES = [
  ['07:45', 'Despertar'], ['08:00', 'Clases'], ['10:00', 'Recreo'], ['12:20', 'Comida'],
  ['14:00', 'Clases'], ['17:00', 'Fin de las clases'], ['21:00', 'A dormir'],
];

export function momento(m = reloj.min) {
  if (m >= HORAS.dormir || m < HORAS.despertar) return { t: 'Noche', d: 'Los alumnos duermen en la residencia.' };
  if (m < HORAS.clases) return { t: 'Despertar', d: 'Los alumnos se despiertan y se ponen el uniforme.' };
  if (m >= HORAS.recreo && m < HORAS.finRecreo) return { t: 'Recreo', d: 'Veinte minutos en el patio de recreo.' };
  if (m >= HORAS.comida && m < HORAS.tarde) return { t: 'Comida', d: 'Los alumnos comen en el comedor y descansan.' };
  if (periodoEn(m) >= 0) return { t: 'Clases', d: 'Los alumnos están en clase con sus profesores.' };
  if (m >= HORAS.finClases && m < aMin('19:50')) return { t: 'Tiempo libre', d: 'Deporte, biblioteca, jardines y salones.' };
  return { t: 'En la residencia', d: 'Los alumnos vuelven a la residencia y se preparan para dormir.' };
}

function QuePasa() {
  useReloj();
  const seguir = useEstado(s => s.seguir);
  const seguido = seguir && (SIM.personas || []).find(p => p.id === seguir);
  const dia = reloj.dia, m = reloj.min;
  const falta = ausenteDe(dia);
  const prof = PROFES.find(p => p.materia === falta);
  const cuenta = { clase: 0, patio: 0, duermen: 0, andan: 0, deporte: 0 };
  for (const p of SIM.alumnos || []) {
    if (p.estado === 'tumbado') cuenta.duermen++;
    else if (p.estado === 'andando') cuenta.andan++;
    else if (p.plan && p.plan.id.startsWith('clase')) cuenta.clase++;
    else if (p.plan && p.plan.sala === 'patio') cuenta.patio++;
    else if (p.ropa === 'deporte' || p.ropa === 'banador') cuenta.deporte++;
  }
  const simularAusencia = () => {
    // falta el profesor que da clase ahora (o el de la próxima clase)
    let p = periodoEn(m); if (p < 0) p = [0, 1, 2, 3, 4, 5, 6].find(k => aMin(['08:00', '09:00', '10:20', '11:20', '14:00', '15:00', '16:00'][k]) > m) ?? 0;
    const mat = materiaDe(dia, p, Math.floor(Math.random() * 4));
    ausencias.manual[dia] = mat.id === 'edfisica' ? 'musica' : mat.id;
    poner({ aviso: `Simulación: hoy falta el profesor de ${MATERIAS.find(x => x.id === ausencias.manual[dia]).nombre}. Sus alumnos van a la permanencia.` });
    avisar();
  };
  const quitar = () => { ausencias.manual[dia] = null; avisar(); poner({ aviso: 'Hoy no falta ningún profesor.' }); };
  return html`<div className="que-pasa">
    <ul className="grupos">
      ${GRUPOS.map((g, k) => {
        const c = claseDeGrupo(dia, m, k);
        return html`<li key=${g}><b>${g}</b>${c ? (c.permanencia ? html`<span className="perma">Permanencia</span>` : html`<span>${c.materia.nombre}<small> · ${SALAS[c.sala] ? SALAS[c.sala].corto : c.sala}</small></span>`) : html`<span>${momento(m).t}</span>`}</li>`;
      })}
    </ul>
    <p className="ausencia">${prof ? html`<${Icono} n="alerta" size=${15} /><span>Hoy falta ${prof.nombre} (${MATERIAS.find(x => x.id === falta).nombre}): sus alumnos van a la <b>permanencia</b>.</span>` : html`<span>Hoy están todos los profesores.</span>`}</p>
    <div className="cuentas">
      <span>En clase: <b>${cuenta.clase}</b></span><span>Caminando: <b>${cuenta.andan}</b></span>
      <span>Patio: <b>${cuenta.patio}</b></span><span>Deporte: <b>${cuenta.deporte}</b></span><span>Durmiendo: <b>${cuenta.duermen}</b></span>
    </div>
    <div className="fila-botones">
      ${falta && ausencias.manual[dia] !== undefined && ausencias.manual[dia] !== null
        ? html`<button className="btn btn-secundario btn-peq" onClick=${quitar}>Quitar la ausencia</button>`
        : html`<button className="btn btn-secundario btn-peq" onClick=${simularAusencia}>Simular la ausencia de un profesor</button>`}
      ${seguido ? html`<button className="btn btn-secundario btn-peq" onClick=${() => poner({ seguir: null, persona: null })}><${Icono} n="ojoNo" />Dejar de seguir a ${seguido.d.nombre}</button>`
        : html`<button className="btn btn-secundario btn-peq" onClick=${seguirAlguien}><${Icono} n="seguir" />Seguir a un alumno</button>`}
    </div>
  </div>`;
}

export function seguirAlguien() {
  const als = (SIM.alumnos || []).filter(p => p.estado !== 'fuera');
  if (!als.length) return;
  const p = als[Math.floor(Math.random() * als.length)];
  poner({ persona: p.id, seguir: p.id });
}

export function Reloj({ embebido }) {
  useReloj();
  const [abierto, setAbierto] = useState(false);
  const m = reloj.min, L = luz(m);
  const mo = momento(m);
  const ir = (h) => saltarA(aMin(h));
  return html`<div className=${'reloj panel' + (embebido ? ' embebido' : '')} role="region" aria-label="La hora del colegio">
    <div className="reloj-cab">
      <span className="reloj-ico"><${Icono} n=${L.dia > 0.35 ? 'sol' : 'luna'} /></span>
      <div className="reloj-hora"><b>${hora(m)}</b><small>${DIAS[reloj.dia]} · ${mo.t}</small></div>
      <button className=${'reloj-pausa' + (reloj.pausa ? ' on' : '')} onClick=${alternarPausa} aria-label=${reloj.pausa ? 'Seguir' : 'Pausa'} title=${reloj.pausa ? 'Seguir' : 'Pausa'}><${Icono} n=${reloj.pausa ? 'play' : 'pausa'} /></button>
      <button className="reloj-mas" onClick=${() => setAbierto(!abierto)} aria-expanded=${abierto}>${abierto ? 'Menos' : '¿Qué pasa?'}</button>
    </div>
    <div className="reloj-ritmos" role="group" aria-label="Velocidad del tiempo">
      ${['lento', 'normal', 'rapido', 'muyrapido'].map(r => html`<button key=${r} className=${reloj.ritmo === r && !reloj.pausa ? 'activo' : ''} onClick=${() => ponerRitmo(r)}>${RITMOS[r].t}</button>`)}
      <button className=${reloj.ritmo === 'real' && !reloj.pausa ? 'activo' : ''} onClick=${() => { const d = new Date(); ponerRitmo('real'); saltarA(d.getHours() * 60 + d.getMinutes(), true); }} title="La hora de tu reloj">Hora real</button>
    </div>
    ${abierto ? html`
      <div className="reloj-ir">
        <span>Ir a:</span>
        ${MOMENTOS_OFICIALES.map(([h, t]) => html`<button key=${h} onClick=${() => ir(h)} title=${t}>${h}</button>`)}
        <button className="dia" onClick=${() => ir('11:00')}><${Icono} n="sol" size=${14} />Día</button>
        <button className="noche" onClick=${() => ir('22:30')}><${Icono} n="luna" size=${14} />Noche</button>
      </div>
      <form className="reloj-elegir" onSubmit=${e => { e.preventDefault(); const v = e.currentTarget.elements.h.value; if (/^\d{2}:\d{2}$/.test(v)) saltarA(aMin(v), true); }}>
        <label>Otra hora: <input name="h" type="time" min="00:00" max="23:59" step="60" defaultValue=${hora(m)} aria-label="Elegir la hora del colegio" /></label>
        <button type="submit">Ir</button>
        <button type="button" className="sig-dia" onClick=${diaSiguiente} title="Pasar al día siguiente (07:30)">Día siguiente →</button>
      </form>
      <p className="reloj-desc">${mo.d}</p>
      <${QuePasa} />` : null}
  </div>`;
}
