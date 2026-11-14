// =========================================================
// LAS SECCIONES DEL SITIO (después de la presentación y del campus 3D)
// Español sencillo (nivel 4º), fiel al PowerPoint.
// =========================================================
import { html, useState, useEffect, useRef } from '../lib.js';
import { poner, abrirExplorador, seleccionar, volar, verResidencia } from '../estado.js';
import { SALAS, AULAS, ESPACIOS_PB, COMUNES_INT, POR_PLANTA, VISTAS } from '../datos/salas.js';
import { COLEGIO, PRESENTACION, EDIFICIO, AULAS_TXT, COMUNES, INTERNADO, SEMANA, ASIGNATURAS, HORARIO, VIDA, FRASES_DEPORTE, UNIFORME_PIEZAS, RAZONES } from '../datos/contenido.js';
import { ALUMNOS, GRUPOS } from '../sim/horario.js';
import { saltarA, aMin } from '../sim/reloj.js';
import { ausencias, materiaDe, PERIODOS } from '../sim/horario.js';
import { reloj } from '../sim/reloj.js';
import { Icono, IlusMateria, IlusMomento } from './Iconos.js';
import { comprobarIA } from './Asistente.js';

const alCampus = () => { const el = document.getElementById('campus'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); if (window.__empezar3d) window.__empezar3d(); };
// Ver el campus 3D a una hora concreta
export const verA = (h) => { saltarA(aMin(h)); alCampus(); };
const ver3D = (id) => { alCampus(); setTimeout(() => seleccionar(id), 500); };

function Ver3D({ id, texto = 'Ver en 3D' }) {
  return html`<button className="ver3d" onClick=${() => ver3D(id)}><${Icono} n="cubo" />${texto}</button>`;
}
function Foto({ src, alt, className = '' }) {
  return html`<figure className=${'foto ' + className}><img src=${'img/fotos/' + src + '.jpg'} alt=${alt} loading="lazy" decoding="async" /></figure>`;
}
function Cabecera({ num, etiqueta, titulo, grad, lead, centro }) {
  return html`<div className=${'cabecera revelar' + (centro ? ' centro' : '')}>
    <span className="etiqueta">${num} · ${etiqueta}</span>
    <h2>${titulo} ${grad ? html`<span className="grad">${grad}</span>` : null}</h2>
    ${lead ? html`<p className="lead">${lead}</p>` : null}
  </div>`;
}
function Puntos({ items, icono = 'estrella' }) {
  return html`<ul className="puntos">
    ${items.map(p => html`<li key=${p.t} className="revelar"><span className="punto-ico"><${Icono} n=${p.icono || icono} /></span><div><b>${p.t}</b><span>${p.txt}</span></div></li>`)}
  </ul>`;
}

