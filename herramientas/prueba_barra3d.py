# Barra de la maqueta 3D (pantalla completa): ¿todos los botones dentro de la pantalla, sin cortes,
# sin solaparse y sin desplazamiento horizontal? Mide también la cámara (no debe cambiar).
# Uso: python herramientas/prueba_barra3d.py [url_base] [etiqueta]
import json, os, sys, time
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from cdp import Navegador
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8820/'
ETQ = sys.argv[2] if len(sys.argv) > 2 else 'medida'
E = "(await import(new URL('js/estado.js', document.baseURI).href))"
PANTALLAS = [(1920, 969, 'escritorio 1920'), (1536, 730, 'portátil 1536'), (1366, 657, 'portátil 1366'), (1280, 720, 'portátil 1280'),
             (1024, 768, 'tableta horizontal'), (820, 1180, 'tableta vertical'), (390, 844, 'teléfono 390'), (360, 740, 'teléfono 360')]
if len(sys.argv) > 3 and sys.argv[3] == 'intermedias':   # anchos justo alrededor de los cambios de diseño
    PANTALLAS = [(1700, 900, 'ancho 1700'), (1600, 900, 'ancho 1600'), (1481, 820, 'ancho 1481'), (1440, 800, 'ancho 1440'),
                 (1181, 760, 'ancho 1181'), (1100, 760, 'ancho 1100'), (900, 700, 'ancho 900'), (561, 900, 'ancho 561'), (320, 640, 'ancho 320')]
MEDIR = """JSON.stringify((() => {
  const bs = [...document.querySelectorAll('.exp-sup button, .exp-sup a')].filter(b => b.offsetParent !== null);
  const W = innerWidth, r = bs.map(b => { const q = b.getBoundingClientRect(); return { t: (b.textContent.trim() || b.title || b.getAttribute('aria-label') || '').slice(0, 18), x0: q.left, x1: q.right, y0: q.top, y1: q.bottom, h: q.height, fs: parseFloat(getComputedStyle(b).fontSize) }; });
  const fuera = r.filter(q => q.x0 < -0.5 || q.x1 > W + 0.5).map(q => q.t);
  const solapes = [];
  for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) { const a = r[i], c = r[j]; if (a.x0 < c.x1 - 1 && c.x0 < a.x1 - 1 && a.y0 < c.y1 - 1 && c.y0 < a.y1 - 1) solapes.push(a.t + ' / ' + c.t); }
  const sup = document.querySelector('.exp-sup').getBoundingClientRect();
  const etiquetas = bs.filter(b => b.querySelector('span') && getComputedStyle(b.querySelector('span')).display !== 'none').length;
  return { botones: r.length, fuera, solapes, desplazamiento: document.documentElement.scrollWidth - W, alto_barra: Math.round(sup.height), alto_boton: Math.round(Math.max(...r.map(q => q.h))), letra: Math.max(...r.map(q => q.fs)), con_texto: etiquetas };
})())"""
salida = {}
for w, h, nom in PANTALLAS:
    b = Navegador(9355); b.ws.settimeout(120)
    try:
        b.tam(w, h, movil=(w < 900))
        b.ir(BASE + '?vista=completa', 5)
        t0 = time.time()
        while time.time() - t0 < 60 and b.js(f"(async () => {E}.leer().listo3d)()") is not True: b.esperar(1)
        b.esperar(4)
        m = json.loads(b.js(MEDIR))
        cam = json.loads(b.js(f"(async () => {{ const c = {E}.camara.ctrl; return JSON.stringify({{ dist: +c.distance.toFixed(2), fov: c.camera.fov }}); }})()"))
        m['camara'] = cam
        salida[nom] = m
        b.foto(f'barra-{ETQ}-{w}')
        ok = not m['fuera'] and not m['solapes'] and m['desplazamiento'] <= 0
        print(('OK   ' if ok else 'FALLO'), f"{nom:18}", json.dumps(m, ensure_ascii=False), flush=True)
    finally:
        b.cerrar()
json.dump(salida, open(os.path.join(AQUI, 'capturas', f'barra-{ETQ}.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
