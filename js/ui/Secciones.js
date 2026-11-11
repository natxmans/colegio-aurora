// =========================================================
// SITIO: menú, portada y todas las secciones de presentación (en español)
// =========================================================
import { html, useState, useEffect, useRef } from '../lib.js';
import { poner, abrirExplorador, seleccionar, volar } from '../estado.js';
import { SALAS, AULAS, ESPACIOS_PB, COMUNES_INT, POR_PLANTA, VISTAS } from '../datos/salas.js';
import { COLEGIO, CIFRAS, MENU, ZONAS_CAMPUS, ASIGNATURAS, HORARIO, VIDA, FRASES_DEPORTE, UNIFORME_PIEZAS, RAZONES, ARQUITECTURA } from '../datos/contenido.js';
import { Icono, Logo, IlusMateria, IlusMomento } from './Iconos.js';
import { VisorUniforme } from './Uniforme.js';

const irA = (id) => {
  if (id === 'explorar') return abrirExplorador('completa');
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function Ver3D({ id, texto = 'Ver en 3D' }) {
  return html`<button className="ver3d" onClick=${() => seleccionar(id)}><${Icono} n="cubo" />${texto}</button>`;
}

function Cabecera({ num, etiqueta, titulo, grad, lead, centro }) {
  return html`<div className=${'cabecera revelar' + (centro ? ' centro' : '')}>
    <span className="etiqueta">${num} · ${etiqueta}</span>
    <h2>${titulo} ${grad ? html`<span className="grad">${grad}</span>` : null}</h2>
    ${lead ? html`<p className="lead">${lead}</p>` : null}
  </div>`;
}

// ---------------- Menú ----------------
function Nav() {
  const [solida, setSolida] = useState(false);
  const [abierto, setAbierto] = useState(false);
  useEffect(() => {
    const f = () => setSolida(window.scrollY > 40);
    f(); window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  const click = (id) => { setAbierto(false); irA(id); };
  return html`<${'nav'} className=${'nav' + (solida ? ' solida' : '')} aria-label="Menú principal">
    <a className="marca" href="#inicio" onClick=${e => { e.preventDefault(); click('inicio'); }}>
      <${Logo} size=${36} /><div><b>AURORA</b><small>Colegio-internado</small></div>
    </a>
    <div className="nav-links">
      ${MENU.filter(m => m.id !== 'explorar').map(m => html`<a key=${m.id} href=${'#' + m.id} onClick=${e => { e.preventDefault(); click(m.id); }}>${m.t}</a>`)}
      <button className="nav-3d" onClick=${() => click('explorar')}><${Icono} n="cubo" />Explorar en 3D</button>
    </div>
    <button className="hamburguesa" onClick=${() => setAbierto(!abierto)} aria-label="Abrir el menú" aria-expanded=${abierto}><${Icono} n=${abierto ? 'cerrar' : 'menu'} /></button>
    ${abierto ? html`<div className="menu-movil">
      ${MENU.map((m, i) => html`<button key=${m.id} onClick=${() => click(m.id)}><span className="num">${String(i + 1).padStart(2, '0')}</span>${m.t}</button>`)}
    </div>` : null}
  <//>`;
}

// ---------------- Portada ----------------
function Hero() {
  const ref = useRef();
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => poner({ heroVisible: e.isIntersecting }), { threshold: 0.02 });
    io.observe(ref.current);
    return () => { io.disconnect(); };
  }, []);
  return html`<section className="hero" id="inicio" ref=${ref}>
    <span className="hero-kicker">${COLEGIO.tipo} · ${COLEGIO.lugar}</span>
    <h1>${COLEGIO.nombre}</h1>
    <p className="hero-slogan">Aprender hoy, <em>brillar mañana.</em></p>
    <p className="hero-texto">${COLEGIO.presentacion}</p>
    <div className="hero-botones">
      <button className="btn btn-primario" onClick=${() => abrirExplorador('completa')}><${Icono} n="cubo" />Explorar nuestro colegio</button>
      <button className="btn btn-secundario" onClick=${() => abrirExplorador('primer')}><${Icono} n="cama" />Descubrir el internado</button>
    </div>
    <div className="hero-stats">
      ${CIFRAS.map(c => html`<div key=${c.t} className="stat"><b>${c.n}</b><span>${c.t}</span></div>`)}
    </div>
    <a className="hero-bajar" href="#colegio" onClick=${e => { e.preventDefault(); irA('colegio'); }}><i></i>Descubrir</a>
  </section>`;
}

