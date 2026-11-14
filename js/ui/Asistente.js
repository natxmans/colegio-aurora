// =========================================================
// EL ASISTENTE DE CADA ALUMNO
// Cada alumno virtual tiene su propio asistente. El asistente NO controla al
// personaje (el alumno sigue su rutina aunque nadie le hable): solo responde
// a las preguntas del visitante sobre los estudios y el colegio.
// · Con un servidor configurado (js/datos/config.js): respuestas de una IA real.
// · Sin servidor: MODO DEMOSTRACIÓN, claramente indicado. Las respuestas salen
//   de los datos del colegio (horario, asignaturas, lugares): no es una IA.
// =========================================================
import { html, useState, useEffect, useRef } from '../lib.js';
import { useEstado, poner } from '../estado.js';
import { IA } from '../datos/config.js';
import { ALUMNOS, GRUPOS, horarioDelDia, queHaceAlumno, MATERIAS, HORAS } from '../sim/horario.js';
import { reloj, hora, DIAS, aMin } from '../sim/reloj.js';
import { SALAS } from '../datos/salas.js';
import { ASIGNATURAS } from '../datos/contenido.js';
import { Icono } from './Iconos.js';

// ¿Hay un servidor de IA disponible? (se comprueba una vez)
let estadoIA = null;
export async function comprobarIA() {
  if (estadoIA) return estadoIA;
  if (!IA.url) return (estadoIA = { ok: false, motivo: 'sin-servidor' });
  try {
    const r = await fetch(IA.url.replace(/\/$/, '') + '/api/estado', { signal: AbortSignal.timeout(6000) });
    const j = await r.json();
    return (estadoIA = { ok: !!j.ok, motivo: j.ok ? '' : 'sin-clave', modelo: j.modelo });
  } catch (e) { return (estadoIA = { ok: false, motivo: 'sin-conexion' }); }
}

function contextoDe(a) {
  const ahora = queHaceAlumno(a, reloj.dia, reloj.min);
  const h = horarioDelDia(reloj.dia, a.grupo).map(c => `${hora(c.desde)} ${c.permanencia ? 'Permanencia' : c.materia.nombre}`);
  return { nombre: a.nombre, grupo: GRUPOS[a.grupo], habitacion: String(a.hab || '').replace('hab', ''), ahora: `${DIAS[reloj.dia]} ${hora()}: ${ahora.texto}`, horario: h };
}

