// =========================================================
// SITIO · COLEGIO PABLO PICASSO
// Menú, portada y todas las secciones (español sencillo, fiel al PowerPoint)
// =========================================================
import { html, useState, useEffect, useRef } from '../lib.js';
import { poner, abrirExplorador, seleccionar, volar } from '../estado.js';
import { SALAS, AULAS, ESPACIOS_PB, COMUNES_INT, POR_PLANTA, VISTAS } from '../datos/salas.js';
import { COLEGIO, CIFRAS, MENU, PRESENTACION, EDIFICIO, AULAS_TXT, COMUNES, INTERNADO, SEMANA, ASIGNATURAS, HORARIO, VIDA, FRASES_DEPORTE, UNIFORME_PIEZAS, RAZONES } from '../datos/contenido.js';
import { Icono, Logo, IlusMateria, IlusMomento } from './Iconos.js';
import { VisorUniforme } from './Uniforme.js';
import { Presentacion } from './Presentacion.js';

const irA = (id) => {
  if (id === 'explorar') return abrirExplorador('completa');
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function Ver3D({ id, texto = 'Ver en 3D' }) {
  return html`<button className="ver3d" onClick=${() => seleccionar(id)}><${Icono} n="cubo" />${texto}</button>`;
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
  return html`<nav className=${'nav' + (solida ? ' solida' : '')} aria-label="Menú principal">
    <a className="marca" href="#inicio" onClick=${e => { e.preventDefault(); click('inicio'); }}>
      <${Logo} size=${44} /><div><b>COLEGIO PABLO PICASSO</b><small>Nuestro colegio ideal</small></div>
    </a>
    <div className="nav-links">
      ${MENU.filter(m => m.id !== 'explorar' && m.id !== 'inicio').map(m => html`<a key=${m.id} href=${'#' + m.id} onClick=${e => { e.preventDefault(); click(m.id); }}>${m.t}</a>`)}
      <button className="nav-3d" onClick=${() => click('explorar')}><${Icono} n="cubo" />Explorar en 3D</button>
    </div>
    <button className="hamburguesa" onClick=${() => setAbierto(!abierto)} aria-label="Abrir el menú" aria-expanded=${abierto}><${Icono} n=${abierto ? 'cerrar' : 'menu'} /><span>Menú</span></button>
    ${abierto ? html`<div className="menu-movil">
      ${MENU.map((m, i) => html`<button key=${m.id} onClick=${() => click(m.id)}><span className="num">${String(i + 1).padStart(2, '0')}</span>${m.t}</button>`)}
    </div>` : null}
  </nav>`;
}

// ---------------- Portada ----------------
function Hero() {
  const ref = useRef();
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => poner({ heroVisible: e.isIntersecting }), { threshold: 0.02 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return html`<section className="hero" id="inicio" ref=${ref}>
    <div className="hero-logo"><img src="img/logo-512.png" alt="Logo del Colegio Pablo Picasso" width="150" height="150" /></div>
    <span className="hero-kicker">Proyecto de español (4º) · ${COLEGIO.proyecto}</span>
    <h1>Colegio <span>Pablo Picasso</span></h1>
    <p className="hero-slogan">${COLEGIO.lema}<br /><em>Un internado moderno en España</em></p>
    <p className="hero-texto">${COLEGIO.presentacion}</p>
    <div className="hero-botones">
      <button className="btn btn-primario" onClick=${() => abrirExplorador('completa')}><${Icono} n="cubo" />Explorar nuestro colegio</button>
      <button className="btn btn-secundario" onClick=${() => abrirExplorador('primer')}><${Icono} n="cama" />Descubrir el internado</button>
      <button className="btn btn-texto" onClick=${() => irA('presentacion')}><${Icono} n="diapo" />Ver la presentación</button>
    </div>
    <div className="hero-stats">
      ${CIFRAS.map(c => html`<div key=${c.t} className="stat"><b>${c.n}</b><span>${c.t}</span></div>`)}
    </div>
    <a className="hero-bajar" href="#colegio" onClick=${e => { e.preventDefault(); irA('colegio'); }}><i></i>Descubrir</a>
  </section>`;
}

// ---------------- 01 · Nuestro colegio ----------------
function Plano() {
  const zonas = ['futbol', 'jardin', 'patio', 'edificio', 'gimnasio', 'piscina', 'baloncesto'].map(id => SALAS[id]).filter(Boolean);
  return html`<div className="plano revelar">
    <svg viewBox="-70 -70 180 128" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Plano del campus">
      <rect x="-68" y="-68" width="176" height="124" rx="4" fill="#f6f1e7" stroke="#c9a978" strokeWidth=".8" />
      <rect x="-3" y="54" width="6" height="12" fill="#e2d6bf" />
      ${zonas.map(s => html`<g key=${s.id} className="zona" onClick=${() => seleccionar(s.id)} tabIndex="0" role="button" aria-label=${s.nombre}
          onKeyDown=${e => { if (e.key === 'Enter') seleccionar(s.id); }}>
        <rect x=${s.x0} y=${s.z0} width=${s.x1 - s.x0} height=${s.z1 - s.z0} rx="2" fill=${s.color} fillOpacity=${s.id === 'edificio' ? 0.9 : 0.6} stroke="#ffffff" strokeWidth=".8" />
        <text x=${(s.x0 + s.x1) / 2} y=${(s.z0 + s.z1) / 2 + 1.6} textAnchor="middle" fill="#fff" fontSize=${s.id === 'edificio' || s.id === 'futbol' || s.id === 'patio' ? 4.6 : 3.6} fontWeight="700" fontFamily="Inter, sans-serif">${s.corto}</text>
      </g>`)}
      <text x="0" y="64" textAnchor="middle" fill="#14285a" fontSize="3.6" fontFamily="Inter, sans-serif" fontWeight="600">Entrada</text>
      <text x="104" y="-60" textAnchor="end" fill="#14285a" fontSize="4" fontFamily="Inter, sans-serif" fontWeight="700">N ↑</text>
    </svg>
    <div className="plano-leyenda">Plano del campus · haz clic en una zona</div>
  </div>`;
}

function SeccionColegio() {
  return html`<section className="seccion" id="colegio">
    <${Cabecera} num="01" etiqueta="Nuestro colegio" titulo="Un colegio moderno," grad="limpio y acogedor"
      lead=${html`El <b>Colegio Pablo Picasso</b> está en España. Tiene un <b>edificio de dos plantas</b>, patios con jardines y un gran <b>complejo deportivo</b>.`} />
    <div className="dos-col">
      <${Foto} src="fachada" alt="La entrada del Colegio Pablo Picasso" className="revelar alta" />
      <${Puntos} items=${PRESENTACION} />
    </div>
    <h3 className="sub-titulo revelar">El edificio <span className="linea"></span></h3>
    <div className="dos-col invertido">
      <${Foto} src="arquitectura" alt="El edificio y el patio con jardines" className="revelar alta" />
      <div>
        <${Puntos} items=${EDIFICIO.map((e, i) => ({ ...e, icono: ['edificio', 'baja', 'primer', 'sol'][i] }))} />
        <div className="botones-fila revelar">
          <button className="btn btn-primario btn-peq" onClick=${() => seleccionar('edificio')}><${Icono} n="cubo" />Ver el edificio en 3D</button>
          <button className="btn btn-secundario btn-peq" onClick=${() => abrirExplorador('corte')}><${Icono} n="corte" />Vista en corte</button>
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

// ---------------- 02 · Nuestras aulas ----------------
const ICONO_SALA = { mates: 'mates', frances: 'frances', ingles: 'ingles', historia: 'historia', svt: 'svt', fisica: 'fisica', tecno: 'tecno', musica: 'musica', biblioteca: 'libro', entrada: 'inicio', comedor: 'comida', salon1: 'sofa', salon2: 'sofa', gimnasio: 'balon', piscina: 'sol', futbol: 'balon', baloncesto: 'balon' };

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
    <${Cabecera} num="02" etiqueta="Nuestras aulas" titulo="La planta baja:" grad="aulas y laboratorios"
      lead=${html`En la <b>planta baja</b> están las aulas, los laboratorios, la biblioteca digital y el comedor.`} />
    <div className="dos-col">
      <${Foto} src="aula" alt="Alumnos con ordenadores en un aula" className="revelar alta" />
      <${Puntos} items=${AULAS_TXT.map((a, i) => ({ ...a, icono: ['estrella', 'raton', 'corazon'][i] }))} />
    </div>
    <h3 className="sub-titulo revelar">Las aulas y los laboratorios <span className="linea"></span></h3>
    <div className="rejilla rejilla-4">${AULAS.map(s => html`<${TarjetaSala} key=${s.id} s=${s} planta=${s.nombre.startsWith('Laboratorio') ? 'Planta baja · Laboratorio' : 'Planta baja · Aula'} />`)}</div>
    <h3 className="sub-titulo revelar">Los otros espacios de la planta baja <span className="linea"></span></h3>
    <div className="rejilla rejilla-3">${ESPACIOS_PB.map(s => html`<${TarjetaSala} key=${s.id} s=${s} planta="Planta baja" />`)}</div>
  </section>`;
}

// ---------------- 03 · Nuestro internado ----------------
function SeccionInternado() {
  return html`<section className="seccion" id="internado">
    <${Cabecera} num="03" etiqueta="Nuestro internado" titulo="El primer piso:" grad="los dormitorios"
      lead=${html`<b>De lunes a viernes</b>, el colegio es también nuestra casa.`} />
    <div className="dos-col">
      <${Foto} src="dormitorio" alt="Una habitación con dos camas, dos escritorios y dos armarios" className="revelar alta" />
      <div>
        <${Puntos} items=${INTERNADO.map((p, i) => ({ ...p, icono: ['primer', 'cama', 'estrella'][i] }))} />
        <div className="botones-fila revelar">
          <button className="btn btn-primario btn-peq" onClick=${() => seleccionar('hab104')}><${Icono} n="cubo" />Visitar una habitación</button>
          <button className="btn btn-secundario btn-peq" onClick=${() => seleccionar('hab101', { interior: true })}><${Icono} n="ojo" />Entrar en la habitación 101</button>
        </div>
      </div>
    </div>
    <h3 className="sub-titulo revelar">Una semana en el internado <span className="linea"></span></h3>
    <div className="dos-col invertido">
      <${Foto} src="internado" alt="Alumnos en el salón del internado" className="revelar" />
      <div>
        <${Puntos} items=${SEMANA} />
        <div className="rejilla rejilla-2 revelar" style=${{ marginTop: '18px' }}>
          ${COMUNES_INT.map(s => html`<${TarjetaSala} key=${s.id} s=${s} planta="Primer piso" />`)}
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
          <${Ver3D} id=${v.sala} />
        </div>
      </div>`)}
    </div>
  </section>`;
}

// ---------------- 04 · Complejo deportivo ----------------
function SeccionDeportes() {
  return html`<section className="seccion seccion-fondo" id="deportes">
    <${Cabecera} num="04" etiqueta="Nuestro complejo deportivo" titulo="Deporte" grad="todo el año"
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
      <button className="btn btn-primario" onClick=${() => { abrirExplorador('completa'); volar(VISTAS.deportes); }}><${Icono} n="cubo" />Ver todo el complejo en 3D</button>
    </div>
  </section>`;
}

// ---------------- 05 · Asignaturas ----------------
function SeccionAsignaturas() {
  return html`<section className="seccion" id="asignaturas">
    <${Cabecera} num="05" etiqueta="Nuestras asignaturas" titulo="Nuestras" grad="nueve asignaturas"
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

// ---------------- 06 · Horario ----------------
function SeccionHorario() {
  const [act, setAct] = useState(0);
  const h = HORARIO[act];
  return html`<section className="seccion seccion-fondo horario" id="horario">
    <${Cabecera} num="06" etiqueta="Nuestro horario" titulo="Un día en el" grad="internado" centro
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

// ---------------- 07 · Uniforme ----------------
function SeccionUniforme() {
  return html`<section className="seccion" id="uniforme">
    <${Cabecera} num="07" etiqueta="Nuestro uniforme" titulo="El uniforme y" grad="la ropa de diario"
      lead=${html`De <b>lunes a viernes</b> llevamos el uniforme. <b>El fin de semana</b>, en casa, llevamos ropa cómoda.`} />
    <div className="dos-fotos">
      <figure className="foto-pie revelar"><${Foto} src="uniforme" alt="El uniforme: polo blanco, chaqueta azul marino con el logo, pantalón o falda y zapatos" />
        <figcaption><b>El uniforme (de lunes a viernes)</b>Un polo blanco con el cuello azul, una chaqueta azul marino con el logo y un pantalón o una falda azul marino.</figcaption></figure>
      <figure className="foto-pie revelar"><${Foto} src="ropa-diario" alt="La ropa de diario: sudadera, vaqueros y zapatillas" />
        <figcaption><b>La ropa de diario (el fin de semana)</b>Ropa cómoda para el fin de semana en casa.</figcaption></figure>
    </div>
    <div className="uniforme-grid">
      <div className="revelar"><${VisorUniforme} /></div>
      <div className="piezas">
        ${UNIFORME_PIEZAS.map(p => html`<div key=${p.pieza} className="tarjeta pieza revelar" style=${{ '--c': p.color }}>
          <span className="muestra"></span>
          <div><h3>${p.pieza}</h3><p>${p.detalle}</p></div>
        </div>`)}
        <div className="tarjeta pieza revelar">
          <img src="img/logo-256.png" alt="El logo del colegio" width="54" height="54" className="muestra-logo" />
          <div><h3>El logo del colegio</h3><p>Un escudo azul con un libro, una pluma y una antorcha. Está en la chaqueta, a la izquierda del pecho.</p></div>
        </div>
      </div>
    </div>
  </section>`;
}

// ---------------- 08 · ¿Por qué es ideal? ----------------
function SeccionIdeal() {
  const marcar = (frase, exp) => {
    const base0 = exp.replace(/ en$/, '');
    const i = frase.toLowerCase().indexOf(base0.toLowerCase());
    if (i < 0) return frase;
    const base = frase.slice(i, i + base0.length);
    return html`${frase.slice(0, i)}<mark>${base}</mark>${frase.slice(i + base.length)}`;
  };
  return html`<section className="seccion seccion-fondo" id="ideal">
    <${Cabecera} num="08" etiqueta="¿Por qué es ideal?" titulo="¿Por qué nos gusta" grad="nuestro colegio?" centro
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
      <p>Entra en la maqueta 3D: gira alrededor del campus, abre el edificio y visita las aulas, el internado y el complejo deportivo.</p>
      <div className="hero-botones">
        <button className="btn btn-primario" onClick=${() => abrirExplorador('completa')}><${Icono} n="cubo" />Explorar nuestro colegio</button>
        <button className="btn btn-secundario" onClick=${() => { seleccionar('edificio'); poner({ guiada: true }); }}><${Icono} n="guia" />Visita guiada</button>
      </div>
    </div>
  </section>`;
}

// ---------------- 09 · Nuestra presentación ----------------
function SeccionPresentacion() {
  return html`<section className="seccion" id="presentacion">
    <${Cabecera} num="09" etiqueta="Nuestra presentación" titulo="Nuestra" grad="presentación" centro
      lead="Las 12 diapositivas de nuestro PowerPoint. Usa las flechas o el teclado." />
    <${Presentacion} />
  </section>`;
}

function Pie() {
  return html`<footer className="pie">
    <div className="marca"><${Logo} size=${46} /><div><b>COLEGIO PABLO PICASSO</b><small>Proyecto de español (4º) · Nuestro colegio ideal</small></div></div>
    <span>Un colegio imaginado por alumnos de 4º.</span>
    <button className="subir" onClick=${() => irA('inicio')}><${Icono} n="arriba" />Volver al inicio</button>
  </footer>`;
}

export function Sitio() {
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: 0.06 });
    document.querySelectorAll('.revelar').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return html`
    <div className="lienzo-velo"></div>
    <${Nav} />
    <${Hero} />
    <main className="contenido">
      <${SeccionColegio} />
      <${SeccionAulas} />
      <${SeccionInternado} />
      <${SeccionDeportes} />
      <${SeccionAsignaturas} />
      <${SeccionHorario} />
      <${SeccionUniforme} />
      <${SeccionIdeal} />
      <${SeccionPresentacion} />
    </main>
    <${Pie} />
  `;
}
