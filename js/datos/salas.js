// =========================================================
// COLEGIO PABLO PICASSO · todos los espacios del campus
// (fiel al PowerPoint: aulas, laboratorios, biblioteca digital, comedor,
//  dormitorios, salones, gimnasio, campo de fútbol, baloncesto,
//  piscina olímpica cubierta, jardines y patios)
// Coordenadas en metros. x: oeste→este, z: norte→sur, y: altura.
// Edificio principal: x de -32 a 32, z de -11 a 11. Pasillo: z de -2 a 2.
// =========================================================

export const Y1 = 4.2;   // altura del suelo del primer piso
export const H0 = 3.8;   // altura de la planta baja
export const H1 = 3.6;   // altura del primer piso

export const ZONAS = {
  baja: { titulo: 'Planta baja', sub: 'Aulas, laboratorios, biblioteca y comedor', color: '#1f4e9a' },
  primer: { titulo: 'Primer piso', sub: 'Dormitorios y salones', color: '#6b5a8e' },
  deporte: { titulo: 'Complejo deportivo', sub: 'Deporte y salud', color: '#2a7ab0' },
  exterior: { titulo: 'Exteriores', sub: 'Patios y jardines', color: '#4f8a4a' },
  edif: { titulo: 'Edificio principal', sub: 'Dos plantas', color: '#14285a' },
};

// Caja que contiene todo el campus (para encuadrar la cámara)
// Campus COMPACTO: los edificios ocupan la mayor parte del terreno
export const CAMPUS = { x0: -52, x1: 74, z0: -70, z1: 50, y0: 0, y1: 12 };

const L = [];
function sala(o) {
  const z0 = o.fila === 'norte' ? -11 : 2;
  const z1 = o.fila === 'norte' ? -2 : 11;
  const s = { z0, z1, y: o.planta === 'primer' ? Y1 : 0, h: o.planta === 'primer' ? H1 : H0, ...o };
  L.push(s);
  return s;
}
function zona(o) { const s = { y: 0, ...o }; L.push(s); return s; }

// ---------------- PLANTA BAJA · AULAS Y LABORATORIOS (fila norte) ----------------
const AZUL = '#1f4e9a', MARINO = '#14285a', ARENA = '#c9a978';
sala({ id: 'mates', planta: 'baja', fila: 'norte', x0: -32, x1: -24, tipo: 'aula', materia: 'mates', color: '#2a62b8',
  nombre: 'Aula de matemáticas', corto: 'Matemáticas',
  desc: 'En esta aula estudiamos matemáticas. Hay mesas individuales y ordenadores. En la pizarra digital hay fórmulas.',
  hay: ['la pizarra digital', 'las mesas', 'los ordenadores', 'las sillas', 'las figuras geométricas'] });
sala({ id: 'frances', planta: 'baja', fila: 'norte', x0: -24, x1: -16, tipo: 'aula', materia: 'frances', color: '#3b5fa8',
  nombre: 'Aula de francés', corto: 'Francés',
  desc: 'Aquí aprendemos francés. Leemos, escribimos y hablamos mucho. Hay una pequeña Torre Eiffel.',
  hay: ['la pizarra digital', 'los ordenadores', 'los libros', 'la Torre Eiffel', 'el póster de París'] });
sala({ id: 'ingles', planta: 'baja', fila: 'norte', x0: -16, x1: -8, tipo: 'aula', materia: 'ingles', color: '#b84a55',
  nombre: 'Aula de inglés', corto: 'Inglés',
  desc: 'En el aula de inglés hablamos y cantamos en inglés. Hay una cabina de teléfono roja de Londres.',
  hay: ['la pizarra digital', 'los ordenadores', 'la cabina roja', 'el Big Ben', 'el póster de Londres'] });
sala({ id: 'historia', planta: 'baja', fila: 'norte', x0: -8, x1: 0, tipo: 'aula', materia: 'historia', color: '#b9863b',
  nombre: 'Aula de historia y geografía', corto: 'Historia',
  desc: 'Aquí estudiamos el pasado y los países del mundo. Hay un gran mapa, un globo terráqueo y una pirámide.',
  hay: ['el mapa del mundo', 'el globo terráqueo', 'la pirámide', 'las columnas romanas', 'los ordenadores'] });
sala({ id: 'svt', planta: 'baja', fila: 'norte', x0: 0, x1: 8, tipo: 'aula', materia: 'svt', color: '#3f8a5a',
  nombre: 'Laboratorio de ciencias de la vida y de la Tierra', corto: 'Laboratorio de ciencias',
  desc: 'Es un laboratorio de ciencias de la vida y de la Tierra. Observamos las plantas y los animales con el microscopio.',
  hay: ['los microscopios', 'el acuario', 'las plantas', 'el modelo de ADN', 'los ordenadores'] });
