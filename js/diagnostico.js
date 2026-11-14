// =========================================================
// ¿PUEDE ESTE APARATO MOSTRAR EL SITIO? (se ejecuta al empezar, sin bibliotecas)
// Comprueba, cuando el navegador lo permite: el navegador, WebGL (3D),
// el tamaño de las texturas, la memoria, el procesador, la conexión y la pantalla.
// Resultado: « Compatible », « Compatible con rendimiento reducido » o
// « Algunas funciones no están disponibles », y una calidad propuesta.
// La presentación funciona SIEMPRE, aunque la 3D no pueda funcionar.
// =========================================================
(function () {
  var C = [];  // lista de comprobaciones { t, ok (true / false / 'medio'), d }
  var d = { webgl: false, calidad: 'normal', nivel: 'ok', checks: C,
    blando: false, movil: false };
  var add = function (t, ok, det) { C.push({ t: t, ok: ok, d: det || '' }); };

  // 1) Navegador
  var modulos = 'noModule' in document.createElement('script');
  var mapa = !!(window.HTMLScriptElement && HTMLScriptElement.supports && HTMLScriptElement.supports('importmap'));
  var basicos = !!(window.Promise && window.fetch && window.IntersectionObserver && window.ResizeObserver);
  d.navegador = modulos && mapa && basicos;
  add('Navegador moderno', d.navegador, d.navegador ? 'Módulos, mapa de importación y funciones modernas' : 'El navegador es antiguo: actualízalo para ver la 3D');

  // 2) WebGL y tarjeta gráfica
  var gl = null, cv = document.createElement('canvas'), v2 = false;
  try { gl = cv.getContext('webgl2'); v2 = !!gl; if (!gl) gl = cv.getContext('webgl') || cv.getContext('experimental-webgl'); } catch (e) { gl = null; }
  d.webgl = !!gl;
  var gpu = '', tex = 0;
  if (gl) {
    try { var ext = gl.getExtension('WEBGL_debug_renderer_info'); gpu = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : ''; } catch (e) { gpu = ''; }
    tex = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0;
    var lose = gl.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
  }
  d.blando = /swiftshader|llvmpipe|software|basic render/i.test(gpu);
  add('WebGL (gráficos 3D)', d.webgl ? (d.blando ? 'medio' : true) : false,
    d.webgl ? (v2 ? 'WebGL 2' : 'WebGL 1') + (d.blando ? ' · sin tarjeta gráfica (lento)' : '') : 'No disponible: la maqueta 3D no se puede mostrar');
  add('Texturas y animaciones', tex >= 4096 ? true : tex >= 2048 ? 'medio' : (d.webgl ? 'medio' : false), tex ? 'Texturas de hasta ' + tex + ' px' : 'Sin información');

  // 3) Memoria y procesador
  var mem = navigator.deviceMemory || 0, nucleos = navigator.hardwareConcurrency || 0;
  add('Memoria', mem ? (mem >= 6 ? true : mem >= 3 ? 'medio' : 'medio') : true, mem ? 'Unos ' + mem + ' GB' : 'El navegador no lo indica');
  add('Procesador', nucleos ? (nucleos >= 6 ? true : 'medio') : true, nucleos ? nucleos + ' núcleos' : 'El navegador no lo indica');

  // 4) Pantalla y tipo de aparato
  d.movil = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && Math.min(screen.width, screen.height) < 900);
  add('Pantalla', true, (d.movil ? 'Teléfono o tableta · ' : 'Ordenador · ') + Math.round(screen.width) + ' × ' + Math.round(screen.height));

  // 5) Conexión (la 3D carga sus bibliotecas por Internet)
  var cx = navigator.connection || {};
  var lenta = cx.saveData || /(^|-)2g|3g/.test(cx.effectiveType || '');
  d.enLinea = navigator.onLine !== false;
  add('Conexión a Internet', d.enLinea ? (lenta ? 'medio' : true) : false,
    !d.enLinea ? 'Sin conexión: la 3D no puede cargarse' : (cx.effectiveType ? 'Tipo ' + cx.effectiveType + (cx.saveData ? ' · ahorro de datos' : '') : 'Conectado'));

  // 6) Movimiento reducido (accesibilidad)
  var calma = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (calma) add('Movimiento reducido', 'medio', 'Tu sistema pide menos animaciones');

  // Resultado y calidad propuesta
  if (!d.webgl || !d.navegador || !d.enLinea) { d.nivel = 'no'; d.calidad = null; }
  else if (d.blando || lenta || (d.movil && ((mem && mem <= 3) || (nucleos && nucleos <= 4)))) { d.nivel = 'medio'; d.calidad = 'ligera'; }
  else if (d.movil || (mem && mem <= 4) || (nucleos && nucleos <= 4)) { d.nivel = 'ok'; d.calidad = 'normal'; }
  else { d.nivel = 'ok'; d.calidad = 'alta'; }
  d.texto = { ok: 'Compatible', medio: 'Compatible con rendimiento reducido', no: 'Algunas funciones no están disponibles' }[d.nivel];
  window.__diag = d;

  // Mensajes sobre la carga de la 3D (los usa main.js)
  // reintentar (opcional): función que vuelve a intentar la carga → se muestra un botón «Reintentar»
  window.__errorSitio = function (txt, reintentar) {
    var e = document.getElementById('carg-error'), m = document.getElementById('carg-msg');
    if (e) { e.textContent = txt; e.hidden = false; }
    if (m) m.textContent = '';
    var b = document.querySelector('.campus-espera .carg-barra'); if (b) b.style.display = 'none';
    var caja = document.querySelector('.campus-espera-caja'), btn = document.getElementById('carg-reintentar');
    if (btn) btn.remove();
    if (caja && reintentar) {
      btn = document.createElement('button');
      btn.id = 'carg-reintentar'; btn.type = 'button'; btn.className = 'btn btn-primario btn-peq carg-reintentar';
      btn.textContent = 'Reintentar';
      btn.addEventListener('click', function () {
        btn.remove(); if (e) e.hidden = true;
        if (b) b.style.display = '';
        if (m) m.textContent = 'Cargando de nuevo…';
        reintentar();
      });
      caja.appendChild(btn);
    }
  };
  window.__progreso3d = function (p, txt) {
    var b = document.getElementById('carg-progreso'), m = document.getElementById('carg-msg');
    if (b) b.style.width = Math.round(p) + '%';
    if (m && txt) m.textContent = txt;
  };

  // Botón del diagnóstico en el menú + panel con el detalle
  function pintar() {
    var b = document.getElementById('diag-pill'), p = document.getElementById('diag-panel');
    if (!b || !p) return;
    b.className = 'diag-pill ' + d.nivel;
    b.querySelector('span').textContent = d.texto;
    var ico = { 'true': '✓', 'medio': '!', 'false': '✗' };
    var filas = C.map(function (c) { return '<li class="' + String(c.ok) + '"><b>' + ico[String(c.ok)] + '</b><div><strong>' + c.t + '</strong><small>' + c.d + '</small></div></li>'; }).join('');
    var nota = d.nivel === 'no'
      ? 'La presentación y los textos funcionan. La maqueta 3D no se puede mostrar en este aparato: verás una imagen del campus.'
      : d.nivel === 'medio' ? 'Todo funciona, pero la 3D se mostrará en calidad ligera (menos detalles y menos personajes).' : 'Todo funciona. La 3D se muestra en calidad ' + (d.calidad === 'alta' ? 'alta' : 'normal') + '.';
    p.innerHTML = '<div class="diag-cab"><b>' + d.texto + '</b><button type="button" class="cerrar" aria-label="Cerrar">✕</button></div>' +
      '<ul>' + filas + '</ul><p>' + nota + '</p><div class="diag-calidad" id="diag-calidad"></div>';
    p.querySelector('.cerrar').onclick = function () { p.hidden = true; };
    b.onclick = function () { p.hidden = !p.hidden; if (window.__pintarCalidad) window.__pintarCalidad(); };
  }
  d.repintar = pintar;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pintar); else pintar();
})();
