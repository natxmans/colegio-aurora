// =========================================================
// KIT DE PIEZAS INSTANCIADAS
// Toda la maqueta está hecha con miles de piezas simples (cajas, cilindros,
// esferas...). Para que el sitio funcione en un ordenador normal, todas las
// piezas del mismo tipo se dibujan juntas con un solo InstancedMesh.
// Cada <Pieza> es un Object3D invisible: el kit copia su posición mundial.
// =========================================================
import { html, THREE, useFrame, useThree, useRef, useMemo, useLayoutEffect, createContext, useContext } from '../lib.js';

const G = {
  caja: new THREE.BoxGeometry(1, 1, 1),
  cil: new THREE.CylinderGeometry(0.5, 0.5, 1, 16),
  esfera: new THREE.SphereGeometry(0.5, 16, 12),
  cono: new THREE.ConeGeometry(0.5, 1, 16),
  tronco: new THREE.CylinderGeometry(0.32, 0.5, 1, 16),
  ico: new THREE.IcosahedronGeometry(0.5, 1),
  capsula: new THREE.CapsuleGeometry(0.5, 1, 3, 10),
  pelo: new THREE.SphereGeometry(0.5, 14, 7, 0, Math.PI * 2, 0, Math.PI * 0.5),
  toro: new THREE.TorusGeometry(0.5, 0.09, 8, 28),
};
// Versiones ligeras para los alumnos (son pequeños y hay muchos)
const GL = {
  cil: new THREE.CylinderGeometry(0.5, 0.5, 1, 10),
  esfera: new THREE.SphereGeometry(0.5, 11, 8),
  capsula: new THREE.CapsuleGeometry(0.5, 1, 2, 8),
  tronco: new THREE.CylinderGeometry(0.32, 0.5, 1, 12),
};

export const MAT = {
  mate: new THREE.MeshStandardMaterial({ roughness: 0.78, metalness: 0.02 }),
  brillo: new THREE.MeshStandardMaterial({ roughness: 0.26, metalness: 0.12 }),
  metal: new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.85 }),
  luz: new THREE.MeshBasicMaterial({ toneMapped: false }),
  vidrio: new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.2, roughness: 0.04, metalness: 0.6, depthWrite: false, envMapIntensity: 1.6 }),
  plano: new THREE.MeshStandardMaterial({ roughness: 0.85, flatShading: true }),
};

// nombre: [geometría, material, máximo, proyecta sombra]
const BASE = {
  caja: [G.caja, MAT.mate, 16000, true],
  cajaB: [G.caja, MAT.brillo, 6000, true],
  cajaM: [G.caja, MAT.metal, 5000, true],
  cajaL: [G.caja, MAT.luz, 6000, false],
  vidrio: [G.caja, MAT.vidrio, 3000, false],
  cil: [G.cil, MAT.mate, 3500, true],
  cilB: [G.cil, MAT.brillo, 2500, true],
  cilM: [G.cil, MAT.metal, 3500, true],
  cilL: [G.cil, MAT.luz, 1500, false],
  esfera: [G.esfera, MAT.mate, 3000, true],
  esferaB: [G.esfera, MAT.brillo, 1500, true],
  esferaL: [G.esfera, MAT.luz, 1500, false],
  cono: [G.cono, MAT.mate, 1500, true],
  tronco: [G.tronco, MAT.mate, 1500, true],
  ico: [G.ico, MAT.plano, 2500, true],
  capsula: [G.capsula, MAT.mate, 1000, true],
  toro: [G.toro, MAT.mate, 800, true],
  toroM: [G.toro, MAT.metal, 800, true],
  toroL: [G.toro, MAT.luz, 800, false],
};
// Tipos "a..." = piezas animadas (alumnos, robots...): se copian en cada imagen
const DINAMICOS = {
  aCaja: [G.caja, MAT.mate, 2500, true],
  aCajaB: [G.caja, MAT.brillo, 2500, true],
  aCajaM: [G.caja, MAT.metal, 600, true],
  aCajaL: [G.caja, MAT.luz, 2500, false],
  aCil: [GL.cil, MAT.mate, 3000, true],
  aCilM: [GL.cil, MAT.metal, 800, true],
  aCilL: [GL.cil, MAT.luz, 600, false],
  aEsfera: [GL.esfera, MAT.mate, 4500, true],
  aEsferaL: [GL.esfera, MAT.luz, 300, false],
  aCapsula: [GL.capsula, MAT.mate, 9000, true],
  aPelo: [G.pelo, MAT.mate, 1200, true],
  aTronco: [GL.tronco, MAT.mate, 800, true],
  aToro: [G.toro, MAT.mate, 200, true],
  aToroM: [G.toro, MAT.metal, 200, true],
  aToroL: [G.toro, MAT.luz, 200, false],
  aIco: [G.ico, MAT.plano, 300, true],
  aCono: [G.cono, MAT.mate, 200, true],
  aEsferaB: [G.esfera, MAT.brillo, 600, true],
  aCilB: [G.cil, MAT.brillo, 300, true],
};
const TIPOS = { ...BASE, ...DINAMICOS };
const ES_DIN = Object.fromEntries(Object.keys(TIPOS).map(k => [k, k in DINAMICOS]));