// ---------------- Nuestro colegio ----------------
function Plano() {
  const zonas = ['futbol', 'jardin', 'patio', 'edificio', 'gimnasio', 'fitness', 'vestuarios', 'piscina', 'baloncesto', 'padel'].map(id => SALAS[id]);
  return html`<div className="plano revelar">
    <svg viewBox="-92 -86 228 158" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Plano del campus">
      <defs><pattern id="rej" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="rgba(120,170,255,.08)" strokeWidth=".4" /></pattern></defs>
      <rect x="-92" y="-86" width="228" height="158" fill="url(#rej)" />
      <rect x="-84" y="-82" width="216" height="132" rx="4" fill="none" stroke="rgba(61,139,255,.5)" strokeWidth=".8" strokeDasharray="3 2" />
      <rect x="-7" y="48" width="14" height="22" fill="rgba(255,255,255,.08)" />
      ${zonas.map(s => html`<g key=${s.id} className="zona" onClick=${() => seleccionar(s.id)}>
        <rect x=${s.x0} y=${s.z0} width=${s.x1 - s.x0} height=${s.z1 - s.z0} rx="2" fill=${s.color} fillOpacity=${s.id === 'edificio' ? 0.75 : 0.42} stroke=${s.color} strokeWidth=".8" />
        <text x=${(s.x0 + s.x1) / 2} y=${(s.z0 + s.z1) / 2 + 1.6} textAnchor="middle" fill="#fff" fontSize=${s.id === 'edificio' || s.id === 'futbol' || s.id === 'patio' ? 5 : 3.6} fontWeight="600" fontFamily="Space Grotesk, sans-serif">${s.corto}</text>
      </g>`)}
      <text x="0" y="66" textAnchor="middle" fill="#7fdcff" fontSize="3.6" fontFamily="Space Grotesk">Entrada</text>
      <text x="128" y="-74" textAnchor="end" fill="rgba(255,255,255,.5)" fontSize="4" fontFamily="Orbitron">N ↑</text>
    </svg>
    <div className="plano-leyenda">Plano del campus · haz clic en una zona</div>
  </div>`;
}

function SeccionColegio() {
  return html`<section className="seccion" id="colegio">
    <${Cabecera} num="01" etiqueta="Nuestro colegio" titulo="Un campus del futuro" grad="en España"
      lead=${html`Nuestro colegio está en <b>Valencia</b>, cerca del mar Mediterráneo. Es un colegio-internado moderno: los alumnos <b>estudian</b>, <b>viven</b> y <b>practican deporte</b> en el mismo lugar.`} />
    <div className="colegio-grid">
      <${Plano} />
      <div className="zonas">
        ${ZONAS_CAMPUS.map(z => html`<div key=${z.id} className="tarjeta revelar" style=${{ '--c': z.color }}>
          <div className="icono-caja"><${Icono} n=${z.icono} /></div>
          <h3>${z.t}</h3><p>${z.txt}</p>
          <${Ver3D} id=${z.id} />
        </div>`)}
      </div>
    </div>
    <div className="destacado revelar">
      <${Icono} n="sol" />
      <div>
        <p><b>Arquitectura:</b> las fachadas son de cristal y hay luces LED azules. En el techo hay paneles solares: ¡es un colegio ecológico!</p>
        <div className="chips" style=${{ marginTop: '12px' }}>${ARQUITECTURA.map(a => html`<span key=${a} className="chip">${a}</span>`)}</div>
      </div>
    </div>
  </section>`;
}

