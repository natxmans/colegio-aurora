// =========================================================
// LAS LUCES DE LA TARDE Y DE LA NOCHE
// · Las ventanas se iluminan cuando hay gente dentro y ya oscurece.
// · En la residencia, las habitaciones se apagan poco a poco a partir de las 21:00.
// · Las farolas se encienden al atardecer y se apagan al amanecer.
// Todo depende de la hora de la simulación (no de un botón).
// =========================================================
import { html, THREE, useFrame, useMemo, useRef } from '../lib3d.js';
import { POR_PLANTA, Y1, GYM } from '../datos/salas.js';
import { VENTANAS_RES } from './Residencia.js';
import { FAROLAS } from './Exteriores.js';
import { pisos, pisosRes } from './etiquetas.js';
import { ambiente } from './Escena.js';
import { SIM } from '../sim/vida.js';
import { reloj, aMin } from '../sim/reloj.js';
import { NIVELES } from '../calidad.js';

const PI = Math.PI;
function lista() {
  const v = [];
  // edificio principal: una ventana luminosa por sala y por fachada
  for (const s of [...POR_PLANTA.baja, ...POR_PLANTA.primer]) {
    const piso = s.planta === 'primer';
    const y = (piso ? Y1 : 0) + s.h / 2 + 0.1;
    if (s.fila === 'norte') v.push({ x: s.cx, y, z: -11.08, w: s.w - 0.7, h: s.h - 0.7, ry: PI, sala: s.id, piso: piso ? 1 : 0 });
    else v.push({ x: s.cx, y, z: 11.08, w: s.w - 0.7, h: s.h - 0.7, ry: 0, sala: s.id, piso: piso ? 1 : 0 });
  }
  // pasillos (extremos de cristal)
  for (const lado of [-1, 1]) v.push({ x: lado * 32.47, y: 2.6, z: 0, w: 2.2, h: 1.4, ry: lado * PI / 2, sala: 'pasillo0', piso: 0 });
  // residencia
  for (const w of VENTANAS_RES) v.push({ x: w.x, y: w.y, z: w.z, w: w.w, h: w.h, ry: w.lado * PI / 2, sala: w.sala, piso: w.y > 3 ? 2 : 0 });
  // gimnasio y piscina (bandas de cristal)
  v.push({ x: GYM.cx, y: 1.9, z: GYM.cz + GYM.d / 2 + 0.06, w: GYM.w - 1, h: 3.4, ry: 0, sala: 'gimnasio', piso: 0 });
  v.push({ x: GYM.cx, y: 1.9, z: GYM.cz - GYM.d / 2 - 0.06, w: GYM.w - 1, h: 3.4, ry: PI, sala: 'gimnasio', piso: 0 });
  v.push({ x: 40, y: 3.4, z: 45.06, w: 58, h: 6.4, ry: 0, sala: 'piscina', piso: 0, frio: true });
  v.push({ x: 40, y: 3.4, z: 14.94, w: 58, h: 6.4, ry: PI, sala: 'piscina', piso: 0, frio: true });
  return v;
}

