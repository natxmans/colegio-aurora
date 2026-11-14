// =========================================================
// ESCENA 3D principal: lienzo, cielo, sol, luna, estrellas, cámara y campus.
// La luz sigue la HORA DE LA SIMULACIÓN (ciclo día/noche continuo).
// =========================================================
import { html, THREE, Canvas, useFrame, useThree, CameraControls, Environment, Lightformer, useRef, useEffect, useMemo } from '../lib3d.js';
import { KitRoot } from './kit.js';
import { ProyectarEtiquetas } from './etiquetas.js';
import { Edificio } from './Edificio.js';
import { Residencia } from './Residencia.js';
import { Deportes } from './Deportes.js';
import { Exteriores } from './Exteriores.js';
import { Personas } from './Personas.js';
import { LucesNoche } from './LucesNoche.js';
import { encuadre } from './camara.js';
import { camara, leer, poner, useEstado, volar } from '../estado.js';
import { VISTAS } from '../datos/salas.js';
import { luz } from '../sim/reloj.js';
import { NIVELES } from '../calidad.js';

const C = (h) => new THREE.Color(h);
const CIELO = {
  noche: { arriba: C('#03050f'), medio: C('#141a4a'), abajo: C('#2a1e5a'), niebla: C('#0d1236') },
  ocaso: { arriba: C('#3b4a8a'), medio: C('#e8946a'), abajo: C('#f6c08a'), niebla: C('#e9b48c') },
  dia: { arriba: C('#3f7fe0'), medio: C('#9cc6f5'), abajo: C('#e3efff'), niebla: C('#dcebff') },
};
const _c1 = new THREE.Color(), _c2 = new THREE.Color();
function mezcla(clave, L, destino) {
  _c1.copy(CIELO.noche[clave]).lerp(CIELO.dia[clave], L.dia);
  _c2.copy(CIELO.ocaso[clave]);
  return destino.copy(_c1).lerp(_c2, L.crepusculo * 0.75);
}
// "ambiente" se calcula una vez por imagen; lo leen otras partes de la escena
export const ambiente = { L: luz(), interior: 0 };

function Cielo() {
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
  useFrame(({ camera }) => {
    const L = ambiente.L;
    mezcla('arriba', L, mat.uniforms.arriba.value);
    mezcla('medio', L, mat.uniforms.medio.value);
    mezcla('abajo', L, mat.uniforms.abajo.value);
    if (ref.current) ref.current.position.copy(camera.position);
  });
  return html`<mesh ref=${ref} material=${mat} renderOrder=${-10} frustumCulled=${false}><sphereGeometry args=${[1800, 32, 16]} /></mesh>`;
}

// Estrellas: aparecen poco a poco al anochecer
function Estrellas() {
  const ref = useRef();
  const [geo, mat] = useMemo(() => {
    const n = 2200, p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = Math.random(), y = Math.random() * 0.9 + 0.08;
      const a = u * Math.PI * 2, r = Math.sqrt(1 - y * y);
      p[i * 3] = Math.cos(a) * r * 900; p[i * 3 + 1] = y * 900; p[i * 3 + 2] = Math.sin(a) * r * 900;
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const m = new THREE.PointsMaterial({ color: '#e8ecff', size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false, fog: false });
    return [g, m];
  }, []);
  useFrame(({ camera }) => {
    const o = Math.max(0, 1 - ambiente.L.dia * 1.6);
    mat.opacity = o; ref.current.visible = o > 0.01;
    ref.current.position.copy(camera.position);
  });
  return html`<points ref=${ref} geometry=${geo} material=${mat} frustumCulled=${false} renderOrder=${-9} />`;
}

