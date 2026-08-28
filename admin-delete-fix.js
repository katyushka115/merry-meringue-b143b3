/* SM Flowers admin: safe, idempotent delete-button fix. */
(function () {
  'use strict';
  if (window.__smFlowersDeleteFixLoaded) return;
  window.__smFlowersDeleteFixLoaded = true;

  function clean() {
    const list = document.getElementById('productsList');
    if (!list) return;
    const seen = new Set();
    list.querySelectorAll('[data-delete-product]').forEach((button) => {
      const id = button.getAttribute('data-delete-product');
      if (!id || seen.has(id)) button.remove();
      else seen.add(id);
    });
  }

  function start() {
    clean();
    const list = document.getElementById('productsList');
    if (!list || list.__deleteFixObserver) return;
    const observer = new MutationObserver(clean);
    observer.observe(list, { childList: true, subtree: true });
    list.__deleteFixObserver = observer;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else start();
})();
