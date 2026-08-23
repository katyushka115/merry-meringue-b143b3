(() => {
  const MAP = 'https://yandex.ru/maps/?text=' + encodeURIComponent('г. Москва, Ленинский проспект, 94А');
  const INSTAGRAM = 'https://www.instagram.com/smflowers.msk?igsh=enFqZGtuaW1qNWRi&utm_source=qr';
  const setText=(el,value)=>{if(el)el.textContent=String(value??'');};
  const setHref=(el,value)=>{if(el&&value){el.href=value;el.target='_blank';el.rel='noopener noreferrer';}};

  function setupMobileMenu(){
    const toggle=document.querySelector('.menu-toggle');
    const nav=document.getElementById('main-nav');
    if(!toggle||!nav)return;
    const setOpen=(open)=>{
      document.body.classList.toggle('menu-open',open);
      toggle.setAttribute('aria-expanded',String(open));
      toggle.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');
    };
    if(toggle.dataset.menuReady!=='true'){
      toggle.dataset.menuReady='true';
      const handler=(event)=>{event.preventDefault();event.stopPropagation();setOpen(!document.body.classList.contains('menu-open'));};
      toggle.addEventListener('click',handler,{passive:false});
      toggle.addEventListener('touchend',handler,{passive:false});
      nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
      document.addEventListener('keydown',(event)=>{if(event.key==='Escape')setOpen(false);});
    }
  }

  // These are the canonical collection names. They must never depend on a remote request.
  function applyCollectionFallback(){
    const names=['Нежные','Светлые','Особенные'];
    document.querySelectorAll('.collection-card').forEach((card,index)=>{
      const title=card.querySelector('.collection-meta h3');
      const alt=card.querySelector('img');
      if(title&&names[index])title.textContent=names[index];
      if(alt&&names[index])alt.alt=`${names[index]} — коллекция букетов`;
    });
  }

  function applyFallbackContent(){
    applyCollectionFallback();
    const defaults={
      '.collections .section-heading .eyebrow':'Выберите настроение',
      '#collections-title':'Коллекции',
      '.collections .section-heading .text-link':'Смотреть букеты →'
    };
    Object.entries(defaults).forEach(([selector,value])=>{const el=document.querySelector(selector);if(el&&selector.includes('text-link')){el.childNodes.forEach(n=>{if(n.nodeType===3&&n.textContent.trim())n.textContent='Смотреть букеты ';});}else setText(el,value);});
  }

  function applyContent(rows){
    const m=Object.fromEntries((rows||[]).map(r=>[r.content_key,r]));
    const put=(key,selector)=>{const el=document.querySelector(selector);if(el&&m[key]?.is_visible)setText(el,m[key].content);};
    [['hero_eyebrow','.hero-copy .eyebrow'],['hero_title','#hero-title'],['hero_description','.hero-description p'],['hero_primary_button','.hero-actions .button'],['hero_secondary_button','.hero-actions .text-link'],['about_eyebrow','.intro .eyebrow'],['about_title','.intro .section-title'],['about_text','.intro-text p'],['about_link','.intro-text .text-link'],['about_signature','.signature'],['collections_eyebrow','.collections .section-heading .eyebrow'],['collections_title','#collections-title'],['custom_eyebrow','.statement-copy .eyebrow'],['custom_title','#custom-title'],['custom_text','.statement-copy p:nth-of-type(2)'],['custom_link','.statement-copy .text-link'],['bouquets_eyebrow','.products .section-heading .eyebrow'],['bouquets_title','#products-title'],['bouquets_note','.products .section-heading > p'],['values_eyebrow','.values-intro .eyebrow'],['values_title','#values-title'],['values_intro','.values-intro > p:last-child'],['life_eyebrow','.gallery .section-heading .eyebrow'],['life_instagram_handle','#gallery-title'],['life_instagram_button','.gallery .section-heading .text-link'],['final_eyebrow','.final-copy .eyebrow'],['final_title','#final-title'],['final_text','.final-copy > p:nth-of-type(2)'],['footer_brand','.footer-brand'],['studio_address','.footer-column:nth-child(4) p:first-of-type'],['footer_copyright','.footer-bottom span:first-child'],['footer_tagline','.footer-bottom span:last-child']].forEach(([k,s])=>put(k,s));
    ['1','2','3','4'].forEach(n=>{put(`value_${n}_title`,`.value-item:nth-child(${n}) h3`);put(`value_${n}_text`,`.value-item:nth-child(${n}) p`);});
    applyCollectionFallback();
    const address=document.querySelector('.footer-column:nth-child(4) p:first-of-type');
    if(address&&!address.parentElement.querySelector('.sm-studio-route-link')){const link=document.createElement('a');link.className='sm-studio-route-link';link.href=m.studio_map_url?.content||MAP;link.target='_blank';link.rel='noopener noreferrer';link.textContent='📍 '+(m.studio_map_label?.is_visible?m.studio_map_label.content:'Построить маршрут →');address.parentElement.appendChild(link);}
    const instagram=m.life_instagram_url?.content||INSTAGRAM;document.querySelectorAll('a').forEach(a=>{const href=(a.getAttribute('href')||'').toLowerCase(),label=(a.textContent||'').toLowerCase();if(href.includes('instagram.com')||label.includes('instagram'))setHref(a,instagram);});
  }

  async function run(){
    applyFallbackContent();
    const url='/supabase/rest/site_content?select=content_key%2Ccontent%2Csection%2Cis_visible%2Csort_order&is_visible=eq.true&order=section.asc%2Csort_order.asc';
    try{
      const response=await fetch(url,{headers:{'Accept':'application/json'},cache:'no-store'});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const data=await response.json();
      applyContent(Array.isArray(data)?data:[]);
    }catch(error){console.warn('SM Flowers content fallback:',error);}
  }

  const boot=()=>{setupMobileMenu();run();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