// ---------------- 01 · La vida diaria (la simulación) ----------------
const DIA = [
  { h: '07:45', t: 'Despertar', i: 'despertar', d: 'Los alumnos se despiertan en la residencia, se levantan, se ponen el uniforme y se reúnen en los espacios comunes.' },
  { h: '08:00', t: 'Clases', i: 'clases', d: 'Entran en las aulas y se sientan. Escriben, miran la pizarra o usan el ordenador. Los profesores explican.' },
  { h: '10:00', t: 'Recreo (20 min)', i: 'recreo', d: 'Salen al patio de recreo: hablan en grupos, pasean, se sientan, juegan con el balón. Después vuelven a clase.' },
  { h: '12:20', t: 'Comida', i: 'comida', d: 'Van al comedor, se sientan a la mesa, comen y hablan. Luego descansan un poco antes de las clases.' },
  { h: '14:00', t: 'Clases', i: 'reanudar', d: 'Vuelven a las aulas. Los profesores cambian de sala a cada hora.' },
  { h: '17:00', t: 'Tiempo libre', i: 'fin', d: 'Gimnasio, piscina, fútbol, baloncesto, biblioteca, jardines, sala de estudio o salones.' },
  { h: '21:00', t: 'A dormir', i: 'dormir', d: 'Vuelven a la residencia, se ponen el pijama y se acuestan. Las luces se apagan poco a poco.' },
];
function SeccionVida() {
  return html`<section className="seccion" id="vida">
    <${Cabecera} num="01" etiqueta="La vida diaria" titulo="Un colegio que" grad="vive solo"
      lead=${html`En la maqueta, cada alumno tiene <b>su propia rutina</b>: no hace falta hacer clic. La simulación sigue el <b>horario oficial</b> y el día y la noche cambian con la hora.`} />
    <div className="dia-linea revelar">
      ${DIA.map(p => html`<div key=${p.h} className="dia-paso">
        <span className="dia-ico"><${Icono} n=${p.i} /></span>
        <b className="dia-h">${p.h}</b><span className="dia-t">${p.t}</span>
        <p>${p.d}</p>
        <button className="ver3d" onClick=${() => verA(p.h)}><${Icono} n="cubo" />Ver a las ${p.h}</button>
      </div>`)}
    </div>
    <div className="rejilla rejilla-3 revelar" style=${{ marginTop: '26px' }}>
      <div className="tarjeta"><div className="icono-caja"><${Icono} n="persona" /></div><h3>Personajes articulados</h3><p>Hombros, codos, muñecas, caderas, rodillas, tobillos, cuello y cabeza. Caminan, corren, se sientan, escriben, comen, nadan y duermen.</p></div>
      <div className="tarjeta"><div className="icono-caja"><${Icono} n="reloj" /></div><h3>Tú controlas el tiempo</h3><p>Pausa, cuatro velocidades, la hora real, «Día» y «Noche», o ir directamente a una hora del horario.</p></div>
      <div className="tarjeta"><div className="icono-caja"><${Icono} n="mano" /></div><h3>Sigue a un alumno</h3><p>En el panel del tiempo, «¿Qué pasa?» muestra lo que hace cada grupo y la cámara puede seguir a un alumno.</p></div>
    </div>
  </section>`;
}

// ---------------- 02 · La permanencia ----------------
function SeccionPermanencia() {
  const simular = () => {
    const d = reloj.dia;
    ausencias.manual[d] = 'mates';
    // se va a la primera clase de Matemáticas del día (3 minutos después del principio)
    let p = 0;
    for (let k = 0; k < PERIODOS.length; k++) if ([0, 1, 2, 3].some(g => materiaDe(d, k, g).id === 'mates')) { p = k; break; }
    saltarA(PERIODOS[p][0] + 3, true);
    poner({ aviso: 'Simulación: hoy falta la profesora de Matemáticas. Sus alumnos están en la permanencia (primer piso).' });
    alCampus();
    setTimeout(() => ver3D('permanencia'), 300);
  };
  return html`<section className="seccion seccion-fondo" id="permanencia">
    <${Cabecera} num="02" etiqueta="La permanencia" titulo="Cuando falta" grad="un profesor"
      lead=${html`Si un profesor está ausente, sus alumnos <b>no se quedan solos en un aula vacía</b>: van a la <b>permanencia</b>, en el primer piso del edificio principal.`} />
    <div className="dos-col">
      <${Puntos} items=${[
        { t: 'Un lugar tranquilo', txt: 'Una sala con mesas individuales y sillas, un reloj y libros.', icono: 'libro' },
        { t: 'Un adulto vigila', txt: 'El vigilante de la permanencia está en su mesa y ayuda si hace falta.', icono: 'persona' },
        { t: 'Trabajamos en silencio', txt: 'Repasamos las lecciones o leemos hasta la clase siguiente.', icono: 'estrella' },
        { t: 'En la simulación', txt: 'Algunos días falta un profesor: sus alumnos van solos a la permanencia. Tú también puedes provocar una ausencia.', icono: 'reloj' },
      ]} />
      <div className="tarjeta revelar destacada">
        <h3>Pruébalo en la maqueta</h3>
        <p>Pulsa el botón: la profesora de Matemáticas «falta» hoy. A la hora de su clase, sus alumnos irán a la permanencia.</p>
        <div className="botones-fila">
          <button className="btn btn-primario btn-peq" onClick=${simular}><${Icono} n="alerta" />Simular una ausencia</button>
          <button className="btn btn-secundario btn-peq" onClick=${() => ver3D('permanencia')}><${Icono} n="cubo" />Ver la permanencia</button>
        </div>
      </div>
    </div>
  </section>`;
}

