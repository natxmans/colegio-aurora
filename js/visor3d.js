// =========================================================
// VISOR 3D DE LOS EDIFICIOS (visor3d.html)
// Muestra los modelos exportados de la maqueta del sitio (modelos/<id>.glb).
//  · Ratón: arrastrar = girar 360°, rueda = acercar/alejar, clic derecho = mover
//  · Táctil: un dedo = girar, dos dedos = acercar/alejar y mover
//  · El edificio no puede salir del encuadre: distancia limitada y centro
//    de la vista siempre dentro del edificio.
// ?m=<id>  elige el edificio · &embed=1  versión mínima (dentro de una diapositiva)
// =========================================================
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MODELOS, modelo } from './datos/modelos3d.js';

const VERSION = 2; // cambiarlo cuando se vuelvan a exportar los modelos (evita la caché)
const $ = (id) => document.getElementById(id);
const q = new URLSearchParams(location.search);
const embebido = q.get('embed') === '1';
if (embebido) { document.body.classList.add('embebido'); document.documentElement.classList.add('embebido'); }
const tactil = matchMedia('(pointer: coarse)').matches;
document.body.classList.add(tactil ? 'es-tactil' : 'es-raton');
const rad = THREE.MathUtils.degToRad;

let actual = Math.max(0, MODELOS.findIndex(m => m.id === q.get('m')));
const estado = { listo: false, error: null, id: null, tocado: false };
window.__visor = estado;

// ---------- Escena ----------
const lienzo = $('v-lienzo');
let renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (e) { renderer = null; }
if (!renderer || !renderer.getContext()) { sinWebGL(); throw new Error('Sin WebGL'); }
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = false; // el edificio y el sol no se mueven: la sombra se calcula una sola vez por modelo

const escena = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
escena.environmentIntensity = 0.5;
const hemi = new THREE.HemisphereLight(0xffffff, 0xd8ccb4, 0.85);
const sol = new THREE.DirectionalLight(0xfff3df, 2.4);
sol.castShadow = true;
sol.shadow.mapSize.set(2048, 2048);
sol.shadow.bias = -0.0004; sol.shadow.normalBias = 0.03;
escena.add(hemi, sol, sol.target);
// sombra suave en el suelo, alrededor del modelo
const sombraSuelo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShadowMaterial({ opacity: 0.16 }));
sombraSuelo.rotation.x = -Math.PI / 2; sombraSuelo.position.y = -0.02; sombraSuelo.receiveShadow = true;
escena.add(sombraSuelo);

const camara = new THREE.PerspectiveCamera(30, 1, 0.1, 3000);
const ctrl = new OrbitControls(camara, lienzo);
ctrl.enableDamping = true; ctrl.dampingFactor = 0.085;
ctrl.rotateSpeed = 0.8; ctrl.zoomSpeed = 0.9; ctrl.panSpeed = 0.9;
ctrl.screenSpacePanning = true;
ctrl.minPolarAngle = 0; ctrl.maxPolarAngle = rad(88); // nunca por debajo del suelo
ctrl.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };
if (embebido) {
  // dentro de una diapositiva: las flechas siguen cambiando de diapositiva
  addEventListener('keydown', (e) => {
    const a = { ArrowRight: 'sig', PageDown: 'sig', ArrowLeft: 'ant', PageUp: 'ant' }[e.key];
    if (a && parent !== window) { e.preventDefault(); parent.postMessage({ ppt: a }, location.origin); }
  });
} else ctrl.listenToKeyEvents(lienzo);
ctrl.addEventListener('start', () => { estado.tocado = true; parar(); });

