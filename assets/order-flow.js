(() => {
  const SUPABASE_URL = 'https://avlozhwwvjqiypifoxox.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_3FgdTAmKB8kw2QTrrVPA5g_vb1lya1d';
  const SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
  const TELEGRAM = 'https://t.me/smflowersmsk';
  const INSTAGRAM = 'https://www.instagram.com/smflowers.msk?igsh=enFqZGtuaW1qNWRi&utm_source=qr';
  let client = null;
  let selectedProduct = null;

  const esc = v => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-sm-supabase="${src}"]`);
      if (existing) { existing.addEventListener('load', resolve, {once:true}); existing.addEventListener('error', reject, {once:true}); return; }
      const s = document.createElement('script');
      s.type = 'module'; s.src = src; s.dataset.smSupabase = src;
      s.onload = resolve; s.onerror = reject; document.head.appendChild(s);
    });
  }

  async function getClient() {
    if (client?.rpc) return client;
    if (window.smSupabase?.rpc) { client = window.smSupabase; return client; }
    if (window.supabase?.createClient) { client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY); return client; }
    if (!window.__smSupabaseModulePromise) {
      window.__smSupabaseModulePromise = import(SUPABASE_CDN).then(mod => {
        const createClient = mod.createClient || mod.default?.createClient;
        if (!createClient) throw new Error('Supabase SDK не загрузился');
        return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
      });
    }
    client = await window.__smSupabaseModulePromise;
    window.smSupabase = client;
    return client;
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
    if (url) {
      img.src = url;
      img.onerror = () => { img.onerror = null; if (fallback) img.src = fallback; };
    }
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
        <div class="product-image"><span class="product-number">${String(i+1).padStart(2,'0')}</span><img src="${esc(p.image_url || `assets/bouquet-${(i%6)+1}.svg`)}" alt="${esc(p.name)}" loading="eager" onerror="this.onerror=null;this.src='assets/bouquet-${(i%6)+1}.svg'"></div>
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
