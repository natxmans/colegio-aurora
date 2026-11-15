// =========================================================
// LA VIDA DEL COLEGIO: simulación autónoma de alumnos, profesores y personal
// Cada persona tiene una rutina ligada a la HORA de la simulación:
//   ¿qué toca ahora? → ¿a qué sitio voy? → camino (A*) → caminar → actividad.
// Nadie se teletransporta mientras el tiempo avanza: todos caminan por los
// pasillos, las puertas y las escaleras. (Solo cuando el visitante salta a otra
// hora, todos aparecen directamente donde deben estar.)
// =========================================================
import { reloj, avanzar, pasoVisual, aMin } from './reloj.js';
import { NAV, buscar, cercaLibre, libre, altura } from './navegacion.js';
import { ALUMNOS, PROFES, PERSONAL, GRUPOS, repartir, claseDeGrupo, HORAS, azar, PERIODOS, ausenteDe, materiaDe } from './horario.js';
import { ANIM, nuevaPose, mezclar, P } from './cuerpo.js';
import { SALAS, aMundo } from '../datos/salas.js';

export const SIM = {
  listo: false, personas: [], puntos: [], balones: [], stats: { caminos: 0, sinCamino: 0, ms: 0 },
  ocupadas: new Map(), version: 0, tReal: 0, ultimoSalto: -1,
};
const PI = Math.PI;
const TAU = PI * 2;
const lerp = (a, b, k) => a + (b - a) * k;
const angDif = (a, b) => { let d = (b - a) % TAU; if (d > PI) d -= TAU; if (d < -PI) d += TAU; return d; };
const capaDeY = (x, y) => (y > 3.0 ? (x < -40 ? 2 : 1) : 0);

// ---------------- PUNTOS ----------------
let PT = {}; // PT[sala][tipo] = [puntos ordenados por i]
function indexar(puntos) {
  PT = {};
  for (const p of puntos) {
    p.capa = capaDeY(p.x, p.y);
    p.suelo = p.capa === 0 ? p.y : p.capa === 1 ? 4.2 : 3.8;
    if (p.t === 'cama') p.suelo = p.capa === 0 ? 0 : p.capa === 1 ? 4.2 : 3.8;
    ((PT[p.sala] ||= {})[p.t] ||= []).push(p);
  }
  for (const s in PT) for (const t in PT[s]) PT[s][t].sort((a, b) => a.i - b.i);
}
const lista = (sala, t) => (PT[sala] && PT[sala][t]) || [];
function punto(sala, t, i) { const l = lista(sala, t); return l.find(p => p.i === i) || l[i % Math.max(1, l.length)] || null; }
// Un punto libre de uno de los tipos (el preferido primero)
function puntoLibre(sala, tipos, per, pref = 0) {
  for (const t of [].concat(tipos)) {
    const l = lista(sala, t);
    if (!l.length) continue;
    for (let k = 0; k < l.length; k++) {
      const p = l[(pref + k) % l.length];
      if (!p.ocupado || p.ocupado === per) return p;
    }
  }
  return null;
}
function llegada(p) {
  if (p.ax != null) {
    if (libre(p.capa, p.ax, p.az)) return [p.ax, p.az];
    const c = cercaLibre(p.capa, p.ax, p.az, 1.2); if (c) return c;
  }
  return cercaLibre(p.capa, p.x, p.z, 2.5) || [p.x, p.z];
}

// ---------------- PERSONAS ----------------
function persona(tipo, d) {
  const r = azar(d.i ?? d.k ?? 1);
  return {
    tipo, d, id: d.id, x: 0, y: 0, z: 0, capa: 0, yaw: 0, pitch: 0, rx: 0,
    estado: 'fuera', ruta: null, ri: 0, dest: null, punto: null, trans: null, juego: null,
    pose: nuevaPose(), pA: nuevaPose(), pB: nuevaPose(), animA: 'pie', animB: 'pie', k: 1,
    fase: 0, f: r() * 20, mirar: 0, asiento: 0.45, ropa: tipo === 'alumno' ? 'uniforme' : 'adulto',
    planId: '', sub: 0, subT: 0, espera: 0, pedir: false, visible: false, accion: 'pie', sala: null,
    lado: 0, lt: 0, cuenta: 0, prop: null, texto: '',
  };
}

export function iniciar(puntos, nAlumnos) {
  SIM.puntos = puntos;
  indexar(puntos);
  const activos = repartir(nAlumnos);
  SIM.personas = [
    ...activos.map(a => persona('alumno', a)),
    ...PROFES.map(p => persona('profe', p)),
    ...PERSONAL.map(p => persona('personal', p)),
  ];
  SIM.alumnos = SIM.personas.filter(p => p.tipo === 'alumno');
  SIM.listo = true;
  colocarTodos();
}

// ---------------- EL PLAN: ¿qué toca ahora? ----------------
// Devuelve { id, dest: punto | {x,z,capa,yaw}, accion, ropa, sala, texto } o { id:'fuera' }
const jit = (per, dia, amp) => (azar(per.d.i * 31 + dia * 7 + (per.d.k || 0) * 13)() - 0.5) * 2 * amp;

