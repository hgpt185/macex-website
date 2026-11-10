/* MacEx website settings. Edit the values here; every page reads them. */
window.MACEX = {
  // Dodo Payments checkout link for the 1-Mac license, e.g.
  // 'https://checkout.dodopayments.com/buy/pdt_XXXXXXXX?quantity=1'
  // While empty, every "Get MacEx" button scrolls to the pricing card instead.
  checkoutUrl: 'https://checkout.dodopayments.com/buy/pdt_0NreSA2ieB6DWf67OiCsZ?quantity=1',

  // Direct link to the MacEx .dmg. While empty, the "Download for Mac" button is hidden.
  downloadUrl: '',

  // Support address. While empty, the "Email support" links are hidden.
  supportEmail: '',

  // Public address of this site, used in the "Ask AI" prompts.
  siteUrl: 'https://macex.app/',

  // Licenses shown on the pricing card. Add more rows (with their own checkoutUrl)
  // to show the 1 Mac / 3 Macs / 5 Macs switcher.
  plans: [
    { macs: 1, price: 9.99, was: 19.98, checkoutUrl: 'https://checkout.dodopayments.com/buy/pdt_0NreSA2ieB6DWf67OiCsZ?quantity=1' }
  ]
};

(() => {
  const C = window.MACEX;
  const money = n => '$' + n.toFixed(2);
  const all = s => [...document.querySelectorAll(s)];

  function wire() {
    const plans = C.plans.length ? C.plans : [{ macs: 1, price: 0, was: 0 }];
    let plan = plans[0];
    const checkout = p => p.checkoutUrl || C.checkoutUrl;

    // "Get MacEx" buttons: straight to Dodo checkout once a link is set
    const paintBuy = () => all('[data-buy]').forEach(a => {
      const url = checkout(plan);
      if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
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

    all('[data-download]').forEach(a => { if (C.downloadUrl) { a.href = C.downloadUrl; a.hidden = false; } else a.hidden = true; });
    all('[data-support]').forEach(a => { if (C.supportEmail) { a.href = 'mailto:' + C.supportEmail; a.hidden = false; } else a.hidden = true; });

    // "Ask AI" links open the assistant with a question about MacEx already typed
    const q = encodeURIComponent(`Tell me about MacEx, the file library app for Mac (${C.siteUrl}). What does it do, and who is it for?`);
    const ai = { chatgpt: 'https://chatgpt.com/?q=', claude: 'https://claude.ai/new?q=', perplexity: 'https://www.perplexity.ai/search?q=', google: 'https://www.google.com/search?udm=50&q=', grok: 'https://grok.com/?q=' };
    all('[data-ai]').forEach(a => { if (ai[a.dataset.ai]) a.href = ai[a.dataset.ai] + q; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();
