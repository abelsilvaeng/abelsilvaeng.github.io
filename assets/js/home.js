/* home.js: hiperlapse do topo (do protótipo A), carta celeste com blueprints (do protótipo D),
   terminal âmbar e estante. */
(function () {
  'use strict';
  var AC = window.AC, EN = AC.EN, $ = AC.$, $$ = AC.$$, el = AC.el, txt = AC.txt;

  // ---------- Topo: exposição longa em torno do polo celeste sul ----------
  function hero() {
    var cv = $('#ceu'), box = $('#topo'); if (!cv || !box) return;
    var ctx = cv.getContext('2d'), W = 0, H = 0, px = 0, py = 0, base = 0, ridge = null, stars = [], catX = 0, catY = 0;
    var DUR = 9000, ARCO = Math.PI / 3, EXP = 14400, t0 = null, p = AC.reduced() ? 1 : 0, raf = 0, seed = 1;
    var expEl = $('#exp'), arcEl = $('#arco'), recEl = $('#rec');
    var COR = ['#E9E3D1', '#F2C230', '#F5B700', '#EC6A52', '#4FC6B3', '#78A9EE'];
    var LV = [{ w: .6, a: .32 }, { w: 1, a: .58 }, { w: 1.7, a: .9 }];
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    function ridgeAt(x) { var i = x / 3, i0 = Math.max(0, Math.min(ridge.length - 2, Math.floor(i))), f = i - i0; return ridge[i0] * (1 - f) + ridge[i0 + 1] * f; }
    function build() {
      var r = box.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var estreito = W < 760; base = H - Math.max(44, Math.min(110, H * .09)); px = W * (estreito ? .6 : .7); py = base - Math.max(150, H * .3);
      seed = 1936; var a1 = [], a2 = [], i; for (i = 0; i < 40; i++) a1.push(rnd()); for (i = 0; i < 90; i++) a2.push(rnd());
      function vn(arr, x) { var k = Math.floor(x), f = x - k; f = f * f * (3 - 2 * f); return arr[k % arr.length] * (1 - f) + arr[(k + 1) % arr.length] * f; }
      var amp = Math.min(H * .1, 90); ridge = new Float32Array(Math.ceil(W / 3) + 2);
      for (i = 0; i < ridge.length; i++) { var x = i * 3 / W, h = vn(a1, x * 5) * .65 + vn(a2, x * 17) * .25 + vn(a2, x * 43 + 7) * .1, env = .5 + .5 * Math.cos((x - .12) * Math.PI * 1.05); ridge[i] = base - h * amp * Math.max(.18, env) - 4; }
      catX = W * (estreito ? .86 : .885); catY = ridgeAt(catX);
      seed = 1925; var Rmax = 0; [[0, 0], [W, 0], [0, H], [W, H]].forEach(function (c) { Rmax = Math.max(Rmax, Math.hypot(c[0] - px, c[1] - py)); });
      var n = Math.round(Math.max(380, Math.min(1500, W * H / 850))); stars = [];
      for (i = 0; i < n; i++) { var rr = Rmax * Math.sqrt(rnd()); if (rr < 5) rr = 5 + rnd() * 8; var m = Math.pow(rnd(), 3.2); stars.push({ r: rr, th: rnd() * Math.PI * 2, band: Math.floor(rnd() * 6), lv: m > .45 ? 2 : (m > .12 ? 1 : 0) }); }
    }
    function render() {
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      var g = ctx.createLinearGradient(0, 0, 0, base); g.addColorStop(0, '#030509'); g.addColorStop(.65, '#060A11'); g.addColorStop(1, '#16110F'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      var gl = ctx.createRadialGradient(W * .22, base, 0, W * .22, base, Math.max(W, H) * .65); gl.addColorStop(0, 'rgba(224,145,63,.17)'); gl.addColorStop(1, 'rgba(224,145,63,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
      var span = Math.max(.0006, p * ARCO), i, s, l, b; ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      for (b = 0; b < 6; b++) for (l = 0; l < 3; l++) { ctx.strokeStyle = COR[b]; ctx.globalAlpha = LV[l].a * .8; ctx.lineWidth = LV[l].w; ctx.beginPath();
        for (i = 0; i < stars.length; i++) { s = stars[i]; if (s.band === b && s.lv === l) { ctx.moveTo(px + s.r * Math.cos(s.th), py + s.r * Math.sin(s.th)); ctx.arc(px, py, s.r, s.th, s.th + span); } } ctx.stroke(); }
      // cabeça da estrela, mais brilhante, na ponta do rastro
      if (p < 1) { ctx.fillStyle = '#fff'; ctx.globalAlpha = .9; for (i = 0; i < stars.length; i++) { s = stars[i]; if (s.lv === 2) ctx.fillRect(px + s.r * Math.cos(s.th + span) - 1, py + s.r * Math.sin(s.th + span) - 1, 2, 2); } }
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = .4; ctx.strokeStyle = '#E9E3D1'; ctx.lineWidth = 1; ctx.beginPath();
      ctx.moveTo(px - 9, py); ctx.lineTo(px - 3, py); ctx.moveTo(px + 3, py); ctx.lineTo(px + 9, py); ctx.moveTo(px, py - 9); ctx.lineTo(px, py - 3); ctx.moveTo(px, py + 3); ctx.lineTo(px, py + 9); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.fillStyle = '#010203'; ctx.beginPath(); ctx.moveTo(0, H); for (i = 0; i < ridge.length; i++) ctx.lineTo(i * 3, ridge[i]); ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
      for (var c = 1; c <= 9; c++) { var t = Math.pow(c / 10, 1.6); ctx.strokeStyle = c % 3 === 0 ? 'rgba(154,101,54,.5)' : 'rgba(154,101,54,.22)'; ctx.lineWidth = c % 3 === 0 ? 1 : .7; ctx.beginPath();
        for (i = 0; i < ridge.length; i++) { var y = ridge[i] + (H - ridge[i]) * t + Math.sin(i * .045 + c) * 2.2 * (1 - t); if (i === 0) ctx.moveTo(0, y); else ctx.lineTo(i * 3, y); } ctx.stroke(); }
      ctx.strokeStyle = 'rgba(224,145,63,.42)'; ctx.lineWidth = 1; ctx.beginPath(); for (i = 0; i < ridge.length; i++) { if (i === 0) ctx.moveTo(0, ridge[0]); else ctx.lineTo(i * 3, ridge[i]); } ctx.stroke();
      // Fisher em pixel no horizonte
      var x = Math.round(catX), yy = Math.round(catY) - 13; ctx.fillStyle = '#010203'; [[2, 5, 8, 8], [1, 1, 8, 6], [1, -1, 2, 2], [7, -1, 2, 2], [10, 7, 2, 6], [11, 5, 2, 3]].forEach(function (r) { ctx.fillRect(x + r[0], yy + r[1], r[2], r[3]); });
      ctx.fillStyle = '#E8D06A'; ctx.fillRect(x + 3, yy + 3, 1.5, 1.5); ctx.fillRect(x + 6, yy + 3, 1.5, 1.5);
    }
    function frame(ts) { raf = 0; if (t0 === null) t0 = ts; if (p < 1) p = AC.reduced() ? 1 : Math.min(1, (ts - t0) / DUR); render();
      if (expEl) expEl.textContent = Math.round(p * EXP).toLocaleString(EN ? 'en-US' : 'pt-BR'); if (arcEl) arcEl.textContent = String(Math.round(p * 60));
      if (recEl) { recEl.textContent = p >= 1 ? (EN ? 'done' : 'pronta') : (EN ? 'exposing' : 'expondo'); recEl.classList.toggle('done', p >= 1); }
      if (p < 1) raf = requestAnimationFrame(frame); }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }
    build(); render(); kick();
    var rt = 0; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { build(); render(); }, 120); });
    var again = $('#expor'); if (again) again.addEventListener('click', function () { if (AC.reduced()) return; p = 0; t0 = null; kick(); });
  }

  // ---------- Carta celeste ----------
  function chart() {
    var svg = $('#carta'), data = window.CHART, box = $('#chart-box'), pop = $('#bp-pop'); if (!svg || !data) return;
    var R = 440, seed = 1936; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var defs = el('defs', null, svg), cp = el('clipPath', { id: 'clip-hz' }, defs); el('circle', { cx: 0, cy: 0, r: R }, cp);
    el('circle', { class: 'disc', cx: 0, cy: 0, r: R }, svg);
    txt(svg, { class: 'marg-t', x: -492, y: -468 }, EN ? 'Star chart AC 2026' : 'Carta celeste AC 2026');
    txt(svg, { class: 'marg', x: -492, y: -448 }, EN ? 'SINGLE SHEET, BELO HORIZONTE' : 'FOLHA ÚNICA, BELO HORIZONTE');
    txt(svg, { class: 'marg', x: 492, y: -468, 'text-anchor': 'end' }, '19°55′S 43°56′W');
    txt(svg, { class: 'marg', x: -492, y: 488 }, EN ? 'STARS = HIGH-RELEVANCE PROJECTS' : 'ESTRELAS = PROJETOS DE ALTA RELEVÂNCIA');
    txt(svg, { class: 'marg', x: 492, y: 488, 'text-anchor': 'end' }, EN ? 'NIGHT SURVEY, AS USUAL' : 'LEVANTAMENTO NOTURNO, COMO DE COSTUME');
    var grid = el('g', { 'clip-path': 'url(#clip-hz)', 'aria-hidden': 'true' }, svg), PX = 60, PY = 250, i;
    for (i = 1; i <= 12; i++) el('circle', { class: i === 6 ? 'g2' : 'g', cx: PX, cy: PY, r: i * 62 }, grid);
    for (i = 0; i < 24; i++) { var a = i * Math.PI / 12; el('line', { class: 'g', x1: PX + Math.cos(a) * 62, y1: PY + Math.sin(a) * 62, x2: PX + Math.cos(a) * 900, y2: PY + Math.sin(a) * 900 }, grid); var lx = PX + Math.cos(a) * 372, ly = PY + Math.sin(a) * 372; if (Math.hypot(lx, ly) < R - 30) txt(grid, { class: 't-lab', x: lx + 4, y: ly + 14 }, i + 'h'); }
    el('path', { class: 'tick', d: 'M' + (PX - 7) + ' ' + PY + 'h14M' + PX + ' ' + (PY - 7) + 'v14' }, svg); txt(svg, { class: 't-lab', x: PX + 10, y: PY + 4 }, EN ? 'SCP' : 'PCS');
    var field = el('g', { class: 'field', 'aria-hidden': 'true', 'clip-path': 'url(#clip-hz)' }, svg);
    for (i = 0; i < 300; i++) { var z = Math.sqrt(rnd()) * R, th = rnd() * 6.283, m = rnd(); var fc = el('circle', { cx: (z * Math.cos(th)).toFixed(1), cy: (z * Math.sin(th)).toFixed(1), r: (0.6 + m * m * 2).toFixed(2), opacity: (0.3 + m * .6).toFixed(2) }, field); if (rnd() < .18) { fc.setAttribute('class', 'tw'); fc.style.animationDelay = (-rnd() * 5).toFixed(2) + 's'; } }
    var hz = el('g', { 'aria-hidden': 'true' }, svg); el('circle', { class: 'hz', cx: 0, cy: 0, r: R }, hz);
    for (var az = 0; az < 360; az += 5) { var sn = -Math.sin(az * Math.PI / 180), cs = -Math.cos(az * Math.PI / 180), len = az % 10 === 0 ? 13 : 6; el('line', { class: 'tick', x1: sn * R, y1: cs * R, x2: sn * (R + len), y2: cs * (R + len) }, hz);
      if (az % 90 === 0) txt(hz, { class: 'card', x: sn * (R + 36), y: cs * (R + 36) + 10, 'text-anchor': 'middle' }, (EN ? { 0: 'N', 90: 'E', 180: 'S', 270: 'W' } : { 0: 'N', 90: 'L', 180: 'S', 270: 'O' })[az]); }
    // constelações
    var CEN = [[-200, -190, 0.3], [150, -230, -0.5], [250, 40, 1.2], [-150, 150, 0.1], [95, 270, 2.6]];
    var SHAPE = [[0, 0], [78, -38], [140, 22], [70, 84], [-36, 96], [-96, 30], [-70, -64], [160, 110]];
    var GREEK = 'αβγδεζηθ', layer = el('g', null, svg), all = [], btns = $('#cons-btns'), list = $('#side-list');
    data.forEach(function (c, ci) {
      var cen = CEN[ci % CEN.length], g = el('g', { class: 'cons', 'data-c': c.id }, layer), rot = cen[2], sc = c.stars.length > 5 ? .95 : 1.05; g.style.setProperty('--c', c.color); c.g = g;
      c.stars.forEach(function (s, i) { var o = SHAPE[i % SHAPE.length], x = o[0] * sc - 30, y = o[1] * sc - 20; s.x = cen[0] + x * Math.cos(rot) - y * Math.sin(rot); s.y = cen[1] + x * Math.sin(rot) + y * Math.cos(rot); var hy = Math.hypot(s.x, s.y); if (hy > 380) { s.x *= 380 / hy; s.y *= 380 / hy; } s.c = c; s.b = GREEK[i]; s.r = i === 0 ? 10 : 7.5; });
      var lg = el('g', { 'aria-hidden': 'true' }, g);
      for (var i = 0; i < c.stars.length - 1; i++) el('line', { class: 'c-line', x1: c.stars[i].x, y1: c.stars[i].y, x2: c.stars[i + 1].x, y2: c.stars[i + 1].y }, lg);
      if (c.stars.length > 3) el('line', { class: 'c-line', x1: c.stars[c.stars.length - 1].x, y1: c.stars[c.stars.length - 1].y, x2: c.stars[0].x, y2: c.stars[0].y }, lg);
      c.stars.forEach(function (s) {
        var sg = el('a', { class: 'star', transform: 'translate(' + s.x.toFixed(1) + ' ' + s.y.toFixed(1) + ')', href: AC.PG.root + s.url, 'aria-label': s.name + ' (' + c.name + '). ' + (EN ? 'Enter opens the project.' : 'Enter abre o projeto.') }, g);
        el('circle', { class: 'hit', r: 26 }, sg); el('circle', { class: 'glow', r: s.r + 8 }, sg); el('circle', { class: 'halo', r: s.r + 3 }, sg); el('circle', { class: 'core', r: s.r }, sg); el('circle', { class: 'ring', r: s.r + 7 }, sg);
        txt(sg, { class: 's-name', x: s.r + 6, y: -s.r - 3 }, s.b); s.g = sg; all.push(s); bind(s, sg);
        var li = document.createElement('li'); li.innerHTML = '<a href="' + AC.PG.root + s.url + '" style="--c:' + c.color + '"><b>' + s.b + ' ' + c.abbr + '</b>' + s.name + '</a>'; list.appendChild(li);
        li.firstChild.addEventListener('mouseenter', function () { showBP(s); }); li.firstChild.addEventListener('mouseleave', hideSoon); li.firstChild.addEventListener('focus', function () { showBP(s); }); li.firstChild.addEventListener('blur', hideSoon);
      });
      var lxm = 0, lym = 0; c.stars.forEach(function (s) { lxm += s.x; lym += s.y; }); lxm /= c.stars.length; lym = Math.max.apply(null, c.stars.map(function (s) { return s.y; })) + 44; var lh = Math.hypot(lxm, lym); if (lh > 385) { lxm *= 385 / lh; lym *= 385 / lh; }
      var lab = txt(g, { class: 'c-label', x: lxm, y: lym, 'text-anchor': 'middle' }, c.name.toUpperCase());
      var b = document.createElement('li'); b.innerHTML = '<button type="button" aria-pressed="false" style="--c:' + c.color + '"><i>' + c.name + '</i><span>' + c.sub + '</span></button>'; btns.appendChild(b);
      function pick() { var on = !g.classList.contains('on'); data.forEach(function (o) { o.g.classList.toggle('on', on && o === c); o.g.classList.toggle('dim', on && o !== c); }); $$('button', btns).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); if (on) b.firstChild.setAttribute('aria-pressed', 'true'); }
      b.firstChild.addEventListener('click', pick); lab.addEventListener('click', pick);
    });
    var bpSvg = $('svg', pop), bpLink = $('a', pop), bpFor = null, timer = 0, lastPtr = 'mouse';
    function place(s) { var b = box.getBoundingClientRect(), cx = (s.x + 500) / 1000 * b.width, cy = (s.y + 500) / 1000 * b.height, w = pop.offsetWidth, h = pop.offsetHeight, left, top;
      if (b.width < 640) { left = (b.width - w) / 2; top = cy < b.height / 2 ? cy + 26 : cy - 26 - h; } else { left = cx < b.width / 2 ? cx + 30 : cx - 30 - w; top = cy - h / 2; }
      left = Math.max(6, Math.min(left, b.width - w - 6)); top = Math.max(-60, Math.min(top, b.height - h + 60)); pop.style.left = left + 'px'; pop.style.top = top + 'px'; pop.style.transformOrigin = (cx - left) + 'px ' + (cy - top) + 'px'; }
    function showBP(s) { clearTimeout(timer); if (bpFor === s && pop.classList.contains('open')) return; if (bpFor) bpFor.g.classList.remove('hot'); bpFor = s;
      AC.drawBP(bpSvg, (window.BPDATA || {})[s.bp] || { title: s.name, layers: [] }); bpSvg.classList.remove('montado'); bpLink.href = AC.PG.root + s.url; pop.style.setProperty('--bp-acc', s.c.color);
      pop.classList.remove('open'); place(s); void pop.offsetWidth; pop.classList.add('open'); pop.setAttribute('aria-hidden', 'false'); s.g.classList.add('hot'); setTimeout(function () { bpSvg.classList.add('montado'); }, 40); }
    function hide() { clearTimeout(timer); if (bpFor) bpFor.g.classList.remove('hot'); pop.classList.remove('open'); pop.setAttribute('aria-hidden', 'true'); bpFor = null; }
    function hideSoon() { clearTimeout(timer); timer = setTimeout(hide, 280); }
    pop.addEventListener('pointerenter', function () { clearTimeout(timer); }); pop.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch') hideSoon(); });
    function bind(s, g) {
      g.addEventListener('pointerdown', function (e) { lastPtr = e.pointerType || 'mouse'; });
      g.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') showBP(s); });
      g.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch') hideSoon(); });
      g.addEventListener('click', function (e) { if (lastPtr === 'touch' && bpFor !== s) { e.preventDefault(); showBP(s); } });
      g.addEventListener('focus', function () { showBP(s); }); g.addEventListener('blur', hideSoon);
    }
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
    svg.addEventListener('click', function (e) { if (e.target === svg || e.target.classList.contains('disc')) hide(); });
    if (AC.reduced()) svg.classList.add('vivo'); else AC.watch(svg, function (on) { if (on) svg.classList.add('vivo'); }, { threshold: .25 });
    // demonstração: abre o blueprint da primeira estrela quando a carta entra na tela
    var demo = false; AC.watch(box, function (on) { if (on && !demo && all.length) { demo = true; setTimeout(function () { if (!bpFor) showBP((data[2] && data[2].stars[0]) || all[0]); }, AC.reduced() ? 0 : 1500); } }, { threshold: .55 });
  }

  // ---------- Terminal âmbar ----------
  function terminal() {
    var T = window.TERM, out = $('#term-out'), inp = $('#term-in'), tabs = $('#term-tabs'); if (!T || !out) return;
    var queue = [], busy = false, hist = [], hi = 0;
    function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/^>\s*/, '').replace(/\s+/g, ' ').trim(); }
    function fmt(s) { return s.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; })
      .replace(/\[\[cmd:([^|\]]+)\|([^\]]+)\]\]/g, '<button type="button" class="t-link" data-cmd="$1">$2</button>')
      .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, function (m, u, t) { return '<a href="' + (/^https?:/.test(u) ? u + '" target="_blank" rel="noopener' : AC.PG.root + u) + '">' + t + '</a>'; })
      .replace(/\{bar:(\d+)\}/g, '<span class="bar" style="width:$1px"></span>'); }
    function line(s, cls) { var p = document.createElement('p'); if (s.charAt(0) === '~') { cls = 'dim'; s = s.slice(1); } if (cls) p.className = cls; p.innerHTML = fmt(s) || '&nbsp;'; out.appendChild(p); out.scrollTop = out.scrollHeight; }
    function pump() { if (!queue.length) { busy = false; return; } busy = true; var n = AC.reduced() ? queue.length : 2; while (n-- && queue.length) line(queue.shift()); setTimeout(pump, 28); }
    function print(lines) { queue = queue.concat(lines); if (!busy) pump(); }
    function run(raw, echo) {
      var q = norm(raw); if (!q) return; if (echo !== false) { queue = []; line('> ' + raw.replace(/^>\s*/, ''), 'cmd'); }
      if (q === 'clear' || q === 'cls' || q === 'limpar') { out.innerHTML = ''; return; }
      var key = T.alias[q] || q, res = T.cmds[key];
      if (!res) { var m = q.match(/^(stack|tech)\s+(.+)$/); if (m) { var k2 = Object.keys(T.tech).filter(function (k) { return norm(k) === m[2] || norm(k).indexOf(m[2]) >= 0; })[0]; if (k2) res = [T.usedIn.replace('%s', k2)].concat(T.tech[k2].map(function (p) { return '  [[' + p.u + '|' + p.t + ']]  ~' + p.i; }).map(function (s) { return s.replace('  ~', '   '); })); } }
      if (!res && T.fisher.indexOf(q) >= 0 && AC.fisherAsk) { print([T.fisherLine]); return; }
      print(res ? res.concat(['']) : [T.unknown.replace('%s', raw), '']);
      $$('button', tabs).forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-cmd') === key ? 'true' : 'false'); });
    }
    T.tabs.forEach(function (t) { var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('data-cmd', t.cmd); b.setAttribute('aria-selected', 'false'); b.textContent = t.label; b.addEventListener('click', function () { run(t.cmd); }); tabs.appendChild(b); });
    out.addEventListener('click', function (e) { var b = e.target.closest ? e.target.closest('[data-cmd]') : null; if (b) run(b.getAttribute('data-cmd')); });
    $('#term-form').addEventListener('submit', function (e) { e.preventDefault(); var v = inp.value; inp.value = ''; if (v.trim()) { hist.push(v); hi = hist.length; run(v); } });
    inp.addEventListener('keydown', function (e) { if (e.key === 'ArrowUp' && hist.length) { hi = Math.max(0, hi - 1); inp.value = hist[hi]; e.preventDefault(); } if (e.key === 'ArrowDown') { hi = Math.min(hist.length, hi + 1); inp.value = hist[hi] || ''; } });
    var booted = false; AC.watch($('.term'), function (on) { if (on && !booted) { booted = true; print(T.boot); setTimeout(function () { run(T.first); }, AC.reduced() ? 0 : 900); } }, { threshold: .3 });
  }

  // ---------- Estante ----------
  function shelf() {
    var box = $('#estante'); if (!box) return; var ficha = $('#livro-ficha'), S = window.SHELF_T || {};
    function render(db) {
      var livros = (db.livros || []).filter(function (l) { return db.modo === 'lidos' ? /^(sim|lendo|parcial)$/i.test(l.lido || '') : l.previa; });
      var temas = {}; livros.forEach(function (l) { (temas[l.tema] = temas[l.tema] || []).push(l); });
      var pal = ['#7A2B1C', '#23475A', '#3F5A32', '#6B4A1E', '#4A2F5E', '#1F3A5F', '#8A5A2B', '#2D4F4A', '#5E2337'];
      Object.keys(temas).forEach(function (tema) {
        var pr = document.createElement('div'); pr.className = 'prat'; pr.innerHTML = '<div class="prat-t">' + ((S.temas || {})[tema] || tema) + '</div><div class="prat-l" role="list"></div>'; var row = pr.lastChild;
        temas[tema].forEach(function (l, i) {
          var h = 0; for (var k = 0; k < l.slug.length; k++) h = (h * 31 + l.slug.charCodeAt(k)) >>> 0;
          var b = document.createElement('button'); b.type = 'button'; b.className = 'livro' + (i === temas[tema].length - 1 && h % 3 === 0 ? ' inclina' : ''); b.setAttribute('role', 'listitem');
          b.style.setProperty('--h', (150 + h % 34) + 'px'); b.style.setProperty('--w', (26 + (h >> 4) % 18) + 'px'); b.style.setProperty('--cor', pal[h % pal.length]);
          b.setAttribute('aria-label', l.titulo + ', ' + l.autor);
          b.innerHTML = '<span class="lombada"><span></span></span><span class="capa"></span>'; b.querySelector('.lombada span').textContent = l.titulo.split(':')[0].slice(0, 44);
          if (l.capa) b.querySelector('.capa').style.backgroundImage = 'url("' + AC.PG.assets + 'assets/img/capas/' + l.capa + '")';
          function show() { ficha.innerHTML = '<b></b>'; ficha.firstChild.textContent = l.titulo; ficha.appendChild(document.createTextNode(' ' + l.autor + (l.ano ? ', ' + l.ano : ''))); }
          b.addEventListener('mouseenter', show); b.addEventListener('focus', show); b.addEventListener('click', function () { $$('.livro.aberto', box).forEach(function (o) { if (o !== b) o.classList.remove('aberto'); }); b.classList.toggle('aberto'); show(); });
          row.appendChild(b);
        });
        box.appendChild(pr);
      });
    }
    var url = AC.PG.assets + 'assets/data/biblioteca.json';
    function fallback() { if (window.BIBLIOTECA) render(window.BIBLIOTECA); }
    if (window.fetch && location.protocol !== 'file:') fetch(url).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(render).catch(fallback); else fallback();
  }

  document.addEventListener('DOMContentLoaded', function () { hero(); chart(); terminal(); shelf(); });
})();
