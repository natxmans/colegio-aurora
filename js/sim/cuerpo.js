// =========================================================
// EL CUERPO DE LAS PERSONAS: esqueleto articulado + animaciones
// Articulaciones: pelvis, columna (pecho), cuello, cabeza, hombros, codos,
// muñecas, caderas, rodillas y tobillos. Cada animación da los ángulos de
// cada articulación en cada momento; entre dos animaciones se hace una mezcla
// suave (nada de saltos). Al caminar, la fase del paso avanza con la distancia
// recorrida: los pies no resbalan por el suelo.
// Convenciones: la persona mira hacia +z; su lado izquierdo está en +x.
// Ángulo X negativo = hacia delante (brazos y piernas); rodilla positiva = flexión.
// =========================================================

// Índices de los parámetros de la postura
export const P = {
  RY: 0, RP: 1, RR: 2, PX: 3, PY: 4, PZ: 5, TX: 6, TY: 7, TZ: 8, NX: 9, HX: 10, HY: 11, HZ: 12,
  SLX: 13, SLY: 14, SLZ: 15, SRX: 16, SRY: 17, SRZ: 18, ELX: 19, ERX: 20,
  WLX: 21, WLZ: 22, WRX: 23, WRZ: 24, HLX: 25, HLZ: 26, HRX: 27, HRZ: 28,
  KLX: 29, KRX: 30, ALX: 31, ARX: 32, RZ: 33, OJOS: 34, N: 36,
};
const N = P.N;

// Esqueleto: [padre, x, y, z] (posición de la articulación en el sistema del padre)
export const J = { RAIZ: 0, PELVIS: 1, PECHO: 2, CUELLO: 3, CABEZA: 4, HL: 5, CL: 6, ML: 7, HR: 8, CR: 9, MR: 10, CDL: 11, RL: 12, TL: 13, CDR: 14, RR: 15, TR: 16 };
export const ESQ = [
  [-1, 0, 0, 0],
  [0, 0, 0.92, 0],
  [1, 0, 0.08, 0],
  [2, 0, 0.46, 0],
  [3, 0, 0.08, 0],
  [2, 0.2, 0.40, 0], [5, 0, -0.28, 0], [6, 0, -0.26, 0],
  [2, -0.2, 0.40, 0], [8, 0, -0.28, 0], [9, 0, -0.26, 0],
  [1, 0.095, -0.04, 0], [11, 0, -0.41, 0], [12, 0, -0.40, 0],
  [1, -0.095, -0.04, 0], [14, 0, -0.41, 0], [15, 0, -0.40, 0],
];

export const nuevaPose = () => { const o = new Float32Array(N); o[P.OJOS] = 1; return o; };
const s = Math.sin, c = Math.cos, mx = Math.max, ab = Math.abs;

// ---- ayudas ----
function base(o) { o.fill(0); o[P.OJOS] = 1; }
function brazos(o, xl, xr, abl = 0.08, abr = 0.08, el = -0.15, er = -0.15) {
  o[P.SLX] = xl; o[P.SRX] = xr; o[P.SLZ] = abl; o[P.SRZ] = -abr; o[P.ELX] = el; o[P.ERX] = er;
}
function sentar(o, asiento = 0.45) {
  o[P.RY] = asiento + 0.06 - 0.92; o[P.HLX] = o[P.HRX] = -1.52; o[P.KLX] = o[P.KRX] = 1.5; o[P.HLZ] = 0.06; o[P.HRZ] = -0.06;
}
function respirar(o, t, f = 1) { o[P.TX] += 0.012 * s(t * 1.6) * f; }

