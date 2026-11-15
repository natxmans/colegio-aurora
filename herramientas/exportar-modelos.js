// =========================================================
// EXPORTAR LOS EDIFICIOS DE LA MAQUETA EN ARCHIVOS 3D (.glb)
// Se ejecuta DENTRO del sitio, con la maqueta ya cargada (lo lanza
// herramientas/exportar_modelos.py con Chrome sin ventana).
// Copia exactamente las piezas que dibuja el sitio (kit de piezas + paneles
// con textura), solo las que están dentro de la zona del modelo:
//   · las personas, el cielo, los brillos de la noche y las zonas de clic NO se exportan
//   · el suelo, los caminos y los muros cortados por el borde se recortan limpiamente
// Resultado: un .glb (glTF 2.0 binario) que entienden PowerPoint y el visor 3D.
// =========================================================
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { KIT, MAT } from '../js/3d/kit.js';

const TIPO_MAT = new Map([[MAT.mate, 'mate'], [MAT.brillo, 'brillo'], [MAT.metal, 'metal'], [MAT.luz, 'luz'],
  [MAT.vidrio, 'vidrio'], [MAT.vidrioT, 'vidrioT'], [MAT.plano, 'plano']]);
// materiales del kit → glTF (mismos valores que en el sitio)
const PBR = {
  mate: { roughness: 0.78, metalness: 0.02 }, brillo: { roughness: 0.26, metalness: 0.12 }, metal: { roughness: 0.3, metalness: 0.85 },
  plano: { roughness: 0.85, metalness: 0 }, vidrio: { roughness: 0.04, metalness: 0.6, opacity: MAT.vidrio.opacity }, vidrioT: { roughness: 0.12, metalness: 0.35, opacity: MAT.vidrioT.opacity },
  luz: { roughness: 0.9, metalness: 0, luz: true },
};

function visible(o) { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true; }
// ¿la matriz solo gira de 90 en 90 grados? (entonces la caja mundial es exacta y se puede recortar)
function alineada(m) {
  const e = m.elements;
  for (const c of [0, 4, 8]) {
    const v = [e[c], e[c + 1], e[c + 2]], l = Math.hypot(...v) || 1;
    if (Math.max(...v.map(x => Math.abs(x) / l)) < 0.9995) return false;
  }
  return true;
}
const dentro = (z, x, zz) => x >= z.x0 && x <= z.x1 && zz >= z.z0 && zz <= z.z1;
const corta = (z, b) => b.max.x > z.x0 && b.min.x < z.x1 && b.max.z > z.z0 && b.min.z < z.z1;
const cabe = (z, b) => b.min.x >= z.x0 - 0.02 && b.max.x <= z.x1 + 0.02 && b.min.z >= z.z0 - 0.02 && b.max.z <= z.z1 + 0.02;

// ---------- 1. Recoger las piezas visibles ----------
function recoger(escena) {
  escena.updateMatrixWorld(true);
  const items = [];
  // a) el kit (miles de piezas instanciadas): solo las piezas fijas, no las animadas («a...» = personas, balones)
  for (const k in KIT.reg) {
    if (/^a[A-Z]/.test(k)) continue;
    const [geo, mat] = KIT.TIPOS[k];
    for (const o of KIT.reg[k]) {
      if (!visible(o.parent)) continue;
      items.push({ geo, tipo: TIPO_MAT.get(mat) || 'mate', color: o.userData.c.clone(), matriz: o.matrixWorld.clone(), mat: null, kit: k });
    }
  }
  // b) las demás mallas (carteles, pizarras, pantallas, cubiertas curvas...)
  const mallasKit = new Set(Object.values(KIT.mallas));
  escena.traverse(o => {
    if (!o.isMesh || o.isInstancedMesh || mallasKit.has(o) || !visible(o)) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    if (mats.some(m => !m || m.isShaderMaterial || m.blending !== THREE.NormalBlending || m.visible === false || m.opacity === 0 || m.colorWrite === false)) return;
    if (Array.isArray(o.material)) {
      for (const g of o.geometry.groups) items.push({ geo: o.geometry, rango: g, mat: o.material[g.materialIndex], matriz: o.matrixWorld.clone() });
    } else items.push({ geo: o.geometry, mat: o.material, matriz: o.matrixWorld.clone() });
  });
  return items;
}

