(() => {
  const imageSources = {
    'assets/bouquet-1.svg': 'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/collections/fdd4c98a-66dc-4b88-88e3-9266f1a2ddd5.jpeg',
    'assets/bouquet-2.svg': 'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/collections/81b226c1-8f99-41a3-a060-f95cadc16431.jpeg',
    'assets/bouquet-3.svg': 'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/site-media/36fe864b-da66-4022-bcda-d81b29c7c83c.jpeg',
    'assets/bouquet-4.svg': 'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/site-media/aa61840b-6cdc-4995-bc66-254fd06b79c6.jpeg',
    'assets/bouquet-5.svg': 'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/collections/ddf86b0f-28be-47cd-9df9-b4fb27650ba4.jpeg',
    'assets/bouquet-6.svg': 'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/site-media/e78c8f30-9f27-425f-8ac7-d53eef9dbbb6.jpeg'
  };
  const normalize = src => { try { return new URL(src, location.href).pathname.replace(/^\//, ''); } catch { return src; } };
  const startImages = () => {
    document.querySelectorAll('img[src]').forEach(img => {
      const key = normalize(img.getAttribute('src')), direct = imageSources[key];
      if (!direct) return;
      img.loading = 'eager'; img.decoding = 'async'; img.fetchPriority = key === 'assets/bouquet-6.svg' ? 'high' : 'auto'; img.src = direct;
    });
    const hero = imageSources['assets/bouquet-6.svg'];
    const link = document.createElement('link'); link.rel = 'preload'; link.as = 'image'; link.href = hero; link.fetchPriority = 'high'; document.head.appendChild(link);
  };
  startImages();
  const load = src => new Promise((resolve, reject) => { const s = document.createElement('script'); s.src = src; s.onload = resolve; s.onerror = reject; document.body.appendChild(s); });
  const waitForContent = () => new Promise(resolve => {
    const started = Date.now();
    const check = () => { if (document.documentElement.classList.contains('sm-content-ready') || document.body.classList.contains('sm-content-ready') || Date.now() - started > 6000) { resolve(); return; } requestAnimationFrame(check); };
    check();
  });
  load('assets/site-content-loader.js?v=20260817-instant')
    .then(() => waitForContent())
    .then(() => load('assets/order-flow-core.js?v=20260817-no-hero-note'))
    .then(() => load('assets/studio-contact-order.js?v=20260817-instant'))
    .catch(err => console.error('SM Flowers loader error:', err));
})();