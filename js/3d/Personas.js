// =========================================================
// LAS PERSONAS EN 3D: alumnos, profesores y personal
// · Al montar la escena: se construye el plano de navegación y se colocan todos.
// · En cada imagen: la simulación avanza (sim/vida.js) y se dibujan los cuerpos
//   articulados (sim/cuerpo.js) con pocas mallas instanciadas (rápido).
// · Las personas lejanas se animan con menos frecuencia; las ocultas no se dibujan.
// =========================================================
import { html, THREE, useFrame, useThree, useMemo, useRef } from '../lib3d.js';
import { KIT } from './kit.js';
import { PUNTOS, resolverPuntos } from './puntos.js';
import { pisos, pisosRes } from './etiquetas.js';
import { ESTANQUE } from './Exteriores.js';
import { construir, NAV, FALLOS, dentroDeMuro } from '../sim/navegacion.js';
import { SIM, iniciar, paso, animar, comprobarAccesos } from '../sim/vida.js';
import { ESQ, PIEZAS, P, PZ } from '../sim/cuerpo.js';
import { reloj } from '../sim/reloj.js';
import { NIVELES } from '../calidad.js';
import { leer, poner, camara } from '../estado.js';
import { texLogo } from './texturas.js';

const MAXP = 72;
// Ropa: colores de cada parte del cuerpo
const ROPA = {
  uniforme: { torso: '#14285a', brazo: '#14285a', antebrazo: '#14285a', polo: '#ffffff', cuello: '#1b2f66', cadera: '#1b2440', muslo: '#1b2440', espinilla: '#1b2440', pie: '#3a2418', logo: true },
  deporte: { torso: '#1f4e9a', brazo: '#1f4e9a', antebrazo: 'piel', polo: '#ffffff', cuello: '#ffffff', cadera: '#14285a', muslo: '#14285a', espinilla: 'piel', pie: '#f2f2f2' },
  banador: { torso: '#14285a', brazo: 'piel', antebrazo: 'piel', polo: null, cuello: null, cadera: '#14285a', muslo: '#14285a', espinilla: 'piel', pie: 'piel', gorro: '#f4f1ea' },
  pijama: { torso: '#8fb3d9', brazo: '#8fb3d9', antebrazo: '#8fb3d9', polo: null, cuello: '#a9c4e3', cadera: '#6f93bd', muslo: '#6f93bd', espinilla: '#6f93bd', pie: 'piel' },
};
const PEINADOS = {
  coleta: [[0, 0.1, -0.17], [0.09, 0.18, 0.09], 0.5],
  moño: [[0, 0.27, -0.06], [0.13, 0.12, 0.13], 0],
  largo: [[0, 0.02, -0.085], [0.25, 0.24, 0.13], 0],
  rizado: [[0, 0.2, -0.01], [0.3, 0.24, 0.3], 0],
};

// Colores de una persona según su ropa
const _col = new THREE.Color();
function colores(per) {
  const d = per.d, out = per.cols || (per.cols = new Float32Array(PIEZAS.length * 3));
  let R;
  if (per.tipo === 'alumno') R = ROPA[per.ropa] || ROPA.uniforme;
  else R = { torso: d.camisa, brazo: d.camisa, antebrazo: d.camisa, polo: per.tipo === 'profe' ? '#f4f1ea' : d.camisa, cuello: per.tipo === 'profe' ? '#f4f1ea' : d.camisa, cadera: per.tipo === 'profe' && d.k % 3 === 1 ? '#c9b48e' : '#2a2f3a', muslo: per.tipo === 'profe' && d.k % 3 === 1 ? '#c9b48e' : '#2a2f3a', espinilla: per.tipo === 'profe' && d.k % 3 === 1 ? '#c9b48e' : '#2a2f3a', pie: '#2a1d14' };
  const falda = per.tipo === 'alumno' && d.falda && per.ropa === 'uniforme';
  PIEZAS.forEach((pz, i) => {
    let c = pz[4];
    if (c === 'piel') c = d.piel;
    else if (c === 'pelo') c = R.gorro || d.pelo;
    else if (c === 'ojo') c = '#1d2233';
    else if (c === 'logo') c = '#ffffff';
    else if (c === 'manta') c = ['#1f4e9a', '#14285a', '#2a62b8', '#c9a978', '#3b5fa8', '#8a5a3a'][(d.i || 0) % 6];
    else c = R[c];
    if (c === 'piel') c = d.piel;
    if (falda && (pz[4] === 'muslo')) c = d.piel;
    _col.set(c || '#ffffff');
    out[i * 3] = _col.r; out[i * 3 + 1] = _col.g; out[i * 3 + 2] = _col.b;
  });
  per.oculta = PIEZAS.map((pz, i) => {
    if (i === PZ.FALDA) return !falda;
    if (i === PZ.CADERA) return falda;
    if (i === PZ.LOGO) return !(per.tipo === 'alumno' && per.ropa === 'uniforme') && !(per.tipo === 'personal' && d.rol === 'recepcion');
    if (i === PZ.POLO || i === PZ.CUELLO) return R.polo === null && i === PZ.POLO || (R.cuello === null && i === PZ.CUELLO);
    if (i === PZ.PEINADO) return per.ropa === 'banador' || !PEINADOS[d.peinado];
    return false;
  });
  per.colVer = SIM.version;
}

