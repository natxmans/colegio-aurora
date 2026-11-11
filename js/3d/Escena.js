// =========================================================
// ESCENA 3D principal: lienzo, cielo, luces, cámara y campus
// =========================================================
import { html, THREE, Canvas, useFrame, useThree, CameraControls, Environment, Lightformer, Stars, useRef, useEffect, useMemo } from '../lib.js';
import { KitRoot } from './kit.js';
import { Edificio } from './Edificio.js';
import { Deportes } from './Deportes.js';
import { Exteriores } from './Exteriores.js';
import { camara, leer, useEstado, volar } from '../estado.js';
import { VISTAS } from '../datos/salas.js';

const CIELO = {
  dia: { arriba: '#3f7fe0', medio: '#9cc6f5', abajo: '#e3efff', niebla: '#dcebff' },
  noche: { arriba: '#03050f', medio: '#141a4a', abajo: '#2a1e5a', niebla: '#0d1236' },
};

function Cielo() {
  const noche = useEstado(s => s.noche);
  const ref = useRef();
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { arriba: { value: new THREE.Color() }, medio: { value: new THREE.Color() }, abajo: { value: new THREE.Color() } },
    vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform vec3 arriba; uniform vec3 medio; uniform vec3 abajo; varying vec3 vD;
      void main(){ float h = vD.y; vec3 c = h > 0.0 ? mix(medio, arriba, pow(clamp(h * 2.2, 0.0, 1.0), 0.8)) : mix(medio, abajo, clamp(-h * 6.0, 0.0, 1.0));
      gl_FragColor = vec4(c, 1.0);
      #include <colorspace_fragment>
      }`,
    side: THREE.BackSide, depthWrite: false, fog: false,
  }), []);
  useEffect(() => {
    const c = noche ? CIELO.noche : CIELO.dia;
    mat.uniforms.arriba.value.set(c.arriba); mat.uniforms.medio.value.set(c.medio); mat.uniforms.abajo.value.set(c.abajo);
  }, [noche]);
  useFrame(({ camera }) => { if (ref.current) ref.current.position.copy(camera.position); });
  return html`<mesh ref=${ref} material=${mat} renderOrder=${-10} frustumCulled=${false}><sphereGeometry args=${[1800, 32, 16]} /></mesh>`;
}

function Luces() {
  const noche = useEstado(s => s.noche);
  const sol = useRef();
  const { scene } = useThree();
  useEffect(() => {
    const l = sol.current;
    if (l) {
      const cam = l.shadow.camera;
      cam.left = -150; cam.right = 150; cam.top = 150; cam.bottom = -150; cam.near = 10; cam.far = 600;
      cam.updateProjectionMatrix();
      l.target.position.set(20, 0, -8); l.target.updateMatrixWorld();
    }
  }, []);
  useEffect(() => {
    const c = noche ? CIELO.noche : CIELO.dia;
    scene.fog = new THREE.Fog(c.niebla, noche ? 220 : 320, noche ? 1100 : 1500);
    scene.environmentIntensity = noche ? 0.3 : 1.0;
  }, [noche]);
  return html`
    <hemisphereLight key=${noche ? 'hn' : 'hd'} args=${[noche ? '#5a6be0' : '#e6f0ff', noche ? '#1a1033' : '#6b7d55', noche ? 0.5 : 1.05]} />
    <ambientLight intensity=${noche ? 0.14 : 0.22} color=${noche ? '#8b9cff' : '#ffffff'} />
    <directionalLight ref=${sol} position=${noche ? [-90, 170, -40] : [130, 190, 110]} intensity=${noche ? 0.85 : 2.6}
      color=${noche ? '#a9b8ff' : '#fff2de'} castShadow shadow-mapSize=${[2048, 2048]} shadow-bias=${-0.0004} shadow-normalBias=${0.05} />
    ${noche ? html`<${Stars} radius=${700} depth=${120} count=${2500} factor=${7} saturation=${0.4} fade speed=${0.4} />` : null}
  `;
}

function Reflejos() {
  return html`<${Environment} resolution=${128} frames=${1} background=${false}>
    <${Lightformer} form="rect" intensity=${2.2} color="#ffffff" position=${[0, 80, -60]} rotation=${[Math.PI / 2.5, 0, 0]} scale=${[220, 80, 1]} />
    <${Lightformer} form="rect" intensity=${1.6} color="#22d3ee" position=${[-140, 25, 0]} rotation=${[0, Math.PI / 2, 0]} scale=${[120, 18, 1]} />
    <${Lightformer} form="rect" intensity=${1.4} color="#8b5cf6" position=${[140, 25, 0]} rotation=${[0, -Math.PI / 2, 0]} scale=${[120, 18, 1]} />
    <${Lightformer} form="rect" intensity=${1.2} color="#3d8bff" position=${[0, 15, 140]} rotation=${[0, Math.PI, 0]} scale=${[160, 14, 1]} />
    <${Lightformer} form="ring" intensity=${3} color="#ffffff" position=${[60, 120, 60]} scale=${40} />
  <//>`;
}

function Controles() {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current;
    camara.ctrl = c;
    c.minDistance = 0.6;
    c.maxDistance = 520;
    c.maxPolarAngle = Math.PI * 0.495;
    c.dollyToCursor = true;
    c.draggingSmoothTime = 0.12;
    c.setBoundary(new THREE.Box3(new THREE.Vector3(-200, -2, -200), new THREE.Vector3(240, 80, 220)));
    c.setLookAt(250, 175, 300, 30, 0, -10, false);
    c.smoothTime = 2.1;
    const t1 = setTimeout(() => volar(leer().modo === 'explorar' ? (VISTAS[leer().vista] || VISTAS.completa) : VISTAS.inicio), 250);
    const t2 = setTimeout(() => { c.smoothTime = 0.75; camara.introHecha = true; }, 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); camara.ctrl = null; };
  }, []);
  useFrame((_, dt) => {
    const c = ref.current;
    if (c && leer().modo === 'inicio' && camara.introHecha) c.rotate(Math.min(dt, 0.05) * 0.03, 0, true);
  });
  return html`<${CameraControls} ref=${ref} makeDefault />`;
}

// Avisa a la pantalla de carga cuando la escena ya se ha dibujado
function Listo() {
  const n = useRef(0);
  useFrame(() => { n.current++; if (n.current === 4 && window.__listo) window.__listo(); });
  return null;
}

export function Escena() {
  const modo = useEstado(s => s.modo);
  const heroVisible = useEstado(s => s.heroVisible);
  const activa = modo === 'explorar' || heroVisible;
  return html`<${Canvas}
      shadows
      dpr=${[1, 1.75]}
      frameloop=${activa ? 'always' : 'never'}
      camera=${{ position: [250, 175, 300], fov: 45, near: 0.3, far: 4000 }}
      gl=${{ antialias: true, powerPreference: 'high-performance' }}
      onCreated=${(estado) => { estado.gl.toneMappingExposure = 1.05; window.__r3f = estado; }}
      onPointerMissed=${() => { document.body.style.cursor = ''; }}>
    <${KitRoot}>
      <${Cielo} />
      <${Luces} />
      <${Reflejos} />
      <${Controles} />
      <${Exteriores} />
      <${Edificio} />
      <${Deportes} />
      <${Listo} />
    <//>
  <//>`;
}
