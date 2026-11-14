// =========================================================
// Texturas dibujadas con <canvas> (no hace falta descargar imágenes)
// =========================================================
import { THREE } from '../lib3d.js';

const cache = new Map();
const F = '"Space Grotesk", "Segoe UI", Arial, sans-serif';
const FM = 'Orbitron, "Space Grotesk", Arial, sans-serif';

export function tex(clave, w, h, dibujar, repetir = null) {
  if (cache.has(clave)) return cache.get(clave);
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const g = cv.getContext('2d');
  dibujar(g, w, h);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repetir) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repetir); }
  cache.set(clave, t);
  return t;
}

function rnd(semilla) { let s = semilla * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
function rr(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
function texto(g, t, x, y, tam, color, peso = 600, alin = 'left', fuente = F, brillo = 0) {
  g.font = `${peso} ${tam}px ${fuente}`; g.textAlign = alin; g.textBaseline = 'middle';
  g.shadowColor = color; g.shadowBlur = brillo; g.fillStyle = color; g.fillText(t, x, y); g.shadowBlur = 0;
}
function fondoPantalla(g, w, h, a = '#0b1a44', b = '#13286a') {
  const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, a); gr.addColorStop(1, b);
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(120,170,255,0.08)'; g.lineWidth = 1;
  for (let x = 0; x < w; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  for (let y = 0; y < h; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
}
// Dibuja el logo ORIGINAL del colegio (PNG precargado en main.js), cuadrado: nunca se deforma
function logoA(g, cx, cy, r) {
  const img = window.__logoImg;
  if (img && img.complete) g.drawImage(img, cx - r, cy - r, 2 * r, 2 * r);
}

// ---------------- Pizarras digitales de cada asignatura ----------------
const PIZ = {
  mates: { t: 'Matemáticas', c: '#5aa2ff' },
  frances: { t: 'Francés · Frases útiles', c: '#8f9bff' },
  ingles: { t: 'Inglés · Vocabulario', c: '#ff7b8f' },
  historia: { t: 'Historia y geografía', c: '#ffc061' },
  svt: { t: 'Ciencias de la vida y de la Tierra', c: '#4ee6aa' },
  fisica: { t: 'Física y química', c: '#3ee6ff' },
  tecno: { t: 'Tecnología · Programación', c: '#b18cff' },
  musica: { t: 'Música', c: '#f39cff' },
};
export function texPizarra(m) {
  return tex('piz-' + m, 1024, 512, (g, w, h) => {
    fondoPantalla(g, w, h, '#071233', '#0f2560');
    const d = PIZ[m];
    rr(g, 24, 22, w - 48, 64, 14); g.fillStyle = 'rgba(255,255,255,0.06)'; g.fill();
    texto(g, d.t, 44, 54, 34, d.c, 700, 'left', F, 16);
    logoA(g, w - 70, 54, 26);
    g.strokeStyle = 'rgba(255,255,255,0.85)'; g.fillStyle = '#fff'; g.lineWidth = 4; g.lineCap = 'round';
    const L = (t, x, y, tam = 40, col = '#ffffff') => texto(g, t, x, y, tam, col, 500, 'left', F, 6);
    if (m === 'mates') {
      L('a² + b² = c²', 60, 150, 52, '#ffffff'); L('π ≈ 3,14', 60, 230); L('A = π · r²', 60, 300); L('2x + 5 = 17  →  x = 6', 60, 380, 38, '#9fd0ff');
      g.strokeStyle = '#5aa2ff'; g.beginPath(); g.moveTo(640, 420); g.lineTo(920, 420); g.lineTo(640, 170); g.closePath(); g.stroke();
      g.strokeRect(640, 390, 30, 30);
      texto(g, 'a', 612, 300, 34, '#fff'); texto(g, 'b', 770, 452, 34, '#fff'); texto(g, 'c', 800, 280, 34, '#ffd36b');
      g.strokeStyle = '#22d3ee'; g.beginPath(); g.arc(880, 200, 60, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.moveTo(880, 200); g.lineTo(940, 200); g.stroke();
      texto(g, 'r', 905, 185, 26, '#22d3ee');
    } else if (m === 'frances') {
      L('Bonjour  =  Hola', 60, 150, 46); L('Merci  =  Gracias', 60, 225, 46); L('Au revoir  =  Adiós', 60, 300, 46); L('J’aime lire  =  Me gusta leer', 60, 380, 40, '#c4cbff');
      g.fillStyle = '#2f4bd8'; g.fillRect(800, 160, 50, 120); g.fillStyle = '#ffffff'; g.fillRect(850, 160, 50, 120); g.fillStyle = '#e8414f'; g.fillRect(900, 160, 50, 120);
      texto(g, 'Francia', 875, 320, 30, '#fff', 600, 'center');
    } else if (m === 'ingles') {
      L('Hello  =  Hola', 60, 150, 46); L('Thank you  =  Gracias', 60, 225, 46); L('School  =  Colegio', 60, 300, 46); L('I like music = Me gusta la música', 60, 380, 36, '#ffc3cc');
      g.fillStyle = '#ff5d73'; rr(g, 800, 150, 150, 200, 18); g.fill(); g.fillStyle = 'rgba(255,255,255,.85)';
      for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) g.fillRect(818 + j * 62, 190 + i * 50, 52, 38);
      texto(g, 'London', 875, 390, 30, '#fff', 600, 'center');
    } else if (m === 'historia') {
      const eras = ['Prehistoria', 'Antigüedad', 'Edad Media', 'Edad Moderna', 'Edad Contemp.'];
      g.strokeStyle = '#ffc061'; g.beginPath(); g.moveTo(70, 220); g.lineTo(950, 220); g.stroke();
      eras.forEach((e, i) => { const x = 90 + i * 210; g.fillStyle = '#ffc061'; g.beginPath(); g.arc(x, 220, 12, 0, 7); g.fill(); texto(g, e, x, i % 2 ? 270 : 170, 26, '#fff', 500, 'center'); });
      L('La Edad Media: del siglo V al siglo XV', 60, 350, 34); L('Capital de España: Madrid', 60, 420, 34, '#ffe0a6');
    } else if (m === 'svt') {
      g.fillStyle = 'rgba(78,230,170,.18)'; g.strokeStyle = '#4ee6aa'; g.beginPath(); g.ellipse(250, 290, 180, 130, 0, 0, 7); g.fill(); g.stroke();
      g.fillStyle = 'rgba(177,140,255,.6)'; g.beginPath(); g.arc(240, 290, 50, 0, 7); g.fill();
      g.fillStyle = '#4ee6aa'; for (let i = 0; i < 7; i++) { g.beginPath(); g.ellipse(130 + i * 40, 200 + (i % 3) * 60 + 70, 16, 8, i, 0, 7); g.fill(); }
      texto(g, 'La célula', 250, 450, 30, '#fff', 600, 'center');
      L('Fotosíntesis:', 500, 180, 36, '#4ee6aa'); L('luz + agua + CO₂', 500, 240, 36); L('→  glucosa + O₂', 500, 300, 36); L('El corazón tiene 4 cavidades.', 500, 390, 30, '#bff5df');
    } else if (m === 'fisica') {
      L('H₂O = agua', 60, 160, 46); L('E = m · c²', 60, 240, 46); L('v = d / t', 60, 320, 46); L('NaCl = sal', 60, 400, 40, '#a8f3ff');
      g.strokeStyle = '#3ee6ff'; g.lineWidth = 3;
      for (let i = 0; i < 3; i++) { g.save(); g.translate(780, 280); g.rotate(i * Math.PI / 3); g.beginPath(); g.ellipse(0, 0, 150, 50, 0, 0, 7); g.stroke(); g.restore(); }
      g.fillStyle = '#ff7b8f'; g.beginPath(); g.arc(780, 280, 26, 0, 7); g.fill();
    } else if (m === 'tecno') {
      g.font = `500 34px Consolas, monospace`; g.textBaseline = 'middle';
      const cod = [['si (nota >= 5) {', '#ffffff', 0], ['aprobado();', '#3ee6ff', 1], ['} si no {', '#ffffff', 0], ['repasar();', '#3ee6ff', 1], ['}', '#ffffff', 0]];
      cod.forEach(([t, c, ind], i) => { g.fillStyle = c; g.fillText(t, 60 + ind * 44, 160 + i * 62); });
      g.strokeStyle = '#b18cff'; g.lineWidth = 3;
      g.strokeRect(700, 160, 220, 220); for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(700 + 22 + i * 44, 160); g.lineTo(700 + 22 + i * 44, 120); g.stroke(); g.beginPath(); g.moveTo(700 + 22 + i * 44, 380); g.lineTo(700 + 22 + i * 44, 420); g.stroke(); }
      texto(g, 'CPU', 810, 270, 54, '#b18cff', 700, 'center', FM, 14);
    } else if (m === 'musica') {
      g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 3;
      for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(60, 170 + i * 30); g.lineTo(960, 170 + i * 30); g.stroke(); }
      texto(g, '𝄞', 70, 230, 150, '#f39cff', 400);
      const notas = [290, 260, 245, 230, 215, 200, 185];
      notas.forEach((y, i) => { const x = 230 + i * 105; g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x, y, 17, 12, -0.4, 0, 7); g.fill(); g.beginPath(); g.moveTo(x + 15, y); g.lineTo(x + 15, y - 85); g.stroke(); });
      ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'].forEach((n, i) => texto(g, n, 230 + i * 105, 360, 32, '#f39cff', 600, 'center'));
      L('¡Nos encanta cantar juntos!', 60, 440, 34, '#ffd6ff');
    }
  });
}

