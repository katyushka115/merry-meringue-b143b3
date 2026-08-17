(() => {
  const IMG = {
    hero: 'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/site-media/e78c8f30-9f27-425f-8ac7-d53eef9dbbb6.jpeg',
    collection1: 'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/collections/fdd4c98a-66dc-4b88-88e3-9266f1a2ddd5.jpeg',
    collection2: 'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/collections/81b226c1-8f99-41a3-a060-f95cadc16431.jpeg',
    collection3: 'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/collections/ddf86b0f-28be-47cd-9df9-b4fb27650ba4.jpeg',
    custom: 'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/site-media/36fe864b-da66-4022-bcda-d81b29c7c83c.jpeg',
    life1: 'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/site-media/aa61840b-6cdc-4995-bc66-254fd06b79c6.jpeg',
    life2: 'https://avlozhwwvjqiypififoxox.supabase.co/storage/v1/object/public/bouquets/site-media/43eded19-9452-4166-94d5-fd30df355827.jpeg',
    life3: 'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/site-media/8477d15f-8019-4764-99e9-989a8e45bb6e.jpeg',
    life4: 'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/site-media/2e58be79-a7b9-4702-8467-3891417abe42.jpeg',
    final: 'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/site-media/870dbd10-0776-463b-8474-af91c6bb648e.jpeg',
    product1: 'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/e496cdb9-a106-4308-8572-f6ca621416a6.jpeg',
    product2: 'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/products/d1f21237-9960-451b-be4f-e605e369dc12.jpeg',
    product3: 'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/products/1f7ad4bc-0680-4a98-a55b-0db7740e0505.jpeg',
    product4: 'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/e4c020f0-bfab-4a1d-86a8-32024b389918.jpeg'
  };

  const TEXT = {
    '.hero-copy .eyebrow': 'Авторская флористика · Москва',
    '#hero-title': 'Цветы, <em>которые</em> говорят',
    '.hero-description p': 'Собираем живые, выразительные букеты — тонко чувствуя человека, повод и настроение.',
    '.hero-actions .button': 'Выбрать букет',
    '.hero-actions .text-link': 'Собрать свой <span class="arrow">↗</span>',
    '.intro .eyebrow': 'О студии',
    '.intro .section-title': 'Создаём не просто букеты, а <em>личные истории</em> из цветов',
    '.intro-text p': 'SM Flowers — камерная флористическая студия в Москве. Мы работаем с сезонными цветами, любим сложные природные оттенки и собираем композиции без повторов.',
    '.intro-text .text-link': 'Наша философия <span class="arrow">↗</span>',
    '.signature': 'С любовью, SM❤️',
    '.collections .section-heading .eyebrow': 'Выберите настроение',
    '#collections-title': 'Коллекции',
    '.collections .section-heading .text-link': 'Смотреть букеты <span class="arrow">→</span>',
    '.statement-copy .eyebrow': 'Букет на заказ',
    '#custom-title': 'Ваша идея.<br><em>Наш язык цветов.</em>',
    '.statement-copy p:nth-of-type(2)': 'Расскажите, для кого букет, какое настроение хочется передать и на какой бюджет ориентироваться. Флорист предложит сочетание и пришлёт фото перед доставкой.',
    '.statement-copy .text-link': 'Обсудить в Telegram <span class="arrow">↗</span>',
    '.products .section-heading .eyebrow': 'Выбор флориста',
    '#products-title': 'Букеты недели',
    '.products .section-heading > p': 'Состав может незначительно меняться в зависимости от свежей поставки.',
    '.values-intro .eyebrow': 'Почему SM Flowers',
    '#values-title': 'Красота<br><em>в деталях</em>',
    '.values-intro > p:last-child': 'От первого сообщения до вручения букета — спокойно, бережно и с безупречным вниманием.',
    '.value-item:nth-child(1) h3': 'Свежие поставки',
    '.value-item:nth-child(1) p': 'Отбираем цветы вручную и работаем только с теми, чья свежесть не вызывает сомнений.',
    '.value-item:nth-child(2) h3': 'Авторская сборка',
    '.value-item:nth-child(2) p': 'Не копируем букеты один в один — сохраняем настроение, но создаём уникальную композицию.',
    '.value-item:nth-child(3) h3': 'Бесплатная доставка от 1 часа',
    '.value-item:nth-child(3) p': 'Бережно доставляем по Москве и ближайшему Подмосковью ежедневно с 10:00 до 24:00.',
    '.value-item:nth-child(4) h3': 'Фото перед отправкой',
    '.value-item:nth-child(4) p': 'Покажем готовый букет до передачи курьеру, чтобы вы были уверены в каждой детали.',
    '.gallery .section-heading .eyebrow': 'Жизнь студии',
    '#gallery-title': '@smflowers.msk',
    '.gallery .section-heading .text-link': 'Смотреть Instagram <span class="arrow">↗</span>',
    '.final-copy .eyebrow': 'Когда слова не нужны',
    '#final-title': 'Подарите<br><em>живые эмоции</em>',
    '.final-copy > p:nth-of-type(2)': 'Позвоните или напишите нам — поможем выбрать букет, уточним детали и организуем бережную доставку по Москве.',
    '.final-actions .button--light': 'Позвонить',
    '.final-actions .button--outline': 'Написать в Telegram',
    '.footer-brand': 'SM Flowers',
    '.footer-column:nth-child(2) h3': 'Навигация',
    '.footer-column:nth-child(3) h3': 'Контакты',
    '.footer-column:nth-child(4) h3': 'Студия',
    '.footer-column:nth-child(4) p:first-of-type': 'г. Москва, Ленинский проспект, 94А',
    '.footer-bottom span:first-child': '© 2026 SM Flowers',
    '.footer-bottom span:last-child': 'Авторская флористика · Москва'
  };

  const TELEGRAM = 'https://t.me/smflowersmsk';
  const INSTAGRAM = 'https://www.instagram.com/smflowers.msk?igsh=enFqZGtuaW1qNWRi&utm_source=qr';
  const MAP = 'https://yandex.ru/maps/?text=' + encodeURIComponent('г. Москва, Ленинский проспект, 94А');

  const style = document.createElement('style');
  style.textContent = '.sm-image-pending{visibility:visible!important;opacity:1!important}.hero-visual .hero-note,.sm-hero-note-fallback,.sm-life-unique-note{display:none!important}';
  document.head.appendChild(style);

  function paintText() {
    for (const [selector, value] of Object.entries(TEXT)) {
      const el = document.querySelector(selector);
      if (el) el.innerHTML = value;
    }
    document.querySelectorAll('.hero-note, .sm-hero-note-fallback, .sm-life-unique-note').forEach(el => el.remove());
    const address = document.querySelector('.footer-column:nth-child(4) p:first-of-type');
    if (address && !address.parentElement.querySelector('.sm-studio-route-link')) {
      const link = document.createElement('a');
      link.className = 'sm-studio-route-link'; link.href = MAP; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = '📍 Построить маршрут →';
      address.parentElement.appendChild(link);
    }
    document.querySelectorAll('a').forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      const text = (a.textContent || '').toLowerCase();
      if (href.includes('instagram.com') || text.includes('instagram')) { a.href = INSTAGRAM; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      if (href.includes('t.me/') || text.includes('telegram')) { a.href = TELEGRAM; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    });
  }

  function preload(src, priority = false) {
    const link = document.createElement('link'); link.rel = 'preload'; link.as = 'image'; link.href = src;
    if (priority) link.fetchPriority = 'high'; document.head.appendChild(link);
  }

  function paintImages() {
    [IMG.hero, IMG.collection1, IMG.collection2, IMG.collection3, IMG.custom, IMG.life1, IMG.life2, IMG.life3, IMG.life4, IMG.final, IMG.product1, IMG.product2, IMG.product3, IMG.product4].forEach((src, i) => preload(src, i === 0));
    const hero = document.querySelector('.hero-visual img');
    if (hero) { hero.src = IMG.hero; hero.loading = 'eager'; hero.fetchPriority = 'high'; hero.decoding = 'async'; }
    document.querySelectorAll('.collection-card img').forEach((img, i) => { const src=[IMG.collection1,IMG.collection2,IMG.collection3][i]; if(src){img.src=src;img.loading='eager';img.decoding='async';} });
    const custom = document.querySelector('.statement-art img'); if (custom) { custom.src=IMG.custom; custom.loading='eager'; custom.decoding='async'; }
    document.querySelectorAll('.gallery-item img').forEach((img,i)=>{const src=[IMG.life1,IMG.life2,IMG.life3,IMG.life4][i];if(src){img.src=src;img.loading='eager';img.decoding='async';}});
    const final = document.querySelector('.final-art img'); if (final) { final.src=IMG.final; final.loading='eager'; final.decoding='async'; }
  }

  paintText();
  paintImages();

  const load = src => new Promise((resolve, reject) => { const s=document.createElement('script'); s.src=src; s.onload=resolve; s.onerror=reject; document.body.appendChild(s); });
  load('assets/order-flow-core.js?v=20260817-fast2').then(() => load('assets/studio-contact-order.js?v=20260817-fast2')).catch(err => console.error('SM Flowers loader error:', err));
})();