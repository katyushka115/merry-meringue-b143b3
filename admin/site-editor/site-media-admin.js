(() => {
  const URL = 'https://avlozhwwvjqiypifoxox.supabase.co';
  const KEY = 'sb_publishable_3FgdTAmKB8kw2QTrrVPA5g_vb1lya1d';
  const BUCKET = 'bouquets';
  const db = window.supabase?.createClient ? window.supabase.createClient(URL, KEY, {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}}) : null;
  if (!db) return;
  const esc = x => String(x ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));
  const tabs = document.querySelector('.tabs');
  if (!tabs || document.querySelector('[data-tab="site-editor"]')) return;
  const style = document.createElement('style');
  style.textContent = `.smbe-head{margin-bottom:16px}.smbe-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px}.smbe-grid .smbe-tab{min-height:48px}.smbe-grid .smbe-tab.active{background:#263125;color:#fff}.smbe-item{border-top:1px solid #eee;padding:15px 0}.smbe-item:first-child{border-top:0}.smbe-item textarea{margin:7px 0}.smbe-preview{display:block;width:180px;height:130px;object-fit:cover;border-radius:10px;margin:9px 0;background:#eee}.smbe-check{font-weight:400!important;display:inline-block!important;margin:8px 14px 8px 0!important}.smbe-danger{background:#a83d35!important}.smbe-error{color:#b3261e}@media(max-width:760px){.smbe-grid{grid-template-columns:1fr 1fr}.smbe-preview{width:100%;height:220px}}`;
  document.head.appendChild(style);
  const button = document.createElement('button'); button.className='tab'; button.dataset.tab='site-editor'; button.textContent='Редактор сайта'; tabs.insertBefore(button,tabs.querySelector('[data-tab="orders"]'));
  const section=document.createElement('section'); section.id='site-editor-tab'; section.className='hidden';
  section.innerHTML=`<div class="card"><div class="smbe-head"><h2>Редактор сайта</h2><p>Каждый блок открывается отдельно. Раздел «Заказы» остаётся отдельным.</p></div><div class="smbe-grid">${[['home','🏠 Главная'],['studio','🌿 О студии'],['collections','🌸 Коллекции'],['bouquets','💐 Букеты'],['life','📸 Жизнь студии'],['philosophy','✨ Красота в деталях'],['contacts','📍 Студия / Контакты']].map(([id,n])=>`<button type="button" class="smbe-tab secondary" data-b="${id}">${n}</button>`).join('')}</div><div id="smbe-panel"><p>Выберите блок.</p></div></div>`;
  document.getElementById('app').appendChild(section);
  const sectionMap={home:'Главная',studio:'О студии',collections:'Коллекции',bouquets:'Букеты',life:'Жизнь студии',philosophy:'Философия',contacts:'Контакты'};
  const hasPhotos=new Set(['home','collections','bouquets','life']);
  const mediaSectionFor=id=>id==='life'?['Жизнь студии','life_studio']:sectionMap[id];
  const allTabIds=['products','appearance','texts','orders','settings','site-media','site-editor'];
  const show=id=>{document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===id));allTabIds.forEach(x=>{const el=document.getElementById(x+'-tab');if(el)el.classList.toggle('hidden',x!==id);});if(id==='site-media'&&typeof loadMedia==='function')loadMedia();};
  button.addEventListener('click',()=>show('site-editor'));
  document.querySelectorAll('.tab').forEach(t=>{if(t!==button)t.addEventListener('click',()=>show(t.dataset.tab));});
  section.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{section.querySelectorAll('[data-b]').forEach(x=>x.classList.remove('active'));b.classList.add('active');loadBlock(b.dataset.b);});
  async function loadBlock(id){
    const panel=document.getElementById('smbe-panel'), sectionName=sectionMap[id]; panel.innerHTML='<p>Загрузка…</p>';
    const mediaSections=mediaSectionFor(id);
    const [t,m]=await Promise.all([db.from('site_content').select('*').eq('section',sectionName).order('sort_order').order('id'),hasPhotos.has(id)?db.from('site_media').select('*').in('section',Array.isArray(mediaSections)?mediaSections:[mediaSections]).order('sort_order').order('id'):Promise.resolve({data:[],error:null})]);
    if(t.error||m.error){panel.innerHTML=`<p class="smbe-error">${esc(t.error?.message||m.error?.message)}</p>`;return;}
    const texts=t.data||[],media=m.data||[];
    panel.innerHTML=`<h3>${esc(id==='philosophy'?'Красота в деталях':sectionName)}</h3><h4>Тексты</h4>${texts.length?texts.map(x=>`<div class="smbe-item"><label>${esc(x.label||x.content_key)}</label><textarea data-t="${x.id}" rows="4">${esc(x.content||'')}</textarea><label class="smbe-check"><input type="checkbox" data-tv="${x.id}" ${x.is_visible!==false?'checked':''}> Показывать</label><button type="button" data-save-t="${x.id}">Сохранить</button><button type="button" class="smbe-danger" data-del-t="${x.id}">Удалить</button></div>`).join(''):'<p>Текстов пока нет.</p>'}${hasPhotos.has(id)?`<h4 style="margin-top:24px">Фотографии (${media.length})</h4>${media.length?media.map(x=>`<div class="smbe-item"><b>${esc(x.label||x.slot_key)}</b><img class="smbe-preview" src="${esc(x.image_url||'')}" loading="lazy" alt="${esc(x.alt_text||'')}" onerror="this.onerror=null;this.src='${esc(x.image_url||'')}'"><label>Заменить фото<input type="file" accept="image/jpeg,image/png,image/webp" data-file="${x.id}"></label><label class="smbe-check"><input type="checkbox" data-mv="${x.id}" ${x.is_visible!==false?'checked':''}> Показывать</label><button type="button" data-save-m="${x.id}">Сохранить фото</button><button type="button" class="smbe-danger" data-del-m="${x.id}">Удалить</button></div>`).join(''):'<p>Фотографий пока нет.</p>'}`:''}`;
    panel.querySelectorAll('[data-save-t]').forEach(b=>b.onclick=async()=>{const tid=b.dataset.saveT,r=await db.from('site_content').update({content:panel.querySelector(`[data-t="${tid}"]`).value,is_visible:panel.querySelector(`[data-tv="${tid}"]`).checked,updated_at:new Date().toISOString()}).eq('id',tid);if(r.error)alert(r.error.message);else loadBlock(id);});
    panel.querySelectorAll('[data-del-t]').forEach(b=>b.onclick=async()=>{if(!confirm('Удалить этот текст?'))return;const r=await db.from('site_content').delete().eq('id',b.dataset.delT);if(r.error)alert(r.error.message);else loadBlock(id);});
    panel.querySelectorAll('[data-save-m]').forEach(b=>b.onclick=async()=>{try{const mid=b.dataset.saveM,file=panel.querySelector(`[data-file="${mid}"]`).files[0],patch={is_visible:panel.querySelector(`[data-mv="${mid}"]`).checked,updated_at:new Date().toISOString()};if(file){const ext=(file.name.split('.').pop()||'jpg').toLowerCase(),path=`site-media/${crypto.randomUUID()}.${ext}`,u=await db.storage.from(BUCKET).upload(path,file,{upsert:false,contentType:file.type});if(u.error)throw u.error;patch.image_url=db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;}const r=await db.from('site_media').update(patch).eq('id',mid);if(r.error)throw r.error;loadBlock(id);}catch(e){alert(e.message||String(e));}});
    panel.querySelectorAll('[data-del-m]').forEach(b=>b.onclick=async()=>{if(!confirm('Удалить эту фотографию из управляемого контента?'))return;const r=await db.from('site_media').delete().eq('id',b.dataset.delM);if(r.error)alert(r.error.message);else loadBlock(id);});
  }
  section.querySelector('[data-b="home"]').click();
})();