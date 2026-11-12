// =========================================================
// EDIFICIO PRINCIPAL: planta baja (zona escolar) + primer piso (internado) + techo
// Las plantas se separan con animación: vista en corte, planta baja, primer piso...
// =========================================================
import { html, useRef, useFrame, useLayoutEffect } from '../lib.js';
import { B, C, S, V, G, Ico, Panel, COL, Planta, Banco, Pantalla, Arbol } from './piezas.js';
import { tocar } from './kit.js';
import { POR_PLANTA, Y1, H0, H1 } from '../datos/salas.js';
import { leer } from '../estado.js';
import { Aula } from './Aulas.js';
import * as SL from './Salas.js';
import { Alumno } from './Alumno.js';
import { Zonas, EtiquetaPlanta } from './Interaccion.js';
import { pisos } from './etiquetas.js';
import { texRotuloTexto, texLogo, texPantalla } from './texturas.js';

const PI = Math.PI;
const COMP = {
  aula: Aula, biblioteca: SL.Biblioteca, recepcion: SL.Recepcion, comedor: SL.Comedor,
  habitacion: SL.Habitacion, descanso: SL.ZonaDescanso, salon: SL.Salon,
};

function Sala({ s }) {
  const Comp = COMP[s.tipo];
  if (!Comp) return null;
  return html`<${G} p=${[(s.x0 + s.x1) / 2, 0, (s.z0 + s.z1) / 2]} r=${[0, s.fila === 'sur' ? PI : 0, 0]}><${Comp} s=${s} /><//>`;
}

// Tabiques entre salas, fachadas de cristal, pasillo...
function Estructura({ h, salas, primer = false }) {
  const muros = [];
  for (const fila of ['norte', 'sur']) {
    const zc = fila === 'norte' ? -6.5 : 6.5;
    const xs = [...new Set(salas.filter(s => s.fila === fila).map(s => s.x0))].filter(x => x > -31.9);
    for (const x of xs) muros.push(html`<${B} key=${fila + x} p=${[x, h / 2, zc]} s=${[0.18, h, 9]} c=${COL.blanco} />`);
  }
  // Fachadas: pilares de piedra beige cada 8 m, montantes azul marino y franja baja blanca
  const fachada = [];
  for (const z of [-11, 11]) {
    const sgn = z > 0 ? 1 : -1;
    for (let x = -32; x <= 32.01; x += 2) {
      if (Math.abs(x % 8) < 0.01) fachada.push(html`<${B} key=${'p' + z + x} p=${[x, h / 2, z + sgn * 0.12]} s=${[0.55, h, 0.5]} c=${COL.piedra} />`);
      else fachada.push(html`<${B} key=${'m' + z + x} m="M" p=${[x, h / 2, z]} s=${[0.07, h, 0.12]} c=${COL.noche} />`);
    }
    fachada.push(html`<${B} key=${'t' + z} m="M" p=${[0, primer ? 1.05 : 0.9, z]} s=${[64, 0.06, 0.1]} c=${COL.noche} />`);
  }
  return html`<${G}>
    ${primer ? html`
      <${B} p=${[-18.15, -0.2, 0]} s=${[28.3, 0.4, 22.6]} c="#e8e2d6" />
      <${B} p=${[15.15, -0.2, 0]} s=${[34.3, 0.4, 22.6]} c="#e8e2d6" />
      <${B} p=${[-3, -0.2, -4.15]} s=${[2, 0.4, 14.3]} c="#e8e2d6" />
      <${B} p=${[-3, -0.2, 10.65]} s=${[2, 0.4, 1.3]} c="#e8e2d6" />
      <${B} m="B" p=${[0, -0.21, -11.25]} s=${[65, 0.46, 0.45]} c=${COL.blanco} />
      <${B} m="B" p=${[0, -0.21, 11.25]} s=${[65, 0.46, 0.45]} c=${COL.blanco} />
    ` : html`
      <${B} p=${[0, -0.2, 0]} s=${[64.6, 0.4, 22.6]} c="#e8e2d6" />
      <${B} m="B" p=${[0, 0.2, -11.2]} s=${[64.8, 0.4, 0.42]} c=${COL.piedra} />
      <${B} m="B" p=${[0, 0.2, 11.2]} s=${[64.8, 0.4, 0.42]} c=${COL.piedra} />
    `}
    <${B} p=${[0, 0.02, 0]} s=${[64, 0.04, 4]} c=${primer ? '#c9b48e' : '#ddd3c2'} />
    <${B} p=${[0, 0.045, 0]} s=${[63, 0.01, 0.9]} c=${primer ? '#20345f' : '#cfc3ad'} />
    ${muros}
    <${B} p=${[-32.15, h / 2, 0]} s=${[0.5, h, 22.6]} c=${COL.piedra} />
    <${B} p=${[32.15, h / 2, 0]} s=${[0.5, h, 22.6]} c=${COL.piedra} />
    ${[-6, 0, 6].map(z => html`<${V} key=${'ve' + z} p=${[-32.42, h / 2, z]} s=${[0.04, h - 0.9, 1.1]} c="#cfe0ea" />`)}
    ${[-6, 0, 6].map(z => html`<${V} key=${'vd' + z} p=${[32.42, h / 2, z]} s=${[0.04, h - 0.9, 1.1]} c="#cfe0ea" />`)}
    <${V} p=${[0, h / 2, -11]} s=${[64, h - 0.1, 0.06]} c="#cfe0ea" />
    <${V} p=${[0, h / 2, 11]} s=${[64, h - 0.1, 0.06]} c="#cfe0ea" />
    ${fachada}
    <${B} m="M" p=${[0, h - 0.08, -11]} s=${[64, 0.16, 0.18]} c=${COL.noche} />
    <${B} m="M" p=${[0, h - 0.08, 11]} s=${[64, 0.16, 0.18]} c=${COL.noche} />
  <//>`;
}