// ---------------- Pósteres ----------------
export function texPoster(tipo) {
  return tex('pos-' + tipo, 512, 720, (g, w, h) => {
    const P = {
      pitagoras: ['#0d2a6b', '#3d8bff', 'Teorema de Pitágoras'], paris: ['#2a1b5e', '#f472b6', 'París'], londres: ['#3b0d1d', '#ff5d73', 'Londres'],
      celula: ['#06392b', '#34d399', 'La célula'], cuerpo: ['#0b2d3b', '#22d3ee', 'El cuerpo humano'], linea: ['#3a2606', '#f2a541', 'Grandes civilizaciones'],
      programacion: ['#1d0d4a', '#a78bfa', 'Aprende a programar'], espacio: ['#070b2a', '#8b5cf6', 'El espacio'], futbol: ['#05301c', '#22c55e', '¡Vamos, equipo!'],
      musica: ['#3a0b3f', '#e879f9', 'Concierto'], naturaleza: ['#0b3320', '#4ade80', 'La naturaleza'], espana: ['#3a0d12', '#f2c14e', 'España'],
    }[tipo] || ['#0d2a6b', '#3d8bff', tipo];
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, P[0]); gr.addColorStop(1, '#050816');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = P[1]; g.lineWidth = 6; g.strokeRect(14, 14, w - 28, h - 28);
    const cx = w / 2, cy = 300;
    g.strokeStyle = P[1]; g.fillStyle = P[1]; g.lineWidth = 6; g.lineCap = 'round'; g.lineJoin = 'round';
    g.shadowColor = P[1]; g.shadowBlur = 20;
    if (tipo === 'paris') {
      g.beginPath(); g.moveTo(cx - 120, 520); g.quadraticCurveTo(cx - 30, 330, cx - 8, 110); g.lineTo(cx + 8, 110); g.quadraticCurveTo(cx + 30, 330, cx + 120, 520); g.stroke();
      g.beginPath(); g.moveTo(cx - 70, 400); g.lineTo(cx + 70, 400); g.moveTo(cx - 40, 280); g.lineTo(cx + 40, 280); g.stroke();
      g.beginPath(); g.arc(cx, 520, 50, Math.PI, 0); g.stroke();
    } else if (tipo === 'londres') {
      g.strokeRect(cx - 50, 170, 100, 350); g.beginPath(); g.moveTo(cx - 50, 170); g.lineTo(cx, 90); g.lineTo(cx + 50, 170); g.stroke();
      g.beginPath(); g.arc(cx, 240, 34, 0, 7); g.stroke(); g.beginPath(); g.moveTo(cx, 240); g.lineTo(cx, 218); g.moveTo(cx, 240); g.lineTo(cx + 16, 248); g.stroke();
    } else if (tipo === 'pitagoras') {
      g.beginPath(); g.moveTo(140, 470); g.lineTo(380, 470); g.lineTo(140, 230); g.closePath(); g.stroke();
      g.globalAlpha = 0.25; g.fillRect(140, 470, 240, 120); g.fillRect(40, 230, 100, 240); g.globalAlpha = 1;
    } else if (tipo === 'celula') {
      g.beginPath(); g.ellipse(cx, cy, 170, 130, 0.3, 0, 7); g.stroke(); g.globalAlpha = 0.5; g.beginPath(); g.arc(cx - 20, cy, 50, 0, 7); g.fill(); g.globalAlpha = 1;
      for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(cx + Math.cos(i) * 110, cy + Math.sin(i * 1.7) * 70, 20, 9, i, 0, 7); g.stroke(); }
    } else if (tipo === 'cuerpo') {
      g.beginPath(); g.arc(cx, 150, 44, 0, 7); g.stroke(); g.beginPath(); g.moveTo(cx, 194); g.lineTo(cx, 380); g.moveTo(cx - 110, 260); g.lineTo(cx, 220); g.lineTo(cx + 110, 260);
      g.moveTo(cx, 380); g.lineTo(cx - 70, 540); g.moveTo(cx, 380); g.lineTo(cx + 70, 540); g.stroke();
      g.fillStyle = '#ff5d73'; g.beginPath(); g.arc(cx + 14, 260, 16, 0, 7); g.fill();
    } else if (tipo === 'linea') {
      g.beginPath(); g.moveTo(cx - 140, 460); g.lineTo(cx, 200); g.lineTo(cx + 140, 460); g.closePath(); g.stroke();
      for (let i = 0; i < 4; i++) { g.strokeRect(80 + i * 95, 500, 40, 60); }
    } else if (tipo === 'programacion') {
      g.font = '500 30px Consolas, monospace'; g.textAlign = 'left';
      ['<programa>', '  hola();', '  repetir(3);', '  saludar();', '</programa>'].forEach((t, i) => g.fillText(t, 70, 180 + i * 60));
    } else if (tipo === 'espacio') {
      g.beginPath(); g.arc(cx, cy, 90, 0, 7); g.stroke(); g.beginPath(); g.ellipse(cx, cy, 170, 40, -0.3, 0, 7); g.stroke();
      for (let i = 0; i < 40; i++) { g.fillRect((i * 97) % w, (i * 53) % 560 + 40, 3, 3); }
    } else if (tipo === 'futbol') {
      g.beginPath(); g.arc(cx, cy, 120, 0, 7); g.stroke();
      g.beginPath(); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; g.lineTo(cx + Math.cos(a) * 45, cy + Math.sin(a) * 45); } g.closePath(); g.fill();
    } else if (tipo === 'musica') {
      g.beginPath(); g.ellipse(cx - 60, 430, 50, 36, -0.4, 0, 7); g.fill(); g.beginPath(); g.ellipse(cx + 90, 390, 50, 36, -0.4, 0, 7); g.fill();
      g.fillRect(cx - 18, 160, 12, 270); g.fillRect(cx + 132, 120, 12, 270); g.fillRect(cx - 18, 140, 162, 30);
    } else if (tipo === 'espana') {
      g.beginPath(); g.ellipse(cx, 400, 180, 70, 0, Math.PI, 0); g.stroke(); g.beginPath(); g.moveTo(cx - 180, 400); g.quadraticCurveTo(cx, 120, cx + 180, 400); g.stroke();
      g.beginPath(); g.arc(cx + 100, 170, 40, 0, 7); g.fill();
    } else {
      g.beginPath(); g.moveTo(80, 500); for (let i = 0; i < 8; i++) g.lineTo(80 + i * 50, 500 - Math.sin(i) * 120 - 120); g.stroke();
      g.beginPath(); g.arc(380, 170, 50, 0, 7); g.fill();
    }
    g.shadowBlur = 0;
    texto(g, P[2], cx, 630, P[2].length > 18 ? 34 : 46, '#ffffff', 700, 'center', F, 10);
  });
}

