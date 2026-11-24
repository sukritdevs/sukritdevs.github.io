/* A short silent clip that loops with a printed wipe: a halftone slab slides across, the clip restarts behind it, and the slab slides away.
   PF.clip(host, clipConfig) fills `host` (a positioned box with a size). The clip pauses when it is off screen or when the viewer asks,
   and with reduced motion it shows the poster and plays once, only on request. */
(function () {
  'use strict';
  var PF = window.PF = window.PF || {};
  var RM = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var WIPE_IN = 0.3; /* seconds before the end at which the slab starts to cover the picture */

  function mk(tag, cls, parent, attrs) {
    var e = document.createElement(tag); if (cls) e.className = cls;
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e); return e;
  }
  var ICON = {
    pause: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><rect x="6" y="5" width="4.2" height="14" fill="currentColor"/><rect x="13.8" y="5" width="4.2" height="14" fill="currentColor"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M7 4.5v15l12-7.5z" fill="currentColor"/></svg>'
  };

  PF.clip = function (host, c) {
    var box = mk('div', 'clip', host);
    var v = mk('video', 'clip-v', box, { muted: '', playsinline: '', preload: 'auto', poster: c.poster, 'aria-label': c.alt, disablepictureinpicture: '' });
    v.muted = true; v.playsInline = true; v.removeAttribute('controls');
    if (c.webm) mk('source', '', v, { src: c.webm, type: 'video/webm' });
    if (c.mp4) mk('source', '', v, { src: c.mp4, type: 'video/mp4' });
    var wipe = mk('div', 'clip-wipe', box, { 'aria-hidden': 'true' });
    if (c.cap) { var cap = mk('span', 'clip-cap', box); cap.textContent = c.cap; }
    var btn = mk('button', 'clip-btn', box, { type: 'button' });

    var reduced = !!(RM && RM.matches), userPaused = reduced, onScreen = true, covering = false, raf = 0;

    function paint() {
      var playing = !v.paused;
      btn.innerHTML = playing ? ICON.pause : ICON.play;
      btn.setAttribute('aria-label', playing ? 'Pause the clip' : 'Play the clip');
    }
    function resetWipe() { covering = false; wipe.className = 'clip-wipe'; }
    function go() { if (userPaused || !onScreen) return; var p = v.play(); if (p && p.catch) p.catch(function () { }); }
    function tick() {
      raf = 0;
      if (!box.isConnected || v.paused || reduced) return;
      if (!covering && v.duration && v.duration - v.currentTime <= WIPE_IN) { covering = true; wipe.className = 'clip-wipe in'; }
      raf = requestAnimationFrame(tick);
    }

    v.addEventListener('play', function () { paint(); if (!raf) raf = requestAnimationFrame(tick); });
    v.addEventListener('pause', function () { paint(); if (!v.ended) resetWipe(); });
    v.addEventListener('ended', function () {
      paint();
      if (reduced) { userPaused = true; v.load(); paint(); return; } /* back to the poster; the viewer can play it again */
      if (!covering) wipe.className = 'clip-wipe in';
      v.currentTime = 0; covering = false; go();
      requestAnimationFrame(function () { wipe.className = 'clip-wipe out'; });
    });
    wipe.addEventListener('transitionend', function () { if (/\bout\b/.test(wipe.className)) resetWipe(); });

    btn.addEventListener('click', function (ev) {
      ev.stopPropagation();
      if (v.paused) { userPaused = false; go(); } else { userPaused = true; v.pause(); }
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        onScreen = es[es.length - 1].isIntersecting;
        if (onScreen) go(); else v.pause();
      }, { threshold: 0.35 }).observe(box);
    }
    paint(); go();
    return { video: v, pause: function () { v.pause(); } };
  };
})();
