/* SM Flowers admin: safe, idempotent delete-button fix.
   This module is intentionally standalone. It prevents duplicate delete buttons
   if loaded by an admin page and delegates deletion to the existing Supabase client.
*/
(function () {
  'use strict';
  if (window.__smFlowersDeleteFixLoaded) return;
  window.__smFlowersDeleteFixLoaded = true;

  function install() {
    const list = document.getElementById('productsList');
    if (!list) return;

    // Remove accidental duplicate delete controls left by older injected versions.
    const seen = new Set();
    list.querySelectorAll('[data-delete-product]').forEach((button) => {
      const id = button.getAttribute('data-delete-product');
      if (!id || seen.has(id)) {
        button.remove();
        return;
      }
      seen.add(id);
    });
  }

  // Run once now and after list redraws, without adding event handlers repeatedly.
  install();
  const observer = new MutationObserver(install);
  const start = () => {
    const list = document.getElementById('productsList');
    if (list) observer.observe(list, { childList: true, subtree: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
