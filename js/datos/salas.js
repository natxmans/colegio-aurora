// =========================================================
// Datos de todos los espacios del Colegio Aurora
// Coordenadas en metros. x: oeste→este, z: norte→sur, y: altura.
// Edificio principal: x de -32 a 32, z de -11 a 11.
// Pasillo central: z de -2 a 2.  Fila norte: z -11→-2.  Fila sur: z 2→11.
// =========================================================

export const Y1 = 4.2;   // altura del suelo del primer piso
export const H0 = 3.8;   // altura de la planta baja
export const H1 = 3.6;   // altura del primer piso

export const ZONAS = {
  baja: { titulo: 'Planta baja', sub: 'Zona escolar', color: '#22d3ee' },
  primer: { titulo: 'Primer piso', sub: 'Internado y dormitorios', color: '#8b5cf6' },
  deporte: { titulo: 'Complejo deportivo', sub: 'Deporte y salud', color: '#38bdf8' },
  exterior: { titulo: 'Exteriores', sub: 'Patio y jardines', color: '#34d399' },
  edif: { titulo: 'Edificio principal', sub: 'Dos plantas', color: '#3d8bff' },
};

const L = [];
function sala(o) {
  const fila = o.fila;
  const z0 = fila === 'norte' ? -11 : 2;
  const z1 = fila === 'norte' ? -2 : 11;
  const s = {
    z0, z1,
    y: o.planta === 'primer' ? Y1 : 0,
    h: o.planta === 'primer' ? H1 : H0,
    ...o,
  };
  L.push(s);
  return s;
}
function zona(o) { const s = { y: 0, ...o }; L.push(s); return s; }

// ---------------- PLANTA BAJA · AULAS (fila norte) ----------------
sala({ id: 'mates', planta: 'baja', fila: 'norte', x0: -32, x1: -24, tipo: 'aula', materia: 'mates', color: '#3d8bff',
  nombre: 'Aula de matemáticas', corto: 'Matemáticas',
  desc: 'En el aula de matemáticas hay una gran pizarra digital con fórmulas. Los alumnos resuelven problemas y calculan áreas. ¡Nos gusta mucho la geometría!',
  hay: ['la pizarra digital', 'los pupitres', 'las sillas', 'los cuadernos', 'las figuras geométricas'] });
sala({ id: 'frances', planta: 'baja', fila: 'norte', x0: -24, x1: -16, tipo: 'aula', materia: 'frances', color: '#6c7bff',
  nombre: 'Aula de francés', corto: 'Francés',
  desc: 'Aquí aprendemos francés. Leemos libros, escribimos textos y hablamos mucho. Hay una Torre Eiffel en miniatura y un póster de París.',
  hay: ['la pizarra digital', 'los libros', 'la Torre Eiffel', 'el póster de París', 'los portátiles'] });
sala({ id: 'ingles', planta: 'baja', fila: 'norte', x0: -16, x1: -8, tipo: 'aula', materia: 'ingles', color: '#ff5d73',
  nombre: 'Aula de inglés', corto: 'Inglés',
  desc: 'En el aula de inglés hablamos y cantamos en inglés. Hay un Big Ben en miniatura y una cabina de teléfono roja de Londres.',
  hay: ['la pizarra digital', 'la cabina roja', 'el Big Ben', 'el póster de Londres', 'los cuadernos'] });
sala({ id: 'historia', planta: 'baja', fila: 'norte', x0: -8, x1: 0, tipo: 'aula', materia: 'historia', color: '#f2a541',
  nombre: 'Aula de historia y geografía', corto: 'Historia y geografía',
  desc: 'En esta aula estudiamos el pasado y los países del mundo. Hay un gran mapa del mundo, un globo terráqueo, una pirámide y columnas romanas.',
  hay: ['el mapa del mundo', 'el globo terráqueo', 'la pirámide', 'las columnas romanas', 'la línea del tiempo'] });
sala({ id: 'svt', planta: 'baja', fila: 'norte', x0: 0, x1: 8, tipo: 'aula', materia: 'svt', color: '#34d399',
  nombre: 'Aula de ciencias de la vida y de la Tierra', corto: 'Ciencias',
  desc: 'Aquí observamos las plantas, los animales y el cuerpo humano. Hay microscopios, un acuario, un modelo de ADN y una pared de plantas.',
  hay: ['los microscopios', 'el acuario', 'las plantas', 'el modelo de ADN', 'el póster de la célula'] });
