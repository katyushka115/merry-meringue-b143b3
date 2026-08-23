(() => {
  const IMG = {
    hero: '/media/hero.jpg',
    collection1: '/media/collection-1.jpg',
    collection2: '/media/collection-2.jpg',
    collection3: '/media/collection-3.jpg',
    custom: '/media/custom.jpg',
    life1: '/media/life-1.jpg',
    life2: '/media/life-2.jpg',
    life3: '/media/life-3.jpg',
    life4: '/media/life-4.jpg',
    final: '/media/final.jpg'
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
  style.textContent = '.sm-image-pending{visibility:visible!important;opacity:1!important}.hero-visual .hero-note,.sm-hero-note-fallback,.sm-life-unique-note{display:none!important}.sm-studio-route-link{display:inline-flex;align-items:center;gap:7px;margin-top:10px;color:inherit;text-decoration:underline;text-underline-offset:4px}';
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

  function optimized(src, width) {
    if (typeof src === 'string' && src.startsWith('/')) return src;
    try {
      const u = new URL(src);
      u.pathname = u.pathname.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
      u.searchParams.set('width', String(width));
      u.searchParams.set('quality', '78');
      u.searchParams.set('resize', 'cover');
      return u.toString();
    } catch (_) { return src; }
  }

  function setImage(img, src, width, priority = false) {
    if (!img || !src) return;
    img.src = optimized(src, width);
    img.loading = priority ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.fetchPriority = priority ? 'high' : 'low';
  }

  function paintImages() {
    setImage(document.querySelector('.hero-visual img'), IMG.hero, 1500, true);
    document.querySelectorAll('.collection-card img').forEach((img, i) => setImage(img, [IMG.collection1, IMG.collection2, IMG.collection3][i], 1000, false));
    setImage(document.querySelector('.statement-art img'), IMG.custom, 1000, false);
    document.querySelectorAll('.gallery-item img').forEach((img, i) => setImage(img, [IMG.life1, IMG.life2, IMG.life3, IMG.life4][i], 900, false));
    setImage(document.querySelector('.final-art img'), IMG.final, 1100, false);
  }

  paintText();
  paintImages();

  const load = src => new Promise((resolve, reject) => { const s=document.createElement('script'); s.src=src; s.onload=resolve; s.onerror=reject; document.body.appendChild(s); });
  load('assets/order-flow-core.js?v=20260821-fast6').then(() => load('assets/studio-contact-order.js?v=20260821-fast6')).catch(err => console.error('SM Flowers loader error:', err));
})();