// ---------------- Pantallas ----------------
export function texPantalla(tipo) {
  return tex('pan-' + tipo, 1024, 576, (g, w, h) => {
    fondoPantalla(g, w, h, '#071233', '#132b72');
    if (tipo === 'bienvenida') {
      logoA(g, w / 2, 170, 90);
      texto(g, '¡Bienvenidos!', w / 2, 330, 84, '#ffffff', 700, 'center', F, 24);
      texto(g, 'Estudiar · Convivir · Crecer', w / 2, 420, 38, '#e6d6b8', 500, 'center');
    } else if (tipo === 'menu') {
      texto(g, 'Menú del día', 60, 80, 60, '#ffb35c', 700, 'left', F, 14);
      ['Gazpacho andaluz', 'Paella de verduras', 'Tortilla de patatas', 'Fruta fresca', 'Agua y zumo natural'].forEach((t, i) => {
        g.fillStyle = '#ffb35c'; g.beginPath(); g.arc(80, 190 + i * 76, 9, 0, 7); g.fill(); texto(g, t, 110, 190 + i * 76, 44, '#ffffff', 500);
      });
      texto(g, '12:20', w - 60, 80, 54, '#7fdcff', 700, 'right', FM);
    } else if (tipo === 'codigo') {
      g.font = '500 30px Consolas, monospace'; g.textBaseline = 'middle';
      const r = rnd(4); const cols = ['#7fdcff', '#c4b5fd', '#ffffff', '#4ee6aa', '#ffd36b'];
      const pal = ['función', 'pantalla', 'avanzar()', 'girar(90)', 'si', 'repetir', 'variable', 'luz.encender()', 'sensor', 'mientras', '= 10', 'colegio', 'picasso'];
      for (let i = 0; i < 13; i++) {
        let lin = ''; const n = 2 + Math.floor(r() * 4);
        for (let k = 0; k < n; k++) lin += pal[Math.floor(r() * pal.length)] + ' ';
        g.fillStyle = cols[Math.floor(r() * cols.length)];
        g.fillText(lin, 40 + Math.floor(r() * 3) * 40, 40 + i * 37);
      }
      texto(g, 'Sala de informática', w - 40, h - 50, 40, '#7fdcff', 700, 'right', F, 12);
    } else if (tipo === 'juego') {
      const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#1b0b4a'); gr.addColorStop(1, '#ff4f9a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.fillStyle = '#ffd36b'; g.beginPath(); g.arc(w / 2, 300, 120, 0, 7); g.fill();
      g.strokeStyle = '#22d3ee'; g.lineWidth = 3; for (let i = 0; i < 12; i++) { g.beginPath(); g.moveTo(0, 380 + i * i * 2); g.lineTo(w, 380 + i * i * 2); g.stroke(); }
      for (let i = -10; i <= 10; i++) { g.beginPath(); g.moveTo(w / 2 + i * 20, 380); g.lineTo(w / 2 + i * 120, h); g.stroke(); }
      texto(g, 'NIVEL 3', w / 2, 80, 64, '#ffffff', 800, 'center', FM, 20);
    } else if (tipo === 'pelicula') {
      const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#5ec8ff'); gr.addColorStop(1, '#e6f6ff'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.fillStyle = '#2f7d4a'; g.beginPath(); g.moveTo(0, 400); g.quadraticCurveTo(300, 250, 600, 380); g.quadraticCurveTo(800, 460, w, 330); g.lineTo(w, h); g.lineTo(0, h); g.fill();
      g.fillStyle = '#ffffff'; g.beginPath(); g.arc(780, 140, 60, 0, 7); g.fill();
    } else if (tipo === 'marcador') {
      g.fillStyle = '#050816'; g.fillRect(0, 0, w, h);
      texto(g, 'LOCAL', 240, 110, 52, '#7fdcff', 700, 'center', FM); texto(g, 'VISITANTE', 784, 110, 52, '#ff7b8f', 700, 'center', FM);
      texto(g, '24', 240, 320, 220, '#22d3ee', 800, 'center', FM, 30); texto(g, '21', 784, 320, 220, '#ff5d73', 800, 'center', FM, 30);
      texto(g, '08:45', w / 2, 500, 70, '#ffd36b', 700, 'center', FM, 16);
    } else if (tipo === 'partido') {
      g.fillStyle = '#1f7a3d'; g.fillRect(0, 0, w, h); g.strokeStyle = '#fff'; g.lineWidth = 4;
      g.strokeRect(60, 60, w - 120, h - 120); g.beginPath(); g.moveTo(w / 2, 60); g.lineTo(w / 2, h - 60); g.stroke(); g.beginPath(); g.arc(w / 2, h / 2, 70, 0, 7); g.stroke();
      texto(g, '2 - 1', w / 2, 40, 34, '#fff', 700, 'center', FM);
    } else if (tipo === 'horario') {
      texto(g, 'Nuestro horario', 50, 70, 54, '#7fdcff', 700, 'left', F, 12);
      [['07:45', 'Los alumnos se despiertan.'], ['08:00', 'Empiezan las clases.'], ['10:00', 'Recreo de veinte minutos.'], ['12:20', 'Comemos en el comedor.'], ['14:00', 'Las clases vuelven a empezar.'], ['17:00', 'Terminan las clases.'], ['21:00', 'Los alumnos se acuestan.']]
        .forEach(([a, b], i) => { texto(g, a, 60, 150 + i * 60, 36, '#22d3ee', 700, 'left', FM); texto(g, b, 230, 150 + i * 60, 36, '#ffffff', 500); });
    } else if (tipo === 'biblioteca') {
      texto(g, 'Biblioteca digital', 50, 70, 58, '#e6d6b8', 700, 'left', F, 10);
      ['Buscar un libro', 'Libros digitales', 'Revistas', 'Ciencias', 'Historia', 'Novelas'].forEach((t, i) => {
        const x = 50 + (i % 3) * 315, y = 150 + Math.floor(i / 3) * 190;
        rr(g, x, y, 290, 160, 18); g.fillStyle = 'rgba(230,214,184,.14)'; g.fill();
        texto(g, t, x + 22, y + 80, 34, '#ffffff', 600);
      });
    } else if (tipo === 'mapa-campus') {
      texto(g, 'Colegio Pablo Picasso · Plano', 50, 60, 44, '#e6d6b8', 700);
      g.fillStyle = 'rgba(61,139,255,.6)'; g.fillRect(200, 200, 300, 110); g.fillStyle = 'rgba(52,211,153,.5)'; g.fillRect(200, 320, 300, 160);
      g.fillStyle = 'rgba(56,189,248,.6)'; g.fillRect(540, 190, 160, 120); g.fillStyle = 'rgba(14,165,233,.6)'; g.fillRect(540, 330, 160, 110);
      g.fillStyle = 'rgba(22,163,74,.6)'; g.fillRect(540, 90, 330, 90);
      texto(g, 'Usted está aquí', 350, 520, 30, '#ffd36b', 600, 'center');
    } else {
      texto(g, tipo, w / 2, h / 2, 60, '#fff', 700, 'center');
    }
  });
}