// ---------------- MODO DEMOSTRACIÓN (sin IA) ----------------
const sinAcentos = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const LUGARES_CLAVE = [
  [['biblioteca', 'bibliotheque'], 'biblioteca'], [['comedor', 'cantina', 'cantine', 'comer', 'manger'], 'comedor'],
  [['gimnasio', 'gymnase'], 'gimnasio'], [['piscina', 'piscine', 'nadar'], 'piscina'], [['futbol', 'foot'], 'futbol'],
  [['baloncesto', 'basket'], 'baloncesto'], [['residencia', 'dormitorio', 'habitacion', 'chambre', 'dortoir'], 'residencia'],
  [['permanencia', 'permanence'], 'permanencia'], [['vida escolar', 'vie scolaire'], 'vidaescolar'], [['patio', 'recreo', 'cour', 'recre'], 'patio'],
  [['jardin'], 'jardin'], [['estudio', 'etude'], 'estudio'], [['profesores', 'professeurs', 'salle des profs'], 'profesores'],
];
function respuestaDemo(a, texto) {
  const t = sinAcentos(texto);
  const hoy = horarioDelDia(reloj.dia, a.grupo);
  const fr = /\b(quand|ou|quel|quelle|comment|est|je|mon|ma|mes|cours|aide|explique)\b/.test(t);
  // asignaturas
  const mat = ASIGNATURAS.find(m => t.includes(sinAcentos(m.nombre)) || t.includes(sinAcentos(m.corto)) || (m.id === 'svt' && /\bsvt\b|ciencias/.test(t)) || (m.id === 'mates' && /\bmates|maths?\b/.test(t)) || (m.id === 'edfisica' && /\beps\b|educacion fisica|deporte/.test(t)));
  if (/horario|hora|cuando|clase|cours|emploi du temps|quand|aujourd/.test(t) && !mat) {
    const lineas = hoy.map(c => `${hora(c.desde)}: ${c.permanencia ? 'permanencia' : c.materia.nombre}`).join(' · ');
    return (fr ? `Ton emploi du temps du ${DIAS[reloj.dia]} : ` : `Tu horario del ${DIAS[reloj.dia]}: `) + lineas + (fr ? '. Récréation à 10:00 (20 minutes), repas à 12:20, coucher à 21:00.' : '. Recreo a las 10:00 (veinte minutos), comida a las 12:20 y a dormir a las 21:00.');
  }
  if (mat) {
    const c = hoy.find(c => c.materia.id === mat.id);
    const sala = SALAS[mat.sala];
    return `${mat.nombre}: ${mat.desc} ` + (sala ? `${fr ? 'Salle' : 'Sala'}: ${sala.nombre}. ` : '') + (c ? (fr ? `Aujourd'hui tu l'as à ${hora(c.desde)}.` : `Hoy la tienes a las ${hora(c.desde)}.`) : (fr ? "Tu ne l'as pas aujourd'hui." : 'Hoy no la tienes.'));
  }
  const lugar = LUGARES_CLAVE.find(([claves]) => claves.some(k => t.includes(k)));
  if (lugar) {
    const s = SALAS[lugar[1]];
    if (s) return `${s.nombre}: ${s.desc}`;
  }
  if (/ahora|que hago|maintenant|je fais/.test(t)) {
    const q = queHaceAlumno(a, reloj.dia, reloj.min);
    return (fr ? `Maintenant (${hora()}) : ` : `Ahora (${hora()}): `) + q.texto + '.';
  }
  if (/organiz|deberes|devoirs|travail|trabajo|estudiar|reviser|repasar/.test(t)) {
    const tardes = hoy.slice(4).map(c => c.materia.nombre).join(', ');
    return fr ? `Il n'y a pas de devoirs à la maison : on travaille au collège. Idée : après 17:00, va à la salle d'étude 45 minutes et revois ${tardes || 'tes cours du jour'}.`
      : `No hay deberes en casa: todo se hace en el colegio. Una idea: después de las 17:00, ve 45 minutos a la sala de estudio y repasa ${tardes || 'las clases del día'}.`;
  }
  if (/uniforme/.test(t)) return 'El uniforme: polo blanco con cuello azul marino, chaqueta azul marino con el logo, pantalón o falda azul marino y zapatos.';
  return fr ? "Mode démonstration : je ne réponds qu'avec les données du collège. Essaie : « mon emploi du temps », « où est la piscine ? », « explique les maths », « comment organiser mon travail ? »."
    : 'Modo demostración: solo respondo con los datos del colegio. Prueba: «mi horario», «¿dónde está la piscina?», «explícame las matemáticas», «¿cómo organizo mi trabajo?».';
}

// al cerrar, el alumno deja de estar marcado (salvo si la cámara lo sigue)
const cerrar = () => poner(s => ({ chat: null, persona: s.seguir ? s.persona : null }));

