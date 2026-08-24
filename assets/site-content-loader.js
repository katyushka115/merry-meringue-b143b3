/* Dynamic site content loader: admin-managed Supabase data through same-origin proxy. */
(()=>{
  const API='/supabase';
  const MEDIA='/media';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const text=(s,v)=>{const e=document.querySelector(s);if(e)e.textContent=v};
  const json=async(path,opts={})=>{const r=await fetch(API+path,{...opts,headers:{'Accept':'application/json','Content-Type':'application/json',...(opts.headers||{})}});if(!r.ok)throw new Error(`${r.status} ${await r.text()}`);return r.json()};
  const contentMap={
    'Главная':[['.hero-copy .eyebrow','eyebrow'],['#hero-title','title'],['.hero-description p','description'],['.hero-actions .button','primary_cta'],['.hero-actions .text-link','secondary_cta']],
    'О студии':[['.intro .eyebrow','eyebrow'],['.intro .section-title','title'],['.intro-text p','description'],['.intro-text .text-link','link'],['.signature','signature']],
    'Коллекции':[['.collections .section-heading .eyebrow','eyebrow'],['#collections-title','title'],['.section-heading a.text-link','link']],
    'На заказ':[['.statement-copy .eyebrow','eyebrow'],['#custom-title','title'],['.statement-copy p:nth-of-type(2)','description'],['.statement-copy .text-link','link']],
    'Букеты':[['.products .section-heading .eyebrow','eyebrow'],['#products-title','title'],['.products .section-heading > p','description']],
    'Философия':[['.values-intro .eyebrow','eyebrow'],['#values-title','title'],['.values-intro > p:last-child','description']],
    'Жизнь студии':[['.gallery .section-heading .eyebrow','eyebrow'],['#gallery-title','title'],['.gallery .section-heading .text-link','link']],
    'Финальный блок':[['.final-copy .eyebrow','eyebrow'],['#final-title','title'],['.final-copy > p:nth-of-type(2)','description'],['.final-actions .button','primary_cta'],['.final-actions .button--outline','secondary_cta']],
    'Контакты':[['.footer-brand','brand'],['.footer-column:nth-child(1) h3','nav_title'],['.footer-column:nth-child(2) h3','contacts_title'],['.footer-column:nth-child(3) h3','studio_title'],['.footer-column:nth-child(3) p:first-of-type','address'],['.footer-column:nth-child(3) p:last-of-type','hours'],['.footer-bottom span:first-child','copyright'],['.footer-bottom span:last-child','tagline']]
  };
  function applyTexts(rows){for(const row of rows||[]){if(row.is_visible===false)continue;for(const [selector,key] of (contentMap[row.section]||[]))if(row.content_key===key)text(selector,row.content)}}
  async function loadTexts(){const rows=await json('/rest/v1/site_content?select=section,content_key,content,is_visible&is_visible=eq.true&order=sort_order.asc');applyTexts(rows)}
  async function loadMedia(){const rows=await json('/rest/v1/site_media?select=section,slot_key,image_url,alt_text,is_visible,sort_order&is_visible=eq.true&order=sort_order.asc');
    const by=(section,slot)=>rows.find(x=>x.section===section&&x.slot_key===slot)?.image_url;
    const set=(sel,url)=>{const e=document.querySelector(sel);if(e&&url)e.src=url.startsWith('http')?url:(MEDIA+url)};
    set('.hero-visual img',by('Главная','hero')||'/hero.jpg');set('.statement-art img',by('На заказ','custom')||'/custom.jpg');set('.final-art img',by('Финальный блок','final')||'/final.jpg');
    document.querySelectorAll('.collection-card img').forEach((e,i)=>{const u=by('Коллекции',`collection-${i+1}`);if(u)e.src=u.startsWith('http')?u:(MEDIA+u)});
    document.querySelectorAll('.gallery-item img').forEach((e,i)=>{const u=by('Жизнь студии',`life-${i+1}`)||by('life_studio',`life-${i+1}`);if(u)e.src=u.startsWith('http')?u:(MEDIA+u)});
  }
  async function loadProducts(){const g=document.getElementById('product-grid');if(!g)return;try{const rows=await json('/rest/v1/products?select=id,name,description,price,image_url,is_visible&is_visible=eq.true&order=id.asc');if(!rows.length)return;g.innerHTML=rows.map(p=>`<article class="product visible" data-reveal="false"><div class="product-image"><span class="product-number">${String(p.id).padStart(2,'0')}</span><img src="${esc(p.image_url?.startsWith('http')?p.image_url:MEDIA+'/product/'+(p.image_url||''))}" alt="${esc(p.name)}" loading="eager" decoding="async"></div><div class="product-info"><div><h3>${esc(p.name)}</h3><p>${esc(p.description||'')}</p><p><strong>${Number(p.price||0).toLocaleString('ru-RU')} ₽</strong></p></div><button class="order-button" type="button" data-product-id="${p.id}" data-product-name="${esc(p.name)}" data-product-price="${p.price}">Заказать</button></div></article>`).join('')}catch(e){console.warn('products loader:',e)}}
  async function run(){try{await Promise.all([loadTexts(),loadMedia(),loadProducts()])}catch(e){console.warn('site content loader:',e)}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();