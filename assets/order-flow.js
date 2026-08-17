(() => {
  const load = (src) => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
  load('assets/order-flow-core.js?v=20260816-safe')
    .then(() => load('assets/site-content-loader.js?v=20260816-1'))
    .then(() => load('assets/studio-contact-order.js?v=20260817-1'))
    .catch(err => console.error('SM Flowers loader error:', err));
})();