sala({ id: 'fisica', planta: 'baja', fila: 'norte', x0: 8, x1: 16, tipo: 'aula', materia: 'fisica', color: '#22d3ee',
  nombre: 'Aula de física y química', corto: 'Física y química',
  desc: 'Es un verdadero laboratorio. Hacemos experimentos con mucho cuidado. Hay tubos de ensayo, una tabla periódica y un modelo de átomo.',
  hay: ['los tubos de ensayo', 'la tabla periódica', 'el átomo', 'la vitrina', 'el laboratorio'] });
sala({ id: 'tecno', planta: 'baja', fila: 'norte', x0: 16, x1: 24, tipo: 'aula', materia: 'tecno', color: '#8b5cf6',
  nombre: 'Aula de tecnología', corto: 'Tecnología',
  desc: 'En el aula de tecnología programamos robots. Hay ordenadores, una impresora 3D, un dron y un brazo robótico que se mueve.',
  hay: ['los ordenadores', 'la impresora 3D', 'el brazo robótico', 'los robots', 'el dron'] });
sala({ id: 'musica', planta: 'baja', fila: 'norte', x0: 24, x1: 32, tipo: 'aula', materia: 'musica', color: '#e879f9',
  nombre: 'Aula de música', corto: 'Música',
  desc: 'Nos encanta el aula de música. Hay un piano, una batería y guitarras eléctricas. Los alumnos cantan y tocan instrumentos.',
  hay: ['el piano', 'la batería', 'las guitarras', 'los altavoces', 'el atril'] });

// ---------------- PLANTA BAJA · OTROS ESPACIOS (fila sur) ----------------
sala({ id: 'arte', planta: 'baja', fila: 'sur', x0: -32, x1: -24, tipo: 'arte', color: '#fb7185',
  nombre: 'Sala de arte', corto: 'Arte',
  desc: 'En la sala de arte pintamos y dibujamos. Hay caballetes, cuadros de colores y una escultura moderna que gira.',
  hay: ['los caballetes', 'los cuadros', 'la escultura', 'los pinceles', 'las pinturas'] });
sala({ id: 'informatica', planta: 'baja', fila: 'sur', x0: -24, x1: -16, tipo: 'informatica', color: '#60a5fa',
  nombre: 'Sala de informática', corto: 'Informática',
  desc: 'En la sala de informática hay muchos ordenadores y una gran pantalla. Aprendemos a programar y probamos la realidad virtual.',
  hay: ['los ordenadores', 'la gran pantalla', 'las gafas de realidad virtual', 'el servidor', 'los teclados'] });
sala({ id: 'biblioteca', planta: 'baja', fila: 'sur', x0: -16, x1: -4, tipo: 'biblioteca', color: '#fbbf24',
  nombre: 'Biblioteca', corto: 'Biblioteca',
  desc: 'La biblioteca es tranquila y luminosa. Hay miles de libros, mesas para estudiar y un rincón de lectura con cojines.',
  hay: ['las estanterías', 'los libros', 'las mesas de estudio', 'el rincón de lectura', 'las lámparas'] });
sala({ id: 'recepcion', planta: 'baja', fila: 'sur', x0: -4, x1: 4, tipo: 'recepcion', color: '#3d8bff',
  nombre: 'Recepción', corto: 'Recepción',
  desc: 'Es la entrada del colegio. Aquí hay una recepción moderna, una gran pantalla y la escalera que sube al internado del primer piso.',
  hay: ['el mostrador', 'la escalera', 'la gran pantalla', 'los sofás', 'el logo del colegio'] });
sala({ id: 'comedor', planta: 'baja', fila: 'sur', x0: 4, x1: 18, tipo: 'comedor', color: '#f97316',
  nombre: 'Comedor', corto: 'Comedor',
  desc: 'A las doce y veinte, vamos al comedor. Comemos platos españoles y mediterráneos. ¡La comida es sana y deliciosa!',
  hay: ['el autoservicio', 'las mesas redondas', 'las bandejas', 'el menú del día', 'la fruta'] });