function Luces({ calidad }) {
  const sol = useRef(), hemi = useRef(), amb = useRef();
  const { scene } = useThree();
  const cfg = NIVELES[calidad];
  const est = useMemo(() => ({
    solDia: C('#fff2de'), solBajo: C('#ffb070'), luna: C('#a9b8ff'),
    hCieloD: C('#e6f0ff'), hCieloN: C('#5a6be0'), hSueloD: C('#6b7d55'), hSueloN: C('#1a1033'),
    dir: new THREE.Vector3(), lunaDir: new THREE.Vector3(-0.45, 0.8, -0.35).normalize(), noche: null,
  }), []);
  useEffect(() => {
    const l = sol.current;
    const cam = l.shadow.camera;
    cam.left = -110; cam.right = 110; cam.top = 110; cam.bottom = -110; cam.near = 10; cam.far = 700;
    cam.updateProjectionMatrix();
    l.target.position.set(4, 0, -6); l.target.updateMatrixWorld();
    scene.fog = new THREE.Fog('#dcebff', 320, 1500);
  }, []);
  useFrame(() => {
    const L = ambiente.L;
    const s = leer();
    const { dir } = est;
    // sol (de día) o luna (de noche)
    if (L.el > -0.02) dir.set(-Math.sin(L.az) * Math.cos(L.el), Math.max(0.06, Math.sin(L.el)), Math.cos(L.az) * Math.cos(L.el)).normalize();
    else dir.copy(est.lunaDir);
    const l = sol.current;
    l.position.set(4 + dir.x * 260, dir.y * 260, -6 + dir.z * 260);
    const k = Math.min(1, L.dia * 1.2);
    l.intensity = 2.6 * k + 0.5 * (1 - k);
    _c1.copy(est.solBajo).lerp(est.solDia, Math.min(1, Math.max(0, L.el / 0.35)));
    l.color.copy(est.luna).lerp(_c1, k);
    hemi.current.intensity = 0.42 + 0.63 * L.dia;
    hemi.current.color.copy(est.hCieloN).lerp(est.hCieloD, L.dia);
    hemi.current.groundColor.copy(est.hSueloN).lerp(est.hSueloD, L.dia);
    // de noche, al mirar dentro de los edificios, las luces interiores iluminan las salas
    const dentro = !!(s.sel || s.resVista || s.vista === 'baja' || s.vista === 'primer' || s.vista === 'corte' || s.interior || s.seguir != null || !s.techo);
    ambiente.interior += ((dentro ? 1 : 0) - ambiente.interior) * 0.05;
    amb.current.intensity = 0.14 + 0.1 * L.dia + ambiente.interior * 0.55 * L.oscuridad;
    amb.current.color.set(L.dia > 0.5 ? '#ffffff' : '#ffe2b8');
    if (scene.fog) {
      mezcla('niebla', L, scene.fog.color);
      scene.fog.near = 220 + 100 * L.dia; scene.fog.far = 1100 + 400 * L.dia;
    }
    scene.environmentIntensity = cfg.reflejos ? 0.22 + 0.78 * L.dia : 0;
    const noche = L.dia < 0.35;
    if (noche !== est.noche) { est.noche = noche; if (leer().noche !== noche) poner({ noche }); }
  });
  return html`
    <hemisphereLight ref=${hemi} args=${['#e6f0ff', '#6b7d55', 1.05]} />
    <ambientLight ref=${amb} intensity=${0.22} />
    <directionalLight ref=${sol} position=${[130, 190, 110]} intensity=${2.6} color="#fff2de"
      castShadow=${cfg.sombras} shadow-mapSize=${[cfg.mapaSombra, cfg.mapaSombra]} shadow-bias=${-0.0004} shadow-normalBias=${0.05} />
  `;
}

function Reflejos() {
  return html`<${Environment} resolution=${128} frames=${1} background=${false}>
    <${Lightformer} form="rect" intensity=${2.2} color="#ffffff" position=${[0, 80, -60]} rotation=${[Math.PI / 2.5, 0, 0]} scale=${[220, 80, 1]} />
    <${Lightformer} form="rect" intensity=${1.6} color="#f3dfb2" position=${[-140, 25, 0]} rotation=${[0, Math.PI / 2, 0]} scale=${[120, 18, 1]} />
    <${Lightformer} form="rect" intensity=${1.4} color="#c9a978" position=${[140, 25, 0]} rotation=${[0, -Math.PI / 2, 0]} scale=${[120, 18, 1]} />
    <${Lightformer} form="rect" intensity=${1.2} color="#9fb7da" position=${[0, 15, 140]} rotation=${[0, Math.PI, 0]} scale=${[160, 14, 1]} />
    <${Lightformer} form="ring" intensity=${3} color="#ffffff" position=${[60, 120, 60]} scale=${40} />
  <//>`;
}

