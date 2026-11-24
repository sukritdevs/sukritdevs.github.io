/* A tuner for the footer portrait. It only loads when the address has ?adjust, so visitors never get it.
   Drag the photo to move it, Ctrl+scroll (or the slider) to zoom, arrow keys to nudge. The numbers at the bottom are what the page
   needs: copy them and send them over, or keep them here: they are remembered in this browser while ?adjust is in the address. */
(function () {
  'use strict';
  var inn = document.querySelector('.foot-in'), fig = inn && inn.querySelector('figure'), img = fig && fig.querySelector('img');
  if (!img) return;
  var mq = window.matchMedia('(max-width:640px)');
  var NAMES = { d: ['--z', '--ox', '--oy'], m: ['--mz', '--mox', '--moy'] };
  var def = {}, st = { z: 1, x: 0, y: 0 }, STORE = 'pf-portrait-tuner';
  function mode() { return mq.matches ? 'm' : 'd'; }
  function readVars(m) { var cs = getComputedStyle(inn); return { z: parseFloat(cs.getPropertyValue(NAMES[m][0])), x: parseFloat(cs.getPropertyValue(NAMES[m][1])), y: parseFloat(cs.getPropertyValue(NAMES[m][2])) }; }
  ['d', 'm'].forEach(function (m) { def[m] = readVars(m); });
  try { var saved = JSON.parse(localStorage.getItem(STORE) || '{}'); ['d', 'm'].forEach(function (m) { if (saved[m]) { NAMES[m].forEach(function (n, i) { inn.style.setProperty(n, saved[m][['z', 'x', 'y'][i]]); }); } }); } catch (e) { }
  function mk(tag, cls, p, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; if (p) p.appendChild(e); return e; }

  var css = document.createElement('style');
  css.textContent = '#tuner{position:fixed;right:12px;bottom:12px;z-index:90;width:min(340px,calc(100vw - 24px));background:#F8F9FC;color:#12141C;border:3px solid #12141C;box-shadow:6px 6px 0 #12141C;font:500 13.5px/1.45 Archivo,system-ui,sans-serif;padding:12px 14px}' +
    '#tuner h3{margin:0 0 4px;font-size:15px;font-weight:800}#tuner p{margin:0 0 8px;color:#3F4554}' +
    '#tuner label{display:grid;grid-template-columns:62px 1fr 52px;gap:8px;align-items:center;margin:4px 0;font-weight:700}#tuner input[type=range]{width:100%;min-height:28px}' +
    '#tuner output{font-family:"Red Hat Mono",monospace;font-size:12px;text-align:right}' +
    '#tuner pre{margin:8px 0;padding:8px;background:#ECEEF3;border:2px solid #12141C;font:500 12px/1.5 "Red Hat Mono",monospace;white-space:pre-wrap;user-select:all}' +
    '#tuner .warn{color:#B3261E;font-weight:700;min-height:1.4em}#tuner .row{display:flex;gap:8px;flex-wrap:wrap}' +
    '#tuner button{font:800 13px Archivo,system-ui,sans-serif;min-height:40px;padding:0 12px;background:#FFE14A;color:#12141C;border:2.5px solid #12141C;cursor:pointer}#tuner button.alt{background:#fff}' +
    '.foot-in figure.tuning{cursor:grab;outline:3px dashed #F4807A;outline-offset:6px;touch-action:none}.foot-in figure.tuning:active{cursor:grabbing}.foot-in figure.tuning img{user-select:none;-webkit-user-drag:none;pointer-events:none}';
  document.head.appendChild(css);

  var panel = mk('div', '', document.body); panel.id = 'tuner'; panel.setAttribute('role', 'group'); panel.setAttribute('aria-label', 'Portrait framing tuner');
  var title = mk('h3', '', panel), hint = mk('p', '', panel, 'Drag the photo to move it. Ctrl+scroll or the slider to zoom. Arrow keys nudge it.');
  function slider(lbl, min, max, step) { var l = mk('label', '', panel); mk('span', '', l, lbl); var r = mk('input', '', l); r.type = 'range'; r.min = min; r.max = max; r.step = step; var o = mk('output', '', l); return { r: r, o: o }; }
  var sZ = slider('Zoom', 1, 4, 0.005), sX = slider('Left', -300, 50, 0.1), sY = slider('Up/down', -300, 50, 0.1);
  var warn = mk('div', 'warn', panel), pre = mk('pre', '', panel), row = mk('div', 'row', panel);
  var bCopy = mk('button', '', row, 'Copy numbers'), bReset = mk('button', 'alt', row, 'Reset'), bDone = mk('button', 'alt', row, 'Hide panel');
  fig.classList.add('tuning'); fig.tabIndex = 0; fig.setAttribute('aria-label', 'Portrait. Drag to move it, arrow keys to nudge, plus and minus to zoom.');

  function frame() { var r = fig.getBoundingClientRect(); return { w: r.width - 6, h: r.height - 6 }; } /* inside the 3px border */
  function ratio() { return (img.naturalHeight || 1156) / (img.naturalWidth || 867); }
  function imgH(z) { var f = frame(); return z * 100 * (f.w / f.h) * ratio(); } /* the photo's height in % of the frame's height */
  function apply() {
    var m = mode(), n = NAMES[m];
    inn.style.setProperty(n[0], st.z.toFixed(3)); inn.style.setProperty(n[1], st.x.toFixed(1)); inn.style.setProperty(n[2], st.y.toFixed(1));
    sZ.r.value = st.z; sX.r.value = st.x; sY.r.value = st.y; sZ.o.textContent = st.z.toFixed(2); sX.o.textContent = st.x.toFixed(1); sY.o.textContent = st.y.toFixed(1);
    var gap = st.x > 0.05 || st.y > 0.05 || st.x + st.z * 100 < 99.95 || st.y + imgH(st.z) < 99.95;
    warn.textContent = gap ? 'Part of the frame is empty. Zoom in or move the photo back.' : '';
    pre.textContent = (m === 'd' ? 'desktop' : 'phone') + ': ' + n[0] + ':' + st.z.toFixed(3) + '; ' + n[1] + ':' + st.x.toFixed(1) + '; ' + n[2] + ':' + st.y.toFixed(1) + ';';
    try { var all = JSON.parse(localStorage.getItem(STORE) || '{}'); all[m] = { z: st.z.toFixed(3), x: st.x.toFixed(1), y: st.y.toFixed(1) }; localStorage.setItem(STORE, JSON.stringify(all)); } catch (e) { }
  }
  function load() { var m = mode(); st = readVars(m); title.textContent = 'Portrait framing, ' + (m === 'd' ? 'desktop layout' : 'phone layout'); apply(); }
  function setZoom(z, px, py) { /* keeps the point under (px, py), given in % of the frame, where it was */
    z = Math.max(1, Math.min(4, z)); var u = (px - st.x) / st.z, v = (py - st.y) / imgH(st.z);
    st.z = z; st.x = px - u * z; st.y = py - v * imgH(z); apply();
  }
  sZ.r.addEventListener('input', function () { setZoom(parseFloat(sZ.r.value), 50, 40); });
  sX.r.addEventListener('input', function () { st.x = parseFloat(sX.r.value); apply(); });
  sY.r.addEventListener('input', function () { st.y = parseFloat(sY.r.value); apply(); });

  var drag = null;
  fig.addEventListener('pointerdown', function (e) { drag = { id: e.pointerId, x: e.clientX, y: e.clientY, sx: st.x, sy: st.y }; try { fig.setPointerCapture(e.pointerId); } catch (x) { } e.preventDefault(); });
  fig.addEventListener('pointermove', function (e) { if (!drag || e.pointerId !== drag.id) return; var f = frame(); st.x = drag.sx + (e.clientX - drag.x) / f.w * 100; st.y = drag.sy + (e.clientY - drag.y) / f.h * 100; apply(); });
  ['pointerup', 'pointercancel'].forEach(function (t) { fig.addEventListener(t, function () { drag = null; }); });
  fig.addEventListener('wheel', function (e) { if (!(e.ctrlKey || e.metaKey)) return; e.preventDefault(); var r = fig.getBoundingClientRect(), f = frame(); setZoom(st.z * Math.exp(-e.deltaY * 0.004), (e.clientX - r.left - 3) / f.w * 100, (e.clientY - r.top - 3) / f.h * 100); }, { passive: false });
  fig.addEventListener('keydown', function (e) {
    var k = e.key, d = e.shiftKey ? 2 : 0.5, hit = true;
    if (k === 'ArrowLeft') st.x -= d; else if (k === 'ArrowRight') st.x += d; else if (k === 'ArrowUp') st.y -= d; else if (k === 'ArrowDown') st.y += d;
    else if (k === '+' || k === '=') { setZoom(st.z * 1.02, 50, 40); return e.preventDefault(); } else if (k === '-') { setZoom(st.z / 1.02, 50, 40); return e.preventDefault(); } else hit = false;
    if (hit) { e.preventDefault(); apply(); }
  });
  bCopy.addEventListener('click', function () { var t = pre.textContent; (navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { bCopy.textContent = 'Copied'; }, function () { bCopy.textContent = 'Select the text and copy'; }); setTimeout(function () { bCopy.textContent = 'Copy numbers'; }, 1600); });
  bReset.addEventListener('click', function () { var m = mode(); st = { z: def[m].z, x: def[m].x, y: def[m].y }; apply(); });
  bDone.addEventListener('click', function () { panel.hidden = true; });
  mq.addEventListener ? mq.addEventListener('change', load) : mq.addListener(load);
  if (img.complete) load(); else img.addEventListener('load', load);
  load();
  document.documentElement.style.scrollBehavior = 'auto';
  setTimeout(function () { fig.scrollIntoView({ block: 'center' }); }, 300);
})();
