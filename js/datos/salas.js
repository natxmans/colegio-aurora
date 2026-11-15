// =========================================================
// COLEGIO PABLO PICASSO · todos los espacios del campus
// Coordenadas en metros. x: oeste→este, z: norte→sur, y: altura.
// · Edificio principal (2 plantas): x de -32 a 32, z de -11 a 11. Pasillo: z de -2 a 2.
//   Planta baja: aulas, laboratorios, biblioteca digital, entrada y comedor.
//   Primer piso: vida escolar, permanencia, sala de profesores, sala de estudio y salones.
// · Residencia (edificio independiente, 2 plantas): x de -60 a -44, z de -20 a 20.
//   Pasillo central: x de -53.5 a -50.5. Habitaciones dobles a los dos lados.
// · Complejo deportivo: gimnasio, piscina olímpica cubierta, fútbol y baloncesto.
// Cada sala tiene un centro (cx, cz), un tamaño (w × d) y un giro ry:
// en coordenadas "canónicas" de la sala, el pasillo está hacia +z.
// =========================================================

export const Y1 = 4.2;   // altura del suelo del primer piso (edificio principal)
export const H0 = 3.8;   // altura de la planta baja
export const H1 = 3.6;   // altura del primer piso
export const RY1 = 3.8;  // altura del primer piso de la residencia
export const RH = 3.4;   // altura de las habitaciones de la residencia
export const RES = { x0: -60, x1: -44, z0: -20, z1: 20, pasillo: [-53.5, -50.5] };

export const ZONAS = {
  baja: { titulo: 'Planta baja', sub: 'Aulas, laboratorios, biblioteca y comedor', color: '#1f4e9a' },
  primer: { titulo: 'Primer piso', sub: 'Vida escolar, permanencia y salones', color: '#6b5a8e' },
  res0: { titulo: 'Residencia · planta baja', sub: 'Entrada, salón y habitaciones', color: '#8a5a3a' },
  res1: { titulo: 'Residencia · primer piso', sub: 'Habitaciones dobles', color: '#a0673f' },
  residencia: { titulo: 'Residencia', sub: 'El edificio de los dormitorios', color: '#a0673f' },
  deporte: { titulo: 'Complejo deportivo', sub: 'Deporte y salud', color: '#2a7ab0' },
  exterior: { titulo: 'Exteriores', sub: 'Patios y jardines', color: '#4f8a4a' },
  edif: { titulo: 'Edificio principal', sub: 'Dos plantas', color: '#14285a' },
};

// Caja que contiene todo el campus (muro exterior)
export const CAMPUS = { x0: -68, x1: 74, z0: -70, z1: 50, y0: 0, y1: 12 };

const L = [];
const PI = Math.PI;
// Sala del edificio principal (fila norte o sur del pasillo)
function sala(o) {
  const z0 = o.fila === 'norte' ? -11 : 2;
  const z1 = o.fila === 'norte' ? -2 : 11;
  const s = {
    z0, z1, y: o.planta === 'primer' ? Y1 : 0, h: o.planta === 'primer' ? H1 : H0,
    edificio: 'principal', ry: o.fila === 'sur' ? PI : 0, ...o,
  };
  s.cx = (s.x0 + s.x1) / 2; s.cz = (s.z0 + s.z1) / 2; s.w = s.x1 - s.x0; s.d = s.z1 - s.z0;
  L.push(s);
  return s;
}
// Sala de la residencia: lado 'oeste' (pasillo hacia +x) o 'este' (pasillo hacia -x)
function salaRes(o) {
  const oeste = o.lado === 'oeste';
  const [x0, x1] = oeste ? [RES.x0, RES.pasillo[0]] : [RES.pasillo[1], RES.x1];
  const s = {
    x0, x1, y: o.planta === 'res1' ? RY1 : 0, h: RH, edificio: 'residencia',
    ry: oeste ? PI / 2 : -PI / 2, ...o,
  };
  s.cx = (x0 + x1) / 2; s.cz = (s.z0 + s.z1) / 2; s.w = s.z1 - s.z0; s.d = x1 - x0;
  L.push(s);
  return s;
}
function zona(o) {
  const s = { y: 0, ry: 0, ...o };
  s.cx = (s.x0 + s.x1) / 2; s.cz = (s.z0 + s.z1) / 2; s.w = s.x1 - s.x0; s.d = s.z1 - s.z0;
  L.push(s);
  return s;
}

