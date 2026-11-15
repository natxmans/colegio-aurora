// =========================================================
// EL RELOJ DE LA SIMULACIÓN (hora del colegio virtual) + LUZ DEL DÍA
// · reloj.min: minutos desde medianoche (0 a 1440), reloj.dia: lunes = 0 ... viernes = 4
// · el visitante elige la velocidad, pone en pausa o salta a una hora
// · cuando muchos alumnos caminan, el tiempo va más despacio: así se les ve
//   caminar de verdad (sin teletransporte) y llegan a tiempo a clase
// =========================================================

export const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
// minutos simulados por segundo real
export const RITMOS = {
  lento: { t: 'Lento', v: 0.2, paso: 1.35 },
  normal: { t: 'Normal', v: 0.5, paso: 1.45 },
  rapido: { t: 'Rápido', v: 2, paso: 2.3 },
  muyrapido: { t: 'Muy rápido', v: 8, paso: 3.4 },
  real: { t: 'Hora real', v: 1 / 60, paso: 1.3 },
};

export const reloj = {
  min: 9 * 60 + 52,   // empieza poco antes del recreo
  dia: 0,
  ritmo: 'normal',
  pausa: false,
  efectivo: 0.5,      // velocidad real en este momento (min/s)
  saltos: 0,          // cuenta los saltos manuales (la simulación recoloca a las personas)
  todosDuermen: false,
};

const oyentes = new Set();
let ultimoMin = -1;
export function escuchar(f) { oyentes.add(f); return () => oyentes.delete(f); }
export function avisar() { ultimoMin = Math.floor(reloj.min); oyentes.forEach(f => f()); }

const suave = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// Velocidad a la que caminan las personas (metros por segundo REAL)
export function pasoVisual() { return RITMOS[reloj.ritmo].paso; }

// Avanza el reloj. fraccion = parte de los alumnos que están caminando ahora
export function avanzar(dt, fraccion) {
  if (reloj.pausa) { reloj.efectivo = 0; return 0; }
  const R = RITMOS[reloj.ritmo];
  let base = R.v;
  // de noche, cuando todos duermen, el tiempo pasa más deprisa (salvo en "hora real")
  if (reloj.todosDuermen && reloj.ritmo !== 'real') base *= 6;
  // ritmo de una persona que camina de verdad (1,4 m/s): el reloj lo sigue si muchos caminan
  const andar = Math.max(R.paso / (1.4 * 60), base * 0.02);
  const f = reloj.ritmo === 'real' ? 0 : suave(0.1, 0.35, fraccion);
  const objetivo = base * (1 - f) + Math.min(base, andar) * f;
  reloj.efectivo += (objetivo - reloj.efectivo) * (1 - Math.exp(-dt * 4));
  const dm = reloj.efectivo * dt;
  reloj.min += dm;
  if (reloj.min >= 1440) { reloj.min -= 1440; reloj.dia = (reloj.dia + 1) % 5; }
  if (Math.floor(reloj.min) !== ultimoMin) avisar();
  return dm;
}

export function ponerRitmo(r) { reloj.ritmo = r; reloj.pausa = false; avisar(); }
export function alternarPausa() { reloj.pausa = !reloj.pausa; avisar(); }

// Salto manual a una hora (si la hora ya pasó hoy, se va al día siguiente)
export function saltarA(min, mismoDia = false) {
  if (!mismoDia && min < reloj.min - 1) reloj.dia = (reloj.dia + 1) % 5;
  reloj.min = min;
  reloj.saltos++;
  avisar();
}

// Pasar al día siguiente (de lunes a viernes; el fin de semana los alumnos están en casa): 07:30, antes del despertar
export function diaSiguiente() {
  reloj.dia = (reloj.dia + 1) % 5;
  saltarA(7 * 60 + 30, true);
}

export function hora(min = reloj.min) {
  const m = Math.floor(min) % 1440;
  return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
}
export const aMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

// ---------------- LA LUZ DEL DÍA ----------------
// El sol sale hacia las 7:30 y se pone hacia las 20:00. Devuelve todo lo que necesita la escena.
const AMANECER = 7.5 * 60, OCASO = 20 * 60;
export function luz(min = reloj.min) {
  const dur = OCASO - AMANECER;
  let el, az;
  if (min >= AMANECER && min <= OCASO) {
    const u = (min - AMANECER) / dur;
    el = Math.sin(u * Math.PI) * 0.95;           // altura del sol (radianes)
    az = -Math.PI * 0.5 + u * Math.PI;            // de este a oeste
  } else {
    const resto = 1440 - dur;
    const u = ((min - OCASO + 1440) % 1440) / resto;
    el = -Math.sin(u * Math.PI) * 0.7;
    az = Math.PI * 0.5 + u * Math.PI;
  }
  const dia = suave(-0.1, 0.18, el);             // 0 de noche · 1 de día
  const oscuridad = 1 - suave(-0.16, 0.06, el);  // farolas y ventanas (se encienden antes)
  const crepusculo = Math.max(0, 1 - Math.abs(el - 0.0) / 0.22) * (1 - suave(0.2, 0.3, el));
  return { el, az, dia, oscuridad, crepusculo };
}