sala({ id: 'enfermeria', planta: 'baja', fila: 'sur', x0: 18, x1: 24, tipo: 'enfermeria', color: '#4ade80',
  nombre: 'Enfermería', corto: 'Enfermería',
  desc: 'Si un alumno está enfermo, va a la enfermería. Hay una camilla, un botiquín y una enfermera muy simpática.',
  hay: ['la camilla', 'el botiquín', 'la cruz verde', 'el escritorio', 'la cortina'] });
sala({ id: 'salacomun', planta: 'baja', fila: 'sur', x0: 24, x1: 32, tipo: 'salacomun', color: '#2dd4bf',
  nombre: 'Sala común', corto: 'Sala común',
  desc: 'En la sala común descansamos durante el recreo. Hay sofás, un futbolín, una máquina de bebidas y una televisión.',
  hay: ['los sofás', 'el futbolín', 'la televisión', 'los pufs', 'la máquina de bebidas'] });

// ---------------- PRIMER PISO · INTERNADO ----------------
const COL_HAB = ['#22d3ee', '#8b5cf6', '#3d8bff', '#e879f9'];
const DESC_HAB = [
  'Es una habitación moderna para dos alumnos. Hay dos camas cómodas, dos escritorios, dos sillas y dos armarios.',
  'En esta habitación duermen dos alumnos. Cada uno tiene su cama, su escritorio y su armario. ¡Las luces LED son de colores!',
  'Es una habitación luminosa con una gran ventana y un balcón. Aquí los alumnos estudian, leen y duermen.',
];
for (let i = 0; i < 10; i++) {
  const n = 101 + i;
  sala({ id: 'hab' + n, planta: 'primer', fila: 'norte', x0: -32 + i * 6.4, x1: -32 + (i + 1) * 6.4, tipo: 'habitacion', num: n, color: COL_HAB[i % 4],
    nombre: 'Habitación ' + n, corto: String(n), desc: DESC_HAB[i % 3],
    hay: ['dos camas', 'dos escritorios', 'dos sillas', 'dos armarios', 'las lámparas', 'el balcón'] });
}
sala({ id: 'hab111', planta: 'primer', fila: 'sur', x0: -32, x1: -25.6, tipo: 'habitacion', num: 111, color: '#22d3ee',
  nombre: 'Habitación 111', corto: '111', desc: DESC_HAB[1], hay: ['dos camas', 'dos escritorios', 'dos sillas', 'dos armarios', 'las lámparas'] });
sala({ id: 'hab112', planta: 'primer', fila: 'sur', x0: -25.6, x1: -19.2, tipo: 'habitacion', num: 112, color: '#8b5cf6',
  nombre: 'Habitación 112', corto: '112', desc: DESC_HAB[2], hay: ['dos camas', 'dos escritorios', 'dos sillas', 'dos armarios', 'las lámparas'] });
sala({ id: 'banos', planta: 'primer', fila: 'sur', x0: -19.2, x1: -11.2, tipo: 'banos', color: '#38bdf8',
  nombre: 'Baños y duchas', corto: 'Baños',
  desc: 'Hay duchas individuales, lavabos y grandes espejos con luz. Todo está limpio y es muy moderno.',
  hay: ['las duchas', 'los lavabos', 'los espejos', 'las toallas', 'el banco'] });
sala({ id: 'aseos', planta: 'primer', fila: 'sur', x0: -11.2, x1: -4, tipo: 'aseos', color: '#94a3b8',
  nombre: 'Aseos', corto: 'Aseos',
  desc: 'Los aseos están al lado de las habitaciones. Hay aseos para chicos y aseos para chicas.',
  hay: ['los aseos de chicas', 'los aseos de chicos', 'los lavabos', 'el secador de manos'] });
sala({ id: 'descanso', planta: 'primer', fila: 'sur', x0: -4, x1: 4, tipo: 'descanso', color: '#34d399',
  nombre: 'Zona de descanso', corto: 'Zona de descanso',
  desc: 'Aquí llega la escalera. Es un espacio tranquilo con sillones, cojines y plantas. ¡Es ideal para leer o charlar!',
  hay: ['la escalera', 'el sillón colgante', 'los pufs', 'las plantas', 'la estantería'] });