// ---------------- PLANTA BAJA · AULAS Y LABORATORIOS (fila norte) ----------------
const MARINO = '#14285a', ARENA = '#c9a978';
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
  desc: 'Aquí recibimos a las familias y a los visitantes. La escalera sube al primer piso: la vida escolar, la permanencia y los salones.',
  hay: ['la escalera', 'el logo del colegio', 'el mostrador', 'los sofás', 'las plantas'] });
sala({ id: 'comedor', planta: 'baja', fila: 'sur', x0: 4, x1: 32, tipo: 'comedor', color: '#b9863b',
  nombre: 'Comedor', corto: 'Comedor',
  desc: 'A las doce y veinte comemos en el comedor. Es muy grande y la comida es sana y equilibrada.',
  hay: ['el autoservicio', 'las mesas', 'las bandejas', 'el menú del día', 'la fruta'] });

// ---------------- PRIMER PISO · VIDA ESCOLAR, PERMANENCIA Y SALONES ----------------
sala({ id: 'vidaescolar', planta: 'primer', fila: 'norte', x0: -32, x1: -16, tipo: 'vidaescolar', color: '#1f7a8c',
  nombre: 'Vida escolar', corto: 'Vida escolar',
  desc: 'Es la oficina de la vida escolar. Los educadores reciben a los alumnos, los escuchan y los ayudan cuando tienen un problema.',
  hay: ['el mostrador de acogida', 'las mesas para hablar', 'el tablón de anuncios', 'los educadores', 'el horario del día'] });
sala({ id: 'permanencia', planta: 'primer', fila: 'norte', x0: -16, x1: 0, tipo: 'permanencia', color: '#5a6b8e',
  nombre: 'Permanencia', corto: 'Permanencia',
  desc: 'Cuando un profesor está ausente, los alumnos vienen a la permanencia. Un adulto los vigila y ellos estudian en silencio.',
  hay: ['las mesas', 'las sillas', 'la mesa del vigilante', 'el reloj', 'los libros'] });
sala({ id: 'profesores', planta: 'primer', fila: 'norte', x0: 0, x1: 16, tipo: 'profesores', color: '#7a6a4f',
  nombre: 'Sala de profesores', corto: 'Profesores',
  desc: 'Es la sala de los profesores. Aquí preparan las clases, corrigen y hablan entre ellos.',
  hay: ['la gran mesa', 'los ordenadores', 'los casilleros', 'los sofás', 'las plantas'] });
sala({ id: 'estudio', planta: 'primer', fila: 'norte', x0: 16, x1: 32, tipo: 'estudio', color: '#3f6f8a',
  nombre: 'Sala de estudio', corto: 'Sala de estudio',
  desc: 'Por la tarde, los alumnos hacen aquí todo su trabajo. ¡No hay deberes en casa!',
  hay: ['las mesas de estudio', 'los ordenadores', 'las lámparas', 'los libros', 'las estanterías'] });
sala({ id: 'lectura', planta: 'primer', fila: 'sur', x0: -32, x1: -4, tipo: 'lectura', color: '#4f8a4a',
  nombre: 'Salón de lectura', corto: 'Salón de lectura',
  desc: 'Es un salón tranquilo con sillones, cojines y estanterías. Aquí leemos y descansamos.',
  hay: ['los sillones', 'las estanterías', 'los libros', 'las alfombras', 'las plantas'] });
sala({ id: 'salon1', planta: 'primer', fila: 'sur', x0: -4, x1: 4, tipo: 'descanso', color: '#4f8a4a',
  nombre: 'Salón de descanso', corto: 'Salón de descanso',
  desc: 'Es un salón tranquilo con sofás, cojines y plantas para descansar. Aquí llega la escalera.',
  hay: ['la escalera', 'los sofás', 'los cojines', 'las plantas', 'la estantería'] });
