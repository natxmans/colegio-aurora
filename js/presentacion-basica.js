// =========================================================
// LA PRESENTACIÓN (12 diapositivas) — sin bibliotecas, para que funcione SIEMPRE
// (aunque no haya 3D, ni Internet para las bibliotecas).
// Anterior / siguiente, teclado, deslizar con el dedo, miniaturas,
// pantalla completa (con plan B para los teléfonos), texto y descarga del .pptx.
// =========================================================
(function () {
  var N = 12, i = 0, textos = null, completa = false;
  var $ = function (id) { return document.getElementById(id); };
  var caja = $('ppt'), marco = $('ppt-marco');
  if (!caja || !marco) return;
  var src = function (k) { return 'img/diapositivas/diapositiva-' + (k < 9 ? '0' : '') + (k + 1) + '.jpg'; };
  var ALT = ['Portada: Colegio Pablo Picasso, nuestro colegio ideal', 'Presentación del colegio', 'El uniforme escolar y la ropa de diario',
    'El edificio', 'Las aulas y los ordenadores', 'Las nueve asignaturas', 'Los dormitorios', 'El complejo deportivo',
    'Los espacios comunes', 'La vida en el internado', 'El horario', '¿Por qué nos gusta nuestro colegio?'];

  // Imágenes: la primera ya está en la página; las demás se crean cuando hacen falta
  var imgs = [marco.querySelector('img.diapo')];
  function img(k) {
    if (!imgs[k]) {
      var im = document.createElement('img');
      im.className = 'diapo despues'; im.src = src(k); im.alt = 'Diapositiva ' + (k + 1) + ': ' + ALT[k];
      im.draggable = false; im.decoding = 'async'; im.width = 1600; im.height = 900;
      marco.insertBefore(im, $('ppt-ant'));
      imgs[k] = im;
    }
    return imgs[k];
  }
  // Miniaturas
  var minis = $('ppt-minis');
  for (var k = 0; k < N; k++) (function (k) {
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-label', 'Ir a la diapositiva ' + (k + 1));
    b.innerHTML = '<img src="' + src(k) + '" alt="" loading="lazy" width="160" height="90" /><span>' + (k + 1) + '</span>';
    b.onclick = function () { ir(k); };
    minis.appendChild(b);
  })(k);

  function ir(n) {
    n = Math.max(0, Math.min(N - 1, n));
    i = n;
    for (var k = 0; k < N; k++) {
      if (Math.abs(k - i) <= 1 || imgs[k]) {
        var im = img(k);
        im.className = 'diapo ' + (k === i ? 'activa' : k < i ? 'antes' : 'despues');
      }
    }
    $('ppt-num').textContent = String(i + 1);
    $('ppt-ant').disabled = $('ppt-ant2').disabled = i === 0;
    $('ppt-sig').disabled = $('ppt-sig2').disabled = i === N - 1;
    var bs = minis.children;
    for (var j = 0; j < bs.length; j++) { bs[j].className = j === i ? 'activa' : ''; bs[j].setAttribute('aria-selected', String(j === i)); }
    pintarTexto();
    if (i < N - 1) { var pre = new Image(); pre.src = src(i + 1); }
  }
  $('ppt-ant').onclick = $('ppt-ant2').onclick = function () { ir(i - 1); };
  $('ppt-sig').onclick = $('ppt-sig2').onclick = function () { ir(i + 1); };

  // Texto de la diapositiva (se carga cuando se pide)
  var verTexto = false;
  function pintarTexto() {
    var t = $('ppt-texto');
    t.hidden = !verTexto;
    if (!verTexto) return;
    if (!textos) { t.textContent = 'Cargando el texto…'; return; }
    t.innerHTML = '';
    (textos[i] || []).forEach(function (l, k) { var p = document.createElement('p'); p.textContent = l; if (k === 0) p.className = 'tit'; t.appendChild(p); });
  }
  $('ppt-ver-texto').onclick = function () {
    verTexto = !verTexto;
    this.textContent = verTexto ? 'Ocultar el texto' : 'Ver el texto';
    this.setAttribute('aria-expanded', String(verTexto));
    if (verTexto && !textos) {
      fetch('js/datos/diapositivas.json').then(function (r) { return r.json(); }).then(function (j) { textos = j; pintarTexto(); })
        .catch(function () { $('ppt-texto').textContent = 'No se ha podido cargar el texto.'; });
    }
    pintarTexto();
  };

  // Pantalla completa (si el teléfono no la permite: modo "pseudo" a toda la ventana)
  function ponerCompleta(v) {
    completa = v;
    caja.classList.toggle('pseudo-completa', v && !(document.fullscreenElement || document.webkitFullscreenElement));
    $('ppt-completa').querySelector('span').textContent = v ? 'Salir' : 'Pantalla completa';
  }
  $('ppt-completa').onclick = function () {
    var fe = document.fullscreenElement || document.webkitFullscreenElement;
    if (completa || fe) {
      if (fe) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      ponerCompleta(false);
      return;
    }
    var pedir = caja.requestFullscreen || caja.webkitRequestFullscreen;
    if (pedir) {
      try { var r = pedir.call(caja); if (r && r.catch) r.catch(function () { ponerCompleta(true); caja.classList.add('pseudo-completa'); }); ponerCompleta(true); }
      catch (e) { ponerCompleta(true); caja.classList.add('pseudo-completa'); }
    } else { ponerCompleta(true); caja.classList.add('pseudo-completa'); }
  };
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (ev) {
    document.addEventListener(ev, function () { ponerCompleta(!!(document.fullscreenElement || document.webkitFullscreenElement)); });
  });

  // Teclado: flechas cuando la presentación está a la vista (o en pantalla completa)
  window.addEventListener('keydown', function (e) {
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (document.documentElement.classList.contains('explorando')) return;
    var r = caja.getBoundingClientRect();
    var aLaVista = r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.35;
    if (!completa && !aLaVista) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); ir(i + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); ir(i - 1); }
    if (e.key === 'Escape' && completa && !document.fullscreenElement) ponerCompleta(false);
  });

  // Deslizar con el dedo
  var x0 = null;
  marco.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
  marco.addEventListener('pointerup', function (e) {
    if (x0 === null) return;
    var dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) ir(i + (dx < 0 ? 1 : -1));
  });

  window.__ppt = { ir: ir, actual: function () { return i; } };
  ir(0);
})();
