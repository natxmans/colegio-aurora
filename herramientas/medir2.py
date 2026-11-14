# Mide el tamaño de los EDIFICIOS en la vista 3D (dev.html o el sitio) para varias vistas
import sys, json
from cdp import Navegador

MEDIR = """(async (vista) => {
  const E = window.__E || await import(new URL('js/estado.js', document.baseURI).href);
  const S = await import(new URL('js/datos/salas.js', document.baseURI).href);
  const THREE = await import('three');
  const c = E.camara.ctrl; const el = c._domElement || { clientWidth: innerWidth, clientHeight: innerHeight };
  if (vista) { E.volar(vista, false); }
  await new Promise(r => setTimeout(r, 400));
  const cam = c.camera; cam.updateMatrixWorld();
  const W = el.clientWidth, H = el.clientHeight, out = {};
  const union = new Uint8Array(Math.ceil(W / 4) * Math.ceil(H / 4));
  let gx0 = 1e9, gy0 = 1e9, gx1 = -1e9, gy1 = -1e9, cortado = false;
  for (const id of ['edificio', 'residencia', 'gimnasio', 'piscina']) {
    const s = S.SALAS[id]; if (!s) continue;
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const x of [s.x0, s.x1]) for (const y of [0, s.h]) for (const z of [s.z0, s.z1]) {
      const p = new THREE.Vector3(x, y, z).project(cam);
      const px = (p.x * .5 + .5) * W, py = (-p.y * .5 + .5) * H;
      x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py);
    }
    if (x0 < -1 || x1 > W + 1 || y0 < -1 || y1 > H + 1) cortado = true;
    gx0 = Math.min(gx0, x0); gx1 = Math.max(gx1, x1); gy0 = Math.min(gy0, y0); gy1 = Math.max(gy1, y1);
    const cx0 = Math.max(0, x0), cx1 = Math.min(W, x1), cy0 = Math.max(0, y0), cy1 = Math.min(H, y1);
    for (let yy = Math.floor(cy0 / 4); yy < cy1 / 4; yy++) for (let xx = Math.floor(cx0 / 4); xx < cx1 / 4; xx++) union[yy * Math.ceil(W / 4) + xx] = 1;
  }
  out.ancho = Math.round((Math.min(W, gx1) - Math.max(0, gx0)) / W * 100);
  out.alto = Math.round((Math.min(H, gy1) - Math.max(0, gy0)) / H * 100);
  out.cajas = +(union.reduce((a, v) => a + v, 0) / union.length * 100).toFixed(1);
  out.cortado = cortado;
  out.W = W; out.H = H;
  return JSON.stringify(out);
})"""

if __name__ == '__main__':
    url = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8820/dev.html?calidad=alta'
    tam = (sys.argv[2] if len(sys.argv) > 2 else '1440x900').split('x')
    pruebas = json.loads(sys.argv[3]) if len(sys.argv) > 3 else [None]
    b = Navegador(int(sys.argv[5]) if len(sys.argv) > 5 else 9334)
    try:
        b.tam(int(tam[0]), int(tam[1]), movil=int(tam[0]) < 700)
        b.ir(url, 20)
        for i, v in enumerate(pruebas):
            r = b.js(f"({MEDIR})({json.dumps(v)})")
            print(json.dumps(v), r, flush=True)
            if len(sys.argv) > 4:
                b.esperar(1); b.foto(f'{sys.argv[4]}-{i}')
        print('errores', b.errores[:2])
    finally:
        b.cerrar()