// Matriz local de cada pieza
const LOCALES = PIEZAS.map(([, , p, s, , rx]) => new THREE.Matrix4().compose(new THREE.Vector3(...p), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx || 0, 0, 0)), new THREE.Vector3(...s)));
const LOC_PEINADO = Object.fromEntries(Object.entries(PEINADOS).map(([k, [p, s, rx]]) => [k, new THREE.Matrix4().compose(new THREE.Vector3(...p), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, 0, 0)), new THREE.Vector3(...s))]));

const GEO = {
  capsula: new THREE.CapsuleGeometry(0.5, 1, 3, 8),
  esfera: new THREE.SphereGeometry(0.5, 12, 9),
  caja: new THREE.BoxGeometry(1, 1, 1),
  cil: new THREE.CylinderGeometry(0.5, 0.5, 1, 10),
  falda: new THREE.CylinderGeometry(0.32, 0.5, 1, 12),
  pelo: new THREE.SphereGeometry(0.5, 12, 7, 0, Math.PI * 2, 0, Math.PI * 0.55),
  peinado: new THREE.SphereGeometry(0.5, 10, 8),
  logo: new THREE.PlaneGeometry(1, 1),
};
const TIPO_PIEZA = PIEZAS.map(p => p[1]);
const CUENTA = {};
TIPO_PIEZA.forEach(t => { CUENTA[t] = (CUENTA[t] || 0) + 1; });

// Escaleras y zonas donde no se camina (agua de la piscina y del estanque)
const EXTRA = {
  escaleras: [
    { capaA: 0, a: [-3, 10.45], capaB: 1, b: [-3, 2.7], largo: 8.4 },
    { capaA: 0, a: [-49.55, 4.45], capaB: 2, b: [-49.55, -3.35], largo: 8.7 },
  ],
  bloqueos: [
    { tipo: 'rect', x0: 15, x1: 65, z0: 19.5, z1: 40.5 },
    { tipo: 'elipse', x: ESTANQUE.x, z: ESTANQUE.z, rx: ESTANQUE.rx, rz: ESTANQUE.rz },
  ],
};

