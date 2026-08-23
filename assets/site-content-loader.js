(() => {
  const MAP = 'https://yandex.ru/maps/?text=' + encodeURIComponent('г. Москва, Ленинский проспект, 94А');
  const INSTAGRAM = 'https://www.instagram.com/smflowers.msk?igsh=enFqZGtuaW1qNWRi&utm_source=qr';
  const setText=(el,value)=>{if(el)el.textContent=String(value??'');};
  const setHref=(el,value)=>{if(el&&value){el.href=value;el.target='_blank';el.rel='noopener noreferrer';}};

  function setupMobileMenu(){
    const toggle=document.querySelector('.menu-toggle');
    const nav=document.getElementById('main-nav');
    if(!toggle||!nav||toggle.dataset.menuReady==='true')return;
    toggle.dataset.menuReady='true';
    const close=()=>{
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Открыть меню');
    };
    const open=()=>{
      document.body.classList.add('menu-open');
      toggle.setAttribute('aria-expanded','true');
      toggle.setAttribute('aria-label','Закрыть меню');
    };
    toggle.addEventListener('click',(event)=>{
      event.preventDefault();
      event.stopPropagation();
      document.body.classList.contains('menu-open')?close():open();
    },{passive:false});
    toggle.addEventListener('touchend',(event)=>{
      event.preventDefault();
      event.stopPropagation();
      document.body.classList.contains('menu-open')?close():open();
    },{passive:false});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close,{passive:true}));
    document.addEventListener('keydown',(event)=>{if(event.key==='Escape')close();});
  }

  function client(){return window.smSupabase?.from?window.smSupabase:null;}
  function applyContent(rows){const m=Object.fromEntries(rows.map(r=>[r.content_key,r]));const put=(key,selector)=>{const el=document.querySelector(selector);if(el&&m[key]?.is_visible)setText(el,m[key].content);};
    [['hero_eyebrow','.hero-copy .eyebrow'],['hero_title','#hero-title'],['hero_description','.hero-description p'],['hero_primary_button','.hero-actions .button'],['hero_secondary_button','.hero-actions .text-link'],['about_eyebrow','.intro .eyebrow'],['about_title','.intro .section-title'],['about_text','.intro-text p'],['about_link','.intro-text .text-link'],['about_signature','.signature'],['collections_eyebrow','.collections .section-heading .eyebrow'],['collections_title','#collections-title'],['collections_link','.collections .section-heading .text-link'],['custom_eyebrow','.statement-copy .eyebrow'],['custom_title','#custom-title'],['custom_text','.statement-copy p:nth-of-type(2)'],['custom_link','.statement-copy .text-link'],['bouquets_eyebrow','.products .section-heading .eyebrow'],['bouquets_title','#products-title'],['bouquets_note','.products .section-heading > p'],['values_eyebrow','.values-intro .eyebrow'],['values_title','#values-title'],['values_intro','.values-intro > p:last-child'],['life_eyebrow','.gallery .section-heading .eyebrow'],['life_instagram_handle','#gallery-title'],['life_instagram_button','.gallery .section-heading .text-link'],['final_eyebrow','.final-copy .eyebrow'],['final_title','#final-title'],['final_text','.final-copy > p:nth-of-type(2)'],['footer_brand','.footer-brand'],['studio_address','.footer-column:nth-child(4) p:first-of-type'],['footer_copyright','.footer-bottom span:first-child'],['footer_tagline','.footer-bottom span:last-child']].forEach(([k,s])=>put(k,s));
    ['1','2','3','4'].forEach(n=>{put(`value_${n}_title`,`.value-item:nth-child(${n}) h3`);put(`value_${n}_text`,`.value-item:nth-child(${n}) p`);});
    const address=document.querySelector('.footer-column:nth-child(4) p:first-of-type');if(address&&!address.parentElement.querySelector('.sm-studio-route-link')){const link=document.createElement('a');link.className='sm-studio-route-link';link.href=m.studio_map_url?.content||MAP;link.target='_blank';link.rel='noopener noreferrer';link.textContent='📍 '+(m.studio_map_label?.is_visible?m.studio_map_label.content:'Построить маршрут →');address.parentElement.appendChild(link);}
    const instagram=m.life_instagram_url?.content||INSTAGRAM;document.querySelectorAll('a').forEach(a=>{const href=(a.getAttribute('href')||'').toLowerCase(),label=(a.textContent||'').toLowerCase();if(href.includes('instagram.com')||label.includes('instagram'))setHref(a,instagram);});
  }
  async function run(){const db=client();if(!db)return;try{const{data,error}=await db.from('site_content').select('content_key,content,section,is_visible,sort_order').eq('is_visible',true).order('section').order('sort_order');if(!error)applyContent(data||[]);}catch(error){console.warn('SM Flowers content deferred:',error);}}

  // Mobile navigation must be available immediately and must not wait for Supabase.
  const boot=()=>{setupMobileMenu();run();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
