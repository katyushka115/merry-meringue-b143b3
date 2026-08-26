/* Live site content: editable text/media/products from Supabase. */
(()=>{
  const SUPABASE_ORIGIN='https://avlozhwwvjqiypifoxox.supabase.co';
  const SUPABASE_KEY='sb_publishable_3FgdTAmKB8kw2QTrrVPA5g_vb1lya1d';
  const BUCKET='bouquets';
  const API=`${SUPABASE_ORIGIN}/rest/v1`;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const mediaUrl=u=>{
    if(!u)return'';
    const value=String(u).trim();
    if(value.startsWith('/media/')){
      const path=value.slice('/media/'.length).replace(/^product\//i,'');
      if(/^[a-zA-Z0-9_./-]+\.(?:jpe?g|png|webp|avif)$/i.test(path) && !path.includes('..')){
        return `${SUPABASE_ORIGIN}/storage/v1/object/public/${BUCKET}/${path}`;
      }
      return value;
    }
    try{
      const x=new URL(value),needle=`/storage/v1/object/public/${BUCKET}/`,i=x.pathname.indexOf(needle);
      return i>=0?`${SUPABASE_ORIGIN}/storage/v1/object/public/${BUCKET}/${x.pathname.slice(i+needle.length)}${x.search||''}`:value;
    }catch{return value}
  };
  const json=async p=>{
    for(let attempt=0;attempt<3;attempt++){
      try{
        const r=await fetch(`${API}${p}`,{headers:{Accept:'application/json',apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`},cache:'no-store'});
        if(!r.ok)throw new Error(`${r.status}: ${await r.text()}`);
        return r.json();
      }catch(error){
        if(attempt===2)throw error;
        await new Promise(resolve=>setTimeout(resolve,250*(attempt+1)));
      }
    }
  };
  const setText=(selector,value)=>{const e=document.querySelector(selector);if(e&&value!=null)e.textContent=value};
  const textMap={'Главная':[['.hero-copy .eyebrow','hero_eyebrow'],['#hero-title','hero_title'],['.hero-description p','hero_description'],['.hero-actions .button','hero_primary_button'],['.hero-actions .text-link','hero_secondary_button']], 'О студии':[['.intro .eyebrow','about_eyebrow'],['.intro .section-title','about_title'],['.intro-text p','about_text'],['.intro-text .text-link','about_link'],['.signature','about_signature']], 'Коллекции':[['.collections .section-heading .eyebrow','collections_eyebrow'],['#collections-title','collections_title'],['.section-heading a.text-link','collections_link']], 'На заказ':[['.statement-copy .eyebrow','custom_eyebrow'],['#custom-title','custom_title'],['.statement-copy p','custom_text'],['.statement-copy .text-link','custom_link']], 'Букеты':[['.products .section-heading .eyebrow','bouquets_eyebrow'],['#products-title','bouquets_title'],['.products .section-heading > p','bouquets_note']], 'Философия':[['.values-intro .eyebrow','values_eyebrow'],['#values-title','values_title'],['.values-intro > p:last-child','values_intro']], 'Жизнь студии':[['.gallery .section-heading .eyebrow','life_eyebrow'],['.gallery .section-heading .text-link','life_instagram_button']], 'Финальный блок':[['.final-copy .eyebrow','final_eyebrow'],['#final-title','final_title'],['.final-copy > p','final_text'],['.final-actions .button','final_call_button'],['.final-actions .button--outline','final_telegram_button']], 'Контакты':[['.footer-brand','footer_brand'],['.footer-column:nth-child(2) h3','footer_nav_title'],['.footer-column:nth-child(3) h3','footer_contacts_title'],['.footer-column:nth-child(4) h3','footer_studio_title'],['.footer-column:nth-child(4) p:first-of-type','studio_address'],['.footer-column:nth-child(4) p:last-of-type','studio_hours'],['.footer-bottom span:first-child','footer_copyright'],['.footer-bottom span:last-child','footer_tagline']]};
  const mediaKey=slot=>({hero:'hero',custom:'custom_art',final:'final_art'}[slot]||slot);
  const fixRouteLink=()=>{const links=[...document.querySelectorAll('a')].filter(a=>/построить маршрут/i.test(a.textContent||''));links.forEach(a=>a.remove());const cols=document.querySelectorAll('.site-footer .footer-column');const studio=cols[cols.length-1];if(!studio)return;const a=document.createElement('a');a.href='https://yandex.ru/maps/?text='+encodeURIComponent('Москва, Ленинский проспект, 94А');a.target='_blank';a.rel='noopener noreferrer';a.textContent='Построить маршрут ↗';studio.appendChild(a)};
  const renderProducts=products=>{
    const g=document.getElementById('product-grid');
    if(!g)return;
    if(!Array.isArray(products)||!products.length){g.innerHTML='';return}
    g.innerHTML=products.map((p,i)=>`<article class="product visible" data-reveal="false"><div class="product-image"><span class="product-number">${String(i+1).padStart(2,'0')}</span><img src="${esc(mediaUrl(p.image_url))}" alt="${esc(p.name)}" loading="eager" decoding="async"></div><div class="product-info"><div><h3>${esc(p.name)}</h3><p>${esc(p.description||'')}</p><p><strong>${Number(p.price||0).toLocaleString('ru-RU')} ₽</strong></p></div><button class="order-button" type="button" data-bouquet="${esc(p.name)}" data-product-id="${esc(p.id)}" data-product-name="${esc(p.name)}" data-product-price="${Number(p.price||0)}">Заказать</button></div></article>`).join('');
  };
  async function run(){
    const results=await Promise.allSettled([
      json('/site_content?select=section,content_key,content,is_visible&is_visible=eq.true&order=sort_order.asc,id.asc'),
      json('/site_media?select=section,slot_key,image_url,alt_text,is_visible&is_visible=eq.true&order=sort_order.asc,id.asc'),
      json('/products?select=id,name,description,price,image_url,is_active,is_featured,sort_order,updated_at&is_active=eq.true&order=sort_order.asc,id.asc')
    ]);
    const texts=results[0].status==='fulfilled'?results[0].value:[];
    const media=results[1].status==='fulfilled'?results[1].value:[];
    const products=results[2].status==='fulfilled'?results[2].value:[];
    for(const row of texts)for(const [selector,key] of(textMap[row.section]||[]))if(row.content_key===key)setText(selector,row.content);
    const by=(section,slot)=>media.find(x=>x.section===section&&x.slot_key===mediaKey(slot))?.image_url;
    const setImg=(selector,url)=>{const e=document.querySelector(selector);if(e&&url){e.src=mediaUrl(url);e.dataset.liveImage='1'}};
    setImg('.hero-visual img',by('Главная','hero'));setImg('.statement-art img',by('На заказ','custom'));setImg('.final-art img',by('Финальный блок','final'));
    document.querySelectorAll('.collection-card img').forEach((e,i)=>{const u=by('Коллекции',`collection_${i+1}`);if(u)e.src=mediaUrl(u)});
    document.querySelectorAll('.gallery-item img').forEach((e,i)=>{const u=by('Жизнь студии',`life_photo_${i+1}`)||by('Жизнь студии',`gallery_photo_${i+1}`);if(u)e.src=mediaUrl(u)});
    renderProducts(products);
    fixRouteLink();
    document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('visible'));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
