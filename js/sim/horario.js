// =========================================================
// LAS PERSONAS DEL COLEGIO Y SU HORARIO (datos puros, sin 3D)
// · 64 alumnos internos (la capacidad de la residencia) en 6 grupos de 4º (A-F) de 10-11 alumnos
// · 9 profesores (uno por asignatura)
// · personal: recepción, biblioteca, cocina, monitora del comedor, vida escolar, permanencia,
//   educadora del estudio, socorrista, entrenador de baloncesto, 2 educadores de noche
// Horario oficial: 07:45 despertar · 08:00 clases · 10:00 recreo (20 min) ·
// 12:20 comida · 14:00 clases · 17:00 fin de las clases · 21:00 a dormir.
// Estas funciones sirven para la simulación 3D y también para el asistente
// de cada alumno (aunque no haya 3D).
// =========================================================
import { aMin } from './reloj.js';

export const GRUPOS = ['4ºA', '4ºB', '4ºC', '4ºD', '4ºE', '4ºF'];  // 6 clases de 10-11 alumnos (aulas de 12 pupitres)
export const MATERIAS = [
  { id: 'svt', nombre: 'Ciencias de la Vida y de la Tierra', corto: 'Ciencias', sala: 'svt' },
  { id: 'edfisica', nombre: 'Educación Física', corto: 'Ed. Física', sala: 'gimnasio' },
  { id: 'fisica', nombre: 'Física y Química', corto: 'Física y Química', sala: 'fisica' },
  { id: 'historia', nombre: 'Historia y Geografía', corto: 'Historia', sala: 'historia' },
  { id: 'frances', nombre: 'Francés', corto: 'Francés', sala: 'frances' },
  { id: 'mates', nombre: 'Matemáticas', corto: 'Matemáticas', sala: 'mates' },
  { id: 'tecno', nombre: 'Tecnología', corto: 'Tecnología', sala: 'tecno' },
  { id: 'ingles', nombre: 'Inglés', corto: 'Inglés', sala: 'ingles' },
  { id: 'musica', nombre: 'Música', corto: 'Música', sala: 'musica' },
];

// Las clases del día (hora de inicio, hora de fin)
export const PERIODOS = [
  ['08:00', '09:00'], ['09:00', '10:00'], ['10:20', '11:20'], ['11:20', '12:20'],
  ['14:00', '15:00'], ['15:00', '16:00'], ['16:00', '17:00'],
].map(([a, b]) => [aMin(a), aMin(b)]);

export const HORAS = {
  despertar: aMin('07:45'), clases: aMin('08:00'), recreo: aMin('10:00'), finRecreo: aMin('10:20'),
  comida: aMin('12:20'), tarde: aMin('14:00'), finClases: aMin('17:00'), dormir: aMin('21:00'),
};

