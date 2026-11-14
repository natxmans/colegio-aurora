// =========================================================
// ETIQUETAS sobre la maqueta, SIN SUPERPOSICIONES
// Una capa HTML (fuera del lienzo) + un cálculo en cada imagen:
// cada etiqueta se proyecta en la pantalla; si choca con otra,
// se desplaza un poco hacia arriba/abajo, y si no cabe, se oculta.
// =========================================================
import { html, THREE, useFrame, useLayoutEffect, useRef } from '../lib3d.js';
import { POR_PLANTA, Y1, RY1 } from '../datos/salas.js';

import { pisos, pisosRes, capa } from '../compartido.js';
export { pisos, pisosRes, capa };

// Proyección y colocación (dentro del lienzo 3D)
const _p = new THREE.Vector3();
export function ProyectarEtiquetas() {
  const cuenta = useRef(0);
  useFrame(({ camera, size }) => {
    if (!capa.items.size) return;
    if ((cuenta.current++ & 1) === 1) return; // cada dos imágenes es suficiente
    // los paneles de la interfaz (hora, botones, fichas) son zonas prohibidas: ninguna etiqueta debajo
    const puestos = [];
    const primero = capa.items.values().next().value;
    const contenedor = primero && primero.el.parentElement;
    if (contenedor) {
      const b = contenedor.getBoundingClientRect();
      for (const p of contenedor.parentElement.querySelectorAll('.panel, .exp-abrir')) {
        const r = p.getBoundingClientRect();
        if (r.width && r.height) puestos.push({ x0: r.left - b.left - 4, x1: r.right - b.left + 4, y0: r.top - b.top - 4, y1: r.bottom - b.top + 4 });
      }
    }
    const items = [...capa.items.values()].sort((a, b) => a.orden - b.orden);
    for (const it of items) {
      const { s, el } = it;
      if (!it.w) { it.w = el.offsetWidth; it.h = el.offsetHeight; }
      const base = s.planta === 'primer' ? Y1 + pisos.y1 : s.planta === 'res1' ? RY1 + pisosRes.y1 : 0;
      _p.set((s.x0 + s.x1) / 2, base + (s.edificio === 'residencia' && s.planta !== 'residencia' ? 1.6 : s.h + 0.6), (s.z0 + s.z1) / 2).project(camera);
      const visible = _p.z < 1 && Math.abs(_p.x) < 1.05 && Math.abs(_p.y) < 1.05;
      if (!visible) { el.style.opacity = '0'; el.style.pointerEvents = 'none'; continue; }
      let x = (_p.x * 0.5 + 0.5) * size.width;
      const y = (-_p.y * 0.5 + 0.5) * size.height;
      x = Math.min(Math.max(x, it.w / 2 + 6), size.width - it.w / 2 - 6); // nunca fuera de la pantalla
      let colocado = null;
      for (const dy of [0, -it.h - 4, it.h + 4, -2 * (it.h + 4), 2 * (it.h + 4)]) {
        const r = { x0: x - it.w / 2 - 3, x1: x + it.w / 2 + 3, y0: y + dy - it.h / 2 - 2, y1: y + dy + it.h / 2 + 2 };
        if (!puestos.some(q => r.x0 < q.x1 && r.x1 > q.x0 && r.y0 < q.y1 && r.y1 > q.y0)) { colocado = r; break; }
      }
      if (!colocado) { el.style.opacity = '0'; el.style.pointerEvents = 'none'; continue; }
      puestos.push(colocado);
      el.style.opacity = '1'; el.style.pointerEvents = 'auto';
      el.style.transform = `translate(${Math.round(colocado.x0 + 3)}px, ${Math.round(colocado.y0 + 2)}px)`;
    }
  });
  return null;
}
