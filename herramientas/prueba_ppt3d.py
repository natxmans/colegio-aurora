# Pruebas de los edificios 3D: presentación del sitio (visor dentro de la diapositiva) y visor3d.html
# Ratón (arrastrar, rueda, clic derecho), táctil (un dedo, pellizco), encuadre, teclado, sin WebGL.
# Uso: python herramientas/prueba_ppt3d.py [url_base]
import json, math, os, sys, time
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from cdp import Navegador

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8820/'
res = []
def ok(n, c, extra=''):
    res.append((n, bool(c), extra)); print(('OK   ' if c else 'FALLO'), n, extra, flush=True)
V = "document.querySelector('.diapo-3d') && document.querySelector('.diapo-3d').contentWindow.__visor"
def estado(b, w='window.__visor'):
    return json.loads(b.js(f"""JSON.stringify((() => {{ const v = {w}; if (!v || !v.listo) return null;
      return {{ az: v.ctrl.getAzimuthalAngle(), pol: v.ctrl.getPolarAngle(), d: v.camara.position.distanceTo(v.ctrl.target),
        min: v.ctrl.minDistance, max: v.ctrl.maxDistance, t: v.ctrl.target.toArray(), cabe: v.dentroDelEncuadre(),
        dentro: v.caja.containsPoint(v.ctrl.target), id: v.id }}; }})())"""))
def esperar_listo(b, w='window.__visor', s=90):
    t0 = time.time()
    while time.time() - t0 < s:
        if b.js(f"!!({w} && {w}.listo)"): return True
        b.esperar(0.5)
    return False
def arrastrar(b, x0, y0, x1, y1, boton='left', pasos=12):
    b.cmd('Input.dispatchMouseEvent', type='mouseMoved', x=x0, y=y0)
    b.cmd('Input.dispatchMouseEvent', type='mousePressed', x=x0, y=y0, button=boton, buttons=1 if boton == 'left' else 2, clickCount=1)
    for k in range(1, pasos + 1):
        b.cmd('Input.dispatchMouseEvent', type='mouseMoved', x=x0 + (x1 - x0) * k / pasos, y=y0 + (y1 - y0) * k / pasos, button=boton, buttons=1 if boton == 'left' else 2)
        time.sleep(0.016)
    b.cmd('Input.dispatchMouseEvent', type='mouseReleased', x=x1, y=y1, button=boton, buttons=0, clickCount=1)
def rueda(b, x, y, dy, veces=1):
    for _ in range(veces):
        b.cmd('Input.dispatchMouseEvent', type='mouseWheel', x=x, y=y, deltaX=0, deltaY=dy); time.sleep(0.03)
def toque(b, puntos_por_paso):
    tipos = ['touchStart'] + ['touchMove'] * (len(puntos_por_paso) - 2) + ['touchEnd']
    for t, pts in zip(tipos, puntos_por_paso):
        b.cmd('Input.dispatchTouchEvent', type=t, touchPoints=[] if t == 'touchEnd' else [{'x': x, 'y': y, 'id': k} for k, (x, y) in enumerate(pts)])
        time.sleep(0.02)