// ---------------- 03 · La vida escolar ----------------
function SeccionVidaEscolar() {
  return html`<section className="seccion" id="vidaescolar">
    <${Cabecera} num="03" etiqueta="La vida escolar" titulo="Siempre hay" grad="alguien para ayudar"
      lead=${html`La <b>vida escolar</b> acompaña a los alumnos todo el día: en el colegio, en el patio y en la residencia.`} />
    <div className="rejilla rejilla-4">
      ${[
        ['vidaescolar', 'Un despacho y una acogida', 'En el primer piso: un mostrador para recibir a los alumnos y un despacho para hablar.', 'inicio'],
        ['vidaescolar', 'Pedir ayuda', 'Un problema, una pregunta, un día difícil: los educadores escuchan y ayudan.', 'corazon'],
        ['patio', 'En el recreo', 'Una educadora vigila el patio a las diez y después de la comida.', 'recreo'],
        ['hallres', 'De noche', 'Un educador de noche está en la entrada de la residencia y hace una ronda a las nueve.', 'luna'],
      ].map(([id, t, d, i]) => html`<div key=${t} className="tarjeta revelar"><div className="icono-caja"><${Icono} n=${i} /></div><h3>${t}</h3><p>${d}</p><${Ver3D} id=${id} /></div>`)}
    </div>
  </section>`;
}

// ---------------- 04 · Los asistentes ----------------
function SeccionAsistentes() {
  const [ia, setIa] = useState(null);
  const [grupo, setGrupo] = useState(0);
  useEffect(() => { comprobarIA().then(setIa); }, []);
  return html`<section className="seccion seccion-fondo" id="asistentes">
    <${Cabecera} num="04" etiqueta="Un asistente para cada alumno" titulo="El asistente" grad="de estudio"
      lead=${html`Cada alumno virtual tiene <b>su propio asistente</b>: explica las asignaturas, da el horario, dice dónde están los lugares y ayuda a organizar el trabajo. El alumno sigue su rutina aunque nadie hable con su asistente.`} />
    <p className=${'estado-ia revelar' + (ia && ia.ok ? ' ok' : '')}>
      ${ia === null ? 'Comprobando…' : ia.ok ? html`<b>IA conectada</b> · las respuestas vienen de un modelo de IA (pueden contener errores).`
        : html`<b>Modo demostración</b> · la IA no está configurada todavía: las respuestas salen solo de los datos del colegio (horario, asignaturas, lugares). La clave de la IA irá en un servidor, nunca en el sitio.`}
    </p>
    <div className="pestanas revelar" role="tablist">${GRUPOS.map((g, k) => html`<button key=${g} role="tab" aria-selected=${k === grupo} className=${k === grupo ? 'activo' : ''} onClick=${() => setGrupo(k)}>${g}</button>`)}</div>
    <div className="alumnos-rejilla">
      ${ALUMNOS.filter(a => a.grupo === grupo).map(a => html`<button key=${a.id} className="alumno-tarjeta" onClick=${() => poner({ chat: a.id })}>
        <span className="alumno-ini" style=${{ background: a.pelo }}>${a.nombre[0]}</span>
        <span><b>${a.nombre}</b><small>${GRUPOS[a.grupo]} · habitación ${String(a.hab || '').replace('hab', '')}</small></span>
        <${Icono} n="chat" />
      </button>`)}
    </div>
  </section>`;
}

