/* Builds the frame around a toy page. The page names its toy: <body data-toy="stable">. Needs content.js and nav.js first. */
(function () {
  'use strict';
  var PF = window.PF, U = window.PFUI, id = document.body.getAttribute('data-toy');
  var idx = -1; PF.toys.forEach(function (t, i) { if (t.id === id) idx = i; });
  var t = PF.toys[idx], slot = document.getElementById('toy-intro'); if (!t || !slot) return;
  var h = function (tag, a, p) { var e = document.createElement(tag); for (var k in a) { if (k === 'text') e.textContent = a[k]; else e.setAttribute(k, a[k]); } if (p) p.appendChild(e); return e; };
  var m = U.find(t.from[0]), model = function (x) { return '../index.html?open=' + x; };

  var crumb = h('p', { 'class': 'crumb' }, slot); h('a', { href: '../play.html', text: '\u2190 All toys' }, crumb);
  var title = h('h1', { text: t.title }, slot);
  h('p', { 'class': 'tlead', text: t.q }, slot);

  var from = h('div', { 'class': 'tfrom' }, slot), g = h('div', { 'class': 'tg' }, from);
  g.appendChild(U.glyph(m.f, m.d, model(m.d.id), m.d.title + ', under ' + m.f.name + '. See it in the model.'));
  var cap = h('p', { 'class': 'cap' }, g); h('b', { text: 'In the model: ' }, cap); cap.appendChild(document.createTextNode(m.f.name + ' \u203A ' + m.d.title + '. Click the drawing to find it.'));

  var tt = h('div', { 'class': 'tt' }, from);
  var a = h('div', {}, tt); h('p', { 'class': 'tk', text: 'What it shows' }, a); h('p', { text: t.learn }, a);
  var b = h('div', {}, tt); h('p', { 'class': 'tk', text: 'Why it is here' }, b); h('p', { text: t.why }, b);

  var nx = document.getElementById('toy-next'); if (!nx) return;
  /* where the toy comes from: a quiet line after the toy, not a button above it */
  var others = t.from.slice(1).map(function (x) { return U.find(x); }).filter(Boolean);
  var src = h('p', { 'class': 'tsrc' }, nx); src.appendChild(document.createTextNode('Source project: '));
  h('a', { href: model(m.d.id), text: m.f.name + ' \u203A ' + m.d.title }, src);
  if (others.length) { src.appendChild(document.createTextNode('. Also related: ')); others.forEach(function (o, i) { if (i) src.appendChild(document.createTextNode(', ')); h('a', { href: model(o.d.id), text: o.d.title }, src); }); }
  var nav = h('nav', { 'class': 'tnext', 'aria-label': 'More toys' }, nx);
  var tint = function (a, toy) { var mm = toy && U.find(toy.from[0]); a.style.setProperty('--c', mm ? mm.f.col : m.f.col); return a; };
  var prev = PF.toys[idx - 1], next = PF.toys[idx + 1];
  var pa = prev ? tint(h('a', { href: '../' + prev.file }, nav), prev) : h('span', { 'class': 'none' }, nav);
  if (prev) { h('small', { text: '\u2190 Previous' }, pa); h('b', { text: prev.title }, pa); }
  var all = tint(h('a', { 'class': 'all', href: '../play.html' }, nav), t); h('small', { text: 'Back to' }, all); h('b', { text: 'All toys' }, all);
  var na = next ? tint(h('a', { 'class': 'nx', href: '../' + next.file }, nav), next) : tint(h('a', { 'class': 'nx', href: '../index.html' }, nav), t);
  if (next) { h('small', { text: 'Next \u2192' }, na); h('b', { text: next.title }, na); } else { h('small', { text: 'Finished' }, na); h('b', { text: 'Back to the model \u2192' }, na); }
})();