function planAlumno(per, dia, m) {
  const a = per.d, j = jit(per, dia, 4);
  const hab = a.hab;
  if (m >= HORAS.dormir + j || m < HORAS.despertar + Math.abs(j) * 0.3)
    return { id: 'dormir', dest: punto(hab, 'cama', a.cama), accion: 'dormir', ropa: 'pijama', sala: hab, texto: 'Duerme' };
  if (m < HORAS.despertar + 6 + j * 0.2)
    return { id: 'vestirse', dest: punto(hab, 'armario', a.cama), accion: 'armario', ropa: 'pijama', ropaFin: 'uniforme', sala: hab, texto: 'Se levanta y se pone el uniforme' };
  if (m < HORAS.clases - 6 + j * 0.3) {
    // un sofá libre en la planta de su habitación; si no queda ninguno, prepara la mochila en su habitación
    const sala = hab.length > 5 ? 'estarres' : (a.i % 2 ? 'hallres' : 'salonres');
    const s = puntoLibre(sala, ['sofa'], per, a.i);
    if (s) return { id: 'manana', dest: s, accion: 'charlar_sentado', ropa: 'uniforme', sala, texto: 'Se reúne con los amigos en la residencia' };
    return { id: 'manana', dest: punto(hab, 'escritorio', a.cama), accion: 'escribir', ropa: 'uniforme', sala: hab, texto: 'Prepara la mochila en su habitación' };
  }
  // clases
  for (let p = 0; p < PERIODOS.length; p++) {
    const ini = p === 0 ? HORAS.clases - 6 : p === 2 ? HORAS.finRecreo - 3 : p === 4 ? HORAS.tarde - 5 : PERIODOS[p][0];
    if (m >= ini && m < PERIODOS[p][1]) {
      const c = claseDeGrupo(dia, PERIODOS[p][0], a.grupo);
      if (c.permanencia) return { id: 'clase' + p, dest: punto('permanencia', 'perma', a.num + (a.grupo % 2) * 12), accion: 'escribir', ropa: 'uniforme', sala: 'permanencia', clase: c, texto: `En la permanencia: falta el profesor de ${c.materia.nombre}` };
      if (c.materia.id === 'edfisica') return { id: 'clase' + p, dest: punto('gimnasio', 'ejercicio', a.num + (a.grupo % 2) * 6), accion: 'ejercicio', ropa: 'deporte', sala: 'gimnasio', clase: c, texto: 'Clase de Educación Física en el gimnasio' };
      return { id: 'clase' + p, dest: punto(c.sala, 'pupitre', a.num), accion: 'clase', ropa: 'uniforme', sala: c.sala, clase: c, texto: `Clase de ${c.materia.nombre}` };
    }
  }
  if (m >= HORAS.recreo && m < HORAS.finRecreo - 3) return { id: 'recreo', recreo: true, ropa: 'uniforme', sala: 'patio', texto: 'Recreo en el patio' };
  if (m >= HORAS.comida && m < HORAS.comida + 34 + j * 2)
    return { id: 'comida', dest: punto('comedor', 'comedor', a.mesa), accion: 'comer', ropa: 'uniforme', sala: 'comedor', texto: 'Come en el comedor' };
  if (m >= HORAS.comida && m < HORAS.tarde - 5) return libreDe(per, dia, 'mediodia', a.i % 3 === 0 ? 'patio' : a.lugar, 'uniforme');
  // tarde libre
  const t1 = aMin('18:30') + j, t2 = aMin('19:50') + j;
  if (m >= HORAS.finClases && m < t2) {
    prepararTarde(dia);
    const f = m < t1 ? 1 : 2, dep = tarde.get(a.id + ':' + f);
    if (dep) return deporteDe(per, dep);
    if (f === 1) return libreDe(per, dia, 'tarde1', a.lugar, 'uniforme');
    return libreDe(per, dia, 'tarde2', a.deportista > 0.42 && a.estudioso <= 0.5 ? a.lugar : 'estudio', 'uniforme');
  }
  if (m < HORAS.dormir - 22 + j) {
    const r = azar(a.i * 5 + dia)();
    // en el salón o en el rincón de estar si queda un sitio; si no, en su habitación
    const s = r < 0.45 ? puntoLibre('salonres', ['sofa', 'juego_mesa'], per, a.i) : r < 0.65 ? puntoLibre('estarres', ['sofa'], per, a.i) : null;
    if (s && s.sala === 'salonres') return { id: 'residencia', dest: s, accion: null, ropa: 'uniforme', sala: 'salonres', texto: 'En el salón de la residencia' };
    if (s) return { id: 'residencia', dest: s, accion: 'charlar_sentado', ropa: 'uniforme', sala: 'estarres', texto: 'Habla con los amigos en el rincón de estar' };
    return { id: 'residencia', dest: punto(hab, 'escritorio', a.cama), accion: a.estudioso > 0.5 ? 'escribir' : 'ordenador', ropa: 'uniforme', sala: hab, texto: 'En su habitación' };
  }
  if (m < HORAS.dormir - 12 + j) return { id: 'pijama', dest: punto(hab, 'armario', a.cama), accion: 'armario', ropa: 'uniforme', ropaFin: 'pijama', sala: hab, texto: 'Se prepara para dormir' };
  return { id: 'noche', dest: punto(hab, 'escritorio', a.cama), accion: 'leer', ropa: 'pijama', sala: hab, texto: 'Lee un poco antes de dormir' };
}

const SALA_LUGAR = { biblioteca: ['biblio', 'sillon', 'estante'], jardin: ['banco', 'paseo'], juegos: ['ping', 'futbolin', 'sofa'], lectura: ['sillon'], estudio: ['estudio'], salon2: ['sofa', 'sillon', 'mesa'], patio: ['banco', 'patio', 'ping', 'rayuela'] };
function libreDe(per, dia, id, lugar, ropa) {
  const tipos = SALA_LUGAR[lugar] || ['sofa'];
  let p = puntoLibre(lugar, tipos, per, (per.d.i * 3 + dia) % 7);
  if (!p && lugar !== 'patio') { p = puntoLibre('patio', ['banco', 'patio'], per, per.d.i * 5); if (p) lugar = 'patio'; }
  const textos = { biblioteca: 'Lee y trabaja en la biblioteca digital', jardin: 'Pasea por los jardines', juegos: 'Juega en la sala de juegos', lectura: 'Lee en el salón de lectura', estudio: 'Hace su trabajo en la sala de estudio', salon2: 'Descansa en el salón común', patio: 'Está en el patio con los amigos' };
  return { id: id + lugar, dest: p || { libre: 'patio' }, accion: null, ropa, sala: lugar, texto: textos[lugar] || 'Tiempo libre' };
}
// Deportes de la tarde con PLAZAS LIMITADAS: 8 calles en la piscina, 7 contra 7 en el fútbol,
// 5 contra 5 en el baloncesto, 20 puestos en el gimnasio. Si un deporte está lleno, el alumno
// elige otro con sitio o espera su turno mirando desde la grada.
const CUPO = { futbol: 14, baloncesto: 10, natacion: 8, gimnasio: 20 };
const DEPS = ['futbol', 'baloncesto', 'gimnasio', 'natacion'];
let tardeDia = -1;
const tarde = new Map();   // 'al12:1' → { dep, mira } (franja 1: 17:00-18:30, franja 2: 18:30-19:50)
function prepararTarde(dia) {
  if (tardeDia === dia) return;
  tardeDia = dia; tarde.clear();
  const r = azar(900 + dia * 17);
  const orden = [...SIM.alumnos];
  for (let k = orden.length - 1; k > 0; k--) { const q = Math.floor(r() * (k + 1)); [orden[k], orden[q]] = [orden[q], orden[k]]; }
  for (const f of [1, 2]) {
    const n = { futbol: 0, baloncesto: 0, natacion: 0, gimnasio: 0 };
    for (const per of orden) {
      const a = per.d;
      const quiere = f === 1 ? (a.deportista > 0.42 ? a.deporte : null)
        : (a.deportista <= 0.42 && a.deportista > 0.2 ? (a.deporte === 'futbol' ? 'gimnasio' : a.deporte) : null);
      if (!quiere) continue;
      let dep = quiere, mira = false;
      if (n[dep] >= CUPO[dep]) { const otro = r() < 0.5 ? DEPS.find(d => n[d] < CUPO[d]) : null; if (otro) dep = otro; else mira = true; }
      if (!mira) n[dep]++;
      tarde.set(a.id + ':' + f, { dep, mira });
    }
  }
}
function espectador(per, dep) {
  const sala = dep === 'natacion' ? 'piscina' : dep;
  const p = puntoLibre(sala, dep === 'baloncesto' ? ['banco'] : ['grada'], per, per.d.i * 3);
  const textos = { futbol: 'Mira el partido de fútbol desde la grada', baloncesto: 'Espera su turno para jugar al baloncesto', natacion: 'Espera su turno para nadar: todas las calles están ocupadas', gimnasio: 'Espera su turno en la grada del gimnasio' };
  if (p) return { id: 'mira' + dep, dest: p, accion: 'mirar', ropa: dep === 'natacion' ? 'uniforme' : 'deporte', sala, texto: textos[dep] };
  return libreDe(per, reloj.dia, 'tarde', per.d.lugar, 'uniforme');
}
function deporteDe(per, t) {
  const dep = t.dep;
  if (t.mira) return espectador(per, dep);
  if (dep === 'natacion') { const p = puntoLibre('piscina', ['carril'], per, per.d.i % 8); return p ? { id: 'natacion', dest: p, nadar: true, ropa: 'banador', sala: 'piscina', texto: 'Nada en la piscina olímpica' } : espectador(per, dep); }
  if (dep === 'futbol') return { id: 'futbol', juego: 'futbol', ropa: 'deporte', sala: 'futbol', texto: 'Juega al fútbol' };
  if (dep === 'baloncesto') return { id: 'baloncesto', juego: 'baloncesto', ropa: 'deporte', sala: 'baloncesto', texto: 'Juega al baloncesto' };
  const p = puntoLibre('gimnasio', ['ejercicio', 'colchoneta'], per, per.d.i % 15);
  if (!p) return espectador(per, 'gimnasio');
  return { id: 'gimnasio', dest: p, accion: p.t === 'colchoneta' ? 'estirar' : 'ejercicio', ropa: 'deporte', sala: 'gimnasio', texto: 'Hace ejercicio en el gimnasio' };
}

