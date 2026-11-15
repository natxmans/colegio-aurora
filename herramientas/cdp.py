# Pilote de Chrome sans interface (protocole DevTools) pour tester le site
import json, os, subprocess, time, uuid, shutil, base64, urllib.request, sys, tempfile
import websocket

CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
AQUI = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(AQUI, 'capturas'); os.makedirs(OUT, exist_ok=True)

class Navegador:
    def __init__(self, puerto=9333):
        # Profil Chrome temporaire HORS de OneDrive : sinon OneDrive voit des centaines
        # de fichiers supprimés à chaque test et affiche « Supprimer ces éléments ? »
        self.perfil = os.path.join(tempfile.gettempdir(), 'colegio-chrome-pruebas', uuid.uuid4().hex[:8])
        self.p = subprocess.Popen([CHROME, '--headless=new', f'--user-data-dir={self.perfil}', '--no-first-run',
            '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--hide-scrollbars', f'--remote-debugging-port={puerto}',
            '--window-size=1440,900', 'about:blank'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for _ in range(60):
            try:
                tabs = json.load(urllib.request.urlopen(f'http://127.0.0.1:{puerto}/json')); break
            except Exception: time.sleep(0.3)
        tab = [t for t in tabs if t['type'] == 'page'][0]
        self.ws = websocket.create_connection(tab['webSocketDebuggerUrl'], timeout=120, suppress_origin=True)
        self.n = 0; self.errores = []
        self.cmd('Runtime.enable'); self.cmd('Page.enable'); self.cmd('Log.enable')

    def cmd(self, metodo, **params):
        self.n += 1; mid = self.n
        self.ws.send(json.dumps({'id': mid, 'method': metodo, 'params': params}))
        while True:
            m = json.loads(self.ws.recv())
            if m.get('id') == mid:
                if 'error' in m: raise RuntimeError(m['error'])
                return m.get('result', {})
            if m.get('method') == 'Runtime.exceptionThrown':
                self.errores.append(m['params']['exceptionDetails'].get('exception', {}).get('description', '')[:300])
            if m.get('method') == 'Runtime.consoleAPICalled' and m['params']['type'] == 'error':
                self.errores.append(' '.join(str(a.get('value', a.get('description', '')))[:200] for a in m['params']['args']))

    def tam(self, w, h, movil=False):
        self.cmd('Emulation.setDeviceMetricsOverride', width=w, height=h, deviceScaleFactor=1, mobile=movil)
        if movil: self.cmd('Emulation.setTouchEmulationEnabled', enabled=True, maxTouchPoints=5)

    def ir(self, url, espera=12):
        self.cmd('Page.navigate', url=url); self.esperar(espera)

    def js(self, codigo):
        r = self.cmd('Runtime.evaluate', expression=codigo, awaitPromise=True, returnByValue=True)
        if 'exceptionDetails' in r: return 'ERROR: ' + r['exceptionDetails'].get('exception', {}).get('description', str(r['exceptionDetails']))[:400]
        return r.get('result', {}).get('value')

    def esperar(self, s):
        fin = time.time() + s
        while time.time() < fin:
            try: self.cmd('Runtime.evaluate', expression='1')
            except Exception: pass
            time.sleep(0.25)

    def foto(self, nombre):
        r = self.cmd('Page.captureScreenshot', format='png')
        ruta = os.path.join(OUT, nombre + '.png')
        open(ruta, 'wb').write(base64.b64decode(r['data'])); return ruta

    def cerrar(self):
        try: self.ws.close()
        except Exception: pass
        self.p.kill(); time.sleep(0.5); shutil.rmtree(self.perfil, ignore_errors=True)
