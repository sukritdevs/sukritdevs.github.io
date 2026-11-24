/* The portfolio as a measurement model: background causes above, an unobserved "Sukrit", five factors, and the projects as indicators. It fills the window. */
(function () {
  'use strict';
  var PF = window.PF, NS = 'http://www.w3.org/2000/svg';
  var host = document.getElementById('model');
  if (!host || !PF) return;
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]still/.test(location.search);
  /* The vertical (phone) drawing is for phones and touch tablets. A desktop window that is merely narrow (a 1080p screen at 125-150% scaling with a wide side taskbar is about 1100-1250 CSS px) keeps the real diagram. */
  var mq = window.matchMedia('(max-width: 819px), (pointer: coarse) and (max-width: 1199px)');
  var MOBILE = mq.matches || /[?&]phone/.test(location.search);
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var rand = function (a, b) { return a + Math.random() * (b - a); };
  var el = function (t, a, p) { var e = document.createElementNS(NS, t); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };
  var html = function (t, a, p) { var e = document.createElement(t); for (var k in a) { if (k === 'text') e.textContent = a[k]; else e.setAttribute(k, a[k]); } if (p) p.appendChild(e); return e; };
  var txt = function (p, cls, s, x, y, anchor) { var t = el('text', { 'class': cls, x: x || 0, y: y || 0 }, p); t.textContent = s; if (anchor) t.setAttribute('text-anchor', anchor); return t; };

  var F = PF.factors, mode = /[?&]nerd/.test(location.search) ? 'nerd' : 'plain';
  var allInd = []; F.forEach(function (f, i) { f.ind.forEach(function (d, j) { d._f = i; d._j = j; allInd.push(d); }); });
  var byId = {}; allInd.forEach(function (d) { byId[d.id] = d; });
  var fIdx = {}; F.forEach(function (f, i) { fIdx[f.key] = i; });
  var CROSS = PF.cross.map(function (c) { return { d: byId[c[0]], other: fIdx[c[1]], label: c[2] }; });

  /* ---------- card shown on hover, or as a bottom sheet on small screens ---------- */
  var pop = html('div', { 'class': 'pop', role: 'dialog', 'aria-label': 'Details', tabindex: '-1' }, document.body);
  var scrim = html('div', { 'class': 'scrim' }, document.body);
  var popNode = null, pinnedPop = false, hideTimer = 0, showTimer = 0, cur = null, lastFocus = null;
  function chipRow(parent, arr) { var c = html('div', { 'class': 'chips' }, parent); arr.forEach(function (a) { if (a) html('span', { text: a[0], 'class': a[1] || '' }, c); }); return c; }
  var factorOf = function (id) { var d = byId[id]; return d ? d._f : -1; };
  function toyLinks(parent, toys, label) {
    if (!toys.length) return; html('p', { 'class': 'pk', text: label }, parent);
    toys.forEach(function (t) { var a = html('a', { 'class': 'ptoy', href: t.file }, parent); html('b', { text: t.title }, a); html('span', { text: t.q }, a); });
  }
  function fillPop(n) {
    pop.textContent = '';
    var col = '#ccd', coverText = '', title = '', desc = '', chips = [], role = null, note = null, noteCol = null, url = null, urlLabel = 'Open', soon = null, list = null, also = null, toys = [], nerd = mode === 'nerd';
    if (n.type === 'root') {
      col = '#F4807A'; coverText = 'unobserved'; title = 'Sukrit';
      desc = 'A person cannot be measured directly, so this is inferred from everything around it: where I trained, what I have done, and the work in the factors below.';
      if (nerd) chips.push(['\u03BE \u00B7 second-order', 'mono']);
    } else if (n.type === 'factor') {
      var f = F[n.f]; col = f.col; coverText = 'factor'; title = f.name; desc = f.desc;
      if (nerd) chips.push(['\u03B7 \u00B7 first-order factor', 'mono']);
      list = f.ind.map(function (d) { return d.title; });
      also = CROSS.filter(function (c) { return c.other === n.f; }).map(function (c) { return c.d.title; });
      toys = PF.toys.filter(function (t) { return factorOf(t.from[0]) === n.f; });
    } else if (n.type === 'ind') {
      var d = n.d, f2 = F[n.f], ce = CROSS.filter(function (c) { return c.d === d; })[0];
      col = f2.col; coverText = f2.name; title = d.title; desc = nerd && d.nerd ? d.nerd : d.plain; role = d.role;
      chips = [[d.status]]; if (nerd && d.tag) chips.push([d.tag, 'mono']);
      if (ce) { note = 'Also counts toward ' + F[ce.other].name + ': ' + ce.label + '.'; noteCol = F[ce.other].col; }
      url = d.url; urlLabel = d.urlLabel || 'Open';
      if (d.app) { var au = PF.apps[d.app]; if (au) { url = au; urlLabel = 'Open the app'; } else { url = null; soon = 'Live app coming soon'; } }
      toys = PF.toys.filter(function (t) { return t.from.indexOf(d.id) >= 0; }).sort(function (a, b) { return (b.from[0] === d.id) - (a.from[0] === d.id); });
    } else if (n.type === 'cause') {
      var c = n.c; title = c.title; desc = c.desc; col = '#BFC4CF'; coverText = 'background'; url = c.url; urlLabel = c.urlLabel;
    }
    pop.style.setProperty('--c', col);
    var cv = html('div', { 'class': 'cover' }, pop); cv.style.setProperty('--c', col); html('span', { text: coverText }, cv);
    var x = html('button', { type: 'button', 'class': 'pclose', 'aria-label': 'Close details', text: '\u00D7' }, cv);
    x.addEventListener('click', function (ev) { ev.stopPropagation(); if (cur) cur.unpin(true); });
    var b = html('div', { 'class': 'pbody' }, pop);
    if (chips.length) chipRow(b, chips); html('h3', { text: title }, b);
    if (role) html('p', { 'class': 'prole', text: role }, b);
    html('p', { text: desc }, b);
    if (note) { var nt = html('p', { 'class': 'pnote', text: note }, b); nt.style.setProperty('--c', noteCol); }
    if (list) { html('p', { 'class': 'pk', text: 'Projects' }, b); var u = html('ul', {}, b); list.forEach(function (t) { html('li', { text: t }, u); }); }
    if (also && also.length) { html('p', { 'class': 'pk', text: 'Also counts here' }, b); var u2 = html('ul', {}, b); also.forEach(function (t) { html('li', { text: t }, u2); }); }
    if (url) { var ext = /^https?:/.test(url); var a = html('a', { 'class': 'plink', href: url, text: urlLabel + (ext ? ' \u2197' : '') }, b); if (ext) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); } }
    else if (soon) html('span', { 'class': 'soon', text: soon }, b);
    toyLinks(b, toys, n.type === 'ind' ? 'Play with it' : 'Toys from this factor');
  }
  function placePop(n) {
    var r = n.g.getBoundingClientRect(), vw = window.innerWidth, vh = window.innerHeight, cw = pop.offsetWidth, ch = pop.offsetHeight;
    var bar = document.getElementById('topbar'), top = (bar ? bar.offsetHeight : 0) + 8, x, y;
    var dk = host.querySelector('.dock'), floor = dk ? Math.min(vh, dk.getBoundingClientRect().top) - 8 : vh - 8; if (floor < top + 120) floor = vh - 8;
    if (r.top - ch - 12 >= top) { x = r.left + r.width / 2 - cw / 2; y = r.top - ch - 12; }          /* above, when it fits */
    else if (r.bottom + ch + 12 <= floor) { x = r.left + r.width / 2 - cw / 2; y = r.bottom + 12; }  /* below */
    else {                                                                                              /* beside, so it never covers the thing it describes */
      x = (r.right + 14 + cw <= vw - 8) ? r.right + 14 : r.left - 14 - cw;
      y = r.top + r.height / 2 - ch / 2;
    }
    pop.style.left = clamp(x, 8, vw - cw - 8) + 'px'; pop.style.top = clamp(y, top, Math.max(top, floor - ch)) + 'px';
  }
  function showPop(n, pin) {
    clearTimeout(hideTimer); popNode = n; pinnedPop = !!pin; fillPop(n); if (cur && cur.calm) cur.calm();
    pop.classList.toggle('sheet', MOBILE); pop.classList.toggle('pinned', !!pin && !MOBILE);
    if (MOBILE) { pop.style.left = ''; pop.style.top = ''; scrim.classList.add('show'); }
    pop.classList.add('show'); if (!MOBILE) placePop(n);
  }
  function hidePop() { pop.classList.remove('show', 'pinned'); scrim.classList.remove('show'); popNode = null; pinnedPop = false; }
  pop.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
  pop.addEventListener('mouseleave', function () { if (!pinnedPop && cur) cur.leave(); });
  scrim.addEventListener('click', function () { if (cur) cur.unpin(true); });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && cur && popNode) { ev.preventDefault(); cur.unpin(true); } });
  document.addEventListener('click', function (ev) { if (!pinnedPop || MOBILE || !cur) return; if (pop.contains(ev.target) || host.contains(ev.target)) return; cur.unpin(false); });
  document.addEventListener('click', function (ev) { var a = ev.target.closest && ev.target.closest('.topbar a'); if (a && cur && popNode) cur.unpin(false); });
  window.addEventListener('hashchange', function () { if (cur && popNode) cur.unpin(false); });
  window.addEventListener('scroll', function () { if (popNode && !MOBILE) { if (pinnedPop) placePop(popNode); else if (cur) cur.unpin(false); } }, { passive: true });

  function build() {
    var W = MOBILE ? 390 : 1470;
    var alive = true, raf2 = 0, running = false, anims = [], wordTimer = 0, defaultWord = 'SUKRIT', curWord = 'SUKRIT';
    var stage = html('div', { 'class': 'stage' + (MOBILE ? ' mobile' : ''), 'data-mode': mode }, host);
    var dock = html('div', { 'class': 'dock' }, stage);
    var dockL = html('div', { 'class': 'dockl' }, dock);
    var hint = html('div', { 'class': 'hintline' }, dockL); hint.textContent = MOBILE ? '' : 'Hover, click or drag anything. The same work is listed in full further down.'; if (MOBILE) hint.hidden = true;
    var legWrap = html('div', { 'class': 'legend' }, dockL);
    var ctrl = html('div', { 'class': 'ctrl' }, dock);
    var mbox = html('div', { 'class': 'modebox' }, ctrl);
    html('span', { 'class': 'mode-l', id: 'modeL', text: 'Explain it in' }, mbox);
    var seg = html('div', { 'class': 'seg', role: 'group', 'aria-labelledby': 'modeL' }, mbox);
    var bP = html('button', { type: 'button', text: 'Plain English' }, seg);
    var bN = html('button', { type: 'button', text: 'Nerd' }, seg);
    var tip = html('span', { 'class': 'mode-tip', 'aria-hidden': 'true', text: 'Try Nerd for the methods' }, mbox); tip.hidden = true;
    var bR = html('button', { type: 'button', 'class': 'replay', text: 'Replay the build' }, ctrl);
    var canvas = html('div', { 'class': 'canvas' }, stage);
    var big = html('div', { 'class': 'bigword', 'aria-hidden': 'true' }, canvas);
    var bw = html('span', { text: 'SUKRIT' }, big);

    /* a short way in: what this picture is, in plain words or in SEM terms, and where to go next */
    var intro = html('div', { 'class': 'intro' }, MOBILE ? dockL : canvas);
    intro.innerHTML = '<p class="intro-lead">I’m Sukrit, a psychology researcher who builds tools. This is a map of my work.</p>' +
      '<p class="pl">Ovals are areas of work. Boxes are the projects behind them. Hover or tap anything to open it.</p>' +
      '<p class="nd">A measurement model. Ovals are factors, boxes are projects (indicators), and a dotted arrow means one project counts toward two factors.</p>';
    var acts = html('div', { 'class': 'acts' }, MOBILE ? intro : canvas);
    html('a', { 'class': 'btn', href: 'play.html', text: 'Try the toys' }, acts);
    html('a', { 'class': 'btn alt', href: (PF.links && PF.links.resume) || '#', target: '_blank', rel: 'noopener', text: 'Resume ↗' }, acts);

    /* layout: on desktop the drawing takes the exact shape of the window */
    var SP = 78, HW = 36, HH = 25, GAP = 18, ROW = 72, H;
    var blockH = F.map(function (f) { return MOBILE ? (f.ind.length > 3 ? 268 : 196) : 0; });
    if (MOBILE) { H = 300; blockH.forEach(function (b) { H += b; }); H += 40; }
    else { var cw = canvas.clientWidth || window.innerWidth, ch = canvas.clientHeight || (window.innerHeight - 120); H = clamp(Math.round(W * ch / cw), 540, 1100); }
    build.H = H;
    var nodes = [], edges = [], facN = [], indN = [], cauN = [], root;
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'group', 'aria-label': 'Model of my work: background above, five factors, and the projects as evidence for each' }, canvas);
    legWrap.innerHTML = '<span><svg width="30" height="16" aria-hidden="true"><ellipse cx="15" cy="8" rx="13" ry="6.5" fill="#FF8A4C" stroke="#12141C" stroke-width="2"/></svg><span class="pl">factor (area of work)</span><span class="nd">factor</span></span>' +
      '<span><svg width="26" height="16" aria-hidden="true"><rect x="2" y="2" width="22" height="12" fill="#FFE14A" stroke="#12141C" stroke-width="2"/></svg><span class="pl">project</span><span class="nd">indicator (project)</span></span>' +
      '<span><svg width="26" height="16" aria-hidden="true"><rect x="2" y="2" width="22" height="12" fill="#FFE14A" stroke="#12141C" stroke-width="2"/><polygon points="14,2 24,2 24,10" fill="#FF7AB6" stroke="#12141C" stroke-width="1.6"/></svg><span class="pl">counts for two</span><span class="nd">cross-loading</span></span>' +
      '<span><svg width="30" height="16" aria-hidden="true"><ellipse cx="15" cy="8" rx="13" ry="6.5" fill="#F8F9FC" stroke="#12141C" stroke-width="2" stroke-dasharray="4 3"/></svg><span class="pl">me, inferred</span><span class="nd">latent, inferred</span></span>' +
      '<span><svg width="26" height="16" aria-hidden="true"><rect x="2" y="2" width="22" height="12" fill="#F8F9FC" stroke="#12141C" stroke-width="2"/></svg><span class="pl">background</span><span class="nd">cause (MIMIC)</span></span>' +
      '<span><svg width="18" height="16" aria-hidden="true"><circle cx="9" cy="8" r="6.5" fill="#F4807A" stroke="#12141C" stroke-width="2"/><path d="M7.4 5.3L11.6 8L7.4 10.7Z" fill="#12141C"/></svg>has a toy</span>';
    if (MOBILE) { var leg2 = html('div', { 'class': 'legend legend2' }, stage); leg2.innerHTML = legWrap.innerHTML; }
    var defs = el('defs', {}, svg);
    var bgL = el('g', {}, svg), edgeL = el('g', {}, svg), nodeL = el('g', {}, svg), labL = el('g', {}, svg);
    F.forEach(function (f, i) {
      var p = el('pattern', { id: 'ht' + i, width: 7, height: 7, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(28)' }, defs);
      el('rect', { width: 7, height: 7, fill: '#F8F9FC' }, p); el('circle', { cx: 3.5, cy: 3.5, r: 2.2, fill: f.col }, p);
    });
    [[26, 26], [W - 26, 26], [26, H - 26], [W - 26, H - 26]].forEach(function (c) {
      el('circle', { cx: c[0], cy: c[1], r: 9, 'class': 'reg-m' }, bgL);
      el('path', { d: 'M' + (c[0] - 16) + ' ' + c[1] + 'H' + (c[0] + 16) + 'M' + c[0] + ' ' + (c[1] - 16) + 'V' + (c[1] + 16), 'class': 'reg-m' }, bgL);
    });

    var yCause = MOBILE ? 50 : Math.max(60, H * 0.09), yRoot = MOBILE ? 172 : H * 0.27, yFac = MOBILE ? 0 : H * 0.54, yInd = MOBILE ? 0 : H * 0.835;
    root = MOBILE ? { type: 'root', f: -1, x: 195, y: yRoot, rx: 112, ry: 40 } : { type: 'root', f: -1, x: W / 2, y: yRoot, rx: 132, ry: 50 };
    nodes.push(root);
    PF.causes.forEach(function (c, k) {
      var cn = MOBILE ? { type: 'cause', f: -1, x: 75 + k * 120, y: yCause, hw: 54, hh: 28, c: c } : { type: 'cause', f: -1, x: W / 2 + (k - 1) * 240, y: yCause, hw: 78, hh: 27, c: c };
      nodes.push(cn); cauN.push(cn); edges.push({ a: cn, b: root, kind: 'cause' });
    });
    var total = 0; F.forEach(function (f) { total += f.ind.length * SP; }); total += GAP * (F.length - 1);
    var cursor = (W - total) / 2, ybase = 300;
    F.forEach(function (f, i) {
      var fn, n = f.ind.length;
      if (MOBILE) fn = { type: 'factor', f: i, x: 195, y: ybase + 30, rx: 100, ry: 34, name: f.name };
      else fn = { type: 'factor', f: i, x: cursor + n * SP / 2, y: yFac, rx: 104, ry: 46, name: f.name };
      nodes.push(fn); facN.push(fn); edges.push({ a: root, b: fn, kind: 'root', elbow: MOBILE });
      f.ind.forEach(function (d, j) {
        var iN;
        if (MOBILE) { var row = Math.floor(j / 3), col = j % 3, cnt = row === 0 ? Math.min(3, n) : n - 3, off = cnt === 3 ? 0 : (cnt === 2 ? 58 : 117); iN = { type: 'ind', f: i, j: j, x: 78 + col * 117 + off, y: fn.y + 96 + row * ROW, hw: 54, hh: 30, d: d }; }
        else iN = { type: 'ind', f: i, j: j, x: cursor + SP * (j + .5), y: yInd, hw: HW, hh: HH, d: d };
        d._n = iN; iN.name = d.title; iN.other = -1; nodes.push(iN); indN.push(iN); edges.push({ a: fn, b: iN, kind: 'load' });
      });
      if (MOBILE) ybase += blockH[i]; else cursor += n * SP + GAP;
    });
    CROSS.forEach(function (c) { c.d._n.other = c.other; });
    var crossEdges = [];
    if (!MOBILE) CROSS.forEach(function (c) { var e = { a: facN[c.other], b: c.d._n, kind: 'cross', curve: 0.12, label: c.label, lt: .5 }; edges.push(e); crossEdges.push(e); });
    facN.forEach(function (fn, i) { fn.cx = CROSS.filter(function (c) { return c.other === i; }).length; });

    nodes.forEach(function (n) {
      n.hx = n.x; n.hy = n.y; n.vx = 0; n.vy = 0; n.fx = 0; n.fy = 0;
      var g = el('g', { 'class': 'node ' + n.type, transform: 'translate(' + n.x + ' ' + n.y + ')' }, nodeL); n.g = g; g.__n = n;
      var p = n.in = el('g', { 'class': 'in' }, g);
      if (n.f >= 0) g.style.setProperty('--c', F[n.f].col);
      if (n.type === 'root') {
        n.regEl = el('ellipse', { 'class': 'reg', rx: n.rx, ry: n.ry }, p); el('ellipse', { 'class': 'main', rx: n.rx, ry: n.ry }, p);
        n.lbl = txt(p, 'lbl big', 'Sukrit', 0, -9); n.dotEl = el('circle', { 'class': 'rootdot', cx: 0, cy: MOBILE ? 18 : 22, r: 7 }, p);
        if (!MOBILE) {
          n.caps = [txt(g, 'cap pl', 'inferred from everything around it', n.rx + 18, 0, 'start'), txt(g, 'cap nd', 'ξ · second-order factor, never observed', n.rx + 18, 0, 'start')];
        }
        g.setAttribute('aria-label', 'Sukrit, the unobserved person this all adds up to');
      } else if (n.type === 'cause') {
        el('rect', { 'class': 'main', x: -n.hw, y: -n.hh, width: n.hw * 2, height: n.hh * 2 }, p); txt(p, 'l1', n.c.n[0], 0, -6); txt(p, 'l2', n.c.n[1], 0, 9);
        g.setAttribute('aria-label', n.c.title + ', background');
      } else if (n.type === 'factor') {
        el('ellipse', { 'class': 'reg', rx: n.rx, ry: n.ry }, p); el('ellipse', { 'class': 'main', rx: n.rx, ry: n.ry }, p);
        txt(p, 'lbl', n.name, 0, 0); txt(p, 'sym nd', F[n.f].ind.length + ' indicators' + (n.cx ? ' · ' + n.cx + ' cross-loaded' : ''), 0, 16);
        g.setAttribute('aria-label', n.name + ', a factor of my work');
      } else {
        n.plate = el('rect', { 'class': 'plate', x: -n.hw, y: -n.hh, width: n.hw * 2, height: n.hh * 2 }, p);
        var r = el('rect', { 'class': 'main', x: -n.hw, y: -n.hh, width: n.hw * 2, height: n.hh * 2 }, p); r.setAttribute('fill', 'url(#ht' + n.f + ')');
        if (n.other >= 0) { var fs = 20; el('polygon', { 'class': 'flag', points: (n.hw - fs) + ',' + (-n.hh) + ' ' + n.hw + ',' + (-n.hh) + ' ' + n.hw + ',' + (-n.hh + fs), fill: 'url(#ht' + n.other + ')' }, p); }
        txt(p, 'l1', n.d.n[0], 0, -6); txt(p, 'l2', n.d.n[1], 0, 9);
        if (n.d.tag) txt(p, 'tag nd', n.d.tag, 0, n.hh + 15);
        var hasToy = PF.toys.some(function (t) { return t.from[0] === n.d.id; });
        if (hasToy) { var bg = el('g', { 'class': 'badge', transform: 'translate(' + (-n.hw + 1) + ' ' + (-n.hh + 1) + ')' }, p); el('circle', { r: 10 }, bg); el('path', { d: 'M-3 -5L5 0L-3 5Z' }, bg); }
        g.setAttribute('aria-label', n.name + ', evidence for ' + F[n.f].name + (hasToy ? '. Has a toy to play with.' : ''));
      }
      g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button');
    });

    edges.forEach(function (e) {
      var g = el('g', { 'class': 'edge ' + e.kind }, edgeL); e.g = g;
      e.ln = el('path', { 'class': 'ln' }, g); if (e.kind !== 'cross') e.ln.setAttribute('pathLength', 1);
      e.hd = el('path', { 'class': 'hd' }, g);
      e.w = e.kind === 'root' ? (MOBILE ? 5 : 6) : e.kind === 'load' ? 3.4 : 3; e.hl = e.kind === 'root' ? (MOBILE ? 11 : 14) : 11; e.ln.style.strokeWidth = e.w;
      if (e.label) { e.lb = el('text', { 'class': 'lam' }, labL); e.lb.textContent = e.label; }
      e.rest = Math.hypot(e.b.hx - e.a.hx, e.b.hy - e.a.hy); e.k = e.kind === 'root' ? 0.05 : e.kind === 'load' ? 0.06 : e.kind === 'cause' ? 0.05 : 0.008;
    });
    function edgePoint(n, tx, ty, gap) {
      var dx = tx - n.x, dy = ty - n.y, d = Math.hypot(dx, dy) || 1, t;
      if (n.type === 'ind' || n.type === 'cause') t = Math.min(n.hw / (Math.abs(dx) || 1e-6), n.hh / (Math.abs(dy) || 1e-6)); else t = 1 / Math.sqrt((dx / n.rx) * (dx / n.rx) + (dy / n.ry) * (dy / n.ry));
      t = Math.min(t, 1); return [n.x + dx * t + (dx / d) * gap, n.y + dy * t + (dy / d) * gap];
    }
    var f1 = function (v) { return v.toFixed(1); };
    function placeEdge(e) {
      var a = e.a, b = e.b, d, ang, t, s, cx = 0, cy = 0, curved = !!e.curve;
      if (e.elbow) { s = [a.x - a.rx, a.y]; t = [b.x - b.rx - 3, b.y]; d = 'M' + f1(s[0]) + ' ' + f1(s[1]) + 'L12 ' + f1(s[1]) + 'L12 ' + f1(t[1]) + 'L' + f1(t[0]) + ' ' + f1(t[1]); ang = 0; }
      else {
        cx = (a.x + b.x) / 2; cy = (a.y + b.y) / 2; if (curved) { var ddx = b.x - a.x, ddy = b.y - a.y; cx += -ddy * e.curve; cy += ddx * e.curve; }
        s = edgePoint(a, curved ? cx : b.x, curved ? cy : b.y, 2); t = edgePoint(b, curved ? cx : a.x, curved ? cy : a.y, 3);
        d = curved ? 'M' + f1(s[0]) + ' ' + f1(s[1]) + 'Q' + f1(cx) + ' ' + f1(cy) + ' ' + f1(t[0]) + ' ' + f1(t[1]) : 'M' + f1(s[0]) + ' ' + f1(s[1]) + 'L' + f1(t[0]) + ' ' + f1(t[1]);
        ang = Math.atan2(t[1] - (curved ? cy : s[1]), t[0] - (curved ? cx : s[0]));
      }
      e.ln.setAttribute('d', d);
      var hl = e.hl, a1 = ang - .42, a2 = ang + .42, q1 = [t[0] - hl * Math.cos(a1), t[1] - hl * Math.sin(a1)], q2 = [t[0] - hl * Math.cos(a2), t[1] - hl * Math.sin(a2)];
      e.hd.setAttribute('d', 'M' + f1(t[0]) + ' ' + f1(t[1]) + 'L' + f1(q1[0]) + ' ' + f1(q1[1]) + 'L' + f1(q2[0]) + ' ' + f1(q2[1]) + 'Z');
      if (e.lb) { var u = e.lt || .5, w0 = (1 - u) * (1 - u), w1 = 2 * (1 - u) * u, w2 = u * u; e.lb.setAttribute('x', f1(w0 * s[0] + w1 * cx + w2 * t[0])); e.lb.setAttribute('y', f1(w0 * s[1] + w1 * cy + w2 * t[1])); }
    }
    function placeNode(n) { n.g.setAttribute('transform', 'translate(' + n.x.toFixed(1) + ' ' + n.y.toFixed(1) + ')'); }
    edges.forEach(placeEdge);

    /* the big word behind the diagram (desktop) */
    function sizeWord() { if (MOBILE) return; bw.style.fontStretch = bw.textContent.length > 9 ? '72%' : '125%'; var base = canvas.clientWidth * .19; bw.style.fontSize = base + 'px'; var w = bw.getBoundingClientRect().width, maxW = canvas.clientWidth * .94; if (w > maxW) bw.style.fontSize = (base * maxW / w) + 'px'; }
    function setWord(t, col) {
      if (MOBILE || t === curWord) return; curWord = t; clearTimeout(wordTimer); bw.style.opacity = 0;
      wordTimer = setTimeout(function () { bw.textContent = t; big.style.setProperty('--wc', col || '#7B8DFF'); sizeWord(); bw.style.opacity = ''; if (!RM) anims.push(bw.animate([{ transform: 'translateY(14px)' }, { transform: 'none' }], { duration: 260, easing: 'ease-out' })); }, 150);
    }
    sizeWord(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeWord);

    /* interaction */
    var hover = null, pinned = null, drag = null, moved = 0, downNode = null;
    function apply() {
      var n = hover || pinned, S = new Set();
      if (n) {
        if (n.type === 'root') nodes.forEach(function (m) { S.add(m); });
        else if (n.type === 'factor') { S.add(root); S.add(n); indN.forEach(function (i) { if (i.f === n.f) S.add(i); }); crossEdges.forEach(function (c) { if (c.a === n) S.add(c.b); else if (c.b.f === n.f) S.add(c.a); }); }
        else if (n.type === 'ind') { S.add(n); S.add(facN[n.f]); crossEdges.forEach(function (c) { if (c.b === n) S.add(c.a); }); }
        else if (n.type === 'cause') { S.add(n); S.add(root); }
      }
      stage.classList.toggle('focus', !!n);
      nodes.forEach(function (m) { m.g.classList.toggle('on', S.has(m)); });
      edges.forEach(function (e) { var on = S.has(e.a) && S.has(e.b) && !(e.kind === 'root' && n && n.type === 'factor' && e.b !== n); e.g.classList.toggle('on', on); if (e.lb) e.lb.classList.toggle('on', on && n && n.type === 'ind'); });
      if (n && n.f >= 0) setWord(F[n.f].name.toUpperCase(), F[n.f].col); else setWord(defaultWord, '#7B8DFF');
    }
    function nodeAt(ev) { var g = ev.target.closest ? ev.target.closest('.node') : null; return g ? g.__n : null; }
    var pt = svg.createSVGPoint();
    function toSvg(ev) { pt.x = ev.clientX; pt.y = ev.clientY; var m = svg.getScreenCTM(); return m ? pt.matrixTransform(m.inverse()) : { x: 0, y: 0 }; }
    function scheduleShow(n) { clearTimeout(showTimer); clearTimeout(hideTimer); if (MOBILE || pinnedPop) return; showTimer = setTimeout(function () { if (hover === n) showPop(n, false); }, 140); }
    function leave() { clearTimeout(showTimer); clearTimeout(hideTimer); if (pinnedPop) return; hideTimer = setTimeout(function () { if (!pinnedPop && !hover) hidePop(); }, 260); }
    svg.addEventListener('pointerdown', function (ev) {
      if (ev.pointerType === 'touch') return;
      var g = ev.target.closest && ev.target.closest('.node'); if (!g) return;
      drag = g.__n; downNode = drag; moved = 0; var p = toSvg(ev); drag.tx = p.x; drag.ty = p.y;
      try { svg.setPointerCapture(ev.pointerId); } catch (x) { } kick();
    });
    svg.addEventListener('pointermove', function (ev) {
      if (drag) { moved += Math.abs(ev.movementX || 0) + Math.abs(ev.movementY || 0); var p = toSvg(ev); drag.tx = clamp(p.x, 30, W - 30); drag.ty = clamp(p.y, 30, H - 30); if (moved > 5 && popNode && !pinnedPop) hidePop(); if (popNode && pinnedPop && !MOBILE) placePop(popNode); return; }
      if (ev.pointerType === 'touch') return;
      if (introRunning) return;
      var n = nodeAt(ev); if (n !== hover) { hover = n; apply(); if (n) scheduleShow(n); else leave(); }
    });
    var endDrag = function () { if (drag) { drag = null; kick(); } };
    svg.addEventListener('pointerup', endDrag); svg.addEventListener('pointercancel', endDrag);
    svg.addEventListener('pointerleave', function () { if (drag) return; if (hover) { hover = null; apply(); leave(); } });
    function poke(n) { if (RM) return; n.vx += rand(-9, 9); n.vy += rand(-9, 9); kick(); }
    function open(n, focusLink) { lastFocus = n.g; pinned = n; hover = null; apply(); showPop(n, true); if (focusLink) { var l = pop.querySelector('.plink'); if (l) l.focus(); else pop.focus(); } }
    svg.addEventListener('click', function (ev) { if (moved > 5) { moved = 0; downNode = null; return; } var n = nodeAt(ev) || downNode; downNode = null; if (!n) { if (pinnedPop && cur) cur.unpin(false); return; } open(n, false); poke(n); });
    svg.addEventListener('focusin', function (ev) { var g = ev.target.closest && ev.target.closest('.node'); if (g) { hover = g.__n; apply(); if (!MOBILE) scheduleShow(hover); } });
    svg.addEventListener('focusout', function () { hover = null; apply(); leave(); });
    svg.addEventListener('keydown', function (ev) {
      var g = ev.target.closest && ev.target.closest('.node'); if (!g) return;
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); open(g.__n, true); }
      else { var d = { ArrowLeft: [-14, 0], ArrowRight: [14, 0], ArrowUp: [0, -14], ArrowDown: [0, 14] }[ev.key]; if (d) { ev.preventDefault(); var n = g.__n; n.x = clamp(n.x + d[0], 20, W - 20); n.y = clamp(n.y + d[1], 20, H - 20); render(); kick(); } }
    });
    function syncMode() { stage.setAttribute('data-mode', mode); bP.setAttribute('aria-pressed', String(mode === 'plain')); bN.setAttribute('aria-pressed', String(mode === 'nerd')); }
    function refreshPop() { if (popNode) { var keep = pop.scrollTop; fillPop(popNode); pop.scrollTop = keep; if (!MOBILE) placePop(popNode); } }
    bP.addEventListener('click', function () { mode = 'plain'; syncMode(); apply(); refreshPop(); });
    bN.addEventListener('click', function () { mode = 'nerd'; syncMode(); apply(); refreshPop(); });
    bR.addEventListener('click', function () { play(); });
    syncMode();
    /* draw the eye to the toggle until it has been used */
    var nudgeT = 0, hideT = 0;
    function calm() { build.calm = true; clearTimeout(nudgeT); clearTimeout(hideT); seg.classList.remove('nudge'); tip.hidden = true; }
    function armNudge(d) { clearTimeout(nudgeT); if (!build.calm && mode === 'plain') nudgeT = setTimeout(function () { seg.classList.add('nudge'); tip.hidden = false; hideT = setTimeout(calm, 16000); }, RM ? 0 : d); }
    seg.addEventListener('pointerenter', calm); seg.addEventListener('focusin', calm); seg.addEventListener('click', calm);

    /* paper cut-outs on hidden springs */
    var last = performance.now();
    function kick() { if (!running) { running = true; last = performance.now(); raf2 = requestAnimationFrame(tick); } }
    function radius(n) { return n.type === 'root' ? (MOBILE ? 60 : 72) : n.type === 'factor' ? (MOBILE ? 48 : 60) : n.type === 'cause' ? (MOBILE ? 40 : 48) : (MOBILE ? 44 : 38); }
    function physics(dt) {
      var i, j, n, m, e, maxv = 0, maxd = 0;
      for (i = 0; i < nodes.length; i++) { nodes[i].fx = 0; nodes[i].fy = 0; }
      for (i = 0; i < nodes.length; i++) { n = nodes[i]; var kh = (n.type === 'root' ? 0.012 : n.type === 'factor' ? 0.008 : 0.006); n.fx += (n.hx - n.x) * kh; n.fy += (n.hy - n.y) * kh; }
      for (i = 0; i < edges.length; i++) { e = edges[i]; var dx = e.b.x - e.a.x, dy = e.b.y - e.a.y, d = Math.hypot(dx, dy) || 1, s = (d - e.rest) * e.k / d; e.a.fx += dx * s; e.a.fy += dy * s; e.b.fx -= dx * s; e.b.fy -= dy * s; }
      for (i = 0; i < nodes.length; i++) for (j = i + 1; j < nodes.length; j++) { n = nodes[i]; m = nodes[j]; var mdx = m.x - n.x, mdy = m.y - n.y, md = Math.hypot(mdx, mdy) || 1, mm = radius(n) + radius(m) + (MOBILE ? 0 : 4); if (md < mm) { var push = (mm - md) * 0.05 / md; n.fx -= mdx * push; n.fy -= mdy * push; m.fx += mdx * push; m.fy += mdy * push; } }
      var damp = Math.pow(0.88, dt);
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        if (drag === n) { n.x += (n.tx - n.x) * Math.min(1, 0.4 * dt); n.y += (n.ty - n.y) * Math.min(1, 0.4 * dt); n.vx = 0; n.vy = 0; continue; }
        n.vx = clamp((n.vx + n.fx * dt) * damp, -40, 40); n.vy = clamp((n.vy + n.fy * dt) * damp, -40, 40); n.x = clamp(n.x + n.vx * dt, 20, W - 20); n.y = clamp(n.y + n.vy * dt, 20, H - 20);
        maxv = Math.max(maxv, Math.hypot(n.vx, n.vy)); maxd = Math.max(maxd, Math.hypot(n.hx - n.x, n.hy - n.y));
      }
      return { v: maxv, d: maxd };
    }
    function render() {
      for (var i = 0; i < nodes.length; i++) { var n = nodes[i]; placeNode(n); if (Math.abs(n.vx) > 0.2) n.in.style.transform = 'rotate(' + clamp(n.vx * 0.55, -10, 10).toFixed(1) + 'deg)'; else n.in.style.transform = ''; }
      edges.forEach(placeEdge); if (popNode && pinnedPop && !MOBILE) placePop(popNode);
    }
    function tick(now) {
      if (!alive) return; var dt = Math.min(2, (now - last) / 16.67); last = now; var r = physics(dt); render();
      if (!drag && r.v < 0.04 && r.d < 0.5) { nodes.forEach(function (n) { n.x = n.hx; n.y = n.hy; n.vx = 0; n.vy = 0; }); render(); running = false; return; }
      raf2 = requestAnimationFrame(tick);
    }

    /* intro */
    var an = function (node, kf, delay, dur, ease, fill) { var a = node.animate(kf, { delay: delay, duration: dur, easing: ease || 'ease-out', fill: fill || 'backwards' }); anims.push(a); return a; };
    /* The intro says the one idea this page is about: you cannot measure a person directly, so you infer them from evidence.
       The oval for "me" starts unnamed, inside a wide band of uncertainty. Each project is stamped onto the sheet like a print
       (a slightly off colour plate settles into register), and the band tightens a little with every piece of evidence.
       When the last one lands the name inks in. Any click, key or scroll skips it; the transient shapes live in `transients`. */
    var transients = [], introT = 0, introRunning = false, fitTimers = [];
    var fitEvt = function (state, text) { try { window.dispatchEvent(new CustomEvent('pf:fit', { detail: { state: state, text: text } })); } catch (x) { } };
    var FIT_END = 'Fit: Suspiciously Good';
    function clearFit() { fitTimers.forEach(clearTimeout); fitTimers = []; }
    function fitAt(d, state, text) { fitTimers.push(setTimeout(function () { fitEvt(state, text); }, d)); }
    function clearIntro() { transients.forEach(function (t) { if (t.parentNode) t.parentNode.removeChild(t); }); transients = []; clearTimeout(introT); introRunning = false; stage.classList.remove('intro-run'); }
    function skipIntro() { if (!introRunning) return; anims.forEach(function (a) { try { a.cancel(); } catch (x) { } }); anims = []; clearIntro(); clearFit(); fitEvt('fit', FIT_END); armNudge(1200); }
    stage.addEventListener('pointerdown', skipIntro); window.addEventListener('keydown', skipIntro); window.addEventListener('wheel', skipIntro, { passive: true }); window.addEventListener('touchmove', skipIntro, { passive: true });
    function ripple(x, y, rx, ry, d, big) {
      var c = el('ellipse', { 'class': 'ripple', cx: x, cy: y, rx: rx, ry: ry }, labL); transients.push(c);
      an(c, [{ opacity: 0, transform: 'scale(1)' }, { opacity: .4, transform: 'scale(1.12)', offset: .14 }, { opacity: 0, transform: big ? 'scale(2.4)' : 'scale(1.7,2)' }], d, big ? 760 : 420, 'ease-out', 'both');
    }
    function play() {
      anims.forEach(function (a) { try { a.cancel(); } catch (x) { } }); anims = []; clearIntro(); clearFit();
      if (RM) { fitEvt('fit', FIT_END); armNudge(0); return; }
      fitEvt('specify', 'Specifying model\u2026');
      introRunning = true; stage.classList.add('intro-run');
      var S0 = MOBILE ? 1.55 : 2.3, SEND = 1.05, EASE = 'cubic-bezier(.2,.8,.2,1)';
      /* background first: the three boxes drop in */
      cauN.forEach(function (n, i) { an(n.in, [{ transform: 'translateY(-20px)', opacity: 0 }, { transform: 'none', opacity: 1 }], 60 + i * 70, 460, 'cubic-bezier(.2,.9,.3,1.3)'); });
      edges.forEach(function (e) { if (e.kind === 'cause') { an(e.ln, [{ strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDasharray: '1 1', strokeDashoffset: 0 }], 350, 480, 'ease-out'); an(e.hd, [{ opacity: 0 }, { opacity: 1 }], 730, 200); } });
      /* the unnamed person, inside a band of uncertainty */
      an(root.in, [{ transform: 'scale(.2) rotate(-14deg)', opacity: 0 }, { transform: 'scale(1) rotate(0)', opacity: 1 }], 300, 650, 'cubic-bezier(.34,1.56,.64,1)');
      var q = txt(root.in, 'lbl big q', '?', 0, -9); transients.push(q);
      var ring = el('g', { 'class': 'conf' }, root.g); root.g.insertBefore(ring, root.in); transients.push(ring);
      el('ellipse', { rx: root.rx, ry: root.ry }, ring);
      var th = -0.56, lab = null, lx = root.rx * Math.cos(th), ly = root.ry * Math.sin(th);
      if (!MOBILE) { lab = txt(root.g, 'cap conf-l', 'uncertainty', lx + 10, ly - 6, 'start'); transients.push(lab); }
      var capX = root.rx * S0 + 20, c1 = null, c2 = null;
      if (!MOBILE) { c1 = txt(root.g, 'cap introcap', 'A person can\u2019t be measured directly.', capX, 0, 'start'); c2 = txt(root.g, 'cap introcap', 'So you stack up evidence.', capX, 0, 'start'); transients.push(c1, c2); }
      /* factors, each followed by its projects, stamped one at a time */
      var K = MOBILE ? .65 : 1, t = MOBILE ? 900 : 2300, tStart = t, stamps = [];
      facN.forEach(function (fn, i) {
        an(fn.in, [{ transform: 'scale(.2) rotate(-14deg)', opacity: 0 }, { transform: 'scale(1) rotate(0)', opacity: 1 }], t, 700, 'cubic-bezier(.34,1.56,.64,1)');
        var rootEdge = edges.filter(function (e) { return e.kind === 'root' && e.b === fn; })[0];
        an(rootEdge.ln, [{ strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDasharray: '1 1', strokeDashoffset: 0 }], t + 40, 420, 'ease-out'); an(rootEdge.hd, [{ opacity: 0 }, { opacity: 1 }], t + 380, 200);
        var k = 0;
        indN.forEach(function (n) {
          if (n.f !== i) return; var ts = t + (300 + k * 100) * K; k++; n._st = ts; stamps.push(ts);
          an(n.in, [{ transform: 'translateY(-44px) scale(1.5) rotate(-4deg)', opacity: 0 }, { transform: 'translateY(0) scale(1.07) rotate(0)', opacity: 1, offset: .55 }, { transform: 'translateY(2px) scale(.94)', opacity: 1, offset: .74 }, { transform: 'none', opacity: 1 }], ts, 480, 'cubic-bezier(.3,.7,.2,1)');
          an(n.plate, [{ opacity: 0, transform: 'translate(7px,6px)' }, { opacity: .9, transform: 'translate(7px,6px)', offset: .34 }, { opacity: 0, transform: 'translate(0,0)' }], ts, 520, 'ease-out', 'both');
          ripple(n.x, n.y, n.hw, n.hh, ts + 250, false);
          var le = edges.filter(function (e) { return e.kind === 'load' && e.b === n; })[0];
          an(le.ln, [{ strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDasharray: '1 1', strokeDashoffset: 0 }], ts + 120, 360, 'ease-out'); an(le.hd, [{ opacity: 0 }, { opacity: 1 }], ts + 380, 180);
        });
        t += (300 + k * 100 + 80) * K;
      });
      var tF = t + 300, n0 = 500;
      /* the band tightens with every project; its label rides the edge of it */
      var dur = tF - n0, kf = [], lkf = [], total = stamps.length;
      var tr = function (s) { return 'translate(' + ((s - 1) * root.rx * Math.cos(th)).toFixed(1) + 'px,' + ((s - 1) * root.ry * Math.sin(th)).toFixed(1) + 'px)'; };
      var pose = function (s, o, op) { kf.push({ transform: 'scale(' + s.toFixed(3) + ')', opacity: op, offset: o }); if (lab) lkf.push({ transform: tr(s), opacity: op, offset: o }); };
      pose(S0 * 1.25, 0, 0);
      pose(S0, Math.max(.01, (tStart - n0) / dur * .9), 1);
      stamps.sort(function (a, b) { return a - b; }).forEach(function (ts, k) { var s = SEND + (S0 - SEND) * Math.pow(1 - (k + 1) / total, 1.5); pose(s, Math.min(.985, (ts + 200 - n0) / dur), 1); });
      pose(SEND, 1, 1);
      an(ring, kf, n0, dur, 'cubic-bezier(.25,.8,.3,1)', 'both'); if (lab) an(lab, lkf, n0, dur, 'cubic-bezier(.25,.8,.3,1)', 'both');
      if (c1) { an(c1, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none', offset: .2 }, { opacity: 1, offset: .8 }, { opacity: 0 }], 800, 2300, 'ease-out', 'both'); an(c2, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none', offset: .09 }, { opacity: 1, offset: .93 }, { opacity: 0 }], 2900, tF - 2900 + 300, 'ease-out', 'both'); }
      /* the name inks in */
      an(q, [{ opacity: .35 }, { opacity: .35, offset: .85 }, { opacity: 0 }], 300, tF - 300 + 160, 'ease-out', 'both');
      an(ring, [{ opacity: 1 }, { opacity: 0 }], tF + 60, 520, 'ease-out', 'forwards'); if (lab) an(lab, [{ opacity: 1 }, { opacity: 0 }], tF, 200, 'ease-out', 'forwards');
      an(root.lbl, [{ opacity: 0, transform: 'scale(1.8) rotate(-5deg)' }, { opacity: 1, transform: 'scale(.94)', offset: .6 }, { opacity: 1, transform: 'none' }], tF, 620, 'cubic-bezier(.3,.7,.2,1)');
      an(root.dotEl, [{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'scale(1)' }], tF + 260, 420, 'cubic-bezier(.34,1.56,.64,1)');
      an(root.regEl, [{ transform: 'translate(-16px,14px)' }, { transform: 'translate(7px,-6px)' }], tF, 560, EASE, 'backwards');
      an(root.in, [{ transform: 'scale(1)' }, { transform: 'scale(1.06)', offset: .35 }, { transform: 'scale(1)' }], tF, 520, 'ease-out', 'none');
      ripple(root.x, root.y, root.rx, root.ry, tF + 60, true);
      if (root.caps) root.caps.forEach(function (c) { an(c, [{ opacity: 0 }, { opacity: 1 }], tF + 600, 600); });
      if (!MOBILE) an(bw, [{ fontStretch: '62%', opacity: 0, transform: 'translateY(50px)' }, { fontStretch: bw.style.fontStretch || '125%', opacity: .16, transform: 'none' }], tF - 80, 1000, EASE);
      edges.forEach(function (e) { if (e.kind === 'cross') an(e.g, [{ opacity: 0 }, { opacity: 1 }], tF + 300, 700); });
      /* the read-out in the top bar follows the same clock: iterations tick up as the evidence arrives */
      var ITER = 11, lastIt = 0;
      stamps.forEach(function (ts, k) {
        var it = Math.max(1, Math.round((k + 1) / total * ITER));
        if (it !== lastIt) { lastIt = it; fitAt(ts + 120, 'estimate', 'Estimating\u2026 iteration ' + it + ' \u00b7 \u0394 ' + (0.6 * Math.pow(0.58, it - 1)).toFixed(3)); }
      });
      fitAt(tF, 'converged', 'Converged in ' + ITER + ' iterations');
      fitAt(tF + 1900, 'fit', FIT_END);
      introT = setTimeout(function () { clearIntro(); armNudge(500); }, tF + 1500);
    }
    var api = { leave: leave, calm: calm,
      unpin: function (refocus) { pinned = null; hover = null; clearTimeout(showTimer); hidePop(); apply(); if (refocus && lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (x) { } } },
      destroy: function () { alive = false; window.removeEventListener('keydown', skipIntro); window.removeEventListener('wheel', skipIntro); window.removeEventListener('touchmove', skipIntro); clearTimeout(introT); clearFit(); clearTimeout(nudgeT); clearTimeout(hideT); cancelAnimationFrame(raf2); clearTimeout(wordTimer); clearTimeout(showTimer); anims.forEach(function (a) { try { a.cancel(); } catch (x) { } }); hidePop(); host.textContent = ''; } };
    /* on a short or narrow window the card and buttons would land on top of a node: shrink them until they do not */
    function fitOverlays() {
      if (MOBILE || !alive) return;
      [intro, acts].forEach(function (box) {
        box.classList.remove('compact', 'mini');
        var hit = function () { var r = box.getBoundingClientRect(); return nodes.some(function (n) { if (!n.g) return false; var b = n.g.getBoundingClientRect(); return b.width > 0 && b.right > r.left - 8 && b.left < r.right + 8 && b.bottom > r.top - 8 && b.top < r.bottom + 8; }); };
        if (hit()) { box.classList.add('compact'); if (hit()) box.classList.add('mini'); }
      });
    }
    build.fit = fitOverlays; fitOverlays();
    cur = api; apply();
    /* arriving from a toy: ?open=cleome pins that card straight away, with no intro */
    var want = (location.search.match(/[?&]open=([\w-]+)/) || [])[1], target = null;
    if (want && !build.opened) nodes.forEach(function (n) { if ((n.d && n.d.id === want) || (n.type === 'factor' && F[n.f].key === want) || (n.type === 'cause' && n.c.key === want) || (n.type === 'root' && want === 'sukrit')) target = n; });
    if (target) { build.opened = true; open(target, false); fitEvt('fit', FIT_END); armNudge(2400); } else play();
    window.__model = { nodes: nodes, open: open, api: api, H: H };
  }
  build();

  /* rebuild when the window changes shape enough to need a different drawing */
  var lastMobile = MOBILE, rebuildT = 0;
  function maybeRebuild() {
    clearTimeout(rebuildT);
    rebuildT = setTimeout(function () {
      var m = mq.matches; var need = m !== lastMobile;
      if (!m && !need) { var canvas = host.querySelector('.canvas'); if (canvas) { var H2 = clamp(Math.round(1470 * canvas.clientHeight / canvas.clientWidth), 540, 1100); if (Math.abs(H2 - build.H) > 40) need = true; } }
      if (need) { lastMobile = m; MOBILE = m; if (cur) cur.destroy(); build(); } else if (build.fit) build.fit();
    }, 220);
  }
  window.addEventListener('resize', maybeRebuild);
  mq.addEventListener('change', maybeRebuild);

  /* the same work as a plain list, for anyone who prefers it, and for search engines */
  (function list() {
    var g = document.getElementById('lgrid'); if (!g) return;
    var ext = function (u) { return /^https?:/.test(u); };
    var secs = [{ id: 'background', name: 'Background', col: '#BFC4CF', sq: true, desc: 'Where I trained and what I have done.',
      rows: PF.causes.map(function (c) { return { name: c.title, line: c.desc, links: [[c.urlLabel || 'See resume', c.url]] }; }) }];
    F.forEach(function (f) {
      var rows = f.ind.map(function (d) {
        var links = []; if (d.url) links.push([d.urlLabel || 'Open', d.url]);
        PF.toys.forEach(function (t) { if (t.from[0] === d.id) links.push(['Play: ' + t.title, t.file]); });
        var ce = CROSS.filter(function (c) { return c.d === d; })[0];
        return { name: d.title, status: d.status, line: d.line || d.plain, also: ce ? 'Also counts toward ' + F[ce.other].name : '', links: links };
      });
      (f.more || []).forEach(function (m) { rows.push({ name: m.title, status: 'Design portfolio', line: m.line || m.desc, links: [['See the project', m.url]] }); });
      secs.push({ id: f.key, name: f.name, col: f.col, desc: f.desc, rows: rows });
    });
    var jn = html('nav', { 'class': 'ljump', 'aria-label': 'Jump to a group' }, g);
    secs.forEach(function (sc) { var a = html('a', { href: '#l-' + sc.id }, jn); a.style.setProperty('--c', sc.col); html('i', { 'class': sc.sq ? 'sq' : '', 'aria-hidden': 'true' }, a); a.appendChild(document.createTextNode(sc.name)); });
    secs.forEach(function (sc) {
      var sec = html('section', { 'class': 'lsec', id: 'l-' + sc.id, 'aria-labelledby': 'lh-' + sc.id }, g); sec.style.setProperty('--c', sc.col);
      var hd = html('header', {}, sec), h3 = html('h3', { id: 'lh-' + sc.id }, hd); html('i', { 'class': sc.sq ? 'sq' : '', 'aria-hidden': 'true' }, h3); h3.appendChild(document.createTextNode(sc.name));
      html('p', { text: sc.desc }, hd);
      var ul = html('ul', { 'class': 'lrows' }, sec);
      sc.rows.forEach(function (r) {
        var li = html('li', { 'class': 'lrow' }, ul), t = html('div', { 'class': 'lt' }, li);
        html('b', { text: r.name }, t); if (r.status) html('span', { 'class': 'st', text: r.status }, t);
        var p = html('p', { 'class': 'ld', text: r.line }, li); if (r.also) html('small', { text: r.also }, p);
        var la = html('div', { 'class': 'la' }, li);
        r.links.forEach(function (l) { var a = html('a', { href: l[1], text: l[0] + (ext(l[1]) ? ' \u2197' : '') }, la); if (ext(l[1])) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); } });
      });
    });
  })();
})();