// Textura redonda y suave para el suelo bajo las farolas
function texHalo() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 4, 64, 64, 62);
  gr.addColorStop(0, 'rgba(255,220,160,1)'); gr.addColorStop(0.45, 'rgba(255,200,130,0.45)'); gr.addColorStop(1, 'rgba(255,190,120,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// ¿a qué hora se apaga la luz de esta habitación? (entre las 21:00 y las 21:25)
const apagado = {};
function horaApagado(sala) {
  if (apagado[sala] == null) { let h = 0; for (const ch of sala) h = (h * 31 + ch.charCodeAt(0)) % 997; apagado[sala] = aMin('21:00') + (h % 26); }
  return apagado[sala];
}

export function LucesNoche({ calidad = 'normal' }) {
  const cfg = NIVELES[calidad];
  const ven = useMemo(lista, []);
  const vRef = useRef(), fRef = useRef(), luces = useRef([]);
  const nivel = useRef(new Float32Array(ven.length));
  const mats = useMemo(() => ({
    ventana: new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.FrontSide }),
    halo: new THREE.MeshBasicMaterial({ map: texHalo(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
  }), []);
  const geo = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const cuenta = useRef(0);
  const calido = useMemo(() => new THREE.Color('#ffcf8a'), []), frio = useMemo(() => new THREE.Color('#bfe6ff'), []);

  const iniciar = (m) => {
    if (!m || m.userData.listo) return;
    m.userData.listo = true;
    m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(ven.length * 3), 3);
    const M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    ven.forEach((v, i) => { M.compose(new THREE.Vector3(v.x, v.y, v.z), q.setFromEuler(e.set(0, v.ry, 0)), new THREE.Vector3(v.w, v.h, 1)); M.toArray(m.instanceMatrix.array, i * 16); });
    m.instanceMatrix.needsUpdate = true;
  };
  const iniciarHalos = (m) => {
    if (!m || m.userData.listo) return;
    m.userData.listo = true;
    m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(FAROLAS.length * 3), 3);
    const M = new THREE.Matrix4(), q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-PI / 2, 0, 0));
    FAROLAS.forEach(([x, z], i) => { M.compose(new THREE.Vector3(x + 0.4, 0.07, z), q, new THREE.Vector3(9, 9, 1)); M.toArray(m.instanceMatrix.array, i * 16); });
    m.instanceMatrix.needsUpdate = true;
  };

  useFrame((_, dt) => {
    const L = ambiente.L, osc = L.oscuridad;
    const m = vRef.current, f = fRef.current;
    if (!m || !f) return;
    if ((cuenta.current++ % 4) !== 0 && osc < 0.01) return;
    // ¿qué salas tienen la luz encendida?
    const luz = new Map();
    const min = reloj.min;
    for (const p of SIM.personas) {
      if (p.estado === 'fuera' || !p.plan || !p.plan.sala) continue;
      const s = p.plan.sala;
      const duerme = p.plan.id === 'dormir';
      const on = !duerme || (min >= aMin('20:30') && min < horaApagado(s)) || (min >= aMin('07:40') && min < aMin('08:10'));
      if (on && p.estado !== 'andando') luz.set(s, 1);
    }
    const tarde = min >= aMin('07:30') && min < aMin('22:30');
    if (tarde) luz.set('pasillo0', 1);
    const col = m.instanceColor.array, k = 1 - Math.exp(-dt * 2.5);
    ven.forEach((v, i) => {
      let obj = (luz.get(v.sala) ? 1 : 0) * osc;
      if (v.piso === 1 && pisos.y1 > 0.5) obj = 0;
      if (v.piso === 2 && pisosRes.y1 > 0.5) obj = 0;
      nivel.current[i] += (obj - nivel.current[i]) * k;
      const n = nivel.current[i] * (v.frio ? 0.55 : 0.9), c = v.frio ? frio : calido;
      col[i * 3] = c.r * n; col[i * 3 + 1] = c.g * n; col[i * 3 + 2] = c.b * n;
    });
    m.instanceColor.needsUpdate = true;
    m.visible = osc > 0.01;
    const fc = f.instanceColor.array, h = osc * 0.85;
    for (let i = 0; i < FAROLAS.length; i++) { fc[i * 3] = h; fc[i * 3 + 1] = h * 0.92; fc[i * 3 + 2] = h * 0.8; }
    f.instanceColor.needsUpdate = true; f.visible = osc > 0.01;
    for (const l of luces.current) if (l) l.intensity = 14 * osc;
  });
  const PUNTOS_LUZ = [[0, 3.6, 16], [-15, 4, 29], [-43.4, 3.2, 0], [33.7, 3.2, 0], [25, 3, 13.5], [-52, 3.2, 22.5]];
  return html`<group>
    <instancedMesh ref=${m => { iniciar(m); vRef.current = m; }} args=${[geo, mats.ventana, ven.length]} frustumCulled=${false} renderOrder=${6} raycast=${() => null} />
    <instancedMesh ref=${m => { iniciarHalos(m); fRef.current = m; }} args=${[geo, mats.halo, FAROLAS.length]} frustumCulled=${false} renderOrder=${3} raycast=${() => null} />
    ${cfg.detalle && calidad === 'alta' ? PUNTOS_LUZ.map((p, i) => html`<pointLight key=${i} ref=${l => { luces.current[i] = l; }} position=${p} intensity=${0} distance=${20} decay=${1.6} color="#ffd29a" />`) : null}
  </group>`;
}
