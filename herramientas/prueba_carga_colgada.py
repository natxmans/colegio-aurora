# Carga de la 3D que NO termina nunca (un archivo que el servidor no envía): la página no debe
# quedarse para siempre en «Preparando el campus»: a los 25 s, mensaje claro + botón «Reintentar».
# Uso: python herramientas/prueba_carga_colgada.py [url_base]
import json, os, sys, time
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from cdp import Navegador
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8820/'
class Colgado(Navegador):
    def cmd(self, metodo, **params):
        self.n += 1; mid = self.n
        self.ws.send(json.dumps({'id': mid, 'method': metodo, 'params': params}))
        while True:
            m = json.loads(self.ws.recv())
            if m.get('id') == mid:
                if 'error' in m: raise RuntimeError(m['error'])
                return m.get('result', {})
            if m.get('method') == 'Fetch.requestPaused':
                self.retenidas = getattr(self, 'retenidas', 0) + 1   # no se contesta: la petición queda colgada
b = Colgado(9354); b.ws.settimeout(120)
res = []
try:
    b.tam(1280, 800)
    b.cmd('Fetch.enable', patterns=[{'urlPattern': '*js/3d/Escena.js*', 'requestStage': 'Request'}])
    b.ir(BASE, 3)
    b.js("document.getElementById('campus').scrollIntoView()")
    t0 = time.time(); msg = ''
    while time.time() - t0 < 45:
        msg = b.js("document.getElementById('carg-error').hidden ? '' : document.getElementById('carg-error').textContent")
        if msg: break
        b.esperar(1)
    t = round(time.time() - t0)
    boton = b.js("!!document.getElementById('carg-reintentar')")
    ppt = b.js("document.getElementById('ppt-sig').click(), document.getElementById('ppt-num').textContent")
    ok = bool(msg) and t <= 32 and boton and ppt == '2'
    print(('OK   ' if ok else 'FALLO'), f'carga colgada: mensaje a los {t} s, botón Reintentar: {boton}, la presentación sigue funcionando: {ppt == "2"}', '|', msg[:90])
    b.foto('carga-colgada')
finally:
    b.cerrar()
