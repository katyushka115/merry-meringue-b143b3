(() => {
  const load = (src) => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });

  // The page content and product catalog are rendered by site-content-loader.js.
  // This file must not repaint stale copy or replace the working /media/product/ routes.
  load('assets/order-flow-core.js?v=20260823-1')
    .then(() => load('assets/studio-contact-order.js?v=20260823-1'))
    .catch(err => console.error('SM Flowers order flow error:', err));
})();