// ---------------- Cuadros abstractos (sala de arte) ----------------
export function texCuadro(semilla) {
  return tex('cua-' + semilla, 512, 512, (g, w, h) => {
    const r = rnd(semilla + 3);
    const pal = [['#ffe8d6', '#ff6b6b', '#4ecdc4', '#1a535c', '#ffe66d'], ['#0b132b', '#3a86ff', '#8338ec', '#ff006e', '#ffbe0b'], ['#f1faee', '#e63946', '#a8dadc', '#457b9d', '#1d3557'], ['#fefae0', '#606c38', '#283618', '#dda15e', '#bc6c25']][semilla % 4];
    g.fillStyle = pal[0]; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 14; i++) {
      g.fillStyle = pal[1 + Math.floor(r() * 4)]; g.globalAlpha = 0.6 + r() * 0.4;
      const t = r();
      if (t < 0.4) { g.beginPath(); g.arc(r() * w, r() * h, 30 + r() * 110, 0, 7); g.fill(); }
      else if (t < 0.75) { g.save(); g.translate(r() * w, r() * h); g.rotate(r() * 3); g.fillRect(-60, -20, 120 + r() * 140, 30 + r() * 60); g.restore(); }
      else { g.lineWidth = 8 + r() * 20; g.strokeStyle = g.fillStyle; g.beginPath(); g.moveTo(r() * w, r() * h); g.bezierCurveTo(r() * w, r() * h, r() * w, r() * h, r() * w, r() * h); g.stroke(); }
    }
    g.globalAlpha = 1;
  });
}

