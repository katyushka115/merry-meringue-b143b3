(() => {
  const URL = 'https://avlozhwwvjqiypifoxox.supabase.co';
  const KEY = 'sb_publishable_3FgdTAmKB8kw2QTrrVPA5g_vb1lya1d';
  const MAP = 'https://yandex.ru/maps/?text=' + encodeURIComponent('г. Москва, Ленинский проспект, 94А');
  const INSTAGRAM = 'https://www.instagram.com/smflowers.msk?igsh=enFqZGtua1mNWRi&utm_source=qr';

  const pendingStyle = document.createElement('style');
  pendingStyle.id = 'sm-site-content-pending';
  pendingStyle.textContent = `
    .sm-dynamic-photo-ready{visibility:visible!important}
    html.sm-content-loading .sm-dynamic-content{visibility:visible!important}
    html.sm-content-ready .sm-dynamic-content{visibility:visible!important}
    .hero-visual img{opacity:1!important;animation:none!important;transform:scale(1.04)!important}
  `;
  document.head.appendChild(pendingStyle);
  document.documentElement.classList.add('sm-content-loading');
  document.body.classList.add('sm-content-ready');

  const setText=(el,value)=>{if(el)el.textContent=String(value??'');};
  const setHref=(el,value)=>{if(el&&value){el.href=value;el.target='_blank';el.rel='noopener noreferrer';}};
  function client(){if(window.smSupabase?.from)return window.smSupabase;if(window.supabase?.createClient){window.smSupabase=window.supabase.createClient(URL,KEY);return window.supabase.createClient(URL,KEY);}return null;}
  function put(map,key,selector,mode='text'){const el=document.querySelector(selector);if(!el||!map[key]?.is_visible)return;if(mode==='href')setHref(el,map[key].content);else setText(el,map[key].content);}
  function applyContent(rows){const m=Object.fromEntries(rows.map(r=>[r.content_key,r]));
    put(m,'hero_eyebrow','.hero-copy .eyebrow');put(m,'hero_title','#hero-title');put(m,'hero_description','.hero-description p');put(m,'hero_primary_button','.hero-actions .button');put(m,'hero_secondary_button','.hero-actions .text-link');put(m,'about_eyebrow','.intro .eyebrow');put(m,'about_title','.intro .section-title');put(m,'about_text','.intro-text p');put(m,'about_link','.intro-text .text-link');put(m,'about_signature','.signature');put(m,'collections_eyebrow','.collections .section-heading .eyebrow');put(m,'collections_title','#collections-title');put(m,'collections_link','.collections .section-heading .text-link');put(m,'custom_eyebrow','.statement-copy .eyebrow');put(m,'custom_title','#custom-title');put(m,'custom_text','.statement-copy p:nth-of-type(2)');put(m,'custom_link','.statement-copy .text-link');put(m,'bouquets_eyebrow','.products .section-heading .eyebrow');put(m,'bouquets_title','#products-title');put(m,'bouquets_note','.products .section-heading > p');put(m,'values_eyebrow','.values-intro .eyebrow');put(m,'values_title','#values-title');put(m,'values_intro','.values-intro > p:last-child');['1','2','3','4'].forEach(n=>{put(m,`value_${n}_title`,`.value-item:nth-child(${n}) h3`);put(m,`value_${n}_text`,`.value-item:nth-child(${n}) p`);});put(m,'life_eyebrow','.gallery .section-heading .eyebrow');put(m,'life_instagram_handle','#gallery-title');put(m,'life_instagram_button','.gallery .section-heading .text-link');put(m,'final_eyebrow','.final-copy .eyebrow');put(m,'final_title','#final-title');put(m,'final_text','.final-copy > p:nth-of-type(2)');put(m,'final_call_button','.final-actions .button--light');put(m,'final_telegram_button','.final-actions .button--outline');put(m,'footer_brand','.footer-brand');put(m,'footer_nav_title','.footer-column:nth-child(2) h3');put(m,'footer_contacts_title','.footer-column:nth-child(3) h3');put(m,'footer_studio_title','.footer-column:nth-child(4) h3');put(m,'studio_address','.footer-column:nth-child(4) p:first-of-type');put(m,'footer_copyright','.footer-bottom span:first-child');put(m,'footer_tagline','.footer-bottom span:last-child');
    const nav={nav_collections:'.nav-links a:nth-child(1)',nav_bouquets:'.nav-links a:nth-child(2)',nav_custom:'.nav-links a:nth-child(3)',nav_about:'.nav-links a:nth-child(4)',nav_contacts:'.nav-links a:nth-child(5)'};Object.entries(nav).forEach(([k,s])=>put(m,k,s));put(m,'header_phone','.header-phone');
    const hours=document.querySelector('.footer-column:nth-child(4) p:nth-of-type(2)');if(hours&&m.studio_hours?.is_visible)setText(hours,m.studio_hours.content);const address=document.querySelector('.footer-column:nth-child(4) p:first-of-type');if(address){let link=address.parentElement.querySelector('.sm-studio-route-link');if(!link){link=document.createElement('a');link.className='sm-studio-route-link';address.parentElement.appendChild(link);}link.href=m.studio_map_url?.content||MAP;link.target='_blank';link.rel='noopener noreferrer';link.textContent='📍 '+(m.studio_map_label?.is_visible?m.studio_map_label.content:'Построить маршрут →');link.setAttribute('aria-label','Открыть адрес студии на Яндекс.Картах');}
    const unique=m.life_unique_note?.is_visible?m.life_unique_note.content:'';let note=document.querySelector('.sm-life-unique-note');const galleryHead=document.querySelector('.gallery .section-heading');if(unique&&galleryHead){if(!note){note=document.createElement('p');note.className='sm-life-unique-note';galleryHead.appendChild(note);}note.textContent=unique;}else if(note)note.remove();document.querySelectorAll('.sm-life-caption').forEach(el=>el.remove());const instagram=m.life_instagram_url?.content||INSTAGRAM;document.querySelectorAll('a').forEach(a=>{const href=(a.getAttribute('href')||'').toLowerCase(),label=(a.textContent||'').toLowerCase();if(href.includes('instagram.com')||label.includes('instagram'))setHref(a,instagram);});
  }
  function optimizedImageUrl(raw,width){if(!raw)return raw;try{const u=new URL(raw),marker='/storage/v1/object/public/';if(!u.pathname.includes(marker))return raw;u.pathname=u.pathname.replace(marker,'/storage/v1/render/image/public/');u.searchParams.set('width',String(width));u.searchParams.set('quality','78');u.searchParams.set('resize','contain');return u.toString();}catch(_){return raw;}}
  function prepareImage(img,rawUrl,priority=false){
    if(!img)return Promise.resolve(false);
    if(!rawUrl)return Promise.resolve(true);
    const width=Math.min(Math.max(Math.round((window.innerWidth||1200)*(window.devicePixelRatio||1)),480),1800);
    img.loading=priority?'eager':'lazy';img.decoding='async';if(priority)img.fetchPriority='high';img.dataset.smRawUrl=rawUrl;
    const optimized=optimizedImageUrl(rawUrl,width);
    return new Promise(resolve=>{
      const show=(src)=>{img.src=src;img.classList.add('sm-dynamic-photo-ready');resolve(true);};
      const preload=new Image();preload.decoding='async';
      preload.onload=()=>show(optimized);
      preload.onerror=()=>{const fallback=new Image();fallback.onload=()=>show(rawUrl);fallback.onerror=()=>resolve(false);fallback.src=rawUrl;};
      preload.src=optimized;
    });
  }
  async function applyMedia(rows){const by=Object.fromEntries(rows.map(r=>[r.slot_key,r]));const jobs=[];
    jobs.push(prepareImage(document.querySelector('.hero-visual img'),by.hero?.image_url,true));
    const cards=document.querySelectorAll('.collection-card');['collection_1','collection_2','collection_3','collection_4'].forEach((k,i)=>{const row=by[k];if(cards[i]){const title=cards[i].querySelector('.collection-meta h3');if(title&&row?.label)setText(title,String(row.label).replace(/^Коллекция:\s*/i,''));const caption=cards[i].querySelector('.collection-meta span');if(caption&&row?.label)caption.textContent=`${String(i+1).padStart(2,'0')} / коллекция`;const img=cards[i].querySelector('img');if(img&&row?.alt_text)img.alt=row.alt_text;jobs.push(prepareImage(img,row?.image_url));}});
    jobs.push(prepareImage(document.querySelector('.statement-art img'),by.custom_art?.image_url));
    const gallery=document.querySelectorAll('.gallery-item img');const keys=['life_photo_1','life_photo_2','life_photo_3','life_photo_4','gallery_photo_1','gallery_photo_2','gallery_photo_3','gallery_photo_4'];keys.forEach((k,i)=>{const row=by[k];if(gallery[i])jobs.push(prepareImage(gallery[i],row?.image_url));});
    jobs.push(prepareImage(document.querySelector('.final-art img'),by.final_art?.image_url));
    await Promise.all(jobs);
  }
  function injectStyle(){if(document.getElementById('sm-site-content-style'))return;const s=document.createElement('style');s.id='sm-site-content-style';s.textContent=`.sm-life-unique-note{margin:18px 0 0;max-width:620px;font-family:var(--serif);font-size:20px;font-style:italic;line-height:1.25;color:rgba(31,38,30,.72)}.sm-studio-route-link{display:inline-flex;align-items:center;gap:6px;margin-top:10px;color:rgba(255,255,255,.82);text-decoration:underline;text-underline-offset:4px}.gallery-item img,.collection-card img,.hero-visual img,.statement-art img,.final-art img{content-visibility:auto}@media(max-width:760px){.sm-life-unique-note{font-size:18px;margin:14px 20px 0}.sm-studio-route-link{margin-top:9px}}`;document.head.appendChild(s);}
  async function run(){injectStyle();const db=client();if(!db){document.documentElement.classList.remove('sm-content-loading');return;}try{const[c,media]=await Promise.all([db.from('site_content').select('content_key,content,section,is_visible,sort_order').eq('is_visible',true).order('section').order('sort_order'),db.from('site_media').select('section,slot_key,label,image_url,alt_text,is_visible,sort_order').eq('is_visible',true).order('section').order('sort_order')]);
      const mediaPromise=!media.error ? applyMedia(media.data||[]) : Promise.resolve();
      if(!c.error)applyContent(c.data||[]);
      await mediaPromise;
      document.documentElement.classList.remove('sm-content-loading');
      document.documentElement.classList.add('sm-content-ready');
    }catch(_){document.documentElement.classList.remove('sm-content-loading');document.documentElement.classList.add('sm-content-ready');}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,0),{once:true});else setTimeout(run,0);
})();
