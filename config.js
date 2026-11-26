/* MacEx website settings. Edit the values here; every page reads them. */
window.MACEX = {
  // Dodo Payments checkout link for the 1-Mac license, e.g.
  // 'https://checkout.dodopayments.com/buy/pdt_XXXXXXXX?quantity=1'
  // redirect_url sends buyers to the thank-you page (which offers the download) after paying.
  // While empty, every "Get MacEx" button scrolls to the pricing card instead.
  checkoutUrl: 'https://checkout.dodopayments.com/buy/pdt_0NreSA2ieB6DWf67OiCsZ?quantity=1&redirect_url=https%3A%2F%2Fmacex.app%2Fthanks%2F',

  // Always the newest release: the release workflow refreshes this file on every v* tag.
  // Direct link to the MacEx .dmg. While empty, the "Download for Mac" button is hidden.
  downloadUrl: 'https://downloads.macex.app/releases/latest/MacEx.dmg',

  // Support address. While empty, the "Email support" links are hidden.
  supportEmail: 'support@macex.app',

  // Product facts. Pages state these in plain HTML too (for search engines and AI crawlers);
  // `python3 -B scripts/seo.py check` fails if any page disagrees with these values or the plan prices.
  version: '0.8.12',      // current release; update with every app release
  minimumMacOS: '14',     // macOS 14 Sonoma or later; Apple silicon and Intel

  // Public address of this site, used in the "Ask AI" prompts.
  siteUrl: 'https://macex.app/',

  // Sale. Until endsAt, every page shows the sale bar and the pricing card shows the sale badge
  // and countdown. After endsAt they hide by themselves and the card says "Launch price" again.
  // The countdown runs to this fixed time for every visitor; it never resets.
  sale: { name: 'Black Friday', endsAt: '2026-12-01T07:59:59Z' }, // Monday 30 November 2026, 11:59 pm Pacific

  // Licenses shown on the pricing card. Add more rows (with their own checkoutUrl)
  // to show the 1 Mac / 3 Macs / 5 Macs switcher.
  plans: [
    { macs: 1, price: 9.99, was: 19.98, checkoutUrl: 'https://checkout.dodopayments.com/buy/pdt_0NreSA2ieB6DWf67OiCsZ?quantity=1&redirect_url=https%3A%2F%2Fmacex.app%2Fthanks%2F' }
  ]
};