// ---------------- Nuestras aulas ----------------
const ICONO_SALA = { mates: 'mates', frances: 'frances', ingles: 'ingles', historia: 'historia', svt: 'svt', fisica: 'fisica', tecno: 'tecno', musica: 'musica', arte: 'estrella', informatica: 'raton', biblioteca: 'libro', recepcion: 'inicio', comedor: 'comida', enfermeria: 'mano', salacomun: 'balon', banos: 'reloj', aseos: 'pin', descanso: 'hoja', juegos: 'balon', comunint: 'inicio', lavanderia: 'camiseta', gimnasio: 'balon', fitness: 'estrella', vestuarios: 'camiseta', piscina: 'sol', futbol: 'balon', baloncesto: 'balon', padel: 'balon' };

function TarjetaSala({ s, planta }) {
  return html`<div className="tarjeta aula-card revelar" style=${{ '--c': s.color }}>
    <span className="franja"></span>
    <div className="icono-caja"><${Icono} n=${ICONO_SALA[s.id] || ICONO_SALA[s.materia] || 'edificio'} /></div>
    ${planta ? html`<div className="planta">${planta}</div>` : null}
    <h3>${s.nombre}</h3>
    <p>${s.desc.split('. ')[0].replace(/\.$/, '')}.</p>
    <${Ver3D} id=${s.id} />
  </div>`;
}

function SeccionAulas() {
  return html`<section className="seccion seccion-fondo" id="aulas">
    <${Cabecera} num="02" etiqueta="Nuestras aulas" titulo="La planta baja:" grad="la zona escolar"
      lead=${html`En la <b>planta baja</b> están las ocho aulas y los espacios comunes. Cada aula es diferente y tiene una <b>pizarra digital</b>. Los alumnos llevan el uniforme del colegio.`} />
    <div className="rejilla rejilla-4">${AULAS.map(s => html`<${TarjetaSala} key=${s.id} s=${s} planta="Planta baja · Aula" />`)}</div>
    <h3 className="sub-titulo revelar">Otros espacios de la planta baja <span className="linea"></span></h3>
    <div className="rejilla rejilla-4">${ESPACIOS_PB.map(s => html`<${TarjetaSala} key=${s.id} s=${s} planta="Planta baja" />`)}</div>
  </section>`;
}

// ---------------- Nuestro internado ----------------
function SeccionInternado() {
  return html`<section className="seccion" id="internado">
    <${Cabecera} num="03" etiqueta="Nuestro internado" titulo="El primer piso:" grad="nuestro internado"
      lead=${html`Los alumnos internos viven en el colegio de lunes a viernes. <b>Todos los dormitorios están en el primer piso.</b>`} />
    <div className="aviso-piso revelar"><${Icono} n="primer" size=${26} /><b>PRIMER PISO</b><span>12 habitaciones dobles + baños, aseos, sala de juegos, sala común, zona de descanso y lavandería.</span></div>
    <div className="internado-grid">
      <div className="tarjeta hab-destacada revelar" style=${{ '--c': '#8b5cf6' }}>
        <div className="icono-caja"><${Icono} n="cama" /></div>
        <h3>Una habitación para dos alumnos</h3>
        <p>Las habitaciones son modernas, luminosas y muy cómodas. Cada alumno tiene su cama, su escritorio y su armario.</p>
        <ul className="lista-check">
          <li>Dos camas cómodas</li><li>Dos escritorios</li><li>Dos sillas</li><li>Dos armarios</li>
          <li>Lámparas y luces LED</li><li>Una ventana con balcón</li>
        </ul>
        <div style=${{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
          <button className="btn btn-primario btn-peq" onClick=${() => seleccionar('hab104')}><${Icono} n="cubo" />Visitar una habitación</button>
          <button className="btn btn-secundario btn-peq" onClick=${() => seleccionar('hab101', { interior: true })}><${Icono} n="ojo" />Entrar en la habitación 101</button>
        </div>
      </div>
      <div className="rejilla rejilla-2">${COMUNES_INT.map(s => html`<${TarjetaSala} key=${s.id} s=${s} planta="Primer piso" />`)}</div>
    </div>
    <h3 className="sub-titulo revelar">La vida en nuestro internado <span className="linea"></span></h3>
    <div className="vida revelar">
      ${VIDA.map(v => html`<div key=${v.hora} className="tarjeta">
        <div className="ilus"><${IlusMomento} icono=${v.icono} noche=${v.hora === '21:00'} /></div>
        <div className="cuerpo">
          <div className="hora">${v.hora}</div>
          <div className="letras">${v.titulo}</div>
          <p>${v.texto}</p>
          <${Ver3D} id=${v.sala} />
        </div>
      </div>`)}
    </div>
  </section>`;
}

