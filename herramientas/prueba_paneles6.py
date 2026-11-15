# ¿El panel «¿Qué pasa?» y las pestañas de grupos muestran bien las 6 clases?
import json, os, sys, time
AQUI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, AQUI)
from cdp import Navegador
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8820/'
b = Navegador(9376); b.ws.settimeout(150)
try:
    for w, h in [(1366, 768), (390, 844)]:
        b.tam(w, h, movil=w < 900)
        b.ir(BASE + '?hora=08:20&vista=completa#campus', 6)
        t0 = time.time()
        while time.time() - t0 < 90 and not b.js("!!(window.__sim && window.__sim.SIM.listo)"): b.esperar(1)
        b.esperar(3)
        print(w, 'abrir ¿Qué pasa?:', b.js("(() => { const x = [...document.querySelectorAll('button')].find(e => /Qué pasa/.test(e.textContent)); if (x) x.click(); return !!x; })()"))
        b.esperar(2)
        print(w, 'panel:', b.js("JSON.stringify((() => { const t = document.body.innerText; return ['4ºA','4ºB','4ºC','4ºD','4ºE','4ºF'].map(g => g + ':' + (t.split(g).length - 1)); })())"))
        b.foto(f'quepasa-6grupos-{w}')
    b.tam(1366, 768)
    b.ir(BASE + '#vida', 6); b.esperar(3)
    print('pestañas:', b.js("JSON.stringify([...document.querySelectorAll('.pestanas button')].map(e => e.textContent))"))
    b.js("(() => { const x = [...document.querySelectorAll('.pestanas button')].find(e => e.textContent === '4ºF'); if (x) { x.click(); x.scrollIntoView({block:'center'}); } })()"); b.esperar(2)
    print('4ºF:', b.js("JSON.stringify([...document.querySelectorAll('.pestanas ~ * b, .pestanas + * b')].slice(0, 14).map(e => e.textContent))"))
    b.foto('pestanas-4F')
    print('errores', b.errores[:3])
finally:
    b.cerrar()