sala({ id: 'fisica', planta: 'baja', fila: 'norte', x0: 8, x1: 16, tipo: 'aula', materia: 'fisica', color: '#2a7ab0',
  nombre: 'Laboratorio de física y química', corto: 'Laboratorio de física',
  desc: 'En el laboratorio hacemos experimentos con mucho cuidado. Hay tubos de ensayo, una tabla periódica y un átomo.',
  hay: ['los tubos de ensayo', 'la tabla periódica', 'el átomo', 'la vitrina', 'los ordenadores'] });
sala({ id: 'tecno', planta: 'baja', fila: 'norte', x0: 16, x1: 24, tipo: 'aula', materia: 'tecno', color: '#5b5fa8',
  nombre: 'Aula de tecnología', corto: 'Tecnología',
  desc: 'En el aula de tecnología usamos los ordenadores y hacemos proyectos en equipo.',
  hay: ['los ordenadores', 'la pizarra digital', 'las mesas', 'las herramientas', 'los proyectos'] });
sala({ id: 'musica', planta: 'baja', fila: 'norte', x0: 24, x1: 32, tipo: 'aula', materia: 'musica', color: '#8a4f8f',
  nombre: 'Aula de música', corto: 'Música',
  desc: 'Nos encanta el aula de música. Hay un piano, una batería y guitarras. Cantamos y tocamos juntos.',
  hay: ['el piano', 'la batería', 'las guitarras', 'los altavoces', 'el atril'] });

// ---------------- PLANTA BAJA · BIBLIOTECA, ENTRADA Y COMEDOR (fila sur) ----------------
sala({ id: 'biblioteca', planta: 'baja', fila: 'sur', x0: -32, x1: -4, tipo: 'biblioteca', color: ARENA,
  nombre: 'Biblioteca digital', corto: 'Biblioteca digital',
  desc: 'La biblioteca digital es un lugar tranquilo. Hay libros en papel, libros digitales, ordenadores y mesas para estudiar.',
  hay: ['las estanterías', 'los libros', 'los ordenadores', 'las mesas de estudio', 'los sillones'] });
sala({ id: 'entrada', planta: 'baja', fila: 'sur', x0: -4, x1: 4, tipo: 'recepcion', color: MARINO,
  nombre: 'Entrada', corto: 'Entrada',
  desc: 'Aquí recibimos a las familias y a los visitantes. La escalera sube al primer piso, donde están los dormitorios.',
  hay: ['la escalera', 'el logo del colegio', 'el mostrador', 'los sofás', 'las plantas'] });
sala({ id: 'comedor', planta: 'baja', fila: 'sur', x0: 4, x1: 32, tipo: 'comedor', color: '#b9863b',
  nombre: 'Comedor', corto: 'Comedor',
  desc: 'A las doce y veinte comemos en el comedor. Es muy grande y la comida es sana y equilibrada.',
  hay: ['el autoservicio', 'las mesas', 'las bandejas', 'el menú del día', 'la fruta'] });

// ---------------- PRIMER PISO · DORMITORIOS Y SALONES ----------------
const COL_HAB = ['#2a62b8', '#14285a', '#b9863b', '#3b5fa8'];
const DESC_HAB = [
  'Es una habitación para dos alumnos. Hay dos camas individuales, dos escritorios y dos armarios.',
  'En esta habitación duermen dos alumnos. Cada uno tiene su cama, su escritorio y su armario.',
  'Es una habitación luminosa con una gran ventana y un balcón. Aquí los alumnos estudian y duermen.',
];
const HAY_HAB = ['dos camas individuales', 'dos escritorios', 'dos armarios', 'dos sillas', 'las lámparas'];
for (let i = 0; i < 10; i++) {
  const n = 101 + i;
  sala({ id: 'hab' + n, planta: 'primer', fila: 'norte', x0: -32 + i * 6.4, x1: -32 + (i + 1) * 6.4, tipo: 'habitacion', num: n, color: COL_HAB[i % 4],
    nombre: 'Habitación ' + n, corto: String(n), desc: DESC_HAB[i % 3], hay: HAY_HAB });
}
[[-32, -25.2], [-25.2, -18.4], [-18.4, -11.6], [-11.6, -4], [20, 26], [26, 32]].forEach(([x0, x1], i) => {
  const n = 111 + i;
  sala({ id: 'hab' + n, planta: 'primer', fila: 'sur', x0, x1, tipo: 'habitacion', num: n, color: COL_HAB[(i + 1) % 4],
    nombre: 'Habitación ' + n, corto: String(n), desc: DESC_HAB[(i + 1) % 3], hay: HAY_HAB });
});
sala({ id: 'salon1', planta: 'primer', fila: 'sur', x0: -4, x1: 4, tipo: 'descanso', color: '#4f8a4a',
  nombre: 'Salón de descanso', corto: 'Salón de descanso',
  desc: 'Es un salón tranquilo con sofás, cojines y plantas para descansar. Aquí llega la escalera.',
  hay: ['la escalera', 'los sofás', 'los cojines', 'las plantas', 'la estantería'] });
