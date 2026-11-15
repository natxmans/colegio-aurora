# Revisión de los TEJADOS: vista cenital ortográfica de cada modelo con su mapa de alturas.
# Para cada píxel: altura de la primera superficie vista desde arriba
#   A) sin los cristales casi transparentes (lo que se ve "a través")  B) con todo
# Colores: gris = tejado/estructura (más claro = más alto), cian = cristal que deja ver el interior,
#          rojo = superficie baja (0,5–2,5 m: suelo interior o muebles visibles desde arriba), verde = suelo exterior.
# Un tejado completo no tiene rojo ni cian DENTRO del contorno del edificio.
# Uso: python herramientas/revisar_tejados.py [id ...]
import base64, io, json, os, sys, time
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from cdp import Navegador
from PIL import Image, ImageDraw, ImageFont

IDS = sys.argv[1:] or ['principal', 'residencia', 'gimnasio', 'piscina', 'pistas']
PX = 6  # píxeles por metro
JS = """(async (pase) => { const v = window.__visor, T = v.THREE, r = v.renderer, sc = v.escena, b = v.caja;
  const W = b.max.x - b.min.x, D = b.max.z - b.min.z, H = b.max.y - b.min.y;
  const w = Math.round(W * %d), h = Math.round(D * %d);
  const cam = new T.OrthographicCamera(-W / 2, W / 2, D / 2, -D / 2, 0.01, H + 20);
  cam.position.set((b.min.x + b.max.x) / 2, b.max.y + 10, (b.min.z + b.max.z) / 2); cam.up.set(0, 0, -1); cam.lookAt(cam.position.x, 0, cam.position.z); cam.updateMatrixWorld();
  const ocultos = [];
  sc.traverse(o => { if ((o.isMesh && o.material.isShadowMaterial) || o.isLight) { if (o.visible) { o.visible = false; ocultos.push(o); } }
    if (pase === 'A' && o.isMesh && o.material.transparent && o.material.opacity < 0.5 && o.visible) { o.visible = false; ocultos.push(o); } });
  const rt = new T.WebGLRenderTarget(w, h);
  const dm = new T.MeshDepthMaterial({ side: T.DoubleSide });
  const fondo = sc.background, prev = sc.overrideMaterial; sc.background = new T.Color(0, 0, 0); sc.overrideMaterial = dm;
  r.setRenderTarget(rt); r.setClearColor(0x000000, 1); r.clear(); r.render(sc, cam); r.setRenderTarget(null);
  sc.overrideMaterial = prev; sc.background = fondo; r.setClearColor(0x000000, 0);
  ocultos.forEach(o => o.visible = true);
  const px = new Uint8Array(w * h * 4); r.readRenderTargetPixels(rt, 0, 0, w, h, px); rt.dispose(); dm.dispose();
  // profundidad (0 cerca de la cámara = alto) -> altura en metros; 0 = nada
  const alt = new Float32Array(w * h); const lejos = H + 20 - 0.01;
  for (let i = 0; i < w * h; i++) { const g = px[i * 4] / 255; alt[i] = g === 0 ? -1 : (b.max.y + 10) - (0.01 + (1 - g) * lejos) - b.min.y; }
  let s = ''; const bytes = new Uint8Array(alt.buffer); for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return JSON.stringify({ w, h, H, b64: btoa(s) }); })""" % (PX, PX)

b = Navegador(9346); b.ws.settimeout(120)
res = {}
try:
    b.tam(900, 600)
    for mid in IDS:
        b.ir(f'http://localhost:8820/visor3d.html?embed=1&m={mid}', 1)
        for k in range(120):
            if b.js("!!(window.__visor && window.__visor.listo)"): break
            time.sleep(0.5)
        datos = {}
        for pase in 'AB':
            d = json.loads(b.js(JS + f"('{pase}')"))
            import array
            a = array.array('f'); a.frombytes(base64.b64decode(d['b64'])); datos[pase] = (d['w'], d['h'], a)
        w, h, A = datos['A']; _, _, B = datos['B']
        im = Image.new('RGB', (w, h)); p = im.load()
        cuenta = {'tejado': 0, 'cristal': 0, 'bajo': 0, 'suelo': 0}
        for y in range(h):
            for x in range(w):
                i = (h - 1 - y) * w + x   # readPixels empieza abajo
                hb, ha = B[i], A[i]
                if hb < 0.5: p[x, y] = (150, 200, 120); cuenta['suelo'] += 1
                elif ha < 2.5 and hb >= 2.5: p[x, y] = (40, 200, 230); cuenta['cristal'] += 1
                elif hb < 2.5: p[x, y] = (220, 40, 40); cuenta['bajo'] += 1
                else:
                    g = int(60 + 180 * min(1, hb / max(1, d['H']))); p[x, y] = (g, g, g); cuenta['tejado'] += 1
        im = im.resize((w * 2, h * 2), Image.NEAREST)
        ruta = os.path.join(AQUI, 'capturas', f'tejado-{mid}.png'); im.save(ruta)
        res[mid] = cuenta
        print(mid, cuenta, ruta, flush=True)
finally:
    b.cerrar()
