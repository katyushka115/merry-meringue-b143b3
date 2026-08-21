(() => {
  const SUPABASE_URL = 'https://avlozhwwvjqiypifoxox.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_3FgdTAmKB8kw2QTrrVPA5g_vb1lya1d';
  const SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
  const TELEGRAM = 'https://t.me/smflowersmsk';
  const INSTAGRAM = 'https://www.instagram.com/smflowers.msk?igsh=enFqZGtuaW1qNWRi&utm_source=qr';
  const STUDIO_ADDRESS = 'г. Москва, Ленинский проспект, 94А';
  const MAP_URL = 'https://yandex.ru/maps/?text=' + encodeURIComponent(STUDIO_ADDRESS);
  let client = null;
  let selectedProduct = null;

  const esc = v => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));

  function loadMobileStyles() {
    if (window.matchMedia('(max-width: 760px)').matches && !document.querySelector('link[data-sm-mobile-css]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'assets/mobile.css?v=20260816-3';
      link.dataset.smMobileCss = 'true';
      document.head.appendChild(link);
    }
  }

  function setupSafeSitePatches() {
    if (document.documentElement.dataset.smSitePatches === 'true') return;
    document.documentElement.dataset.smSitePatches = 'true';

    const style = document.createElement('style');
    style.dataset.smSitePatches = 'true';
    style.textContent = `
      .sm-studio-route-link { display:inline-flex; align-items:center; gap:7px; margin-top:10px; color:inherit; text-decoration:underline; text-underline-offset:4px; }
      .sm-hero-note-fallback { display:none !important; }
      .hero-visual .hero-note { display:none !important; }
      .sm-image-pending { visibility:hidden !important; }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('*').forEach(el => {
      if (el.children.length === 0 && (el.textContent || '').trim() === '@katyushka_115') el.textContent = '@smflowers.msk';
      if (el.children.length === 0 && (el.textContent || '').trim() === '@katyushka_n15') el.textContent = '@smflowers.msk';
    });

    document.querySelectorAll('.hero-note, .sm-hero-note-fallback').forEach(el => el.remove());

    const addressCandidates = Array.from(document.querySelectorAll('body *')).filter(el => {
      if (el.children.length > 0) return false;
      return (el.textContent || '').replace(/\s+/g, ' ').trim().includes('Ленинский проспект 94А') || (el.textContent || '').replace(/\s+/g, ' ').trim().includes('Ленинский проспект, 94А');
    });
    addressCandidates.forEach(el => {
      const parent = el.parentElement;
      if (!parent || parent.querySelector('.sm-studio-route-link')) return;
      const link = document.createElement('a');
      link.className = 'sm-studio-route-link';
      link.href = MAP_URL;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = '📍 Построить маршрут →';
      parent.appendChild(link);
    });
  }

  function setupMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('main-nav');
    if (!toggle || !nav || toggle.dataset.menuReady === 'true') return;
    toggle.dataset.menuReady = 'true';
    const close = () => {
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Открыть меню');
    };
    toggle.addEventListener('click', e => {
      e.preventDefault();
      const open = !document.body.classList.contains('menu-open');
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 760) close(); });
  }

  async function getClient() {
    if (client?.rpc) return client;
    if (window.smSupabase?.rpc) { client = window.smSupabase; return client; }
    throw new Error('Supabase client is not initialized');
  }

  function socialLinks(settings = {}) {
    const tg = settings.telegram_url || TELEGRAM, ig = settings.instagram_url || INSTAGRAM;
    document.querySelectorAll('a').forEach(a => {
      const h = (a.getAttribute('href') || '').toLowerCase();
      const t = (a.textContent || '').toLowerCase();
      const l = (a.getAttribute('aria-label') || '').toLowerCase();
      if (h.includes('t.me/') || t.includes('telegram') || l.includes('telegram')) { a.href = tg; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      if (h.includes('instagram.com/') || t.includes('instagram') || l.includes('instagram')) { a.href = ig; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    });
  }

  function applyImage(img, url, fallback) {
    if (!img) return;
    if (!url) { img.classList.remove('sm-image-pending'); return; }
    img.classList.add('sm-image-pending');
    const preload = new Image();
    preload.onload = () => {
      img.onload = () => img.classList.remove('sm-image-pending');
      img.src = url;
      if (img.complete) img.classList.remove('sm-image-pending');
    };
    preload.onerror = () => {
      img.classList.remove('sm-image-pending');
      img.onerror = null;
      if (fallback) img.src = fallback;
    };
    preload.src = url;
  }

  async function loadAppearance() {
    const db = await getClient();
    const [settingsResult, categoriesResult] = await Promise.all([
      db.from('store_settings').select('hero_image_url,telegram_url,instagram_url').limit(1).maybeSingle(),
      db.from('categories').select('id,name,image_url,sort_order,is_active').eq('is_active', true).order('sort_order', {ascending:true}).order('id', {ascending:true})
    ]);

    if (!settingsResult.error && settingsResult.data) {
      const settings = settingsResult.data;
      socialLinks(settings);
      const hero = document.querySelector('.hero-visual img');
      applyImage(hero, settings.hero_image_url, 'assets/bouquet-6.svg');
    }

    if (!categoriesResult.error && Array.isArray(categoriesResult.data) && categoriesResult.data.length) {
      const cards = Array.from(document.querySelectorAll('.collection-card'));
      categoriesResult.data.slice(0, cards.length).forEach((category, index) => {
        const card = cards[index];
        const img = card.querySelector('img');
        const title = card.querySelector('.collection-meta h3');
        const meta = card.querySelector('.collection-meta span');
        applyImage(img, category.image_url, `assets/bouquet-${[1,2,5][index] || 1}.svg`);
        if (title) title.textContent = category.name || `Коллекция ${index + 1}`;
        if (img) img.alt = `${category.name || 'Коллекция'} — SM Flowers`;
        if (meta) meta.textContent = `${String(index + 1).padStart(2,'0')} / коллекция`;
        if (card) card.dataset.categoryId = category.id;
      });
    }
  }

  function renderProducts(products) {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;
    if (!products.length) { grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px">Каталог скоро пополнится.</p>'; return; }
    grid.innerHTML = products.map((p, i) => `
      <article class="product visible" data-reveal="false">
        <div class="product-image"><span class="product-number">${String(i+1).padStart(2,'0')}</span><img class="${p.image_url ? 'sm-image-pending' : ''}" src="${esc(p.image_url || `assets/bouquet-${(i%6)+1}.svg`)}" alt="${esc(p.name)}" loading="eager" onload="this.classList.remove('sm-image-pending')" onerror="this.classList.remove('sm-image-pending');this.onerror=null;this.src='assets/bouquet-${(i%6)+1}.svg'"></div>
        <div class="product-info"><div><h3>${esc(p.name)}</h3><p>${esc(p.description || '')}</p><p><strong>${Number(p.price || 0).toLocaleString('ru-RU')} ₽</strong></p></div><button class="order-button" type="button" data-product-id="${esc(p.id)}">Заказать</button></div>
      </article>`).join('');
  }

  async function loadCatalog() {
    const db = await getClient();
    const { data, error } = await db.from('products').select('id,name,description,price,image_url,is_active,sort_order,created_at,updated_at').eq('is_active', true).order('sort_order', {ascending:true}).order('created_at', {ascending:false});
    if (error) throw error;
    renderProducts(data || []);
  }

  function openModal() {
    const m = document.getElementById('order-modal');
    if (!m) return;
    m.classList.add('open'); m.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open'); document.documentElement.classList.add('modal-open');
  }
  function closeModal() {
    const m = document.getElementById('order-modal');
    if (!m) return;
    m.classList.remove('open'); m.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); document.documentElement.classList.remove('modal-open');
  }

  function showOrderForm(p) {
    const modal = document.getElementById('order-modal'), actions = modal?.querySelector('.modal-actions');
    if (!modal || !actions) return;
    selectedProduct = p;
    const selected = document.getElementById('selected-bouquet');
    if (selected) selected.textContent = `Вы выбрали: «${p.name}»`;
    actions.innerHTML = `<form id="public-order-form" style="display:grid;gap:14px;text-align:left;width:100%">
      <div><strong>${esc(p.name)}</strong> · ${Number(p.price || 0).toLocaleString('ru-RU')} ₽</div>
      <label>Имя<input name="name" required autocomplete="name"></label>
      <label>Телефон<input name="phone" required autocomplete="tel"></label>
      <label>Email<input name="email" type="email" autocomplete="email"></label>
      <label>Адрес доставки<input name="address" autocomplete="street-address"></label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><label>Дата<input name="date" type="date"></label><label>Время<input name="time" placeholder="18:00–20:00"></label></div>
      <label>Комментарий<textarea name="comment" rows="3"></textarea></label>
      <button class="button" type="submit">Оформить заказ</button>
      <div id="public-order-msg" aria-live="polite"></div>
    </form>`;
    actions.querySelector('form').addEventListener('submit', submitOrder);
    openModal();
  }

  async function submitOrder(e) {
    e.preventDefault();
    const form = e.currentTarget, msg = form.querySelector('#public-order-msg'), button = form.querySelector('button[type="submit"]');
    button.disabled = true; button.textContent = 'Отправляем…'; msg.textContent = '';
    try {
      const db = await getClient();
      const fd = new FormData(form);
      const { data: orderId, error } = await db.rpc('create_public_order', {
        p_customer_name: String(fd.get('name') || '').trim(), p_phone: String(fd.get('phone') || '').trim(), p_email: String(fd.get('email') || '').trim() || null,
        p_telegram: null, p_instagram: null, p_delivery_address: String(fd.get('address') || '').trim() || null,
        p_delivery_date: String(fd.get('date') || '') || null, p_delivery_time: String(fd.get('time') || '').trim() || null,
        p_comment: String(fd.get('comment') || '').trim() || null, p_items: [{product_id: selectedProduct.id, quantity: 1}]
      });
      if (error) throw error;
      form.innerHTML = `<div style="text-align:center;padding:20px"><h3>Заказ принят</h3><p>Ваш заказ <strong>#${esc(orderId)}</strong> получен. Мы свяжемся с вами для подтверждения.</p><button type="button" class="button" id="order-done">Закрыть</button></div>`;
      form.querySelector('#order-done').addEventListener('click', closeModal);
    } catch (err) {
      msg.textContent = err?.message || 'Не удалось оформить заказ. Попробуйте ещё раз.'; msg.style.color = '#b3261e'; button.disabled = false; button.textContent = 'Оформить заказ';
    }
  }

  async function init() {
    loadMobileStyles();
    setupMobileMenu();
    setupSafeSitePatches();
    socialLinks();
    try {
      const db = await getClient();
      try { const {data} = await db.from('store_settings').select('store_name,phone,telegram_url,instagram_url,hero_image_url').limit(1).maybeSingle(); if (data) socialLinks(data); } catch (_) {}
      try { await loadAppearance(); } catch (appearanceError) { console.error('SM Flowers appearance error:', appearanceError); }
      await loadCatalog();
    } catch (err) {
      console.error('SM Flowers startup error:', err);
      const grid = document.querySelector('.product-grid');
      if (grid) grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px">Не удалось загрузить каталог. Попробуйте обновить страницу.</p>';
    }
  }

  document.addEventListener('click', async e => {
    const b = e.target.closest('[data-product-id]');
    if (b) {
      e.preventDefault();
      try { const db = await getClient(); const {data,error} = await db.from('products').select('id,name,description,price,image_url').eq('id', b.dataset.productId).eq('is_active',true).maybeSingle(); if (error) throw error; if (data) showOrderForm(data); }
      catch (err) { console.error(err); }
      return;
    }
    if (e.target.closest('.modal-close') || e.target.id === 'order-modal') closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true}); else init();
})();