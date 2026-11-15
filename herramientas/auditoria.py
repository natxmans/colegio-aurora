# ESTADO DE LOS LUGARES (auditoría automática) del sitio publicado o local:
#  · todos los enlaces (anclas #, páginas, archivos, enlaces externos) → ¿existen?
#  · errores de la consola y recursos que no cargan (página de inicio, campus 3D, visor 3D)
#  · habitaciones de la residencia: camas, escritorios y armarios en cada una
#  · rendimiento: tiempo hasta ver el campus, memoria, dibujos por imagen
# Uso: python herramientas/auditoria.py [url_base]
import json, os, sys, time, urllib.request, urllib.error
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from cdp import Navegador

BASE = sys.argv[1] if len(sys.argv) > 1 else 'https://natxmans.github.io/colegio-aurora/'
E = "(await import(new URL('js/estado.js', document.baseURI).href))"

class NavLog(Navegador):
    """Guarda también los avisos del navegador (recursos que fallan, avisos de la consola)."""
    def cmd(self, metodo, **params):
        self.n += 1; mid = self.n
        self.ws.send(json.dumps({'id': mid, 'method': metodo, 'params': params}))
        while True:
            m = json.loads(self.ws.recv())
            if m.get('id') == mid:
                if 'error' in m: raise RuntimeError(m['error'])
                return m.get('result', {})
            met = m.get('method')
            if met == 'Runtime.exceptionThrown':
                self.errores.append('EXCEPCIÓN ' + m['params']['exceptionDetails'].get('exception', {}).get('description', '')[:240])
            elif met == 'Runtime.consoleAPICalled' and m['params']['type'] in ('error', 'warning'):
                self.errores.append(m['params']['type'].upper() + ' ' + ' '.join(str(a.get('value', a.get('description', '')))[:200] for a in m['params']['args']))
            elif met == 'Log.entryAdded' and m['params']['entry']['level'] in ('error', 'warning'):
                e = m['params']['entry']; self.errores.append('NAVEGADOR ' + e.get('text', '')[:200] + ' ' + e.get('url', '')[:120])

def estado_url(url):
    try:
        req = urllib.request.Request(url, method='GET', headers={'User-Agent': 'Mozilla/5.0 (auditoria del sitio)'})
        with urllib.request.urlopen(req, timeout=20) as r: return r.status
    except urllib.error.HTTPError as e: return e.code
    except Exception as e: return 'ERROR ' + str(e)[:60]

informe = {}
b = NavLog(9353); b.ws.settimeout(120)
try:
    b.tam(1440, 900)
    t0 = time.time()
    b.ir(BASE, 2)
    # recorrer toda la página (las secciones se dibujan al llegar)
    for k in range(30):
        b.js("window.scrollBy(0, innerHeight)"); b.esperar(0.4)
    b.js("window.scrollTo(0, 0)"); b.esperar(1)
    enlaces = json.loads(b.js("""JSON.stringify([...document.querySelectorAll('a[href]')].map(a => ({ href: a.getAttribute('href'), abs: a.href, texto: (a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 40) })))"""))
    ids = set(json.loads(b.js("JSON.stringify([...document.querySelectorAll('[id]')].map(e => e.id))")))
    sin_nombre = b.js("[...document.querySelectorAll('button')].filter(x => !(x.textContent.trim() || x.getAttribute('aria-label') || x.getAttribute('title'))).length")
    vistos, rotos = {}, []
    for e in enlaces:
        h = e['href']
        if h.startswith('#'):
            ok = h[1:] in ids
            if not ok: rotos.append((h, e['texto'], 'ancla inexistente'))
            continue
        if h.startswith('mailto:') or h.startswith('javascript:'): continue
        url = e['abs'].split('#')[0]
        if url not in vistos: vistos[url] = estado_url(url)
        if vistos[url] != 200: rotos.append((h, e['texto'], vistos[url]))
    informe['enlaces'] = {'total': len(enlaces), 'distintos': len(vistos) + sum(1 for e in enlaces if e['href'].startswith('#')), 'rotos': rotos, 'botones_sin_nombre': sin_nombre}
    # campus 3D
    b.js("document.getElementById('campus').scrollIntoView()")
    t1 = time.time()
    while time.time() - t1 < 90 and b.js(f"(async () => {E}.leer().listo3d)()") is not True: b.esperar(0.5)
    informe['campus'] = {'listo': b.js(f"(async () => {E}.leer().listo3d)()") is True, 'segundos_hasta_ver_el_campus': round(time.time() - t1, 1)}
    b.esperar(4)
    informe['campus'].update(json.loads(b.js("""JSON.stringify((() => { const g = window.__r3f.gl; g.render(window.__r3f.scene, window.__r3f.camera);
      return { dibujos_por_imagen: g.info.render.calls, triangulos: g.info.render.triangles, memoria_js_MB: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1e6) : null,
        alumnos: window.__sim.SIM.alumnos.length, personas: window.__sim.SIM.personas.length }; })())""")))
    # habitaciones dobles: camas, escritorios y armarios
    habs = json.loads(b.js("""(async () => { const P = (await import(new URL('js/3d/puntos.js', document.baseURI).href)).PUNTOS; const r = {};
      for (const p of P) { if (!/^hab\\d+$/.test(p.sala)) continue; r[p.sala] = r[p.sala] || { cama: 0, escritorio: 0, armario: 0 }; if (p.t in r[p.sala]) r[p.sala][p.t]++; }
      return JSON.stringify(r); })()"""))
    malas = {k: v for k, v in habs.items() if v != {'cama': 2, 'escritorio': 2, 'armario': 2}}
    informe['habitaciones'] = {'total': len(habs), 'con_2_camas_2_escritorios_2_armarios': len(habs) - len(malas), 'distintas': malas}
    informe['errores_inicio_y_campus'] = b.errores[:]
    b.errores.clear()
    # visor 3D: los 15 modelos (11 edificios + 4 interiores)
    ids_m = json.loads(b.js("(async () => JSON.stringify((await import(new URL('js/datos/modelos3d.js', document.baseURI).href)).TODOS.map(m => m.id)))()"))
    res = {}
    for mid in ids_m:
        b.ir(BASE + f'visor3d.html?embed=1&m={mid}', 1); t2 = time.time()
        while time.time() - t2 < 90 and not b.js("!!(window.__visor && (window.__visor.listo || window.__visor.error))"): b.esperar(0.4)
        res[mid] = {'listo': b.js("window.__visor.listo"), 's': round(time.time() - t2, 1), 'cabe': b.js("window.__visor.listo && window.__visor.dentroDelEncuadre()")}
    informe['visor'] = res
    informe['errores_visor'] = b.errores[:]
finally:
    b.cerrar()
salida = os.path.join(AQUI, 'capturas', 'auditoria.json')
json.dump(informe, open(salida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(json.dumps(informe, ensure_ascii=False, indent=1))