function Controles() {
  const ref = useRef();
  const { gl } = useThree();
  useEffect(() => {
    const c = ref.current;
    camara.ctrl = c;
    camara.encuadre = encuadre;
    c._domElement = gl.domElement;
    c.minDistance = 0.6;
    c.maxDistance = 700;
    c.maxPolarAngle = Math.PI * 0.495;
    c.dollyToCursor = true;
    c.draggingSmoothTime = 0.12;
    c.setBoundary(new THREE.Box3(new THREE.Vector3(-220, -2, -220), new THREE.Vector3(240, 80, 220)));
    c.setLookAt(260, 160, 300, 0, 0, 0, false);
    c.smoothTime = 1.6;
    const vistaActual = () => { const e = leer(); return VISTAS[e.vista] || VISTAS.completa; };
    const t1 = setTimeout(() => { const p = camara.pendiente; camara.pendiente = null; volar(p || vistaActual()); }, 200);
    const t2 = setTimeout(() => { c.smoothTime = 0.75; camara.introHecha = true; }, 3200);
    // Si cambia el tamaño de la vista 3D (ventana, pantalla completa, teléfono girado), se vuelve a encuadrar
    let tr = 0, w0 = 0, h0 = 0;
    const ro = new ResizeObserver(() => {
      const w = gl.domElement.clientWidth, h = gl.domElement.clientHeight;
      if (Math.abs(w - w0) < 2 && Math.abs(h - h0) < 2) return;
      w0 = w; h0 = h;
      clearTimeout(tr);
      tr = setTimeout(() => { const e = leer(); if (!e.sel && e.seguir == null && !e.resVista && camara.introHecha) volar(vistaActual()); }, 260);
    });
    ro.observe(gl.domElement);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(tr); ro.disconnect(); camara.ctrl = null; };
  }, []);
  // Dentro de la página: la rueda y un dedo hacen bajar la página (no mueven la cámara).
  // A pantalla completa: todos los gestos mueven la cámara.
  const modo = useEstado(s => s.modo);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const A = c.constructor.ACTION, emb = modo !== 'explorar';
    if (!A) return;
    c.mouseButtons.wheel = emb ? A.NONE : A.DOLLY;
    c.touches.one = emb ? A.NONE : A.TOUCH_ROTATE;
    c.touches.two = emb ? A.NONE : A.TOUCH_DOLLY_TRUCK;
    gl.domElement.style.touchAction = emb ? 'pan-y' : 'none';
  }, [modo]);
  useFrame((_, dt) => {
    const c = ref.current;
    if (!c) return;
    const cam = c.camera, obj = camara.fov;
    if (Math.abs(cam.fov - obj) > 0.01) {
      cam.fov += (obj - cam.fov) * (1 - Math.exp(-Math.min(dt, 0.05) * 3));
      if (Math.abs(cam.fov - obj) < 0.02) cam.fov = obj;
      cam.updateProjectionMatrix();
    }
  });
  return html`<${CameraControls} ref=${ref} makeDefault />`;
}

// Avisa cuando la escena ya se ha dibujado
function Listo() {
  const n = useRef(0);
  useFrame(() => {
    n.current++;
    if (n.current === 4) { poner({ listo3d: true }); if (window.__listo3d) window.__listo3d(); }
  });
  return null;
}

// Hora → luz (una vez por imagen, antes que el resto)
function Hora() {
  useFrame(() => { ambiente.L = luz(); }, -2);
  return null;
}

export function Escena({ calidad = 'normal' }) {
  const modo = useEstado(s => s.modo);
  const visible = useEstado(s => s.campusVisible);
  const activa = modo === 'explorar' || visible;
  const cfg = NIVELES[calidad];
  return html`<${Canvas}
      shadows=${cfg.sombras}
      dpr=${cfg.dpr}
      frameloop=${activa ? 'always' : 'never'}
      camera=${{ position: [260, 160, 300], fov: 45, near: 0.3, far: 4000 }}
      gl=${{ antialias: calidad !== 'ligera', powerPreference: 'high-performance' }}
      onCreated=${(estado) => { estado.gl.toneMappingExposure = 1.05; window.__r3f = estado; }}
      onPointerMissed=${() => { document.body.style.cursor = ''; }}>
    <${KitRoot} sombras=${cfg.sombras}>
      <${Hora} />
      <${Cielo} />
      <${Estrellas} />
      <${Luces} calidad=${calidad} />
      ${cfg.reflejos ? html`<${Reflejos} />` : null}
      <${Controles} />
      <${Exteriores} />
      <${Edificio} />
      <${Residencia} />
      <${Deportes} />
      <${Personas} calidad=${calidad} />
      <${LucesNoche} calidad=${calidad} />
      <${Listo} />
      <${ProyectarEtiquetas} />
    <//>
  <//>`;
}