// ---------- 2. Elegir y recortar según la zona ----------
function elegir(items, def) {
  const z = def.zona, [y0, y1] = def.y;
  const fuera = [], ok = [];
  const c = new THREE.Vector3();
  for (const it of items) {
    if (!it.geo.boundingBox) it.geo.computeBoundingBox();
    const b = it.geo.boundingBox.clone().applyMatrix4(it.matriz);
    if (!isFinite(b.min.x) || !corta(z, b)) continue;
    b.getCenter(c);
    if (c.y < y0 || c.y > y1) continue;
    const plano = it.geo.type === 'PlaneGeometry' && it.geo.parameters.widthSegments === 1 && it.geo.parameters.heightSegments === 1;
    const caja = it.geo.type === 'BoxGeometry' && !(it.mat && it.mat.map);
    const horizontal = b.max.y - b.min.y < 0.02;
    const suelo = (b.max.y - b.min.y <= 0.6 && b.max.y <= 0.75) || (plano && horizontal && b.max.y <= 0.75);
    const recortable = alineada(it.matriz) && (caja || (plano && horizontal));
    if (cabe(z, b)) { ok.push(it); continue; }
    // la pieza sale de la zona
    if (dentro(z, c.x, c.z)) {
      if (recortable && (def.corte || suelo)) ok.push({ ...it, recorte: b });
      else if (!def.corte || b.max.x - b.min.x < 3 && b.max.z - b.min.z < 3) ok.push(it); // un poco de saliente (toldo, farola)
      else fuera.push(it);
    } else if (suelo && recortable) ok.push({ ...it, recorte: b }); // suelo/camino que entra en la zona: se recorta
  }
  return ok;
}