function PasilloPB() {
  return html`<${G}>
    ${[-26, -14, 14, 26].map((x, i) => html`<${Banco} key=${'b' + i} p=${[x, 0, -1.55]} w=${2.2} />`)}
    ${[-20, -6, 8, 20].map((x, i) => html`<${Planta} key=${'p' + i} p=${[x, 0, 1.55]} s=${1.0} tipo=${i % 3} />`)}
    ${[-10, 22].map((x, i) => html`<${G} key=${'t' + i} p=${[x, 0, 1.6]}>
      <${B} m="B" p=${[0, 0.95, 0]} s=${[0.7, 1.9, 0.12]} c=${COL.negro} />
      <${Panel} p=${[0, 1.15, -0.065]} r=${[0, PI, 0]} w=${0.6} h=${1.05} tex=${texPantalla('horario')} />
    <//>`)}
    <${Alumno} p=${[0, 0, -0.6]} ruta=${{ tipo: 'linea', a: [-28, -0.6], b: [28, -0.6], vel: 1.1 }} pose="caminando" seed=${1101} />
    <${Alumno} p=${[0, 0, 0.7]} ruta=${{ tipo: 'linea', a: [26, 0.7], b: [-24, 0.7], vel: 1.0 }} pose="caminando" seed=${1102} />
    <${Alumno} p=${[0, 0, 0.1]} ruta=${{ tipo: 'linea', a: [-12, 0.1], b: [12, 0.1], vel: 0.9 }} pose="caminando" seed=${1103} />
    <${Alumno} p=${[-26, 0, -1.0]} ry=${PI} pose="hablando" seed=${1104} />
    <${Alumno} p=${[-25.2, 0, -0.6]} ry=${-2.2} pose="de_pie" seed=${1105} />
    <${Alumno} p=${[13.6, 0, -1.55]} ry=${PI} pose="sentado" asiento=${0.45} seed=${1106} />
  <//>`;
}

