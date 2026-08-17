(() => {
  // Never block first paint while Supabase content is loading.
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
      if (
        document.documentElement.classList.contains('sm-content-ready') ||
        document.body.classList.contains('sm-content-ready') ||
        Date.now() - started > 6000
      ) {
        resolve();
        return;
      }
      requestAnimationFrame(check);
    };
    check();
  });

  load('assets/site-content-loader.js?v=20260817-instant')
    .then(() => waitForContent())
    .then(() => load('assets/order-flow-core.js?v=20260817-instant'))
    .then(() => load('assets/studio-contact-order.js?v=20260817-instant'))
    .catch(err => console.error('SM Flowers loader error:', err));
})();
