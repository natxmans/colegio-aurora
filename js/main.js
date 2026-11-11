// =========================================================
// COLEGIO AURORA · aplicación principal
// =========================================================
import { html, createRoot, Component } from './lib.js';
import { useEstado, volverInicio } from './estado.js';
import { Escena } from './3d/Escena.js';
import { Explorador } from './ui/Explorador.js';
import { Sitio } from './ui/Secciones.js';
import { Icono } from './ui/Iconos.js';

function hayWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch (e) { return false; }
}

// Solución de emergencia si la maqueta 3D no se puede cargar
class Seguro extends Component {
  constructor(p) { super(p); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(e) { console.error(e); if (window.__listo) window.__listo(); }
  render() {
    if (this.state.error) return html`<div className="sin3d">
      <div>
        <h2>La maqueta 3D no se puede mostrar</h2>
        <p>Tu navegador o tu ordenador no puede cargar la escena 3D. Prueba con Chrome, Edge o Firefox actualizados, o vuelve a cargar la página.</p>
        <button className="btn btn-primario" onClick=${() => location.reload()}>Volver a cargar</button>
      </div>
    </div>`;
    return this.props.children;
  }
}

function App() {
  const modo = useEstado(s => s.modo);
  const webgl = hayWebGL();
  return html`
    <div className="lienzo" aria-label="Maqueta 3D del Colegio Aurora">
      ${webgl ? html`<${Seguro}><${Escena} /><//>` : html`<div className="sin3d"><div><h2>Sin 3D</h2><p>Este navegador no tiene WebGL: la maqueta 3D no se puede mostrar.</p></div></div>`}
    </div>
    ${modo === 'explorar' ? html`<${Explorador} />` : html`<${Sitio} />`}
  `;
}

const arrancar = async () => {
  try { await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]); } catch (e) {}
  createRoot(document.getElementById('raiz')).render(html`<${App} />`);
  if (!hayWebGL()) setTimeout(() => window.__listo && window.__listo(), 300);
  setTimeout(() => window.__listo && window.__listo(), 20000);
};
arrancar();