function PasilloPP() {
  return html`<${G}>
    ${[-24, -8, 10, 26].map((x, i) => html`<${Planta} key=${'p' + i} p=${[x, 0, -1.55]} s=${1.0} tipo=${(i + 1) % 3} />`)}
    <${B} p=${[0, 0.05, -1.85]} s=${[63, 0.01, 0.06]} c=${COL.maderaC} />
    <${B} p=${[0, 0.05, 1.85]} s=${[63, 0.01, 0.06]} c=${COL.maderaC} />
    <${Alumno} p=${[0, 0, 0.4]} ruta=${{ tipo: 'linea', a: [-26, 0.4], b: [24, 0.4], vel: 0.9 }} pose="caminando" seed=${1201} />
    <${Alumno} p=${[0, 0, -0.5]} ruta=${{ tipo: 'linea', a: [20, -0.5], b: [-14, -0.5], vel: 1.0 }} pose="caminando" seed=${1202} />
    <${Alumno} p=${[-17, 0, 0.9]} ry=${-PI / 2} pose="hablando" seed=${1203} />
    <${Alumno} p=${[-17.8, 0, 0.9]} ry=${PI / 2} pose="de_pie" seed=${1204} />
  <//>`;
}

// Entrada principal: marquesina azul marino con el logo original del colegio
function Entrada() {
  return html`<${G}>
    <${B} m="B" p=${[0, 3.62, 14.6]} s=${[13, 0.36, 7.2]} c=${COL.noche} />
    <${B} m="B" p=${[0, 3.42, 14.6]} s=${[12.6, 0.04, 6.8]} c=${COL.maderaC} />
    <${B} m="L" p=${[0, 3.39, 14.6]} s=${[11.6, 0.02, 5.6]} c=${COL.calido} />
    <${B} m="M" p=${[-5.6, 1.75, 17.6]} s=${[0.3, 3.5, 0.3]} c=${COL.noche} />
    <${B} m="M" p=${[5.6, 1.75, 17.6]} s=${[0.3, 3.5, 0.3]} c=${COL.noche} />
    <${Panel} p=${[-4.1, 4.75, 17.9]} w=${1.9} h=${1.9} transp doble tex=${texLogo()} />
    <${Panel} p=${[1.4, 4.4, 17.9]} w=${8.4} h=${1.0} transp doble tex=${texRotuloTexto('COLEGIO PABLO PICASSO', COL.noche)} />
    <${B} m="B" p=${[0.2, 4.4, 17.86]} s=${[11.4, 1.2, 0.06]} c=${COL.blanco} />
    <${B} m="B" p=${[-2.6, H0 / 2, 11.3]} s=${[0.6, H0, 0.6]} c=${COL.piedra} />
    <${B} m="B" p=${[2.6, H0 / 2, 11.3]} s=${[0.6, H0, 0.6]} c=${COL.piedra} />
    <${B} p=${[0, 0.06, 13.6]} s=${[10, 0.12, 4.4]} c="#d9cdb6" />
    ${[-4, -2, 0, 2, 4].map(x => html`<${B} key=${x} p=${[x, 0.13, 15.7]} s=${[1.6, 0.02, 0.3]} c=${COL.noche} />`)}
    <${Planta} p=${[-6.6, 0, 12.6]} s=${1.4} tipo=${1} /><${Planta} p=${[6.6, 0, 12.6]} s=${1.4} tipo=${1} />
  <//>`;
}

function Balcones() {
  const items = [];
  for (let i = 0; i < 10; i++) {
    const cx = -32 + 3.2 + i * 6.4;
    items.push(html`<${G} key=${i} p=${[cx, 0, -11.95]}>
      <${B} m="B" p=${[0, -0.09, 0]} s=${[5.3, 0.18, 1.6]} c=${COL.blanco} />
      <${V} p=${[0, 0.55, -0.76]} s=${[5.3, 1.05, 0.04]} />
      <${V} p=${[-2.63, 0.55, 0]} s=${[0.04, 1.05, 1.55]} />
      <${V} p=${[2.63, 0.55, 0]} s=${[0.04, 1.05, 1.55]} />
      <${B} m="M" p=${[0, 1.09, -0.76]} s=${[5.32, 0.05, 0.06]} c=${COL.noche} />
      <${B} p=${[1.6, 0.2, -0.4]} s=${[1.6, 0.4, 0.4]} c=${COL.piedra} />
      <${Ico} p=${[1.2, 0.55, -0.4]} s=${0.45} c="#5e8a4c" /><${Ico} p=${[1.9, 0.5, -0.4]} s=${0.4} c="#7da35f" />
      <${B} m="M" p=${[-1.6, 0.4, -0.3]} s=${[0.5, 0.04, 0.5]} c=${COL.madera} />
    <//>`);
  }
  return items;
}