// ---------------- 05 · Nuestro colegio ----------------
function Plano() {
  const zonas = ['futbol', 'jardin', 'patio', 'edificio', 'residencia', 'gimnasio', 'piscina', 'baloncesto'].map(id => SALAS[id]).filter(Boolean);
  return html`<div className="plano revelar">
    <svg viewBox="-70 -72 146 126" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Plano del campus">
      <rect x="-68" y="-70" width="142" height="120" rx="4" fill="#f6f1e7" stroke="#c9a978" strokeWidth=".8" />
      <rect x="-3" y="48" width="6" height="4" fill="#e2d6bf" />
      ${zonas.map(s => html`<g key=${s.id} className="zona" onClick=${() => ver3D(s.id)} tabIndex="0" role="button" aria-label=${s.nombre}
          onKeyDown=${e => { if (e.key === 'Enter') ver3D(s.id); }}>
        <rect x=${s.x0} y=${s.z0} width=${s.x1 - s.x0} height=${s.z1 - s.z0} rx="2" fill=${s.color} fillOpacity=${s.id === 'edificio' || s.id === 'residencia' ? 0.92 : 0.6} stroke="#ffffff" strokeWidth=".8" />
        <text x=${(s.x0 + s.x1) / 2} y=${(s.z0 + s.z1) / 2 + 1.6} textAnchor="middle" fill="#fff" fontSize=${s.id === 'residencia' ? 3.2 : s.id === 'edificio' || s.id === 'futbol' || s.id === 'patio' ? 4.4 : 3.4} fontWeight="700" fontFamily="Inter, sans-serif"
          transform=${s.id === 'residencia' ? `rotate(-90 ${(s.x0 + s.x1) / 2} ${(s.z0 + s.z1) / 2})` : undefined}>${s.corto}</text>
      </g>`)}
      <text x="0" y="47" textAnchor="middle" fill="#14285a" fontSize="3.4" fontFamily="Inter, sans-serif" fontWeight="600">Entrada</text>
      <text x="70" y="-63" textAnchor="end" fill="#14285a" fontSize="4" fontFamily="Inter, sans-serif" fontWeight="700">N ↑</text>
    </svg>
    <div className="plano-leyenda">Plano del campus · haz clic en una zona</div>
  </div>`;
}

function SeccionColegio() {
  return html`<section className="seccion" id="colegio">
    <${Cabecera} num="05" etiqueta="Nuestro colegio" titulo="Un colegio moderno," grad="limpio y acogedor"
      lead=${html`El <b>Colegio Pablo Picasso</b> está en España. Tiene un <b>edificio principal de dos plantas</b>, una <b>residencia</b>, patios con jardines y un gran <b>complejo deportivo</b>.`} />
    <div className="dos-col">
      <${Foto} src="fachada" alt="La entrada del Colegio Pablo Picasso" className="revelar alta" />
      <${Puntos} items=${PRESENTACION} />
    </div>
    <h3 className="sub-titulo revelar">El edificio principal <span className="linea"></span></h3>
    <div className="dos-col invertido">
      <${Foto} src="arquitectura" alt="El edificio y el patio con jardines" className="revelar alta" />
      <div>
        <${Puntos} items=${EDIFICIO.map((e, i) => ({ ...e, icono: ['edificio', 'baja', 'primer', 'sol'][i] }))} />
        <div className="botones-fila revelar">
          <button className="btn btn-primario btn-peq" onClick=${() => ver3D('edificio')}><${Icono} n="cubo" />Ver el edificio en 3D</button>
        </div>
      </div>
    </div>
    <h3 className="sub-titulo revelar">El campus <span className="linea"></span></h3>
    <div className="dos-col">
      <${Plano} />
      <${Foto} src="aerea" alt="Vista aérea del colegio" className="revelar" />
    </div>
    <h3 className="sub-titulo revelar">Los espacios comunes <span className="linea"></span></h3>
    <div className="rejilla rejilla-4">
      ${COMUNES.map(c => html`<div key=${c.id} className="tarjeta revelar">
        <div className="icono-caja"><${Icono} n=${c.icono} /></div>
        <h3>${c.t}</h3><p>${c.txt}</p>
        <${Ver3D} id=${c.id} />
      </div>`)}
    </div>
    <${Foto} src="espacios-comunes" alt="El comedor, la biblioteca, el salón y los jardines" className="revelar ancha" />
  </section>`;
}

