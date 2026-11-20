/* core.js: navegação, abas, lightbox, blueprint 2.5D, visibilidade e utilitários */
(function () {
  'use strict';
  var PG = window.PG || { root: '', assets: '', lang: 'pt' };
  var EN = PG.lang === 'en';
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduced() { return !!(mq && mq.matches); }
  var NS = 'http://www.w3.org/2000/svg';
  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function txt(parent, attrs, s) { var t = el('text', attrs, parent); t.textContent = s; return t; }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  // Observador de visibilidade: cb(true/false)
  function watch(node, cb, opts) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { cb(e.isIntersecting, e); }); }, opts || { threshold: 0.15 });
    io.observe(node);
  }
  // Canvas com DPR e laço que só roda quando visível
  function stage(cv, draw, opts) {
    opts = opts || {};
    var ctx = cv.getContext('2d'), W = 0, H = 0, vis = false, raf = 0, t0 = 0, acc = 0, last = 0;
    function size() {
      var r = cv.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      cv.width = Math.round(W * d); cv.height = Math.round(H * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
    }
    function frame(ts) {
      raf = 0;
      if (!last) last = ts;
      acc += Math.min(100, ts - last); last = ts;
      draw(ctx, W, H, acc / 1000);
      if (vis && !reduced()) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } }
    size();
    if (reduced()) { acc = (opts.still || 6) * 1000; }
    draw(ctx, W, H, acc / 1000);
    watch(cv, function (on) { vis = on; if (on) kick(); }, { threshold: 0.05 });
    var rt = 0;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { size(); draw(ctx, W, H, acc / 1000); }, 120); });
    return { restart: function () { acc = 0; kick(); }, kick: kick, time: function () { return acc / 1000; } };
  }

  // ---------- Blueprint axonométrico ----------
  function wrapText(s, n) {
    var w = String(s).split(' '), out = [], cur = '';
    w.forEach(function (x) { var t = cur ? cur + ' ' + x : x; if (t.length > n && cur) { out.push(cur); cur = x; } else cur = t; });
    if (cur) out.push(cur);
    return out;
  }
  function drawBP(svg, data) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var L = data.layers || [], n = L.length, gap = 58, hw = 74, hh = 36, cx = 100, top = 56;
    var base = top + (n - 1) * gap, H = base + hh + 78, W = 400;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.classList.add('bp-svg');
    var gg = el('g', { 'aria-hidden': 'true' }, svg);
    for (var gx = 0; gx <= W; gx += 10) el('line', { class: gx % 50 === 0 ? 'b-grid2' : 'b-grid', x1: gx, y1: 0, x2: gx, y2: H }, gg);
    for (var gy = 0; gy <= H; gy += 10) el('line', { class: gy % 50 === 0 ? 'b-grid2' : 'b-grid', x1: 0, y1: gy, x2: W, y2: gy }, gg);
    txt(svg, { class: 'b-small', x: 12, y: 16 }, 'BLUEPRINT ' + (data.code || ''));
    txt(svg, { class: 'b-small', x: W - 12, y: 16, 'text-anchor': 'end' }, n + (EN ? ' LAYERS, AXONOMETRIC' : ' CAMADAS, AXONOMÉTRICA'));
    var cy0 = base + 4, cy1 = top - hh;
    el('path', { class: 'b-cota', d: 'M12 ' + cy0 + 'V' + cy1 + 'M8 ' + cy0 + 'h8M8 ' + cy1 + 'h8M12 ' + cy1 + 'l-3 7h6z' }, svg);
    // fluxo que sobe pelo eixo
    el('path', { class: 'b-flow', d: 'M' + cx + ' ' + (base + hh) + 'V' + (top - hh + 8) }, svg);
    for (var i = n - 1; i >= 0; i--) {
      var y = base - i * gap, Ld = L[i];
      var g = el('g', { class: 'pl', tabindex: '0' }, svg);
      g.style.setProperty('--i', String(i));
      var t = 7;
      el('polygon', { class: 'b-side', points: [cx - hw, y, cx, y + hh, cx, y + hh + t, cx - hw, y + t].join(' ') }, g);
      el('polygon', { class: 'b-side', points: [cx + hw, y, cx, y + hh, cx, y + hh + t, cx + hw, y + t].join(' ') }, g);
      el('polygon', { class: 'b-top', points: [cx, y - hh, cx + hw, y, cx, y + hh, cx - hw, y].join(' ') }, g);
      for (var k = 1; k < 4; k++) {
        var f = k / 4;
        el('line', { class: 'b-hatch', x1: cx - hw * (1 - f), y1: y - hh * f, x2: cx + hw * f, y2: y + hh * (1 - f) }, g);
      }
      txt(g, { class: 'b-n', x: cx - hw + 10, y: y + 3 }, 'C' + (i + 1));
      el('circle', { class: 'b-dot', cx: cx + hw, cy: y, r: 1.8 }, g);
      el('path', { class: 'b-lead', d: 'M' + (cx + hw) + ' ' + y + 'h10l8 -14H198' }, g);
      var lx = 202, ly = y - 17;
      txt(g, { class: 'b-k', x: lx, y: ly }, String(Ld.k).toUpperCase());
      var lines = [];
      (Ld.items || []).forEach(function (it) { wrapText(it, 31).forEach(function (s, j) { lines.push((j ? '  ' : '· ') + s); }); });
      lines.slice(0, 4).forEach(function (s, j) { txt(g, { class: 'b-t', x: lx, y: ly + 12 + j * 11 }, s); });
      var ti = el('title', null, g); ti.textContent = Ld.k + ': ' + (Ld.items || []).join('; ');
    }
    var by = H - 36;
    el('rect', { class: 'b-box', x: 8, y: by, width: W - 16, height: 28 }, svg);
    el('line', { class: 'b-box', x1: W - 110, y1: by, x2: W - 110, y2: by + 28 }, svg);
    var nm = data.title || ''; if (nm.length > 42) nm = nm.slice(0, 40) + '...';
    txt(svg, { class: 'b-title', x: 14, y: by + 17 }, nm);
    txt(svg, { class: 'b-small', x: W - 104, y: by + 12 }, 'AC 2026');
    txt(svg, { class: 'b-small', x: W - 104, y: by + 22 }, EN ? 'NOT TO SCALE' : 'SEM ESCALA');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', (EN ? 'Layered blueprint: ' : 'Blueprint em camadas: ') + (data.title || '') + '. ' + L.map(function (l) { return l.k + ': ' + (l.items || []).join(', '); }).join('. '));
  }
  function initBPs() {
    var D = window.BPDATA || {};
    $$('svg[data-bp]').forEach(function (svg) {
      var d = D[svg.getAttribute('data-bp')]; if (!d) return;
      drawBP(svg, d);
      if (reduced()) { svg.classList.add('montado'); return; }
      watch(svg, function (on) { if (on) svg.classList.add('montado'); }, { threshold: 0.3 });
      var b = svg.parentNode.querySelector('[data-remontar]');
      if (b) b.addEventListener('click', function () { svg.classList.remove('montado'); void svg.getBoundingClientRect(); setTimeout(function () { svg.classList.add('montado'); }, 60); });
    });
  }

  // ---------- Navegação ----------
  function initNav() {
    var m = $('.nav-menu'), l = $('.nav-links');
    if (m && l) m.addEventListener('click', function () { var o = l.classList.toggle('open'); m.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    var lang = $('.lang');
    if (lang) lang.addEventListener('click', function () { try { localStorage.setItem('lang', EN ? 'pt' : 'en'); } catch (e) {} if (location.hash) lang.href = lang.getAttribute('href').split('#')[0] + location.hash; });
    // índice de projetos: marca o atual
    var idx = $$('.indice a');
    if (idx.length && 'IntersectionObserver' in window) {
      var map = {};
      idx.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { idx.forEach(function (a) { a.classList.remove('on'); }); var a = map[e.target.id]; if (a) { a.classList.add('on'); if (a.scrollIntoView && !reduced()) { var p = a.parentNode; p.scrollLeft = a.offsetLeft - p.clientWidth / 2 + a.clientWidth / 2; } } } });
      }, { rootMargin: '-30% 0px -60% 0px' });
      Object.keys(map).forEach(function (id) { var t = document.getElementById(id); if (t) io.observe(t); });
    }
    // altímetro
    var alt = $$('.alt a');
    if (alt.length && 'IntersectionObserver' in window) {
      var io2 = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) alt.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); }); });
      }, { rootMargin: '-45% 0px -50% 0px' });
      alt.forEach(function (a) { var t = document.getElementById(a.getAttribute('href').slice(1)); if (t) io2.observe(t); });
    }
  }

  // ---------- Abas ----------
  function initTabs() {
    $$('.abas').forEach(function (bar) {
      var bs = $$('button', bar);
      bs.forEach(function (b, i) {
        b.addEventListener('click', function () {
          bs.forEach(function (o) { var on = o === b; o.setAttribute('aria-selected', on ? 'true' : 'false'); o.tabIndex = on ? 0 : -1; var p = document.getElementById(o.getAttribute('aria-controls')); if (p) p.hidden = !on; });
        });
        b.addEventListener('keydown', function (ev) {
          var d = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
          var n = bs[(i + d + bs.length) % bs.length]; n.focus(); n.click();
        });
      });
    });
  }

  // ---------- Lightbox e zoom ----------
  function initLB() {
    var lb = document.createElement('div'); lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<button type="button">' + (EN ? 'Close' : 'Fechar') + ' (Esc)</button><img alt=""><p></p>';
    document.body.appendChild(lb);
    var img = $('img', lb), cap = $('p', lb), btn = $('button', lb), back = null;
    function close() { lb.classList.remove('open'); if (back) back.focus(); }
    btn.addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('open')) close(); });
    $$('[data-lb]').forEach(function (b) {
      b.addEventListener('click', function () { back = b; img.src = b.getAttribute('data-lb'); img.alt = b.getAttribute('data-cap') || ''; cap.textContent = b.getAttribute('data-cap') || ''; lb.classList.add('open'); btn.focus(); });
    });
    $$('.zoom').forEach(function (z) {
      z.addEventListener('pointermove', function (e) { var r = z.getBoundingClientRect(); z.style.setProperty('--zx', ((e.clientX - r.left) / r.width * 100) + '%'); z.style.setProperty('--zy', ((e.clientY - r.top) / r.height * 100) + '%'); });
    });
  }

  function initVivo() { $$('[data-vivo]').forEach(function (n) { if (reduced()) n.classList.add('vivo'); else watch(n, function (on) { if (on) n.classList.add('vivo'); }, { threshold: 0.2 }); }); }

  window.AC = { PG: PG, EN: EN, reduced: reduced, el: el, txt: txt, $: $, $$: $$, watch: watch, stage: stage, drawBP: drawBP };
  document.addEventListener('DOMContentLoaded', function () { initNav(); initTabs(); initLB(); initBPs(); initVivo(); });
})();
