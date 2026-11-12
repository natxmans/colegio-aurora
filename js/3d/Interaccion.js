// =========================================================
// Interacción: zonas clicables, resaltado y etiquetas sobre la maqueta
// =========================================================
import { html, THREE, useMemo, useRef, useFrame, Html } from '../lib.js';
import { POR_PLANTA, ZONAS } from '../datos/salas.js';
import { useEstado, poner, leer, seleccionar, cambiarVista } from '../estado.js';

function activa(planta, vista, modo) {
  if (modo !== 'explorar') return false;
  if (planta === 'baja') return vista === 'baja' || vista === 'corte';
  if (planta === 'primer') return vista === 'primer' || vista === 'corte';
  if (planta === 'edif') return vista === 'completa';
  return true;
}
function conEtiquetas(planta, vista) {
  if (planta === 'baja') return vista === 'baja';
  if (planta === 'primer') return vista === 'primer';
  return vista === 'completa';
}
const dims = s => ({ w: s.x1 - s.x0, d: s.z1 - s.z0, cx: (s.x0 + s.x1) / 2, cz: (s.z0 + s.z1) / 2, h: s.h });

function Caja({ s }) {
  const { w, d, cx, cz, h } = dims(s);
  return html`<mesh position=${[cx, h / 2, cz]} visible=${false}
    onPointerOver=${e => { e.stopPropagation(); if (leer().hover !== s.id) poner({ hover: s.id }); document.body.style.cursor = 'pointer'; }}
    onPointerOut=${() => { if (leer().hover === s.id) poner({ hover: null }); document.body.style.cursor = ''; }}
    onClick=${e => { e.stopPropagation(); if (e.delta > 8) return; seleccionar(s.id); }}>
    <boxGeometry args=${[w, h, d]} />
  </mesh>`;
}

function Resalte({ s, fuerte }) {
  const { w, d, cx, cz, h } = dims(s);
  const geo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), [w, h, d]);
  const suelo = useRef();
  const interior = useEstado(e => e.interior);
  useFrame(({ clock }) => {
    if (suelo.current) suelo.current.material.opacity = fuerte ? 0.16 + 0.1 * Math.sin(clock.elapsedTime * 3) : 0.08;
  });
  if (interior) return null;
  return html`<group position=${[cx, 0, cz]}>
    <lineSegments geometry=${geo} position=${[0, h / 2, 0]}>
      <lineBasicMaterial color=${fuerte ? '#22d3ee' : '#ffffff'} toneMapped=${false} transparent opacity=${fuerte ? 1 : 0.7} />
    </lineSegments>
    <mesh ref=${suelo} rotation=${[-Math.PI / 2, 0, 0]} position=${[0, 0.08, 0]} renderOrder=${2}>
      <planeGeometry args=${[w, d]} />
      <meshBasicMaterial color=${fuerte ? '#22d3ee' : '#ffffff'} transparent opacity=${0.15} depthWrite=${false} toneMapped=${false} />
    </mesh>
  </group>`;
}

function Etiqueta({ s, hover }) {
  const { cx, cz, h } = dims(s);
  return html`<${Html} position=${[cx, h + 0.7, cz]} center zIndexRange=${[18, 0]}>
    <button className=${'etq3d' + (hover ? ' hover' : '')} style=${{ '--c': s.color }}
      onClick=${() => seleccionar(s.id)}
      onPointerEnter=${() => poner({ hover: s.id })} onPointerLeave=${() => poner({ hover: null })}>
      <i></i>${s.corto || s.nombre}
    </button>
  <//>`;
}

export function Zonas({ planta }) {
  const modo = useEstado(s => s.modo);
  const vista = useEstado(s => s.vista);
  const sel = useEstado(s => s.sel);
  const hover = useEstado(s => s.hover);
  const lista = POR_PLANTA[planta];
  const act = activa(planta, vista, modo);
  return html`<group>
    ${act ? lista.map(s => html`<${Caja} key=${s.id} s=${s} />`) : null}
    ${lista.map(s => (s.id === sel || (act && s.id === hover && !sel)) ? html`<${Resalte} key=${'r' + s.id} s=${s} fuerte=${s.id === sel} />` : null)}
  </group>`;
}

// Cartel flotante "PLANTA BAJA / PRIMER PISO" en la vista en corte
export function EtiquetaPlanta({ planta }) {
  const modo = useEstado(s => s.modo);
  const vista = useEstado(s => s.vista);
  if (modo !== 'explorar' || vista !== 'corte') return null;
  const z = ZONAS[planta];
  return html`<${Html} position=${[-35, 1.9, 6]} center zIndexRange=${[19, 0]}>
    <button className=${'etq-planta' + (planta === 'primer' ? ' violeta' : '')} onClick=${() => cambiarVista(planta)}>
      ${z.titulo.toUpperCase()}<small>${planta === 'baja' ? 'Aulas, laboratorios, biblioteca y comedor' : 'Dormitorios y salones'}</small>
    </button>
  <//>`;
}