sala({ id: 'salon2', planta: 'primer', fila: 'sur', x0: 4, x1: 20, tipo: 'salon', color: '#6b5a8e',
  nombre: 'Salón común', corto: 'Salón común',
  desc: 'En el salón común hay sofás, una televisión y mesas. Por la tarde, descansamos y hablamos con los amigos.',
  hay: ['los sofás', 'la televisión', 'las mesas', 'los libros', 'las plantas'] });

// ---------------- EDIFICIO (vista completa) ----------------
zona({ id: 'edificio', planta: 'edif', x0: -32, x1: 32, z0: -11, z1: 11, h: 8.3, color: MARINO,
  nombre: 'Edificio principal', corto: 'Edificio principal',
  desc: 'Es un edificio moderno de dos plantas. En la planta baja están las aulas, los laboratorios, la biblioteca y el comedor. En el primer piso están los dormitorios y los salones.',
  hay: ['la planta baja', 'el primer piso', 'las grandes ventanas', 'los balcones', 'los paneles solares'],
  cam: { pos: [-30, 30, 50], mira: [0, 3, 0] } });

// ---------------- COMPLEJO DEPORTIVO ----------------
zona({ id: 'gimnasio', planta: 'deporte', x0: 35, x1: 63, z0: -12, z1: 12, h: 10, color: '#2a7ab0',
  nombre: 'Gimnasio', corto: 'Gimnasio',
  desc: 'Tenemos un gran gimnasio cubierto y moderno. Hacemos educación física, gimnasia y deportes de equipo.',
  hay: ['la pista', 'las canastas', 'las gradas', 'las colchonetas', 'el marcador'],
  cam: { pos: [57, 30, 34], mira: [49, 1, -1] }, interior: { ojo: [37.5, 4, 9], mira: [50, 1.5, -1] } });
zona({ id: 'piscina', planta: 'deporte', x0: 10, x1: 70, z0: 15, z1: 45, h: 12, color: '#1f7ab8',
  nombre: 'Piscina olímpica', corto: 'Piscina olímpica',
  desc: 'Hay una piscina olímpica cubierta y climatizada de cincuenta metros. ¡Podemos nadar todo el año!',
  hay: ['la piscina', 'las calles', 'las gradas', 'el techo de cristal', 'el socorrista'],
  cam: { pos: [40, 36, 70], mira: [40, 0, 30] }, interior: { ojo: [13, 3.5, 25], mira: [44, 0, 31] } });
zona({ id: 'baloncesto', planta: 'deporte', x0: 35, x1: 65, z0: -37, z1: -17, h: 4, color: '#c46a2e',
  nombre: 'Cancha de baloncesto', corto: 'Baloncesto',
  desc: 'En la cancha de baloncesto jugamos en equipo durante el recreo y después de las clases.',
  hay: ['las canastas', 'la cancha', 'el balón', 'los bancos'],
  cam: { pos: [50, 22, -2], mira: [50, 0, -27] } });
zona({ id: 'futbol', planta: 'deporte', x0: -35, x1: 33, z0: -67, z1: -15, h: 4, color: '#3f8a4a',
  nombre: 'Campo de fútbol', corto: 'Campo de fútbol',
  desc: 'Jugamos al fútbol en un gran campo de césped. Hay porterías y gradas para mirar los partidos.',
  hay: ['el césped', 'las porterías', 'las gradas', 'el balón', 'los focos'],
  cam: { pos: [-1, 46, 6], mira: [-1, 0, -37] } });

// ---------------- EXTERIORES ----------------
zona({ id: 'patio', planta: 'exterior', x0: -32, x1: 8, z0: 13, z1: 44, h: 2, color: '#4f8a4a',
  nombre: 'Patio central', corto: 'Patio central',
  desc: 'Es un gran patio con árboles, bancos y una fuente. Durante el recreo, hablamos y descansamos aquí.',
  hay: ['la fuente', 'los olivos', 'los bancos', 'las flores', 'los caminos'],
  cam: { pos: [-12, 26, 68], mira: [-12, 0, 28] } });
zona({ id: 'jardin', planta: 'exterior', x0: -50, x1: -34, z0: -60, z1: 46, h: 2, color: '#5c9a48',
  nombre: 'Jardines', corto: 'Jardines',
  desc: 'En los jardines hay árboles, flores, caminos y un estanque. Es un lugar muy tranquilo para pasear y leer.',
  hay: ['el estanque', 'los árboles', 'las flores', 'los caminos', 'los bancos'],
  cam: { pos: [-20, 40, 34], mira: [-43, 0, 4] } });

