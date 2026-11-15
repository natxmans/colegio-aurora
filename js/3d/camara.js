// Encuadre automático de la cámara: busca la distancia para que una caja
// (los edificios, el complejo deportivo...) ocupe casi toda la vista 3D,
// sin cortar nada, en ordenador, tableta y teléfono.
import { THREE } from '../lib3d.js';
import { camara, FOV_BASE } from '../estado.js';
import { CAJAS } from '../datos/salas.js';

const _v = new THREE.Vector3();
export function encuadre(v) {
  const c = camara.ctrl;
  const cam = c.camera.clone();
  const el = c._domElement || null;
  const w = el ? el.clientWidth : innerWidth, h = el ? el.clientHeight : innerHeight;
  cam.aspect = Math.max(0.3, w / Math.max(1, h));
  const movil = cam.aspect < 0.75;   // teléfono (vertical): la vista del campus se gira
  const c0 = (movil && CAJAS[v.ajuste + 'Movil']) || CAJAS[v.ajuste];
  const cajas = Array.isArray(c0) ? c0 : [c0];
  const box = { x0: Math.min(...cajas.map(b => b.x0)), x1: Math.max(...cajas.map(b => b.x1)), z0: Math.min(...cajas.map(b => b.z0)), z1: Math.max(...cajas.map(b => b.z1)) };
  cam.fov = v.fov || FOV_BASE;
  cam.updateProjectionMatrix();
  const mira = new THREE.Vector3((box.x0 + box.x1) / 2 + (v.dx || 0), v.y ?? 1, (box.z0 + box.z1) / 2 + (v.dz || 0));
  // En pantalla vertical (teléfono) giramos la cámara: el campus, que es ancho, ocupa la altura
  const girar = movil && (v.ajuste === 'principal' || v.ajuste === 'campus');
  const az = movil && v.azimutMovil != null ? v.azimutMovil : girar ? v.azimut - 1.32 : v.azimut;
  // Pantalla muy ancha (portátil): la cámara baja un poco. Así el campus, que es más ancho que
  // profundo, llena mejor la anchura en vez de quedar limitado por la altura (antes: 66 % del ancho).
  const ancho = !movil && (v.ajuste === 'principal' || v.ajuste === 'campus') ? Math.min(0.24, Math.max(0, (cam.aspect - 1.7) * 0.32)) : 0;
  const po = movil && v.polarMovil != null ? v.polarMovil : girar ? Math.min(v.polar, 0.8) : v.polar + ancho;
  const dir = new THREE.Vector3().setFromSphericalCoords(1, po, az);
  const esquinas = [];
  for (const b of cajas) for (const x of [b.x0, b.x1]) for (const y of [b.y0, b.y1]) for (const z of [b.z0, b.z1]) esquinas.push(new THREE.Vector3(x, y, z));
  const margen = v.margen || 0.85;
  const buscar = () => {
    let lo = 4, hi = 3000;
    for (let i = 0; i < 32; i++) {
      const d = (lo + hi) / 2;
      cam.position.copy(mira).addScaledVector(dir, d);
      cam.lookAt(mira); cam.updateMatrixWorld();
      let m = 0;
      for (const p of esquinas) {
        _v.copy(p).project(cam);
        if (_v.z > 1 || _v.z < -1) { m = 9; break; }
        m = Math.max(m, Math.abs(_v.x), _v.y > 0 ? _v.y * (movil ? 1.2 : 1.04) : -_v.y * (movil ? 1.1 : 1.02));
      }
      if (m > margen) lo = d; else hi = d;
    }
    return hi;
  };
  // dos pasadas: la segunda centra los edificios en la pantalla
  let hi = buscar();
  for (let k = 0; k < 2; k++) {
    cam.position.copy(mira).addScaledVector(dir, hi); cam.lookAt(mira); cam.updateMatrixWorld();
    let x0 = 9, x1 = -9, y0 = 9, y1 = -9;
    for (const p of esquinas) { _v.copy(p).project(cam); x0 = Math.min(x0, _v.x); x1 = Math.max(x1, _v.x); y0 = Math.min(y0, _v.y); y1 = Math.max(y1, _v.y); }
    const t = Math.tan((cam.fov * Math.PI) / 360) * hi;
    const der = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0), arr = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
    mira.addScaledVector(der, ((x0 + x1) / 2) * t * cam.aspect).addScaledVector(arr, ((y0 + y1) / 2) * t);
    hi = buscar();
  }
  const pos = mira.clone().addScaledVector(dir, hi);
  return { pos: pos.toArray(), mira: mira.toArray(), desp: 0, fov: v.fov };
}