// ---------------- 06 · Las aulas ----------------
const ICONO_SALA = { mates: 'mates', frances: 'frances', ingles: 'ingles', historia: 'historia', svt: 'svt', fisica: 'fisica', tecno: 'tecno', musica: 'musica', biblioteca: 'libro', entrada: 'inicio', comedor: 'comida', salon1: 'sofa', salon2: 'sofa', lectura: 'libro', juegos: 'balon', gimnasio: 'balon', piscina: 'sol', futbol: 'balon', baloncesto: 'balon', salonres: 'sofa', hallres: 'inicio', estarres: 'sofa' };
function TarjetaSala({ s, planta }) {
  return html`<div className="tarjeta aula-card revelar" style=${{ '--c': s.color }}>
    <span className="franja"></span>
    <div className="icono-caja"><${Icono} n=${ICONO_SALA[s.id] || 'edificio'} /></div>
    ${planta ? html`<div className="planta">${planta}</div>` : null}
    <h3>${s.nombre}</h3>
    <p>${s.desc.split('. ')[0].replace(/\.$/, '')}.</p>
    <${Ver3D} id=${s.id} />
  </div>`;
}
function SeccionAulas() {
  return html`<section className="seccion seccion-fondo" id="aulas">
    <${Cabecera} num="06" etiqueta="Nuestras aulas" titulo="La planta baja:" grad="aulas y laboratorios"
      lead=${html`En la <b>planta baja</b> están las aulas, los laboratorios, la biblioteca digital y el comedor.`} />
    <div className="dos-col">
      <${Foto} src="aula" alt="Alumnos con ordenadores en un aula" className="revelar alta" />
      <${Puntos} items=${AULAS_TXT.map((a, i) => ({ ...a, icono: ['estrella', 'raton', 'corazon'][i] }))} />
    </div>
    <h3 className="sub-titulo revelar">Las aulas y los laboratorios <span className="linea"></span></h3>
    <div className="rejilla rejilla-4">${AULAS.map(s => html`<${TarjetaSala} key=${s.id} s=${s} planta=${s.nombre.startsWith('Laboratorio') ? 'Planta baja · Laboratorio' : 'Planta baja · Aula'} />`)}</div>
    <h3 className="sub-titulo revelar">Los otros espacios de la planta baja <span className="linea"></span></h3>
    <div className="rejilla rejilla-3">${ESPACIOS_PB.map(s => html`<${TarjetaSala} key=${s.id} s=${s} planta="Planta baja" />`)}</div>
    <h3 className="sub-titulo revelar">El primer piso <span className="linea"></span></h3>
    <div className="rejilla rejilla-4">${POR_PLANTA.primer.filter(s => s.id !== 'salon1').map(s => html`<${TarjetaSala} key=${s.id} s=${s} planta="Primer piso" />`)}</div>
  </section>`;
}

