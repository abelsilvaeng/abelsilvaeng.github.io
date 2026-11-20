/* pixel.js: motor de pixel art desenhado em código, Fisher (guia) e as cenas dos causos.
   Tudo original: sprites procedurais, paleta limitada, tela lógica de 200 x 112. */
(function () {
  'use strict';
  var AC = window.AC, EN = AC.EN;
  var W = 200, H = 112;
  var C = { sky: '#8FD3F4', night: '#14172E', grass: '#5FAE4B', grass2: '#4E9A40', grass3: '#7BC462', brick: '#B5651D', brick2: '#D98E4A', dirt: '#B98B5A',
    skin: '#E9B48A', skin2: '#C98F66', hair: '#2B1B14', white: '#F4EBD0', black: '#10122B', red: '#D9483B', yellow: '#F6C744', orange: '#EE8A2E', blue: '#3D6FD9',
    green: '#2F7D4F', leaf: '#2E8B3D', leaf2: '#1F6B33', mango: '#F2A73B', grey: '#8D93A8', grey2: '#5A5F78', wood: '#7A4B2A', sand: '#C9A66B', purple: '#3A3F6B', water: '#4FA7E0', cat: '#E8943A', cat2: '#C26F1E', pink: '#F29CB0' };
  var FONT = { A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111', M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100', Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010', U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101', Y: '101101010010010', Z: '111001010100111',
    0: '111101101101111', 1: '010110010010111', 2: '110001010100111', 3: '110001010001110', 4: '101101111001001', 5: '111100110001110', 6: '011100110101010', 7: '111001010010010', 8: '111101111101111', 9: '010101011001110',
    '?': '110001010000010', '!': '010010010000010', '.': '000000000000010', '-': '000000111000000', '+': '000010111010000', '=': '000111000111000', '/': '001001010100100', ':': '000010000010000', ' ': '000000000000000' };

  function G(ctx) {
    var g = {
      ctx: ctx,
      r: function (x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); },
      a: function (v) { ctx.globalAlpha = v; },
      line: function (x0, y0, x1, y1, c, dash, th) {
        x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
        var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, err = dx - dy, n = 0; th = th || 1;
        ctx.fillStyle = c;
        for (;;) { if (!dash || (n % (dash * 2)) < dash) ctx.fillRect(x0, y0, th, th); n++; if (x0 === x1 && y0 === y1) break; var e2 = 2 * err; if (e2 > -dy) { err -= dy; x0 += sx; } if (e2 < dx) { err += dx; y0 += sy; } }
      },
      circ: function (cx, cy, rad, c) { ctx.fillStyle = c; for (var y = -rad; y <= rad; y++) { var w = Math.round(Math.sqrt(rad * rad - y * y)); ctx.fillRect(Math.round(cx - w), Math.round(cy + y), w * 2, 1); } },
      text: function (s, x, y, c, sc) { sc = sc || 1; s = String(s).toUpperCase(); ctx.fillStyle = c; for (var i = 0; i < s.length; i++) { var f = FONT[s[i]] || FONT[' ']; for (var k = 0; k < 15; k++) if (f[k] === '1') ctx.fillRect(Math.round(x + (i * 4 + k % 3) * sc), Math.round(y + Math.floor(k / 3) * sc), sc, sc); } },
      bubble: function (s, x, y, c) { var w = String(s).length * 4 + 3; g.r(x - 1, y - 1, w + 2, 9, C.black); g.r(x, y, w, 7, C.white); g.r(x + 2, y + 7, 2, 2, C.white); g.text(s, x + 2, y + 1, c || C.black); },
      person: function (x, y, o) {
        o = o || {}; var f = o.walk ? Math.floor(o.walk) % 2 : 0, sk = o.skin || C.skin, pants = o.pants || C.purple, shirt = o.shirt || C.blue;
        if (o.cape) { g.r(x, y + 5, 8, 7 + f, o.cape); g.r(x - 1, y + 9, 10, 3 + f, o.cape); }
        g.r(x + 1, y + 10, 2, 3 - f, pants); g.r(x + 5, y + 10, 2, 2 + f, pants);
        g.r(x + 1, y + 13 - f, 2, 1, C.black); g.r(x + 5, y + 12 + f, 2, 1, C.black);
        g.r(x + 1, y + 5, 6, 5, shirt);
        if (o.coat) { g.r(x + 1, y + 5, 2, 7, C.white); g.r(x + 5, y + 5, 2, 7, C.white); }
        if (o.overall) { g.r(x + 2, y + 6, 4, 4, o.overall); g.r(x + 2, y + 5, 1, 1, o.overall); g.r(x + 5, y + 5, 1, 1, o.overall); }
        if (o.armsUp) { g.r(x, y + 2, 1, 4, shirt); g.r(x + 7, y + 2, 1, 4, shirt); g.r(x, y + 1, 1, 1, sk); g.r(x + 7, y + 1, 1, 1, sk); }
        else { g.r(x, y + 5, 1, 4, shirt); g.r(x + 7, y + 5, 1, 4, shirt); g.r(x, y + 9, 1, 1, sk); g.r(x + 7, y + 9, 1, 1, sk); }
        g.r(x + 1, y, 6, 5, sk);
        if (o.hair !== false) { g.r(x + 1, y, 6, 2, o.hair || C.hair); if (o.long) { g.r(x, y + 1, 1, 6, o.hair || C.hair); g.r(x + 7, y + 1, 1, 6, o.hair || C.hair); } }
        if (o.big) { g.r(x, y - 2, 8, 3, o.hair || C.hair); g.r(x + 1, y - 3, 6, 1, o.hair || C.hair); }
        g.r(x + 2, y + 2, 1, 1, C.black); g.r(x + 5, y + 2, 1, 1, C.black);
        if (o.glasses) { g.r(x + 1, y + 2, 6, 1, C.black); g.r(x + 2, y + 2, 1, 1, '#9AD8FF'); g.r(x + 5, y + 2, 1, 1, '#9AD8FF'); }
        if (o.beard) { g.r(x + 1, y + 3, 6, 2, C.hair); g.r(x + 3, y + 3, 2, 1, sk); }
        if (o.hat === 'straw') { g.r(x - 1, y, 10, 1, C.yellow); g.r(x + 1, y - 2, 6, 2, '#E0A92E'); }
        if (o.hat === 'cap') { g.r(x + 1, y - 1, 6, 2, C.red); g.r(x + 5, y, 4, 1, C.red); }
        if (o.hat === 'top') { g.r(x, y, 8, 1, C.black); g.r(x + 1, y - 4, 6, 4, C.black); g.r(x + 1, y - 1, 6, 1, C.red); }
        if (o.hat === 'helmet') { g.r(x + 1, y - 1, 6, 3, C.black); g.r(x + 2, y + 2, 5, 1, '#9AD8FF'); }
        if (o.ears) { g.r(x + 1, y - 2, 1, 2, C.black); g.r(x + 6, y - 2, 1, 2, C.black); g.r(x + 1, y, 6, 3, C.black); g.r(x + 2, y + 2, 1, 1, C.white); g.r(x + 5, y + 2, 1, 1, C.white); }
      },
      // gato de lado (olhando para a direita)
      cat: function (x, y, t, o) {
        o = o || {}; var wag = Math.sin(t * 5) > 0 ? 0 : 1;
        g.r(x + 2, y + 3, 8, 4, C.cat); g.r(x + 8, y + 1, 4, 4, C.cat); g.r(x + 8, y, 1, 1, C.cat); g.r(x + 11, y, 1, 1, C.cat);
        g.r(x + 1, y + 1 + wag, 1, 3, C.cat); g.r(x, y + wag, 1, 2, C.cat2);
        g.r(x + 3, y + 7, 1, 1, C.cat); g.r(x + 8, y + 7, 1, 1, C.cat);
        g.r(x + 4, y + 3, 1, 2, C.cat2); g.r(x + 6, y + 3, 1, 2, C.cat2); g.r(x + 10, y + 2, 1, 1, C.black); g.r(x + 11, y + 4, 1, 1, C.pink);
      },
      tree: function (cx, cy, rad, fruit, t) {
        g.circ(cx + 2, cy + 3, rad, C.leaf2); g.circ(cx, cy, rad, C.leaf); g.circ(cx - rad / 3, cy - rad / 3, rad / 2, '#3FA552');
        if (fruit) for (var i = 0; i < 7; i++) { var a = i * 2.3 + 1, rr = rad * (0.3 + (i % 3) * 0.22); g.r(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 2, 3, C.mango); }
      },
      stars: function (n, t, hmax) { for (var i = 0; i < n; i++) { var x = (i * 73) % W, y = (i * 37) % (hmax || 60); if ((i + Math.floor(t * 2)) % 7) g.r(x, y, 1, 1, i % 5 ? '#cfd2ea' : C.yellow); } },
      speckle: function (y0, y1, c, step) { for (var y = y0; y < y1; y += step) for (var x = (y * 7) % step; x < W; x += step + (y % 3)) g.r(x, y, 1, 1, c); }
    };
    return g;
  }
  function lerp(a, b, k) { k = Math.max(0, Math.min(1, k)); return a + (b - a) * k; }

  // ---------- Cenas ----------
  var S = {};
  S.jardineiro = function (g, t, st, ts) {
    g.r(0, 0, W, H, C.grass); g.speckle(0, H, C.grass2, 9); g.speckle(4, H, C.grass3, 13);
    var K = { x: 168, y: 26 };            // o canto escondido
    var A0 = { x: 6, y: 12 }, B0 = { x: 194, y: 104 };
    function wall(p, q) { g.line(p.x, p.y + 3, q.x, q.y + 3, '#5d3410', 0, 4); g.line(p.x, p.y, q.x, q.y, C.brick, 0, 4); g.line(p.x, p.y - 1, q.x, q.y - 1, C.brick2, 0, 2); g.line(p.x, p.y - 4, q.x, q.y - 4, C.grey, 2, 1); g.line(p.x, p.y - 6, q.x, q.y - 6, C.grey, 0, 1); }
    wall(A0, K); wall(K, B0);
    // grama cortada em montes
    for (var i = 0; i < 6; i++) g.r(14 + i * 13, 58 + (i % 2) * 22, 5, 2, '#B7D97A');
    // piquete e teodolito
    var T = { x: 112, y: 84 };
    g.line(T.x, T.y, T.x - 5, T.y + 9, C.wood); g.line(T.x, T.y, T.x + 5, T.y + 9, C.wood); g.line(T.x, T.y, T.x, T.y + 10, C.wood);
    g.r(T.x - 3, T.y - 5, 7, 5, C.yellow); g.r(T.x + 3, T.y - 4, 3, 2, C.black); g.r(T.x - 1, T.y + 10, 3, 2, C.red);
    // linha de visada bloqueada
    if (st < 2) { g.line(T.x + 4, T.y - 4, K.x - 14, K.y + 18, C.red, 2); if (Math.floor(t * 2) % 2) g.text('X', K.x - 18, K.y + 12, C.red); }
    // alunos
    var bob = Math.floor(t * 2) % 2;
    var al = [[92, 74, C.red], [126, 92, C.blue], [136, 70, '#9B59B6']];
    al.forEach(function (a, i) { g.person(a[0], a[1], { shirt: a[2], hair: i === 1 ? '#6b3a1a' : C.hair, long: i === 2 }); });
    // geometria: dois pontos por muro e o prolongamento
    if (st >= 2) {
      var k = st > 2 ? 1 : Math.min(1, ts / 2.2);
      function pt(p, q, f) { return { x: lerp(p.x, q.x, f), y: lerp(p.y, q.y, f) }; }
      var a1 = pt(A0, K, .45), a2 = pt(A0, K, .72), b1 = pt(B0, K, .4), b2 = pt(B0, K, .68);
      [a1, a2, b1, b2].forEach(function (p) { g.r(p.x - 1, p.y - 2, 3, 5, C.white); g.r(p.x - 1, p.y - 1, 3, 2, C.red); });
      var ea = pt(a2, K, k), eb = pt(b2, K, k);
      g.tree(K.x - 6, K.y + 8, 21, true, t);
      g.a(.55); g.r(K.x - 28, K.y - 14, 46, 46, C.grass); g.a(1); g.tree(K.x - 6, K.y + 8, 21, true, t); g.a(1);
      g.a(.45); g.circ(K.x - 6, K.y + 8, 21, C.leaf); g.a(1);
      g.line(a1.x, a1.y, ea.x, ea.y, C.white, 2); g.line(b1.x, b1.y, eb.x, eb.y, C.white, 2);
      if (k >= 1) { if (Math.floor(t * 3) % 2) g.circ(K.x, K.y, 3, C.yellow); g.r(K.x - 1, K.y - 1, 3, 3, C.red); g.bubble(EN ? 'ANGLE!' : 'ANGULO!', K.x - 44, K.y - 22, C.red); }
    } else g.tree(K.x - 6, K.y + 8, 21, true, t);
    // jardineiro
    var gx, gy, walk = 0, o = { hat: 'straw', shirt: '#E6E0C8', overall: C.green, beard: true, glasses: true };
    if (st === 0) { gx = 30 + Math.sin(t * 1.4) * 5; gy = 66; walk = t * 3; }
    else if (st === 1) { var k1 = Math.min(1, ts / 1.6); gx = lerp(30, 76, k1); gy = lerp(66, 80, k1); walk = k1 < 1 ? t * 6 : 0; }
    else if (st === 2) { gx = 76; gy = 80; }
    else { var k3 = Math.min(1, ts / 4); gx = lerp(76, -14, k3); gy = lerp(80, 40, k3); walk = t * 6; }
    if (st < 4) {
      // sombra com orelhas de morcego no muro (só na saída)
      if (st === 3 && gx > -8) { var sx = gx + 10, sy = lerp(A0.y, K.y, (sx - A0.x) / (K.x - A0.x)) - 2; g.a(.55); g.r(sx, sy - 2, 8, 9, C.black); g.r(sx, sy - 5, 2, 3, C.black); g.r(sx + 6, sy - 5, 2, 3, C.black); g.r(sx - 3, sy + 2, 14, 5, C.black); g.a(1); }
      g.person(gx, gy, { hat: o.hat, shirt: o.shirt, overall: o.overall, beard: true, glasses: true, walk: walk });
      var rk = st === 0 ? Math.sin(t * 6) * 3 : 0;
      g.line(gx + 8, gy + 6, gx + 15 + rk, gy + 14, C.wood); g.r(gx + 13 + rk, gy + 14, 5, 1, C.grey2); for (var d = 0; d < 3; d++) g.r(gx + 13 + rk + d * 2, gy + 15, 1, 2, C.grey2);
    }
    if (st === 0) al.forEach(function (a, i) { if ((Math.floor(t * 1.5) + i) % 3) g.bubble('?', a[0] + 1, a[1] - 11 - bob); });
    if (st === 1 && ts > 1.6) g.bubble('!', gx + 1, gy - 14, C.green);
    if (st === 3) al.forEach(function (a, i) { g.bubble('!', a[0] + 1, a[1] - 11 - ((bob + i) % 2), C.red); });
    if (st === 4) {
      g.r(0, 0, W, H, '#2A2D4A'); g.r(30, 14, 140, 60, C.wood); g.r(33, 17, 134, 54, '#1F5B3B');
      g.line(60, 60, 110, 30, C.white, 2); g.line(150, 62, 110, 30, C.white, 2); g.circ(110, 30, 2, C.yellow);
      g.text('2015', 40, 22, C.white, 2); g.r(0, 92, W, 20, '#4a3220');
      g.person(96, 76, { coat: true, shirt: C.blue, beard: true, glasses: true, armsUp: Math.floor(t * 2) % 2 === 0 });
      for (var q = 0; q < 6; q++) g.person(24 + q * 30, 96, { shirt: [C.red, C.blue, '#9B59B6', C.orange, C.green, C.grey][q], hair: q % 2 ? '#6b3a1a' : C.hair });
    }
  };
  S.uno = function (g, t, st, ts) {
    g.r(0, 0, W, H, C.night); g.stars(40, t, 60); g.circ(170, 18, 8, '#F4EBD0'); g.circ(173, 16, 7, C.night);
    g.r(0, 78, W, 34, '#23263f'); g.r(0, 84, W, 20, '#3b3e55'); for (var i = 0; i < 8; i++) g.r(((i * 30 - (st === 2 ? t * 80 : 0)) % 240 + 240) % 240 - 20, 93, 14, 2, C.yellow);
    var cx = st === 2 ? 70 + Math.sin(t * 20) * .6 : 70, cy = 66;
    if (st === 2) { for (var p = 0; p < 4; p++) { var px = cx - 8 - ((t * 40 + p * 14) % 56); g.a(.6 - p * .12); g.circ(px, cy + 12 - p, 2 + p % 2, C.grey); } g.a(1); g.text('200 KM', 132 - ((t * 30) % 220), 60, C.yellow); }
    // Uno 1992: caixa de fósforo com rodas
    g.r(cx, cy, 46, 13, C.white); g.r(cx + 8, cy - 9, 26, 9, C.white); g.r(cx + 10, cy - 7, 10, 6, '#7FB8E6'); g.r(cx + 22, cy - 7, 10, 6, '#7FB8E6');
    g.r(cx, cy + 9, 46, 2, C.grey); g.r(cx + 44, cy + 3, 2, 3, C.yellow); g.r(cx, cy + 3, 2, 3, C.red);
    g.circ(cx + 9, cy + 14, 4, C.black); g.circ(cx + 37, cy + 14, 4, C.black); g.circ(cx + 9, cy + 14, 1, C.grey); g.circ(cx + 37, cy + 14, 1, C.grey);
    if (st < 2) { g.line(cx + 34, cy, cx + 47, cy - 10, C.white, 0, 2);
      if (st === 0) { for (var s = 0; s < 3; s++) { g.a(.5); g.circ(cx + 40 + s * 3, cy - 6 - ((t * 10 + s * 6) % 18), 2, C.grey); } g.a(1); g.bubble('?', 128, 54); }
      if (st === 1) for (var f = 0; f < 9; f++) { var h = 4 + ((Math.sin(t * 13 + f * 2.1) + 1) * 5); g.r(cx + 34 + f, cy - h, 1, h, f % 2 ? C.orange : C.red); g.r(cx + 34 + f, cy - h / 2, 1, h / 2, C.yellow); }
      g.person(124, 66, { shirt: C.red, beard: true, glasses: true, armsUp: st === 1 });
      if (st === 1) { g.r(120, 64, 4, 6, C.green); g.line(119, 66, 114, 62 + Math.sin(t * 9) * 2, C.yellow, 1); }
    } else { g.r(cx + 38, cy - 3 + (Math.floor(t * 8) % 2), 4, 3, C.white); g.r(cx + 39, cy - 5 + (Math.floor(t * 8) % 2), 2, 2, C.white); }
  };
  S.fatbob = function (g, t, st, ts) {
    var dusk = st === 2;
    g.r(0, 0, W, H, dusk ? '#F29C6B' : C.sky); if (dusk) { g.r(0, 0, W, 26, '#B8577A'); g.r(0, 26, W, 16, '#DD7A6F'); g.circ(150, 62, 14, C.yellow); }
    for (var m = 0; m < 5; m++) { var mx = ((m * 70 - t * 6) % 320 + 320) % 320 - 60; g.circ(mx, 86, 30, dusk ? '#7A4B6B' : '#7BC49A'); }
    g.r(0, 78, W, 34, dusk ? '#5b4a44' : C.dirt); g.speckle(80, H, dusk ? '#4a3b36' : '#a3764a', 8);
    var x = 84, y = 60;
    function wheel(wx, wy, r) { g.circ(wx, wy, r, C.black); g.circ(wx, wy, r - 2, dusk ? '#5b4a44' : C.dirt); g.circ(wx, wy, 1, C.grey); }
    if (st === 0) { x = 30 + (t * 16) % 150; wheel(x, 76, 3); wheel(x + 9, 76, 3); g.line(x, 76, x + 5, 70, C.red); g.line(x + 5, 70, x + 9, 76, C.red); g.person(x + 1, 58, { shirt: C.yellow, pants: C.blue }); g.bubble(EN ? 'AGE 2' : '2 ANOS', x - 6, 46); }
    else if (st === 1) { var ph = (t * .6) % 1, jx = 20 + ph * 170, jy = 74 - Math.max(0, Math.sin(ph * Math.PI * 3)) * 28;
      for (var r = 0; r < 3; r++) { var rx = 46 + r * 56; for (var k = 0; k < 9; k++) g.r(rx + k, 78 - k, 10 - k, k + 1, '#8a5a34'); }
      wheel(jx, jy, 4); wheel(jx + 12, jy - (jy < 70 ? 3 : 0), 4); g.line(jx, jy, jx + 7, jy - 7, C.blue); g.line(jx + 7, jy - 7, jx + 12, jy, C.blue); g.person(jx + 2, jy - 20, { shirt: C.red, hat: 'helmet', armsUp: jy < 60 }); }
    else { y = 62 + (Math.floor(t * 10) % 2);
      wheel(x, y + 13, 7); wheel(x + 34, y + 13, 7); g.r(x + 4, y + 6, 30, 5, C.sand); g.r(x + 12, y + 1, 12, 6, C.sand); g.r(x + 24, y + 3, 6, 3, C.black); g.line(x + 30, y + 4, x + 36, y - 4, C.grey, 0, 2); g.r(x + 34, y - 6, 4, 2, C.black);
      g.r(x + 6, y + 11, 22, 2, C.grey); g.r(x - 2, y + 9, 10, 2, C.grey); g.circ(x + 38, y + 2, 2, C.yellow);
      g.person(x + 14, y - 12, { shirt: C.black, hat: 'helmet', pants: C.blue });
      for (var d = 0; d < 4; d++) { g.a(.5 - d * .1); g.circ(x - 10 - ((t * 50 + d * 9) % 40), y + 16 - d, 2 + d % 2, '#e8d3b0'); } g.a(1);
      g.text('FAT BOB 2014', 8, 8, C.white); }
  };
  S.radio = function (g, t, st, ts) {
    if (st === 0) {
      g.r(0, 0, W, H, '#3b2f4a'); g.r(0, 86, W, 26, '#2a2136');
      g.r(14, 14, 74, 40, C.wood); g.r(16, 16, 70, 36, '#1F5B3B'); g.text('F=M.A', 20, 20, C.white); g.text('H2O', 56, 30, C.yellow); g.text('X=-B/2A', 20, 40, C.white);
      var on = Math.floor(t * 2) % 2; g.r(126, 12, 50, 13, C.black); g.r(128, 14, 46, 9, on ? C.red : '#6b1f1a'); g.text(EN ? 'ON AIR' : 'NO AR', EN ? 139 : 141, 16, on ? C.white : '#a88');
      g.r(60, 70, 110, 6, C.wood); g.r(64, 76, 4, 14, C.wood); g.r(162, 76, 4, 14, C.wood);
      g.r(110, 54, 2, 16, C.grey); g.circ(111, 52, 4, C.grey2); g.r(109, 49, 5, 6, C.black);
      g.r(130, 58, 22, 12, C.grey2); g.r(132, 60, 18, 8, '#9AD8FF');
      g.person(88, 58, { shirt: C.red, glasses: true, armsUp: on === 1 }); g.person(156, 58, { shirt: C.green, hair: '#6b3a1a' });
      for (var w = 0; w < 3; w++) { var rr = ((t * 14 + w * 12) % 36); g.a(1 - rr / 36); g.line(116 + rr, 44 - rr / 2, 116 + rr, 60 + rr / 2, C.yellow, 2); } g.a(1);
    } else {
      g.r(0, 0, W, H, C.night); g.stars(30, t, 50); g.r(0, 90, W, 22, '#23263f');
      g.r(96, 30, 2, 60, C.grey); g.line(90, 90, 97, 50, C.grey); g.line(104, 90, 97, 50, C.grey); g.circ(97, 28, 2, Math.floor(t * 3) % 2 ? C.red : C.yellow);
      for (var q = 0; q < 4; q++) { var r2 = ((t * 20 + q * 22) % 88); g.a(.9 - r2 / 100); for (var a = 0; a < 40; a++) { var an = a / 40 * Math.PI * 2; g.r(97 + Math.cos(an) * r2, 28 + Math.sin(an) * r2 * .6, 1, 1, C.yellow); } } g.a(1);
      for (var h = 0; h < 6; h++) { var hx = 6 + h * 33 + (h > 2 ? 4 : 0), lit = (t * 1.2) % 7 > h; g.r(hx, 72, 22, 18, ['#7a4b6b', '#4b6b7a', '#6b7a4b'][h % 3]); for (var k = 0; k < 12; k++) g.r(hx - 1 + k, 72 - Math.min(k, 23 - k) / 1.6, 24 - k * 2 > 0 ? 1 : 0, 2, C.brick); g.r(hx - 2, 70, 26, 3, C.brick);
        g.r(hx + 7, 77, 8, 7, lit ? C.yellow : '#10122B'); if (lit) g.text(['Q', 'F', 'M', 'G', 'FI', '+'][h], hx + 8, 62 - (Math.floor(t * 2 + h) % 2), C.white); }
    }
  };
  S.sitio = function (g, t, st, ts) {
    g.r(0, 0, W, H, C.sky); g.circ(176, 16, 9, C.yellow); for (var c = 0; c < 3; c++) { var cx = ((c * 80 + t * 4) % 260) - 30; g.r(cx, 14 + c * 7, 22, 5, C.white); g.r(cx + 5, 11 + c * 7, 12, 4, C.white); }
    g.r(0, 80, W, 32, C.grass); g.speckle(82, H, C.grass2, 9);
    // tanque de peixes
    g.r(6, 62, 54, 26, C.grey2); g.r(8, 64, 50, 22, C.water); for (var f = 0; f < 3; f++) { var fx = 12 + ((t * (6 + f * 3) + f * 17) % 40), fy = 68 + f * 6; g.r(fx, fy, 4, 2, C.orange); g.r(fx - 1, fy, 1, 2, C.red); }
    // cano e carneiro hidráulico
    g.r(60, 82, 24, 2, C.grey); var pulse = st >= 1 && Math.floor(t * 4) % 2;
    g.r(84, 76 - (pulse ? 1 : 0), 12, 10 + (pulse ? 1 : 0), C.grey2); g.circ(90, 72, 4, C.red); g.r(88, 74, 4, 4, C.grey);
    if (pulse) g.text('TOC', 82, 58, C.black);
    g.r(96, 80, 14, 2, C.grey); g.r(108, 34, 2, 48, C.grey); g.r(100, 22, 20, 14, C.blue); g.r(98, 20, 24, 3, C.grey2); g.r(104, 36, 2, 46, C.wood); g.r(114, 36, 2, 46, C.wood);
    if (st >= 1) for (var d = 0; d < 5; d++) g.r(108, 80 - ((t * 30 + d * 10) % 46), 2, 3, '#bfe6ff');
    // gotejamento nos canteiros
    g.r(120, 30, 70, 2, C.grey);
    for (var b = 0; b < 4; b++) { var bx = 128 + b * 16; g.r(bx, 32, 1, 4, C.grey); g.r(bx - 5, 84, 12, 5, C.dirt);
      if (st >= 1) g.r(bx, 38 + ((t * 40 + b * 9) % 44), 1, 2, C.water);
      var grow = st === 0 ? 1 : st === 1 ? 1 + Math.min(4, ts) : 7; g.r(bx, 84 - grow, 1, grow, C.leaf); if (grow > 3) { g.r(bx - 2, 84 - grow, 5, 2, C.leaf); g.r(bx - 1, 82 - grow, 3, 2, '#3FA552'); } if (grow > 6) g.r(bx, 80 - grow + 2, 2, 2, b % 2 ? C.red : C.yellow); }
    // galinha
    var gx = 30 + ((t * 8) % 60), peck = Math.floor(t * 3) % 3 === 0; g.r(gx, 96, 6, 5, C.white); g.r(gx + 5, 93 + (peck ? 3 : 0), 3, 3, C.white); g.r(gx + 8, 94 + (peck ? 3 : 0), 1, 1, C.orange); g.r(gx + 6, 92 + (peck ? 3 : 0), 1, 1, C.red); g.r(gx + 1, 101, 1, 2, C.orange); g.r(gx + 4, 101, 1, 2, C.orange);
    g.person(166, 90, { hat: 'straw', shirt: C.red, beard: true, glasses: true, armsUp: st === 2 && Math.floor(t * 2) % 2 === 0 });
    if (st === 2) g.bubble('MACGYVER', 150, 70, C.green);
  };
  S.eletrosom = function (g, t, st, ts) {
    if (st < 2) {
      var go = st === 1; g.r(0, 0, W, H, C.sky);
      for (var m = 0; m < 4; m++) { var mx = ((m * 90 - (go ? t * 20 : 0)) % 360 + 360) % 360 - 60; g.circ(mx, 92, 40, '#7BC49A'); }
      if (!go) { g.r(0, 22, W, 6, C.grey2); g.r(10, 28, 4, 60, C.grey2); g.r(186, 28, 4, 60, C.grey2); g.r(60, 30, 80, 12, C.black); g.text(EN ? 'BUS STATION' : 'RODOVIARIA', 78, 34, C.yellow); }
      g.r(0, 86, W, 26, '#4a4d63'); for (var i = 0; i < 8; i++) g.r(((i * 30 - (go ? t * 90 : 0)) % 240 + 240) % 240 - 20, 98, 14, 2, C.white);
      var bx = go ? 50 : 70, by = 50 + (go ? Math.floor(t * 9) % 2 : 0);
      g.r(bx, by, 92, 34, C.white); g.r(bx, by + 20, 92, 6, C.red); g.r(bx, by + 26, 92, 8, C.grey); for (var w = 0; w < 6; w++) g.r(bx + 6 + w * 14, by + 5, 10, 10, '#7FB8E6'); g.r(bx + 86, by + 6, 6, 14, '#7FB8E6');
      g.circ(bx + 16, by + 36, 6, C.black); g.circ(bx + 74, by + 36, 6, C.black); g.circ(bx + 16, by + 36, 2, C.grey); g.circ(bx + 74, by + 36, 2, C.grey);
      g.r(bx + 32, by + 26, 24, 8, go ? C.grey2 : C.black);
      if (!go) { var k = Math.min(1, ts / 3), px = lerp(8, bx + 22, k); g.person(px, 74, { shirt: C.yellow, beard: true, glasses: true, walk: k < 1 ? t * 6 : 0 }); g.r(px + 8, 66, 10, 20, C.white); g.r(px + 9, 67, 8, 7, '#dfe7ef'); g.r(px + 16, 70, 1, 3, C.grey2); g.r(px + 16, 78, 1, 4, C.grey2); }
      else { g.r(bx + 34, by + 27, 8, 6, C.white); g.text(EN ? 'COUNTRYSIDE' : 'ZONA RURAL', 120, 20, C.black); }
    } else {
      g.r(0, 0, W, H, '#F2D9A0'); g.r(0, 80, W, 32, C.wood); g.r(0, 78, W, 3, '#5d3410');
      var its = [0, 1, 2];
      its.forEach(function (i) { var k = Math.min(1, Math.max(0, ts - i * .9) / .7), x = 34 + i * 54, y = lerp(-20, 56, k) - (k >= 1 ? Math.abs(Math.sin(t * 3 + i)) * 2 : 0);
        if (i === 0) { g.r(x, y + 8, 24, 12, C.yellow); g.r(x, y + 6, 24, 3, '#F9E08A'); g.circ(x + 6, y + 14, 2, '#E0A92E'); g.circ(x + 16, y + 12, 1, '#E0A92E'); g.circ(x + 19, y + 17, 2, '#E0A92E'); }
        if (i === 1) { g.r(x + 4, y + 4, 16, 18, C.mango); g.r(x + 3, y, 18, 5, C.red); g.r(x + 6, y + 8, 12, 7, C.white); g.text('M', x + 10, y + 9, C.red); }
        if (i === 2) { g.r(x + 2, y + 6, 16, 12, C.white); g.r(x + 14, y, 7, 8, C.white); g.r(x + 21, y + 3, 2, 2, C.orange); g.r(x + 16, y - 2, 3, 2, C.red); g.r(x + 17, y + 2, 1, 1, C.black); g.r(x + 6, y + 18, 1, 4, C.orange); g.r(x + 13, y + 18, 1, 4, C.orange); g.r(x, y + 4, 4, 6, C.white); }
        if (k >= 1) g.text('+1', x + 8, y - 10 - ((t * 6) % 6), C.green, 1); });
      g.text(EN ? 'PAID IN TRUST' : 'PAGO COM CONFIANCA', EN ? 74 : 62, 96, C.white);
    }
  };
  S.banda = function (g, t, st, ts) {
    g.r(0, 0, W, H, '#1a0f24'); g.r(0, 84, W, 28, '#3a2416'); g.r(0, 82, W, 3, '#5d3a22');
    var cols = [C.red, C.yellow, C.blue, C.pink];
    for (var s = 0; s < 4; s++) { var sx = 24 + s * 50, tx = 100 + Math.sin(t * 1.2 + s * 1.7) * 60; g.a(.14); for (var k = 0; k < 14; k++) g.line(sx, 0, tx - 14 + k * 2, 84, cols[s]); g.a(1); g.r(sx - 4, 0, 8, 5, C.grey2); }
    g.r(18, 54, 22, 30, C.black); g.r(20, 56, 18, 12, C.grey2); g.circ(29, 75, 5, C.grey2); g.r(160, 54, 22, 30, C.black); g.circ(171, 62, 4, C.grey2); g.circ(171, 75, 5, C.grey2);
    var x = 92, y = 62, bob = Math.floor(t * 4) % 2;
    g.ctx.save(); g.ctx.translate(-96, -76); g.ctx.scale(2, 2);
    if (st === 0) { g.person(x, y + bob, { hat: 'top', hair: C.hair, long: true, shirt: C.black, pants: C.black }); g.r(x - 1, y + 2 + bob, 10, 3, C.hair); g.r(x + 2, y + 4 + bob, 4, 1, C.skin);
      g.line(x - 6, y + 12 + bob, x + 14, y + 4 + bob, C.wood, 0, 2); g.circ(x - 4, y + 12 + bob, 4, C.orange); g.circ(x - 4, y + 12 + bob, 2, C.yellow);
      for (var n = 0; n < 4; n++) { var ny = 50 - ((t * 14 + n * 12) % 46), nx = 112 + n * 10 + Math.sin(t * 3 + n) * 3; g.r(nx, ny, 3, 2, C.yellow); g.r(nx + 2, ny - 5, 1, 6, C.yellow); }
      g.ctx.restore(); g.text(EN ? 'HOW I SAW MYSELF' : 'COMO EU ME VIA', 66, 98, C.yellow);
    } else if (st === 1) { g.person(x, y, { hair: C.hair, big: true, shirt: C.white, pants: C.black }); g.r(x + 3, y + 5, 2, 2, C.red); g.r(x + 1, y + 5, 2, 5, '#cfd2ea'); g.r(x + 5, y + 5, 2, 5, '#cfd2ea');
      g.r(x + 9, y + 3, 2, 3, C.grey2); g.r(x + 10, y + 6, 1, 4, C.grey);
      for (var p = 0; p < 6; p++) if ((Math.floor(t * 4) + p) % 3 === 0) { var px = x - 12 + p * 7, py = y - 8 + (p % 3) * 5; g.r(px, py, 1, 3, C.white); g.r(px - 1, py + 1, 3, 1, C.white); }
      g.ctx.restore(); g.text(EN ? 'HOW I LOOKED' : 'COMO ME VIAM', 74, 98, C.pink);
    } else { var k = Math.min(1, ts / 2); g.person(x, y, { hair: C.hair, shirt: '#2F7D4F', pants: C.blue, long: k < .5 });
      if (k < 1) for (var h = 0; h < 5; h++) g.r(x - 3 + h * 3, y + 4 + k * 20 + h % 2 * 3, 2, 2, C.hair);
      g.line(x + 14, y - 2, x + 20, y - 8, C.grey); g.line(x + 14, y - 8, x + 20, y - 2, C.grey); g.circ(x + 13, y - 1, 1, C.red); g.circ(x + 13, y - 9, 1, C.red);
      g.r(x + 10, y + 9, 6, 5, C.wood); g.ctx.restore(); g.text('PROMAM', 84, 98, C.white); }
  };
  S.batman = function (g, t, st, ts) {
    g.r(0, 0, W, H, '#20233d'); g.r(0, 88, W, 24, '#3a2f2a');
    g.r(120, 10, 64, 40, C.wood); g.r(123, 13, 58, 34, C.night); for (var sn = 0; sn < 14; sn++) g.r(124 + (sn * 17) % 56, 14 + (sn * 11) % 32, 1, 1, '#cfd2ea'); g.r(120, 10, 64, 3, C.wood); g.r(151, 10, 2, 40, C.wood);
    if (st >= 1) { g.a(.25); for (var k = 0; k < 10; k++) g.line(140, 46, 150 + k * 2, 14, C.yellow); g.a(1); g.circ(160, 22, 8, C.yellow); g.text('FX', 157, 20, C.black); }
    g.r(14, 14, 84, 44, C.wood); g.r(17, 17, 78, 38, '#1F5B3B'); g.text('LIM X-0', 22, 22, C.white); g.text('DY/DX=?', 22, 32, C.white); g.text('Q=C.I.A', 22, 42, C.yellow);
    var bob = Math.floor(t * 2) % 2;
    for (var i = 0; i < 4; i++) { var x = 20 + i * 34; g.person(x, 74, { shirt: [C.red, C.blue, C.orange, '#9B59B6'][i], hair: i % 2 ? '#6b3a1a' : C.hair, long: i === 3 }); g.r(x - 4, 86, 16, 3, C.wood); g.r(x - 3, 89, 2, 8, C.wood); g.r(x + 9, 89, 2, 8, C.wood);
      if (st === 0) { if ((Math.floor(t * 1.5) + i) % 2) g.bubble('?', x + 1, 62 - bob); } else if (st === 2) g.bubble('10', x - 1, 62 - ((bob + i) % 2), C.green); }
    if (st >= 1) { var kx = st === 1 ? lerp(210, 150, Math.min(1, ts / 1.4)) : 104; var fl = Math.floor(t * 6) % 2;
      g.person(kx, 70, { ears: true, shirt: C.grey2, pants: C.grey2, cape: C.black, walk: st === 1 && ts < 1.4 ? t * 6 : fl, armsUp: st === 2 && bob === 0 });
      g.r(kx + 3, 77, 3, 2, C.yellow); if (st === 2) { g.r(kx + 9, 68, 5, 6, C.white); g.line(96, 30, 60, 46, C.yellow, 0); } }
  };

  // ---------- Ícones de conquistas (16 x 16) ----------
  var ICON = {
    livro: function (g) { g.r(2, 3, 12, 10, C.red); g.r(3, 4, 5, 8, C.white); g.r(9, 4, 4, 8, C.white); g.r(8, 3, 1, 10, '#8a1f17'); g.r(4, 6, 3, 1, C.grey); g.r(4, 8, 3, 1, C.grey); g.r(10, 6, 2, 1, C.grey); },
    bike: function (g) { g.circ(4, 11, 3, C.white); g.circ(12, 11, 3, C.white); g.circ(4, 11, 2, '#1B1D2E'); g.circ(12, 11, 2, '#1B1D2E'); g.line(4, 11, 8, 6, C.red); g.line(8, 6, 12, 11, C.red); g.line(4, 11, 9, 11, C.red); g.r(7, 4, 3, 1, C.white); g.r(11, 5, 2, 1, C.white); },
    musica: function (g) { g.line(3, 13, 12, 4, C.wood, 0, 2); g.circ(4, 12, 3, C.orange); g.circ(4, 12, 1, C.black); g.r(11, 2, 3, 3, C.wood); g.r(13, 8, 2, 1, C.yellow); g.r(14, 5, 1, 4, C.yellow); },
    mergulho: function (g) { g.r(0, 0, 16, 16, '#0d2b45'); g.r(3, 5, 10, 6, C.yellow); g.r(4, 6, 8, 4, '#9AD8FF'); g.r(1, 7, 2, 2, C.black); g.r(13, 7, 2, 2, C.black); g.r(12, 2, 1, 4, C.orange); g.r(4, 13, 1, 1, C.white); g.r(7, 12, 2, 2, C.white); g.r(11, 14, 1, 1, C.white); },
    cerveja: function (g) { g.r(4, 5, 7, 9, C.yellow); g.r(3, 3, 9, 3, C.white); g.r(11, 7, 3, 1, C.white); g.r(13, 7, 1, 5, C.white); g.r(11, 11, 3, 1, C.white); g.r(6, 7, 1, 5, '#F9E08A'); },
    marcenaria: function (g) { g.line(3, 13, 10, 6, C.wood, 0, 2); g.r(8, 2, 6, 4, C.grey); g.r(7, 3, 1, 2, C.grey2); g.r(2, 14, 12, 1, C.wood); },
    camping: function (g) { for (var i = 0; i < 7; i++) g.r(8 - i, 4 + i, i * 2 + 1, 1, C.green); g.r(7, 8, 2, 4, C.black); g.r(1, 12, 14, 1, C.grass); g.r(12, 3, 1, 1, C.yellow); g.r(3, 2, 1, 1, C.white); },
    filme: function (g) { g.r(2, 6, 12, 8, C.black); g.r(2, 3, 12, 3, C.white); for (var i = 0; i < 4; i++) g.r(3 + i * 3, 3, 1, 3, C.black); g.r(4, 8, 8, 4, C.red); g.r(7, 9, 2, 2, C.yellow); },
    mochila: function (g) { g.r(4, 4, 8, 10, C.green); g.r(5, 2, 6, 3, C.leaf2); g.r(5, 8, 6, 4, C.leaf2); g.r(7, 9, 2, 1, C.yellow); g.r(3, 6, 1, 6, C.wood); g.r(12, 6, 1, 6, C.wood); },
    biogas: function (g) { g.r(2, 8, 12, 6, C.grey2); for (var i = 0; i < 5; i++) g.r(3 + i, 7 - Math.min(i, 3), 10 - i * 2, 1, C.grey); g.r(7, 2, 1, 3, C.grey); g.r(6, 1, 3, 2, C.orange); g.r(7, 0, 1, 1, C.yellow); g.text('15', 4, 9, C.yellow); },
    galinha: function (g) { g.r(3, 7, 8, 6, C.white); g.r(9, 3, 4, 5, C.white); g.r(13, 5, 2, 1, C.orange); g.r(10, 2, 2, 1, C.red); g.r(11, 4, 1, 1, C.black); g.r(5, 13, 1, 2, C.orange); g.r(8, 13, 1, 2, C.orange); g.r(1, 6, 3, 3, C.white); },
    panela: function (g) { g.r(3, 8, 10, 5, C.grey2); g.r(1, 8, 2, 1, C.grey); g.r(13, 8, 2, 1, C.grey); g.r(3, 7, 10, 1, C.grey); g.r(5, 3, 1, 3, C.white); g.r(8, 2, 1, 4, C.white); g.r(11, 3, 1, 3, C.white); g.r(4, 14, 2, 1, C.orange); g.r(7, 14, 2, 1, C.red); g.r(10, 14, 2, 1, C.orange); },
    estrela: function (g) { g.r(0, 0, 16, 16, C.night); for (var i = 0; i < 6; i++) { g.a(.3 + i * .12); g.line(2 + i, 13 - i * 2, 9 + i, 12 - i * 2, C.white); } g.a(1); g.r(2, 14, 12, 2, C.black); g.r(11, 12, 2, 2, C.cat); },
    pincel: function (g) { g.r(3, 2, 8, 5, C.blue); g.r(3, 7, 8, 1, C.grey); g.r(6, 8, 2, 6, C.wood); g.r(11, 3, 2, 8, '#9AD8FF'); },
    carona: function (g) { g.r(0, 11, 16, 3, C.grey2); g.r(2, 12, 3, 1, C.yellow); g.r(8, 12, 3, 1, C.yellow); g.r(6, 3, 3, 3, C.skin); g.r(6, 6, 3, 5, C.red); g.r(9, 6, 4, 1, C.skin); g.r(12, 4, 1, 2, C.skin); },
    fabrica: function (g) { g.r(2, 8, 12, 6, C.grey); g.r(3, 3, 2, 5, C.brick); g.r(7, 5, 2, 3, C.brick); g.r(3, 1, 3, 2, C.white); g.r(5, 0, 2, 1, C.white); g.r(4, 10, 2, 2, C.yellow); g.r(8, 10, 2, 2, C.yellow); g.r(11, 10, 2, 4, C.black); }
  };

  // ---------- Reprodutor de cenas ----------
  function player(stageEl) {
    var id = stageEl.getAttribute('data-scene'), data = (window.CAUSOS || {})[id], fn = S[id];
    if (!data || !fn) return;
    var cv = stageEl.querySelector('canvas'); cv.width = W; cv.height = H;
    var g = G(cv.getContext('2d')), who = stageEl.querySelector('.who'), tx = stageEl.querySelector('.txt'), nx = stageEl.querySelector('[data-next]'), pv = stageEl.querySelector('[data-prev]'), sp = stageEl.querySelector('.px-step');
    var st = 0, t0 = 0, ts0 = 0, vis = false, raf = 0, typ = 0, T = window.PXT || {};
    function say() {
      var d = data.steps[st]; who.textContent = d.who || ''; clearInterval(typ);
      sp.textContent = (st + 1) + '/' + data.steps.length;
      nx.textContent = st === data.steps.length - 1 ? (T.again || 'De novo') : (T.next || 'Continuar');
      pv.disabled = st === 0;
      if (AC.reduced()) { tx.textContent = d.txt; return; }
      var i = 0; tx.textContent = '';
      typ = setInterval(function () { i += 2; tx.textContent = d.txt.slice(0, i); if (i >= d.txt.length) clearInterval(typ); }, 22);
    }
    function go(n) { st = (n + data.steps.length) % data.steps.length; ts0 = performance.now(); say(); kick(); }
    function frame(now) {
      raf = 0; if (!t0) { t0 = now; ts0 = ts0 || now; }
      var d = data.steps[st], sc = d.s === undefined ? st : d.s;
      g.ctx.globalAlpha = 1;
      fn(g, (now - t0) / 1000, sc, AC.reduced() ? 99 : (now - ts0) / 1000);
      if (vis && !AC.reduced()) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }
    nx.addEventListener('click', function () { go(st + 1); });
    pv.addEventListener('click', function () { go(st - 1); });
    cv.addEventListener('click', function () { go(st + 1); });
    say(); kick();
    AC.watch(stageEl, function (on) { vis = on; if (on) kick(); }, { threshold: 0.1 });
  }

  // ---------- Fisher, o guia ----------
  function drawFisher(g, t, mood) {
    g.r(0, 0, 24, 24, '#10122B');
    var blink = (t % 3.2) > 3.05, tail = Math.sin(t * 3) > 0 ? 0 : 1, c = C.cat, d = C.cat2;
    g.r(6, 13, 12, 9, c); g.r(8, 15, 8, 7, '#F6D7A8'); g.r(5, 20, 5, 2, c); g.r(14, 20, 5, 2, c); g.r(5, 21, 2, 1, C.white); g.r(17, 21, 2, 1, C.white);
    g.r(18, 14 + tail, 2, 6, c); g.r(19, 11 + tail * 2, 2, 4, c); g.r(19, 11 + tail * 2, 2, 1, d);
    g.r(5, 4, 14, 10, c); g.r(5, 2, 3, 3, c); g.r(16, 2, 3, 3, c); g.r(6, 3, 1, 1, C.pink); g.r(17, 3, 1, 1, C.pink);
    g.r(9, 4, 1, 3, d); g.r(11, 4, 2, 2, d); g.r(14, 4, 1, 3, d);
    g.r(8, 10, 8, 4, '#F6D7A8');
    if (blink) { g.r(7, 9, 3, 1, C.black); g.r(14, 9, 3, 1, C.black); } else { g.r(7, 7, 3, 3, mood ? '#7BD389' : '#E8D06A'); g.r(14, 7, 3, 3, mood ? '#7BD389' : '#E8D06A'); g.r(8, 7, 1, 3, C.black); g.r(15, 7, 1, 3, C.black); }
    g.r(11, 10, 2, 1, C.pink); g.r(10, 12, 1, 1, d); g.r(13, 12, 1, 1, d); g.r(11, 11, 2, 1, d);
    g.r(2, 10, 3, 1, C.white); g.r(19, 10, 3, 1, C.white);
    // gravata borboleta de sommelier
    g.r(9, 14, 2, 2, C.red); g.r(13, 14, 2, 2, C.red); g.r(11, 14, 2, 1, '#8a1f17');
  }
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function fisher() {
    var F = window.FISHER; if (!F) return;
    var btn = document.createElement('button'); btn.className = 'fisher-btn'; btn.type = 'button'; btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', F.open);
    btn.innerHTML = '<canvas width="24" height="24" aria-hidden="true"></canvas><span class="balao">' + F.balao + '</span>';
    var pn = document.createElement('div'); pn.className = 'fisher-panel'; pn.setAttribute('role', 'dialog'); pn.setAttribute('aria-label', F.title);
    pn.innerHTML = '<div class="fisher-h"><span>' + F.title + '</span><button type="button" aria-label="' + F.close + '">X</button></div><div class="fisher-log" aria-live="polite"></div><div class="fisher-chips"></div><form class="fisher-form"><input type="text" aria-label="' + F.ph + '" placeholder="' + F.ph + '"><button type="submit">OK</button></form>';
    document.body.appendChild(pn); document.body.appendChild(btn);
    var g = G(btn.querySelector('canvas').getContext('2d')), log = pn.querySelector('.fisher-log'), chips = pn.querySelector('.fisher-chips'), form = pn.querySelector('form'), inp = pn.querySelector('input');
    var mood = 0, t0 = performance.now();
    (function loop(now) { g.ctx.globalAlpha = 1; drawFisher(g, ((now || t0) - t0) / 1000, mood); if (!AC.reduced()) requestAnimationFrame(loop); })();
    function add(cls, html) { var p = document.createElement('div'); p.className = cls; p.innerHTML = html; log.appendChild(p); log.scrollTop = log.scrollHeight; }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function search(q) {
      var toks = norm(q).split(/[^a-z0-9]+/).filter(function (w) { return w.length > 1 && F.stop.indexOf(w) < 0; }), ex = [];
      toks.forEach(function (w) { ex.push(w); (F.syn[w] || []).forEach(function (s) { ex.push(s); }); });
      var res = [];
      (window.FINDEX || []).forEach(function (it) {
        var sc = 0, T = norm(it.t), K = norm(it.k), D = norm(it.d);
        ex.forEach(function (w) { if (T.indexOf(w) >= 0) sc += 5; if (K.indexOf(w) >= 0) sc += 3; if (D.indexOf(w) >= 0) sc += 1; });
        if (sc) res.push({ it: it, sc: sc + (it.w || 0) });
      });
      res.sort(function (a, b) { return b.sc - a.sc; });
      return res.slice(0, 4);
    }
    function ask(q) {
      add('u', esc(q)); mood = 1; setTimeout(function () { mood = 0; }, 1500);
      var r = search(q);
      if (!r.length) { add('f', F.none); return; }
      add('f', F.found[Math.floor(Math.random() * F.found.length)] + r.map(function (x) { return '<a href="' + AC.PG.root + x.it.u + '">' + esc(x.it.t) + '<small>' + esc(x.it.i + (x.it.d ? ': ' + x.it.d : '')) + '</small></a>'; }).join(''));
    }
    F.chips.forEach(function (c) { var b = document.createElement('button'); b.type = 'button'; b.textContent = c.l; b.addEventListener('click', function () { ask(c.q || c.l); }); chips.appendChild(b); });
    form.addEventListener('submit', function (e) { e.preventDefault(); var q = inp.value.trim(); if (q) { ask(q); inp.value = ''; } });
    var opened = false;
    function toggle(o) { pn.classList.toggle('open', o); btn.setAttribute('aria-expanded', o ? 'true' : 'false'); if (o) { if (!opened) { add('f', F.hello); opened = true; } inp.focus(); } }
    btn.addEventListener('click', function () { toggle(!pn.classList.contains('open')); });
    pn.querySelector('.fisher-h button').addEventListener('click', function () { toggle(false); btn.focus(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pn.classList.contains('open')) { toggle(false); btn.focus(); } });
    window.AC.fisherAsk = function (q) { toggle(true); ask(q); };
  }

  document.addEventListener('DOMContentLoaded', function () {
    AC.$$('.px-stage[data-scene]').forEach(player);
    AC.$$('canvas[data-icon]').forEach(function (cv) { cv.width = 16; cv.height = 16; var g = G(cv.getContext('2d')); g.r(0, 0, 16, 16, '#1B1D2E'); var f = ICON[cv.getAttribute('data-icon')]; if (f) f(g); });
    AC.$$('canvas[data-fisher]').forEach(function (cv) { cv.width = 24; cv.height = 24; var g = G(cv.getContext('2d')), t0 = performance.now(); (function loop(now) { g.ctx.globalAlpha = 1; drawFisher(g, ((now || t0) - t0) / 1000, 0); if (!AC.reduced()) requestAnimationFrame(loop); })(); });
    fisher();
  });
})();