// ---------- 3. Geometría de cada pieza en coordenadas del modelo ----------
const V = new THREE.Vector3(), N = new THREE.Vector3(), M3 = new THREE.Matrix3();
function geometriaDe(it, z) {
  if (it.recorte) {
    const b = it.recorte;
    const x0 = Math.max(b.min.x, z.x0), x1 = Math.min(b.max.x, z.x1), z0 = Math.max(b.min.z, z.z0), z1 = Math.min(b.max.z, z.z1);
    if (x1 - x0 < 0.01 || z1 - z0 < 0.01) return null;
    if (it.geo.type === 'BoxGeometry') {
      const g = new THREE.BoxGeometry(x1 - x0, b.max.y - b.min.y, z1 - z0);
      g.translate((x0 + x1) / 2, (b.min.y + b.max.y) / 2, (z0 + z1) / 2);
      return { g, mundo: true };
    }
    // plano horizontal recortado: 4 esquinas + coordenadas de textura recalculadas
    const inv = it.matriz.clone().invert(), p = it.geo.parameters;
    const yv = (b.min.y + b.max.y) / 2;
    const esq = [[x0, z1], [x1, z1], [x0, z0], [x1, z0]];
    const pos = [], uv = [];
    for (const [x, zz] of esq) {
      pos.push(x, yv, zz);
      V.set(x, yv, zz).applyMatrix4(inv);
      uv.push(V.x / p.width + 0.5, V.y / p.height + 0.5);
    }
    const nrm = new THREE.Vector3(0, 0, 1).transformDirection(it.matriz);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute([...nrm.toArray(), ...nrm.toArray(), ...nrm.toArray(), ...nrm.toArray()], 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    // cada triángulo mira hacia el mismo lado que el plano original
    const P = i => new THREE.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
    const tri = (i, j, k) => { const A = P(i); return P(j).sub(A).cross(P(k).sub(A)).dot(nrm) >= 0 ? [i, j, k] : [i, k, j]; };
    g.setIndex([...tri(0, 2, 1), ...tri(2, 3, 1)]);
    return { g, mundo: true };
  }
  return { g: it.geo, mundo: false };
}

// ---------- 4. Agrupar por material y fusionar ----------
function claveMaterial(it) {
  if (!it.mat) return `kit|${it.tipo}|${it.color.getHexString()}`;
  const m = it.mat;
  return ['m', m.type, m.color ? m.color.getHexString() : '', m.map ? m.map.uuid : '', m.transparent ? m.opacity : 1, m.alphaTest || 0, m.side,
    m.emissive ? m.emissive.getHexString() + (m.emissiveIntensity || 0) : '', m.vertexColors ? 'vc' : '', m.roughness, m.metalness].join('|');
}
function materialDe(it) {
  if (!it.mat) {
    const p = PBR[it.tipo] || PBR.mate;
    const m = new THREE.MeshStandardMaterial({ color: it.color, roughness: p.roughness, metalness: p.metalness, name: it.tipo + '-' + it.color.getHexString() });
    if (p.opacity != null) { m.transparent = true; m.opacity = p.opacity; m.depthWrite = false; }
    if (p.luz) { m.emissive = it.color.clone(); m.emissiveIntensity = 1; }
    return m;
  }
  const s = it.mat;
  const m = new THREE.MeshStandardMaterial({
    name: (s.name || s.type) + (s.map ? '-tex' : ''),
    color: s.color ? s.color.clone() : new THREE.Color(1, 1, 1),
    roughness: s.roughness != null ? s.roughness : 0.8, metalness: s.metalness != null ? s.metalness : 0,
    map: s.map ? copiaTextura(s.map, s.transparent) : null, side: s.side, vertexColors: !!s.vertexColors,
  });
  if (s.emissive && s.emissive.getHex() !== 0) { m.emissive = s.emissive.clone(); m.emissiveIntensity = s.emissiveIntensity ?? 1; if (s.emissiveMap) m.emissiveMap = copiaTextura(s.emissiveMap, s.transparent); }
  if (s.isMeshBasicMaterial) { // sin luz en el sitio (pantallas, carteles): se exporta luminoso
    m.emissive = m.color.clone(); m.emissiveIntensity = 1; m.roughness = 0.9; m.metalness = 0;
    if (m.map) { m.emissiveMap = m.map; }
  }
  if (s.transparent) {
    if (s.map && s.opacity >= 0.99) { m.alphaTest = 0.5; m.transparent = false; } // letras sobre fondo transparente
    else { m.transparent = true; m.opacity = s.opacity; m.depthWrite = false; }
  }
  if (s.alphaTest) m.alphaTest = s.alphaTest;
  return m;
}
// la repetición de la textura se mete en las coordenadas (PowerPoint no entiende las extensiones de glTF)
// texturas opacas en JPEG (mucho más ligeras); las que tienen partes transparentes, en PNG
// Con def.pxm (píxeles por metro), cada textura se reduce según el tamaño REAL del objeto:
// el campo de fútbol (64 m) conserva sus líneas, un cartel de 1 m queda pequeño (no se ve más).
const texturas = new Map(), extension = new Map();
let pxPorMetro = null, texturaMax = 1024;
function copiaTextura(t, conAlfa) {
  if (texturas.has(t.uuid)) return texturas.get(t.uuid);
  const c = t.clone();
  const im = t.image;
  if (pxPorMetro && im && im.width && extension.has(t.uuid)) {
    const lado = Math.max(im.width, im.height);
    const quiero = Math.round(Math.min(texturaMax, Math.max(64, pxPorMetro * extension.get(t.uuid))));
    if (quiero < lado) {
      const k = quiero / lado, cv = document.createElement('canvas');
      cv.width = Math.max(1, Math.round(im.width * k)); cv.height = Math.max(1, Math.round(im.height * k));
      const g = cv.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(im, 0, 0, cv.width, cv.height);
      c.source = new THREE.Source(cv); // imagen nueva: la textura del sitio NO se toca (clone() comparte la imagen)
    }
  }
  c.userData = { ...t.userData, mimeType: conAlfa ? 'image/png' : 'image/jpeg' };
  c.repeat.set(1, 1); c.offset.set(0, 0); c.rotation = 0; c.center.set(0, 0);
  c.wrapS = t.wrapS; c.wrapT = t.wrapT; c.needsUpdate = true;
  texturas.set(t.uuid, c);
  return c;
}

function agregar(cubo, it, info, desp) {
  const { g, mundo } = info;
  const plano = it.tipo === 'plano';
  const dy = desp.y + (it.subir || 0);
  const mat = mundo ? new THREE.Matrix4().makeTranslation(desp.x, dy, desp.z) : new THREE.Matrix4().makeTranslation(desp.x, dy, desp.z).multiply(it.matriz);
  M3.getNormalMatrix(mat);
  const espejo = mat.determinant() < 0;
  const P = g.attributes.position, Nn = g.attributes.normal, UV = g.attributes.uv, COL = g.attributes.color;
  let idx = g.index ? Array.from(g.index.array) : [...Array(P.count).keys()];
  if (it.rango) idx = idx.slice(it.rango.start, it.rango.start + it.rango.count);
  const rep = it.mat && it.mat.map ? it.mat.map : null;
  const conColor = it.mat && it.mat.vertexColors && COL;
  if (plano) { // sombreado plano (copas de los árboles): un vértice por esquina de triángulo
    for (let t = 0; t + 2 < idx.length; t += 3) {
      const tri = espejo ? [idx[t], idx[t + 2], idx[t + 1]] : [idx[t], idx[t + 1], idx[t + 2]];
      const pts = tri.map(i => new THREE.Vector3().fromBufferAttribute(P, i).applyMatrix4(mat));
      const n = pts[1].clone().sub(pts[0]).cross(pts[2].clone().sub(pts[0])).normalize();
      for (const p of pts) { cubo.pos.push(p.x, p.y, p.z); cubo.nor.push(n.x, n.y, n.z); cubo.uv.push(0, 0); cubo.ind.push(cubo.n++); }
    }
    return;
  }
  const mapa = new Map();
  const usar = (i) => {
    if (mapa.has(i)) return mapa.get(i);
    V.fromBufferAttribute(P, i).applyMatrix4(mat); cubo.pos.push(V.x, V.y, V.z);
    if (Nn) { N.fromBufferAttribute(Nn, i).applyMatrix3(M3).normalize(); cubo.nor.push(N.x, N.y, N.z); } else cubo.nor.push(0, 1, 0);
    if (UV) {
      let u = UV.getX(i), v = UV.getY(i);
      if (rep) { u = u * rep.repeat.x + rep.offset.x; v = v * rep.repeat.y + rep.offset.y; }
      cubo.uv.push(u, v);
    } else cubo.uv.push(0, 0);
    if (cubo.col) { if (conColor) cubo.col.push(COL.getX(i), COL.getY(i), COL.getZ(i)); else cubo.col.push(1, 1, 1); }
    const n = cubo.n++; mapa.set(i, n); return n;
  };
  for (let t = 0; t + 2 < idx.length; t += 3) {
    const a = usar(idx[t]), b = usar(idx[t + 1]), c = usar(idx[t + 2]);
    if (espejo) cubo.ind.push(a, c, b); else cubo.ind.push(a, b, c);
  }
}

// ---------- 5. Exportar un modelo ----------
export async function exportar(def, escena) {
  texturas.clear(); extension.clear();
  pxPorMetro = def.pxm || null; texturaMax = def.textura || 1024;
  const items = elegir(recoger(escena), def);
  // caja del modelo (para centrarlo: el suelo a la altura 0 y el centro en x = z = 0)
  const caja = new THREE.Box3();
  const infos = [];
  for (const it of items) {
    const info = geometriaDe(it, def.zona);
    if (!info) continue;
    infos.push([it, info]);
    if (!info.g.boundingBox) info.g.computeBoundingBox();
    const b = info.g.boundingBox.clone();
    if (!info.mundo) b.applyMatrix4(it.matriz);
    caja.union(b);
    // tamaño real de lo que cubre cada textura (para def.pxm)
    const mapa = it.mat && it.mat.map;
    if (mapa) {
      const s = b.getSize(new THREE.Vector3()), rep = Math.max(1, mapa.repeat.x, mapa.repeat.y);
      extension.set(mapa.uuid, Math.max(extension.get(mapa.uuid) || 0, Math.max(s.x, s.y, s.z) / rep));
    }
  }
  const centro = caja.getCenter(new THREE.Vector3());
  const desp = new THREE.Vector3(-centro.x, -caja.min.y, -centro.z);
  // Los suelos con textura (campo de fútbol, pistas, gimnasio) están a pocos milímetros de su losa:
  // visto de lejos, la tarjeta gráfica (y PowerPoint) no sabe cuál está delante y el dibujo se pierde.
  // Se suben lo justo (unos cm, invisible) para quedar claramente encima.
  const hueco = Math.max(0.01, Math.max(caja.max.x - caja.min.x, caja.max.z - caja.min.z) / 3000);
  const cajas = infos.map(([it, info]) => { const b = info.g.boundingBox.clone(); if (!info.mundo) b.applyMatrix4(it.matriz); return b; });
  infos.forEach(([it, info], k) => {
    const b = cajas[k];
    if (!(it.mat && it.mat.map) || it.mat.transparent || b.max.y - b.min.y > 0.001 || it.geo.type !== 'PlaneGeometry') return;
    const cx = (b.min.x + b.max.x) / 2, cz = (b.min.z + b.max.z) / 2, y = b.max.y;
    let debajo = -Infinity;
    cajas.forEach((o, j) => { if (j !== k && o.max.y <= y + 1e-4 && o.max.y > y - 0.2 && o.min.x <= cx && o.max.x >= cx && o.min.z <= cz && o.max.z >= cz) debajo = Math.max(debajo, o.max.y); });
    if (debajo > -Infinity && y - debajo < hueco) it.subir = hueco - (y - debajo);
  });
  const cubos = new Map();
  for (const [it, info] of infos) {
    const k = claveMaterial(it);
    if (!cubos.has(k)) cubos.set(k, { it, pos: [], nor: [], uv: [], ind: [], n: 0, col: it.mat && it.mat.vertexColors ? [] : null });
    agregar(cubos.get(k), it, info, desp);
  }
  const raiz = new THREE.Group(); raiz.name = def.id;
  let vertices = 0, triangulos = 0;
  for (const [k, c] of cubos) {
    if (!c.ind.length) continue;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(c.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(c.nor, 3));
    const conTextura = !!(c.it.mat && c.it.mat.map);
    if (conTextura) g.setAttribute('uv', new THREE.Float32BufferAttribute(c.uv, 2));
    if (c.col) g.setAttribute('color', new THREE.Float32BufferAttribute(c.col, 3));
    g.setIndex(c.n > 65535 ? new THREE.Uint32BufferAttribute(c.ind, 1) : new THREE.Uint16BufferAttribute(c.ind, 1));
    const malla = new THREE.Mesh(g, materialDe(c.it));
    malla.name = malla.material.name;
    raiz.add(malla);
    vertices += c.n; triangulos += c.ind.length / 3;
  }
  const tam = caja.getSize(new THREE.Vector3());
  const glb = await new GLTFExporter().parseAsync(raiz, { binary: true, maxTextureSize: def.textura || 1024 });
  return {
    glb: new Uint8Array(glb),
    info: { id: def.id, piezas: items.length, mallas: raiz.children.length, vertices, triangulos, tam: [+tam.x.toFixed(2), +tam.y.toFixed(2), +tam.z.toFixed(2)] },
  };
}

// Para Chrome sin ventana: devuelve el .glb en base64 (por trozos, para no saturar la memoria)
export async function exportarBase64(def, escena) {
  const { glb, info } = await exportar(def, escena);
  let s = '';
  for (let i = 0; i < glb.length; i += 0x8000) s += String.fromCharCode.apply(null, glb.subarray(i, i + 0x8000));
  return { b64: btoa(s), info: { ...info, bytes: glb.length } };
}