export const SALAS = Object.fromEntries(L.map(s => [s.id, s]));
export const LISTA = L;
export const POR_PLANTA = {
  baja: L.filter(s => s.planta === 'baja'),
  primer: L.filter(s => s.planta === 'primer'),
  deporte: L.filter(s => s.planta === 'deporte'),
  exterior: L.filter(s => s.planta === 'exterior'),
  edif: L.filter(s => s.planta === 'edif'),
};
export const AULAS = POR_PLANTA.baja.filter(s => s.tipo === 'aula');
export const ESPACIOS_PB = POR_PLANTA.baja.filter(s => s.tipo !== 'aula');
export const HABITACIONES = POR_PLANTA.primer.filter(s => s.tipo === 'habitacion').sort((a, b) => a.num - b.num);
export const COMUNES_INT = POR_PLANTA.primer.filter(s => s.tipo !== 'habitacion');

export function centro(s) { return [(s.x0 + s.x1) / 2, (s.z0 + s.z1) / 2]; }

// De coordenadas "canónicas" de una sala (pasillo hacia +z) a coordenadas del mundo
export function aMundo(s, lx, ly, lz) {
  const [cx, cz] = centro(s);
  const k = s.fila === 'sur' ? -1 : 1;
  return [cx + k * lx, s.y + ly, cz + k * lz];
}

// Cámara para ver una sala desde arriba (como una maqueta abierta)
export function camaraSala(s) {
  if (s.cam) return s.cam;
  const w = s.x1 - s.x0, d = s.z1 - s.z0, m = Math.min(Math.max(w, d), 16);
  const [cx, cz] = centro(s);
  const dir = s.fila === 'sur' ? 1 : -1;
  return { pos: [cx + m * 0.32, s.y + m * 1.2 + 3, cz + dir * (m * 0.9 + 3)], mira: [cx, s.y + 0.6, cz] };
}

// Cámara "dentro" de la sala, a la altura de los ojos
export function camaraInterior(s) {
  if (s.interior) return { pos: s.interior.ojo, mira: s.interior.mira };
  const w = s.x1 - s.x0, d = s.z1 - s.z0;
  let ojo = [w * 0.3, 1.7, -d / 2 + 0.8], mira = [-w * 0.05, 1.1, d / 2 - 1.2];
  if (s.tipo === 'habitacion') { ojo = [w * 0.22, 1.7, d / 2 - 0.6]; mira = [0, 0.7, -d / 2 + 1.6]; }
  if (s.tipo === 'recepcion' || s.tipo === 'descanso') { ojo = [-w * 0.35, 1.7, -d / 2 + 0.8]; mira = [w * 0.15, 1.6, d / 2 - 2]; }
  if (s.tipo === 'comedor' || s.tipo === 'biblioteca' || s.tipo === 'salon') { ojo = [w * 0.42, 1.9, d / 2 - 0.6]; mira = [w * 0.05, 0.8, -d / 2 + 2]; }
  return { pos: aMundo(s, ...ojo), mira: aMundo(s, ...mira) };
}

// Vistas generales de la cámara ('ajuste' = encuadre automático del campus según la pantalla)
export const VISTAS = {
  inicio: { ajuste: 'campus', azimut: -0.42, polar: 0.92, margen: 0.64, desplazar: 0.4, fov: 30 },
  completa: { ajuste: 'campus', azimut: -0.12, polar: 0.98, margen: 0.98, fov: 25 },
  baja: { ajuste: 'edificio', azimut: 0, polar: 0.82, margen: 0.9, y: 0, fov: 36 },
  primer: { ajuste: 'edificio', azimut: 0, polar: 0.82, margen: 0.9, y: Y1, fov: 36 },
  corte: { pos: [-52, 21, 54], mira: [2, 6.5, 0] },
  deportes: { ajuste: 'deportes', azimut: 0.62, polar: 0.95, margen: 0.95, fov: 30 },
};

// Cajas para el encuadre automático
export const CAJAS = {
  campus: { x0: -35, x1: 71.5, z0: -54, z1: 45.5, y0: 0, y1: 8 },  // edificios y pistas, con un pequeño margen (nada se corta)
  campusMovil: { x0: -36, x1: 71.5, z0: -69, z1: 46, y0: 0, y1: 8 },  // teléfono: todo el campus, gradas incluidas
  edificio: { x0: -33, x1: 33, z0: -12.5, z1: 12.5, y0: 0, y1: 4 },
  deportes: { x0: -34, x1: 70, z0: -62, z1: 45, y0: 0, y1: 8 },
};

// Visita guiada (orden de las paradas)
export const RECORRIDO = ['edificio', 'entrada', 'mates', 'fisica', 'svt', 'biblioteca', 'comedor', 'hab104', 'salon2', 'gimnasio', 'piscina', 'futbol', 'baloncesto', 'patio', 'jardin'];
