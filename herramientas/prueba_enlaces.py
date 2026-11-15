# Prueba de TODOS los enlaces del PowerPoint (botones «Girar en 3D» y «Ver en el campus 3D»):
# cada uno abre una página que existe y muestra el edificio correcto.
# Uso: python herramientas/prueba_enlaces.py [url_base]   (por defecto el sitio local)
import json, os, sys, time, urllib.parse
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from cdp import Navegador
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8820/'
PUBLICO = 'https://natxmans.github.io/colegio-aurora/'
zonas = json.load(open(os.path.join(os.path.dirname(AQUI), 'js', 'datos', 'diapositivas3d.json'), encoding='utf-8'))
E = "(await import(new URL('js/estado.js', document.baseURI).href))"
res = []
def ok(n, c, extra=''):
    res.append(c); print(('OK   ' if c else 'FALLO'), n, extra, flush=True)
b = Navegador(9349); b.ws.settimeout(120)
try:
    b.tam(1280, 800)
    for z in zonas:
        for bt in z['botones']:
            assert bt['href'].startswith(PUBLICO), bt['href']
            url = BASE + bt['href'][len(PUBLICO):]
            if 'visor3d.html' in url:
                b.ir(url, 1); t0 = time.time()
                while time.time() - t0 < 90 and not b.js("!!(window.__visor && window.__visor.listo)"): b.esperar(0.5)
                ok(f"diapositiva {z['n']:2} «Girar en 3D» → {z['m']}", b.js("window.__visor && window.__visor.id") == z['m'] and b.js("window.__visor.dentroDelEncuadre()"), url[len(BASE):])
            else:
                q = urllib.parse.parse_qs(urllib.parse.urlparse(url).query)
                b.ir(url, 4); t0 = time.time()
                while time.time() - t0 < 90 and b.js(f"(async () => {E}.leer().listo3d)()") is not True: b.esperar(1)
                b.esperar(3)
                st = json.loads(b.js(f"(async () => {{ const s = {E}.leer(); return JSON.stringify({{ sel: s.sel, vista: s.vista, interior: s.interior, resVista: s.resVista, modo: s.modo }}); }})()"))
                if 'sala' in q: bueno = st['sel'] == q['sala'][0] and (st['interior'] or 'dentro' not in q)
                else: bueno = st['vista'] == q['vista'][0] and st['modo'] == 'explorar'
                ok(f"diapositiva {z['n']:2} «Ver en el campus 3D» → {z['m']}", bueno, f"{url[len(BASE):]}  estado {st}")
    ok('sin errores en las páginas', not b.errores, str(b.errores[:2]))
finally:
    b.cerrar()
print(f"\n{sum(res)}/{len(res)} enlaces correctos")