// ---------------- Complejo deportivo ----------------
function SeccionDeportes() {
  return html`<section className="seccion seccion-fondo" id="deportes">
    <${Cabecera} num="04" etiqueta="Nuestro complejo deportivo" titulo="Deporte y salud" grad="para todos"
      lead=${html`El colegio tiene su propio <b>complejo deportivo</b>, al lado del edificio principal. Se ve muy bien desde la vista aérea.`} />
    <div className="frases-deporte">
      ${FRASES_DEPORTE.map((f, i) => html`<div key=${i} className="frase-grande revelar"><span>0${i + 1}</span>${f}</div>`)}
    </div>
    <div className="rejilla rejilla-4">${POR_PLANTA.deporte.map(s => html`<${TarjetaSala} key=${s.id} s=${s} planta="Complejo deportivo" />`)}
      <div className="tarjeta aula-card revelar" style=${{ '--c': '#22d3ee' }}>
        <span className="franja"></span>
        <div className="icono-caja"><${Icono} n="cubo" /></div>
        <div className="planta">Vista aérea</div>
        <h3>Todo el complejo</h3>
        <p>Gimnasio, piscina, fútbol, baloncesto, pádel, fitness, vestuarios y gradas.</p>
        <button className="ver3d" onClick=${() => { abrirExplorador('completa'); volar(VISTAS.deportes); }}><${Icono} n="cubo" />Ver en 3D</button>
      </div>
    </div>
  </section>`;
}

// ---------------- Asignaturas ----------------
function SeccionAsignaturas() {
  return html`<section className="seccion" id="asignaturas">
    <${Cabecera} num="05" etiqueta="Nuestras asignaturas" titulo="Nueve asignaturas," grad="nueve aventuras"
      lead="En nuestro colegio estudiamos estas asignaturas. Haz clic para ver su aula en 3D." />
    <div className="rejilla rejilla-3">
      ${ASIGNATURAS.map(m => html`<div key=${m.id} className="tarjeta materia revelar" style=${{ '--c': m.color }}>
        <div className="ilus"><${IlusMateria} m=${m} /></div>
        <div className="cuerpo">
          <div className="cab"><div className="icono-caja"><${Icono} n=${m.icono} /></div><div><h3>${m.nombre}</h3></div></div>
          <p>${m.desc}</p>
          <${Ver3D} id=${m.sala} texto=${m.sala === 'gimnasio' ? 'Ver el gimnasio en 3D' : 'Ver el aula en 3D'} />
        </div>
      </div>`)}
    </div>
  </section>`;
}

// ---------------- Horario ----------------
function SeccionHorario() {
  const [act, setAct] = useState(0);
  const h = HORARIO[act];
  return html`<section className="seccion seccion-fondo horario" id="horario">
    <${Cabecera} num="06" etiqueta="Nuestro horario" titulo="Un día en el" grad="Colegio Aurora" centro
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
          <button className="btn btn-primario btn-peq" onClick=${() => seleccionar(h.sala, { noche: !!h.noche })}><${Icono} n="cubo" />Ver el lugar en 3D</button>
          <button className="btn btn-secundario btn-peq" onClick=${() => setAct((act + 1) % HORARIO.length)}>Siguiente hora<${Icono} n="der" /></button>
        </div>
      </div>
    </div>
  </section>`;
}

