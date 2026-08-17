(() => {
  // Hide the static HTML immediately so the browser cannot paint the old version
  // before site-content-loader applies the current content from Supabase.
  const pendingStyle = document.createElement('style');
  pendingStyle.id = 'sm-early-content-pending';
  pendingStyle.textContent = 'body > *:not(script){visibility:hidden!important}';
  document.head.appendChild(pendingStyle);

  const load = (src) => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });

  const waitForContent = () => new Promise((resolve) => {
    const started = Date.now();
    const check = () => {
      if (document.body.classList.contains('sm-content-ready') || Date.now() - started > 6000) {
        pendingStyle.remove();
        resolve();
        return;
      }
      requestAnimationFrame(check);
    };
    check();
  });

  // Content loader must run first. It controls the transition from the
  // static HTML to the current Supabase-backed version of the site.
  load('assets/site-content-loader.js?v=20260817-early')
    .then(() => waitForContent())
    .then(() => load('assets/order-flow-core.js?v=20260816-safe'))
    .then(() => load('assets/studio-contact-order.js?v=20260817-1'))
    .catch(err => {
      console.error('SM Flowers loader error:', err);
      pendingStyle.remove();
    });
})();
