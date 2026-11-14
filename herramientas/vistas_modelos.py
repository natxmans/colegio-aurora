# Fotos de cada modelo en el visor 3D (inicio, frente, lado, detrás, arriba) + imagen de reserva modelos/vistas/<id>.jpg
# Uso: python herramientas/vistas_modelos.py [base_url] [id ...]
import json, os, sys, time
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from cdp import Navegador
from PIL import Image, ImageDraw, ImageFont

RAIZ = os.path.dirname(AQUI)
BASE = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1].startswith('http') else 'http://localhost:8820/'
SOLO = [a for a in sys.argv[1:] if not a.startswith('http')]
CAP = os.path.join(AQUI, 'capturas')
os.makedirs(os.path.join(RAIZ, 'modelos', 'vistas'), exist_ok=True)
try: F = ImageFont.truetype('arialbd.ttf', 22)
except Exception: F = None

b = Navegador(9340)
res = {}
try:
    b.tam(1200, 750)
    ids = None
    for_ids = SOLO
    b.ir(BASE + 'visor3d.html?embed=1&m=campus', 2)
    ids = json.loads(b.js("(async () => JSON.stringify((await import(new URL('js/datos/modelos3d.js', document.baseURI).href)).MODELOS.map(m => m.id)))()"))
    for mid in ids:
        if SOLO and mid not in SOLO: continue
        b.ir(BASE + f'visor3d.html?embed=1&m={mid}', 1)
        t0 = time.time()
        while time.time() - t0 < 90 and not b.js("window.__visor && window.__visor.listo"): b.esperar(0.5)
        b.esperar(1.2)
        info = {'listo': b.js("window.__visor.listo"), 'error': b.js("window.__visor.error")}
        fotos = []
        for vista in ['inicio', 'frente', 'lado', 'detras', 'arriba']:
            if vista != 'inicio':
                b.js(f"document.querySelector('[data-vista={vista}]').click()"); b.esperar(1.4)
            info[vista] = {'cabe': b.js("window.__visor.dentroDelEncuadre()"), 'ocupa': b.js("window.__visor.ocupacion().map(x => +x.toFixed(2))")}
            fotos.append((vista, b.foto(f'modelo-{mid}-{vista}')))
            if vista == 'inicio':
                Image.open(fotos[-1][1]).convert('RGB').save(os.path.join(RAIZ, 'modelos', 'vistas', f'{mid}.jpg'), quality=82)
        res[mid] = info
        print(mid, json.dumps(info), flush=True)
        # planche: 5 vues
        w, h = 600, 375
        out = Image.new('RGB', (w * 3, h * 2), 'white'); d = ImageDraw.Draw(out)
        for k, (v, ruta) in enumerate(fotos):
            im = Image.open(ruta).convert('RGB').resize((w, h)); x, y = (k % 3) * w, (k // 3) * h
            out.paste(im, (x, y)); d.rectangle([x, y, x + w, y + 32], fill=(20, 40, 90)); d.text((x + 10, y + 5), f'{mid} · {v}', fill='white', font=F)
        out.save(os.path.join(CAP, f'planche-{mid}.jpg'), quality=85)
    print('errores:', b.errores[:3])
finally:
    b.cerrar()