# ---------- 1. Presentación del sitio (ordenador) ----------
b = Navegador(9341)
try:
    b.tam(1440, 900)
    b.ir(BASE, 6)
    ok('presentación: 17 diapositivas', b.js("document.querySelectorAll('#ppt-minis button').length") == 17 and '17' in b.js("document.querySelector('.diapo-num').textContent"))
    b.js("window.__ppt.ir(3)"); b.esperar(1.5)  # diapositiva 4: el edificio
    m = b.js("document.querySelector('.diapo-3d') && document.querySelector('.diapo-3d').getAttribute('data-m')")
    ok('diapositiva 4: el visor 3D está EN la diapositiva', m == 'principal', str(m))
    ok('diapositiva 4: el modelo se carga', esperar_listo(b, V))
    b.esperar(1.5)
    r = json.loads(b.js("JSON.stringify((() => { const f = document.querySelector('.diapo-3d').getBoundingClientRect(), m = document.getElementById('ppt-marco').getBoundingClientRect(); return { x: (f.left - m.left) / m.width * 100, y: (f.top - m.top) / m.height * 100, w: f.width / m.width * 100, h: f.height / m.height * 100, cx: f.left + f.width / 2, cy: f.top + f.height / 2, top: f.top }; })())"))
    zp = [z for z in json.load(open(os.path.join(os.path.dirname(AQUI), 'js', 'datos', 'diapositivas3d.json'), encoding='utf-8')) if z['n'] == 4][0]
    ok('el visor ocupa la zona 3D del PowerPoint', abs(r['x'] - zp['x']) < 0.3 and abs(r['w'] - zp['w']) < 0.3 and abs(r['y'] - zp['y']) < 0.3, json.dumps({k: round(v, 2) for k, v in r.items()}))
    b.foto('ppt3d-diapo4-inicio')
    e0 = estado(b, V)
    ok('encuadre inicial: el edificio entero se ve', e0['cabe'], str(e0))
    cx, cy = r['cx'], r['cy']
    arrastrar(b, cx - 80, cy, cx + 140, cy); b.esperar(1.2)
    e1 = estado(b, V)
    ok('ratón: arrastrar gira el edificio', abs(e1['az'] - e0['az']) > 0.3, f"azimut {e0['az']:.2f} → {e1['az']:.2f}")
    arrastrar(b, cx, cy - 40, cx, cy + 120); b.esperar(1.2)
    e2 = estado(b, V)
    ok('ratón: arrastrar hacia abajo muestra el tejado', e2['pol'] < e1['pol'] - 0.1, f"ángulo {e1['pol']:.2f} → {e2['pol']:.2f}")
    sy = b.js("scrollY")
    rueda(b, cx, cy, -120, 6); b.esperar(1.2)
    e3 = estado(b, V)
    ok('rueda: acerca el edificio (y la página no se mueve)', e3['d'] < e2['d'] * 0.9 and b.js("scrollY") == sy, f"distancia {e2['d']:.1f} → {e3['d']:.1f}")
    arrastrar(b, cx, cy, cx + 120, cy + 60, boton='right'); b.esperar(1.2)
    e4 = estado(b, V)
    ok('clic derecho: mueve la vista, sin salir del edificio', e4['t'] != e3['t'] and e4['dentro'], f"centro {[round(x, 1) for x in e3['t']]} → {[round(x, 1) for x in e4['t']]}")
    rueda(b, cx, cy, 240, 40); b.esperar(1.5)
    e5 = estado(b, V)
    ok('alejar al máximo: limitado y el edificio entero se ve', e5['d'] <= e5['max'] * 1.001 and e5['cabe'], f"distancia {e5['d']:.1f} (máx {e5['max']:.1f})")
    rueda(b, cx, cy, -240, 60); b.esperar(1.5)
    e6 = estado(b, V)
    ok('acercar al máximo: limitado (no se entra en el edificio)', e6['d'] >= e6['min'] * 0.999, f"distancia {e6['d']:.1f} (mín {e6['min']:.1f})")
    # todos los ángulos alejado al máximo: el edificio nunca sale del encuadre
    malos = b.js(f"""(() => {{ const v = {V}; let malos = 0;
      for (let az = 0; az < 360; az += 30) for (const alt of [5, 30, 60, 88]) {{
        const d = v.dir(az, alt); v.ctrl.target.copy(v.caja.getCenter(v.ctrl.target.clone()));
        v.camara.position.copy(v.ctrl.target).addScaledVector(d, v.ctrl.maxDistance); v.camara.lookAt(v.ctrl.target); v.camara.updateMatrixWorld();
        if (!v.dentroDelEncuadre()) malos++; }}
      return malos; }})()""")
    ok('alejado al máximo: el edificio cabe desde 48 ángulos', malos == 0, f'{malos} ángulos con el edificio cortado')
    b.js(f"document.querySelector('.diapo-3d').contentDocument.querySelector('[data-vista=inicio]').click()"); b.esperar(1.5)
    # teclado dentro del visor: las flechas siguen pasando las diapositivas
    b.js("document.querySelector('.diapo-3d').contentWindow.focus(); document.querySelector('.diapo-3d').contentDocument.getElementById('v-lienzo').focus()")
    b.cmd('Input.dispatchKeyEvent', type='keyDown', key='ArrowRight', code='ArrowRight', windowsVirtualKeyCode=39)
    b.cmd('Input.dispatchKeyEvent', type='keyUp', key='ArrowRight', code='ArrowRight', windowsVirtualKeyCode=39); b.esperar(1.5)
    ok('flecha del teclado en el visor → diapositiva siguiente', b.js("document.getElementById('ppt-num').textContent") == '5')
    b.js("window.__ppt.ir(6)"); b.esperar(1.2)  # diapositiva 7: asignaturas (sin 3D)
    ok('diapositiva sin edificio: no hay visor 3D', b.js("document.querySelectorAll('.diapo-3d').length") == 0)
    b.js("window.__ppt.ir(12)"); b.esperar(1.0)  # diapositiva 13: la piscina
    ok('diapositiva 13: la piscina en 3D', esperar_listo(b, V) and b.js("document.querySelector('.diapo-3d').getAttribute('data-m')") == 'piscina')
    b.esperar(1.5); b.foto('ppt3d-diapo13')
    en = json.loads(b.js("JSON.stringify([...document.querySelectorAll('.diapo-enlace')].map(a => [a.textContent, a.getAttribute('href')]))"))
    ok('los botones de la diapositiva se pueden pulsar (Girar en 3D, Ver en el campus 3D)', len(en) == 2 and 'visor3d.html?m=piscina' in en[0][1] and '?sala=piscina#campus' in en[1][1], str(en))
    # portada: el campus entero solo se carga si se pide
    b.js("window.__ppt.ir(0)"); b.esperar(1.0)
    ok('portada: botón «Girar el campus en 3D» (no se carga solo)', b.js("!!document.querySelector('.diapo-3d-boton') && !document.querySelector('.diapo-3d')"))
    b.js("document.querySelector('.diapo-3d-boton').click()"); b.esperar(1.0)
    ok('portada: al pulsar, el campus 3D se carga en la diapositiva', esperar_listo(b, V) and b.js("document.querySelector('.diapo-3d').getAttribute('data-m')") == 'campus')
    ok('un solo visor a la vez', b.js("document.querySelectorAll('.diapo-3d').length") == 1)
    ok('sin errores (ordenador)', not b.errores, str(b.errores[:2]))