// ---------------- Lomos de libros (estanterías) ----------------
export function texLomos(semilla = 1, niveles = 5) {
  return tex('lom-' + semilla + '-' + niveles, 512, 640, (g, w, h) => {
    g.fillStyle = '#1a2240'; g.fillRect(0, 0, w, h);
    const r = rnd(semilla * 7 + 1);
    const cols = ['#3d8bff', '#22d3ee', '#8b5cf6', '#f472b6', '#34d399', '#fbbf24', '#fb7185', '#e2e8f0', '#1e3a8a', '#f97316', '#14b8a6', '#c084fc'];
    const fila = h / niveles;
    for (let n = 0; n < niveles; n++) {
      let x = 6; const base = (n + 1) * fila - 8;
      while (x < w - 10) {
        const bw = 10 + r() * 16, bh = fila * (0.55 + r() * 0.35);
        if (r() < 0.06) { x += 20; continue; }
        const c = cols[Math.floor(r() * cols.length)];
        g.fillStyle = c; g.fillRect(x, base - bh, bw, bh);
        g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x + 2, base - bh + 8, bw - 4, 3); g.fillRect(x + 2, base - 16, bw - 4, 3);
        g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x + bw - 2, base - bh, 2, bh);
        x += bw + 1;
      }
    }
  });
}