function planProfe(per, dia, m) {
  const pr = per.d;
  if (ausenteDe(dia) === pr.materia) return { id: 'fuera', texto: 'Hoy está ausente' };
  const llega = aMin('07:35') + pr.k * 1.2;
  const sale = pr.materia === 'edfisica' ? aMin('19:00') : aMin('17:06') + pr.k * 1.5;
  if (m < llega || m >= sale) return { id: 'fuera', texto: 'Está en su casa' };
  for (let p = 0; p < PERIODOS.length; p++) {
    const ini = PERIODOS[p][0] - 4, fin = PERIODOS[p][1];
    if (m >= ini && m < fin) {
      for (let g = 0; g < GRUPOS.length; g++) {
        if (materiaDe(dia, p, g).id === pr.materia) {
          const sala = pr.materia === 'edfisica' ? 'gimnasio' : materiaDe(dia, p, g).sala;
          return { id: 'clase' + p, profe: true, sala, dest: punto(sala, 'profe', 0), accion: 'explicar', ropa: 'adulto', texto: `Da clase de ${materiaDe(dia, p, g).nombre} a ${GRUPOS[g]}` };
        }
      }
    }
  }
  const turno = pr.k < 5 ? [aMin('12:24'), aMin('13:05')] : [aMin('13:06'), aMin('13:46')];
  if (m >= turno[0] && m < turno[1]) return { id: 'comida', dest: punto('comedor', 'comedorprof', pr.k % 6), accion: 'comer', ropa: 'adulto', sala: 'comedor', texto: 'Come en el comedor' };
  if (pr.materia === 'edfisica' && m >= HORAS.finClases) return { id: 'deportes', dest: { x: -1, z: -17.5, capa: 0, yaw: PI }, accion: 'vigilar', ropa: 'adulto', sala: 'futbol', texto: 'Vigila los deportes de la tarde' };
  return { id: 'profesores', dest: puntoLibre('profesores', ['sala_prof', 'sofa'], per, pr.k), accion: null, ropa: 'adulto', sala: 'profesores', texto: 'Prepara las clases en la sala de profesores' };
}

function planPersonal(per, dia, m) {
  const d = per.d;
  const dentro = d.desdeM < d.hastaM ? (m >= d.desdeM && m < d.hastaM) : (m >= d.desdeM || m < d.hastaM);
  if (!dentro) return { id: 'fuera', texto: 'No está en el colegio' };
  if (d.rol === 'vidaescolar' && ((m >= HORAS.recreo && m < HORAS.finRecreo) || (m >= aMin('13:00') && m < aMin('13:52'))))
    return { id: 'patio', dest: { x: -8, z: 30, capa: 0, yaw: -PI / 2 }, accion: 'vigilar', ropa: 'adulto', sala: 'patio', texto: 'Vigila el patio' };
  if (d.rol === 'educador' && m >= aMin('21:05') && m < aMin('21:30'))
    return { id: 'ronda' + (m % 10 < 5 ? 0 : 1), dest: { x: -52, z: (m % 10 < 5 ? -16 : 16), capa: d.i === 1 ? 2 : 0, yaw: 0 }, accion: 'vigilar', ropa: 'adulto', sala: 'residencia', texto: 'Hace una ronda por los pasillos: ¡a dormir!' };
  const mios = lista(d.sala, 'trabajo').filter(q => q.rol === d.rol);
  // los que vigilan una sala grande van de un puesto a otro (d.ronda = minutos en cada puesto)
  const p = d.ronda && mios.length > 1 ? mios[Math.floor(m / d.ronda) % mios.length]
    : mios.find(q => d.i == null || q.i === d.i) || mios[0] || lista(d.sala, 'trabajo')[0];
  return { id: 'trabajo' + (d.ronda && p ? p.i : ''), dest: p, accion: p && p.accion ? p.accion : 'atender', ropa: 'adulto', sala: d.sala, texto: d.texto || d.nombre };
}

function plan(per, dia, m) {
  if (per.tipo === 'alumno') return planAlumno(per, dia, m);
  if (per.tipo === 'profe') return planProfe(per, dia, m);
  return planPersonal(per, dia, m);
}

// ---------------- RECREO Y TIEMPO LIBRE: grupos de amigos ----------------
// Cada día, los alumnos se reparten en actividades de patio (siempre las mismas para ese día)
let recreoDia = -1, recreo = new Map();
function prepararRecreo(dia) {
  if (recreoDia === dia) return;
  recreoDia = dia; recreo = new Map();
  const r = azar(300 + dia * 11);
  const als = [...SIM.alumnos].sort(() => r() - 0.5);
  const sitios = lista('patio', 'patio').filter(p => libre(0, p.x, p.z));
  let s = 0;
  const tomarSitio = () => sitios[(s++ * 7) % Math.max(1, sitios.length)];
  let k = 0;
  while (k < als.length) {
    const x = r();
    if (x < 0.42 && als.length - k >= 3) { // corro de 3-4 amigos que charlan
      const n = Math.min(als.length - k, 3 + Math.floor(r() * 2)), c = tomarSitio();
      for (let q = 0; q < n; q++) {
        const ang = (q / n) * TAU + r() * 0.3;
        recreo.set(als[k + q].id, { tipo: 'corro', cx: c.x, cz: c.z, x: c.x + Math.sin(ang) * 0.78, z: c.z + Math.cos(ang) * 0.78, yaw: ang + PI });
      }
      k += n;
    } else if (x < 0.62 && als.length - k >= 2) { // dos amigos se pasan el balón
      const c = tomarSitio(), ang = r() * TAU, d = 2.4;
      const b = { x: c.x, y: 1, z: c.z, tipo: 'recreo', vis: true, t0: 0, de: 0, a: 1 };
      recreo.set(als[k].id, { tipo: 'pase', x: c.x + Math.sin(ang) * d, z: c.z + Math.cos(ang) * d, yaw: ang + PI, balon: b, yo: 0 });
      recreo.set(als[k + 1].id, { tipo: 'pase', x: c.x - Math.sin(ang) * d, z: c.z - Math.cos(ang) * d, yaw: ang, balon: b, yo: 1 });
      b.pos = [recreo.get(als[k].id), recreo.get(als[k + 1].id)];
      k += 2;
    } else if (x < 0.8) { recreo.set(als[k].id, { tipo: 'banco' }); k++; }
    else { recreo.set(als[k].id, { tipo: 'paseo', ruta: [tomarSitio(), tomarSitio(), tomarSitio()] }); k++; }
  }
}

// ---------------- PARTIDOS (fútbol y baloncesto) ----------------
const CAMPOS = {
  futbol: { x0: -28, x1: 26, z0: -54, z1: -24, cx: -1, cz: -39, porterias: [[-32.5, -39], [30.5, -39]], alto: 0.12, color: 'futbol' },
  baloncesto: { x0: 39, x1: 61, z0: -32.5, z1: -21.5, cx: 50, cz: -27, porterias: [[36.9, -27], [63.1, -27]], alto: 1.2, color: 'basket' },
};
const partidos = {};
function partido(tipo) {
  if (!partidos[tipo]) partidos[tipo] = { tipo, jugadores: [], balon: { x: CAMPOS[tipo].cx, y: 0.15, z: CAMPOS[tipo].cz, tipo: CAMPOS[tipo].color, vis: false }, dueno: -1, t: 0, vuelo: null };
  return partidos[tipo];
}

