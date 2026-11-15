# UNA JORNADA COMPLETA en la simulación (velocidad "muy rápido"), sin saltos de hora:
# se mide lo que hacen los alumnos a cada hora del horario oficial y si alguien atraviesa un muro.
import json, sys, time
from cdp import Navegador

RESUMEN = r"""(() => {
  const S = window.__sim.SIM, R = window.__sim.reloj, NAV = window.__sim.NAV;
  const c = { min: R.min, dia: R.dia, ef: R.efectivo, n: S.alumnos.length, tumbado: 0, enSuCama: 0, sentadoClase: 0, enAula: 0, patio: 0, comedor: 0,
    andando: 0, nadando: 0, juego: 0, perma: 0, uniforme: 0, pijama: 0, deporte: 0, sinCamino: S.stats.sinCamino, caminos: S.stats.caminos, malos: [], profesEnClase: 0 };
  for (const p of S.alumnos) {
    if (p.estado === 'tumbado') { c.tumbado++; if (p.sentadoEn && p.sentadoEn.sala === p.d.hab) c.enSuCama++; }
    if (p.estado === 'andando') c.andando++;
    if (p.estado === 'nadando') c.nadando++;
    if (p.juego) c.juego++;
    if (p.plan && p.plan.id.startsWith('clase') && p.estado === 'sentado') c.sentadoClase++;
    if (p.plan && p.plan.id.startsWith('clase') && (p.estado === 'sentado' || (p.plan.sala === 'gimnasio' && p.estado === 'quieto'))) c.enAula++;
    if (p.plan && p.plan.sala === 'permanencia' && p.estado === 'sentado') c.perma++;
    if (p.x > -33 && p.x < 9 && p.z > 12.5 && p.z < 45 && p.estado !== 'andando') c.patio++;
    if (p.plan && p.plan.id === 'comida' && p.estado === 'sentado') c.comedor++;
    c[p.ropa] = (c[p.ropa] || 0) + 1;
  }
  const SAL = window.__salas || {};
  c.profesClase = 0; c.profesEnSuAula = 0;
  for (const p of S.personas.filter(q => q.tipo === 'profe')) if (p.plan && p.plan.profe) { c.profesClase++; const r = SAL[p.plan.sala]; if (r && p.x > r.x0 - 0.3 && p.x < r.x1 + 0.3 && p.z > r.z0 - 0.3 && p.z < r.z1 + 0.3) c.profesEnSuAula++; }
  c.profesEnClase = c.profesEnSuAula + '/' + c.profesClase;
  for (const p of S.personas) {
    if (p.estado !== 'andando' || !p.ruta || p.directo) continue;
    const q = p.ruta[p.ri], q0 = p.ruta[p.ri - 1];
    if ((q && q.esc) || (q0 && q0.esc)) continue;
    if (window.__sim.dentroDeMuro(p.capa, p.x, p.z)) c.malos.push([p.id, +p.x.toFixed(2), +p.z.toFixed(2), p.capa]);
  }
  return JSON.stringify(c);
})()"""

HITOS = [('07:40', 'antes del despertar'), ('07:50', 'despertar'), ('08:12', 'clases de la mañana'), ('10:08', 'recreo'), ('10:30', 'vuelta a clase'),
         ('12:40', 'comida'), ('14:12', 'clases de la tarde'), ('17:45', 'tiempo libre'), ('21:35', 'a dormir'), ('07:52+', 'despertar del día siguiente')]

def amin(h): hh, mm = h.rstrip('+').split(':'); return int(hh) * 60 + int(mm)

b = Navegador()
reg = {}
malos_total, malos_ej = 0, []
try:
    b.tam(1280, 800)
    b.ir('http://localhost:8820/?calidad=alta&hora=07:36&vista=completa', 25)
    print('errores', b.errores[:3])
    b.js("(async () => { window.__salas = (await import('/js/datos/salas.js')).SALAS; (await import('/js/sim/reloj.js')).ponerRitmo('muyrapido'); })()")
    dia0 = None; pendientes = list(HITOS); t0 = time.time(); muestras = 0
    while pendientes and time.time() - t0 < 1200:
        c = json.loads(b.js(RESUMEN))
        muestras += 1
        if dia0 is None: dia0 = c['dia']
        malos_total += len(c['malos']); malos_ej += c['malos'][:2]
        h, et = pendientes[0]
        objetivo = amin(h); otro_dia = h.endswith('+')
        llegado = (c['dia'] != dia0 and c['min'] >= objetivo) if otro_dia else (c['dia'] == dia0 and c['min'] >= objetivo)
        if llegado:
            reg[h] = c; pendientes.pop(0)
            m = int(c['min'])
            print(f"{m // 60:02d}:{m % 60:02d} día {c['dia']} · {et:28s} n={c['n']} tumbados={c['tumbado']} (en su cama {c['enSuCama']}) clase={c['enAula']} perma={c['perma']} patio={c['patio']} comedor={c['comedor']} andando={c['andando']} nadan={c['nadando']} juegan={c['juego']} | ropa: unif={c.get('uniforme',0)} pij={c.get('pijama',0)} dep={c.get('deporte',0)+c.get('banador',0)} | profes en clase={c['profesEnClase']} | real {time.time() - t0:.0f}s", flush=True)
        b.esperar(0.4)
    print('muestras', muestras, '· caminos calculados', c['caminos'], '· sin camino', c['sinCamino'], '· recolocados', b.js('window.__sim.SIM.stats.recolocados || 0'), '· fallos', b.js('JSON.stringify(window.__sim.FALLOS.slice(-6))'), '· posiciones DENTRO de un muro o mueble (andando):', malos_total, malos_ej[:6])
    print('errores', b.errores[:3])
    json.dump(reg, open('res_jornada.json', 'w'), indent=1)
finally:
    b.cerrar()