// ---------------- Rótulos ----------------
export function texRotulo(t, sub = '', color = '#22d3ee') {
  return tex('rot-' + t + sub, 1024, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    logoA(g, 110, h / 2, 90, color);
    texto(g, t, 220, sub ? 105 : h / 2, 86, '#ffffff', 800, 'left', FM, 26);
    if (sub) texto(g, sub, 224, 190, 38, color, 500, 'left', F, 10);
  });
}
export function texCartel(t, color = '#c9a978', fondo = 'rgba(20,40,90,0.95)') {
  return tex('car-' + t + color, 512, 160, (g, w, h) => {
    g.fillStyle = fondo; rr(g, 0, 0, w, h, 28); g.fill();
    g.strokeStyle = color; g.lineWidth = 6; rr(g, 6, 6, w - 12, h - 12, 24); g.stroke();
    texto(g, t, w / 2, h / 2 + 2, t.length > 14 ? 46 : 60, '#ffffff', 700, 'center', F, 12);
  });
}
// Logo ORIGINAL (PNG con fondo transparente) como textura 3D
let _logo = null;
export function texLogo() {
  if (!_logo) {
    _logo = new THREE.TextureLoader().load('img/logo-512.png');
    _logo.colorSpace = THREE.SRGBColorSpace;
    _logo.anisotropy = 8;
  }
  return _logo;
}
// Rótulo solo con texto (fondo transparente)
export function texRotuloTexto(t, color = '#14285a') {
  return tex('rtx-' + t + color, 1600, 190, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    // el texto se reduce si es largo, para que nunca se corte
    const fuente = '"Playfair Display", Georgia, serif';
    g.font = `700 120px ${fuente}`;
    const tam = Math.min(120, 120 * (w * 0.95) / Math.max(1, g.measureText(t).width));
    texto(g, t, w / 2, h / 2 + 4, tam, color, 700, 'center', fuente);
  });
}
export function texCruz() {
  return tex('cruz', 256, 256, (g, w, h) => {
    g.fillStyle = '#ffffff'; rr(g, 0, 0, w, h, 30); g.fill();
    g.fillStyle = '#16a34a'; g.fillRect(96, 36, 64, 184); g.fillRect(36, 96, 184, 64);
  });
}
export function texBandera(tipo) {
  return tex('ban-' + tipo, 384, 256, (g, w, h) => {
    if (tipo === 'es') {
      g.fillStyle = '#c60b1e'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffc400'; g.fillRect(0, h / 4, w, h / 2);
    } else if (tipo === 'eu') {
      g.fillStyle = '#003399'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffcc00';
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2, x = w / 2 + Math.cos(a) * 80, y = h / 2 + Math.sin(a) * 80;
        g.beginPath(); for (let k = 0; k < 10; k++) { const r = k % 2 ? 6 : 14, b = -Math.PI / 2 + (k * Math.PI) / 5; g.lineTo(x + Math.cos(b) * r, y + Math.sin(b) * r); } g.fill();
      }
    } else {
      g.fillStyle = '#14285a'; g.fillRect(0, 0, w, h); logoA(g, w / 2, h / 2, 105);
    }
  });
}

