# Pruebas de las novedades: inicio (logo + nombre + lema, orden de secciones), hora a elegir,
# día siguiente, ocultar/mostrar personas (la vida sigue), vista interior en el visor.
# Uso: python herramientas/prueba_mision3.py [url_base]
import json, os, sys, time
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from cdp import Navegador
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8820/'
E = "(await import(new URL('js/estado.js', document.baseURI).href))"
R = "(await import(new URL('js/sim/reloj.js', document.baseURI).href)).reloj"
res = []
def ok(n, c, extra=''):
    res.append(bool(c)); print(('OK   ' if c else 'FALLO'), n, extra, flush=True)
b = Navegador(9351); b.ws.settimeout(120)
try:
    b.tam(1536, 730)
    b.ir(BASE, 5)
    top = json.loads(b.js("""JSON.stringify((() => { const l = document.querySelector('.ppt-logo').getBoundingClientRect(), h = document.querySelector('.ppt-cab h1'), m = document.getElementById('ppt-marco').getBoundingClientRect();
      return { logo: [Math.round(l.width), Math.round(l.top)], natural: [document.querySelector('.ppt-logo').naturalWidth, document.querySelector('.ppt-logo').naturalHeight], h1: h.textContent, lema: document.querySelector('.ppt-cab .lema').textContent, ppt: Math.round(m.top) }; })())"""))
    ok('inicio: logo oficial (sin deformar), nombre y lema antes de la presentación', top['logo'][0] >= 60 and top['natural'][0] == top['natural'][1] and top['h1'] == 'Colegio Pablo Picasso' and 'Estudiar · Convivir · Crecer' in top['lema'] and top['ppt'] > top['logo'][1], str(top))
    orden = b.js("[...document.querySelectorAll('main section[id], .contenido section[id]')].map(s => s.id).join(',')")
    ok('orden: presentación, campus 3D, espacios del colegio, residencia, vida...', orden.startswith('presentacion,campus,colegio,aulas,deportes,internado,vida'), orden)
    b.foto('m3-inicio')
    b.js("document.getElementById('campus').scrollIntoView()")
    t0 = time.time()
    while time.time() - t0 < 60 and b.js(f"(async () => {E}.leer().listo3d)()") is not True: b.esperar(1)
    b.esperar(2)
    b.js("document.querySelector('.reloj-mas').click()"); b.esperar(0.6)
    b.js("(() => { const i = document.querySelector('.reloj-elegir input'); i.value = '15:30'; document.querySelector('.reloj-elegir button[type=submit]').click(); })()"); b.esperar(0.8)
    m = b.js(f"(async () => {R}.min)()")
    ok('elegir una hora (15:30)', 930 <= m < 936, f'min {m:.1f}')
    d0 = b.js(f"(async () => {R}.dia)()")
    b.js("document.querySelector('.reloj-elegir .sig-dia').click()"); b.esperar(0.8)
    d1, m1 = b.js(f"(async () => {R}.dia)()"), b.js(f"(async () => {R}.min)()")
    ok('día siguiente (07:30 del día siguiente)', d1 == (d0 + 1) % 5 and 450 <= m1 < 456, f'día {d0} → {d1}, min {m1:.1f}')
    b.js("document.querySelector('.exp-abrir').click()"); b.esperar(3)
    b.js(f"(async () => {{ (await import(new URL('js/sim/reloj.js', document.baseURI).href)).saltarA(12 * 60 + 21, true); return 1; }})()"); b.esperar(4)  # 12:21: van al comedor
    btn = b.js("[...document.querySelectorAll('.toggles button')].map(x => x.textContent).join('|')")
    b.js("[...document.querySelectorAll('.toggles button')].find(x => /Ocultar personas/.test(x.textContent)).click()"); b.esperar(1)
    p0 = b.js("JSON.stringify(window.__sim.SIM.personas.map(p => [+p.x.toFixed(2), +p.z.toFixed(2)]))")
    oc = b.js("(() => { let g = null; window.__r3f.scene.traverse(o => { if (o.isInstancedMesh && o.geometry.type === 'CapsuleGeometry' && !g && o.parent && o.parent.type === 'Group') g = o.parent; }); return g ? g.visible : null; })()")
    b.esperar(2)
    p1 = b.js("JSON.stringify(window.__sim.SIM.personas.map(p => [+p.x.toFixed(2), +p.z.toFixed(2)]))")
    mov = sum(1 for a, c in zip(json.loads(p0), json.loads(p1)) if a != c)
    ok('ocultar personas: no se ven y la vida sigue (se siguen moviendo)', oc is False and mov > 3, f'botones {btn} · visible {oc} · {mov} personas se han movido')
    b.foto('m3-sin-personas')
    b.js("[...document.querySelectorAll('.toggles button')].find(x => /Mostrar personas/.test(x.textContent)).click()"); b.esperar(1.5)
    oc2 = b.js("(() => { let g = null; window.__r3f.scene.traverse(o => { if (o.isInstancedMesh && o.geometry.type === 'CapsuleGeometry' && !g && o.parent && o.parent.type === 'Group') g = o.parent; }); return g ? g.visible : null; })()")
    ok('mostrar personas de nuevo', oc2 is True)
    # acceso directo a la visita guiada (botón de la página de inicio)
    b.ir(BASE, 5)
    b.js("[...document.querySelectorAll('.ppt-sigue a')].find(a => /Visita guiada/.test(a.textContent)).click()")
    t0 = time.time()
    while time.time() - t0 < 60 and b.js(f"(async () => {E}.leer().listo3d)()") is not True: b.esperar(1)
    b.esperar(3)
    g = json.loads(b.js(f"(async () => {{ const s = {E}.leer(); return JSON.stringify({{ guiada: s.guiada, sel: s.sel, modo: s.modo }}); }})()"))
    ok('botón «Visita guiada en 3D»: la visita empieza en el campus', g['guiada'] is True and g['sel'] and g['modo'] == 'explorar', str(g))
    b.ir(BASE + '?visita=guiada#campus', 5)
    t0 = time.time()
    while time.time() - t0 < 60 and b.js(f"(async () => {E}.leer().listo3d)()") is not True: b.esperar(1)
    b.esperar(2)
    ok('enlace directo ?visita=guiada', b.js(f"(async () => {E}.leer().guiada)()") is True)
    ok('sin errores', not b.errores, str(b.errores[:2]))
finally:
    b.cerrar()
print(f"\n{sum(res)}/{len(res)} pruebas superadas")
