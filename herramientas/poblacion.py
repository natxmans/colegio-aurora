# POBLACIÓN DEL COLEGIO: ¿dónde está cada uno a las horas pedidas?
# Para cada hora: alumnos por sala, alumnos de cada clase, aulas ocupadas / vacías, profesores,
# adultos presentes, solapes (dos personas en el mismo sitio), plazas ocupadas dos veces,
# camas (nunca más de 2 por habitación), rendimiento de la simulación y del dibujo.
#
# Uso:
#   python herramientas/poblacion.py saltos [calidad] [url_base]   → salta a cada hora (rápido)
#   python herramientas/poblacion.py jornada [calidad] [url_base]  → un día entero SIN saltos
#                                                                     (todos caminan de verdad)
import json, os, sys, time
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from cdp import Navegador

MODO = sys.argv[1] if len(sys.argv) > 1 else 'saltos'
CAL = sys.argv[2] if len(sys.argv) > 2 else 'alta'
BASE = sys.argv[3] if len(sys.argv) > 3 else 'http://localhost:8820/'
HORAS = ['07:45', '08:15', '10:05', '10:30', '12:40', '14:15', '17:30', '20:00', '21:30']
AULAS = ['mates', 'frances', 'ingles', 'historia', 'svt', 'fisica', 'tecno', 'musica', 'gimnasio', 'permanencia']

FOTO = r"""(() => {
  const S = window.__sim.SIM, R = window.__sim.reloj, SAL = window.__salas, H = window.__horario;
  const CAPA = { baja: 0, primer: 1, res0: 0, res1: 2, deporte: 0 };
  const dentro = (p, id) => { const r = SAL[id]; return r && (CAPA[r.planta] ?? 0) === p.capa && p.x > r.x0 - 0.3 && p.x < r.x1 + 0.3 && p.z > r.z0 - 0.3 && p.z < r.z1 + 0.3; };
  const o = { min: R.min, dia: R.dia, alumnos: S.alumnos.length, presentes: 0, andando: 0, porSala: {}, porActividad: {}, clases: {}, aulas: {},
    profes: [], adultos: [], solapes: 0, ejSolapes: [], dobles: 0, ejDobles: [], camas: { maxPorHab: 0, enSuCama: 0, tumbados: 0, ajenas: 0 } };
  for (const p of S.alumnos) {
    if (p.estado === 'fuera') continue;
    o.presentes++;
    if (p.estado === 'andando' || p.pedir) o.andando++;
    const sala = /^hab\d+$/.test(p.plan && p.plan.sala || '') ? 'habitaciones' : (p.plan && p.plan.sala) || '?';
    const k = (p.estado === 'andando' || p.pedir) ? '(caminando)' : sala;
    o.porSala[k] = (o.porSala[k] || 0) + 1;
    const act = (p.texto || '?').replace(/ de [A-ZÁÉÍÓÚ].*$/, '').replace(/: falta.*$/, '');
    o.porActividad[act] = (o.porActividad[act] || 0) + 1;
    if (p.plan && p.plan.id.startsWith('clase')) {
      const g = H.GRUPOS[p.d.grupo];
      const c = o.clases[g] ||= { sala: p.plan.sala, materia: p.plan.clase && p.plan.clase.materia.corto, alumnos: 0, enSuSitio: 0 };
      c.alumnos++;
      if (p.estado === 'sentado' || (p.plan.sala === 'gimnasio' && p.estado === 'quieto')) c.enSuSitio++;
    }
  }
  for (const id of ['mates', 'frances', 'ingles', 'historia', 'svt', 'fisica', 'tecno', 'musica', 'gimnasio', 'permanencia']) {
    const al = S.alumnos.filter(p => p.estado !== 'fuera' && p.estado !== 'andando' && p.plan && p.plan.sala === id && dentro(p, id)).length;
    const pr = S.personas.filter(p => p.tipo !== 'alumno' && p.estado !== 'fuera' && dentro(p, id)).length;
    o.aulas[id] = al + ' alumnos, ' + pr + ' adultos';
  }
  for (const p of S.personas.filter(q => q.tipo === 'profe')) {
    const enAula = p.plan && p.plan.profe ? dentro(p, p.plan.sala) : null;
    o.profes.push([p.d.corto, p.plan ? p.plan.id : '?', p.plan && p.plan.sala || '-', p.estado, enAula]);
  }
  for (const p of S.personas.filter(q => q.tipo === 'personal')) if (p.estado !== 'fuera') o.adultos.push(p.d.nombre + ' (' + (p.plan && p.plan.sala) + ')');
  // solapes: dos personas paradas a menos de 30 cm, en la misma planta y a la misma altura
  const quietos = S.personas.filter(p => p.estado !== 'fuera' && p.estado !== 'andando');
  for (let i = 0; i < quietos.length; i++) for (let j = i + 1; j < quietos.length; j++) {
    const a = quietos[i], b = quietos[j];
    if (a.capa !== b.capa || Math.abs(a.y - b.y) > 0.5) continue;
    const d = Math.hypot(a.x - b.x, a.z - b.z);
    if (d < 0.3) { o.solapes++; if (o.ejSolapes.length < 6) o.ejSolapes.push([a.id, b.id, a.estado, b.estado, +a.x.toFixed(2), +a.z.toFixed(2), a.plan && a.plan.id, b.plan && b.plan.id]); }
  }
  // una plaza (silla, cama, calle...) ocupada por dos personas a la vez
  const usos = new Map();
  for (const p of S.personas) if (p.estado !== 'fuera' && p.sentadoEn) usos.set(p.sentadoEn, (usos.get(p.sentadoEn) || []).concat(p.id));
  for (const [pt, l] of usos) if (l.length > 1) { o.dobles++; if (o.ejDobles.length < 5) o.ejDobles.push([pt.sala, pt.t, pt.i, l]); }
  // camas
  const porHab = {};
  for (const p of S.alumnos) if (p.estado === 'tumbado' && p.sentadoEn) {
    o.camas.tumbados++;
    porHab[p.sentadoEn.sala] = (porHab[p.sentadoEn.sala] || 0) + 1;
    if (p.sentadoEn.sala === p.d.hab) o.camas.enSuCama++; else o.camas.ajenas++;
  }
  o.camas.maxPorHab = Math.max(0, ...Object.values(porHab));
  o.camas.habitacionesOcupadas = Object.keys(porHab).length;
  // rendimiento (medias desde la última foto)
  const st = S.stats;
  o.rend = { simMedia_ms: st.n ? +(st.suma / st.n).toFixed(2) : null, simMax_ms: st.max ? +st.max.toFixed(1) : null, dibujoMedia_ms: st.n ? +((st.sumaDibujo || 0) / st.n).toFixed(2) : null,
    piezas: st.piezas, imagenes: st.n, sinCamino: st.sinCamino, recolocados: st.recolocados || 0 };
  st.n = 0; st.suma = 0; st.max = 0; st.sumaDibujo = 0;
  return JSON.stringify(o);
})()"""

