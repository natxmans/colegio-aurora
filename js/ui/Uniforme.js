// =========================================================
// "Nuestro uniforme": un alumno en 3D que gira, con pantalón o falda
// =========================================================
import { html, useState, useRef, useEffect, Canvas, useFrame, CameraControls, Environment, Lightformer } from '../lib.js';
import { KitRoot } from '../3d/kit.js';
import { Alumno } from '../3d/Alumno.js';
import { C, Toro, COL } from '../3d/piezas.js';

function Podio() {
  return html`<group>
    <${C} m="B" p=${[0, -0.08, 0]} s=${[2.2, 0.16, 2.2]} c="#0f1a4a" />
    <${Toro} m="L" p=${[0, 0.005, 0]} r=${[Math.PI / 2, 0, 0]} s=${[2.15, 2.15, 0.25]} c=${COL.cian} />
    <${C} m="L" p=${[0, -0.17, 0]} s=${[2.3, 0.02, 2.3]} c=${COL.violeta} />
  </group>`;
}

function Girar({ children }) {
  const ref = useRef();
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.45; });
  return html`<group ref=${ref}>${children}</group>`;
}

function Camara() {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.minDistance = 1.8; c.maxDistance = 7; c.maxPolarAngle = Math.PI * 0.56;
    c.setLookAt(0, 1.35, 4.4, 0, 0.88, 0, false);
  }, []);
  return html`<${CameraControls} ref=${ref} />`;
}

export function VisorUniforme() {
  const [falda, setFalda] = useState(false);
  const [pose, setPose] = useState('de_pie');
  const [activo, setActivo] = useState(false);
  const caja = useRef();
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setActivo(e.isIntersecting), { rootMargin: '100px' });
    if (caja.current) io.observe(caja.current);
    return () => io.disconnect();
  }, []);
  return html`<div className="visor" ref=${caja}>
    <div className="visor-ayuda">Arrastra para girar · rueda para acercar</div>
    <${Canvas} shadows dpr=${[1, 2]} frameloop=${activo ? 'always' : 'never'} camera=${{ position: [0, 1.35, 4.4], fov: 34 }}>
      <${KitRoot}>
        <hemisphereLight args=${['#dfe9ff', '#1a1f4a', 1.1]} />
        <directionalLight position=${[3, 5, 4]} intensity=${2.4} castShadow shadow-mapSize=${[1024, 1024]} />
        <pointLight position=${[-3, 2, -2]} intensity=${12} color="#22d3ee" />
        <pointLight position=${[3, 1, -2]} intensity=${10} color="#8b5cf6" />
        <${Environment} resolution=${64} frames=${1}>
          <${Lightformer} form="rect" intensity=${2} position=${[0, 4, 3]} scale=${[6, 3, 1]} />
          <${Lightformer} form="rect" intensity=${1.5} color="#22d3ee" position=${[-4, 1, 0]} rotation=${[0, Math.PI / 2, 0]} scale=${[4, 2, 1]} />
        <//>
        <${Podio} />
        <${Girar}>
          <${Alumno} p=${[0, 0, 0]} pose=${pose} falda=${falda} seed=${falda ? 7 : 12} escala=${1} />
        <//>
        <${Camara} />
      <//>
    <//>
    <div className="visor-ctrl">
      <button className=${!falda ? 'activo' : ''} onClick=${() => setFalda(false)}>Pantalón</button>
      <button className=${falda ? 'activo' : ''} onClick=${() => setFalda(true)}>Falda</button>
      <button className=${pose === 'saludando' ? 'activo' : ''} onClick=${() => setPose(pose === 'saludando' ? 'de_pie' : 'saludando')}>¡Hola!</button>
    </div>
  </div>`;
}
