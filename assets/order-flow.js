(() => {
  let selectedProduct = null;
  let initialized = false;
  const FALLBACK_TELEGRAM = 'https://t.me/smflowersmsk';
  const FALLBACK_INSTAGRAM = 'https://www.instagram.com/smflowers.msk?igsh=enFqZGtuaW1qNWRi&utm_source=qr';
  const FALLBACK_PRODUCTS = [
    { id: 1, name: 'Букет нежных роз', description: 'Нежная композиция из свежих роз.', price: 2500, image_url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946', is_active: true, sort_order: 1 },
    { id: 2, name: 'Букет тюльпанов', description: 'Свежие тюльпаны в лёгкой весенней композиции.', price: 1800, image_url: 'https://images.unsplash.com/photo-1520763185298-1b434c919102', is_active: true, sort_order: 2 },
    { id: 3, name: 'Букет полевых цветов', description: 'Природная композиция с полевыми цветами.', price: 2000, image_url: 'https://images.unsplash.com/photo-1495231916356-a86217efff12', is_active: true, sort_order: 3 }
  ];

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;', "'":'&#039;' }[c]));
  }

  function getClient() { return window.smSupabase || window.supabase || null; }

  function setSocialLinks(telegramUrl = FALLBACK_TELEGRAM, instagramUrl = FALLBACK_INSTAGRAM) {
    const tg = telegramUrl || FALLBACK_TELEGRAM;
    const ig = instagramUrl || FALLBACK_INSTAGRAM;
    document.querySelectorAll('a').forEach(link => {
      const href = String(link.getAttribute('href') || '').toLowerCase();
      const text = String(link.textContent || '').toLowerCase();
      const label = String(link.getAttribute('aria-label') || '').toLowerCase();
      if (href.includes('t.me/') || text.includes('telegram') || label.includes('telegram')) {
        link.href = tg; link.target = '_blank'; link.rel = 'noopener noreferrer';
      }
      if (href.includes('instagram.com/') || text.includes('instagram') || label.includes('instagram')) {
        link.href = ig; link.target = '_blank'; link.rel = 'noopener noreferrer';
      }
    });
  }

  async function loadStoreSettings(client) {
    setSocialLinks();
    try {
      const { data, error } = await client.from('store_settings').select('store_name,phone,telegram_url,instagram_url').limit(1).maybeSingle();
      if (error || !data) return;
      if (data.store_name) {
        document.querySelectorAll('.brand strong,.footer-brand').forEach(el => el.textContent = data.store_name);
        document.title = `${data.store_name} — авторская флористика в Москве`;
      }
      if (data.phone) {
        const cleanPhone = data.phone.replace(/[^+\d]/g, '');
        document.querySelectorAll('a[href^="tel:"]').forEach(el => { el.href = `tel:${cleanPhone}`; if (el.textContent.trim()) el.textContent = data.phone; });
      }
      setSocialLinks(data.telegram_url, data.instagram_url);
    } catch (e) {
      setSocialLinks();
    }
  }

  function makeProductCard(product, index) {
    return `
      <article class="product" data-reveal="false">
        <div class="product-image"><span class="product-number">${String(index + 1).padStart(2, '0')}</span><img src="${escapeHtml(product.image_url || `assets/bouquet-${(index % 6) + 1}.svg`)}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.onerror=null;this.src='assets/bouquet-${(index % 6) + 1}.svg'"></div>
        <div class="product-info"><div><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.description || '')}</p><p style="margin-top:8px"><strong>${Number(product.price).toLocaleString('ru-RU')} ₽</strong></p></div><button class="order-button" type="button" data-product-id="${escapeHtml(product.id)}">Заказать</button></div>
      </article>`;
  }

  function renderProducts(products) {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;
    if (!products.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;padding:40px 0;text-align:center">Каталог скоро пополнится.</div>';
      return;
    }
    grid.innerHTML = products.map(makeProductCard).join('');
    // Products are injected after the page-level IntersectionObserver is created.
    // Do not leave dynamically created cards hidden by [data-reveal].
    grid.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible'));
  }

  async function loadProducts(client) {
    try {
      const { data, error } = await client.from('products').select('id,name,description,price,image_url,is_active,is_featured,sort_order,created_at').eq('is_active', true).order('sort_order', { ascending: true }).order('created_at', { ascending: false });
      if (error) throw error;
      renderProducts(data?.length ? data : FALLBACK_PRODUCTS);
    } catch (error) {
      console.error('SM Flowers catalog error:', error);
      renderProducts(FALLBACK_PRODUCTS);
    }
  }

  function openOrderModal() {
    const modal = document.getElementById('order-modal');
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeOrderModal() {
    const modal = document.getElementById('order-modal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  function renderOrderForm(product) {
    const modal = document.getElementById('order-modal');
    const actions = modal?.querySelector('.modal-actions');
    if (!modal || !actions) return;
    selectedProduct = product;
    const selected = document.getElementById('selected-bouquet');
    if (selected) selected.textContent = `Вы выбрали: «${product.name}»`;
    actions.innerHTML = `<form id="public-order-form" style="width:100%;display:grid;gap:14px;text-align:left"><div style="font-weight:600">${escapeHtml(product.name)} · ${Number(product.price).toLocaleString('ru-RU')} ₽</div><label>Имя<input name="name" required autocomplete="name" style="width:100%;padding:12px;border:1px solid #d9d4cc;margin-top:5px"></label><label>Телефон<input name="phone" required autocomplete="tel" style="width:100%;padding:12px;border:1px solid #d9d4cc;margin-top:5px"></label><label>Email<input name="email" type="email" autocomplete="email" style="width:100%;padding:12px;border:1px solid #d9d4cc;margin-top:5px"></label><label>Адрес доставки<input name="address" autocomplete="street-address" style="width:100%;padding:12px;border:1px solid #d9d4cc;margin-top:5px"></label><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><label>Дата<input name="date" type="date" style="width:100%;padding:12px;border:1px solid #d9d4cc;margin-top:5px"></label><label>Время<input name="time" placeholder="например, 18:00–20:00" style="width:100%;padding:12px;border:1px solid #d9d4cc;margin-top:5px"></label></div><label>Комментарий<textarea name="comment" rows="3" style="width:100%;padding:12px;border:1px solid #d9d4cc;margin-top:5px;resize:vertical"></textarea></label><button class="button" type="submit">Оформить заказ</button><div id="public-order-msg" aria-live="polite"></div></form>`;
    document.getElementById('public-order-form')?.addEventListener('submit', submitOrder);
    openOrderModal();
  }

  async function submitOrder(event) {
    event.preventDefault();
    const client = getClient();
    if (!client || !selectedProduct) return;
    const form = event.currentTarget;
    const msg = document.getElementById('public-order-msg');
    const submit = form.querySelector('button[type="submit"]');
    const data = new FormData(form);
    submit.disabled = true;
    submit.textContent = 'Отправляем…';
    msg.textContent = '';
    try {
      const { data: orderId, error } = await client.rpc('create_public_order', {
        p_customer_name: String(data.get('name') || '').trim(),
        p_phone: String(data.get('phone') || '').trim(),
        p_email: String(data.get('email') || '').trim() || null,
        p_telegram: null,
        p_instagram: null,
        p_delivery_address: String(data.get('address') || '').trim() || null,
        p_delivery_date: String(data.get('date') || '') || null,
        p_delivery_time: String(data.get('time') || '').trim() || null,
        p_comment: String(data.get('comment') || '').trim() || null,
        p_items: [{ product_id: selectedProduct.id, quantity: 1 }]
      });
      if (error) throw error;
      form.innerHTML = `<div style="text-align:center;padding:18px 0"><h3 style="font-family:var(--serif);font-size:36px;margin:0 0 12px">Заказ принят</h3><p>Спасибо! Ваш заказ <strong>#${escapeHtml(orderId)}</strong> получен. Мы свяжемся с вами для подтверждения деталей.</p><button type="button" class="button" id="order-done">Закрыть</button></div>`;
      document.getElementById('order-done')?.addEventListener('click', closeOrderModal);
    } catch (error) {
      msg.textContent = error?.message || 'Не удалось оформить заказ. Попробуйте ещё раз.';
      msg.style.color = '#b3261e';
      submit.disabled = false;
      submit.textContent = 'Оформить заказ';
    }
  }

  async function selectProduct(productId) {
    const client = getClient();
    if (!client) {
      const fallback = FALLBACK_PRODUCTS.find(p => String(p.id) === String(productId));
      if (fallback) renderOrderForm(fallback);
      return;
    }
    try {
      const { data, error } = await client.from('products').select('id,name,price,image_url').eq('id', productId).eq('is_active', true).maybeSingle();
      if (error || !data) throw error || new Error('Букет недоступен');
      renderOrderForm(data);
    } catch (error) {
      const fallback = FALLBACK_PRODUCTS.find(p => String(p.id) === String(productId));
      if (fallback) renderOrderForm(fallback);
    }
  }

  function bindInteractions() {
    if (initialized) return;
    initialized = true;
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-product-id]');
      if (button) {
        event.preventDefault();
        selectProduct(button.dataset.productId);
        return;
      }
      if (event.target.closest('.modal-close')) closeOrderModal();
      if (event.target.id === 'order-modal') closeOrderModal();
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeOrderModal(); });
  }

  async function init() {
    const client = getClient();
    if (!client) {
      setSocialLinks();
      setTimeout(init, 300);
      return;
    }
    bindInteractions();
    setSocialLinks();
    await Promise.all([loadStoreSettings(client), loadProducts(client)]);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