MUROS = r"""(() => { const S = window.__sim.SIM; const malos = [];
  for (const p of S.personas) {
    if (p.estado !== 'andando' || !p.ruta || p.directo) continue;
    const q = p.ruta[p.ri], q0 = p.ruta[p.ri - 1];
    if ((q && q.esc) || (q0 && q0.esc)) continue;
    if (window.__sim.dentroDeMuro(p.capa, p.x, p.z)) malos.push([p.id, +p.x.toFixed(2), +p.z.toFixed(2), p.capa]);
  }
  // saltos bruscos de posición (teletransporte) desde la muestra anterior
  const ant = window.__ant || {}, salto = [];
  for (const p of S.personas) { const a = ant[p.id]; if (a && p.estado !== 'fuera' && a.e !== 'fuera' && Math.hypot(p.x - a.x, p.z - a.z) > 14) salto.push([p.id, a.e, p.estado, +Math.hypot(p.x - a.x, p.z - a.z).toFixed(1)]); }
  window.__ant = Object.fromEntries(S.personas.map(p => [p.id, { x: p.x, z: p.z, e: p.estado }]));
  return JSON.stringify({ min: window.__sim.reloj.min, dia: window.__sim.reloj.dia, malos, salto }); })()"""

RENDER = r"""JSON.stringify((() => { const g = window.__r3f.gl; g.render(window.__r3f.scene, window.__r3f.camera);
  return { dibujos: g.info.render.calls, triangulos: g.info.render.triangles }; })())"""