// Lamas de madera en la fachada sur del primer piso
function Lamas() {
  const items = [];
  let x = -31.4, i = 0;
  while (x < 31.5) {
    if (x < -7 || x > 7) items.push(html`<${B} key=${i} m="B" p=${[x, H1 / 2 - 0.2, 11.6]} s=${[0.12, H1 + 0.6, 0.55]} c=${COL.madera} />`);
    x += 1.1 + ((i * 7) % 5) * 0.18; i++;
  }
  return items;
}

function Techo() {
  const paneles = [];
  for (const z of [-8.6, -6.3, -4.0]) for (let x = -29; x <= 29.1; x += 2.4) {
    paneles.push(html`<${G} key=${'p' + x + z} p=${[x, 0.62, z]} r=${[0.3, 0, 0]}>
      <${B} m="B" s=${[2.15, 0.05, 1.35]} c="#1d2f57" />
      <${B} m="M" p=${[0, -0.03, 0]} s=${[2.2, 0.03, 1.4]} c=${COL.grisM} />
    <//>`);
  }
  for (const z of [4.0, 6.3, 8.6]) for (let x = -29; x <= 5; x += 2.4) {
    if (Math.abs(x) < 4.5 || (x > -22 && x < -14)) continue;
    paneles.push(html`<${G} key=${'q' + x + z} p=${[x, 0.62, z]} r=${[0.3, 0, 0]}><${B} m="B" s=${[2.15, 0.05, 1.35]} c="#1d2f57" /><//>`);
  }
  return html`<${G}>
    <${B} m="B" p=${[0, 0.25, 0]} s=${[67, 0.5, 25.4]} c="#f4f1ea" />
    <${B} m="B" p=${[0, 0.55, -12.6]} s=${[67, 0.6, 0.25]} c=${COL.blanco} />
    <${B} m="B" p=${[0, 0.55, 12.6]} s=${[67, 0.6, 0.25]} c=${COL.blanco} />
    <${B} m="B" p=${[-33.4, 0.55, 0]} s=${[0.25, 0.6, 25.4]} c=${COL.blanco} />
    <${B} m="B" p=${[33.4, 0.55, 0]} s=${[0.25, 0.6, 25.4]} c=${COL.blanco} />
    <${B} m="M" p=${[0, 0.02, 12.72]} s=${[67, 0.08, 0.06]} c=${COL.noche} />
    <${B} m="M" p=${[0, 0.02, -12.72]} s=${[67, 0.08, 0.06]} c=${COL.noche} />
    ${paneles}
    <${B} p=${[18, 0.56, 6]} s=${[22, 0.12, 9]} c="#6c9a52" />
    <${B} p=${[18, 0.6, 6]} s=${[6, 0.06, 9]} c=${COL.madera} />
    ${[[10, 3.2], [13, 8.5], [24, 3.0], [27, 8.4], [21, 9.2]].map(([x, z], i) => html`<${Arbol} key=${'a' + i} p=${[x, 0.6, z]} s=${0.45} c=${i % 2 ? '#5e8a4c' : '#7da35f'} />`)}
    <${Banco} p=${[16, 0.62, 4]} w=${2} /><${Banco} p=${[20, 0.62, 8]} r=${[0, PI, 0]} w=${2} />
    <${V} p=${[0, 0.95, 6.5]} s=${[6.4, 0.9, 6.4]} />
    <${B} m="M" p=${[0, 1.42, 6.5]} s=${[6.5, 0.06, 6.5]} c=${COL.noche} />
    <${Panel} p=${[-18, 0.54, 6.5]} r=${[-PI / 2, 0, 0]} w=${6.5} h=${6.5} transp tex=${texLogo()} />
  <//>`;
}