sala({ id: 'salon2', planta: 'primer', fila: 'sur', x0: 4, x1: 20, tipo: 'salon', color: '#6b5a8e',
  nombre: 'Salón común', corto: 'Salón común',
  desc: 'En el salón común hay sofás, una televisión y mesas. Por la tarde, descansamos y hablamos con los amigos.',
  hay: ['los sofás', 'la televisión', 'las mesas', 'los libros', 'las plantas'] });
sala({ id: 'juegos', planta: 'primer', fila: 'sur', x0: 20, x1: 32, tipo: 'juegos', color: '#b84a55',
  nombre: 'Sala de juegos', corto: 'Sala de juegos',
  desc: 'En la sala de juegos jugamos al ping-pong y al futbolín con los amigos.',
  hay: ['la mesa de ping-pong', 'el futbolín', 'los pufs', 'los sofás'] });

// ---------------- RESIDENCIA · HABITACIONES DOBLES ----------------
const COL_HAB = ['#2a62b8', '#14285a', '#b9863b', '#3b5fa8'];
const DESC_HAB = [
  'Es una habitación para dos alumnos. Hay dos camas individuales, dos escritorios y dos armarios.',
  'En esta habitación duermen dos alumnos. Cada uno tiene su cama, su escritorio, su armario y su rincón personal.',
  'Es una habitación luminosa con una gran ventana. Aquí los alumnos estudian, hablan y duermen.',
];
const HAY_HAB = ['dos camas individuales', 'dos escritorios', 'dos armarios', 'dos sillas', 'dos rincones personales'];
const habitacion = (num, planta, lado, z0, z1) => salaRes({
  id: 'hab' + num, num, planta, lado, z0, z1, tipo: 'habitacion', color: COL_HAB[num % 4],
  nombre: 'Habitación ' + num, corto: String(num), desc: DESC_HAB[num % 3], hay: HAY_HAB,
});
// Planta baja: 3 + 3 habitaciones al oeste (el salón en medio) y 4 + 4 al este (la entrada en medio)
let n = 1;
for (const [a, b] of [[-20, -16], [-16, -12], [-12, -8], [8, 12], [12, 16], [16, 20]]) habitacion(n++, 'res0', 'oeste', a, b);
for (let i = 0; i < 4; i++) habitacion(n++, 'res0', 'este', -20 + i * 3.75, -20 + (i + 1) * 3.75);
for (let i = 0; i < 4; i++) habitacion(n++, 'res0', 'este', 5 + i * 3.75, 5 + (i + 1) * 3.75);
// Primer piso: 10 habitaciones al oeste y 4 + 4 al este (el rincón de estar en medio)
n = 101;
for (let i = 0; i < 10; i++) habitacion(n++, 'res1', 'oeste', -20 + i * 4, -20 + (i + 1) * 4);
for (let i = 0; i < 4; i++) habitacion(n++, 'res1', 'este', -20 + i * 3.75, -20 + (i + 1) * 3.75);
for (let i = 0; i < 4; i++) habitacion(n++, 'res1', 'este', 5 + i * 3.75, 5 + (i + 1) * 3.75);

salaRes({ id: 'salonres', planta: 'res0', lado: 'oeste', z0: -8, z1: 8, tipo: 'salonres', color: '#8a5a3a',
  nombre: 'Salón de la residencia', corto: 'Salón',
  desc: 'Por la noche, los alumnos se reúnen en el salón de la residencia. Hablan, ven una película o juegan juntos.',
  hay: ['los sofás', 'la televisión', 'las mesas', 'los juegos de mesa', 'las lámparas'] });