// ---------------- 07 · La residencia ----------------
function SeccionInternado() {
  return html`<section className="seccion" id="internado">
    <${Cabecera} num="07" etiqueta="Nuestro internado" titulo="La residencia:" grad="los dormitorios"
      lead=${html`<b>De lunes a viernes</b>, el colegio es también nuestra casa. Los dormitorios están en un <b>edificio aparte</b>: la residencia.`} />
    <div className="dos-col">
      <${Foto} src="dormitorio" alt="Una habitación con dos camas, dos escritorios y dos armarios" className="revelar alta" />
      <div>
        <${Puntos} items=${INTERNADO.map((p, i) => ({ ...p, icono: ['residencia', 'cama', 'estrella'][i] }))} />
        <div className="botones-fila revelar">
          <button className="btn btn-primario btn-peq" onClick=${() => { alCampus(); setTimeout(() => verResidencia('res1'), 500); }}><${Icono} n="cubo" />Ver las habitaciones</button>
          <button className="btn btn-secundario btn-peq" onClick=${() => { alCampus(); setTimeout(() => seleccionar('hab101', { interior: true }), 500); }}><${Icono} n="ojo" />Entrar en la habitación 101</button>
        </div>
      </div>
    </div>
    <h3 className="sub-titulo revelar">Una semana en el internado <span className="linea"></span></h3>
    <div className="dos-col invertido">
      <${Foto} src="internado" alt="Alumnos en el salón" className="revelar" />
      <div>
        <${Puntos} items=${SEMANA} />
        <div className="rejilla rejilla-2 revelar" style=${{ marginTop: '18px' }}>
          ${[SALAS.salonres, SALAS.estarres, ...COMUNES_INT.slice(0, 2)].map(s => html`<${TarjetaSala} key=${s.id} s=${s} planta=${s.edificio === 'residencia' ? 'Residencia' : 'Edificio principal'} />`)}
        </div>
      </div>
    </div>
    <h3 className="sub-titulo revelar">La vida en nuestro internado <span className="linea"></span></h3>
    <div className="vida revelar">
      ${VIDA.map(v => html`<div key=${v.hora} className="tarjeta">
        <div className="ilus"><${IlusMomento} icono=${v.icono} noche=${v.hora === '21:00'} /></div>
        <div className="cuerpo">
          <div className="hora">${v.hora}</div>
          <div className="letras">${v.titulo}</div>
          <p>${v.texto}</p>
          <button className="ver3d" onClick=${() => verA(v.hora)}><${Icono} n="cubo" />Ver a las ${v.hora}</button>
        </div>
      </div>`)}
    </div>
  </section>`;
}

// ---------------- 08 · Complejo deportivo ----------------
function SeccionDeportes() {
  return html`<section className="seccion seccion-fondo" id="deportes">
    <${Cabecera} num="08" etiqueta="Nuestro complejo deportivo" titulo="Deporte" grad="todo el año"
      lead=${html`El colegio tiene un <b>gimnasio cubierto</b>, un <b>campo de fútbol</b>, una <b>cancha de baloncesto</b> y una <b>piscina olímpica cubierta y climatizada</b>.`} />
    <div className="frases-deporte">
      ${FRASES_DEPORTE.map((f, i) => html`<div key=${i} className="frase-grande revelar"><span>0${i + 1}</span>${f}</div>`)}
    </div>
    <div className="dos-col">
      <${Foto} src="deportes" alt="El gimnasio, el campo de fútbol y la piscina olímpica" className="revelar alta" />
      <div className="rejilla rejilla-2">
        ${POR_PLANTA.deporte.map(s => html`<${TarjetaSala} key=${s.id} s=${s} planta="Complejo deportivo" />`)}
      </div>
    </div>
    <div className="centro revelar" style=${{ marginTop: '26px' }}>
      <button className="btn btn-primario" onClick=${() => { saltarA(aMin('17:40')); alCampus(); setTimeout(() => abrirExplorador('deportes'), 600); }}><${Icono} n="cubo" />Ver los deportes de la tarde en 3D</button>
    </div>
  </section>`;
}

