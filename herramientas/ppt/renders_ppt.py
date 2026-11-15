# Imágenes del CAMPUS REAL del sitio para las diapositivas que no tienen modelo 3D
# (sustituyen fotos que no correspondían a los edificios). Solo la imagen 3D: sin etiquetas ni paneles.
# Salida: herramientas/ppt/imagenes/<nombre>.jpg (proporción 424.8 x 381.6 = la del hueco de la foto)
# Uso (sitio local en el puerto 8820): python herramientas/ppt/renders_ppt.py
import base64, os, sys, time
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(AQUI))
from cdp import Navegador

SALIDA = os.path.join(AQUI, 'imagenes'); os.makedirs(SALIDA, exist_ok=True)
E = "(await import(new URL('js/estado.js', document.baseURI).href))"
# nombre, parámetros de la página, cámara [posición, objetivo] (None = la del enlace)
TOMAS = [
    ('presentacion', '?calidad=alta&hora=10:06&vista=completa', ([-30, 26, 62], [-4, 1, 10])),
    ('internado', '?calidad=alta&hora=21:35&vista=residencia', ([-47.5, 14.5, -2.5], [-56.2, 3.8, -11.5])),
    ('horario', '?calidad=alta&hora=08:20&vista=baja&techo=0', 'aula'),
    ('noche', '?calidad=alta&hora=22:20&vista=completa', ([-46, 40, 78], [2, 0, -6])),
]
b = Navegador(9347); b.ws.settimeout(120)
try:
    b.tam(1113, 1000)
    for nombre, q, cam in TOMAS:
        b.ir('http://localhost:8820/' + q, 4)
        b.js("document.getElementById('campus').scrollIntoView()")
        t0 = time.time()
        while time.time() - t0 < 60 and b.js(f"(async () => {E}.leer().listo3d)()") is not True: b.esperar(1)
        if b.js("!!document.querySelector('.exp-abrir')") and 'sala=' not in q:
            b.js("document.querySelector('.exp-abrir').click()")
        b.esperar(4)
        if cam == 'aula':  # un aula de la planta baja con una clase en este momento, vista desde arriba
            b.js(f"""(async () => {{ const E = {E}; E.poner({{ techo: false }}); const H = await import(new URL('js/sim/horario.js', document.baseURI).href); const S = (await import(new URL('js/datos/salas.js', document.baseURI).href)).SALAS;
              const R = window.__sim.reloj; let s = null; for (let g = 0; g < 4 && !s; g++) {{ const c = H.claseDeGrupo(R.dia, R.min, g); if (c && S[c.sala] && S[c.sala].planta === 'baja' && S[c.sala].fila === 'norte') s = S[c.sala]; }}
              if (s) E.camara.ctrl.setLookAt(s.cx + 2.5, 13, s.cz + 6.5, s.cx, 0, s.cz - 0.5, false); return s ? s.id : 'ninguna'; }})()""")
        elif cam:
            (p, m) = cam
            b.js(f"(async () => {{ const E = {E}; E.camara.ctrl.setLookAt({p[0]},{p[1]},{p[2]},{m[0]},{m[1]},{m[2]}, false); return 1; }})()")
        b.esperar(5)
        d = b.js("""(() => { const s = window.__r3f; s.gl.render(s.scene, s.camera); const c = s.gl.domElement;
          return JSON.stringify({ w: c.width, h: c.height, url: c.toDataURL('image/jpeg', 0.92) }); })()""")
        import json
        j = json.loads(d)
        ruta = os.path.join(SALIDA, nombre + '.jpg')
        open(ruta, 'wb').write(base64.b64decode(j['url'].split(',', 1)[1]))
        print(nombre, j['w'], 'x', j['h'], flush=True)
    print('errores:', b.errores[:3])
finally:
    b.cerrar()