salaRes({ id: 'hallres', planta: 'res0', lado: 'este', z0: -5, z1: 5, tipo: 'hallres', color: '#a0673f',
  nombre: 'Entrada de la residencia', corto: 'Entrada',
  desc: 'Es la entrada de la residencia. El educador de noche está aquí. La escalera sube a las habitaciones del primer piso.',
  hay: ['la escalera', 'el mostrador del educador', 'los sofás', 'los buzones', 'las plantas'] });
salaRes({ id: 'estarres', planta: 'res1', lado: 'este', z0: -5, z1: 5, tipo: 'estarres', color: '#a0673f',
  nombre: 'Rincón de estar', corto: 'Rincón de estar',
  desc: 'Es un pequeño salón en el primer piso de la residencia, al lado de la escalera, para hablar antes de dormir.',
  hay: ['los sofás', 'la estantería', 'la gran ventana', 'las plantas'] });

// ---------------- EDIFICIOS (vista completa) ----------------
zona({ id: 'edificio', planta: 'edif', x0: -32, x1: 32, z0: -11, z1: 11, h: 8.3, color: MARINO, edificio: 'principal',
  nombre: 'Edificio principal', corto: 'Edificio principal',
  desc: 'Es un edificio moderno de dos plantas. En la planta baja están las aulas, los laboratorios, la biblioteca y el comedor. En el primer piso están la vida escolar, la permanencia, la sala de profesores y los salones.',
  hay: ['la planta baja', 'el primer piso', 'las grandes ventanas', 'los balcones', 'los paneles solares'],
  cam: { pos: [-30, 30, 50], mira: [0, 3, 0] } });
zona({ id: 'residencia', planta: 'residencia', x0: RES.x0, x1: RES.x1, z0: RES.z0, z1: RES.z1, h: 8.2, color: '#a0673f', edificio: 'residencia',
  nombre: 'Residencia', corto: 'Residencia',
  desc: 'La residencia es el edificio de los dormitorios. Las habitaciones son dobles: dos camas, dos escritorios y dos armarios. Hay también un salón y un educador de noche.',
  hay: ['las habitaciones dobles', 'el salón', 'la escalera', 'el rincón de estar', 'el educador de noche'],
  cam: { pos: [-22, 34, 34], mira: [-52, 2, 0] } });

// ---------------- COMPLEJO DEPORTIVO ----------------
export const GYM = { cx: 50, cz: 0, w: 30, d: 25, alto: 10 };
zona({ id: 'gimnasio', planta: 'deporte', x0: GYM.cx - GYM.w / 2, x1: GYM.cx + GYM.w / 2, z0: -12.5, z1: 12.5, h: 10, color: '#2a7ab0',
  nombre: 'Gimnasio', corto: 'Gimnasio',
  desc: 'Tenemos un gran gimnasio cubierto y moderno. Hacemos educación física, gimnasia y deportes de equipo.',
  hay: ['la pista', 'las canastas', 'las gradas', 'las colchonetas', 'el marcador'],
  cam: { pos: [58, 32, 36], mira: [50, 1, -1] }, interior: { ojo: [36.5, 4, 9], mira: [50, 1.5, -1] } });
zona({ id: 'piscina', planta: 'deporte', x0: 10, x1: 70, z0: 15, z1: 45, h: 12, color: '#1f7ab8',
  nombre: 'Piscina olímpica', corto: 'Piscina olímpica',
  desc: 'Hay una piscina olímpica cubierta y climatizada de cincuenta metros. ¡Podemos nadar todo el año!',
  hay: ['la piscina', 'las calles', 'las gradas', 'el techo de cristal', 'el socorrista'],
  cam: { pos: [40, 36, 70], mira: [40, 0, 30] }, interior: { ojo: [13, 3.5, 25], mira: [44, 0, 31] } });
zona({ id: 'baloncesto', planta: 'deporte', x0: 35, x1: 65, z0: -37, z1: -17, h: 4, color: '#c46a2e',
  nombre: 'Cancha de baloncesto', corto: 'Baloncesto',
  desc: 'En la cancha de baloncesto jugamos en equipo después de las clases.',
  hay: ['las canastas', 'la cancha', 'el balón', 'los bancos'],
  cam: { pos: [50, 22, -2], mira: [50, 0, -27] } });
