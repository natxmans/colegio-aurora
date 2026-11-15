# ¿Quién no encuentra camino? Simula de 07:36 a 13:00 (muy rápido, sin saltos) y lista los fallos.
import json, os, sys, time
AQUI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, AQUI)
from cdp import Navegador
FIN = int(sys.argv[1]) if len(sys.argv) > 1 else 13 * 60
b = Navegador(9375); b.ws.settimeout(200)
try:
    b.tam(1280, 800)
    b.ir('http://localhost:8820/?calidad=alta&hora=07:36&vista=completa', 8)
    t0 = time.time()
    while time.time() - t0 < 120 and not b.js("!!(window.__sim && window.__sim.SIM.listo)"): b.esperar(1)
    b.js("(async () => (await import(new URL('js/sim/reloj.js', document.baseURI).href)).ponerRitmo('muyrapido'))()")
    ult = 0
    while time.time() - t0 < 1500:
        m = b.js("window.__sim.reloj.min")
        if m >= FIN or m < 400: break
        if m - ult > 30: ult = m; print(f"{int(m)//60:02d}:{int(m)%60:02d}", b.js("JSON.stringify({sin: window.__sim.SIM.stats.sinCamino, rec: window.__sim.SIM.stats.recolocados || 0})"), flush=True)
        b.esperar(2)
    print('FALLOS', b.js("JSON.stringify(window.__sim.FALLOS)"))
    print('RECOLOCADOS', b.js("JSON.stringify(window.__sim.SIM.stats.ultimosRecolocados || [])"))
    print('errores', b.errores[:3], 'real', round(time.time() - t0), 's')
finally:
    b.cerrar()
