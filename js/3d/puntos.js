// =========================================================
// PUNTOS DE ACTIVIDAD: sillas, camas, escritorios, bancos, puestos de trabajo...
// Cada mueble que se puede usar deja aquí un "punto" invisible. La simulación
// lee su posición y su orientación en el mundo para colocar a las personas.
//  t: tipo ('pupitre', 'cama', 'comedor', 'sofa', 'banco', 'trabajo'...)
//  sala: id del lugar · i: número dentro del lugar
//  asiento: altura del asiento (0 = de pie) · ap: punto de llegada [x, z] (local)
//  la persona mira hacia +z local
// =========================================================
import { html, useRef, useLayoutEffect } from '../lib3d.js';

export const PUNTOS = [];

export function Punto({ t, sala, i = 0, p, ry = 0, asiento = 0, ap = null, ...datos }) {
  const ref = useRef();
  useLayoutEffect(() => {
    const o = ref.current;
    o.updateMatrix();
    const reg = { obj: o, t, sala, i, asiento, ap, datos };
    PUNTOS.push(reg);
    return () => { const k = PUNTOS.indexOf(reg); if (k >= 0) PUNTOS.splice(k, 1); };
  }, []);
  return html`<object3D ref=${ref} position=${p} rotation=${[0, ry, 0]} matrixAutoUpdate=${false} visible=${false} />`;
}

// Posición y orientación en el mundo (después de montar la escena)
export function resolverPuntos() {
  return PUNTOS.map(r => {
    const e = r.obj.matrixWorld.elements;
    const x = e[12], y = e[13], z = e[14];
    const fx = e[8], fz = e[10], rx = e[0], rz = e[2];
    const lf = Math.hypot(fx, fz) || 1, lr = Math.hypot(rx, rz) || 1;
    const yaw = Math.atan2(fx / lf, fz / lf);
    let ax = null, az = null;
    if (r.ap) { ax = x + (rx / lr) * r.ap[0] + (fx / lf) * r.ap[1]; az = z + (rz / lr) * r.ap[0] + (fz / lf) * r.ap[1]; }
    return { t: r.t, sala: r.sala, i: r.i, x, y, z, yaw, asiento: r.asiento, ax, az, ...r.datos, ocupado: null };
  });
}