// Generador pseudoaleatorio (siempre igual para una misma semilla)
export function azar(semilla) {
  let s = (Math.abs(Math.floor(semilla * 7919 + 17)) % 2147483646) + 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
const elegir = (r, lista) => lista[Math.floor(r() * lista.length)];

// ---------------- ALUMNOS (personajes inventados) ----------------
const NOMBRES = ['Lucía', 'Hugo', 'Martina', 'Pablo', 'Sofía', 'Daniel', 'Paula', 'Álvaro', 'Valeria', 'Mario',
  'Julia', 'Adrián', 'Carla', 'Diego', 'Elena', 'Marcos', 'Noa', 'Javier', 'Alba', 'Leo',
  'Irene', 'Sergio', 'Claudia', 'Iker', 'Lola', 'Bruno', 'Vega', 'Gonzalo', 'Ainhoa', 'Rubén',
  'Nerea', 'Óscar', 'Carmen', 'Iván', 'Inés', 'Marco', 'Olivia', 'Raúl', 'Aitana', 'Unai',
  'Emma', 'Samuel', 'Lara', 'Nicolás', 'Valentina', 'Mateo', 'Zoe', 'Alejandro', 'Abril', 'Manuel',
  'Candela', 'Rodrigo', 'Jimena', 'Gabriel', 'Triana', 'Héctor', 'Mía', 'Izan', 'Ariadna', 'Thiago',
  'Carlota', 'Eric', 'Laia', 'Pol'];
// 64 alumnos = la capacidad de la residencia (32 habitaciones dobles x 2): todos son internos.
const PIEL = ['#f5d3b8', '#ebbd98', '#d39b72', '#a8714b', '#6f4a2f'];
const PELO = ['#2b1d14', '#4a2f1d', '#7a4a26', '#c08a45', '#e3c27c', '#151515', '#6b2f1a'];
const DEPORTES = ['futbol', 'baloncesto', 'natacion', 'gimnasio'];
const LUGARES = ['biblioteca', 'jardin', 'juegos', 'lectura', 'estudio', 'salon2'];
export const POR_GRUPO_MAX = 11;  // 64 alumnos en 6 grupos: 4 grupos de 11 y 2 de 10

export const ALUMNOS = NOMBRES.map((nombre, i) => {
  const r = azar(1000 + i * 37);
  // grupos MIXTOS: en cada «fila» de 6 alumnos, cada grupo recibe uno (y las chicas/chicos se alternan)
  const num = Math.floor(i / 6), g = (i + num) % 6;
  const chica = i % 2 === 0;
  return {
    id: 'al' + i, i, nombre, grupo: g, num, chica,
    falda: chica && r() < 0.6,
    piel: elegir(r, PIEL), pelo: elegir(r, PELO),
    peinado: chica ? elegir(r, ['coleta', 'largo', 'moño', 'corto']) : elegir(r, ['corto', 'corto', 'rizado']),
    alto: 0.86 + r() * 0.08,
    deporte: elegir(r, DEPORTES), lugar: elegir(r, LUGARES),
    deportista: r(), estudioso: r(), sociable: r(),
    paso: 0.92 + r() * 0.16,
  };
});

// Habitaciones: dos compañeros del MISMO SEXO por habitación (si es posible del mismo grupo), nunca más de dos.
// 32 chicas → 16 habitaciones, 32 chicos → 16 habitaciones = las 32 habitaciones dobles de la residencia.
// Chicas: habitaciones 101-116 (primer piso) · chicos: 1-14 (planta baja) y 117-118 (ala este del primer piso).
const HAB_CHICAS = [...Array(16)].map((_, k) => 'hab' + (101 + k));
const HAB_CHICOS = [...Array(14)].map((_, k) => 'hab' + (k + 1)).concat(['hab117', 'hab118']);
export const CAPACIDAD_RESIDENCIA = (HAB_CHICAS.length + HAB_CHICOS.length) * 2;
export function repartir() {
  // comedor: los compañeros de una misma clase se sientan juntos (8 mesas de 8)
  [...ALUMNOS].sort((a, b) => a.grupo - b.grupo || a.num - b.num).forEach((a, k) => { a.mesa = k; });
  for (const chicas of [true, false]) {
    const lista = ALUMNOS.filter(a => a.chica === chicas).sort((a, b) => a.grupo - b.grupo || a.num - b.num);
    const habs = chicas ? HAB_CHICAS : HAB_CHICOS;
    for (let k = 0; k < lista.length; k += 2) {
      const hab = habs[k / 2];
      if (!hab) throw new Error('No hay habitación para todos: la residencia tiene ' + CAPACIDAD_RESIDENCIA + ' plazas');
      lista[k].hab = hab; lista[k].cama = 0;
      if (lista[k + 1]) { lista[k + 1].hab = hab; lista[k + 1].cama = 1; }
    }
  }
  return ALUMNOS;   // la simulación tiene SIEMPRE a todos los alumnos (la calidad solo cambia el dibujo)
}
repartir();

// ---------------- PROFESORES Y PERSONAL ----------------
const NOMBRES_PROF = { svt: 'Marta', edfisica: 'Jorge', fisica: 'Ana', historia: 'Luis', frances: 'Claire', mates: 'Carmen', tecno: 'Andrés', ingles: 'Laura', musica: 'Pedro' };
const ROPA_PROF = ['#7a4f3a', '#3f5f7a', '#6b5a8e', '#2f6b5a', '#8a3f4f', '#4a4a5a', '#5a7a3f', '#2a62b8', '#9a6a2a'];
export const PROFES = MATERIAS.map((m, k) => {
  const r = azar(5000 + k * 31);
  const mujer = ['svt', 'fisica', 'frances', 'mates', 'ingles'].includes(m.id);
  return {
    id: 'pr' + k, k, materia: m.id, nombre: (mujer ? 'Profesora ' : 'Profesor ') + NOMBRES_PROF[m.id],
    corto: NOMBRES_PROF[m.id], mujer, piel: elegir(r, PIEL), pelo: elegir(r, ['#2b1d14', '#4a2f1d', '#7a7a7a', '#c08a45', '#151515']),
    peinado: mujer ? elegir(r, ['moño', 'largo', 'corto']) : 'corto', camisa: ROPA_PROF[k], alto: 0.98 + r() * 0.05,
  };
});

export const PERSONAL = [
  { id: 'pe0', rol: 'recepcion', nombre: 'Recepcionista', sala: 'entrada', desde: '07:35', hasta: '18:00', camisa: '#14285a' },
  { id: 'pe1', rol: 'biblioteca', nombre: 'Bibliotecaria', sala: 'biblioteca', desde: '07:50', hasta: '19:00', camisa: '#6b5a8e' },
  { id: 'pe2', rol: 'cocina', nombre: 'Cocinero', sala: 'comedor', i: 0, desde: '11:30', hasta: '14:15', camisa: '#f4f1ea' },
  { id: 'pe3', rol: 'cocina', nombre: 'Cocinera', sala: 'comedor', i: 1, desde: '11:30', hasta: '14:15', camisa: '#f4f1ea' },
  { id: 'pe4', rol: 'vidaescolar', nombre: 'Educadora de vida escolar', sala: 'vidaescolar', desde: '07:40', hasta: '18:30', camisa: '#1f7a8c' },
  { id: 'pe5', rol: 'educador', nombre: 'Educador de noche', sala: 'hallres', desde: '17:30', hasta: '08:30', camisa: '#a0673f' },
  { id: 'pe6', rol: 'permanencia', nombre: 'Vigilante de la permanencia', sala: 'permanencia', desde: '07:50', hasta: '17:10', camisa: '#5a6b8e' },
  { id: 'pe7', rol: 'socorrista', nombre: 'Socorrista', sala: 'piscina', desde: '16:50', hasta: '19:45', camisa: '#c0392b' },
  // más adultos para 64 alumnos
  { id: 'pe8', rol: 'monitor', nombre: 'Monitora del comedor', texto: 'Vigila el comedor y ayuda a los alumnos', sala: 'comedor', ronda: 4, desde: '12:10', hasta: '13:50', camisa: '#2f6b5a', peinado: 'largo' },
  { id: 'pe9', rol: 'entrenador', nombre: 'Entrenador de baloncesto', texto: 'Entrena a los jugadores de baloncesto', sala: 'baloncesto', desde: '16:55', hasta: '18:35', camisa: '#c46a2e', peinado: 'corto' },
  { id: 'pe10', rol: 'estudio', nombre: 'Educadora del estudio', texto: 'Vigila la sala de estudio y ayuda con el trabajo', sala: 'estudio', ronda: 6, desde: '16:58', hasta: '19:55', camisa: '#3f6f8a', peinado: 'largo' },
  { id: 'pe11', rol: 'educador', nombre: 'Educadora de noche (primer piso)', sala: 'estarres', i: 1, desde: '17:30', hasta: '08:30', camisa: '#8a5a3a', peinado: 'moño' },
].map((p, k) => ({ ...p, k, desdeM: aMin(p.desde), hastaM: aMin(p.hasta), piel: PIEL[(k * 2 + 1) % 5], pelo: PELO[(k * 3) % 7], peinado: p.peinado || (k % 2 ? 'moño' : 'corto'), alto: 0.98 }));

// ---------------- EL HORARIO DE CLASES ----------------
// materia del grupo g en el periodo p del día d (4 materias distintas a la vez → nunca dos grupos con el mismo profesor)
export function materiaDe(d, p, g) {
  const base = (d * 5 + p * 4 + (p > 3 ? 1 : 0)) % 9;
  return MATERIAS[(base + 2 * g) % 9];
}
export function periodoEn(min) {
  for (let p = 0; p < PERIODOS.length; p++) if (min >= PERIODOS[p][0] && min < PERIODOS[p][1]) return p;
  return -1;
}

// Ausencias: algunos días falta un profesor (se decide con el número del día).
// El visitante puede provocar una ausencia desde la interfaz.
export const ausencias = { manual: {} }; // manual[dia] = id de materia
export function ausenteDe(dia) {
  if (ausencias.manual[dia] !== undefined) return ausencias.manual[dia];
  const r = azar(777 + dia * 13)();
  return r < 0.55 ? MATERIAS[Math.floor(azar(91 + dia)() * 9)].id : null;
}

// ¿Qué hace el grupo g a la hora min? → { tipo, materia, sala, periodo }
export function claseDeGrupo(dia, min, g) {
  const p = periodoEn(min);
  if (p < 0) return null;
  const m = materiaDe(dia, p, g);
  const falta = ausenteDe(dia) === m.id;
  return { periodo: p, materia: m, sala: falta ? 'permanencia' : m.sala, permanencia: falta, desde: PERIODOS[p][0], hasta: PERIODOS[p][1] };
}

export function horarioDelDia(dia, g) {
  return PERIODOS.map((_, p) => {
    const m = materiaDe(dia, p, g);
    const falta = ausenteDe(dia) === m.id;
    return { periodo: p, desde: PERIODOS[p][0], hasta: PERIODOS[p][1], materia: m, sala: falta ? 'permanencia' : m.sala, permanencia: falta };
  });
}

// Descripción sencilla (para el panel y el asistente)
export function queHaceAlumno(a, dia, min) {
  if (min >= HORAS.dormir || min < HORAS.despertar) return { texto: 'Duerme en la residencia', lugar: a.hab };
  if (min < HORAS.clases) return { texto: 'Se despierta y se prepara', lugar: a.hab };
  const c = claseDeGrupo(dia, min, a.grupo);
  if (c) return c.permanencia
    ? { texto: `Está en la permanencia (falta el profesor de ${c.materia.nombre})`, lugar: 'permanencia' }
    : { texto: `Tiene clase de ${c.materia.nombre}`, lugar: c.sala };
  if (min >= HORAS.recreo && min < HORAS.finRecreo) return { texto: 'Está en el recreo, en el patio', lugar: 'patio' };
  if (min >= HORAS.comida && min < HORAS.tarde) return { texto: 'Es la hora de la comida', lugar: 'comedor' };
  if (min >= HORAS.finClases && min < aMin('19:50')) return { texto: 'Tiempo libre después de las clases', lugar: null };
  return { texto: 'Está en la residencia antes de dormir', lugar: 'salonres' };
}