// Cada animación: (o, t, a) — t = tiempo (s), a = la persona (fase, mirar, asiento, semilla…)
export const ANIM = {
  pie(o, t, a) {
    base(o); brazos(o, 0.05 + 0.02 * s(t * 0.7 + a.f), 0.05 - 0.02 * s(t * 0.7 + a.f), 0.1, 0.1, -0.18, -0.18);
    o[P.PZ] = 0.03 * s(t * 0.35 + a.f); o[P.HLZ] = 0.03; o[P.HRZ] = -0.03;
    o[P.HY] = 0.35 * s(t * 0.23 + a.f) + (a.mirar || 0); o[P.HX] = 0.05 * s(t * 0.31 + a.f);
    respirar(o, t);
  },
  andar(o, t, a) {
    base(o); const f = a.fase, w = s(f), q = c(f);
    o[P.HLX] = 0.46 * w; o[P.HRX] = -0.46 * w;
    o[P.KLX] = 0.1 + 0.72 * mx(0, -q); o[P.KRX] = 0.1 + 0.72 * mx(0, q);
    o[P.ALX] = -0.18 * mx(0, -q) + 0.12 * mx(0, w); o[P.ARX] = -0.18 * mx(0, q) + 0.12 * mx(0, -w);
    brazos(o, -0.38 * w, 0.38 * w, 0.1, 0.1, -0.32 - 0.12 * mx(0, -w), -0.32 - 0.12 * mx(0, w));
    o[P.TY] = 0.07 * w; o[P.PY] = -0.06 * w; o[P.RY] = 0.022 * c(2 * f) - 0.012; o[P.TX] = 0.04;
    o[P.HY] = 0.15 * s(t * 0.4 + a.f) + (a.mirar || 0) * 0.5;
  },
  correr(o, t, a) {
    base(o); const f = a.fase, w = s(f), q = c(f);
    o[P.HLX] = 0.8 * w - 0.15; o[P.HRX] = -0.8 * w - 0.15;
    o[P.KLX] = 0.35 + 1.25 * mx(0, -q); o[P.KRX] = 0.35 + 1.25 * mx(0, q);
    o[P.ALX] = -0.25 * mx(0, -q); o[P.ARX] = -0.25 * mx(0, q);
    brazos(o, -0.75 * w, 0.75 * w, 0.12, 0.12, -1.45, -1.45);
    o[P.TX] = 0.16; o[P.TY] = 0.12 * w; o[P.RY] = 0.05 * ab(s(f)) - 0.03; o[P.HX] = -0.12;
  },
  // ---------- sentado ----------
  sentado(o, t, a) {
    base(o); sentar(o, a.asiento); brazos(o, -0.45, -0.45, 0.02, 0.02, -0.85, -0.85);
    o[P.HX] = -0.04 + 0.05 * s(t * 0.5 + a.f); o[P.HY] = 0.25 * s(t * 0.21 + a.f) + (a.mirar || 0); respirar(o, t);
  },
  mirar(o, t, a) { // mirando la pizarra, a veces levanta la mano
    ANIM.sentado(o, t, a); o[P.TX] = 0.04; o[P.HY] = 0.12 * s(t * 0.3 + a.f) + (a.mirar || 0);
    const m = mx(0, s(t * 0.09 + a.f * 3) - 0.93) * 14; // de vez en cuando
    if (m > 0) { o[P.SRX] = -0.45 - 2.3 * Math.min(1, m); o[P.SRZ] = -0.15; o[P.ERX] = -0.3; }
  },
  escribir(o, t, a) {
    base(o); sentar(o, a.asiento); o[P.TX] = 0.2;
    brazos(o, -0.55, -0.6, 0.02, -0.02, -1.3, -1.1 + 0.07 * s(t * 7 + a.f));
    o[P.WRX] = 0.25 * s(t * 9 + a.f); o[P.HX] = 0.36 + 0.03 * s(t * 0.8); o[P.HY] = 0.06 * s(t * 0.5 + a.f);
  },
  ordenador(o, t, a) {
    base(o); sentar(o, a.asiento); o[P.TX] = 0.08;
    brazos(o, -0.72, -0.72, -0.08, -0.08, -0.82 + 0.05 * s(t * 11 + a.f), -0.82 + 0.05 * s(t * 13 + a.f));
    o[P.WLX] = 0.2; o[P.WRX] = 0.2; o[P.HX] = 0.1; o[P.HY] = 0.08 * s(t * 0.3 + a.f);
  },
  microscopio(o, t, a) { ANIM.escribir(o, t, a); o[P.TX] = 0.42; o[P.HX] = 0.5; o[P.SLX] = -0.8; o[P.ELX] = -1.0; o[P.WLZ] = 0.4 * s(t * 0.7); },
  leer(o, t, a) {
    base(o); sentar(o, a.asiento); o[P.TX] = 0.06;
    brazos(o, -0.95, -0.95, -0.28, -0.28, -1.3, -1.3); o[P.HX] = 0.4 + 0.03 * s(t * 0.4); o[P.HY] = 0.03 * s(t * 0.2 + a.f);
    o[P.WLX] = -0.3; o[P.WRX] = -0.3;
  },
  comer(o, t, a) {
    base(o); sentar(o, a.asiento); o[P.TX] = 0.1;
    const k = mx(0, s(t * 1.3 + a.f)) ** 2;
    brazos(o, -0.5, -0.55 - 0.35 * k, 0.04, 0.12, -1.0, -1.05 - 1.05 * k);
    o[P.HX] = 0.15 - 0.12 * k; o[P.HY] = 0.35 * s(t * 0.27 + a.f) + (a.mirar || 0) * 0.5;
  },
  charlar_sentado(o, t, a) {
    base(o); sentar(o, a.asiento);
    brazos(o, -0.35, -0.5 + 0.2 * s(t * 1.3 + a.f), 0.04, 0.08, -0.85, -1.2 + 0.35 * s(t * 1.7 + a.f));
    o[P.HY] = 0.45 * s(t * 0.33 + a.f) + (a.mirar || 0); o[P.HX] = 0.05 * s(t * 0.9); respirar(o, t);
  },
  tele(o, t, a) {
    base(o); sentar(o, a.asiento); o[P.TX] = -0.14; brazos(o, -0.3, -0.3, -0.05, -0.05, -0.7, -0.7);
    o[P.HX] = -0.06; o[P.HY] = 0.08 * s(t * 0.15 + a.f); respirar(o, t);
  },
  juego_mesa(o, t, a) {
    base(o); sentar(o, a.asiento); o[P.TX] = 0.22;
    const k = mx(0, s(t * 0.8 + a.f) - 0.6) * 2.5;
    brazos(o, -0.6, -0.65 - 0.3 * k, 0.0, 0.05, -1.25, -1.0 - 0.2 * k); o[P.HX] = 0.3; o[P.HY] = 0.2 * s(t * 0.4 + a.f);
  },
  musica(o, t, a) { // cantar y aplaudir al ritmo
    base(o); sentar(o, a.asiento); const k = mx(0, s(t * 5));
    brazos(o, -1.0, -1.0, 0.35 - 0.3 * k, 0.35 - 0.3 * k, -1.1, -1.1); o[P.HY] = 0.15 * s(t * 1.2 + a.f); o[P.HZ] = 0.08 * s(t * 2.5);
  },
  piano(o, t, a) { ANIM.ordenador(o, t, a); o[P.SLZ] = 0.3 + 0.15 * s(t * 2); o[P.SRZ] = -0.3 - 0.15 * s(t * 2.3); o[P.HZ] = 0.1 * s(t * 1.2); },
  aplaudir(o, t, a) {
    base(o); sentar(o, a.asiento); const k = s(t * 9) > 0.3 && s(t * 0.4 + a.f) > 0 ? 1 : 0;
    brazos(o, -1.0, -1.0, 0.35 - 0.25 * k, 0.35 - 0.25 * k, -1.0, -1.0); o[P.HX] = -0.08;
  },
  // ---------- de pie ----------
  charlar(o, t, a) {
    base(o); brazos(o, 0.05, -0.4 + 0.2 * s(t * 1.4 + a.f), 0.1, 0.12, -0.2, -1.1 + 0.32 * s(t * 2.1 + a.f));
    o[P.HY] = (a.mirar || 0) + 0.25 * s(t * 0.5 + a.f); o[P.HX] = 0.06 * s(t * 1.1 + a.f);
    o[P.PZ] = 0.04 * s(t * 0.3 + a.f); respirar(o, t);
    if (s(t * 0.13 + a.f * 2) > 0.85) { o[P.SLX] = -0.4; o[P.ELX] = -1.3; } // otro gesto
  },
  explicar(o, t, a) {
    base(o); brazos(o, -0.15, -1.3 + 0.25 * s(t * 1.2 + a.f), 0.12, 0.45, -0.3, -0.25);
    o[P.HY] = 0.55 * s(t * 0.4 + a.f); o[P.TY] = 0.1 * s(t * 0.4 + a.f); respirar(o, t);
  },
  pizarra(o, t, a) {
    base(o); brazos(o, 0.05, -1.95 + 0.1 * s(t * 2), 0.1, 0.2 + 0.25 * s(t * 0.9), -0.2, -0.6);
    o[P.WRX] = 0.3 * s(t * 6); o[P.HX] = -0.15; o[P.HY] = 0.1 * s(t * 0.9);
  },
  atender(o, t, a) { ANIM.charlar(o, t, a); o[P.TX] = 0.06; },
  vigilar(o, t, a) {
    base(o); brazos(o, -0.85, -0.85, -0.55, -0.55, -1.75, -1.75);
    o[P.HY] = 0.65 * s(t * 0.18 + a.f); o[P.PZ] = 0.04 * s(t * 0.2); respirar(o, t);
  },
  vigilar_sentado(o, t, a) { ANIM.sentado(o, t, a); o[P.HY] = 0.6 * s(t * 0.15 + a.f); },
  servir(o, t, a) {
    base(o); const k = s(t * 1.6 + a.f);
    brazos(o, -0.9 + 0.25 * k, -1.0 - 0.25 * k, 0.05, 0.1, -0.7, -0.6); o[P.TX] = 0.12; o[P.HX] = 0.25; o[P.HY] = 0.3 * s(t * 0.4);
  },
  servirse(o, t, a) { base(o); brazos(o, -0.95, -0.95, -0.1, -0.1, -0.7, -0.7); o[P.TX] = 0.1; o[P.HX] = 0.3; },
  mirar_estante(o, t, a) {
    base(o); const k = mx(0, s(t * 0.5 + a.f));
    brazos(o, 0.05, -0.9 - 1.0 * k, 0.1, 0.15, -0.2, -0.4); o[P.HX] = -0.2 * k; o[P.HY] = 0.3 * s(t * 0.25 + a.f);
  },
  armario(o, t, a) {
    base(o); const k = s(t * 1.1 + a.f);
    brazos(o, -1.0 + 0.4 * k, -1.2 - 0.4 * k, 0.05, 0.1, -0.6, -0.5); o[P.HX] = -0.1 + 0.25 * k; o[P.TX] = 0.05;
  },
  pedir_ayuda(o, t, a) { ANIM.charlar(o, t, a); o[P.SLX] = -0.25; o[P.ELX] = -1.4; },
  // ---------- tumbado / dormir ----------
  dormir(o, t, a) {
    base(o); o[P.OJOS] = 0;
    brazos(o, 0.05, 0.05, 0.12, 0.12, -0.15, -0.15);
    o[P.KLX] = 0.12; o[P.KRX] = 0.18; o[P.HY] = 0.35 + 0.05 * s(t * 0.05 + a.f); o[P.HZ] = 0.1;
    o[P.TX] = 0.025 * s(t * 1.1); o[P.ALX] = 0.4; o[P.ARX] = 0.4;
  },
  // ---------- deporte ----------
  nadar(o, t, a) {
    base(o); const f = a.fase * 0.8;
    o[P.SLX] = -(f % (Math.PI * 2)); o[P.SRX] = -((f + Math.PI) % (Math.PI * 2));
    o[P.SLZ] = 0.15; o[P.SRZ] = -0.15; o[P.ELX] = -0.35; o[P.ERX] = -0.35;
    o[P.HLX] = 0.28 * s(t * 9); o[P.HRX] = -0.28 * s(t * 9); o[P.KLX] = o[P.KRX] = 0.15;
    o[P.ALX] = o[P.ARX] = 0.9; o[P.RR] = 0.35 * s(f); o[P.HY] = 0.45 * mx(0, s(f * 0.5));
  },
  ejercicio(o, t, a) { // saltos de tijera y sentadillas, por turnos
    base(o);
    if (s(t * 0.15 + a.f) > 0) {
      const k = 0.5 - 0.5 * c(t * 4.2);
      brazos(o, 0, 0, 0.12 + 2.7 * k, 0.12 + 2.7 * k, -0.1, -0.1);
      o[P.HLZ] = 0.05 + 0.25 * k; o[P.HRZ] = -0.05 - 0.25 * k; o[P.RY] = 0.07 * ab(s(t * 4.2));
    } else {
      const k = 0.5 - 0.5 * c(t * 2.4);
      o[P.HLX] = o[P.HRX] = -1.25 * k; o[P.KLX] = o[P.KRX] = 2.0 * k; o[P.ALX] = o[P.ARX] = -0.7 * k;
      o[P.RY] = -0.42 * k; o[P.TX] = 0.35 * k; brazos(o, -1.5 * k, -1.5 * k, 0.05, 0.05, -0.1, -0.1);
    }
  },
  estirar(o, t, a) {
    base(o); o[P.RY] = -0.84; o[P.HLX] = o[P.HRX] = -1.5; o[P.KLX] = o[P.KRX] = 0.05;
    const k = 0.5 + 0.5 * s(t * 0.8 + a.f);
    o[P.TX] = 0.3 + 0.45 * k; brazos(o, -1.2 - 0.3 * k, -1.2 - 0.3 * k, 0.05, 0.05, -0.1, -0.1); o[P.HX] = 0.2;
  },
  botar(o, t, a) { // botar el balón (baloncesto)
    base(o); o[P.HLX] = o[P.HRX] = -0.4; o[P.KLX] = o[P.KRX] = 0.65; o[P.ALX] = o[P.ARX] = -0.25; o[P.RY] = -0.07; o[P.TX] = 0.2;
    brazos(o, -0.3, -0.75, 0.15, 0.25, -0.5, -0.9 + 0.45 * s(t * 6 + a.f)); o[P.HX] = -0.1;
  },
  tirar(o, t, a) { // lanzar a canasta / pasar con las manos
    base(o); const k = mx(0, s(t * 2.2 + a.f));
    brazos(o, -2.5 + 0.3 * k, -2.5 + 0.3 * k, -0.1, -0.1, -0.9 + 0.8 * k, -0.9 + 0.8 * k);
    o[P.KLX] = o[P.KRX] = 0.5 * (1 - k); o[P.HLX] = o[P.HRX] = -0.3 * (1 - k); o[P.RY] = -0.05 * (1 - k) + 0.12 * k; o[P.HX] = -0.35;
  },
  patear(o, t, a) {
    base(o); const k = mx(0, s(t * 3 + a.f));
    o[P.HRX] = 0.5 - 1.5 * k; o[P.KRX] = 0.9 * (1 - k) + 0.1; o[P.HLX] = 0.1; o[P.KLX] = 0.15;
    brazos(o, -0.4 * k, 0.4 * k, 0.4, 0.4, -0.4, -0.4); o[P.TX] = 0.1; o[P.HX] = 0.25;
  },
  portero(o, t, a) {
    base(o); o[P.HLX] = o[P.HRX] = -0.5; o[P.KLX] = o[P.KRX] = 0.85; o[P.RY] = -0.12; o[P.TX] = 0.3; o[P.HLZ] = 0.2; o[P.HRZ] = -0.2;
    brazos(o, -0.6, -0.6, 0.7 + 0.15 * s(t * 2), 0.7 + 0.15 * s(t * 2), -0.4, -0.4); o[P.HX] = -0.25;
  },
  pingpong(o, t, a) {
    base(o); o[P.HLX] = o[P.HRX] = -0.35; o[P.KLX] = o[P.KRX] = 0.55; o[P.RY] = -0.06; o[P.TX] = 0.2;
    brazos(o, -0.4, -0.85 + 0.5 * s(t * 4 + a.f), 0.2, 0.3 + 0.3 * s(t * 4 + a.f), -0.9, -0.9); o[P.TY] = 0.25 * s(t * 4 + a.f); o[P.HX] = -0.1;
  },
  futbolin(o, t, a) {
    base(o); o[P.HLX] = o[P.HRX] = -0.2; o[P.KLX] = o[P.KRX] = 0.35; o[P.RY] = -0.03; o[P.TX] = 0.28;
    brazos(o, -1.15, -1.15, -0.05, -0.05, -0.35 + 0.18 * s(t * 6 + a.f), -0.35 - 0.18 * s(t * 6 + a.f)); o[P.HX] = 0.25;
  },
  rayuela(o, t, a) {
    base(o); const k = ab(s(t * 3));
    o[P.RY] = 0.16 * k; o[P.KLX] = 1.2; o[P.HLX] = -0.3; o[P.KRX] = 0.25 * (1 - k); brazos(o, -0.2, -0.2, 0.5, 0.5, -0.4, -0.4);
  },
  pasar(o, t, a) { ANIM.tirar(o, t * 0.8, a); o[P.SLX] += 1.2; o[P.SRX] += 1.2; },
};
ANIM.esperar = ANIM.sentado; ANIM.escribir_sentado = ANIM.escribir; ANIM.corregir = ANIM.escribir; ANIM.pasear = ANIM.andar;