sala({ id: 'juegos', planta: 'primer', fila: 'sur', x0: 4, x1: 14, tipo: 'juegos', color: '#f472b6',
  nombre: 'Sala de juegos', corto: 'Sala de juegos',
  desc: 'Por la tarde, jugamos al ping-pong, al billar y a los videojuegos. ¡Nos encanta esta sala!',
  hay: ['la mesa de ping-pong', 'el billar', 'las máquinas recreativas', 'la consola', 'el sofá'] });
sala({ id: 'comunint', planta: 'primer', fila: 'sur', x0: 14, x1: 24, tipo: 'comunint', color: '#a78bfa',
  nombre: 'Sala común del internado', corto: 'Sala común',
  desc: 'Es como un salón de casa. Vemos películas, preparamos la merienda en la cocina y hablamos con los amigos.',
  hay: ['el gran sofá', 'la televisión', 'la cocina', 'la nevera', 'la mesa'] });
sala({ id: 'lavanderia', planta: 'primer', fila: 'sur', x0: 24, x1: 32, tipo: 'lavanderia', color: '#60a5fa',
  nombre: 'Lavandería', corto: 'Lavandería',
  desc: 'En la lavandería hay lavadoras y secadoras. Los alumnos lavan su ropa y su uniforme.',
  hay: ['las lavadoras', 'las secadoras', 'la mesa para doblar', 'las cestas', 'la plancha'] });

// ---------------- EDIFICIO (vista completa) ----------------
zona({ id: 'edificio', planta: 'edif', x0: -32, x1: 32, z0: -11, z1: 11, h: 8.3, color: '#3d8bff',
  nombre: 'Edificio principal', corto: 'Edificio principal',
  desc: 'Tiene dos plantas. En la planta baja están las aulas y los espacios comunes. En el primer piso está el internado con todos los dormitorios.',
  hay: ['la planta baja', 'el primer piso', 'las fachadas de cristal', 'los paneles solares', 'los balcones'],
  cam: { pos: [-38, 34, 58], mira: [0, 3, 0] } });

// ---------------- COMPLEJO DEPORTIVO ----------------
zona({ id: 'gimnasio', planta: 'deporte', x0: 46, x1: 78, z0: -12, z1: 12, h: 10, color: '#38bdf8',
  nombre: 'Gimnasio', corto: 'Gimnasio',
  desc: 'Tenemos un gran gimnasio cubierto con gradas. Podemos jugar al baloncesto, al voleibol y al balonmano.',
  hay: ['la pista', 'las canastas', 'las gradas', 'la red de voleibol', 'el marcador'],
  cam: { pos: [76, 30, 30], mira: [62, 1, 0] }, interior: { ojo: [50, 4, 9], mira: [64, 1.5, -1] } });
zona({ id: 'fitness', planta: 'deporte', x0: 80, x1: 96, z0: -12, z1: 0, h: 5, color: '#a78bfa',
  nombre: 'Sala de fitness', corto: 'Fitness',
  desc: 'Hay cintas de correr, bicicletas y pesas. Aquí hacemos ejercicio después de las clases.',
  hay: ['las cintas de correr', 'las bicicletas', 'las pesas', 'el espejo', 'las esterillas'],
  cam: { pos: [100, 15, 8], mira: [88, 0.5, -6] }, interior: { ojo: [94, 2.2, -1.5], mira: [85, 1, -9] } });
zona({ id: 'vestuarios', planta: 'deporte', x0: 80, x1: 96, z0: 0, z1: 12, h: 5, color: '#60a5fa',
  nombre: 'Vestuarios y duchas', corto: 'Vestuarios',
  desc: 'Antes y después del deporte, vamos a los vestuarios. Hay taquillas, bancos y duchas.',
  hay: ['las taquillas', 'los bancos', 'las duchas', 'los espejos'],
  cam: { pos: [100, 14, 20], mira: [88, 0.5, 6] } });
zona({ id: 'piscina', planta: 'deporte', x0: 46, x1: 80, z0: 20, z1: 44, h: 3, color: '#0ea5e9',
  nombre: 'Piscina', corto: 'Piscina',
  desc: 'Hay una piscina moderna de veinticinco metros. Nadamos en la clase de educación física y en verano.',
  hay: ['la piscina', 'las calles', 'las plataformas de salida', 'el socorrista', 'las tumbonas', 'las sombrillas'],
  cam: { pos: [63, 22, 60], mira: [63, 0, 31] }, interior: { ojo: [48, 2, 34], mira: [66, 0, 31] } });