// ---------- Encuadre ----------
const caja = new THREE.Box3(), esfera = new THREE.Sphere(), centro = new THREE.Vector3();
let distEsfera = 10;
const esquinas = () => {
  const a = caja.min, b = caja.max, r = [];
  for (const x of [a.x, b.x]) for (const y of [a.y, b.y]) for (const z of [a.z, b.z]) r.push(new THREE.Vector3(x, y, z));
  return r;
};
const dir = (az, alt) => new THREE.Vector3(Math.sin(rad(az)) * Math.cos(rad(alt)), Math.sin(rad(alt)), Math.cos(rad(az)) * Math.cos(rad(alt)));
// distancia mínima para que TODO el edificio quepa (con margen) mirando desde la dirección d
function distanciaQueCabe(d, margen = 0.86) {
  const cam = camara.clone(), es = esquinas(), v = new THREE.Vector3();
  let lo = esfera.radius * 0.2, hi = distEsfera * 1.6;
  for (let i = 0; i < 28; i++) {
    const m = (lo + hi) / 2;
    cam.position.copy(centro).addScaledVector(d, m); cam.lookAt(centro); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
    const cabe = es.every(p => { v.copy(p).project(cam); return v.z < 1 && Math.abs(v.x) <= margen && Math.abs(v.y) <= margen; });
    if (cabe) hi = m; else lo = m;
  }
  return hi;
}
function ajustarLimites() {
  const vf = rad(camara.fov), hf = 2 * Math.atan(Math.tan(vf / 2) * camara.aspect);
  distEsfera = esfera.radius / Math.sin(Math.min(vf, hf) / 2);
  ctrl.maxDistance = distEsfera * 1.08;   // alejado al máximo: el edificio entero se ve desde cualquier lado
  ctrl.minDistance = Math.max(esfera.radius * 0.18, 1.2);
  // plano cercano lo más lejos posible (precisión de profundidad: los suelos con textura están a pocos mm de su losa)
  camara.near = Math.max(0.05, Math.min(ctrl.minDistance * 0.35, esfera.radius / 25)); camara.far = distEsfera * 4; camara.updateProjectionMatrix();
}
// el centro de la vista no puede salir del edificio (así no se «pierde» al mover), y cuanto
// más lejos está la cámara, más vuelve al centro: alejado del todo, el edificio se ve entero
const tmp = new THREE.Vector3(), medio = new THREE.Vector3(), lo = new THREE.Vector3(), hi = new THREE.Vector3();
ctrl.addEventListener('change', () => {
  if (!estado.listo) return;
  const d = camara.position.distanceTo(ctrl.target);
  const libre = THREE.MathUtils.clamp((ctrl.maxDistance - d) / (ctrl.maxDistance - ctrl.minDistance) * 1.6, 0, 1);
  caja.getSize(medio).multiplyScalar(0.5 * libre);
  lo.copy(centro).sub(medio); hi.copy(centro).add(medio);
  tmp.copy(ctrl.target).clamp(lo, hi);
  if (!tmp.equals(ctrl.target)) { const d = tmp.clone().sub(ctrl.target); ctrl.target.add(d); camara.position.add(d); }
  sucio = true;
});

// animación suave entre vistas
let anim = null;
function parar() { anim = null; }
function irA(az, alt, inmediato = false) {
  const d = dir(az, alt);
  const dist = Math.min(distanciaQueCabe(d), ctrl.maxDistance);
  const destino = centro.clone().addScaledVector(d, dist);
  if (inmediato) { ctrl.target.copy(centro); camara.position.copy(destino); camara.lookAt(centro); ctrl.update(); sucio = true; return; }
  // interpolación en coordenadas esféricas (gira alrededor del edificio, no lo atraviesa)
  const s0 = new THREE.Spherical().setFromVector3(camara.position.clone().sub(ctrl.target));
  const s1 = new THREE.Spherical().setFromVector3(destino.clone().sub(centro));
  let dt = s1.theta - s0.theta; dt = ((dt + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
  anim = { t0: performance.now(), dur: 750, s0, s1: { ...s1, theta: s0.theta + dt }, c0: ctrl.target.clone() };
}
function animar(ahora) {
  if (!anim) return;
  const k = Math.min(1, (ahora - anim.t0) / anim.dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  const s = new THREE.Spherical(
    anim.s0.radius + (anim.s1.radius - anim.s0.radius) * e,
    anim.s0.phi + (anim.s1.phi - anim.s0.phi) * e,
    anim.s0.theta + (anim.s1.theta - anim.s0.theta) * e);
  ctrl.target.lerpVectors(anim.c0, centro, e);
  camara.position.copy(ctrl.target).add(new THREE.Vector3().setFromSpherical(s));
  camara.lookAt(ctrl.target);
  sucio = true;
  if (k >= 1) anim = null;
}

// Para dibujar más rápido: las piezas opacas sin textura con el mismo tipo de material se
// juntan en una sola malla (el color de cada pieza pasa a sus vértices). El aspecto no cambia
// y la tarjeta gráfica hace ~20 dibujos por imagen en vez de ~350.
function fusionar(raiz) {
  raiz.updateMatrixWorld(true);
  const grupos = new Map(), viejas = [];
  raiz.traverse(o => {
    if (!o.isMesh) return;
    const m = o.material;
    if (Array.isArray(m) || m.map || m.transparent || m.alphaTest > 0 || m.vertexColors || (m.emissive && m.emissive.getHex() !== 0) || !o.geometry.index) return;
    const k = [m.roughness.toFixed(2), m.metalness.toFixed(2), m.side].join('|');
    if (!grupos.has(k)) grupos.set(k, { m, lista: [] });
    grupos.get(k).lista.push(o);
  });
  for (const { m, lista } of grupos.values()) {
    if (lista.length < 2) continue;
    const geos = lista.map(o => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', o.geometry.attributes.position.clone());
      g.setAttribute('normal', o.geometry.attributes.normal.clone());
      g.setIndex(o.geometry.index.clone());
      g.applyMatrix4(o.matrixWorld);
      const n = g.attributes.position.count, c = new Float32Array(n * 3), col = o.material.color;
      for (let i = 0; i < n; i++) { c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b; }
      g.setAttribute('color', new THREE.BufferAttribute(c, 3));
      return g;
    });
    const unida = mergeGeometries(geos);
    geos.forEach(g => g.dispose());
    if (!unida) continue;
    const malla = new THREE.Mesh(unida, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: m.roughness, metalness: m.metalness, side: m.side }));
    raiz.add(malla);
    for (const o of lista) { o.parent.remove(o); viejas.push(o); }
  }
  for (const o of viejas) { o.geometry.dispose(); o.material.dispose(); }
}