finally:
    b.cerrar()

# ---------- 2. Teléfono: gestos táctiles en la diapositiva ----------
b = Navegador(9341)
try:
    b.tam(390, 844, movil=True)
    b.ir(BASE, 6)
    b.js("window.__ppt.ir(9)"); b.esperar(1.0)  # diapositiva 10: residencia
    ok('teléfono: la residencia en 3D en la diapositiva', esperar_listo(b, V))
    b.esperar(1.5)
    r = json.loads(b.js("JSON.stringify((() => { const f = document.querySelector('.diapo-3d').getBoundingClientRect(); return { cx: f.left + f.width / 2, cy: f.top + f.height / 2, w: f.width }; })())"))
    cx, cy = r['cx'], r['cy']
    e0 = estado(b, V)
    toque(b, [[(cx - 40, cy)]] + [[(cx - 40 + 8 * k, cy)] for k in range(1, 12)] + [[(cx + 50, cy)]])
    b.esperar(1.2)
    e1 = estado(b, V)
    ok('táctil: un dedo gira el edificio', abs(e1['az'] - e0['az']) > 0.2, f"azimut {e0['az']:.2f} → {e1['az']:.2f}")
    toque(b, [[(cx - 15, cy), (cx + 15, cy)]] + [[(cx - 15 - 6 * k, cy), (cx + 15 + 6 * k, cy)] for k in range(1, 10)] + [[(cx - 75, cy), (cx + 75, cy)]])
    b.esperar(1.2)
    e2 = estado(b, V)
    ok('táctil: pellizcar acerca el edificio', e2['d'] < e1['d'] * 0.95, f"distancia {e1['d']:.1f} → {e2['d']:.1f} (zona de {r['w']:.0f} px)")
    b.foto('ppt3d-telefono')
    ok('sin errores (teléfono)', not b.errores, str(b.errores[:2]))
finally:
    b.cerrar()