zona({ id: 'baloncesto', planta: 'deporte', x0: 86, x1: 114, z0: 20, z1: 36, h: 4, color: '#f97316',
  nombre: 'Pista de baloncesto', corto: 'Baloncesto',
  desc: 'Es una pista exterior. Jugamos al baloncesto durante el recreo y después de las clases.',
  hay: ['las canastas', 'la pista', 'el balón', 'la valla'],
  cam: { pos: [100, 20, 52], mira: [100, 0, 28] } });
zona({ id: 'padel', planta: 'deporte', x0: 86, x1: 108, z0: 40, z1: 61, h: 4, color: '#22c55e',
  nombre: 'Pistas de pádel', corto: 'Pádel',
  desc: 'El pádel es un deporte muy popular en España. ¡Tenemos dos pistas con paredes de cristal!',
  hay: ['las paredes de cristal', 'las redes', 'las palas', 'las pelotas'],
  cam: { pos: [120, 18, 70], mira: [97, 0, 50] } });
zona({ id: 'futbol', planta: 'deporte', x0: 42, x1: 124, z0: -73, z1: -16, h: 4, color: '#16a34a',
  nombre: 'Campo de fútbol', corto: 'Campo de fútbol',
  desc: 'Podemos jugar al fútbol en un gran campo de césped. Alrededor hay una pista de atletismo y gradas.',
  hay: ['el césped', 'las porterías', 'la pista de atletismo', 'las gradas', 'el balón'],
  cam: { pos: [83, 44, 4], mira: [83, 0, -44] } });

// ---------------- EXTERIORES ----------------
zona({ id: 'patio', planta: 'exterior', x0: -32, x1: 32, z0: 13, z1: 48, h: 2, color: '#34d399',
  nombre: 'Patio central', corto: 'Patio central',
  desc: 'Es una gran plaza con una fuente, árboles y bancos. Durante el recreo, los alumnos hablan y juegan aquí.',
  hay: ['la fuente', 'los árboles', 'los bancos', 'la pérgola', 'la mesa de ping-pong'],
  cam: { pos: [0, 28, 74], mira: [0, 0, 30] } });
zona({ id: 'jardin', planta: 'exterior', x0: -82, x1: -40, z0: -34, z1: 44, h: 2, color: '#4ade80',
  nombre: 'Jardines', corto: 'Jardines',
  desc: 'Hay jardines con árboles, un estanque, un huerto y un anfiteatro para las clases al aire libre.',
  hay: ['el estanque', 'el huerto', 'el anfiteatro', 'los árboles', 'los caminos'],
  cam: { pos: [-28, 42, 52], mira: [-60, 0, 4] } });

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
export const HABITACIONES = POR_PLANTA.primer.filter(s => s.tipo === 'habitacion');
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
  const w = s.x1 - s.x0, d = s.z1 - s.z0, m = Math.max(w, d);
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
  if (s.tipo === 'comedor' || s.tipo === 'biblioteca' || s.tipo === 'juegos' || s.tipo === 'comunint') { ojo = [w * 0.38, 1.9, d / 2 - 0.6]; mira = [-w * 0.1, 0.8, -d / 2 + 2]; }
  return { pos: aMundo(s, ...ojo), mira: aMundo(s, ...mira) };
}

// Vistas generales de la cámara
export const VISTAS = {
  inicio: { pos: [-46, 50, 112], mira: [26, 0, -4] },
  completa: { pos: [-50, 86, 142], mira: [26, 0, -6] },
  baja: { pos: [0, 56, 44], mira: [0, 0, 1] },
  primer: { pos: [0, 60, 46], mira: [0, Y1, 1] },
  corte: { pos: [-52, 21, 54], mira: [2, 6.5, 0] },
  deportes: { pos: [126, 70, 86], mira: [82, 0, -8] },
};

// Visita guiada (orden de las paradas)
export const RECORRIDO = ['edificio', 'recepcion', 'mates', 'fisica', 'svt', 'musica', 'biblioteca', 'comedor', 'hab104', 'juegos', 'gimnasio', 'piscina', 'futbol', 'patio'];