// ---------- Carga de un modelo ----------
const cargador = new GLTFLoader();
let raiz = null, ficha = 0;
function liberar(o) {
  o.traverse(m => {
    if (!m.isMesh) return;
    m.geometry.dispose();
    for (const mat of [].concat(m.material)) { for (const k in mat) if (mat[k] && mat[k].isTexture) mat[k].dispose(); mat.dispose(); }
  });
}
async function cargar(i) {
  const m = MODELOS[i], mio = ++ficha;
  actual = i; estado.listo = false; estado.id = m.id; estado.error = null; estado.tocado = false;
  document.body.classList.remove('cargado');
  pintarInfo(m);
  $('v-carga').hidden = false; $('v-carga').classList.remove('error'); $('v-progreso').style.width = '4%';
  $('v-carga-txt').textContent = 'Cargando «' + m.nombre + '»…';
  let gltf;
  try {
    gltf = await cargador.loadAsync(`modelos/${m.id}.glb?v=${VERSION}`, ev => {
      if (mio === ficha && ev.total) $('v-progreso').style.width = Math.max(4, Math.round(ev.loaded / ev.total * 96)) + '%';
    });
  } catch (e) {
    if (mio !== ficha) return;
    estado.error = String(e && e.message || e);
    $('v-carga').classList.add('error');
    $('v-carga-txt').textContent = 'No se ha podido cargar el modelo 3D (se necesita Internet).';
    mostrarImagen(m);
    return;
  }
  if (mio !== ficha) { liberar(gltf.scene); return; }
  if (raiz) { escena.remove(raiz); liberar(raiz); }
  raiz = gltf.scene;
  fusionar(raiz);
  raiz.traverse(o => { if (o.isMesh) { o.castShadow = !o.material.transparent; o.receiveShadow = true; } });
  escena.add(raiz);
  caja.setFromObject(raiz); caja.getBoundingSphere(esfera); caja.getCenter(centro);
  // sol y sombra adaptados al tamaño del edificio
  const r = esfera.radius;
  sol.position.copy(centro).add(new THREE.Vector3(-0.55, 0.9, 0.62).normalize().multiplyScalar(r * 2.2));
  sol.target.position.copy(centro);
  Object.assign(sol.shadow.camera, { left: -r * 1.1, right: r * 1.1, top: r * 1.1, bottom: -r * 1.1, near: r * 0.2, far: r * 4.5 });
  sol.shadow.camera.updateProjectionMatrix();
  renderer.shadowMap.needsUpdate = true;
  sombraSuelo.scale.set(r * 3, r * 3, 1); sombraSuelo.position.set(centro.x, caja.min.y - 0.02, centro.z);
  ajustarLimites();
  irA(m.giro[0], m.giro[1], true);
  $('v-imagen').hidden = true;
  $('v-carga').hidden = true;
  document.body.classList.add('cargado');
  estado.listo = true;
  if (!embebido) history.replaceState(null, '', '?m=' + m.id);
  sucio = true;
  // el siguiente se descarga ya, para que el cambio sea rápido
  const sig = MODELOS[i + 1];
  if (sig && !embebido) fetch(`modelos/${sig.id}.glb?v=${VERSION}`).catch(() => {});
}