// ---------------- MOVIMIENTO ----------------
const cola = [];
function pedirCamino(per, x, z, capa) {
  per.pedir = { x, z, capa };
  if (!cola.includes(per)) cola.push(per);
}
function procesarCola() {
  const t0 = performance.now();
  while (cola.length && performance.now() - t0 < 4) {
    const per = cola.shift();
    const q = per.pedir; if (!q) continue;
    per.pedir = null;
    const r = buscar({ x: per.x, z: per.z, capa: per.capa }, q);
    SIM.stats.caminos++;
    if (!r) {
      // sin camino: se espera un poco y se vuelve a intentar (nunca se atraviesa un muro)
      SIM.stats.sinCamino++;
      per.fallos = (per.fallos || 0) + 1;
      if (per.fallos < 4) { per.estado = 'quieto'; per.ruta = null; per.reintento = { t: SIM.tReal + 1 + per.fallos, q }; continue; }
      // último recurso (muy raro): aparece directamente en su destino
      SIM.stats.recolocados = (SIM.stats.recolocados || 0) + 1;
      (SIM.stats.ultimosRecolocados ||= []).push([per.id, Math.round(reloj.min), +per.x.toFixed(1), +per.z.toFixed(1), per.capa, +q.x.toFixed(1), +q.z.toFixed(1), q.capa, per.planId]);
      per.fallos = 0; per.x = q.x; per.z = q.z; per.capa = q.capa; per.y = altura(q.capa, q.x, q.z);
      per.ruta = []; per.ri = 0; per.estado = 'andando';
      continue;
    }
    per.fallos = 0; per.ruta = r; per.directo = false;
    per.ri = 1; per.estado = 'andando';
  }
}

function soltar(per) { if (per.punto && per.punto.ocupado === per) per.punto.ocupado = null; per.punto = null; }

// Ir a un destino (punto de la maqueta o posición libre)
function ir(per, dest, accion, extra = {}) {
  soltar(per);
  per.juego = null;
  const nadando = per.nadar && (per.estado === 'nadando' || (per.estado === 'trans' && per.trans && per.trans.tipo === 'zambullida'));
  if (nadando && per.nadar.punto && !per.nadar.punto.ocupado) per.nadar.punto.ocupado = per;  // la calle sigue ocupada hasta que sale
  if (!nadando) per.nadar = null;
  let x, z, capa, sentarse = null, yaw = dest.yaw ?? per.yaw;
  if (dest.t) { // un punto de la maqueta
    per.punto = dest; dest.ocupado = per;
    const [ax, az] = llegada(dest);
    x = ax; z = az; capa = dest.capa;
    if (dest.asiento > 0 || dest.t === 'cama') sentarse = dest;
  } else { x = dest.x; z = dest.z; capa = dest.capa ?? 0; }
  per.dest = { x, z, capa, yaw, sentarse, accion: accion || (dest.accion) || 'pie', punto: dest.t ? dest : null, ...extra };
  if (per.estado === 'sentado' || per.estado === 'tumbado') { levantarse(per); return; }
  if (nadando) { per.nadar.saliendo = true; return; }
  pedirCamino(per, x, z, capa);
}

function poner(per, anim, rapido = 0.35) {
  if (per.animB === anim) return;
  per.pA.set(per.pose); per.animA = '_congelada'; per.animB = anim; per.k = 0; per.dk = 1 / rapido;
}

function levantarse(per) {
  const s = per.sentadoEn;
  if (!s) { per.estado = 'quieto'; return irDespues(per); }
  const [ax, az] = llegada(s);
  per.trans = { tipo: 'levantarse', t: 0, dur: s.t === 'cama' ? 1.6 : 0.8, de: { x: per.x, z: per.z, yaw: per.yaw, y: per.y, pitch: per.pitch }, a: { x: ax, z: az, yaw: per.yaw, y: s.suelo, pitch: 0 }, cama: s.t === 'cama' };
  per.estado = 'trans'; poner(per, 'pie', per.trans.dur * 0.8);
}
function irDespues(per) { if (per.dest) pedirCamino(per, per.dest.x, per.dest.z, per.dest.capa); }

// Posición sentada / tumbada en un punto
function posicionSentado(s) {
  const fx = Math.sin(s.yaw), fz = Math.cos(s.yaw);
  if (s.t === 'cama') return { x: s.x + fx * 0.88, z: s.z + fz * 0.88, y: s.y + 0.1, yaw: s.yaw, pitch: -PI / 2 };
  const atras = s.t === 'sofa' || s.t === 'sillon' ? -0.14 : s.t === 'banco' ? -0.06 : -0.03;
  return { x: s.x + fx * atras, z: s.z + fz * atras, y: s.suelo, yaw: s.yaw, pitch: 0 };
}
function sentarseEn(per, s) {
  // antes de acostarse, siempre con el pijama puesto
  if (s.t === 'cama' && per.tipo === 'alumno') vestir(per, 'pijama');
  const fin = posicionSentado(s);
  per.trans = { tipo: s.t === 'cama' ? 'acostarse' : 'sentarse', t: 0, dur: s.t === 'cama' ? 1.8 : 0.85, de: { x: per.x, z: per.z, yaw: per.yaw, y: per.y, pitch: 0 }, a: fin, cama: s.t === 'cama' };
  per.estado = 'trans';
  per.capa = s.capa;
  per.asiento = s.asiento || 0.45;
  per.sentadoEn = s;
  poner(per, s.t === 'cama' ? 'dormir' : animSentado(per), per.trans.dur * 0.85);
}
function animSentado(per) {
  const a = per.dest && per.dest.accion;
  if (a && ANIM[a] && a !== 'pie') return a;
  return 'sentado';
}

// Ropa (se cambia en el armario, al entrar en el gimnasio o en la piscina)
function vestir(per, ropa) { if (ropa && per.ropa !== ropa) { per.ropa = ropa; SIM.version++; } }

// ---------------- CADA PERSONA, EN CADA IMAGEN ----------------
function actualizarPlan(per, dia, m) {
  const pl = plan(per, dia, m);
  if (pl.id === per.planId) { per.texto = pl.texto; return; }
  if (per.plan && per.plan.ropaFin && per.tipo === 'alumno') vestir(per, per.plan.ropaFin);
  if (per.tipo === 'alumno' && pl.ropa === 'uniforme' && per.ropa === 'pijama') vestir(per, 'uniforme');
  per.planId = pl.id; per.plan = pl; per.texto = pl.texto; per.sub = 0; per.subT = SIM.tReal;
  if (pl.id === 'fuera') { salir(per); return; }
  if (per.estado === 'fuera') entrar(per);
  // al salir del gimnasio o de la piscina se vuelve a poner el uniforme (vestuarios)
  if (per.tipo === 'alumno' && pl.ropa === 'uniforme' && (per.ropa === 'deporte' || per.ropa === 'banador')) vestir(per, 'uniforme');
  if (pl.recreo) { prepararRecreo(dia); return irRecreo(per); }
  if (pl.juego) return irJuego(per, pl.juego);
  if (pl.nadar && pl.dest) return ir(per, pl.dest, 'pie', { nadar: true });
  if (pl.dest && pl.dest.libre) return ir(per, puntoLibre('patio', ['patio', 'banco'], per, per.d.i * 5) || { x: -15, z: 20, capa: 0 }, 'charlar');
  if (!pl.dest) return;
  ir(per, pl.dest, pl.accion);
}

