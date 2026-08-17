/* Prevent dynamic Supabase photos from flashing local placeholder SVGs. */
(function () {
  'use strict';

  var PLACEHOLDER_RE = /(?:^|\/)assets\/bouquet-[^/?#]+\.svg(?:[?#].*)?$/i;

  function isDynamicImage(img) {
    if (!img || img.tagName !== 'IMG') return false;
    var src = img.getAttribute('src') || '';
    return PLACEHOLDER_RE.test(src) || img.closest('.collection-card, .statement-art, .product-image');
  }

  function prepare(img) {
    if (!isDynamicImage(img) || img.dataset.dynamicPreloadReady === '1') return;
    img.dataset.dynamicPreloadReady = '1';
    img.style.visibility = 'hidden';
    img.addEventListener('load', function () {
      img.style.visibility = 'visible';
    }, { once: true });
  }

  document.querySelectorAll('img').forEach(prepare);

  new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType !== 1) return;
        if (node.matches && node.matches('img')) prepare(node);
        if (node.querySelectorAll) node.querySelectorAll('img').forEach(prepare);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