zona({ id: 'futbol', planta: 'deporte', x0: -35, x1: 33, z0: -67, z1: -15, h: 4, color: '#3f8a4a',
  nombre: 'Campo de fútbol', corto: 'Campo de fútbol',
  desc: 'Jugamos al fútbol en un gran campo de césped. Hay porterías y gradas para mirar los partidos.',
  hay: ['el césped', 'las porterías', 'las gradas', 'el balón', 'los focos'],
  cam: { pos: [-1, 46, 6], mira: [-1, 0, -37] } });

// ---------------- EXTERIORES ----------------
zona({ id: 'patio', planta: 'exterior', x0: -32, x1: 8, z0: 13, z1: 44, h: 2, color: '#4f8a4a',
  nombre: 'Patio de recreo', corto: 'Patio de recreo',
  desc: 'Es el patio de recreo, con árboles, bancos, una fuente y un porche. A las diez, durante veinte minutos, hablamos, paseamos y jugamos aquí.',
  hay: ['la fuente', 'los olivos', 'los bancos', 'el porche', 'la rayuela'],
  cam: { pos: [-12, 26, 68], mira: [-12, 0, 28] } });
zona({ id: 'jardin', planta: 'exterior', x0: -64, x1: -34, z0: 24, z1: 46, h: 2, color: '#5c9a48',
  nombre: 'Jardines', corto: 'Jardines',
  desc: 'En los jardines hay árboles, flores, caminos y un estanque. Es un lugar muy tranquilo para pasear y leer.',
  hay: ['el estanque', 'los árboles', 'las flores', 'los caminos', 'los bancos'],
  cam: { pos: [-30, 32, 66], mira: [-49, 0, 35] } });

export const SALAS = Object.fromEntries(L.map(s => [s.id, s]));
export const LISTA = L;
const filtro = f => L.filter(f);
export const POR_PLANTA = {
  baja: filtro(s => s.planta === 'baja'),
  primer: filtro(s => s.planta === 'primer'),
  res0: filtro(s => s.planta === 'res0'),
  res1: filtro(s => s.planta === 'res1'),
  residencia: filtro(s => s.planta === 'residencia'),
  deporte: filtro(s => s.planta === 'deporte'),
  exterior: filtro(s => s.planta === 'exterior'),
  edif: filtro(s => s.planta === 'edif'),
};
export const AULAS = POR_PLANTA.baja.filter(s => s.tipo === 'aula');
export const ESPACIOS_PB = POR_PLANTA.baja.filter(s => s.tipo !== 'aula');
export const PRIMER_PISO = POR_PLANTA.primer;
export const HABITACIONES = L.filter(s => s.tipo === 'habitacion').sort((a, b) => a.num - b.num);
export const COMUNES_RES = L.filter(s => s.edificio === 'residencia' && s.tipo !== 'habitacion' && s.planta !== 'residencia');
export const COMUNES_INT = POR_PLANTA.primer.filter(s => ['salon1', 'salon2', 'lectura', 'juegos'].includes(s.id));

export function centro(s) { return [s.cx, s.cz]; }

// De coordenadas "canónicas" de una sala (pasillo hacia +z) a coordenadas del mundo
export function aMundo(s, lx, ly, lz) {
  const c = Math.cos(s.ry || 0), n = Math.sin(s.ry || 0);
  return [s.cx + lx * c + lz * n, s.y + ly, s.cz - lx * n + lz * c];
}

// Cámara para ver una sala desde arriba (como una maqueta abierta)
export function camaraSala(s) {
  if (s.cam) return s.cam;
  const m = Math.min(Math.max(s.w, s.d), 16);
  // desde el lado del pasillo, un poco desplazada
  const [px, , pz] = aMundo(s, m * 0.3, 0, s.d / 2 + m * 0.9 + 3);
  return { pos: [px, s.y + m * 1.2 + 3, pz], mira: [s.cx, s.y + 0.6, s.cz] };
}