function irRecreo(per) {
  const r = recreo.get(per.id) || { tipo: 'banco' };
  if (r.tipo === 'banco') { const p = puntoLibre('patio', 'banco', per, per.d.i * 3); if (p) return ir(per, p, 'charlar_sentado'); }
  if (r.tipo === 'paseo') return ir(per, r.ruta[0], 'pie', { paseo: r.ruta, pi: 0 });
  if (r.tipo === 'pase') return ir(per, { x: r.x, z: r.z, capa: 0, yaw: r.yaw }, 'pasar', { pase: r });
  return ir(per, { x: r.x, z: r.z, capa: 0, yaw: r.yaw }, 'charlar', { corro: r });
}

function irJuego(per, tipo) {
  const c = CAMPOS[tipo], pa = partido(tipo);
  const n = pa.jugadores.length;
  const x = c.cx + (n % 2 ? 1 : -1) * (3 + (n % 5) * 3), z = c.cz + ((n * 7) % 5 - 2) * (c.z1 - c.z0) / 6;
  ir(per, { x, z, capa: 0, yaw: n % 2 ? -PI / 2 : PI / 2 }, 'pie', { juego: tipo });
}

function entrar(per) {
  // llega por la puerta del campus
  per.x = (per.d.k % 2 ? 1.5 : -1.5); per.z = 72; per.capa = 0; per.y = 0; per.yaw = PI; per.pitch = 0;
  per.estado = 'quieto'; per.visible = true; per.sentadoEn = null;
}
function salir(per) {
  soltar(per);
  if (per.estado === 'fuera') return;
  per.dest = { x: (per.d.k % 2 ? 1.5 : -1.5), z: 74, capa: 0, yaw: 0, accion: 'pie', fuera: true };
  if (per.estado === 'sentado' || per.estado === 'tumbado') levantarse(per);
  else pedirCamino(per, per.dest.x, per.dest.z, 0);
}

function salirAgua(per) {
  const n = per.nadar;
  if (!n) { per.estado = 'quieto'; return irDespues(per); }
  n.saliendo = true;
}

// ¿qué hace al llegar?
function alLlegar(per) {
  const d = per.dest;
  per.ruta = null;
  // seguridad: si el destino está lejos (o en otra planta), se pide un camino en vez de «llegar»
  // (así nadie se desliza ni se teletransporta hasta su silla). Tras 2 intentos se acepta.
  if (d && !d.fuera && (Math.hypot(per.x - d.x, per.z - d.z) > 1.6 || (d.capa != null && d.capa !== per.capa)) && (per.lejos || 0) < 2) {
    per.lejos = (per.lejos || 0) + 1; per.estado = 'quieto';
    if (!per.pedir) pedirCamino(per, d.x, d.z, d.capa ?? per.capa);
    return;
  }
  per.lejos = 0;
  if (d && d.capa != null) per.capa = d.capa;
  if (!d) { per.estado = 'quieto'; return; }
  if (d.fuera) { per.estado = 'fuera'; per.visible = false; return; }
  if (d.nadar && d.punto) return zambullirse(per, d.punto);
  if (d.sentarse) return sentarseEn(per, d.sentarse);
  per.estado = 'quieto';
  per.yawObj = d.yaw;
  if (d.juego) { const pa = partido(d.juego); if (!pa.jugadores.includes(per)) pa.jugadores.push(per); per.juego = pa; if (per.tipo === 'alumno') vestir(per, 'deporte'); poner(per, 'pie'); return; }
  if (d.punto && d.punto.sala === 'gimnasio') vestir(per, per.plan && per.plan.ropa);
  poner(per, accionDe(per, d.accion));
}
function accionDe(per, a) {
  if (a === 'clase') return 'mirar';
  if (!a || !ANIM[a]) return 'pie';
  return a;
}

// La piscina: lanzarse al agua y nadar a lo largo de la calle
function zambullirse(per, p) {
  vestir(per, 'banador');
  const calle = p.i;
  per.nadar = { calle, zc: p.z, dir: 1, x: 16.2, saliendo: false, punto: p };
  per.trans = { tipo: 'zambullida', t: 0, dur: 0.9, de: { x: per.x, z: per.z, yaw: per.yaw, y: per.y, pitch: 0 }, a: { x: 16.6, z: p.z, yaw: PI / 2, y: -0.05, pitch: PI / 2 } };
  per.estado = 'trans'; poner(per, 'nadar', 0.6);
}

function moverNadando(per, dt) {
  const n = per.nadar, v = Math.min(2.2, 1.0 * pasoVisual() / 1.45) * (per.d.paso || 1);
  if (n.giro > 0) { n.giro -= dt; per.yaw += angDif(per.yaw, n.dir > 0 ? PI / 2 : -PI / 2) * Math.min(1, dt * 5); return; }
  per.x += n.dir * v * dt; per.fase += v * dt / 1.6 * TAU;
  if (n.dir > 0 && per.x > 63.6) { n.dir = -1; n.giro = 0.6; }
  if (n.dir < 0 && per.x < 16.4) {
    if (n.saliendo) {
      const p = n.punto;
      per.trans = { tipo: 'salida', t: 0, dur: 1.0, de: { x: per.x, z: per.z, yaw: per.yaw, y: per.y, pitch: per.pitch }, a: { x: p.x, z: p.z, yaw: -PI / 2, y: 0.2, pitch: 0 } };
      per.estado = 'trans'; poner(per, 'pie', 0.7); return;
    }
    n.dir = 1; n.giro = 0.6;
  }
  per.z = n.zc; per.y = -0.05 + 0.03 * Math.sin(per.fase);
}

// Transiciones (sentarse, levantarse, acostarse, zambullirse...)
function moverTrans(per, dt) {
  const tr = per.trans;
  tr.t += dt / tr.dur;
  const k = Math.min(1, tr.t), e = k * k * (3 - 2 * k);
  const de = tr.de, a = tr.a;
  if (tr.tipo === 'acostarse') {
    // primero se sienta en el borde de la cama, luego se tumba
    const k1 = Math.min(1, k * 2), k2 = Math.max(0, k * 2 - 1);
    per.x = lerp(de.x, a.x, k1 * 0.5 + k2 * 0.5); per.z = lerp(de.z, a.z, k1 * 0.5 + k2 * 0.5);
    per.yaw = de.yaw + angDif(de.yaw, a.yaw) * e; per.pitch = lerp(0, a.pitch, k2 * k2 * (3 - 2 * k2)); per.y = lerp(de.y, a.y, k1);
  } else if (tr.tipo === 'levantarse' && tr.cama) {
    const k1 = Math.min(1, k * 2), k2 = Math.max(0, k * 2 - 1);
    per.pitch = lerp(de.pitch, 0, k1); per.x = lerp(de.x, a.x, e); per.z = lerp(de.z, a.z, e); per.y = lerp(de.y, a.y, k2);
  } else {
    per.x = lerp(de.x, a.x, e); per.z = lerp(de.z, a.z, e); per.y = lerp(de.y, a.y, e);
    per.yaw = de.yaw + angDif(de.yaw, a.yaw) * e; per.pitch = lerp(de.pitch || 0, a.pitch || 0, e);
  }
  if (k >= 1) {
    per.trans = null;
    if (tr.tipo === 'sentarse') { per.estado = 'sentado'; }
    else if (tr.tipo === 'acostarse') { per.estado = 'tumbado'; }
    else if (tr.tipo === 'zambullida') { per.estado = 'nadando'; }
    else if (tr.tipo === 'salida') { const cl = per.nadar && per.nadar.punto; if (cl && cl.ocupado === per && per.punto !== cl) cl.ocupado = null; per.nadar = null; per.estado = 'quieto'; vestir(per, 'deporte'); irDespues(per); }
    else if (tr.tipo === 'levantarse') { per.estado = 'quieto'; per.sentadoEn = null; per.pitch = 0; if (per.dest) { if (per.dest.nadar && per.dest.punto) pedirCamino(per, per.dest.x, per.dest.z, per.dest.capa); else irDespues(per); } }
  }
}