// ---------------- Uniforme ----------------
function SeccionUniforme() {
  return html`<section className="seccion" id="uniforme">
    <${Cabecera} num="07" etiqueta="Nuestro uniforme" titulo="Un uniforme" grad="moderno y cómodo"
      lead="Todos los alumnos llevan el mismo uniforme. Tiene los colores del colegio: azul noche, blanco, gris claro y cian." />
    <div className="uniforme-grid">
      <div className="revelar"><${VisorUniforme} /></div>
      <div className="piezas">
        ${UNIFORME_PIEZAS.map(p => html`<div key=${p.pieza} className="tarjeta pieza revelar" style=${{ '--c': p.color }}>
          <span className="muestra"></span>
          <div><h3>${p.pieza}</h3><p>${p.detalle}</p></div>
        </div>`)}
      </div>
    </div>
  </section>`;
}

// ---------------- ¿Por qué es ideal? ----------------
function SeccionIdeal() {
  const marcar = (frase, exp) => {
    const base0 = exp.replace(/ en$/, '');
    const i = frase.toLowerCase().indexOf(base0.toLowerCase());
    const base = i >= 0 ? frase.slice(i, i + base0.length) : base0;
    if (i < 0) return frase;
    return html`${frase.slice(0, i)}<mark>${base}</mark>${frase.slice(i + base.length)}`;
  };
  return html`<section className="seccion seccion-fondo" id="ideal">
    <${Cabecera} num="08" etiqueta="¿Por qué es ideal?" titulo="¿Por qué es" grad="nuestro colegio ideal?" centro
      lead="Estas son las razones por las que nos encanta el Colegio Aurora." />
    <div className="razones">
      ${RAZONES.map((r, i) => html`<div key=${i} className="tarjeta razon revelar" style=${{ '--c': r.color }}>
        <span className="expresion">${r.exp}</span>
        <p>${marcar(r.frase, r.exp)}</p>
      </div>`)}
    </div>
    <div className="final revelar">
      <h3>¿Quieres visitar nuestro colegio?</h3>
      <p>Entra en la maqueta 3D: gira alrededor del campus, abre el edificio y descubre las aulas, el internado y el complejo deportivo.</p>
      <div className="hero-botones">
        <button className="btn btn-primario" onClick=${() => abrirExplorador('completa')}><${Icono} n="cubo" />Explorar nuestro colegio</button>
        <button className="btn btn-secundario" onClick=${() => { seleccionar('edificio'); poner({ guiada: true }); }}><${Icono} n="guia" />Visita guiada</button>
      </div>
    </div>
  </section>`;
}

function Pie() {
  return html`<footer className="pie">
    <div className="marca"><${Logo} size=${30} /><div><b>COLEGIO AURORA</b><small>Proyecto final de español · Nuestro colegio ideal</small></div></div>
    <span>Un colegio imaginario en Valencia, España.</span>
    <button className="subir" onClick=${() => irA('inicio')}><${Icono} n="izq" />Volver al inicio</button>
  </footer>`;
}

export function Sitio() {
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: 0.08 });
    document.querySelectorAll('.revelar').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return html`
    <div className="lienzo-velo"></div>
    <${Nav} />
    <${Hero} />
    <main className="contenido">
      <${SeccionColegio} />
      <div className="separador"></div>
      <${SeccionAulas} />
      <${SeccionInternado} />
      <${SeccionDeportes} />
      <${SeccionAsignaturas} />
      <${SeccionHorario} />
      <${SeccionUniforme} />
      <${SeccionIdeal} />
    </main>
    <${Pie} />
  `;
}
