// =========================================================
// LA SECCIÓN DEL CAMPUS 3D
// · La maqueta se carga cuando el visitante se acerca a la sección (carga progresiva).
// · Si el aparato no puede mostrar la 3D, se ve una imagen del campus y un mensaje
//   (el resto del sitio y la presentación siguen funcionando).
// · Calidad alta / normal / ligera: propuesta por el diagnóstico, elegible por el visitante.
//   Si la maqueta va demasiado lenta, la calidad baja sola (y se avisa).
// =========================================================
import { html, useState, useEffect, useRef, Component } from '../lib.js';
import { useEstado, poner, leer, hayWebGL } from '../estado.js';
import { NIVELES, calidadInicial, guardarCalidad } from '../calidad.js';
import { Explorador } from './Explorador.js';

const MENSAJES = ['Preparando el campus…', 'Construyendo las aulas…', 'Levantando la residencia…', 'Colocando los pupitres…', 'Llegan los alumnos…', 'Llenando la piscina…', 'Encendiendo las farolas…'];

class Seguro extends Component {
  constructor(p) { super(p); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(e) { console.error(e); if (window.__errorSitio) window.__errorSitio('La maqueta 3D no se puede mostrar en este navegador. Aquí tienes una imagen del campus. La presentación y el resto del sitio funcionan.'); }
  render() { return this.state.error ? null : this.props.children; }
}

// Selector de calidad dentro del panel del diagnóstico (fuera de React)
function pintarCalidad(actual, cambiar) {
  const caja = document.getElementById('diag-calidad');
  if (!caja) return;
  if (!hayWebGL()) { caja.innerHTML = ''; return; }
  caja.innerHTML = '<b>Calidad de la maqueta 3D</b><div class="diag-botones"></div><small></small>';
  const fila = caja.querySelector('.diag-botones');
  for (const k of ['alta', 'normal', 'ligera']) {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = NIVELES[k].t; b.className = k === actual ? 'activo' : '';
    b.onclick = () => cambiar(k);
    fila.appendChild(b);
  }
  caja.querySelector('small').textContent = NIVELES[actual].desc;
}

export function Campus3D() {
  const [Escena, setEscena] = useState(null);
  const [calidad, setCalidad] = useState(calidadInicial);
  const [clave, setClave] = useState(0);
  const listo = useEstado(s => s.listo3d);
  const modo = useEstado(s => s.modo);
  const caja = useRef();
  const webgl = hayWebGL() && window.__diag && window.__diag.navegador !== false;

  // ¿la sección está a la vista? (la 3D solo se dibuja entonces)
  useEffect(() => {
    const sec = document.getElementById('campus');
    const io = new IntersectionObserver(([e]) => poner({ campusVisible: e.isIntersecting }), { threshold: 0.05 });
    io.observe(sec);
    return () => io.disconnect();
  }, []);

  // carga progresiva: cuando el visitante se acerca (o un poco después de abrir la página)
  useEffect(() => {
    if (!webgl) {
      if (window.__errorSitio) window.__errorSitio('Este aparato no puede mostrar gráficos 3D (WebGL). Aquí tienes una imagen del campus: la presentación y todo el contenido siguen disponibles.');
      return;
    }
    let hecho = false, i = 0, p = 4, tm = 0, espera = 0, rondas = 0;
    const recargarPagina = () => { location.hash = 'campus'; location.reload(); };
    // Una ronda = hasta 3 intentos seguidos (con una pequeña pausa): un corte de red
    // de un segundo (wifi del aula) no impide ver la maqueta.
    const cargar = () => {
      rondas++; p = 4;
      clearInterval(tm); clearTimeout(espera);
      tm = setInterval(() => { if (leer().listo3d) { clearInterval(tm); return; } i = (i + 1) % MENSAJES.length; p = Math.min(92, p + (92 - p) * 0.14); if (window.__progreso3d) window.__progreso3d(p, MENSAJES[i]); }, 700);
      if (window.__progreso3d) window.__progreso3d(6, MENSAJES[0]);
      espera = setTimeout(() => { if (!leer().listo3d && window.__errorSitio) clearInterval(tm); if (!leer().listo3d && window.__errorSitio) window.__errorSitio('La maqueta 3D tarda mucho en cargar (conexión lenta o sin Internet). Puedes esperar un poco más o pulsar «Reintentar»; la presentación sigue disponible arriba.', recargarPagina); }, 25000);
      let intento = 0;
      const importar = () => {
        intento++;
        import('../3d/Escena.js').then(m => setEscena(() => m.Escena)).catch(e => {
          if (intento < 3) { console.warn('Maqueta 3D: intento ' + intento + ' fallido, se vuelve a intentar.', e); setTimeout(importar, intento * 2000); return; }
          console.error(e); clearInterval(tm); clearTimeout(espera);
          // 1.ª vez: el botón vuelve a intentar sin recargar; después: recarga la página
          if (window.__errorSitio) window.__errorSitio('No se ha podido cargar la maqueta 3D (se necesita Internet). La presentación y los textos siguen disponibles.', rondas < 2 ? cargar : recargarPagina);
        });
      };
      importar();
    };
    const empezar = () => { if (hecho) return; hecho = true; cargar(); };
    const sec = document.getElementById('campus');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) empezar(); }, { rootMargin: '500px 0px' });
    io.observe(sec);
    const t = setTimeout(empezar, 3500);
    window.__empezar3d = empezar;
    return () => { io.disconnect(); clearTimeout(t); clearInterval(tm); };
  }, []);

  // cuando está lista: se quita la imagen de espera
  useEffect(() => {
    if (!listo) return;
    if (window.__progreso3d) window.__progreso3d(100, '¡Bienvenidos!');
    const el = document.getElementById('campus-espera');
    if (el) el.classList.add('oculto');
  }, [listo]);

  // selector de calidad
  useEffect(() => {
    const cambiar = (k) => { guardarCalidad(k); setCalidad(k); setClave(c => c + 1); poner({ listo3d: false, calidad: k }); pintarCalidad(k, cambiar); };
    window.__pintarCalidad = () => pintarCalidad(calidad, cambiar);
    window.__cambiarCalidad = cambiar;
    pintarCalidad(calidad, cambiar);
    poner({ calidad });
  }, [calidad]);

  // si va demasiado lento, se baja la calidad una vez (y se avisa)
  useEffect(() => {
    if (!listo || calidad === 'ligera') return;
    let n = 0, t0 = 0, raf = 0, parar = false;
    const medir = (t) => {
      if (parar) return;
      if (!leer().campusVisible && leer().modo !== 'explorar') { raf = requestAnimationFrame(medir); t0 = 0; n = 0; return; }
      if (!t0) t0 = t;
      n++;
      if (t - t0 > 5000) {
        const fps = n / ((t - t0) / 1000);
        window.__fps = Math.round(fps);
        if (fps < 18 && !new URLSearchParams(location.search).get('calidad')) {
          const nueva = calidad === 'alta' ? 'normal' : 'ligera';
          poner({ aviso: `La maqueta iba lenta en este aparato (${Math.round(fps)} imágenes/s): calidad «${NIVELES[nueva].t}».` });
          window.__cambiarCalidad(nueva);
        }
        return;
      }
      raf = requestAnimationFrame(medir);
    };
    const t = setTimeout(() => { raf = requestAnimationFrame(medir); }, 2500);
    return () => { parar = true; clearTimeout(t); cancelAnimationFrame(raf); };
  }, [listo, calidad]);

  if (!webgl) return null;
  return html`<div className=${'campus-vivo' + (listo ? ' listo' : '')} ref=${caja}>
    <div className="lienzo3d">${Escena ? html`<${Seguro}><${Escena} key=${clave} calidad=${calidad} /><//>` : null}</div>
    ${Escena ? html`<${Explorador} embebido=${modo !== 'explorar'} />` : null}
  </div>`;
}