// Cámara "dentro" de la sala, a la altura de los ojos
export function camaraInterior(s) {
  if (s.interior) return { pos: s.interior.ojo, mira: s.interior.mira };
  const w = s.w, d = s.d;
  let ojo = [w * 0.3, 1.7, -d / 2 + 0.8], mira = [-w * 0.05, 1.1, d / 2 - 1.2];
  if (s.tipo === 'habitacion') { ojo = [0.9, 1.65, d / 2 - 0.5]; mira = [-0.2, 0.75, -d / 2 + 1.2]; }
  if (s.tipo === 'recepcion' || s.tipo === 'descanso' || s.tipo === 'hallres' || s.tipo === 'estarres') { ojo = [-w * 0.35, 1.7, -d / 2 + 0.8]; mira = [w * 0.15, 1.4, d / 2 - 2]; }
  if (['comedor', 'biblioteca', 'salon', 'lectura', 'salonres', 'vidaescolar', 'permanencia', 'profesores', 'estudio', 'juegos'].includes(s.tipo)) { ojo = [w * 0.42, 1.9, d / 2 - 0.6]; mira = [w * 0.05, 0.8, -d / 2 + 2]; }
  return { pos: aMundo(s, ...ojo), mira: aMundo(s, ...mira) };
}

// Vistas generales de la cámara ('ajuste' = encuadre automático según la pantalla)
export const VISTAS = {
  completa: { ajuste: 'principal', azimut: 0.2, polar: 0.72, margen: 0.85, fov: 30, y: 2, azimutMovil: 1.57, polarMovil: 0.62 },
  inicio: { ajuste: 'principal', azimut: 0.2, polar: 0.72, margen: 0.85, fov: 30, y: 2, azimutMovil: 1.57, polarMovil: 0.62 },
  campus: { ajuste: 'campus', azimut: -0.12, polar: 0.92, margen: 0.95, fov: 28 },
  baja: { ajuste: 'edificio', azimut: 0, polar: 0.82, margen: 0.9, y: 0, fov: 36 },
  primer: { ajuste: 'edificio', azimut: 0, polar: 0.82, margen: 0.9, y: Y1, fov: 36 },
  corte: { pos: [-52, 21, 54], mira: [2, 6.5, 0] },
  deportes: { ajuste: 'deportes', azimut: 0.62, polar: 0.95, margen: 0.95, fov: 30 },
  residencia: { ajuste: 'residencia', azimut: 1.05, polar: 0.8, margen: 0.9, y: 1, fov: 34 },
};

// Cajas para el encuadre automático
export const CAJAS = {
  // los EDIFICIOS (residencia, edificio principal, gimnasio y piscina): ocupan casi toda la vista
  principal: [
    { x0: -33, x1: 33, z0: -12.6, z1: 18, y0: 0, y1: 9 },     // edificio principal + entrada
    { x0: -60.5, x1: -43.5, z0: -20.5, z1: 20.5, y0: 0, y1: 8.4 }, // residencia
    { x0: 34.5, x1: 65.5, z0: -13, z1: 13, y0: 0, y1: 13 },   // gimnasio
    { x0: 10, x1: 70, z0: 15, z1: 45.5, y0: 0, y1: 11.6 },    // piscina
  ],
  campus: { x0: -64, x1: 72, z0: -66, z1: 47, y0: 0, y1: 8 },
  edificio: { x0: -33, x1: 33, z0: -12.5, z1: 12.5, y0: 0, y1: 4 },
  deportes: { x0: -34, x1: 70, z0: -62, z1: 45, y0: 0, y1: 8 },
  residencia: { x0: -61, x1: -43, z0: -21, z1: 21, y0: 0, y1: 4 },
};

// Visita guiada (orden de las paradas)
export const RECORRIDO = ['edificio', 'entrada', 'mates', 'fisica', 'svt', 'biblioteca', 'comedor', 'vidaescolar', 'permanencia', 'residencia', 'hab104', 'salonres', 'gimnasio', 'piscina', 'futbol', 'baloncesto', 'patio', 'jardin'];
