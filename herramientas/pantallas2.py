# Teléfono, tableta, aparato SIN WebGL y calidad ligera
import json, sys, time
from cdp import Navegador
from medir2 import MEDIR
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8820/'
res = []
def ok(n, c, extra=''):
    res.append((n, bool(c), extra)); print(('OK   ' if c else 'FALLO'), n, extra, flush=True)
E = "(await import(new URL('js/estado.js', document.baseURI).href))"

for nombre, w, h in [('telefono', 390, 844), ('tableta', 820, 1180)]:
    b = Navegador(9334)
    try:
        b.tam(w, h, movil=True)
        b.ir(BASE, 10)
        r = json.loads(b.js("JSON.stringify({ top: document.getElementById('ppt-marco').getBoundingClientRect().top, bottom: document.getElementById('ppt-marco').getBoundingClientRect().bottom, ancho: document.getElementById('ppt-marco').getBoundingClientRect().width / innerWidth, desborde: document.documentElement.scrollWidth - innerWidth })"))
        ok(f'{nombre}: la presentación se ve arriba', r['top'] < 300 and r['bottom'] < h and r['ancho'] > 0.85, str(r))
        b.js("document.getElementById('ppt-sig').click()"); b.esperar(0.4)
        ok(f'{nombre}: diapositiva siguiente', b.js("document.getElementById('ppt-num').textContent") == '2')
        b.foto(f'p-{nombre}-arriba')
        b.js("document.getElementById('campus').scrollIntoView()")
        t0 = time.time()
        while time.time() - t0 < 50 and not b.js(f"(async () => {E}.leer().listo3d)()"): b.esperar(1)
        b.esperar(3)
        ok(f'{nombre}: la maqueta 3D se carga', b.js(f"(async () => {E}.leer().listo3d)()"), f"calidad {b.js(f'(async () => {E}.leer().calidad)()')}")
        rl = json.loads(b.js("JSON.stringify((() => { const r = document.querySelector('.reloj').getBoundingClientRect(); const c = document.getElementById('campus3d').getBoundingClientRect(); return [r.left >= c.left - 1, r.right <= c.right + 1, r.bottom <= c.bottom + 1]; })())"))
        ok(f'{nombre}: el panel del tiempo cabe en la vista 3D', all(rl), str(rl))
        b.foto(f'p-{nombre}-campus')
        b.js("document.querySelector('.exp-abrir').click()"); b.esperar(4)
        m = json.loads(b.js(f"({MEDIR})(null)"))
        ok(f'{nombre}: pantalla completa, edificios enteros', not m['cortado'], str(m))
        b.foto(f'p-{nombre}-completa')
        b.js(f"(async () => {E}.volverInicio())()"); b.esperar(1)
        ok(f'{nombre}: sin desbordamiento horizontal', b.js("document.documentElement.scrollWidth <= innerWidth + 1"))
        ok(f'{nombre}: sin errores', not b.errores, str(b.errores[:2]))
    finally:
        b.cerrar()

# Aparato SIN WebGL: la presentación y los textos funcionan, la 3D se sustituye por una imagen
b = Navegador(9334)
try:
    b.tam(1280, 800)
    b.cmd('Page.addScriptToEvaluateOnNewDocument', source="""(() => { const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { if (/webgl/i.test(t)) return null; return g.call(this, t, ...a); }; })()""")
    b.ir(BASE, 12)
    d = json.loads(b.js("JSON.stringify({ t: document.querySelector('#diag-pill span').textContent, w: window.__diag.webgl })"))
    ok('sin WebGL: diagnóstico «Algunas funciones no están disponibles»', d['t'] == 'Algunas funciones no están disponibles' and d['w'] is False, str(d))
    b.js("document.getElementById('ppt-sig').click()"); b.esperar(0.4)
    ok('sin WebGL: la presentación funciona', b.js("document.getElementById('ppt-num').textContent") == '2')
    b.js("document.getElementById('campus').scrollIntoView()"); b.esperar(3)
    msg = b.js("document.getElementById('carg-error').hidden ? '' : document.getElementById('carg-error').textContent")
    ok('sin WebGL: imagen del campus + mensaje claro', 'WebGL' in (msg or '') and b.js("document.querySelector('.campus-espera img').complete"), (msg or '')[:80])
    ok('sin WebGL: las secciones y el asistente siguen ahí', b.js("!!document.getElementById('asignaturas') && document.querySelectorAll('#asistentes .alumno-tarjeta').length > 0"))
    ok('sin WebGL: sin errores', not b.errores, str(b.errores[:2]))
    b.foto('p-sin-webgl')
finally:
    b.cerrar()

# Calidad ligera: menos alumnos y sin sombras
b = Navegador(9334)
try:
    b.tam(1280, 800)
    b.ir(BASE + '?calidad=ligera&vista=completa', 25)
    r = json.loads(b.js("JSON.stringify({ n: window.__sim ? window.__sim.SIM.alumnos.length : -1, sombras: window.__r3f ? window.__r3f.gl.shadowMap.enabled : null })"))
    ok('calidad ligera: los 64 alumnos (simulados todos) y sin sombras', r['n'] == 64 and r['sombras'] is False, str(r))
    b.foto('p-ligera')
    ok('calidad ligera: sin errores', not b.errores, str(b.errores[:2]))
finally:
    b.cerrar()
print(f"\n{sum(1 for r in res if r[1])}/{len(res)} pruebas superadas")
