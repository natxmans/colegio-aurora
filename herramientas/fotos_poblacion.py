# Fotos de la maqueta con los 64 alumnos, en las salas y a las horas de la prueba de población.
# Uso: python herramientas/fotos_poblacion.py [calidad] [url_base]
import os, sys, time
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from cdp import Navegador
CAL = sys.argv[1] if len(sys.argv) > 1 else 'alta'
BASE = sys.argv[2] if len(sys.argv) > 2 else 'http://localhost:8820/'
VISTAS = [('campus-1008', 'vista=completa', '10:08'), ('svt-0820', 'sala=svt&dentro=1', '08:20'), ('musica-0820', 'sala=musica&dentro=1', '08:20'),
          ('fisica-1035', 'sala=fisica&dentro=1', '08:20'), ('comedor-1240', 'sala=comedor&dentro=1', '12:40'), ('permanencia-1035', 'sala=permanencia&dentro=1', '10:35'),
          ('futbol-1735', 'sala=futbol', '17:35'), ('piscina-1735', 'sala=piscina', '17:35'), ('baloncesto-1735', 'sala=baloncesto', '17:35'),
          ('estudio-1845', 'sala=estudio&dentro=1', '18:45'), ('biblioteca-1735', 'sala=biblioteca&dentro=1', '17:35'),
          ('salonres-2005', 'sala=salonres&dentro=1', '20:05'), ('residencia-2135', 'vista=residencia', '21:35'), ('hab101-2135', 'sala=hab101&dentro=1', '21:35')]
for nom, q, h in VISTAS:
    b = Navegador(9374); b.ws.settimeout(150)
    try:
        b.tam(1366, 768)
        b.ir(BASE + f'?calidad={CAL}&hora={h}&{q}#campus', 6)
        t0 = time.time()
        while time.time() - t0 < 90 and not b.js("!!(window.__sim && window.__sim.SIM.listo)"): b.esperar(1)
        b.esperar(7)
        b.js("(async () => (await import(new URL('js/sim/reloj.js', document.baseURI).href)).pausar && 0)()")
        b.foto(f'pob-{CAL}-{nom}')
        print(nom, 'errores', b.errores[:2], flush=True)
    finally:
        b.cerrar()