// ---------- Interfaz ----------
function pintarInfo(m) {
  document.title = m.nombre + ' · Colegio Pablo Picasso en 3D';
  $('v-titulo').textContent = m.nombre;
  $('v-desc').textContent = m.desc;
  $('v-num').textContent = String(actual + 1);
  $('v-total').textContent = String(MODELOS.length);
  $('v-ant').disabled = actual === 0;
  $('v-sig').disabled = actual === MODELOS.length - 1;
  $('v-abrir').href = 'visor3d.html?m=' + m.id;
  for (const b of $('v-lista').children) b.setAttribute('aria-current', String(b.dataset.id === m.id));
}
for (const m of MODELOS) {
  const b = document.createElement('button');
  b.type = 'button'; b.textContent = m.corto; b.dataset.id = m.id;
  b.onclick = () => cargar(MODELOS.indexOf(m));
  $('v-lista').appendChild(b);
}
$('v-ant').onclick = () => cargar(Math.max(0, actual - 1));
$('v-sig').onclick = () => cargar(Math.min(MODELOS.length - 1, actual + 1));
for (const b of document.querySelectorAll('[data-vista]')) {
  b.onclick = () => {
    if (!estado.listo) return;
    const m = MODELOS[actual], f = m.frente || 0;
    const v = { frente: [f, 12], lado: [f + 90, 12], detras: [f + 180, 12], arriba: [f, 89.4], inicio: m.giro }[b.dataset.vista];
    irA(v[0], v[1]);
  };
}
const escenaEl = $('v-escena');
$('v-completa').onclick = () => {
  if (document.fullscreenElement) document.exitFullscreen();
  else if (escenaEl.requestFullscreen) escenaEl.requestFullscreen().catch(() => escenaEl.classList.toggle('pseudo-completa'));
  else escenaEl.classList.toggle('pseudo-completa');
};
// teclado: + / - para acercar
lienzo.addEventListener('keydown', (e) => {
  if (e.key === '+' || e.key === '=') { camara.position.lerp(ctrl.target, 0.15); ctrl.update(); }
  if (e.key === '-') { camara.position.sub(ctrl.target).multiplyScalar(1.15).add(ctrl.target); ctrl.update(); }
});

function mostrarImagen(m) {
  const im = $('v-imagen');
  im.src = `modelos/vistas/${m.id}.jpg`; im.alt = m.nombre; im.hidden = false;
}
function sinWebGL() {
  document.body.classList.add('sin-webgl');
  const m = MODELOS[actual];
  pintarInfo(m);
  $('v-carga').classList.add('error');
  $('v-carga-txt').textContent = 'Este aparato no puede mostrar gráficos 3D (WebGL). Aquí tienes una imagen del edificio.';
  mostrarImagen(m);
}

// ---------- Tamaño y dibujo ----------
let sucio = true;
function redimensionar() {
  const r = escenaEl.getBoundingClientRect();
  const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
  renderer.setSize(w, h, false);
  camara.aspect = w / h; camara.updateProjectionMatrix();
  if (estado.listo) { ajustarLimites(); if (!estado.tocado && !anim) irA(MODELOS[actual].giro[0], MODELOS[actual].giro[1], true); }
  sucio = true;
}
new ResizeObserver(redimensionar).observe(escenaEl);
redimensionar();
function bucle(t) {
  requestAnimationFrame(bucle);
  if (document.hidden) return;
  animar(t);
  if (ctrl.update()) sucio = true;
  if (sucio) { renderer.render(escena, camara); sucio = false; }
}
requestAnimationFrame(bucle);

// para las pruebas automáticas
Object.assign(estado, { THREE, camara, ctrl, caja, renderer, escena, esferaR: () => esfera.radius, irA, cargar, distanciaQueCabe, dir,
  dentroDelEncuadre: () => esquinas().every(p => { const v = p.clone().project(camara); return v.z < 1 && Math.abs(v.x) <= 1 && Math.abs(v.y) <= 1; }),
  ocupacion: () => { const v = esquinas().map(p => p.clone().project(camara)); const xs = v.map(p => p.x), ys = v.map(p => p.y);
    return [(Math.max(...xs) - Math.min(...xs)) / 2, (Math.max(...ys) - Math.min(...ys)) / 2]; } });

cargar(actual);
