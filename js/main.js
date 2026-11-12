// =========================================================
// COLEGIO PABLO PICASSO · aplicación principal
// =========================================================
import { html, createRoot, Component } from './lib.js';
import { useEstado, poner, camara, seleccionar, abrirExplorador, hayWebGL } from './estado.js';
import { SALAS, VISTAS } from './datos/salas.js';
import { Escena } from './3d/Escena.js';
import { Explorador } from './ui/Explorador.js';
import { Sitio } from './ui/Secciones.js';
import { Icono } from './ui/Iconos.js';


// Imagen fija del campus + mensaje (si la 3D no funciona)
function Sin3D({ titulo, texto, boton = false }) {
  return html`<div className="sin3d">
    <img src="img/campus-3d.jpg" alt="Vista general del campus del Colegio Pablo Picasso" />
    <div className="sin3d-caja">
      <h2>${titulo}</h2>
      <p>${texto}</p>
      ${boton ? html`<button className="btn btn-primario" onClick=${() => location.reload()}>Volver a cargar</button>` : null}
    </div>
  </div>`;
}

// Solución de emergencia si la maqueta 3D no se puede cargar
class Seguro extends Component {
  constructor(p) { super(p); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(e) { console.error(e); if (window.__listo) window.__listo(); }
  render() {
    if (this.state.error) return html`<${Sin3D} titulo="La maqueta 3D no se puede mostrar"
      texto="Tu navegador no puede cargar la escena 3D. Aquí tienes una imagen del campus. Prueba con Chrome, Edge o Firefox actualizados, o vuelve a cargar la página." boton />`;
    return this.props.children;
  }
}

function App() {
  const modo = useEstado(s => s.modo);
  const webgl = hayWebGL();
  return html`
    <div className="lienzo" aria-label="Maqueta 3D del Colegio Pablo Picasso">
      ${webgl ? html`<${Seguro}><${Escena} /><//>` : html`<${Sin3D} titulo="Sin 3D en este navegador" texto="Este navegador no tiene WebGL: la maqueta 3D no se puede mostrar. Aquí tienes una imagen del campus." />`}
    </div>
    ${modo === 'explorar' ? html`<${Explorador} />` : html`<${Sitio} />`}
  `;
}

const arrancar = async () => {
  try { await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]); } catch (e) {}
  // Logo ORIGINAL precargado (se usa en las pizarras, pantallas y banderas de la maqueta)
  const logo = new Image();
  logo.src = 'img/logo-512.png';
  try { await logo.decode(); } catch (e) {}
  window.__logoImg = logo;
  createRoot(document.getElementById('raiz')).render(html`<${App} />`);
  if (!hayWebGL()) setTimeout(() => window.__listo && window.__listo(), 300);
  setTimeout(() => window.__listo && window.__listo(), 20000);
  enlaceDirecto();
};

// Enlaces directos: ?vista=completa|baja|primer|corte · ?sala=mates · &noche=1 · ?seccion=presentacion
function enlaceDirecto() {
  const q = new URLSearchParams(location.search);
  const vista = q.get('vista'), sala = q.get('sala'), seccion = q.get('seccion');
  if (!vista && !sala && !seccion) return;
  const esperar = () => {
    if (!camara.ctrl && !seccion) return setTimeout(esperar, 200);
    setTimeout(() => {
      if (q.get('noche') === '1') poner({ noche: true });
      if (q.get('techo') === '0') poner({ techo: false });
      if (sala && SALAS[sala]) seleccionar(sala, { interior: q.get('dentro') === '1' });
      else if (vista && VISTAS[vista]) abrirExplorador(vista);
      else if (seccion) document.getElementById(seccion)?.scrollIntoView();
    }, 600);
  };
  esperar();
}
arrancar();