(() => {
  const C = window.MACEX;
  const money = n => '$' + n.toFixed(2);
  const all = s => [...document.querySelectorAll(s)];

  // Umami counts clicks on elements with data-umami-event; the place says which button was used.
  // No personal data is sent: only the event name, the place and the page URL.
  const track = (a, name) => {
    const at = a.closest('[id], header, footer');
    a.dataset.umamiEvent = name;
    a.dataset.umamiEventPlace = at ? (at.id || at.tagName.toLowerCase()) : 'page';
  };

  // Sale bar, badge and countdown. Elements marked data-sale show only while the sale runs;
  // elements marked data-sale-hide show only when it is not running.
  function sale(plan) {
    const end = C.sale && Date.parse(C.sale.endsAt);
    const on = () => end && Date.now() < end && plan.was > plan.price;
    const toggle = live => {
      all('[data-sale]').forEach(el => { el.hidden = !live; });
      all('[data-sale-hide]').forEach(el => { el.hidden = live; });
      if (!live) all('.sale-bar').forEach(el => el.remove());
    };
    if (!on()) return toggle(false);

    const off = Math.round((1 - plan.price / plan.was) * 100) + '% off';
    all('[data-sale-off]').forEach(el => { el.textContent = off; });
    all('[data-sale-save]').forEach(el => { el.textContent = money(plan.was - plan.price); });
    all('[data-sale-ends]').forEach(el => {
      el.textContent = new Date(end).toLocaleString([], { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
    });

    // Site-wide bar at the top of the page; not on the thank-you page, where the buyer has already paid
    let dismissed = false;
    try { dismissed = sessionStorage.getItem('macex-sale-bar') === C.sale.endsAt; } catch (e) { /* storage blocked */ }
    if (!dismissed && !/^\/thanks/.test(location.pathname)) {
      const bar = document.createElement('div');
      bar.className = 'sale-bar';
      bar.setAttribute('role', 'region');
      bar.setAttribute('aria-label', C.sale.name + ' sale');
      const href = document.getElementById('pricing') ? '#pricing' : '/#pricing';
      bar.innerHTML = `<a class="sb-link" href="${href}"><span class="sb-tag"><i></i>${C.sale.name} sale is live</span>`
        + `<span class="sb-msg"><b>${off}</b> MacEx for ${money(plan.price)} <s>${money(plan.was)}</s></span>`
        + `<span class="sb-time">Ends in <b data-sale-clock></b></span><span class="sb-cta">Get the deal</span></a>`
        + `<button class="sb-close" type="button" aria-label="Hide the sale banner">&times;</button>`;
      bar.querySelector('.sb-close').addEventListener('click', () => {
        bar.remove();
        try { sessionStorage.setItem('macex-sale-bar', C.sale.endsAt); } catch (e) { /* storage blocked */ }
      });
      document.body.prepend(bar);
    }
    toggle(true);

    const pad = n => String(n).padStart(2, '0');
    const tick = () => {
      const left = Math.max(0, end - Date.now());
      if (!left) { clearInterval(timer); return toggle(false); }
      const t = Math.floor(left / 1000);
      const u = { d: Math.floor(t / 86400), h: Math.floor(t / 3600) % 24, m: Math.floor(t / 60) % 60, s: t % 60 };
      const text = (u.d ? u.d + 'd ' : '') + pad(u.h) + 'h ' + pad(u.m) + 'm ' + pad(u.s) + 's';
      all('[data-sale-clock]').forEach(el => { el.textContent = text; });
      all('[data-sale-unit]').forEach(el => { el.textContent = pad(u[el.dataset.saleUnit]); });
    };
    const timer = setInterval(tick, 1000);
    tick();
  }

  function wire() {
    const plans = C.plans.length ? C.plans : [{ macs: 1, price: 0, was: 0 }];
    let plan = plans[0];
    const checkout = p => p.checkoutUrl || C.checkoutUrl;

    // "Get MacEx" buttons: straight to Dodo checkout once a link is set
    const paintBuy = () => all('[data-buy]').forEach(a => {
      const url = checkout(plan);
      if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; track(a, 'checkout'); }
    });

    // Pricing card
    const card = document.querySelector('[data-pricing]');
    if (card) {
      const tabs = card.querySelector('[data-plan-tabs]');
      const paint = () => {
        const macs = plan.macs === 1 ? '1 Mac' : plan.macs + ' Macs';
        card.querySelectorAll('[data-plan-sub]').forEach(el => { el.textContent = macs; });
        card.querySelectorAll('[data-price]').forEach(el => { el.textContent = money(plan.price); });
        card.querySelectorAll('[data-was]').forEach(el => { el.textContent = plan.was > plan.price ? money(plan.was) : ''; });
        card.querySelectorAll('[data-buy-label]').forEach(el => { el.textContent = 'Get MacEx, ' + money(plan.price); });
        all('[data-plan]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.plan === plan.macs)));
        paintBuy();
      };
      if (plans.length > 1) {
        tabs.hidden = false;
        tabs.innerHTML = plans.map(p => `<button type="button" data-plan="${p.macs}">${p.macs === 1 ? '1 Mac' : p.macs + ' Macs'}</button>`).join('');
        tabs.addEventListener('click', e => { const b = e.target.closest('[data-plan]'); if (!b) return; plan = plans.find(p => p.macs === +b.dataset.plan); paint(); });
      }
      paint();
    }
    paintBuy();

    // Ticket notches sit where the dashed tear line meets the edge: top and bottom on wide
    // screens, left and right once the card stacks into one column
    const ticket = document.querySelector('.ticket'), side = ticket && ticket.querySelector('.tk-side');
    if (side) {
      const notch = () => {
        const across = side.offsetLeft > 0;
        // centre on the 1.5px dashed line
        const x = side.offsetLeft + .75, y = side.offsetTop + .75;
        ticket.style.setProperty('--n1', across ? x + 'px 0' : '0 ' + y + 'px');
        ticket.style.setProperty('--n2', across ? x + 'px 100%' : '100% ' + y + 'px');
      };
      if ('ResizeObserver' in window) new ResizeObserver(notch).observe(ticket);
      notch();
    }

    // Phones and tablets can't install a Mac app: hide downloads there and offer to send the link to a Mac.
    const phone = matchMedia('(hover: none) and (pointer: coarse)').matches;
    all('[data-download]').forEach(a => { if (C.downloadUrl && !phone) { a.href = C.downloadUrl; a.hidden = false; track(a, 'download'); } else a.hidden = true; });
    all('[data-share]').forEach(b => {
      b.hidden = !phone;
      if (!phone) return;
      track(b, 'send-to-mac');
      b.addEventListener('click', async () => {
        const url = b.dataset.shareUrl || C.siteUrl;
        const label = b.querySelector('b');
        try {
          if (navigator.share) await navigator.share({ title: 'MacEx for Mac', text: 'MacEx, a file manager for Mac', url });
          else { await navigator.clipboard.writeText(url); if (label) label.textContent = 'Link copied. Paste it on your Mac'; }
        } catch (e) { /* share sheet closed */ }
      });
    });
    sale(plans[0]);
    all('[data-version]').forEach(el => { el.textContent = C.version; });
    all('[data-support]').forEach(a => { if (C.supportEmail) { a.href = 'mailto:' + C.supportEmail; a.hidden = false; } else a.hidden = true; });

    // "Ask AI" links open the assistant with a question about MacEx already typed
    const q = encodeURIComponent(`Tell me about MacEx, the Mac file manager (${C.siteUrl}). What does it do, and who is it for?`);
    const ai = { chatgpt: 'https://chatgpt.com/?q=', claude: 'https://claude.ai/new?q=', perplexity: 'https://www.perplexity.ai/search?q=', google: 'https://www.google.com/search?udm=50&q=', grok: 'https://grok.com/?q=' };
    all('[data-ai]').forEach(a => { if (ai[a.dataset.ai]) a.href = ai[a.dataset.ai] + q; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();