export function Asistente() {
  const id = useEstado(s => s.chat);
  const a = ALUMNOS.find(x => x.id === id) || null;
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');
  const [esperando, setEsperando] = useState(false);
  const [ia, setIa] = useState(null);
  const lista = useRef(), campo = useRef();
  useEffect(() => { if (a) { comprobarIA().then(setIa); setMensajes([]); setTimeout(() => campo.current && campo.current.focus(), 50); } }, [id]);
  useEffect(() => { if (lista.current) lista.current.scrollTop = lista.current.scrollHeight; }, [mensajes, esperando]);
  useEffect(() => {
    if (!a) return;
    const tecla = e => { if (e.key === 'Escape') cerrar(); };
    window.addEventListener('keydown', tecla); return () => window.removeEventListener('keydown', tecla);
  }, [id]);
  if (!a) return null;
  const demo = !ia || !ia.ok;
  const enviar = async (e) => {
    e && e.preventDefault();
    const q = texto.trim();
    if (!q || esperando) return;
    const nuevos = [...mensajes, { rol: 'alumno', texto: q }];
    setMensajes(nuevos); setTexto('');
    if (demo) { setMensajes([...nuevos, { rol: 'asistente', texto: respuestaDemo(a, q), demo: true }]); return; }
    setEsperando(true);
    try {
      const r = await fetch(IA.url.replace(/\/$/, '') + '/api/asistente', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(90000),
        body: JSON.stringify({ alumno: contextoDe(a), mensajes: nuevos.filter(m => !m.error).map(m => ({ rol: m.rol, texto: m.texto })) }),
      });
      const j = await r.json();
      setMensajes([...nuevos, r.ok ? { rol: 'asistente', texto: j.respuesta } : { rol: 'asistente', texto: j.error || 'Error', error: true }]);
    } catch (err) {
      setMensajes([...nuevos, { rol: 'asistente', texto: 'No hay conexión con el asistente. Inténtalo más tarde.', error: true }]);
    }
    setEsperando(false);
  };
  const ctx = contextoDe(a);
  return html`<div className="chat-fondo" onClick=${e => { if (e.target === e.currentTarget) cerrar(); }}>
    <div className="chat panel" role="dialog" aria-modal="true" aria-label=${'Asistente de ' + a.nombre}>
      <div className="chat-cab">
        <span className="chat-avatar"><${Icono} n="chat" /></span>
        <div><b>Asistente de ${a.nombre}</b><small>${GRUPOS[a.grupo]} · Habitación ${ctx.habitacion}</small></div>
        <button className="cerrar" onClick=${cerrar} aria-label="Cerrar"><${Icono} n="cerrar" /></button>
      </div>
      <p className=${'chat-modo' + (demo ? ' demo' : '')}>
        ${ia === null ? 'Comprobando el asistente…' : demo
          ? html`<b>Modo demostración — sin IA real.</b> ${ia.motivo === 'sin-servidor' ? 'El servidor de IA todavía no está configurado.' : ia.motivo === 'sin-clave' ? 'El servidor de IA no tiene clave.' : 'No hay conexión con el servidor de IA.'} Las respuestas salen solo de los datos del colegio.`
          : html`<b>IA conectada.</b> Respuestas generadas por un modelo de IA: pueden contener errores.`}
      </p>
      <p className="chat-ahora"><${Icono} n="reloj" size=${14} /> ${ctx.ahora}</p>
      <div className="chat-lista" ref=${lista} aria-live="polite">
        ${mensajes.length === 0 ? html`<div className="chat-vacio">
          <p>Hola, soy el asistente de estudio de ${a.nombre}. Puedo explicar las asignaturas, dar el horario, decir dónde están los lugares del colegio y ayudar a organizar el trabajo.</p>
          <div className="chips">${['¿Cuál es mi horario de hoy?', 'Explícame las matemáticas', '¿Dónde está la permanencia?', '¿Cómo organizo mi trabajo?'].map(s => html`<button key=${s} className="chip" onClick=${() => { setTexto(s); setTimeout(() => campo.current && campo.current.form.requestSubmit(), 0); }}>${s}</button>`)}</div>
        </div>` : null}
        ${mensajes.map((m, k) => html`<div key=${k} className=${'burbuja ' + m.rol + (m.error ? ' error' : '')}>${m.texto}${m.demo ? html`<small>Respuesta de demostración (datos del colegio)</small>` : null}</div>`)}
        ${esperando ? html`<div className="burbuja asistente escribiendo"><i></i><i></i><i></i></div>` : null}
      </div>
      <form className="chat-form" onSubmit=${enviar}>
        <input ref=${campo} value=${texto} onInput=${e => setTexto(e.target.value)} maxLength=${600} placeholder="Escribe una pregunta (español o francés)…" aria-label="Tu pregunta" />
        <button className="btn btn-primario btn-peq" type="submit" disabled=${!texto.trim() || esperando}><${Icono} n="enviar" />Enviar</button>
      </form>
    </div>
  </div>`;
}
