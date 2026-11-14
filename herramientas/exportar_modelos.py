# Exporta los edificios de la maqueta en archivos .glb (modelos/<id>.glb)
# Uso (con el sitio local abierto en el puerto 8820):  python herramientas/exportar_modelos.py [id ...]
import base64, json, os, sys, time
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from cdp import Navegador

RAIZ = os.path.dirname(AQUI)
SALIDA = os.path.join(RAIZ, 'modelos')
os.makedirs(SALIDA, exist_ok=True)
URL = 'http://localhost:8820/'
SOLO = sys.argv[1:]
E = "(await import(new URL('js/estado.js', document.baseURI).href))"
X = "(await import(new URL('herramientas/exportar-modelos.js', document.baseURI).href))"
D = "(await import(new URL('js/datos/modelos3d.js', document.baseURI).href))"

b = Navegador(9339)
infos = {}
ruta_info = os.path.join(SALIDA, 'info.json')
if os.path.exists(ruta_info):
    infos = json.load(open(ruta_info, encoding='utf-8'))
try:
    b.tam(1280, 800)
    b.ir(URL + '?calidad=alta&vista=completa&hora=11:00', 6)
    b.js("document.getElementById('campus').scrollIntoView()")
    t0 = time.time()
    while time.time() - t0 < 60 and b.js(f"(async () => {E}.leer().listo3d)()") is not True:
        b.esperar(1)
    b.esperar(3)
    modelos = json.loads(b.js(f"(async () => JSON.stringify({D}.MODELOS))()"))
    # copia en JSON para el script del PowerPoint (nombre, descripción, ángulo de vista)
    json.dump(modelos, open(os.path.join(SALIDA, 'modelos.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    ids = [m['id'] for m in modelos]
    for mid in ids:
        if SOLO and mid not in SOLO:
            continue
        b.js(f"""(async () => {{ const E = {E}; const m = {D}.modelo('{mid}');
            E.volverInicio(); E.cambiarVista(m.estado.vista);
            E.poner({{ techo: m.estado.techo, resVista: m.estado.resVista || null }}); return 1; }})()""")
        b.esperar(2.5)
        r = b.js(f"(async () => {{ const m = {D}.modelo('{mid}'); const r = await {X}.exportarBase64(m, window.__r3f.scene); return JSON.stringify(r); }})()")
        if not r or r.startswith('ERROR'):
            print(mid, 'ERROR', (r or '')[:400], flush=True); continue
        d = json.loads(r)
        datos = base64.b64decode(d['b64'])
        open(os.path.join(SALIDA, mid + '.glb'), 'wb').write(datos)
        infos[mid] = d['info']
        print(mid, d['info'], flush=True)
    print('errores de la página:', b.errores[:3])
finally:
    b.cerrar()
json.dump(infos, open(ruta_info, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
