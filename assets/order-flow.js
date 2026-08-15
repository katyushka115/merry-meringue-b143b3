(() => {
  const supabaseClient = window.smSupabase || window.supabase;
  if (!supabaseClient) return;

  let selectedProduct = null;

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));
  }

  async function loadStoreSettings() {
    const { data } = await supabaseClient.from('store_settings').select('store_name,phone,telegram_url,instagram_url').limit(1).maybeSingle();
    if (!data) return;
    if (data.store_name) {
      document.querySelectorAll('.brand strong,.footer-brand').forEach(el => { el.textContent = data.store_name; });
      document.title = `${data.store_name} — авторская флористика в Москве`;
    }
    if (data.phone) {
      const cleanPhone = data.phone.replace(/[^+\d]/g, '');
      document.querySelectorAll('a[href^="tel:"]').forEach(el => { el.href = `tel:${cleanPhone}`; el.textContent = data.phone; });
    }
    if (data.telegram_url) document.querySelectorAll('a[href*="t.me/"]').forEach(el => { el.href = data.telegram_url; });
    if (data.instagram_url) document.querySelectorAll('a[href*="instagram.com/"]').forEach(el => { el.href = data.instagram_url; });
  }

  function renderOrderForm(product) {
    const modal = document.getElementById('order-modal');
    const actions = modal?.querySelector('.modal-actions');
    if (!modal || !actions) return;

    selectedProduct = product;
    actions.innerHTML = `
      <form id="public-order-form" style="width:100%;display:grid;gap:14px;text-align:left">
        <div style="font-weight:600">${escapeHtml(product.name)} · ${Number(product.price).toLocaleString('ru-RU')} ₽</div>
        <label>Имя<input name="name" required autocomplete="name" style="width:100%;padding:12px;border:1px solid #d9d4cc;margin-top:5px"></label>
        <label>Телефон<input name="phone" required autocomplete="tel" style="width:100%;padding:12px;border:1px solid #d9d4cc;margin-top:5px"></label>
        <label>Email<input name="email" type="email" autocomplete="email" style="width:100%;padding:12px;border:1px solid #d9d4cc;margin-top:5px"></label>
        <label>Адрес доставки<input name="address" autocomplete="street-address" style="width:100%;padding:12px;border:1px solid #d9d4cc;margin-top:5px"></label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <label>Дата<input name="date" type="date" style="width:100%;padding:12px;border:1px solid #d9d4cc;margin-top:5px"></label>
          <label>Время<input name="time" placeholder="например, 18:00–20:00" style="width:100%;padding:12px;border:1px solid #d9d4cc;margin-top:5px"></label>
        </div>
        <label>Комментарий<textarea name="comment" rows="3" style="width:100%;padding:12px;border:1px solid #d9d4cc;margin-top:5px;resize:vertical"></textarea></label>
        <button class="button" type="submit">Оформить заказ</button>
        <div id="public-order-msg" aria-live="polite"></div>
      </form>`;

    document.getElementById('public-order-form').addEventListener('submit', submitOrder);
  }

  async function submitOrder(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const msg = document.getElementById('public-order-msg');
    const submit = form.querySelector('button[type="submit"]');
    const data = new FormData(form);
    submit.disabled = true;
    submit.textContent = 'Отправляем…';
    msg.textContent = '';

    try {
      const { data: orderId, error } = await supabaseClient.rpc('create_public_order', {
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

      form.innerHTML = `
        <div style="text-align:center;padding:18px 0">
          <h3 style="font-family:var(--serif);font-size:36px;margin:0 0 12px">Заказ принят</h3>
          <p>Спасибо! Ваш заказ <strong>#${escapeHtml(orderId)}</strong> получен. Мы свяжемся с вами для подтверждения деталей.</p>
          <button type="button" class="button" id="order-done">Закрыть</button>
        </div>`;
      document.getElementById('order-done').addEventListener('click', () => document.querySelector('.modal-close')?.click());
    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
      msg.textContent = error?.message || 'Не удалось оформить заказ. Попробуйте ещё раз.';
      msg.style.color = '#b3261e';
      submit.disabled = false;
      submit.textContent = 'Оформить заказ';
    }
  }

  document.addEventListener('click', async event => {
    const button = event.target.closest('[data-bouquet]');
    if (!button) return;
    event.preventDefault();
    const name = button.dataset.bouquet;
    const { data, error } = await supabaseClient.from('products').select('id,name,price,image_url').eq('name', name).eq('is_active', true).limit(1).maybeSingle();
    if (error || !data) return;
    const selected = document.getElementById('selected-bouquet');
    if (selected) selected.textContent = `Вы выбрали: «${data.name}»`;
    renderOrderForm(data);
  }, true);

  loadStoreSettings();
})();