// Mezcla suave de dos posturas
export function mezclar(a, b, k, out) {
  const k2 = k * k * (3 - 2 * k);
  for (let i = 0; i < N; i++) out[i] = a[i] + (b[i] - a[i]) * k2;
  return out;
}

// ---------------- PIEZAS DEL CUERPO ----------------
// [articulación, geometría, posición, escala, color, rotación X]
// colores: 'piel', 'pelo', 'torso', 'brazo', 'antebrazo', 'polo', 'cuello', 'cadera', 'muslo', 'espinilla', 'pie', 'ojo'
export const PIEZAS = [
  [J.PELVIS, 'cil', [0, -0.02, 0], [0.31, 0.16, 0.22], 'cadera'],
  [J.PELVIS, 'falda', [0, -0.14, 0], [0.5, 0.32, 0.42], 'cadera'],
  [J.PECHO, 'capsula', [0, 0.24, 0], [0.32, 0.25, 0.21], 'torso'],
  [J.PECHO, 'caja', [0, 0.37, 0.095], [0.1, 0.17, 0.03], 'polo'],
  [J.PECHO, 'cil', [0, 0.46, 0], [0.18, 0.05, 0.15], 'cuello'],
  [J.PECHO, 'logo', [0.075, 0.36, 0.108], [0.085, 0.085, 1], 'logo'],
  [J.CUELLO, 'cil', [0, 0.03, 0], [0.09, 0.1, 0.09], 'piel'],
  [J.CABEZA, 'esfera', [0, 0.13, 0], [0.24, 0.255, 0.24], 'piel'],
  [J.CABEZA, 'pelo', [0, 0.145, -0.005], [0.268, 0.268, 0.268], 'pelo', -0.45],
  [J.CABEZA, 'peinado', [0, 0.1, -0.17], [0.09, 0.18, 0.09], 'pelo', 0.5],
  [J.CABEZA, 'esfera', [0.045, 0.135, 0.112], [0.03, 0.035, 0.02], 'ojo'],
  [J.CABEZA, 'esfera', [-0.045, 0.135, 0.112], [0.03, 0.035, 0.02], 'ojo'],
  [J.HL, 'capsula', [0, -0.14, 0], [0.095, 0.14, 0.095], 'brazo'],
  [J.HR, 'capsula', [0, -0.14, 0], [0.095, 0.14, 0.095], 'brazo'],
  [J.CL, 'capsula', [0, -0.13, 0], [0.085, 0.13, 0.085], 'antebrazo'],
  [J.CR, 'capsula', [0, -0.13, 0], [0.085, 0.13, 0.085], 'antebrazo'],
  [J.ML, 'esfera', [0, -0.055, 0.01], [0.08, 0.1, 0.06], 'piel'],
  [J.MR, 'esfera', [0, -0.055, 0.01], [0.08, 0.1, 0.06], 'piel'],
  [J.CDL, 'capsula', [0, -0.205, 0], [0.13, 0.205, 0.13], 'muslo'],
  [J.CDR, 'capsula', [0, -0.205, 0], [0.13, 0.205, 0.13], 'muslo'],
  [J.RL, 'capsula', [0, -0.2, 0], [0.11, 0.2, 0.11], 'espinilla'],
  [J.RR, 'capsula', [0, -0.2, 0], [0.11, 0.2, 0.11], 'espinilla'],
  [J.TL, 'caja', [0, -0.035, 0.05], [0.11, 0.075, 0.24], 'pie'],
  [J.TR, 'caja', [0, -0.035, 0.05], [0.11, 0.075, 0.24], 'pie'],
  [J.RAIZ, 'caja', [0, 0.6, 0.07], [0.66, 1.3, 0.3], 'manta'],
];
// índices de piezas especiales
export const PZ = { CADERA: 0, FALDA: 1, POLO: 3, CUELLO: 4, LOGO: 5, PEINADO: 9, OJO1: 10, OJO2: 11, MANTA: 24 };
