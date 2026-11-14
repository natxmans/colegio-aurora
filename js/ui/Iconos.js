// =========================================================
// Iconos SVG (trazo fino) + ilustraciones de las asignaturas y del horario
// =========================================================
import { html } from '../lib.js';

const P = {
  inicio: 'M3 11l9-8 9 8M5 9.5V21h5v-6h4v6h5V9.5',
  corazon: 'M12 20.5s-7.5-4.6-9.2-9.4A5 5 0 0 1 12 6.6a5 5 0 0 1 9.2 4.5C19.5 15.9 12 20.5 12 20.5z',
  sofa: 'M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3M3 11a2 2 0 0 1 2 2v2h14v-2a2 2 0 0 1 4 0v5H1v-5a2 2 0 0 1 2-2zM5 18v2M19 18v2',
  descarga: 'M12 3v12M7 10l5 5 5-5M4 20h16',
  pantalla: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  salirPantalla: 'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5',
  diapo: 'M3 4h18v13H3zM8 21h8M12 17v4',
  cubo: 'M12 2.5l8.5 4.8v9.4L12 21.5l-8.5-4.8V7.3zM12 12l8.5-4.7M12 12v9.5M12 12L3.5 7.3',
  edificio: 'M3 21h18M5 21V8l7-4 7 4v13M9 21v-4h6v4M8 10h2M14 10h2M8 13.5h2M14 13.5h2',
  capas: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  baja: 'M12 3l9 5-9 5-9-5zM3 16l9 5 9-5',
  primer: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  corte: 'M4 7l8-4 8 4-8 4zM4 7v4l8 4 8-4V7M4 16l8 4 8-4M12 11v4',
  techo: 'M3 11l9-7 9 7M6 9.5V20h12V9.5',
  sol: 'M12 7a5 5 0 100 10 5 5 0 000-10zM12 1.5v2.5M12 20v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M1.5 12H4M20 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8',
  luna: 'M20 14.5A8.5 8.5 0 119.5 4a6.6 6.6 0 0010.5 10.5z',
  play: 'M7 4.5l12 7.5-12 7.5z',
  pausa: 'M7 4.5h3.5v15H7zM13.5 4.5H17v15h-3.5z',
  cerrar: 'M6 6l12 12M18 6L6 18',
  menu: 'M4 6.5h16M4 12h16M4 17.5h16',
  izq: 'M15 5l-7 7 7 7',
  der: 'M9 5l7 7-7 7',
  lista: 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
  ojo: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z',
  pin: 'M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21zM12 7.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z',
  cama: 'M3 19V7M3 14h18v5M21 14v-2a3 3 0 00-3-3h-7v5M6.5 11.5a1.5 1.5 0 100 .01',
  balon: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3v18M5.6 5.6c3.6 3.6 3.6 9.2 0 12.8M18.4 5.6c-3.6 3.6-3.6 9.2 0 12.8',
  libro: 'M4 4.5A1.5 1.5 0 015.5 3H20v15H5.5A1.5 1.5 0 004 19.5zM4 19.5A1.5 1.5 0 005.5 21H20',
  reloj: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3.5 2',
  camiseta: 'M8.5 3L3 6l2 4.5 2.5-1V21h9V9.5l2.5 1L21 6l-5.5-3c0 1.8-1.6 3-3.5 3s-3.5-1.2-3.5-3z',
  estrella: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  arbol: 'M12 21v-6M12 15a5.5 5.5 0 005.5-5.5A5.5 5.5 0 0012 4a5.5 5.5 0 00-5.5 5.5A5.5 5.5 0 0012 15z',
  hoja: 'M5 19C5 10 10 5 19 5c0 9-5 14-14 14zM5 19l8-8',
  raton: 'M12 3a5 5 0 015 5v8a5 5 0 01-10 0V8a5 5 0 015-5zM12 7v3',
  mano: 'M8 13V5.5a1.5 1.5 0 013 0V11M11 10.5V4a1.5 1.5 0 013 0v6.5M14 10.5V5.5a1.5 1.5 0 013 0V14a7 7 0 01-7 7 6 6 0 01-5.2-3L3.5 15a1.5 1.5 0 012.6-1.5L8 16',
  flecha: 'M5 12h14M13 6l6 6-6 6',
  arriba: 'M12 19V5M6 11l6-6 6 6',
  guia: 'M12 3a9 9 0 100 18 9 9 0 000-18zM10 8.5l5.5 3.5-5.5 3.5z',
  // Asignaturas
  mates: 'M3 13h3l3 7 5-16h7M14 9h5M16.5 6.5v5',
  frances: 'M12 2.5L8.2 21.5M12 2.5l3.8 19M9.6 14.5h4.8M10.6 9h2.8M6.5 21.5h11',
  ingles: 'M9 21.5V8l3-5 3 5v13.5M7 21.5h10M12 10.5a2 2 0 100 4 2 2 0 000-4z',
  historia: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3.5 12h17M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9M12 3C9.4 5.6 8.2 8.6 8.2 12s1.2 6.4 3.8 9',
  svt: 'M5 19C5 10 10 5 19 5c0 9-5 14-14 14zM5 19l8-8',
  fisica: 'M9 3h6M10 3v6l-5.2 9.2A2 2 0 006.5 21h11a2 2 0 001.7-2.8L14 9V3M7.2 15h9.6',
  tecno: 'M5 8.5h14v11H5zM12 4.5v4M12 3.5h.01M9.5 13.5h.01M14.5 13.5h.01M9.5 16.5h5M3 13h2M19 13h2',
  musica: 'M9 18V5l11-2v13M6 15a3 3 0 100 6 3 3 0 000-6zM17 13a3 3 0 100 6 3 3 0 000-6z',
  edfisica: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3v18M5.6 5.6c3.6 3.6 3.6 9.2 0 12.8M18.4 5.6c-3.6 3.6-3.6 9.2 0 12.8',
  // Horario
  despertar: 'M12 6a7 7 0 100 14 7 7 0 000-14zM12 9.5V13l2.5 1.5M4.5 4.5L2.5 6.5M19.5 4.5l2 2',
  clases: 'M3 4h18v12H3zM8 20l4-4 4 4M7 8.5h6M7 11.5h9',
  recreo: 'M12 21v-6M12 15a5.5 5.5 0 005.5-5.5A5.5 5.5 0 0012 4a5.5 5.5 0 00-5.5 5.5A5.5 5.5 0 0012 15z',
  comida: 'M7 3v7a2 2 0 004 0V3M9 12v9M17 3c-2 0-3 2-3 6s1 4 3 4v8',
  reanudar: 'M4 5.5A1.5 1.5 0 015.5 4H20v14H5.5A1.5 1.5 0 004 19.5zM4 19.5A1.5 1.5 0 005.5 21H20M9 9h7M9 12h5',
  fin: 'M6 7h12v14H6zM9 7V5a3 3 0 016 0v2M9 13h6',
  dormir: 'M20 14.5A8.5 8.5 0 119.5 4a6.6 6.6 0 0010.5 10.5zM16 3h4l-4 4h4',
  persona: 'M12 3.5a4 4 0 100 8 4 4 0 000-8zM4.5 20.5a7.5 7.5 0 0115 0',
  grupo: 'M9 4a3.2 3.2 0 100 6.4A3.2 3.2 0 009 4zM2.5 19a6.5 6.5 0 0113 0M16 5a3 3 0 010 6M18 13.5a5.5 5.5 0 013.5 5.5',
  chat: 'M4 5h16v11H9l-5 4zM8 9.5h8M8 12.5h5',
  rapido: 'M3 6l8 6-8 6zM12 6l8 6-8 6z',
  seguir: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 8a4 4 0 100 8 4 4 0 000-8zM12 1v4M12 19v4M1 12h4M19 12h4',
  ojoNo: 'M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A9.9 9.9 0 0112 5c6.4 0 10 7 10 7a17 17 0 01-3.2 4M6.6 6.6C3.9 8.4 2 12 2 12s3.6 7 10 7a9.6 9.6 0 004.4-1',
  enviar: 'M4 12l16-8-6 16-3-7z',
  ayuda: 'M12 3a9 9 0 100 18 9 9 0 000-18zM9.5 9a2.5 2.5 0 015 .5c0 1.7-2.5 2-2.5 3.5M12 17h.01',
  alerta: 'M12 3l10 18H2zM12 10v5M12 18h.01',
  residencia: 'M3 21h18M5 21V6h14v15M9 9h2M13 9h2M9 12.5h2M13 12.5h2M10 21v-4h4v4',
};