// ---------------- Mapa del mundo (estilizado) ----------------
const CONTINENTES = [
  [[0.08, 0.2], [0.2, 0.12], [0.3, 0.16], [0.28, 0.3], [0.22, 0.42], [0.17, 0.45], [0.12, 0.33], [0.06, 0.28]],
  [[0.23, 0.5], [0.3, 0.5], [0.34, 0.6], [0.3, 0.78], [0.26, 0.86], [0.24, 0.7], [0.22, 0.58]],
  [[0.45, 0.17], [0.55, 0.12], [0.6, 0.2], [0.55, 0.3], [0.48, 0.32], [0.45, 0.25]],
  [[0.46, 0.36], [0.56, 0.34], [0.6, 0.45], [0.57, 0.62], [0.52, 0.72], [0.49, 0.6], [0.44, 0.46]],
  [[0.58, 0.14], [0.75, 0.1], [0.9, 0.18], [0.88, 0.3], [0.8, 0.42], [0.7, 0.45], [0.62, 0.36], [0.6, 0.24]],
  [[0.8, 0.62], [0.9, 0.6], [0.93, 0.7], [0.86, 0.76], [0.79, 0.71]],
];
function dibujarContinentes(g, w, h, color) {
  g.fillStyle = color;
  for (const c of CONTINENTES) {
    g.beginPath(); c.forEach(([x, y], i) => { const px = x * w, py = y * h; i ? g.lineTo(px, py) : g.moveTo(px, py); }); g.closePath(); g.fill();
  }
}
export function texMapa() {
  return tex('mapa', 1024, 576, (g, w, h) => {
    g.fillStyle = '#0d3b78'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 2;
    for (let i = 1; i < 12; i++) { g.beginPath(); g.moveTo((i * w) / 12, 0); g.lineTo((i * w) / 12, h); g.stroke(); }
    for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(0, (i * h) / 6); g.lineTo(w, (i * h) / 6); g.stroke(); }
    dibujarContinentes(g, w, h, '#f2c46d');
    g.fillStyle = '#ff5d73'; g.beginPath(); g.arc(0.465 * w, 0.27 * h, 9, 0, 7); g.fill();
    texto(g, 'España', 0.465 * w - 10, 0.27 * h + 26, 24, '#fff', 700, 'right');
    texto(g, 'Mapa del mundo', w / 2, h - 34, 40, '#ffffff', 700, 'center', F, 10);
  });
}
export function texGlobo() {
  return tex('globo', 1024, 512, (g, w, h) => {
    g.fillStyle = '#1565c0'; g.fillRect(0, 0, w, h);
    dibujarContinentes(g, w, h, '#4caf50');
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, 22); g.fillRect(0, h - 22, w, 22);
  });
}
export function texTabla() {
  return tex('tabla', 1024, 640, (g, w, h) => {
    g.fillStyle = '#081633'; g.fillRect(0, 0, w, h);
    texto(g, 'Tabla periódica de los elementos', w / 2, 48, 42, '#ffffff', 700, 'center', F, 10);
    const cw = 50, ch = 62, ox = 62, oy = 100;
    const cols = ['#ff7b8f', '#ffb35c', '#ffd36b', '#4ee6aa', '#3ee6ff', '#5aa2ff', '#b18cff', '#f39cff'];
    const sym = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr'.split(' ');
    let k = 0;
    for (let f = 0; f < 7; f++) for (let c = 0; c < 18; c++) {
      let ok = true;
      if (f === 0) ok = c === 0 || c === 17;
      else if (f < 3) ok = c < 2 || c > 11;
      if (!ok) continue;
      const col = c < 2 ? cols[0] : c > 11 ? cols[3 + Math.min(4, c - 12)] : cols[2];
      g.fillStyle = col; g.globalAlpha = 0.85; g.fillRect(ox + c * cw, oy + f * ch, cw - 4, ch - 4); g.globalAlpha = 1;
      if (k < sym.length) texto(g, sym[k++], ox + c * cw + (cw - 4) / 2, oy + f * ch + (ch - 4) / 2, 20, '#0a1030', 700, 'center');
    }
  });
}