// ---------------- 09 · Asignaturas ----------------
function SeccionAsignaturas() {
  return html`<section className="seccion" id="asignaturas">
    <${Cabecera} num="09" etiqueta="Nuestras asignaturas" titulo="Nuestras" grad="nueve asignaturas"
      lead="Estas son las asignaturas de 4º. Haz clic para ver el aula en 3D." />
    <div className="rejilla rejilla-3">
      ${ASIGNATURAS.map((m, i) => html`<div key=${m.id} className="tarjeta materia revelar" style=${{ '--c': m.color }}>
        <div className="ilus"><${IlusMateria} m=${m} /><span className="num-materia">${i + 1}</span></div>
        <div className="cuerpo">
          <div className="cab"><div className="icono-caja"><${Icono} n=${m.icono} /></div><h3>${m.nombre}</h3></div>
          <p>${m.desc}</p>
          <${Ver3D} id=${m.sala} texto=${m.sala === 'gimnasio' ? 'Ver el gimnasio en 3D' : 'Ver el aula en 3D'} />
        </div>
      </div>`)}
    </div>
  </section>`;
}

// ---------------- 10 · Horario ----------------
function SeccionHorario() {
  const [act, setAct] = useState(0);
  const h = HORARIO[act];
  return html`<section className="seccion seccion-fondo horario" id="horario">
    <${Cabecera} num="10" etiqueta="Nuestro horario" titulo="Un día en el" grad="internado" centro
      lead="Haz clic en una hora para descubrir el momento del día." />
    <div className="linea-tiempo revelar" role="tablist">
      ${HORARIO.map((p, i) => html`<button key=${p.hora} role="tab" aria-selected=${i === act} className=${'paso' + (i === act ? ' activo' : '')} onClick=${() => setAct(i)}>
        <span className="punto"><${Icono} n=${p.icono} /></span>
        <span className="h">${p.hora}</span>
        <span className="f">${p.frase}</span>
      </button>`)}
    </div>
    <div className="detalle-hora" key=${act}>
      <div className="ilus"><${IlusMomento} icono=${h.icono} noche=${!!h.noche} /></div>
      <div className="txt">
        <div className="grande">${h.hora}</div>
        <div className="letras">${h.letras}</div>
        <div className="oficial">${h.frase}</div>
        ${h.nota ? html`<span className="nota-recreo"><${Icono} n="reloj" size=${16} />${h.nota}</span>` : null}
        <div className="nav-hora">
          <button className="btn btn-primario btn-peq" onClick=${() => verA(h.hora)}><${Icono} n="cubo" />Ver el campus a esta hora</button>
          <button className="btn btn-secundario btn-peq" onClick=${() => setAct((act + 1) % HORARIO.length)}>Siguiente hora<${Icono} n="der" /></button>
        </div>
      </div>
    </div>
  </section>`;
}

// ---------------- 11 · Uniforme ----------------
// El visor 3D del uniforme se carga solo cuando se llega a la sección
function VisorDiferido() {
  const [Visor, setVisor] = useState(null);
  const ref = useRef();
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); import('./Uniforme.js').then(m => setVisor(() => m.VisorUniforme)).catch(() => setVisor(() => FotoUniforme)); } }, { rootMargin: '300px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return html`<div ref=${ref}>${Visor ? html`<${Visor} />` : html`<${FotoUniforme} />`}</div>`;
}
const FotoUniforme = () => html`<div className="visor visor-foto"><img src="img/fotos/uniforme.jpg" alt="El uniforme: polo blanco, chaqueta azul marino con el logo, pantalón o falda y zapatos" /></div>`;

