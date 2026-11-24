/* The shared top bar, plus helpers that draw "factor to project" the way the model does. Needs assets/content.js first.
   <script src="assets/nav.js" data-base="" data-page="model|play|toy"></script> goes at the top of <body>. */
(function () {
  'use strict';
  var PF = window.PF, me = document.currentScript, base = me.getAttribute('data-base') || '', page = me.getAttribute('data-page') || 'model';
  var NS = 'http://www.w3.org/2000/svg', gid = 0;
  var h = function (t, a, p) { var e = document.createElement(t); for (var k in a) { if (k === 'text') e.textContent = a[k]; else e.setAttribute(k, a[k]); } if (p) p.appendChild(e); return e; };
  var s = function (t, a, p) { var e = document.createElementNS(NS, t); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };

  /* find a project (or a factor) by id */
  function find(id) {
    for (var i = 0; i < PF.factors.length; i++) {
      var f = PF.factors[i];
      for (var j = 0; j < f.ind.length; j++) if (f.ind[j].id === id) return { d: f.ind[j], f: f, i: i };
    }
    return null;
  }
  function toyFor(id) { for (var i = 0; i < PF.toys.length; i++) if (PF.toys[i].from[0] === id) return PF.toys[i]; return null; }

  /* a little drawing: the factor (an ellipse) and one project under it (a hatched card) */
  function glyph(f, d, href, label) {
    var a = h('a', { 'class': 'glyph', href: href, 'aria-label': label || (d.title + ', a project under ' + f.name + '. Open it in the model.') });
    var id = 'gp' + (++gid), v = s('svg', { viewBox: '0 0 240 132', 'aria-hidden': 'true' }, a);
    var defs = s('defs', {}, v), p = s('pattern', { id: id, width: 7, height: 7, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(28)' }, defs);
    s('rect', { width: 7, height: 7, fill: '#F8F9FC' }, p); s('circle', { cx: 3.5, cy: 3.5, r: 2.2, fill: f.col }, p);
    s('ellipse', { cx: 125, cy: 28, rx: 96, ry: 23, fill: 'none', stroke: '#12141C', 'stroke-width': 1.5, opacity: .45 }, v);
    s('ellipse', { cx: 120, cy: 33, rx: 96, ry: 23, fill: f.col, stroke: '#12141C', 'stroke-width': 3 }, v);
    var t = s('text', { x: 120, y: 33, 'text-anchor': 'middle', 'dominant-baseline': 'central', fill: '#12141C', style: 'font:800 18px Archivo,sans-serif;font-stretch:85%' }, v); t.textContent = f.name;
    s('path', { d: 'M120 58V86', stroke: '#12141C', 'stroke-width': 3.4, 'stroke-linecap': 'round', fill: 'none' }, v);
    s('polygon', { points: '120,92 112,79 128,79', fill: '#12141C', stroke: '#12141C', 'stroke-width': 1, 'stroke-linejoin': 'round' }, v);
    s('rect', { x: 28, y: 95, width: 184, height: 32, fill: 'url(#' + id + ')', stroke: '#12141C', 'stroke-width': 2.5 }, v);
    var halo = 'paint-order:stroke;stroke:#F8F9FC;stroke-width:4px;stroke-linejoin:round';
    var l = s('text', { x: 120, y: 111, 'text-anchor': 'middle', 'dominant-baseline': 'central', fill: '#12141C', style: 'font:800 14px Archivo,sans-serif;font-stretch:80%;' + halo }, v);
    l.textContent = d.n[0] + ' ' + d.n[1];
    return a;
  }

  /* the top bar */
  var inModel = page === 'model';
  var here = function (hash) { return inModel ? hash : base + 'index.html' + (hash === '#model' ? '' : hash); };
  var frag = document.createDocumentFragment();
  var skip = h('a', { 'class': 'skip', href: inModel ? '#model' : '#main', text: inModel ? 'Skip to the model' : 'Skip to the content' }, frag);
  if (inModel) h('a', { 'class': 'skip s2', href: '#list', text: 'Skip to the list' }, frag);
  var bar = h('header', { 'class': 'topbar', id: 'topbar' }, frag);
  var brand = h('div', { 'class': 'brand' }, bar);
  var wm = h('a', { 'class': 'wm', href: here('#model'), 'aria-label': 'Sukrit’s Portfolio, back to the model' }, brand); wm.appendChild(document.createTextNode('Sukrit’s Portfolio'));
  /* the model's read-out: "Specifying... Estimating... Converged... Fit: Suspiciously Good" (the diagram's intro drives it; every other page shows the end state) */
  var fitBar = h('div', { 'class': 'fitbar' }, brand);
  h('span', { 'class': 'sr-only', text: 'Fit: Suspiciously Good' }, fitBar);
  var fitT = h('span', { 'class': 'fit-t final', 'aria-hidden': 'true', text: 'Fit: Suspiciously Good' }, fitBar);
  var face = s('svg', { 'class': 'fit-face win', viewBox: '0 0 34 34', 'aria-hidden': 'true' }, fitBar);
  s('circle', { cx: 18, cy: 18, r: 13, fill: '#12141C' }, face);
  var fg = s('g', { 'class': 'fg' }, face);
  s('circle', { cx: 16, cy: 16, r: 13, fill: '#FFE14A', stroke: '#12141C', 'stroke-width': 2.5 }, fg);
  s('ellipse', { cx: 11.2, cy: 13.2, rx: 1.9, ry: 2.6, fill: '#12141C' }, fg);
  s('ellipse', { 'class': 'eye-r', cx: 20.8, cy: 13.2, rx: 1.9, ry: 2.6, fill: '#12141C' }, fg);
  s('path', { 'class': 'wink', d: 'M17.9 13.6Q20.8 10.9 23.7 13.6', fill: 'none', stroke: '#12141C', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, fg);
  s('path', { d: 'M9.6 19.4Q16 25.6 22.4 19.4', fill: 'none', stroke: '#12141C', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, fg);
  window.addEventListener('pf:fit', function (ev) {
    var d = ev.detail || {}, fin = d.state === 'fit';
    fitT.textContent = d.text || 'Fit: Suspiciously Good'; fitT.classList.toggle('final', fin);
    if (fin) { fitT.classList.remove('fit-pop'); void fitT.getBoundingClientRect(); fitT.classList.add('fit-pop'); }
    face.classList.toggle('win', fin);
  });
  fitBar.addEventListener('pointerenter', function () { if (face.classList.contains('win')) { face.classList.remove('win'); void face.getBoundingClientRect(); setTimeout(function () { face.classList.add('win'); }, 260); } });
  var btn = h('button', { 'class': 'menu-btn', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'nav' }, bar); h('i', { 'aria-hidden': 'true' }, btn); var bt = h('span', { text: 'Menu' }, btn);
  var nav = h('nav', { id: 'nav', 'aria-label': 'Sections' }, bar);
  var items = [['model', 'Model', here('#model')], ['play', 'Play', base + 'play.html'], ['list', 'List', here('#list')]];
  var links = {};
  items.forEach(function (it) { var a = h('a', { href: it[2] }, nav); h('span', { text: it[1] }, a); links[it[0]] = a; });
  var el = h('div', { 'class': 'else' }, nav);
  [['Design', PF.links.webflow], ['Resume', PF.links.resume], ['Contact', PF.links.contact]].forEach(function (x) {
    var a = h('a', { href: x[1], target: '_blank', rel: 'noopener' }, el); h('span', { text: x[0] }, a); h('b', { text: '↗', 'aria-hidden': 'true' }, a);
    a.setAttribute('aria-label', x[0] + ' (opens in a new tab)');
  });
  document.body.insertBefore(frag, document.body.firstChild);

  function setCurrent(k) { Object.keys(links).forEach(function (n) { if (n === k) links[n].setAttribute('aria-current', 'page'); else links[n].removeAttribute('aria-current'); }); }
  if (page === 'model') {
    document.body.classList.add('at-top'); setCurrent('model');
    var ids = ['model', 'list'], ticking = false;
    var upd = function () {
      ticking = false; document.body.classList.toggle('at-top', window.scrollY < 6);
      var cur = 'model', line = window.innerHeight * .4;
      ids.forEach(function (i) { var e = document.getElementById(i); if (e && e.getBoundingClientRect().top <= line) cur = i; });
      setCurrent(cur);
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    window.addEventListener('resize', upd); upd();
  } else { setCurrent('play'); }

  function close(focus) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); bt.textContent = 'Menu'; if (focus) btn.focus(); }
  btn.addEventListener('click', function () { var o = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', String(o)); bt.textContent = o ? 'Close' : 'Menu'; });
  nav.addEventListener('click', function (ev) { if (ev.target.closest('a')) close(false); });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && nav.classList.contains('open')) close(true); });

  window.PFUI = { find: find, toyFor: toyFor, glyph: glyph, base: base };
})();
