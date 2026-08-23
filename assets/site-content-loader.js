(() => {
  const MAP = 'https://yandex.ru/maps/?text=' + encodeURIComponent('г. Москва, Ленинский проспект, 94А');
  const INSTAGRAM = 'https://www.instagram.com/smflowers.msk/';
  const TELEGRAM = 'https://t.me/smflowers_msk';
  const SUPABASE_ORIGIN = 'https://avlozhwwvjqiypifoxox.supabase.co';
  const FALLBACK_PRODUCTS = [
    {id:4,name:'Летнее настроение',description:'Нежная гортензия и пионы',price:6500,old_price:null,image_url:'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/e4c020f0-bfab-4a1d-86a8-32024b389918.jpeg'},
    {id:2,name:'Белая нежность',description:'Нежный весенний букет',price:4800,old_price:2200,image_url:'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/products/d1f21237-9960-451b-be4f-e605e369dc12.jpeg'},
    {id:1,name:'Букет нежных роз',description:'Красивый букет белых роз',price:5500,old_price:3000,image_url:'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/e496cdb9-a106-4308-8572-f6ca621416a6.jpeg'},
    {id:3,name:'Нежность в деталях',description:'Букет из нежных лилий с яркой гортензией',price:6300,old_price:null,image_url:'https://avlozhwwvjqiypifoxox.supabase.co/storage/v1/object/public/bouquets/products/1f7ad4bc-0680-4a98-a55b-0db7740e0505.jpeg'}
  ];
  const setText=(el,value)=>{if(el)el.textContent=String(value??'');};
  const setHref=(el,value)=>{if(el&&value){el.href=value;el.target='_blank';el.rel='noopener noreferrer';}};
  const escapeHtml=value=>String(value??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

  function setupMobileMenu(){
    const toggle=document.querySelector('.menu-toggle'),nav=document.getElementById('main-nav');
    if(!toggle||!nav||toggle.dataset.menuLoaderReady==='true')return;
    toggle.dataset.menuLoaderReady='true';
    const setOpen=open=>{document.body.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');};
    toggle.addEventListener('click',e=>{e.preventDefault();setOpen(!document.body.classList.contains('menu-open'));});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false);});
  }

  function applyFallbackContent(){
    const defaults={'.collections .section-heading .eyebrow':'Выберите настроение','#collections-title':'Коллекции','.value-item:nth-child(3) p':'Бесплатная доставка от 1 часа','#gallery-title':'@smflowers.msk','.footer-column:nth-child(4) p:first-of-type':'Москва, Ленинский проспект, 94А'};
    Object.entries(defaults).forEach(([s,v])=>setText(document.querySelector(s),v));
    const address=document.querySelector('.footer-column:nth-child(4) p:first-of-type');
    if(address){let link=address.parentElement.querySelector('.sm-studio-route-link');if(!link){link=document.createElement('a');link.className='sm-studio-route-link';address.parentElement.appendChild(link);}setHref(link,MAP);link.textContent='📍 Построить маршрут →';}
  }

  function applyContent(rows){
    const m=Object.fromEntries((rows||[]).map(r=>[r.content_key,r]));
    const put=(key,selector)=>{const el=document.querySelector(selector);if(el&&m[key]?.is_visible)setText(el,m[key].content);};
    const putSignature=(key,selector)=>{const el=document.querySelector(selector);if(el&&m[key]?.is_visible)el.innerHTML=escapeHtml(m[key].content).replace('❤️','<span aria-hidden="true">❤️</span>');};
    const putSignature=(key,selector)=>{const el=document.querySelector(selector);if(el&&m[key]?.is_visible)el.innerHTML=escapeHtml(m[key].content).replace(/❤️/g,'<span aria-hidden="true">❤️</span>');};
    [['hero_eyebrow','.hero-copy .eyebrow'],['hero_title','#hero-title'],['hero_description','.hero-description p'],['hero_primary_button','.hero-actions .button'],['hero_secondary_button','.hero-actions .text-link'],['about_eyebrow','.intro .eyebrow'],['about_title','.intro .section-title'],['about_text','.intro-text p'],['about_link','.intro-text .text-link'],['collections_eyebrow','.collections .section-heading .eyebrow'],['collections_title','#collections-title'],['custom_eyebrow','.statement-copy .eyebrow'],['custom_title','#custom-title'],['custom_text','.statement-copy p:nth-of-type(2)'],['custom_link','.statement-copy .text-link'],['bouquets_eyebrow','.products .section-heading .eyebrow'],['bouquets_title','#products-title'],['bouquets_note','.products .section-heading > p'],['values_eyebrow','.values-intro .eyebrow'],['values_title','#values-title'],['values_intro','.values-intro > p:last-child'],['life_eyebrow','.gallery .section-heading .eyebrow'],['life_instagram_handle','#gallery-title'],['life_instagram_button','.gallery .section-heading .text-link'],['final_eyebrow','.final-copy .eyebrow'],['final_title','#final-title'],['final_text','.final-copy > p:nth-of-type(2)'],['footer_brand','.footer-brand'],['studio_address','.footer-column:nth-child(4) p:first-of-type'],['footer_copyright','.footer-bottom span:first-child'],['footer_tagline','.footer-bottom span:last-child']].forEach(([k,s])=>put(k,s));
    putSignature('about_signature','.signature');
    putSignature('about_signature','.signature');
    ['1','2','3','4'].forEach(n=>{put(`value_${n}_title`,`.value-item:nth-child(${n}) h3`);put(`value_${n}_text`,`.value-item:nth-child(${n}) p`);});
    setText(document.querySelector('.value-item:nth-child(3) p'),'Бесплатная доставка от 1 часа');
    setText(document.querySelector('#gallery-title'),'@smflowers.msk');
    const address=document.querySelector('.footer-column:nth-child(4) p:first-of-type');
    if(address){let link=address.parentElement.querySelector('.sm-studio-route-link');if(!link){link=document.createElement('a');link.className='sm-studio-route-link';address.parentElement.appendChild(link);}setHref(link,m.studio_map_url?.content||MAP);link.textContent='📍 '+(m.studio_map_label?.is_visible?m.studio_map_label.content:'Построить маршрут →');}
    const instagram=m.life_instagram_url?.content||INSTAGRAM,telegram=m.final_telegram_url?.content||TELEGRAM;
    document.querySelectorAll('a').forEach(a=>{const href=(a.getAttribute('href')||'').toLowerCase(),label=(a.textContent||'').toLowerCase();if(href.includes('instagram.com')||label.includes('instagram'))setHref(a,instagram);if(href.includes('t.me')||href.includes('telegram')||label.includes('telegram'))setHref(a,telegram);});
  }

  const proxifyImage=url=>{if(!url)return'assets/bouquet-6.svg';try{const u=new URL(url,location.href);if(u.origin===SUPABASE_ORIGIN&&u.pathname.startsWith('/storage/v1/object/public/bouquets/'))return'/media/product/'+u.pathname.replace('/storage/v1/object/public/bouquets/','');if(u.origin===SUPABASE_ORIGIN&&u.pathname.startsWith('/storage/'))return'/supabase'+u.pathname+u.search;}catch(_){}return url;};

  function renderProducts(data){
    const grid=document.getElementById('product-grid');if(!grid)return;
    const items=Array.isArray(data)&&data.length?data:FALLBACK_PRODUCTS;
    grid.innerHTML=items.map((product,index)=>{const oldPrice=product.old_price?`<del>${Number(product.old_price).toLocaleString('ru-RU')} ₽</del>`:'';const price=product.price?`${Number(product.price).toLocaleString('ru-RU')} ₽`:'';const name=escapeHtml(product.name||'Букет'),description=escapeHtml(product.description||''),image=proxifyImage(product.image_url);return `<article class="product"><div class="product-image"><span class="product-number">${String(index+1).padStart(2,'0')}</span><img src="${escapeHtml(image)}" alt="${name}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='assets/bouquet-6.svg'"></div><div class="product-info"><div><h3>${name}</h3><p>${description}</p><p style="margin-top:8px;">${oldPrice} <strong>${price}</strong></p></div><button class="order-button" type="button" data-bouquet="${name}">Заказать</button></div></article>`;}).join('');
    grid.querySelectorAll('[data-bouquet]').forEach(button=>button.addEventListener('click',()=>{const modal=document.getElementById('order-modal'),selected=document.getElementById('selected-bouquet');if(selected)selected.textContent=`Вы выбрали: «${button.dataset.bouquet}»`;if(modal){modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');}}));
  }

  async function loadCollections(){
    const cards=[...document.querySelectorAll('.collection-card')];if(!cards.length)return;
    try{const r=await fetch('/supabase/rest/categories?select=id,name,slug,image_url,is_active,sort_order&is_active=eq.true&order=sort_order.asc',{headers:{Accept:'application/json'},cache:'no-store'});if(!r.ok)throw new Error(`HTTP ${r.status}`);const data=await r.json();if(!Array.isArray(data)||!data.length)return;data.slice(0,cards.length).forEach((c,i)=>{const card=cards[i],title=card.querySelector('.collection-meta h3'),img=card.querySelector('img');if(title)setText(title,c.name);if(img){if(c.image_url)img.src=proxifyImage(c.image_url);img.alt=`${c.name} — коллекция букетов`;img.loading='eager';}});}catch(e){console.warn('SM Flowers collections:',e);}
  }

  async function loadProducts(){
    renderProducts(FALLBACK_PRODUCTS);
    try{const r=await fetch('/supabase/rest/products?select=id,name,description,price,old_price,image_url,is_active,is_featured,sort_order&is_active=eq.true&order=sort_order.asc',{headers:{Accept:'application/json'},cache:'no-store'});if(!r.ok)throw new Error(`HTTP ${r.status}`);const data=await r.json();if(Array.isArray(data)&&data.length)renderProducts(data);}catch(e){console.warn('SM Flowers products:',e);}
  }

  async function run(){
    applyFallbackContent();
    const contentUrl='/supabase/rest/site_content?select=content_key%2Ccontent%2Csection%2Cis_visible%2Csort_order&is_visible=eq.true&order=section.asc%2Csort_order.asc';
    try{const r=await fetch(contentUrl,{headers:{Accept:'application/json'},cache:'no-store'});if(!r.ok)throw new Error(`HTTP ${r.status}`);const data=await r.json();if(Array.isArray(data))applyContent(data);}catch(e){console.warn('SM Flowers content:',e);}
    await Promise.all([loadCollections(),loadProducts()]);
  }

  const boot=()=>{setupMobileMenu();run();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