// Caminar a lo largo del camino (con un pequeño desvío para no chocar con los demás)
const REJ = new Map();
function claveRej(x, z) { return (Math.floor(x / 2) * 1000 + Math.floor(z / 2)); }
function moverAndando(per, dt, v) {
  const r = per.ruta;
  // fin del camino antiguo, pero el nuevo todavía se está calculando: se espera (nunca se «llega» de lejos)
  if (!r || per.ri >= r.length) { if (per.pedir) { per.ruta = null; per.estado = 'quieto'; return; } return alLlegar(per); }
  const p = r[per.ri], prev = r[per.ri - 1] || p;
  let dx = p.x - per.x, dz = p.z - per.z;
  const dist = Math.hypot(dx, dz);
  // escalera: la altura sube o baja poco a poco
  if (p.esc) {
    const L = Math.hypot(p.x - prev.x, p.z - prev.z) || 1;
    const t = 1 - Math.min(1, dist / L);
    const y0 = altura(prev.capa, prev.x, prev.z), y1 = altura(p.capa, p.x, p.z);
    per.y = lerp(y0, y1, t);
    per.capa = t > 0.5 ? p.capa : prev.capa;
  }
  if (dist < 0.12) {
    per.capa = p.capa; per.ri++;
    if (per.ri >= r.length) alLlegar(per);
    return;
  }
  dx /= dist; dz /= dist;
  // evitar a los demás
  let lx = 0, lz = 0, freno = 1;
  const k0 = claveRej(per.x, per.z);
  for (const ox of [-1, 0, 1]) for (const oz of [-1, 0, 1]) {
    const l = REJ.get(k0 + ox * 1000 + oz); if (!l) continue;
    for (const o of l) {
      if (o === per || o.capa !== per.capa) continue;
      const ex = o.x - per.x, ez = o.z - per.z, d2 = ex * ex + ez * ez;
      if (d2 > 0.81 || d2 < 1e-6) continue;
      const d = Math.sqrt(d2), delante = (ex * dx + ez * dz) / d;
      if (delante > 0.2) {
        const lado = (ex * dz - ez * dx) > 0 ? -1 : 1;
        lx += -dz * lado * (0.9 - d) * 1.6; lz += dx * lado * (0.9 - d) * 1.6;
        if (d < 0.5 && delante > 0.8 && o.estado !== 'andando') freno = Math.min(freno, 0.55);
      }
    }
  }
  const paso = Math.min(dist, v * freno * dt);
  let nx = per.x + dx * paso + lx * dt, nz = per.z + dz * paso + lz * dt;
  if ((lx || lz) && !p.esc && !libre(per.capa, nx, nz)) { nx = per.x + dx * paso; nz = per.z + dz * paso; }
  const mov = Math.hypot(nx - per.x, nz - per.z);
  per.x = nx; per.z = nz;
  if (!p.esc) per.y += (altura(per.capa, per.x, per.z) - per.y) * Math.min(1, dt * 10);
  const objYaw = Math.atan2(dx, dz);
  per.yaw += angDif(per.yaw, objYaw) * Math.min(1, dt * 7);
  const corre = v > 2.3;
  per.fase += (mov / ((corre ? 2.1 : 1.32) * (per.d.alto || 0.92))) * TAU;
  poner(per, corre ? 'correr' : 'andar', 0.25);
}

// Sub-actividades dentro de un bloque (variedad: escribir, mirar, levantar la mano...)
function variar(per, dia, m) {
  const pl = per.plan;
  if (!pl || per.estado === 'andando' || per.estado === 'trans') return;
  const dur = (per.tipo === 'profe' ? 5 : 8) * (0.7 + (per.f % 1) * 0.6); // minutos simulados
  if (per.subM == null) per.subM = m;
  const pasado = ((m - per.subM) + 1440) % 1440;
  if (SIM.tReal - per.subT < 4 || pasado < dur) return;
  per.subT = SIM.tReal; per.subM = m; per.sub++;
  const r = azar(per.f * 100 + per.sub)();
  if (pl.accion === 'clase' && per.estado === 'sentado') {
    const sala = SALAS[pl.sala];
    const especial = per.sentadoEn && per.sentadoEn.accion;
    poner(per, r < 0.5 ? 'mirar' : r < 0.78 ? 'escribir' : (especial && ANIM[especial] ? especial : 'ordenador'), 0.6);
    return;
  }
  if (pl.profe && (per.estado === 'quieto' || per.estado === 'sentado') && !per.ruta) {
    const s = SALAS[pl.sala];
    if (pl.sala === 'gimnasio') { poner(per, r < 0.6 ? 'explicar' : 'vigilar', 0.5); return; }
    if (r < 0.45) { const p = punto(pl.sala, 'profe', 0); if (p) ir(per, p, 'explicar'); }
    else if (r < 0.6 && s) { const [x, , z] = aMundo(s, 0, 0, s.d / 2 - 0.75); ir(per, { x, z, capa: 0, yaw: (s.ry || 0) }, 'pizarra'); }
    else if (r < 0.85 && s && pl.sala !== 'musica') { const [x, , z] = aMundo(s, [-1.7, 0, 1.7][Math.floor(r * 30) % 3], 0, [-2.0, -0.5, 1.0][Math.floor(r * 70) % 3]); ir(per, { x, z, capa: 0, yaw: (s.ry || 0) + PI }, 'pie'); }
    else { const p = punto(pl.sala, 'mesaprof', 0); if (p && !p.ocupado) ir(per, p, 'sentado'); }
    return;
  }
  if (per.estado === 'sentado' && per.animB === 'leer' && r < 0.3) poner(per, 'sentado', 0.6);
  else if (per.estado === 'sentado' && per.animB === 'sentado' && pl.accion === 'leer') poner(per, 'leer', 0.6);
}

function actualizarPersona(per, dt, dia, m) {
  if (per.estado === 'fuera') return;
  if (per.reintento && SIM.tReal > per.reintento.t && per.estado === 'quieto') { const q = per.reintento.q; per.reintento = null; pedirCamino(per, q.x, q.z, q.capa); }
  const v = pasoVisual() * (per.d.paso || 1) * (per.tipo === 'alumno' ? 1 : 0.92);
  if (per.estado === 'andando') moverAndando(per, dt, v);
  else if (per.estado === 'trans') moverTrans(per, dt);
  else if (per.estado === 'nadando') moverNadando(per, dt);
  else if (per.estado === 'quieto') {
    if (per.yawObj != null && !per.juego) per.yaw += angDif(per.yaw, per.yawObj) * Math.min(1, dt * 4);
    if (per.dest && per.dest.paseo && !per.ruta && SIM.tReal - (per.espera || 0) > 4) {
      per.espera = SIM.tReal; const ruta = per.dest.paseo; per.dest.pi = (per.dest.pi + 1) % ruta.length;
      const q = ruta[per.dest.pi]; per.dest.x = q.x; per.dest.z = q.z; pedirCamino(per, q.x, q.z, 0);
    }
    if (per.dest && per.dest.corro) per.mirar = 0;
    if (per.dest && per.dest.pase) pase(per);
  }
  // el armario: al terminar, cambia de ropa
  const pl = per.plan;
  if (pl && pl.ropaFin && per.estado === 'quieto' && per.animB === 'armario' && SIM.tReal - per.subT > 2.5) { vestir(per, pl.ropaFin); per.subT = SIM.tReal; }
}