export function Icono({ n, size, className = '' }) {
  return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className=${className} width=${size} height=${size} aria-hidden="true"><path d=${P[n] || P.estrella} /></svg>`;
}

// Logo ORIGINAL del colegio (PNG cuadrado con fondo transparente: nunca se deforma)
export function Logo({ size = 36 }) {
  return html`<img src="img/logo-256.png" width=${size} height=${size} alt="Logo del Colegio Pablo Picasso" className="logo-img" style=${{ width: size + 'px', height: size + 'px', objectFit: 'contain' }} />`;
}

// --------- Ilustración de cada asignatura (tarjetas) ---------
const DECOR = {
  mates: ['π', '√x', 'a²+b²', '∑'], frances: ['Bonjour', 'Merci', 'Paris'], ingles: ['Hello', 'Thank you', 'London'],
  historia: ['1492', 'Roma', 'Egipto'], svt: ['ADN', 'Célula', 'CO₂'], fisica: ['H₂O', 'E=mc²', 'NaCl'],
  tecno: ['</>', 'PC', 'Web'], musica: ['♪', '♫', 'Do Re Mi'], edfisica: ['⚽', '🏀', '🏊'],
};
export function IlusMateria({ m }) {
  const d = DECOR[m.icono] || [];
  const id = 'g-' + m.id;
  return html`<svg viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id=${id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor=${m.color} stopOpacity=".55" /><stop offset="1" stopColor="#0a1236" /></linearGradient>
      <pattern id=${id + 'p'} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,.07)" /></pattern>
    </defs>
    <rect width="320" height="160" fill=${'url(#' + id + ')'} />
    <rect width="320" height="160" fill=${'url(#' + id + 'p)'} />
    <circle cx="250" cy="40" r="70" fill=${m.color} opacity=".18" />
    <circle cx="60" cy="150" r="50" fill="#c9a978" opacity=".14" />
    ${d.map((t, i) => html`<text key=${i} x=${30 + i * 92} y=${i % 2 ? 128 : 42} fill="#fff" opacity=".42" fontFamily="Space Grotesk, sans-serif" fontWeight="600" fontSize=${t.length > 4 ? 18 : 26}>${t}</text>`)}
    <g transform="translate(124 44) scale(3)" fill="none" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style=${{ filter: 'drop-shadow(0 0 6px ' + m.color + ')' }}>
      <path d=${P[m.icono]} />
    </g>
  </svg>`;
}

// --------- Ilustraciones de los momentos del día ---------
const pers = (x, y, c = '#16224f', piel = '#f1c8a5', pelo = '#3b2a1f', esc = 1) => html`<g transform=${`translate(${x} ${y}) scale(${esc})`}>
  <rect x="-9" y="-2" width="18" height="24" rx="8" fill=${c} />
  <rect x="-1" y="2" width="2" height="14" fill="#8f9ab3" /><circle cx="4" cy="4" r="2.2" fill="#ffffff" />
  <circle cx="0" cy="-12" r="9" fill=${piel} />
  <path d="M-9.5 -13 a9.5 9.5 0 0 1 19 0 q-9 -6 -19 0z" fill=${pelo} />
  <circle cx="-3" cy="-11" r="1.2" fill="#1d2233" /><circle cx="3" cy="-11" r="1.2" fill="#1d2233" />
</g>`;

export function IlusMomento({ icono, noche = false }) {
  const fondoA = noche ? '#0b1430' : '#14285a', fondoB = noche ? '#23305a' : '#3f6fb5';
  const id = 'm-' + icono;
  let esc = null;
  if (icono === 'despertar') esc = html`
    <rect x="200" y="30" width="90" height="70" rx="6" fill="#ffd9a0" opacity=".9" /><circle cx="245" cy="100" r="26" fill="#f59e0b" />
    <rect x="200" y="30" width="90" height="70" rx="6" fill="none" stroke="#fff" strokeWidth="4" /><path d="M245 30v70M200 65h90" stroke="#fff" strokeWidth="3" />
    <rect x="30" y="110" width="150" height="34" rx="8" fill="#e8edf5" /><rect x="30" y="92" width="14" height="52" rx="4" fill="#16224f" />
    <rect x="70" y="100" width="110" height="20" rx="8" fill="#2a62b8" /><rect x="46" y="98" width="30" height="14" rx="6" fill="#fff" />
    ${pers(120, 88)}
    <circle cx="180" cy="140" r="14" fill="#fff" /><text x="180" y="145" textAnchor="middle" fontSize="11" fontWeight="700" fill="#16224f" fontFamily="Orbitron">7:45</text>`;
  if (icono === 'clases') esc = html`
    <rect x="70" y="22" width="180" height="70" rx="8" fill="#0b1a44" stroke="#2a62b8" strokeWidth="3" />
    <text x="160" y="52" textAnchor="middle" fill="#fff" fontSize="18" fontFamily="Space Grotesk">a² + b² = c²</text>
    <text x="160" y="76" textAnchor="middle" fill="#e6d6b8" fontSize="14" fontFamily="Space Grotesk">π ≈ 3,14</text>
    ${[70, 160, 250].map((x, i) => html`<g key=${i}><rect x=${x - 32} y="135" width="64" height="8" rx="3" fill="#e8edf5" />${pers(x, 125, '#16224f', ['#f1c8a5', '#c98e66', '#f5d3b8'][i], ['#3b2a1f', '#151515', '#c08a45'][i])}</g>`)}`;
  if (icono === 'recreo') esc = html`
    <circle cx="270" cy="38" r="18" fill="#fde68a" /><rect x="0" y="130" width="320" height="30" fill="#79b35e" />
    <rect x="44" y="80" width="10" height="55" fill="#7a5a40" /><circle cx="49" cy="70" r="30" fill="#4f9e5b" />
    ${pers(130, 112)} ${pers(165, 112, '#16224f', '#c98e66', '#151515')}
    <circle cx="225" cy="128" r="11" fill="#fff" /><path d="M215 128h20M225 118v20" stroke="#16224f" strokeWidth="1.5" />
    <text x="250" y="105" fill="#fff" fontSize="14" fontFamily="Space Grotesk" fontWeight="600">20 min</text>`;
  if (icono === 'comida') esc = html`
    <rect x="30" y="110" width="260" height="14" rx="6" fill="#e8edf5" />
    <ellipse cx="160" cy="104" rx="60" ry="14" fill="#fff" /><ellipse cx="160" cy="100" rx="46" ry="10" fill="#e9a23b" />
    ${[0, 1, 2, 3, 4].map(i => html`<circle key=${i} cx=${130 + i * 15} cy=${98 + (i % 2) * 3} r="3.5" fill=${i % 2 ? '#ef4444' : '#22c55e'} />`)}
    <rect x="240" y="74" width="18" height="34" rx="4" fill="#bfe6ff" opacity=".9" />
    <path d="M70 70v20a5 5 0 0010 0V70M75 92v16" stroke="#fff" strokeWidth="3" fill="none" />
    <circle cx="275" cy="98" r="9" fill="#f97316" /><circle cx="290" cy="100" r="8" fill="#ef4444" />
    <text x="160" y="50" textAnchor="middle" fill="#fff" fontSize="16" fontFamily="Space Grotesk" fontWeight="600">¡Buen provecho!</text>`;
  if (icono === 'reanudar') esc = html`
    <rect x="90" y="60" width="140" height="80" rx="8" fill="#0b1a44" stroke="#c9a978" strokeWidth="3" />
    <path d="M110 85h60M110 100h90M110 115h40" stroke="#e6d6b8" strokeWidth="5" strokeLinecap="round" />
    <rect x="70" y="140" width="180" height="10" rx="4" fill="#e8edf5" />
    <rect x="250" y="90" width="40" height="10" rx="2" fill="#2a62b8" /><rect x="252" y="100" width="36" height="10" rx="2" fill="#b84a55" /><rect x="248" y="110" width="44" height="10" rx="2" fill="#d9a441" />
    <circle cx="50" cy="60" r="14" fill="#e6d6b8" opacity=".7" /><circle cx="50" cy="60" r="5" fill="#fff" />`;
  if (icono === 'fin') esc = html`
    <rect x="0" y="118" width="320" height="42" fill="#38bdf8" opacity=".85" />
    <path d="M0 125 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#fff" strokeWidth="3" fill="none" opacity=".7" />
    <rect x="200" y="50" width="90" height="56" fill="none" stroke="#fff" strokeWidth="4" /><path d="M200 50l10 10h70l10 -10M210 60v46M280 60v46" stroke="#fff" strokeWidth="1.5" opacity=".6" />
    ${pers(120, 100, '#2f6bff')}
    <circle cx="160" cy="106" r="10" fill="#fff" /><path d="M151 106h18M160 97v18" stroke="#16224f" strokeWidth="1.3" />`;
  if (icono === 'dormir') esc = html`
    ${[[40, 30], [80, 50], [130, 22], [180, 40], [300, 70], [250, 20]].map(([x, y], i) => html`<circle key=${i} cx=${x} cy=${y} r="2" fill="#fff" />`)}
    <path d="M285 30a22 22 0 10 0 40a17 17 0 01 0 -40z" fill="#fde68a" />
    <rect x="30" y="110" width="200" height="34" rx="8" fill="#e8edf5" /><rect x="30" y="88" width="16" height="56" rx="4" fill="#16224f" />
    <rect x="80" y="100" width="150" height="24" rx="10" fill="#c9a978" /><rect x="50" y="96" width="34" height="16" rx="6" fill="#fff" />
    <circle cx="68" cy="94" r="10" fill="#f1c8a5" /><path d="M58 92 a10 10 0 0 1 20 0z" fill="#3b2a1f" />
    <text x="110" y="70" fill="#c4b5fd" fontSize="22" fontFamily="Space Grotesk" fontWeight="700">Z z z</text>`;
  return html`<svg viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id=${id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor=${fondoA} /><stop offset="1" stopColor=${fondoB} /></linearGradient></defs>
    <rect width="320" height="160" fill=${'url(#' + id + ')'} />
    ${esc}
  </svg>`;
}