def amin(h): hh, mm = h.split(':'); return int(hh) * 60 + int(mm)

def imprimir(h, o):
    print(f"\n=== {h} (simulación {int(o['min']) // 60:02d}:{int(o['min']) % 60:02d}, día {o['dia']}) · alumnos {o['presentes']}/{o['alumnos']} · caminando {o['andando']}", flush=True)
    print('  por sala:', json.dumps(dict(sorted(o['porSala'].items(), key=lambda kv: -kv[1])), ensure_ascii=False))
    if o['clases']: print('  clases:', json.dumps(o['clases'], ensure_ascii=False))
    print('  aulas:', json.dumps(o['aulas'], ensure_ascii=False))
    print('  profesores:', json.dumps(o['profes'], ensure_ascii=False))
    print('  adultos del personal presentes:', len(o['adultos']), o['adultos'])
    print('  solapes:', o['solapes'], o['ejSolapes'], '· plazas dobles:', o['dobles'], o['ejDobles'], '· camas:', o['camas'])
    print('  rendimiento:', o['rend'], flush=True)

b = Navegador(9372 if MODO == 'saltos' else 9373); b.ws.settimeout(240)
res = {'modo': MODO, 'calidad': CAL, 'horas': {}}
try:
    b.tam(1280, 800)
    b.ir(BASE + f'?calidad={CAL}&hora=07:36&vista=completa', 8)
    t0 = time.time()
    while time.time() - t0 < 120 and not b.js("!!(window.__sim && window.__sim.SIM.listo)"): b.esperar(1)
    b.esperar(3)
    b.js("(async () => { window.__salas = (await import(new URL('js/datos/salas.js', document.baseURI).href)).SALAS; window.__horario = await import(new URL('js/sim/horario.js', document.baseURI).href); window.__relojM = await import(new URL('js/sim/reloj.js', document.baseURI).href); })()")
    b.esperar(1)
    res['dibujo'] = json.loads(b.js(RENDER))
    print('errores al cargar:', b.errores[:3], '· dibujo:', res['dibujo'])
    if MODO == 'saltos':
        for h in HORAS:
            b.js(f"window.__relojM.saltarA({amin(h)}, true)")
            b.esperar(6)
            o = json.loads(b.js(FOTO)); res['horas'][h] = o; imprimir(h, o)
    else:
        b.js("window.__relojM.ponerRitmo('muyrapido')")
        pend = list(HORAS); dia0 = None; malos = 0; ej = []; saltos = []; muestras = 0
        while pend and time.time() - t0 < 1800:
            m = json.loads(b.js(MUROS)); muestras += 1
            if dia0 is None: dia0 = m['dia']
            malos += len(m['malos']); ej += m['malos'][:2]; saltos += m['salto'][:3]
            if m['dia'] == dia0 and m['min'] >= amin(pend[0]):
                h = pend.pop(0); o = json.loads(b.js(FOTO)); res['horas'][h] = o; imprimir(h, o)
            b.esperar(0.4)
        res['muros'] = {'muestras': muestras, 'dentro_de_muro': malos, 'ejemplos': ej[:8], 'saltos_bruscos': saltos[:10]}
        res['caminos'] = json.loads(b.js("JSON.stringify({ fallos: window.__sim.FALLOS.slice(-10), recolocados: window.__sim.SIM.stats.ultimosRecolocados || [] })"))
        print('trayectos sin camino (últimos):', json.dumps(res['caminos'], ensure_ascii=False))
        print('\nmuestras', muestras, '· posiciones dentro de un muro o mueble (caminando):', malos, ej[:6], '· saltos bruscos (>14 m entre dos muestras):', len(saltos), saltos[:6])
    # imágenes por segundo en este Chrome de prueba (sin pantalla: sirve para comparar, no es la cifra de un ordenador real)
    fps = b.js("new Promise(r => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(f); else r(Math.round(n / ((performance.now() - t0) / 1000))); }; requestAnimationFrame(f); })")
    res['imagenes_por_segundo_chrome_de_prueba'] = fps
    res['errores'] = b.errores[:5]
    print('\nimágenes/s (Chrome de prueba):', fps, '· errores:', b.errores[:5])
    json.dump(res, open(os.path.join(AQUI, f'res_poblacion_{MODO}_{CAL}.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
finally:
    b.cerrar()