// Pasarse el balón en el recreo
function pase(per) {
  const r = per.dest.pase, b = r.balon;
  if (r.yo !== 0) return;
  if (!b.t0) { b.t0 = SIM.tReal; b.de = 0; b.a = 1; }
  const dur = 1.1, t = (SIM.tReal - b.t0) / dur;
  const A = b.pos[b.de], B = b.pos[b.a];
  if (t >= 1.6) { b.t0 = SIM.tReal; const x = b.de; b.de = b.a; b.a = x; return; }
  const k = Math.min(1, t);
  b.x = lerp(A.x, B.x, k); b.z = lerp(A.z, B.z, k); b.y = 1.2 + Math.sin(k * PI) * 1.4; b.vis = true;
}

// Partidos: los jugadores corren hacia el balón y se lo pasan
function jugar(pa, dt) {
  const c = CAMPOS[pa.tipo];
  const js = pa.jugadores.filter(p => p.juego === pa && p.estado === 'quieto');
  pa.jugadores = pa.jugadores.filter(p => p.juego === pa);
  const b = pa.balon;
  b.vis = js.length > 0;
  if (!js.length) return;
  pa.t += dt;
  if (pa.vuelo) {
    const v = pa.vuelo; v.t += dt / v.dur;
    const k = Math.min(1, v.t);
    b.x = lerp(v.x0, v.x1, k); b.z = lerp(v.z0, v.z1, k); b.y = lerp(v.y0, v.y1, k) + Math.sin(k * PI) * v.alto;
    if (k >= 1) { pa.vuelo = null; pa.dueno = v.para; if (v.gol) { b.x = c.cx; b.z = c.cz; pa.dueno = -1; } }
  } else if (pa.dueno < 0 || !js[pa.dueno % js.length]) {
    // el más cercano va a por el balón
    let mejor = 0, md = 1e9;
    js.forEach((p, i) => { const d = Math.hypot(p.x - b.x, p.z - b.z); if (d < md) { md = d; mejor = i; } });
    pa.dueno = mejor;
  }
  const dueno = pa.vuelo ? null : js[pa.dueno % js.length];
  js.forEach((p, i) => {
    let tx, tz;
    if (p === dueno) { tx = b.x; tz = b.z; }
    else {
      const lado = i % 2 ? 1 : -1, zona = (i * 0.37) % 1;
      tx = lerp(c.cx + lado * (c.x1 - c.x0) * 0.22, b.x, 0.45) + Math.sin(pa.t * 0.3 + i) * 3;
      tz = lerp(c.z0 + (c.z1 - c.z0) * zona, b.z, 0.35);
    }
    tx = Math.max(c.x0, Math.min(c.x1, tx)); tz = Math.max(c.z0, Math.min(c.z1, tz));
    const dx = tx - p.x, dz = tz - p.z, d = Math.hypot(dx, dz);
    const v = Math.min(pasoVisual() * 1.9, 4.2);
    if (d > 0.6) {
      const paso = Math.min(d - 0.4, v * dt);
      const nx = p.x + dx / d * paso, nz = p.z + dz / d * paso;
      if (libre(0, nx, nz)) { p.x = nx; p.z = nz; }
      p.yaw += angDif(p.yaw, Math.atan2(dx, dz)) * Math.min(1, dt * 6);
      p.fase += paso / 2.1 * TAU;
      poner(p, d > 2 ? 'correr' : 'andar', 0.3);
    } else {
      p.yaw += angDif(p.yaw, Math.atan2(b.x - p.x, b.z - p.z)) * Math.min(1, dt * 4);
      if (p === dueno && js.length > 1) {
        // pase o tiro
        if (!p.tiene) p.tiene = SIM.tReal;
        if (pa.tipo === 'baloncesto') { poner(p, 'botar', 0.2); b.x = p.x + Math.sin(p.yaw + 0.5) * 0.35; b.z = p.z + Math.cos(p.yaw + 0.5) * 0.35; b.y = 0.15 + Math.abs(Math.sin(SIM.tReal * 6)) * 0.75; }
        else { b.x = p.x + Math.sin(p.yaw) * 0.45; b.z = p.z + Math.cos(p.yaw) * 0.45; b.y = 0.12; poner(p, 'pie', 0.2); }
        if (SIM.tReal - p.tiene > 1.2 + (i % 3) * 0.4) {
          p.tiene = 0;
          const tiro = Math.random() < 0.18;
          if (tiro) {
            const [gx, gz] = c.porterias[i % 2];
            poner(p, pa.tipo === 'baloncesto' ? 'tirar' : 'patear', 0.15);
            pa.vuelo = { t: 0, dur: pa.tipo === 'baloncesto' ? 1.1 : 0.9, x0: b.x, z0: b.z, y0: b.y, x1: gx, z1: gz, y1: pa.tipo === 'baloncesto' ? 3.05 : 0.6, alto: pa.tipo === 'baloncesto' ? 2.6 : 0.6, para: -1, gol: true };
          } else {
            let q = Math.floor(Math.random() * js.length); if (q === i) q = (q + 1) % js.length;
            const o = js[q];
            poner(p, pa.tipo === 'baloncesto' ? 'tirar' : 'patear', 0.15);
            const d2 = Math.hypot(o.x - b.x, o.z - b.z);
            pa.vuelo = { t: 0, dur: Math.max(0.5, d2 / 9), x0: b.x, z0: b.z, y0: b.y, x1: o.x, z1: o.z, y1: pa.tipo === 'baloncesto' ? 1.2 : 0.12, alto: pa.tipo === 'baloncesto' ? 0.9 : 0.15, para: q };
          }
        }
      } else if (pa.tipo === 'futbol' && (i === 0 || i === 1) && js.length >= 8) poner(p, 'portero', 0.4);
      else poner(p, 'pie', 0.4);
    }
  });
}

