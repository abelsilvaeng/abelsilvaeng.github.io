/* anims.js: animações temáticas por instituição e por projeto. Tudo esquemático:
   nenhuma delas usa dado real, ponto real ou valor medido. Canvas 2D leve, só roda quando visível. */
(function () {
  'use strict';
  var AC = window.AC, EN = AC.EN;
  var BR = [[-51.6,4.4],[-50,1.8],[-50,0],[-48.5,-0.7],[-46,-1],[-44.3,-2.5],[-41.5,-2.9],[-38.5,-3.7],[-37,-4.9],[-35.2,-5.5],[-34.8,-7.1],[-34.9,-8.1],[-35.7,-9.7],[-37,-11],[-38.5,-13],[-39,-15],[-39.1,-17],[-39.7,-18.5],[-40.3,-20.3],[-41,-22],[-42,-22.9],[-43.2,-23],[-45,-23.5],[-46.3,-24],[-48,-25.3],[-48.6,-26.5],[-48.6,-28],[-49.7,-29.3],[-51,-31],[-52.1,-32.2],[-53.4,-33.7],[-53.5,-32.5],[-55,-31.3],[-57.6,-30.2],[-55.8,-28.3],[-53.8,-27.2],[-53.7,-26.2],[-54.6,-25.6],[-54.3,-24],[-55.7,-22.5],[-57.9,-22.1],[-57.8,-20],[-57.6,-19],[-58.2,-17.5],[-58.4,-16.3],[-60.2,-16.2],[-60.5,-13.8],[-62,-13],[-64.4,-12.4],[-65.3,-11],[-65.4,-9.8],[-66.6,-9.9],[-68.6,-11],[-70.5,-11],[-70.6,-9.5],[-72.2,-10],[-73,-9.2],[-73.9,-7.4],[-72.9,-5.2],[-70,-4.3],[-69.4,-1.2],[-69.8,1.7],[-66.9,1.2],[-65.5,0.8],[-64.2,1.5],[-63.4,2.2],[-64,4],[-62.8,4],[-60.3,5.2],[-59.8,4.5],[-59.9,2.2],[-58.9,1.3],[-57,1.9],[-56,2.3],[-54.6,2.3],[-52.9,2.2]];
  var MG = [[-51,-19.6],[-50.3,-18.6],[-49.2,-18.4],[-48,-18.3],[-47.3,-18],[-47.3,-16.5],[-46.9,-15.9],[-46,-15.2],[-45.9,-14.4],[-44.2,-14.2],[-43,-14.6],[-42,-14.9],[-41.4,-15.2],[-40.6,-15.7],[-39.9,-16],[-40.3,-16.6],[-40.5,-17.5],[-41,-18],[-40.9,-18.6],[-41.2,-19.5],[-41,-20.2],[-41.8,-20.6],[-41.9,-21.2],[-42.3,-21.6],[-42.3,-22],[-43.2,-22.1],[-44.2,-22.3],[-44.8,-22.4],[-45.6,-22.6],[-46.4,-22.9],[-46.6,-22.3],[-46.7,-21.6],[-47.2,-21],[-47.3,-20.3],[-48,-20.1],[-49.3,-20.1],[-50.5,-19.9]];
  var CAP = { BSB:[-47.9,-15.8], SP:[-46.6,-23.5], RJ:[-43.2,-22.9], BH:[-43.9,-19.9], SSA:[-38.5,-13], REC:[-34.9,-8.05], FOR:[-38.5,-3.7], BEL:[-48.5,-1.45], MAO:[-60,-3.1], PVH:[-63.9,-8.76], CGB:[-56.1,-15.6], CGR:[-54.6,-20.45], GYN:[-49.25,-16.7], CWB:[-49.27,-25.43], FLN:[-48.55,-27.6], POA:[-51.2,-30], VIX:[-40.3,-20.3], NAT:[-35.2,-5.8], JPA:[-34.86,-7.1], MCZ:[-35.7,-9.66], AJU:[-37.07,-10.9], THE:[-42.8,-5.09], SLZ:[-44.3,-2.53], PMW:[-48.33,-10.2], MCP:[-51.07,0.03], BVB:[-60.67,2.82], RBR:[-67.8,-9.97] };
  var EDGES = ['BSB-GYN','BSB-BH','BH-RJ','BH-SP','RJ-SP','SP-CWB','CWB-FLN','FLN-POA','BH-VIX','VIX-RJ','BH-SSA','VIX-SSA','SSA-AJU','AJU-MCZ','MCZ-REC','REC-JPA','JPA-NAT','NAT-FOR','FOR-THE','THE-SLZ','SLZ-BEL','BSB-PMW','PMW-BEL','BSB-SSA','GYN-CGB','CGB-PVH','PVH-RBR','PVH-MAO','MAO-BVB','CGB-CGR','CGR-SP','CGR-CWB','GYN-SP','THE-PMW','REC-THE','BEL-MCP','SSA-THE'];
  var RIOS = [ [[-50,-0.3],[-52,-1.5],[-55,-2.2],[-58,-3],[-60,-3.1],[-63,-3.8],[-66,-3.2],[-69.5,-4.2]], [[-36.4,-10.5],[-38,-9.3],[-40.5,-9.4],[-42.5,-11],[-43.8,-13.5],[-44.5,-16],[-45.2,-18.3]], [[-49.3,-1.5],[-49.5,-4],[-48.5,-7],[-48.3,-10],[-49,-13]], [[-54.6,-25.5],[-53.5,-23],[-52,-21],[-51,-20.3],[-49,-21],[-47.5,-22.5]], [[-57.9,-22],[-57.5,-19],[-57.4,-17]], [[-60,-3.1],[-61.5,-5],[-63.9,-8.7]] ];
  var MGC = { BH:[-43.94,-19.92], UDI:[-48.28,-18.92], URA:[-47.93,-19.75], JDF:[-43.35,-21.76], MOC:[-43.86,-16.73], GVR:[-41.95,-18.85], IPN:[-42.54,-19.47], TOT:[-41.51,-17.86], DIV:[-44.88,-20.14], VAG:[-45.43,-21.55], POC:[-46.56,-21.79], PMS:[-46.52,-18.58], UNA:[-46.91,-16.36], DIA:[-43.6,-18.24], JAN:[-43.31,-15.8], BAR:[-43.77,-21.22] };
  var MGE = ['BH-UDI','BH-JDF','BH-MOC','BH-GVR','BH-DIV','BH-IPN','UDI-URA','URA-POC','BH-VAG','VAG-POC','MOC-JAN','GVR-TOT','BH-PMS','PMS-UNA','BH-DIA','JDF-BAR','BH-BAR','PMS-UDI','IPN-GVR','MOC-TOT','DIV-URA'];

  function vars(cv) { var cs = getComputedStyle(cv); function v(n, f) { var x = cs.getPropertyValue(n).trim(); return x || f; } return { bg: v('--card', '#10161c'), fg: v('--fg', '#ECE6D6'), mu: v('--fg-muted', '#888'), acc: v('--acc', '#E0913F'), rule: v('--rule', '#333') }; }
  function fit(pts, W, H, pad) { var a = 1e9, b = -1e9, c = 1e9, d = -1e9; pts.forEach(function (p) { a = Math.min(a, p[0]); b = Math.max(b, p[0]); c = Math.min(c, p[1]); d = Math.max(d, p[1]); }); var s = Math.min((W - pad * 2) / (b - a), (H - pad * 2) / (d - c)), ox = (W - (b - a) * s) / 2, oy = (H - (d - c) * s) / 2; return function (p) { return [ox + (p[0] - a) * s, oy + (d - p[1]) * s]; }; }
  function poly(x, pts, P, close) { x.beginPath(); pts.forEach(function (p, i) { var q = P(p); if (i) x.lineTo(q[0], q[1]); else x.moveTo(q[0], q[1]); }); if (close) x.closePath(); }
  function clear(x, W, H, c) { x.globalAlpha = 1; x.fillStyle = c; x.fillRect(0, 0, W, H); }
  function label(x, s, X, Y, c, al, sz) { if (x.canvas.clientWidth < 300 && !/^\d|^[A-Z/]{2,5}$/.test(s)) return; x.font = (sz || 11) + 'px "JetBrains Mono", Consolas, monospace'; x.fillStyle = c; x.textAlign = al || 'left'; x.fillText(s, X, Y); }
  function ease(k) { k = Math.max(0, Math.min(1, k)); return k * k * (3 - 2 * k); }
  function partial(x, pts, k) { // desenha fração k de uma polilinha já projetada; devolve a ponta
    var L = 0, i, seg = []; for (i = 1; i < pts.length; i++) { var d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
    var rest = L * Math.max(0, Math.min(1, k)), tip = pts[0]; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]);
    for (i = 1; i < pts.length; i++) { if (rest >= seg[i - 1]) { x.lineTo(pts[i][0], pts[i][1]); rest -= seg[i - 1]; tip = pts[i]; } else { var f = rest / seg[i - 1]; tip = [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f]; x.lineTo(tip[0], tip[1]); break; } }
    x.stroke(); return tip;
  }
  function rnd(i) { var s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
  function iso(x, cx, cy, w, h, th, top, side, stroke) { x.beginPath(); x.moveTo(cx - w, cy); x.lineTo(cx, cy + h); x.lineTo(cx, cy + h + th); x.lineTo(cx - w, cy + th); x.closePath(); x.fillStyle = side; x.fill(); x.stroke();
    x.beginPath(); x.moveTo(cx + w, cy); x.lineTo(cx, cy + h); x.lineTo(cx, cy + h + th); x.lineTo(cx + w, cy + th); x.closePath(); x.fill(); x.stroke();
    x.beginPath(); x.moveTo(cx, cy - h); x.lineTo(cx + w, cy); x.lineTo(cx, cy + h); x.lineTo(cx - w, cy); x.closePath(); x.fillStyle = top; x.fill(); x.strokeStyle = stroke; x.stroke(); }

  var A = {};
  A.snv = function (x, W, H, t, c) {
    clear(x, W, H, c.bg); var P = fit(BR, W, H, 14);
    x.lineWidth = 1; x.strokeStyle = c.rule; poly(x, BR, P, true); x.stroke(); x.fillStyle = 'rgba(255,255,255,.025)'; x.fill();
    var cyc = (t % 16), n = EDGES.length;
    EDGES.forEach(function (e, i) { var ab = e.split('-'), a = P(CAP[ab[0]]), b = P(CAP[ab[1]]), k = ease((cyc - i * 0.22) / 1.2);
      x.strokeStyle = c.rule; x.lineWidth = 1; x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke();
      if (k > 0) { x.strokeStyle = c.acc; x.lineWidth = 2; x.shadowColor = c.acc; x.shadowBlur = 8; x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k); x.stroke(); x.shadowBlur = 0;
        if (k >= 1) { var f = ((t * 0.25 + rnd(i)) % 1); x.fillStyle = '#fff'; x.fillRect(a[0] + (b[0] - a[0]) * f - 1, a[1] + (b[1] - a[1]) * f - 1, 2.5, 2.5); } } });
    Object.keys(CAP).forEach(function (k) { var p = P(CAP[k]); x.fillStyle = c.fg; x.beginPath(); x.arc(p[0], p[1], 2, 0, 7); x.fill(); });
    label(x, EN ? 'schematic network' : 'malha esquemática', 10, H - 10, c.mu);
  };
  A.multimodais = function (x, W, H, t, c) {
    clear(x, W, H, c.bg); var UF = 'AC AL AM AP BA CE DF/GO ES MA MG MS MT PA PB PE PI PR RJ RN RO RR RS SC SE SP TO BR'.split(' ');
    var cols = W < 420 ? 6 : 9, rows = Math.ceil(27 / cols), gw = (W - 20) / cols, gh = (H - 34) / rows, cyc = t % 14;
    UF.forEach(function (u, i) { var X = 10 + (i % cols) * gw + 3, Y = 8 + Math.floor(i / cols) * gh + 3, w = gw - 6, h = gh - 6, k = ease((cyc - i * 0.3) / 1.4);
      x.strokeStyle = c.rule; x.lineWidth = 1; x.strokeRect(X, Y, w, h);
      if (k > 0) { x.fillStyle = '#F3EFE2'; x.fillRect(X, Y, w, h * k); x.save(); x.beginPath(); x.rect(X, Y, w, h * k); x.clip();
        x.strokeStyle = '#B0402C'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(X + 2, Y + h * (.3 + rnd(i) * .4)); x.bezierCurveTo(X + w * .3, Y + h * rnd(i + 1), X + w * .6, Y + h * rnd(i + 2), X + w - 2, Y + h * (.3 + rnd(i + 3) * .5)); x.stroke();
        x.strokeStyle = '#23688A'; x.beginPath(); x.moveTo(X + w * rnd(i + 4), Y + 2); x.quadraticCurveTo(X + w * rnd(i + 5), Y + h / 2, X + w * rnd(i + 6), Y + h - 2); x.stroke();
        x.strokeStyle = '#333'; x.setLineDash([3, 2]); x.beginPath(); x.moveTo(X + 2, Y + h * rnd(i + 7)); x.lineTo(X + w - 2, Y + h * rnd(i + 8)); x.stroke(); x.setLineDash([]);
        x.fillStyle = '#20262A'; x.fillRect(X + w - 14, Y + h - 9, 12, 7); x.restore();
        if (k < 1) { x.fillStyle = c.acc; x.fillRect(X, Y + h * k - 1, w, 2); } }
      label(x, u, X + 3, Y + 11, k > .2 ? '#20262A' : c.mu, 'left', 9); });
    label(x, Math.min(27, Math.floor(cyc / 0.3)) + '/27 A0', W - 10, H - 9, c.acc, 'right');
    label(x, EN ? 'from the database to the sheet' : 'do banco para a folha', 10, H - 9, c.mu);
  };
  A.hidrovias = function (x, W, H, t, c) {
    clear(x, W, H, c.bg); var P = fit(BR, W, H, 14); x.strokeStyle = c.rule; x.lineWidth = 1; poly(x, BR, P, true); x.stroke();
    var cyc = t % 12;
    RIOS.forEach(function (r, i) { var pts = r.map(P), k = ease((cyc - i * 0.8) / 4);
      x.strokeStyle = 'rgba(79,167,224,.18)'; x.lineWidth = 3; partial(x, pts, 1);
      if (k > 0) { x.strokeStyle = '#4FA7E0'; x.lineWidth = 2.5; x.shadowColor = '#4FA7E0'; x.shadowBlur = 8; var tip = partial(x, pts, k); x.shadowBlur = 0; x.fillStyle = '#fff'; x.beginPath(); x.arc(tip[0], tip[1], 3, 0, 7); x.fill(); x.fillStyle = c.acc; x.beginPath(); x.arc(pts[0][0], pts[0][1], 4, 0, 7); x.fill(); } });
    label(x, EN ? 'routes oriented from mouth to headwaters (schematic)' : 'rotas orientadas da foz à montante (esquema)', 10, H - 10, c.mu);
  };
  A.cide = function (x, W, H, t, c) {
    clear(x, W, H, c.bg); var P = fit(BR, W, H, 14); x.strokeStyle = c.rule; poly(x, BR, P, true); x.stroke();
    var b = P(CAP.BSB), cyc = t % 12, ciclo = Math.min(3, Math.floor(cyc / 4) + 1), ph = (cyc % 4) / 3;
    Object.keys(CAP).forEach(function (k, i) { var p = P(CAP[k]); x.strokeStyle = c.rule; x.beginPath(); x.moveTo(p[0], p[1]); x.lineTo(b[0], b[1]); x.stroke();
      var f = ease(ph * 1.6 - rnd(i) * .6); if (f > 0 && f < 1) { x.fillStyle = c.acc; x.fillRect(p[0] + (b[0] - p[0]) * f - 2, p[1] + (b[1] - p[1]) * f - 2, 5, 4); }
      x.fillStyle = f >= 1 ? c.acc : c.fg; x.beginPath(); x.arc(p[0], p[1], 2.5, 0, 7); x.fill(); });
    x.strokeStyle = c.acc; x.lineWidth = 2; x.beginPath(); x.arc(b[0], b[1], 7 + Math.sin(t * 4) * 1.5, 0, 7); x.stroke(); x.lineWidth = 1;
    label(x, (EN ? 'cycle ' : 'ciclo ') + ciclo + '/3', W - 10, 18, c.acc, 'right', 13); label(x, EN ? '27 states report, one consolidation' : '27 UFs declaram, uma consolidação', 10, H - 10, c.mu);
  };
  A.faixas = function (x, W, H, t, c) {
    clear(x, W, H, c.bg); var segs = [1, 2, 2, 3, 2, 1], sw = W / segs.length, cy = H / 2, lw = Math.min(16, H / 9), sweep = (t * 0.18) % 1.3;
    segs.forEach(function (n, i) { var X = i * sw, on = sweep * W > X + sw / 2, h = n * 2 * lw;
      x.fillStyle = '#2b2f33'; x.fillRect(X, cy - h / 2, sw + 1, h); x.strokeStyle = '#F5B700'; x.lineWidth = 2; x.beginPath(); x.moveTo(X, cy); x.lineTo(X + sw, cy); x.stroke();
      x.strokeStyle = '#ddd'; x.lineWidth = 1; x.setLineDash([8, 8]); for (var l = 1; l < n; l++) { [-1, 1].forEach(function (s) { x.beginPath(); x.moveTo(X, cy + s * l * lw); x.lineTo(X + sw, cy + s * l * lw); x.stroke(); }); } x.setLineDash([]);
      for (var k = 0; k < n * 2; k++) { var lane = k - n, yy = cy + lane * lw + lw / 2, dir = lane < 0 ? -1 : 1, px = ((t * (30 + k * 7) * dir + rnd(i * 9 + k) * sw) % sw + sw) % sw; x.fillStyle = k % 3 ? '#cfd2ea' : c.acc; x.fillRect(X + px, yy - 2.5, 9, 5); }
      if (on) { x.fillStyle = c.acc; x.fillRect(X + sw / 2 - 13, cy - h / 2 - 24, 26, 18); label(x, String(n * 2), X + sw / 2, cy - h / 2 - 10, '#15181B', 'center', 13); } });
    x.fillStyle = 'rgba(245,183,0,.5)'; x.fillRect(sweep * W, 0, 2, H); label(x, EN ? 'lanes per segment (schematic)' : 'faixas por segmento (esquema)', 10, H - 10, c.mu);
  };
  A.apigeo = function (x, W, H, t, c) {
    clear(x, W, H, c.bg); var cyc = t % 11, i;
    x.strokeStyle = 'rgba(170,210,240,.12)'; x.lineWidth = 1; for (i = 0; i < W; i += 24) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, H); x.stroke(); } for (i = 0; i < H; i += 24) { x.beginPath(); x.moveTo(0, i); x.lineTo(W, i); x.stroke(); }
    var road = [[W * .04, H * .72], [W * .25, H * .6], [W * .45, H * .64], [W * .65, H * .42], [W * .96, H * .3]];
    x.strokeStyle = '#8FB3CC'; x.lineWidth = 5; partial(x, road, 1); x.strokeStyle = c.bg; x.lineWidth = 1; x.setLineDash([8, 8]); partial(x, road, 1); x.setLineDash([]);
    x.strokeStyle = 'rgba(143,179,204,.4)'; x.lineWidth = 3; partial(x, [[W * .3, H * .05], [W * .38, H * .4], [W * .45, H * .64], [W * .5, H * .95]], 1);
    var pin = [W * .56, H * .36], drop = ease(cyc / 1.2), py = pin[1] - (1 - drop) * H * .5, snap = [W * .6, H * .475];
    if (cyc > 1.2) { var rr = ease((cyc - 1.2) / 1.6) * H * .2; x.strokeStyle = c.acc; x.lineWidth = 1.5; x.setLineDash([4, 4]); x.beginPath(); x.arc(pin[0], pin[1], rr, 0, 7); x.stroke(); x.setLineDash([]); x.fillStyle = 'rgba(242,194,48,.08)'; x.fill(); }
    if (cyc > 2.8) { var k = ease((cyc - 2.8) / .8); x.strokeStyle = c.acc; x.lineWidth = 2; x.beginPath(); x.moveTo(pin[0], pin[1]); x.lineTo(pin[0] + (snap[0] - pin[0]) * k, pin[1] + (snap[1] - pin[1]) * k); x.stroke(); if (k >= 1) { x.fillStyle = '#fff'; x.beginPath(); x.arc(snap[0], snap[1], 4, 0, 7); x.fill(); } }
    if (cyc > 3.6) { var kk = ease((cyc - 3.6) / 2); x.strokeStyle = c.acc; x.lineWidth = 2; var tip = partial(x, [[road[0][0], road[0][1] - 12], [road[1][0], road[1][1] - 12], [road[2][0], road[2][1] - 12], [snap[0] - 4, snap[1] - 12]], kk);
      for (i = 0; i <= 8 * kk; i++) { var f = i / 8, X = road[0][0] + (snap[0] - road[0][0]) * f; x.fillStyle = c.acc; x.fillRect(X, H * .72 - 12 - (H * .72 - snap[1]) * f - (f > .3 && f < .7 ? 10 : 0) - 4, 1, 8); } label(x, 'km', tip[0] + 4, tip[1] - 6, c.acc); }
    x.fillStyle = c.acc; x.beginPath(); x.arc(pin[0], py - 12, 7, Math.PI, 0); x.lineTo(pin[0], py); x.closePath(); x.fill(); x.fillStyle = c.bg; x.beginPath(); x.arc(pin[0], py - 12, 2.5, 0, 7); x.fill();
    if (cyc > 5.8) { var a = ease((cyc - 5.8) / .6), cw = Math.min(210, W * .5), cx = W - cw - 10, cy = 10 + (1 - a) * 20; x.globalAlpha = a; x.fillStyle = '#081a2c'; x.strokeStyle = c.acc; x.lineWidth = 1; x.fillRect(cx, cy, cw, 86); x.strokeRect(cx, cy, cw, 86);
      ['{ "rodovia": "BR-···",', '  "km": "···,·",', EN ? '  "municipality": "···",' : '  "municipio": "···",', EN ? '  "unit": "···",' : '  "unidade": "···",', '  "snv": "' + (EN ? 'current release' : 'edição vigente') + '" }'].forEach(function (s, j) { if (cyc > 6.2 + j * .35) label(x, s, cx + 8, cy + 16 + j * 15, c.fg, 'left', 10.5); }); x.globalAlpha = 1; }
    label(x, EN ? 'generic pin, no real location' : 'pino genérico, nenhuma localização real', 10, H - 10, c.mu);
  };
  A.lakehouse = function (x, W, H, t, c) {
    clear(x, W, H, c.bg); var L = [['#B0703A', 'bronze', EN ? 'raw' : 'bruto'], ['#B9C2CC', EN ? 'silver' : 'prata', EN ? 'validated' : 'validado'], ['#F2C230', EN ? 'gold' : 'ouro', EN ? 'ready to answer' : 'pronto para responder']];
    var cx = W * .4, w = Math.min(W * .3, 150), h = w * .42, gap = H * .24, base = H * .78, cyc = t % 9;
    x.lineWidth = 1;
    L.forEach(function (l, i) { var k = ease((cyc - i * .9) / .9), y = base - i * gap - (1 - k) * 40; x.globalAlpha = k; x.strokeStyle = l[0];
      iso(x, cx, y, w, h, 12, l[0] + '55', l[0] + '33', l[0]); x.globalAlpha = k; label(x, l[1].toUpperCase(), cx + w + 16, y - 2, l[0], 'left', 13); label(x, l[2], cx + w + 16, y + 14, c.mu); x.globalAlpha = 1; });
    for (var i = 0; i < 26; i++) { var f = ((t * .22 + rnd(i)) % 1), lev = Math.floor(f * 3), px = cx + (rnd(i + 40) - .5) * w * 1.1, y = base - f * gap * 2.3; x.fillStyle = L[Math.min(2, lev)][0]; x.globalAlpha = cyc > 2.5 ? .9 : 0; x.fillRect(px, y, 3, 3 + (2 - lev) * 2); }
    x.globalAlpha = 1; if (cyc > 4.5) { var a = ease((cyc - 4.5) / .6); x.globalAlpha = a; x.strokeStyle = c.acc; x.strokeRect(cx - 60, 8, 120, 22); label(x, EN ? '"how many...?"' : '"quantos...?"', cx, 23, c.fg, 'center'); x.globalAlpha = 1; }
    label(x, EN ? 'each layer is audited before the next' : 'cada camada é auditada antes da seguinte', 10, H - 10, c.mu);
  };
  A.rag = function (x, W, H, t, c) {
    clear(x, W, H, c.bg); var cyc = t % 10, i, cy = H * .5;
    for (i = 0; i < 5; i++) { var dx = W * .06 + i * 5, dy = cy - 34 + i * 5; x.fillStyle = '#F3EFE2'; x.fillRect(dx, dy, 44, 58); x.strokeStyle = '#555'; x.strokeRect(dx, dy, 44, 58); } for (i = 0; i < 6; i++) { x.fillStyle = '#999'; x.fillRect(W * .06 + 26, cy - 6 + i * 6, 30, 2); }
    for (i = 0; i < 18; i++) { var k = ease((cyc - .6 - i * .12) / 1), gx = W * .32 + (i % 3) * 30, gy = cy - 48 + Math.floor(i / 3) * 17; x.globalAlpha = k; x.fillStyle = c.card || '#0D2A45'; x.strokeStyle = c.fg; x.fillRect(gx, gy, 24, 11); x.strokeRect(gx, gy, 24, 11); }
    x.globalAlpha = 1; var hit = [3, 8, 13];
    for (i = 0; i < 60; i++) { var k2 = ease((cyc - 3 - rnd(i) * 1.2) / .8), vx = W * .58 + rnd(i + 5) * W * .16, vy = cy - 52 + rnd(i + 9) * 104; x.globalAlpha = k2 * .9; var near = cyc > 5.5 && Math.hypot(vx - (W * .66), vy - cy) < 30; x.fillStyle = near ? c.acc : c.mu; x.beginPath(); x.arc(vx, vy, near ? 3 : 2, 0, 7); x.fill(); }
    x.globalAlpha = 1; if (cyc > 5.2) { x.strokeStyle = c.acc; x.setLineDash([3, 3]); x.beginPath(); x.arc(W * .66, cy, 30 * ease((cyc - 5.2) / .6), 0, 7); x.stroke(); x.setLineDash([]); }
    if (cyc > 6.4) { var a = ease((cyc - 6.4) / .5), bx = W * .8; x.globalAlpha = a; x.strokeStyle = c.acc; x.strokeRect(bx, cy - 30, W * .17, 60); for (i = 0; i < 4; i++) if (cyc > 6.8 + i * .3) { x.fillStyle = c.fg; x.fillRect(bx + 6, cy - 20 + i * 11, (W * .17 - 12) * (i === 3 ? .5 : 1), 3); } x.globalAlpha = 1; }
    [EN ? 'documents' : 'documentos', EN ? 'chunks' : 'trechos', EN ? 'vectors' : 'vetores', EN ? 'answer + source' : 'resposta + fonte'].forEach(function (s, j) { label(x, s, [W * .06, W * .32, W * .58, W * .8][j], H - 12, c.mu, 'left', 10); });
  };
  A.risco = function (x, W, H, t, c) {
    clear(x, W, H, c.bg); var n = 40, cy = H * .55, sweep = (t * .12) % 1.2;
    x.strokeStyle = c.rule; x.lineWidth = 6; x.beginPath(); x.moveTo(10, cy); x.lineTo(W - 10, cy); x.stroke();
    for (var i = 0; i < n; i++) { var X = 14 + i * (W - 28) / n, on = sweep * W > X, a = (Math.sin(i * .5) + 1) / 2 * rnd(i) + .08, b = (Math.cos(i * .33 + 1) + 1) / 2 * rnd(i + 50) + .08; if (!on) continue;
      x.fillStyle = c.acc; x.fillRect(X, cy - 5 - a * H * .36, (W - 28) / n - 2, a * H * .36); x.fillStyle = '#EC6A52'; x.fillRect(X, cy + 5, (W - 28) / n - 2, b * H * .3); }
    label(x, EN ? 'observed risk' : 'risco observado', 12, 16, c.acc); label(x, EN ? 'latent risk' : 'risco latente', 12, H - 26, '#EC6A52'); label(x, EN ? 'illustration, not real data' : 'ilustração, sem dados reais', W - 10, H - 10, c.mu, 'right', 10);
  };
  A.od = function (x, W, H, t, c) {
    clear(x, W, H, c.bg); var P = fit(MG, W, H, 16); x.strokeStyle = c.mu; x.lineWidth = 1.2; poly(x, MG, P, true); x.stroke(); x.fillStyle = 'rgba(194,51,42,.04)'; x.fill();
    var ks = Object.keys(MGC), pairs = [], i, j; for (i = 0; i < ks.length; i++) for (j = i + 1; j < ks.length; j++) if (rnd(i * 17 + j) > .58 || ks[i] === 'BH') pairs.push([ks[i], ks[j]]);
    var cyc = t % 14;
    pairs.forEach(function (p, n) { var a = P(MGC[p[0]]), b = P(MGC[p[1]]), k = ease((cyc - n * .12) / 1.5); if (k <= 0) return;
      var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, d = Math.hypot(b[0] - a[0], b[1] - a[1]), cx = mx - (b[1] - a[1]) * .22, cy2 = my + (b[0] - a[0]) * .22 - d * .1;
      x.strokeStyle = n % 3 ? c.acc : '#1F6F78'; x.globalAlpha = .28 + rnd(n) * .4; x.lineWidth = .8 + rnd(n + 3) * 3.2 * (p[0] === 'BH' ? 1.5 : 1); x.beginPath(); x.moveTo(a[0], a[1]);
      var steps = Math.floor(24 * k); for (var s = 1; s <= steps; s++) { var f = s / 24; x.lineTo((1 - f) * (1 - f) * a[0] + 2 * (1 - f) * f * cx + f * f * b[0], (1 - f) * (1 - f) * a[1] + 2 * (1 - f) * f * cy2 + f * f * b[1]); } x.stroke(); });
    x.globalAlpha = 1; ks.forEach(function (k) { var p = P(MGC[k]); x.fillStyle = c.fg; x.beginPath(); x.arc(p[0], p[1], k === 'BH' ? 4 : 2.5, 0, 7); x.fill(); });
    label(x, EN ? 'desire lines (schematic)' : 'linhas de desejo (esquema)', 10, H - 10, c.mu);
  };
  A.cenarios = function (x, W, H, t, c) {
    clear(x, W, H, c.bg); var P = fit(MG, W, H, 16); x.strokeStyle = c.mu; x.lineWidth = 1; poly(x, MG, P, true); x.stroke();
    var Y = [2023, 2030, 2035, 2045, 2055], cyc = (t % 15) / 3, yi = Math.min(4, Math.floor(cyc)), fr = cyc - yi, g = (yi + ease(fr)) / 4;
    MGE.forEach(function (e, i) { var ab = e.split('-'), a = P(MGC[ab[0]]), b = P(MGC[ab[1]]), w = 1.2 + (rnd(i) * 3 + 1) * (0.5 + g * 1.6), dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l;
      x.fillStyle = i % 4 === 0 ? '#1F6F78' : c.acc; x.globalAlpha = .75; x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.lineTo(b[0] + nx * w, b[1] + ny * w); x.lineTo(a[0] + nx * w, a[1] + ny * w); x.closePath(); x.fill(); x.globalAlpha = 1; x.strokeStyle = c.fg; x.lineWidth = .6; x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); });
    var bw = Math.min(260, W - 20), bx = W - bw - 10; x.strokeStyle = c.mu; x.beginPath(); x.moveTo(bx, 22); x.lineTo(bx + bw, 22); x.stroke();
    Y.forEach(function (y, i) { var X = bx + bw * i / 4; x.fillStyle = i <= yi ? c.acc : c.mu; x.beginPath(); x.arc(X, 22, i === yi ? 5 : 3, 0, 7); x.fill(); label(x, String(y), X, 12, i === yi ? c.fg : c.mu, 'center', 10); });
    label(x, EN ? 'network loading by horizon (schematic)' : 'carregamento da rede por horizonte (esquema)', 10, H - 10, c.mu);
  };
  A.bacias = function (x, W, H, t, c) {
    clear(x, W, H, c.bg); var cyc = t % 12, B = [[.17, .4, .13], [.4, .3, .11], [.62, .46, .14], [.83, .32, .11], [.32, .72, .12], [.72, .76, .12]];
    x.strokeStyle = 'rgba(79,167,224,.5)'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, H * .55); x.bezierCurveTo(W * .3, H * .5, W * .5, H * .62, W, H * .56); x.stroke();
    B.forEach(function (b, i) { var cx = b[0] * W, cy = b[1] * H, r = b[2] * Math.min(W, H * 1.6), dry = i < 3 ? ease((cyc - 1 - i * .7) / 2.5) : 0, alt = i >= 3 && cyc > 6 + (i - 3) * .9;
      x.beginPath(); for (var a = 0; a <= 24; a++) { var an = a / 24 * Math.PI * 2, rr = r * (0.8 + 0.25 * rnd(i * 31 + (a % 24))); var px = cx + Math.cos(an) * rr, py = cy + Math.sin(an) * rr * .8; if (a) x.lineTo(px, py); else x.moveTo(px, py); } x.closePath();
      x.fillStyle = dry > 0 ? 'rgba(' + Math.round(79 + 110 * dry) + ',' + Math.round(167 - 30 * dry) + ',' + Math.round(224 - 150 * dry) + ',' + (.5 - dry * .25) + ')' : 'rgba(79,167,224,.42)'; x.fill(); x.strokeStyle = alt ? c.acc : c.mu; x.lineWidth = alt ? 2.5 : 1; x.stroke();
      if (dry > .6) { x.strokeStyle = 'rgba(120,80,40,.8)'; x.lineWidth = 1; for (var k = 0; k < 4; k++) { x.beginPath(); x.moveTo(cx + (rnd(i + k) - .5) * r, cy + (rnd(i + k + 3) - .5) * r * .7); x.lineTo(cx + (rnd(i + k + 6) - .5) * r, cy + (rnd(i + k + 9) - .5) * r * .7); x.stroke(); } label(x, EN ? 'deficit' : 'déficit', cx, cy + 4, '#fff', 'center', 10); }
      if (alt) { x.shadowColor = c.acc; x.shadowBlur = 14; x.fillStyle = c.acc; x.beginPath(); x.arc(cx, cy, 5 + Math.sin(t * 5) * 1.5, 0, 7); x.fill(); x.shadowBlur = 0; label(x, EN ? 'alternative' : 'alternativa', cx, cy - 12, c.fg, 'center', 10); } });
    label(x, EN ? 'catchments dry up, alternatives light up (schematic)' : 'bacias secam, alternativas acendem (esquema)', 10, H - 10, c.mu);
  };
  A.curva = function (x, W, H, t, c) {
    clear(x, W, H, c.bg); var ox = 44, oy = H - 34, w = W - ox - 20, h = oy - 20, cyc = t % 9;
    x.strokeStyle = c.mu; x.lineWidth = 1; x.beginPath(); x.moveTo(ox, 16); x.lineTo(ox, oy); x.lineTo(W - 14, oy); x.stroke(); label(x, EN ? 'stage h' : 'cota h', 8, 14, c.mu, 'left', 10); label(x, EN ? 'discharge Q' : 'vazão Q', W - 14, H - 12, c.mu, 'right', 10);
    function f(q) { return Math.pow(q, .5); }
    for (var i = 0; i < 16; i++) { var q = .06 + rnd(i) * .9, k = ease((cyc - i * .18) / .4); x.globalAlpha = k; x.fillStyle = c.fg; x.beginPath(); x.arc(ox + q * w, oy - (f(q) + (rnd(i + 20) - .5) * .09) * h, 3.5, 0, 7); x.fill(); }
    x.globalAlpha = 1; if (cyc > 3.2) { var kk = ease((cyc - 3.2) / 2); x.strokeStyle = c.acc; x.lineWidth = 2.5; x.beginPath(); for (var s = 0; s <= 50 * kk; s++) { var qq = s / 50; if (s) x.lineTo(ox + qq * w, oy - f(qq) * h); else x.moveTo(ox, oy); } x.stroke(); if (kk >= 1) label(x, 'Q = a (h - h0)^b', ox + w * .45, oy - h * .35, c.acc, 'left', 12); }
    label(x, EN ? 'rating curve (schematic, no measured values)' : 'curva-chave (esquema, sem valores medidos)', ox, 12 + 0, 'transparent');
  };
  A.shap = function (x, W, H, t, c) {
    clear(x, W, H, c.bg); var cyc = t % 12, rows = 7, ox = W * .3, w = W * .62, y0 = 26, gh = (H - 60) / rows;
    x.strokeStyle = c.mu; x.lineWidth = 1; x.beginPath(); x.moveTo(ox + w / 2, 16); x.lineTo(ox + w / 2, H - 30); x.stroke();
    for (var r = 0; r < rows; r++) { var y = y0 + r * gh + gh / 2, spread = (1 - r / rows) * .9 + .12; x.fillStyle = c.mu; x.fillRect(W * .04, y - 3, W * .2 * (1 - r * .09), 6);
      for (var i = 0; i < 46; i++) { var k = ease((cyc - r * .5 - rnd(i + r * 50) * 1.4) / .6); if (k <= 0) continue; var v = (rnd(i * 3 + r * 7) - .5) * spread, hi = rnd(i * 5 + r) > .5 ? 1 : 0, sgn = (r % 2 ? 1 : -1) * (hi ? 1 : -1);
        var px = ox + w / 2 + (Math.abs(v) * sgn * .9 + (rnd(i + r) - .5) * .08) * w * k, py = y + (rnd(i * 11 + r) - .5) * gh * .6; x.globalAlpha = .85; x.fillStyle = hi ? '#C2332A' : '#25408F'; x.beginPath(); x.arc(px, py, 2.4, 0, 7); x.fill(); } }
    x.globalAlpha = 1; label(x, EN ? 'climate variable x month' : 'variável climática x mês', W * .04, 16, c.mu, 'left', 10); label(x, EN ? 'pushes forecast down' : 'puxa a previsão para baixo', ox, H - 14, '#25408F', 'left', 10); label(x, EN ? 'pushes it up' : 'puxa para cima', ox + w, H - 14, '#C2332A', 'right', 10);
    label(x, EN ? 'own schematic, not thesis figures' : 'esquema próprio, não são figuras da tese', W - 8, 14, c.mu, 'right', 9);
  };
  A.metodo = function (x, W, H, t, c) {
    clear(x, W, H, c.bg); var S = EN ? ['satellite', 'climate series', 'features by month', 'tree boosting', 'forecast'] : ['satélite', 'séries de clima', 'atributos por mês', 'boosting de árvores', 'previsão'];
    var n = S.length, bw = Math.min(120, (W - 30) / n - 10), gap = (W - 20 - bw * n) / (n - 1), cy = H * .5, cyc = t % 10;
    S.forEach(function (s, i) { var X = 10 + i * (bw + gap), k = ease((cyc - i * 1.1) / .7); x.globalAlpha = .25 + k * .75; x.fillStyle = c.bg; x.strokeStyle = i === 3 ? c.acc : c.fg; x.lineWidth = 1.5; x.fillRect(X, cy - 34, bw, 68); x.strokeRect(X, cy - 34, bw, 68);
      var j; if (i === 0) { x.beginPath(); x.arc(X + bw / 2, cy - 6, 12, 0, 7); x.stroke(); x.strokeRect(X + bw / 2 - 24, cy - 9, 8, 6); x.strokeRect(X + bw / 2 + 16, cy - 9, 8, 6); }
      if (i === 1) { x.beginPath(); for (j = 0; j <= 20; j++) { var yy = cy - 6 + Math.sin(j * .9 + t * 2) * 9 * rnd(j); if (j) x.lineTo(X + 8 + j * (bw - 16) / 20, yy); else x.moveTo(X + 8, yy); } x.stroke(); }
      if (i === 2) for (j = 0; j < 24; j++) { x.fillStyle = 'rgba(37,64,143,' + (.15 + rnd(j + Math.floor(t)) * .7) + ')'; x.fillRect(X + 8 + (j % 8) * ((bw - 16) / 8), cy - 22 + Math.floor(j / 8) * 9, (bw - 16) / 8 - 1, 8); }
      if (i === 3) { [[0, -20, -18, -4], [0, -20, 18, -4], [-18, -4, -26, 10], [-18, -4, -10, 10], [18, -4, 10, 10], [18, -4, 26, 10]].forEach(function (l) { x.beginPath(); x.moveTo(X + bw / 2 + l[0], cy + l[1]); x.lineTo(X + bw / 2 + l[2], cy + l[3]); x.stroke(); }); }
      if (i === 4) for (j = 0; j < 5; j++) { x.fillStyle = c.acc; var bh = (8 + rnd(j) * 22) * k; x.fillRect(X + 12 + j * ((bw - 24) / 5), cy + 10 - bh, (bw - 24) / 5 - 2, bh); }
      x.globalAlpha = 1; label(x, s, X + bw / 2, cy + 50, c.fg, 'center', W < 500 ? 8 : 10);
      if (i < n - 1) { var f = ((t * .7) % 1); x.fillStyle = c.acc; x.fillRect(X + bw + gap * f - 2, cy - 2, 5, 4); x.strokeStyle = c.mu; x.lineWidth = 1; x.beginPath(); x.moveTo(X + bw, cy); x.lineTo(X + bw + gap, cy); x.stroke(); } });
  };
  function raster(pal, lab) { return function (x, W, H, t, c) {
    clear(x, W, H, c.bg); var cs = Math.max(10, Math.round(W / 46)), cols = Math.ceil(W / cs), rows = Math.ceil((H - 22) / cs), sweep = ((t * .16) % 1.25) * (cols + rows);
    for (var r = 0; r < rows; r++) for (var q = 0; q < cols; q++) { var v = (Math.sin(q * .31 + 1) + Math.cos(r * .37) + Math.sin((q + r) * .17 + 2)) / 3 + (rnd(q * 57 + r) - .5) * .25, cl = v < -.25 ? 0 : v < .05 ? 1 : v < .35 ? 2 : 3, on = q + r < sweep;
      x.fillStyle = on ? pal[cl] : 'rgba(128,128,128,' + (.08 + (v + 1) * .1) + ')'; x.fillRect(q * cs, r * cs, cs - 1, cs - 1); }
    x.fillStyle = c.bg; x.fillRect(0, H - 22, W, 22); label(x, (EN ? lab[1] : lab[0]), 10, H - 8, c.mu); }; }
  A.zoneamento = raster(['#B0402C', '#E3B45D', '#9CC56A', '#2F7D4F'], ['célula a célula: inapto, restrito, apto, preferencial (esquema)', 'cell by cell: unsuitable, restricted, suitable, preferred (schematic)']);
  A.usosolo = raster(['#23688A', '#E3B45D', '#7BC462', '#2F7D4F'], ['classificação do uso do solo, pixel a pixel (esquema)', 'land-use classification, pixel by pixel (schematic)']);
  A.grade = raster(['#14324a', '#1F6F78', '#2DC699', '#F6C744'], ['previsão por célula da grade, abaixo do município (esquema)', 'forecast per grid cell, below municipality level (schematic)']);
  A.licit = function (x, W, H, t, c) {
    clear(x, W, H, c.bg); var gx = W * .52;
    for (var i = 0; i < 22; i++) { var f = ((t * .12 + rnd(i)) % 1), y = 14 + rnd(i + 7) * (H - 50), ok = rnd(i + 3) > .72, X = f * W; if (X > gx && !ok) { x.globalAlpha = Math.max(0, 1 - (X - gx) / 60); y += (X - gx) * .8; } else x.globalAlpha = 1;
      x.fillStyle = X > gx && ok ? c.acc : '#cfd2ea'; x.fillRect(X, y, 16, 20); x.fillStyle = c.bg; x.fillRect(X + 3, y + 4, 10, 2); x.fillRect(X + 3, y + 9, 10, 2); x.fillRect(X + 3, y + 14, 6, 2); }
    x.globalAlpha = 1; x.strokeStyle = c.acc; x.lineWidth = 2; x.setLineDash([6, 5]); x.beginPath(); x.moveTo(gx, 6); x.lineTo(gx, H - 24); x.stroke(); x.setLineDash([]);
    label(x, EN ? 'published notices' : 'editais publicados', 10, H - 8, c.mu); label(x, EN ? 'what fits the company' : 'o que serve para a empresa', W - 10, H - 8, c.acc, 'right');
  };
  A.relevo = function (x, W, H, t, c) {
    clear(x, W, H, '#E9E2CF'); var lx = Math.cos(t * .5), ly = Math.sin(t * .5), cs = Math.max(6, Math.round(W / 70));
    function z(q, r) { var dx = q - W * .55, dy = r - H * .5, d = Math.hypot(dx, dy * 1.3) / (H * .38); return Math.exp(-d * d * 1.2) * -1.2 + Math.exp(-Math.pow(d - 1, 2) * 9) * 1.1 + Math.sin(q * .02) * .1 + Math.cos(r * .03) * .1; }
    for (var r = 0; r < H; r += cs) for (var q = 0; q < W; q += cs) { var e = z(q, r), gx = z(q + cs, r) - e, gy = z(q, r + cs) - e, sh = .5 + (gx * lx + gy * ly) * 4, d = Math.hypot(q - W * .55, (r - H * .5) * 1.3) / (H * .38);
      x.fillStyle = d < .62 ? 'rgb(' + Math.round(30 + sh * 20) + ',' + Math.round(90 + sh * 30) + ',' + Math.round(140 + sh * 40) + ')' : 'rgb(' + Math.round(150 + sh * 80) + ',' + Math.round(130 + sh * 75) + ',' + Math.round(95 + sh * 60) + ')'; x.fillRect(q, r, cs, cs); }
    x.strokeStyle = 'rgba(32,38,42,.5)'; x.strokeRect(6, 6, W - 12, H - 12); label(x, EN ? 'old sheet + elevation model + moving light (schematic)' : 'carta antiga + modelo de elevação + luz que gira (esquema)', 12, H - 12, '#20262A', 'left', 10);
  };
  A.tiles = function (x, W, H, t, c, cv) {
    clear(x, W, H, c.bg); var n = +(cv.getAttribute('data-n') || 26), cols = Math.ceil(Math.sqrt(n * W / H)), rows = Math.ceil(n / cols), gw = (W - 20) / cols, gh = (H - 34) / rows, cyc = t % (n * .22 + 4);
    for (var i = 0; i < n; i++) { var k = ease((cyc - i * .22) / .5), X = 10 + (i % cols) * gw, Y = 8 + Math.floor(i / cols) * gh; x.strokeStyle = c.rule; x.strokeRect(X + 3, Y + 3, gw - 6, gh - 6); x.globalAlpha = k; x.fillStyle = i % 5 === 0 ? c.acc : '#25408F'; x.fillRect(X + 3, Y + 3, gw - 6, gh - 6); x.globalAlpha = 1; label(x, String(i + 1), X + gw / 2, Y + gh / 2 + 4, k > .5 ? '#fff' : c.mu, 'center', 11); }
    label(x, cv.getAttribute('data-leg') || '', 10, H - 9, c.mu);
  };
  A.contornos = function (x, W, H, t, c, cv) { // carta topográfica: curvas de nível que se desenham
    if (!cv._f || cv._w !== W) { cv._w = W; var cs = 14, cols = Math.ceil(W / cs) + 1, rows = Math.ceil(H / cs) + 1, F = [], q, r; var hills = []; for (q = 0; q < 9; q++) hills.push([rnd(q) * W, rnd(q + 20) * H, 90 + rnd(q + 40) * 220, .4 + rnd(q + 60)]);
      for (r = 0; r < rows; r++) { F.push([]); for (q = 0; q < cols; q++) { var v = 0; hills.forEach(function (h) { var d = Math.hypot(q * cs - h[0], r * cs - h[1]) / h[2]; v += Math.exp(-d * d) * h[3]; }); F[r].push(v); } }
      var segs = []; for (var L = 0; L < 12; L++) { var lv = .12 + L * .11, list = []; for (r = 0; r < rows - 1; r++) for (q = 0; q < cols - 1; q++) { var a = F[r][q], b = F[r][q + 1], d2 = F[r + 1][q + 1], e = F[r + 1][q], pts = [];
            function ip(v1, v2, x1, y1, x2, y2) { if ((v1 < lv) !== (v2 < lv)) { var f = (lv - v1) / (v2 - v1); pts.push([(x1 + (x2 - x1) * f) * cs, (y1 + (y2 - y1) * f) * cs]); } }
            ip(a, b, q, r, q + 1, r); ip(b, d2, q + 1, r, q + 1, r + 1); ip(e, d2, q, r + 1, q + 1, r + 1); ip(a, e, q, r, q, r + 1); if (pts.length >= 2) list.push(pts); }
        segs.push(list); } cv._f = segs; }
    x.clearRect(0, 0, W, H);
    cv._f.forEach(function (list, L) { var k = ease((t - L * .35) / 1.2); if (k <= 0) return; x.globalAlpha = k * (L % 4 === 0 ? .55 : .28); x.strokeStyle = '#9A6536'; x.lineWidth = L % 4 === 0 ? 1.5 : .8; x.beginPath(); list.forEach(function (p) { x.moveTo(p[0][0], p[0][1]); x.lineTo(p[1][0], p[1][1]); if (p.length === 4) { x.moveTo(p[2][0], p[2][1]); x.lineTo(p[3][0], p[3][1]); } }); x.stroke(); });
    x.globalAlpha = .5 * ease(t / 4); x.strokeStyle = '#23688A'; x.lineWidth = 2; partial(x, [[W * .02, H * .2], [W * .2, H * .32], [W * .36, H * .3], [W * .5, H * .5], [W * .7, H * .56], [W * .98, H * .8]], ease((t - 1) / 5)); x.globalAlpha = 1;
  };
  A.vitrine = function (x, W, H, t, c, cv) { // fundo das vitrines: nuvem de pontos que se organiza
    clear(x, W, H, '#0A0D12'); var m = cv.getAttribute('data-modo') || 'dados', n = 140, k = ease(((t % 12) - 1) / 3);
    for (var i = 0; i < n; i++) { var rx = rnd(i) * W, ry = rnd(i + 200) * H, tx, ty;
      if (m === 'estatistica') { var g = (rnd(i + 5) + rnd(i + 6) + rnd(i + 7) + rnd(i + 8)) / 4; tx = W * (.55 + (g - .5) * .9); ty = H * .9 - rnd(i + 9) * Math.exp(-Math.pow((g - .5) * 6, 2)) * H * .75; }
      else if (m === 'geoestatistica') { var cols = 14; tx = W * .5 + (i % cols) * (W * .45 / cols); ty = H * .15 + Math.floor(i / cols) * (H * .7 / 10); }
      else if (m === 'preditiva') { var f = i / n; tx = W * (.5 + f * .48); ty = H * (.75 - f * .5) + (rnd(i + 3) - .5) * H * .22 * (f > .7 ? 1.8 : 1); }
      else { var cl = i % 3, an = rnd(i + 1) * 6.28, rr = rnd(i + 2) * H * .16; tx = W * [.62, .78, .9][cl] + Math.cos(an) * rr; ty = H * [.35, .68, .3][cl] + Math.sin(an) * rr; }
      var px = rx + (tx - rx) * k, py = ry + (ty - ry) * k; x.fillStyle = m === 'geoestatistica' ? 'hsl(' + (160 + Math.sin(px * .01 + py * .015) * 50) + ',60%,55%)' : c.acc; x.globalAlpha = .7; x.beginPath(); x.arc(px, py, 2.2, 0, 7); x.fill(); }
    x.globalAlpha = k; x.strokeStyle = c.acc; x.lineWidth = 1.5; if (m === 'preditiva') { x.beginPath(); x.moveTo(W * .5, H * .75); x.lineTo(W * .98, H * .25); x.stroke(); x.setLineDash([4, 4]); x.beginPath(); x.moveTo(W * .84, 0); x.lineTo(W * .84, H); x.stroke(); x.setLineDash([]); }
    x.globalAlpha = 1;
  };

  function seqs() { AC.$$('[data-seq]').forEach(function (box) { var im = AC.$$('img', box), cap = box.querySelector('[data-seq-cap]'), i = 0, vis = false;
      function show(n) { i = (n + im.length) % im.length; im.forEach(function (m, k) { m.hidden = k !== i; }); cap.textContent = (i + 1) + '/' + im.length + '  ' + im[i].getAttribute('data-cap'); }
      box.querySelector('[data-seq-next]').addEventListener('click', function () { show(i + 1); }); show(0);
      AC.watch(box, function (on) { vis = on; }); if (!AC.reduced()) setInterval(function () { if (vis && !box.matches(':hover')) show(i + 1); }, 2600); }); }
  document.addEventListener('DOMContentLoaded', function () {
    seqs();
    AC.$$('canvas[data-anim]').forEach(function (cv) {
      var f = A[cv.getAttribute('data-anim')]; if (!f) return; var c = vars(cv); c.card = c.bg;
      var st = AC.stage(cv, function (x, W, H, t) { f(x, W, H, t, c, cv); }, { still: +(cv.getAttribute('data-still') || 7.5) });
      var b = cv.parentNode.querySelector('[data-replay]'); if (b) b.addEventListener('click', function () { st.restart(); });
    });
  });
})();