export function Personas({ calidad = 'normal' }) {
  const cfg = NIVELES[calidad];
  const mallas = useRef({});
  const anillo = useRef(), balones = useRef();
  const est = useRef({ n: 0, listo: false, cuadro: 0 });
  const { camera } = useThree();
  const mats = useMemo(() => {
    const base = new THREE.MeshStandardMaterial({ roughness: 0.72, metalness: 0.02 });
    const logo = new THREE.MeshBasicMaterial({ map: texLogo(), transparent: true, alphaTest: 0.05, toneMapped: false, side: THREE.DoubleSide });
    return { base, logo };
  }, []);
  const tmp = useMemo(() => ({
    J: ESQ.map(() => new THREE.Matrix4()), L: new THREE.Matrix4(), M: new THREE.Matrix4(), q: new THREE.Quaternion(), e: new THREE.Euler(0, 0, 0, 'XYZ'),
    v: new THREE.Vector3(), s: new THREE.Vector3(1, 1, 1), uno: new THREE.Vector3(1, 1, 1), fr: new THREE.Frustum(), pm: new THREE.Matrix4(), esf: new THREE.Sphere(new THREE.Vector3(), 1.3),
    hb: new THREE.Matrix4(), cam: new THREE.Vector3(),
  }), []);

  useFrame((state, dt) => {
    const E = est.current;
    E.cuadro++;
    // 1) montar la simulación cuando la maqueta está lista
    if (!E.listo) {
      if (E.cuadro < 8 || !KIT.reg) return;
      construir(KIT, EXTRA);
      iniciar(resolverPuntos(), cfg.alumnos);
      E.listo = true;
      window.__sim = { SIM, NAV, reloj, FALLOS, comprobarAccesos, dentroDeMuro };
    }
    // 2) un paso de la simulación
    paso(dt);
    // 3) dibujar
    const t = SIM.tReal;
    tmp.pm.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    tmp.fr.setFromProjectionMatrix(tmp.pm);
    camera.getWorldPosition(tmp.cam);
    const cuentas = {};
    for (const k in GEO) cuentas[k] = 0;
    const oculto1 = pisos.y1 > 20, oculto2 = !pisosRes.v1;
    const sel = leer().persona, seguir = leer().seguir;
    let selPer = null;
    for (const per of SIM.personas) {
      if (per.estado === 'fuera') continue;
      if ((per.capa === 1 && oculto1) || (per.capa === 2 && oculto2)) continue;
      const dy = per.capa === 1 ? pisos.y1 : per.capa === 2 ? pisosRes.y1 : 0;
      tmp.esf.center.set(per.x, per.y + dy + 0.9, per.z);
      if (per.id === sel) selPer = per;
      if (!tmp.fr.intersectsSphere(tmp.esf)) continue;
      // nivel de detalle: las personas lejanas se animan menos a menudo
      const d2 = tmp.esf.center.distanceToSquared(tmp.cam);
      const cada = d2 > 9000 ? cfg.animLejos : d2 > 2500 ? 2 : 1;
      if ((E.cuadro + per.d.i * 7 + (per.d.k || 0)) % cada === 0 || per.k < 1) animar(per, t, dt * cada);
      if (per.colVer !== SIM.version || !per.cols) colores(per);
      const o = per.pose;
      // raíz
      const esc = per.d.alto || 0.92;
      tmp.e.set(per.pitch + o[P.RP], per.yaw, o[P.RR], 'YXZ');
      tmp.q.setFromEuler(tmp.e);
      tmp.J[0].compose(tmp.v.set(per.x, per.y + dy, per.z), tmp.q, tmp.s.set(esc, esc, esc));
      // articulaciones
      for (let j = 1; j < ESQ.length; j++) {
        const [pa, x, y, z] = ESQ[j];
        let rx = 0, ry = 0, rz = 0, yy = y;
        switch (j) {
          case 1: rx = o[P.PX]; ry = o[P.PY]; rz = o[P.PZ]; yy = y + o[P.RY]; break;
          case 2: rx = o[P.TX]; ry = o[P.TY]; rz = o[P.TZ]; break;
          case 3: rx = o[P.NX]; break;
          case 4: rx = o[P.HX]; ry = o[P.HY]; rz = o[P.HZ]; break;
          case 5: rx = o[P.SLX]; ry = o[P.SLY]; rz = o[P.SLZ]; break;
          case 6: rx = o[P.ELX]; break;
          case 7: rx = o[P.WLX]; rz = o[P.WLZ]; break;
          case 8: rx = o[P.SRX]; ry = o[P.SRY]; rz = o[P.SRZ]; break;
          case 9: rx = o[P.ERX]; break;
          case 10: rx = o[P.WRX]; rz = o[P.WRZ]; break;
          case 11: rx = o[P.HLX]; rz = o[P.HLZ]; break;
          case 12: rx = o[P.KLX]; break;
          case 13: rx = o[P.ALX]; break;
          case 14: rx = o[P.HRX]; rz = o[P.HRZ]; break;
          case 15: rx = o[P.KRX]; break;
          case 16: rx = o[P.ARX]; break;
        }
        tmp.e.set(rx, ry, rz, 'XYZ'); tmp.q.setFromEuler(tmp.e);
        tmp.L.compose(tmp.v.set(x, yy, z), tmp.q, tmp.uno);
        tmp.J[j].multiplyMatrices(tmp.J[pa], tmp.L);
      }
      // piezas
      for (let i = 0; i < PIEZAS.length; i++) {
        if (per.oculta[i]) continue;
        if (i === PZ.MANTA && !(per.estado === 'tumbado' || (per.trans && per.trans.tipo === 'acostarse' && per.trans.t > 0.7))) continue;
        const tipo = TIPO_PIEZA[i];
        let loc = LOCALES[i];
        if (i === PZ.PEINADO) loc = LOC_PEINADO[per.d.peinado];
        tmp.M.multiplyMatrices(tmp.J[PIEZAS[i][0]], loc);
        if ((i === PZ.OJO1 || i === PZ.OJO2) && o[P.OJOS] < 0.5) tmp.M.scale(tmp.v.set(1, 0.15, 1));
        const m = mallas.current[tipo]; if (!m) continue;
        const n = cuentas[tipo]++;
        tmp.M.toArray(m.instanceMatrix.array, n * 16);
        m.instanceColor.array[n * 3] = per.cols[i * 3]; m.instanceColor.array[n * 3 + 1] = per.cols[i * 3 + 1]; m.instanceColor.array[n * 3 + 2] = per.cols[i * 3 + 2];
      }
    }
    for (const k in GEO) {
      const m = mallas.current[k]; if (!m) continue;
      m.count = cuentas[k];
      m.instanceMatrix.needsUpdate = true; m.instanceColor.needsUpdate = true;
    }
    // anillo bajo la persona elegida
    if (anillo.current) {
      anillo.current.visible = !!selPer;
      if (selPer) {
        const dy = selPer.capa === 1 ? pisos.y1 : selPer.capa === 2 ? pisosRes.y1 : 0;
        anillo.current.position.set(selPer.x, (selPer.estado === 'tumbado' ? selPer.y : selPer.y) + dy + 0.05 + (selPer.estado === 'sentado' ? 0 : 0), selPer.z);
        anillo.current.rotation.z += dt * 1.5;
      }
    }
    // la cámara sigue a una persona
    if (seguir && selPer && camara.ctrl && seguir === selPer.id) {
      const dy = selPer.capa === 1 ? pisos.y1 : selPer.capa === 2 ? pisosRes.y1 : 0;
      camara.ctrl.moveTo(selPer.x, selPer.y + dy + 1.0, selPer.z, true);
    }
    // balones
    if (balones.current) {
      const b = balones.current; let n = 0;
      for (const ba of SIM.balones) {
        tmp.M.compose(tmp.v.set(ba.x, ba.y, ba.z), tmp.q.identity(), tmp.s.set(1, 1, 1));
        tmp.M.toArray(b.instanceMatrix.array, n * 16);
        _col.set(ba.tipo === 'basket' ? '#d0612a' : ba.tipo === 'futbol' ? '#ffffff' : '#2a62b8');
        b.instanceColor.array[n * 3] = _col.r; b.instanceColor.array[n * 3 + 1] = _col.g; b.instanceColor.array[n * 3 + 2] = _col.b;
        n++;
      }
      b.count = n; b.instanceMatrix.needsUpdate = true; b.instanceColor.needsUpdate = true;
    }
  });

  return html`<group>
    ${Object.entries(GEO).map(([k, g]) => html`<instancedMesh key=${k} ref=${m => { if (m && !m.instanceColor) { m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAXP * (CUENTA[k] || 1) * 3).fill(1), 3); m.count = 0; } if (m) mallas.current[k] = m; }}
      args=${[g, k === 'logo' ? mats.logo : mats.base, MAXP * (CUENTA[k] || 1)]} frustumCulled=${false} castShadow=${cfg.sombras && k !== 'logo'} receiveShadow=${k !== 'logo'} raycast=${() => null} />`)}
    <instancedMesh ref=${m => { if (m && !m.instanceColor) { m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(16 * 3).fill(1), 3); m.count = 0; } balones.current = m; }}
      args=${[new THREE.SphereGeometry(0.12, 14, 10), mats.base, 16]} frustumCulled=${false} castShadow=${cfg.sombras} raycast=${() => null} />
    <mesh ref=${anillo} rotation=${[-Math.PI / 2, 0, 0]} visible=${false} renderOrder=${5}>
      <ringGeometry args=${[0.45, 0.6, 32, 1, 0, Math.PI * 1.6]} />
      <meshBasicMaterial color="#f3dfb2" toneMapped=${false} transparent opacity=${0.95} depthTest=${false} />
    </mesh>
  </group>`;
}