// ---------------- Pistas deportivas ----------------
export function texCampoFutbol() {
  return tex('campo', 1024, 640, (g, w, h) => {
    for (let i = 0; i < 12; i++) { g.fillStyle = i % 2 ? '#3f9a4c' : '#46a655'; g.fillRect((i * w) / 12, 0, w / 12 + 1, h); }
    g.strokeStyle = '#ffffff'; g.lineWidth = 6; const m = 24;
    g.strokeRect(m, m, w - 2 * m, h - 2 * m);
    g.beginPath(); g.moveTo(w / 2, m); g.lineTo(w / 2, h - m); g.stroke();
    g.beginPath(); g.arc(w / 2, h / 2, 80, 0, 7); g.stroke();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(w / 2, h / 2, 7, 0, 7); g.fill();
    for (const s of [1, -1]) {
      const x = s > 0 ? m : w - m;
      g.strokeRect(s > 0 ? x : x - 150, h / 2 - 180, 150, 360);
      g.strokeRect(s > 0 ? x : x - 55, h / 2 - 85, 55, 170);
      g.beginPath(); g.arc(x + s * 105, h / 2, 7, 0, 7); g.fill();
      g.beginPath(); g.arc(x + s * 105, h / 2, 80, s > 0 ? -0.93 : Math.PI - 0.93, s > 0 ? 0.93 : Math.PI + 0.93); g.stroke();
    }
  });
}
export function texPistaBasket() {
  return tex('basket', 1024, 548, (g, w, h) => {
    g.fillStyle = '#2f6bff'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#1e3a8a'; g.fillRect(30, h / 2 - 90, 210, 180); g.fillRect(w - 240, h / 2 - 90, 210, 180);
    g.strokeStyle = '#ffffff'; g.lineWidth = 6; g.strokeRect(30, 30, w - 60, h - 60);
    g.beginPath(); g.moveTo(w / 2, 30); g.lineTo(w / 2, h - 30); g.stroke();
    g.beginPath(); g.arc(w / 2, h / 2, 66, 0, 7); g.stroke();
    g.strokeRect(30, h / 2 - 90, 210, 180); g.strokeRect(w - 240, h / 2 - 90, 210, 180);
    g.beginPath(); g.arc(240, h / 2, 66, -Math.PI / 2, Math.PI / 2); g.stroke(); g.beginPath(); g.arc(w - 240, h / 2, 66, Math.PI / 2, Math.PI * 1.5); g.stroke();
    g.beginPath(); g.arc(80, h / 2, 230, -1.25, 1.25); g.stroke(); g.beginPath(); g.arc(w - 80, h / 2, 230, Math.PI - 1.25, Math.PI + 1.25); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.18)'; logoA(g, w / 2, h / 2, 40, '#22d3ee');
  });
}
export function texPistaGym() {
  return tex('gym', 1024, 640, (g, w, h) => {
    g.fillStyle = '#d6a76b'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 40; i++) { g.fillStyle = i % 2 ? 'rgba(0,0,0,.035)' : 'rgba(255,255,255,.04)'; g.fillRect(0, (i * h) / 40, w, h / 40); }
    g.fillStyle = '#3d5bd9'; g.fillRect(60, 60, w - 120, h - 120);
    g.fillStyle = '#8b5cf6'; g.fillRect(60, h / 2 - 110, 160, 220); g.fillRect(w - 220, h / 2 - 110, 160, 220);
    g.strokeStyle = '#fff'; g.lineWidth = 6; g.strokeRect(60, 60, w - 120, h - 120);
    g.beginPath(); g.moveTo(w / 2, 60); g.lineTo(w / 2, h - 60); g.stroke(); g.beginPath(); g.arc(w / 2, h / 2, 80, 0, 7); g.stroke();
    g.strokeStyle = '#ffd36b'; g.lineWidth = 4; g.strokeRect(w / 2 - 260, 120, 520, h - 240);
    g.beginPath(); g.moveTo(w / 2 - 90, 120); g.lineTo(w / 2 - 90, h - 120); g.moveTo(w / 2 + 90, 120); g.lineTo(w / 2 + 90, h - 120); g.stroke();
    logoA(g, w / 2, h / 2, 46);
  });
}
export function texPadel() {
  return tex('padel', 512, 1024, (g, w, h) => {
    g.fillStyle = '#1d4ed8'; g.fillRect(0, 0, w, h); g.fillStyle = '#2563eb'; g.fillRect(20, 20, w - 40, h - 40);
    g.strokeStyle = '#fff'; g.lineWidth = 7; g.strokeRect(20, 20, w - 40, h - 40);
    g.beginPath(); g.moveTo(20, h / 2); g.lineTo(w - 20, h / 2); g.stroke();
    g.beginPath(); g.moveTo(20, 170); g.lineTo(w - 20, 170); g.moveTo(20, h - 170); g.lineTo(w - 20, h - 170); g.moveTo(w / 2, 170); g.lineTo(w / 2, h - 170); g.stroke();
  });
}
export function texPiscinaFondo() {
  return tex('piscina', 1024, 512, (g, w, h) => {
    g.fillStyle = '#29a9e6'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2;
    for (let x = 0; x < w; x += 20) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    for (let y = 0; y < h; y += 20) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    g.fillStyle = '#1e3a8a';
    for (let i = 0; i < 5; i++) { const y = ((i + 0.5) * h) / 5; g.fillRect(40, y - 6, w - 80, 12); g.fillRect(40, y - 26, 12, 52); g.fillRect(w - 52, y - 26, 12, 52); }
  });
}
export function texPista() {
  return tex('pista-atl', 64, 512, (g, w, h) => {
    g.fillStyle = '#c4553d'; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(255,255,255,.9)'; for (let i = 0; i <= 6; i++) g.fillRect(0, (i * h) / 6 - 2, w, 4);
  }, [40, 1]);
}

// ---------------- Césped y adoquines (texturas que se repiten) ----------------
export function texCesped() {
  return tex('cesped', 256, 256, (g, w, h) => {
    g.fillStyle = '#8fb86f'; g.fillRect(0, 0, w, h);
    const r = rnd(7);
    for (let i = 0; i < 2600; i++) {
      const v = r();
      g.fillStyle = v < 0.33 ? 'rgba(70,110,50,.35)' : v < 0.66 ? 'rgba(160,200,120,.3)' : 'rgba(110,150,80,.35)';
      g.fillRect(r() * w, r() * h, 1 + r() * 2, 2 + r() * 4);
    }
  }, [1, 1]);
}
export function texAdoquin() {
  return tex('adoquin', 256, 256, (g, w, h) => {
    g.fillStyle = '#d8ccb4'; g.fillRect(0, 0, w, h);
    const r = rnd(11);
    for (let y = 0; y < h; y += 32) for (let x = (y / 32) % 2 ? -32 : 0; x < w; x += 64) {
      const t = 205 + Math.floor(r() * 30);
      g.fillStyle = `rgb(${t},${t - 10},${t - 30})`; g.fillRect(x + 1, y + 1, 62, 30);
    }
  }, [1, 1]);
}