// ---------------- COLOCAR A TODOS (al empezar o al saltar a otra hora) ----------------
export function colocarTodos() {
  for (const p of SIM.puntos) p.ocupado = null;
  for (const pa of Object.values(partidos)) { pa.jugadores = []; pa.vuelo = null; }
  recreoDia = -1;
  const dia = reloj.dia, m = reloj.min;
  for (const per of SIM.personas) {
    per.ruta = null; per.trans = null; per.juego = null; per.nadar = null; per.sentadoEn = null; per.pitch = 0;
    const pl = plan(per, dia, m);
    per.planId = pl.id; per.plan = pl; per.texto = pl.texto; per.subT = SIM.tReal;
    if (pl.id === 'fuera') { per.estado = 'fuera'; per.visible = false; continue; }
    per.visible = true;
    per.ropa = per.tipo === 'alumno' ? (pl.ropaFin && pl.ropa === 'pijama' ? 'pijama' : pl.ropa || 'uniforme') : 'adulto';
    let dest = pl.dest;
    if (pl.recreo) { prepararRecreo(dia); const r = recreo.get(per.id) || { tipo: 'banco' }; if (r.tipo === 'banco') dest = puntoLibre('patio', 'banco', per, per.d.i * 3); else if (r.tipo === 'paseo') dest = r.ruta[0]; else dest = { x: r.x, z: r.z, capa: 0, yaw: r.yaw }; }
    if (pl.juego) { const c = CAMPOS[pl.juego]; dest = { x: c.cx + ((per.d.i * 7) % 11 - 5) * 2.5, z: c.cz + ((per.d.i * 3) % 7 - 3) * 2, capa: 0, yaw: 0 }; }
    if (dest && dest.libre) dest = puntoLibre('patio', ['patio', 'banco'], per, per.d.i * 5);
    if (!dest) { per.x = -15; per.z = 20; per.capa = 0; per.y = 0; per.estado = 'quieto'; poner(per, 'pie', 0.01); continue; }
    if (dest.t) {
      if (dest.ocupado && dest.ocupado !== per) { const alt = puntoLibre(dest.sala, dest.t, per, dest.i); if (alt) dest = alt; }
      dest.ocupado = per; per.punto = dest;
      per.capa = dest.capa;
      if (pl.nadar) {
        vestir(per, 'banador');
        per.nadar = { calle: dest.i, zc: dest.z, dir: (per.d.i % 2) ? 1 : -1, x: 30, saliendo: false, punto: dest };
        per.x = 18 + (per.d.i * 13) % 44; per.z = dest.z; per.y = -0.05; per.yaw = per.nadar.dir > 0 ? PI / 2 : -PI / 2; per.pitch = PI / 2; per.estado = 'nadando';
        per.pB.fill(0); ANIM.nadar(per.pB, 0, per); per.pose.set(per.pB); per.animB = 'nadar'; per.k = 1;
        per.dest = { x: dest.x, z: dest.z, capa: 0, nadar: true, punto: dest };
        continue;
      }
      if (dest.asiento > 0 || dest.t === 'cama') {
        const s = posicionSentado(dest);
        Object.assign(per, { x: s.x, z: s.z, y: s.y, yaw: s.yaw, pitch: s.pitch, estado: dest.t === 'cama' ? 'tumbado' : 'sentado', sentadoEn: dest, asiento: dest.asiento || 0.45 });
        per.dest = { x: dest.x, z: dest.z, capa: dest.capa, accion: pl.accion || dest.accion, punto: dest, sentarse: dest };
        const an = dest.t === 'cama' ? 'dormir' : animSentado(per);
        per.animB = an; per.pB.fill(0); per.k = 1; (ANIM[an] || ANIM.sentado)(per.pose, 0, per);
        continue;
      }
      const [ax, az] = [dest.x, dest.z];
      Object.assign(per, { x: ax, z: az, y: dest.suelo ?? dest.y, yaw: dest.yaw, estado: 'quieto' });
    } else {
      Object.assign(per, { x: dest.x, z: dest.z, capa: dest.capa || 0, y: altura(dest.capa || 0, dest.x, dest.z), yaw: dest.yaw || 0, estado: 'quieto' });
    }
    per.dest = { ...(per.dest || {}), x: per.x, z: per.z, capa: per.capa, accion: pl.accion, punto: dest.t ? dest : null, juego: pl.juego, corro: null };
    if (pl.recreo) { const r = recreo.get(per.id); if (r && r.tipo === 'pase') per.dest.pase = r; if (r && r.tipo === 'corro') per.dest.corro = r; if (r && r.tipo === 'paseo') { per.dest.paseo = r.ruta; per.dest.pi = 0; } }
    if (pl.juego) { const pa = partido(pl.juego); pa.jugadores.push(per); per.juego = pa; }
    per.yawObj = per.yaw;
    const an = accionDe(per, pl.accion || (dest.accion));
    per.animB = an; per.k = 1; (ANIM[an] || ANIM.pie)(per.pose, 0, per);
  }
  SIM.version++;
}

// Prueba: ¿se puede llegar a pie a todos los puntos (sillas, camas, puestos...) desde el patio?
export function comprobarAccesos() {
  const malos = [];
  for (const p of SIM.puntos) {
    const [ax, az] = llegada(p);
    const r = buscar({ x: -15, z: 20, capa: 0 }, { x: ax, z: az, capa: p.capa });
    if (!r) malos.push([p.sala, p.t, p.i, +ax.toFixed(2), +az.toFixed(2), p.capa]);
  }
  return { total: SIM.puntos.length, malos };
}

// ---------------- UNA IMAGEN DE LA SIMULACIÓN ----------------
export function paso(dtReal) {
  if (!SIM.listo) return;
  const t0 = performance.now();
  const dt = Math.min(dtReal, 0.1);
  SIM.tReal += dt;
  // ¿cuántos alumnos caminan? (el reloj va más despacio para que se les vea caminar)
  // Si un alumno todavía va de camino a una clase que ya empieza, el reloj también espera (nadie llega tarde
  // porque el tiempo corre demasiado deprisa mientras él camina).
  let andan = 0, presentes = 0, duermen = 0, retrasados = 0;
  for (const p of SIM.alumnos) {
    if (p.estado !== 'fuera') presentes++;
    if (p.estado === 'andando' || p.pedir) { andan++; if (p.plan && p.plan.clase && reloj.min >= p.plan.clase.desde - 2) retrasados++; }
    if (p.estado === 'tumbado') duermen++;
  }
  reloj.todosDuermen = duermen === SIM.alumnos.length && (reloj.min > aMin('21:40') || reloj.min < aMin('07:40'));
  avanzar(dt, presentes ? Math.max(andan / presentes, retrasados ? 0.35 : 0) : 0);
  if (reloj.saltos !== SIM.ultimoSalto) { SIM.ultimoSalto = reloj.saltos; colocarTodos(); }
  const dia = reloj.dia, m = reloj.min;
  // rejilla de vecinos
  REJ.clear();
  for (const p of SIM.personas) { if (p.estado === 'fuera') continue; const k = claveRej(p.x, p.z); let l = REJ.get(k); if (!l) REJ.set(k, l = []); l.push(p); }
  SIM.ocupadas.clear();
  for (const per of SIM.personas) {
    actualizarPlan(per, dia, m);
    actualizarPersona(per, dt, dia, m);
    variar(per, dia, m);
    if (per.estado !== 'fuera' && per.estado !== 'andando' && per.plan && per.plan.sala) SIM.ocupadas.set(per.plan.sala, (SIM.ocupadas.get(per.plan.sala) || 0) + 1);
  }
  for (const pa of Object.values(partidos)) jugar(pa, dt);
  procesarCola();
  // balones visibles
  const bs = [];
  for (const pa of Object.values(partidos)) if (pa.balon.vis) bs.push(pa.balon);
  for (const r of recreo.values()) if (r.balon && r.yo === 0 && r.balon.vis && reloj.min >= HORAS.recreo && reloj.min < HORAS.finRecreo) bs.push(r.balon);
  SIM.balones = bs;
  const ms = performance.now() - t0, st = SIM.stats;
  st.ms = ms; st.n = (st.n || 0) + 1; st.suma = (st.suma || 0) + ms; if (ms > (st.max || 0)) st.max = ms;
}

// Postura final de cada persona (mezcla suave entre la animación anterior y la nueva)
export function animar(per, t, dt) {
  if (per.k < 1) per.k = Math.min(1, per.k + dt * (per.dk || 3));
  const f = ANIM[per.animB] || ANIM.pie;
  per.pB.fill(0);
  f(per.pB, t + per.f, per);
  if (per.k >= 1) per.pose.set(per.pB);
  else mezclar(per.pA, per.pB, per.k, per.pose);
}
