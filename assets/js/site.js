/* Portfólio v4: único comportamento é o filtro de projetos por tecnologia. */
(function () {
  var list = document.getElementById('st-list');
  if (!list) return;
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var items = Array.prototype.slice.call(list.children);
  var label = document.getElementById('st-label');
  var clear = document.getElementById('st-clear');
  var current = null;

  function apply() {
    var n = 0;
    items.forEach(function (li) {
      var show = current === null ? li.hasAttribute('data-sel') : (' ' + li.getAttribute('data-chips') + ' ').indexOf(' ' + current + ' ') > -1;
      li.hidden = !show;
      if (show) n++;
    });
    chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-chip') === current ? 'true' : 'false'); });
    if (current === null) {
      label.textContent = label.getAttribute('data-ini');
    } else {
      var chip = chips.filter(function (c) { return c.getAttribute('data-chip') === current; })[0];
      var name = chip.firstChild.textContent;
      label.textContent = label.getAttribute('data-res') + ' ' + name + ': ' + n + ' ' + label.getAttribute(n === 1 ? 'data-n1' : 'data-n');
    }
    clear.hidden = current === null;
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var id = c.getAttribute('data-chip');
      current = current === id ? null : id;
      apply();
    });
  });
  clear.addEventListener('click', function () { current = null; apply(); });
})();

/* Ancora para um projeto ou fase dentro de um bloco expansivel: abre o bloco antes de rolar. */
(function () {
  function openTo() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    var n = el, found = false;
    while (n) { if (n.tagName === 'DETAILS' && !n.open) { n.open = true; found = true; } n = n.parentElement; }
    if (found) el.scrollIntoView();
  }
  window.addEventListener('hashchange', openTo);
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (a && a.getAttribute('href') === location.hash) openTo();
  });
  openTo();
})();