function SeccionUniforme() {
  return html`<section className="seccion" id="uniforme">
    <${Cabecera} num="11" etiqueta="Nuestro uniforme" titulo="El uniforme y" grad="la ropa de diario"
      lead=${html`De <b>lunes a viernes</b> llevamos el uniforme. <b>El fin de semana</b>, en casa, llevamos ropa cómoda.`} />
    <div className="dos-fotos">
      <figure className="foto-pie revelar"><${Foto} src="uniforme" alt="El uniforme: polo blanco, chaqueta azul marino con el logo, pantalón azul marino y zapatos" />
        <figcaption><b>Uniforme escolar</b>Un polo blanco con el cuello azul marino, una chaqueta azul marino con el logo y un pantalón o una falda azul marino.</figcaption></figure>
      <figure className="foto-pie revelar"><${Foto} src="ropa-diario" alt="La ropa de diario: sudadera, vaqueros y zapatillas" />
        <figcaption><b>Ropa de diario</b>Ropa cómoda para el fin de semana en casa.</figcaption></figure>
    </div>
    <div className="uniforme-grid">
      <div className="revelar"><${VisorDiferido} /></div>
      <div className="piezas">
        ${UNIFORME_PIEZAS.map(p => html`<div key=${p.pieza} className="tarjeta pieza revelar" style=${{ '--c': p.color }}>
          <span className="muestra"></span>
          <div><h3>${p.pieza}</h3><p>${p.detalle}</p></div>
        </div>`)}
        <div className="tarjeta pieza revelar">
          <img src="img/logo-256.png" alt="El logo del colegio" width="54" height="54" className="muestra-logo" />
          <div><h3>El logo del colegio</h3><p>Es redondo, azul marino y crema. Lleva el nombre del colegio y nuestro lema. Está en la chaqueta, a la izquierda del pecho.</p></div>
        </div>
      </div>
    </div>
  </section>`;
}

// ---------------- 12 · ¿Por qué es ideal? ----------------
function SeccionIdeal() {
  const marcar = (frase, exp) => {
    const base0 = exp.replace(/ en$/, '');
    const i = frase.toLowerCase().indexOf(base0.toLowerCase());
    if (i < 0) return frase;
    const base = frase.slice(i, i + base0.length);
    return html`${frase.slice(0, i)}<mark>${base}</mark>${frase.slice(i + base.length)}`;
  };
  return html`<section className="seccion seccion-fondo" id="ideal">
    <${Cabecera} num="12" etiqueta="¿Por qué es ideal?" titulo="¿Por qué nos gusta" grad="nuestro colegio?" centro
      lead="Instalaciones de calidad, profesores simpáticos y ¡sin deberes en casa!" />
    <div className="ideal-grid">
      <${Foto} src="colegio-atardecer" alt="El colegio al atardecer" className="revelar alta" />
      <div className="razones">
        ${RAZONES.map((r, i) => html`<div key=${i} className="tarjeta razon revelar">
          <span className="expresion">${r.exp}</span>
          <p>${marcar(r.frase, r.exp)}</p>
        </div>`)}
      </div>
    </div>
    <div className="final revelar">
      <img src="img/logo-256.png" alt="" width="96" height="96" />
      <h3>¡Bienvenidos al Colegio Pablo Picasso!</h3>
      <p>${COLEGIO.lema}</p>
      <div className="botones-final">
        <a className="btn btn-primario" href="#presentacion"><${Icono} n="diapo" />Volver a la presentación</a>
        <button className="btn btn-secundario" onClick=${alCampus}><${Icono} n="cubo" />Visitar el campus en 3D</button>
      </div>
    </div>
  </section>`;
}

function Pie() {
  return html`<footer className="pie">
    <div className="marca"><img src="img/logo-256.png" width="46" height="46" alt="" className="logo-img" /><div><b>COLEGIO PABLO PICASSO</b><small>Proyecto de español (4º) · Nuestro colegio ideal</small></div></div>
    <span>Un colegio imaginado por alumnos de 4º. Los alumnos y profesores de la maqueta son personajes inventados.</span>
    <a className="subir" href="#presentacion"><${Icono} n="arriba" />Volver arriba</a>
  </footer>`;
}

export function Sitio() {
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: 0.06 });
    document.querySelectorAll('.revelar').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return html`
    <div className="contenido">
      <${SeccionVida} />
      <${SeccionPermanencia} />
      <${SeccionVidaEscolar} />
      <${SeccionAsistentes} />
      <${SeccionColegio} />
      <${SeccionAulas} />
      <${SeccionInternado} />
      <${SeccionDeportes} />
      <${SeccionAsignaturas} />
      <${SeccionHorario} />
      <${SeccionUniforme} />
      <${SeccionIdeal} />
    </div>
    <${Pie} />
  `;
}
