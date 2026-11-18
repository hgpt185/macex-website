// Feature directory filter: hides feature cards (and empty categories) that don't match the typed words.
(() => {
  const input = document.getElementById('fd-q');
  if (!input) return;
  const items = [...document.querySelectorAll('.fd-item')];
  const cats = [...document.querySelectorAll('.fd-cat')];
  const count = document.getElementById('fd-count'), empty = document.getElementById('fd-empty');
  const text = el => el.textContent.toLowerCase().replace(/\s+/g, ' ');
  const index = items.map(el => text(el) + ' ' + text(el.closest('.fd-cat').querySelector('h2')));
  const run = () => {
    const words = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let shown = 0;
    items.forEach((el, i) => { const on = words.every(w => index[i].includes(w)); el.hidden = !on; if (on) shown++; });
    cats.forEach(c => { c.hidden = words.length > 0 && !c.querySelector('.fd-item:not([hidden])'); });
    empty.hidden = shown > 0;
    count.textContent = words.length ? `${shown} of ${items.length} features` : `${items.length} features in ${cats.length} categories`;
  };
  input.addEventListener('input', run);
  run();
})();