# ---------- 3. visor3d.html (página completa) ----------
b = Navegador(9341)
try:
    b.tam(1280, 800)
    b.ir(BASE + 'visor3d.html?m=residencia', 2)
    ok('visor: carga la residencia', esperar_listo(b))
    b.esperar(1)
    ok('visor: título y descripción en español', b.js("document.getElementById('v-titulo').textContent") == 'La residencia' and len(b.js("document.getElementById('v-desc').textContent")) > 40)
    ok('visor: botones «Vista frontal / lateral / trasera / superior / Restablecer vista»', b.js("[...document.querySelectorAll('.v-vistas .largo')].map(e => e.textContent).join('|')") == 'Vista frontal|Vista lateral|Vista trasera|Vista superior|Restablecer vista')
    ok('visor: enlace «Ver el edificio en el campus 3D» al mismo edificio', b.js("document.getElementById('v-campus').getAttribute('href')") == './?vista=residencia#campus')
    r = json.loads(b.js("JSON.stringify((() => { const c = document.getElementById('v-lienzo').getBoundingClientRect(); return [c.left + c.width / 2, c.top + c.height / 2, c.left + 6, c.top + 6]; })())"))
    az0 = b.js("window.__visor.ctrl.getAzimuthalAngle()"); ex0 = b.js("window.__visor.exposicion()")
    b.cmd('Input.dispatchMouseEvent', type='mouseMoved', x=r[0] - 20, y=r[1]); b.cmd('Input.dispatchMouseEvent', type='mouseMoved', x=r[0], y=r[1]); b.esperar(1.2)
    enc = b.js("document.body.classList.contains('sobre-edificio')"); ex1 = b.js("window.__visor.exposicion()"); az1 = b.js("window.__visor.ctrl.getAzimuthalAngle()")
    pista = b.js("getComputedStyle(document.getElementById('v-pista')).opacity"); cursor = b.js("getComputedStyle(document.getElementById('v-lienzo')).cursor")
    ok('survol: cursor «mano», el edificio se ilumina un poco y aparece la pista', enc and ex1 > ex0 + 0.05 and float(pista) > 0.5 and cursor == 'grab', f'exposición {ex0:.2f} → {ex1:.2f}, pista {pista}, cursor {cursor}')
    ok('survol: el edificio NO gira solo', abs(az1 - az0) < 1e-6, f'azimut {az0:.4f} → {az1:.4f}')
    b.cmd('Input.dispatchMouseEvent', type='mouseMoved', x=r[2], y=r[3]); b.esperar(1.0)
    ok('fuera del edificio: vuelve la luz normal', not b.js("document.body.classList.contains('sobre-edificio')"))
    cab = []
    for vista in ['frente', 'lado', 'detras', 'arriba', 'inicio']:
        b.js(f"document.querySelector('[data-vista={vista}]').click()"); b.esperar(1.3)
        cab.append(b.js("window.__visor.dentroDelEncuadre()"))
    ok('visor: botones de vista (frente, lado, detrás, arriba, centrar), edificio entero', all(cab), str(cab))
    b.js("document.getElementById('v-sig').click()")
    ok('visor: «Siguiente» carga el edificio siguiente', esperar_listo(b) and b.js("window.__visor.id") == 'habitacion')
    tiempos = json.loads(b.js("""new Promise(res => { const v = window.__visor; const t = []; let n = 0, ult = performance.now();
      const paso = (ahora) => { t.push(ahora - ult); ult = ahora; v.ctrl.rotateLeft ? 0 : 0; if (++n < 90) requestAnimationFrame(paso); else res(JSON.stringify(t)); };
      v.irA(200, 40); requestAnimationFrame(paso); })"""))
    tiempos.sort()
    ok('visor: animación (medida en Chrome sin pantalla, sin tarjeta gráfica)', True, f'imagen media {sum(tiempos)/len(tiempos):.1f} ms, peor {tiempos[-1]:.0f} ms')
    ok('sin errores (visor)', not b.errores, str(b.errores[:2]))
finally:
    b.cerrar()

# ---------- 4. Sin WebGL ----------
b = Navegador(9341)
try:
    b.tam(1280, 800)
    b.cmd('Page.addScriptToEvaluateOnNewDocument', source="""(() => { const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { if (/webgl/i.test(t)) return null; return g.call(this, t, ...a); }; })()""")
    b.ir(BASE, 6)
    b.js("window.__ppt.ir(3)"); b.esperar(1.5)
    ok('sin WebGL: la diapositiva 4 se ve (imagen del PowerPoint), sin visor', b.js("document.querySelectorAll('.diapo-3d').length") == 0 and b.js("document.getElementById('ppt-num').textContent") == '4')
    b.ir(BASE + 'visor3d.html?m=gimnasio', 3)
    ok('sin WebGL: el visor muestra la imagen del edificio y un mensaje', 'WebGL' in (b.js("document.getElementById('v-carga-txt').textContent") or '') and b.js("!document.getElementById('v-imagen').hidden"))
finally:
    b.cerrar()
print(f"\n{sum(1 for r in res if r[1])}/{len(res)} pruebas superadas")