// Cuando algo estático cambia (montaje, color, planta que se mueve...) se "toca" el kit
let VERSION = 1;
export const tocar = () => { VERSION++; };

const Ctx = createContext(null);
let frame = 0;
function esVisible(o, f) {
  if (!o) return true;
  const u = o.userData;
  if (u._vf === f) return u._v;
  const v = o.visible && esVisible(o.parent, f);
  u._vf = f; u._v = v;
  return v;
}

export function KitRoot({ children, sombras = true }) {
  const reg = useMemo(() => Object.fromEntries(Object.keys(TIPOS).map(k => [k, new Set()])), []);
  const mallas = useRef({});
  const ultima = useRef(0);
  const { scene } = useThree();

  useLayoutEffect(() => {
    scene.matrixWorldAutoUpdate = false; // lo hacemos nosotros una sola vez por imagen
    scene.matrixAutoUpdate = false;      // la escena no se mueve: así no se recalcula todo cada vez
    scene.updateMatrix();
    for (const k in TIPOS) {
      const m = mallas.current[k];
      if (!m) continue;
      m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(TIPOS[k][2] * 3).fill(1), 3);
      m.count = 0;
    }
    return () => { scene.matrixWorldAutoUpdate = true; };
  }, []);

  useFrame(({ gl, scene, camera }) => {
    scene.updateMatrixWorld();
    const f = ++frame;
    const todo = ultima.current !== VERSION;
    ultima.current = VERSION;
    for (const k in TIPOS) {
      if (!todo && !ES_DIN[k]) continue;
      const m = mallas.current[k];
      if (!m) continue;
      const lim = TIPOS[k][2];
      const mat = m.instanceMatrix.array, col = m.instanceColor.array;
      let n = 0;
      for (const o of reg[k]) {
        if (n >= lim) break;
        if (!esVisible(o.parent, f)) continue;
        mat.set(o.matrixWorld.elements, n * 16);
        const c = o.userData.c, j = n * 3;
        col[j] = c.r; col[j + 1] = c.g; col[j + 2] = c.b;
        n++;
      }
      m.count = n;
      const im = m.instanceMatrix, ic = m.instanceColor;
      im.clearUpdateRanges(); im.addUpdateRange(0, Math.max(16, n * 16)); im.needsUpdate = true;
      ic.clearUpdateRanges(); ic.addUpdateRange(0, Math.max(3, n * 3)); ic.needsUpdate = true;
    }
    gl.render(scene, camera);
  }, 1);

  return html`<${Ctx.Provider} value=${reg}>
    ${Object.entries(TIPOS).map(([k, [geo, mat, lim, sombra]]) => html`
      <instancedMesh key=${k} ref=${m => { if (m) mallas.current[k] = m; }}
        args=${[geo, mat, lim]} frustumCulled=${false}
        castShadow=${sombras && sombra} receiveShadow=${k !== 'cajaL' && k !== 'vidrio'}
        raycast=${() => null} />`)}
    ${children}
  <//>`;
}

function limpiar(o) {
  const r = {};
  for (const k in o) if (o[k] !== undefined) r[k] = o[k];
  return r;
}

// Una pieza: t = tipo, p = posición, r = rotación, s = escala, c = color
export function Pieza({ t, p, r, s, c = '#ffffff' }) {
  const reg = useContext(Ctx);
  const ref = useRef();
  useLayoutEffect(() => {
    const o = ref.current;
    o.userData.c = new THREE.Color();
    const set = reg[t] || reg.caja;
    set.add(o);
    tocar();
    return () => { set.delete(o); tocar(); };
  }, [t]);
  useLayoutEffect(() => {
    const o = ref.current;
    o.userData.c.set(c);
    o.updateMatrix();
    tocar();
  });
  // visible=false: three.js no la recorre al dibujar (más rápido); el kit sí la copia
  return html`<object3D ref=${ref} ...${limpiar({ position: p, rotation: r, scale: s })} matrixAutoUpdate=${false} visible=${false} />`;
}

// Grupo estático (no recalcula su matriz en cada imagen)
export function Grupo({ p, r, s, visible, children }) {
  const ref = useRef();
  useLayoutEffect(() => { ref.current.updateMatrix(); tocar(); });
  return html`<group ref=${ref} ...${limpiar({ position: p, rotation: r, scale: s, visible })} matrixAutoUpdate=${false}>${children}</group>`;
}