function PlantaBaja() {
  return html`<${G}>
    <${Estructura} h=${H0} salas=${POR_PLANTA.baja} />
    ${POR_PLANTA.baja.map(s => html`<${Sala} key=${s.id} s=${s} />`)}
    <${PasilloPB} />
    <${Entrada} />
    <${Zonas} planta="baja" />
    <${EtiquetaPlanta} planta="baja" />
  <//>`;
}

function PrimerPiso() {
  return html`<${G}>
    <${Estructura} h=${H1} salas=${POR_PLANTA.primer} primer />
    ${POR_PLANTA.primer.map(s => html`<${Sala} key=${s.id} s=${s} />`)}
    <${PasilloPP} />
    <${Balcones} />
    <${Lamas} />
    <${Zonas} planta="primer" />
    <${EtiquetaPlanta} planta="primer" />
  <//>`;
}

// Columnas de luz que unen las dos plantas en la "vista en corte"
const ESQUINAS = [[-32, -11], [32, -11], [-32, 11], [32, 11], [0, -11], [0, 11]];
function Guias({ refGrupo }) {
  return html`<group ref=${refGrupo} visible=${false}>
    ${ESQUINAS.map(([x, z], i) => html`<mesh key=${i} position=${[x, 0.5, z]}>
      <boxGeometry args=${[0.12, 1, 0.12]} />
      <meshBasicMaterial color=${i < 4 ? '#c9a978' : '#1f4e9a'} transparent opacity=${0.75} toneMapped=${false} />
    </mesh>`)}
  </group>`;
}

export function Edificio() {
  const g1 = useRef(), gT = useRef(), guias = useRef();
  const st = useRef({ y1: 0, yT: 0 });
  useLayoutEffect(() => { g1.current.updateMatrix(); gT.current.updateMatrix(); tocar(); }, []);
  useFrame((_, dt) => {
    const s = leer();
    const k = 1 - Math.exp(-Math.min(dt, 0.05) * 3.4);
    const oc1 = s.vista === 'baja';
    const t1 = oc1 ? 30 : s.vista === 'corte' ? 8 : 0;
    const ocT = !s.techo || s.vista !== 'completa';
    const tT = ocT ? t1 + 28 : 0;
    pisos.y1 = st.current.y1;
    const gu = guias.current;
    if (gu) {
      const alto = st.current.y1;
      gu.visible = s.vista === 'corte' && alto > 0.6;
      gu.position.y = H0; gu.scale.y = Math.max(0.01, alto);
    }
    const e = st.current;
    let cambio = false;
    const mover = (clave, ref, objetivo, oculto, base) => {
      const g = ref.current;
      if (Math.abs(objetivo - e[clave]) > 0.003) {
        e[clave] += (objetivo - e[clave]) * k;
        if (Math.abs(objetivo - e[clave]) < 0.003) e[clave] = objetivo;
        g.position.y = base + e[clave]; g.updateMatrix(); cambio = true;
      }
      const vis = !(oculto && Math.abs(objetivo - e[clave]) < 0.8);
      if (g.visible !== vis) { g.visible = vis; cambio = true; }
    };
    mover('y1', g1, t1, oc1, Y1);
    mover('yT', gT, tT, ocT, 7.8);
    if (cambio) tocar();
  });
  return html`<${G}>
    <${PlantaBaja} />
    <group ref=${g1} position=${[0, Y1, 0]} matrixAutoUpdate=${false}><${PrimerPiso} /></group>
    <group ref=${gT} position=${[0, 7.8, 0]} matrixAutoUpdate=${false}><${Techo} /></group>
    <${Guias} refGrupo=${guias} />
    <${Zonas} planta="edif" />
  <//>`;
}
