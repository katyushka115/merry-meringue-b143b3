(() => {
  const URL = 'https://avlozhwwvjqiypifoxox.supabase.co';
  const KEY = 'sb_publishable_3FgdTAmKB8kw2QTrrVPA5g_vb1lya1d';
  const BUCKET = 'bouquets';
  const db = window.supabase?.createClient ? window.supabase.createClient(URL, KEY, {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}}) : null;
  if (!db) return;

  const esc = x => String(x ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));
  const tabs = document.querySelector('.tabs');
  if (!tabs || document.querySelector('[data-tab="site-media"]')) return;

  const style = document.createElement('style');
  style.textContent = `.smbe-head{margin-bottom:16px}.smbe-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px}.smbe-grid .smbe-tab{min-height:48px}.smbe-grid .smbe-tab.active{background:#263125;color:#fff}.smbe-item{border-top:1px solid #eee;padding:15px 0}.smbe-item:first-child{border-top:0}.smbe-item textarea{margin:7px 0}.smbe-preview{display:block;width:180px;height:130px;object-fit:cover;border-radius:10px;margin:9px 0;background:#eee}.smbe-check{font-weight:400!important;display:inline-block!important;margin:8px 14px 8px 0!important}.smbe-danger{background:#a83d35!important}.smbe-error{color:#b3261e}@media(max-width:760px){.smbe-grid{grid-template-columns:1fr 1fr}.smbe-preview{width:100%;height:220px}}`;
  document.head.appendChild(style);

  const button = document.createElement('button');
  button.className = 'tab';
  button.dataset.tab = 'site-editor';
  button.textContent = 'Редактор сайта';
  tabs.insertBefore(button, tabs.querySelector('[data-tab="orders"]'));

  const section = document.createElement('section');
  section.id = 'site-editor-tab';
  section.className = 'hidden';
  section.innerHTML = `<div class="card"><div class="smbe-head"><h2>Редактор сайта</h2><p>Каждый блок открывается отдельно. Здесь редактируются только контент и фотографии сайта. Раздел «Заказы» остаётся отдельным и не изменяется.</p></div><div class="smbe-grid">${[['home','🏠 Главная'],['studio','🌿 О студии'],['collections','🌸 Коллекции'],['bouquets','💐 Букеты'],['life','📸 Жизнь студии'],['contacts','📍 Студия / Контакты']].map(([id,n])=>`<button type="button" class="smbe-tab secondary" data-b="${id}">${n}</button>`).join('')}</div><div id="smbe-panel"><p>Выберите блок.</p></div></div>`;
  document.getElementById('app').appendChild(section);

  const sectionMap = {home:'Главная',studio:'О студии',collections:'Коллекции',bouquets:'Букеты',life:'Жизнь студии',contacts:'Контакты'};
  const hasPhotos = new Set(['home','collections','bouquets','life']);
  const allTabIds = ['products','appearance','texts','orders','settings','site-media','site-editor'];
  const show = id => {
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === id));
    allTabIds.forEach(x => { const el = document.getElementById(x + '-tab'); if (el) el.classList.toggle('hidden', x !== id); });
    if (id === 'site-media') loadMedia();
  };
  button.addEventListener('click', () => show('site-editor'));
  document.querySelectorAll('.tab').forEach(t => {
    if (t === button) return;
    t.addEventListener('click', () => show(t.dataset.tab));
  });

  section.querySelectorAll('[data-b]').forEach(b => b.onclick = () => {
    section.querySelectorAll('[data-b]').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    loadBlock(b.dataset.b);
  });

  async function loadBlock(id) {
    const panel = document.getElementById('smbe-panel');
    const sectionName = sectionMap[id];
    panel.innerHTML = '<p>Загрузка…</p>';
    const [t,m] = await Promise.all([
      db.from('site_content').select('*').eq('section',sectionName).order('sort_order').order('id'),
      hasPhotos.has(id) ? db.from('site_media').select('*').eq('section', sectionName === 'Жизнь студии' ? 'life_studio' : sectionName).order('sort_order').order('id') : Promise.resolve({data:[],error:null})
    ]);
    if (t.error || m.error) { panel.innerHTML = `<p class="smbe-error">${esc(t.error?.message || m.error?.message)}</p>`; return; }
    const texts = t.data || [], media = m.data || [];
    panel.innerHTML = `<h3>${esc(sectionName)}</h3><h4>Тексты</h4>${texts.length ? texts.map(x=>`<div class="smbe-item"><label>${esc(x.label || x.content_key)}</label><textarea data-t="${x.id}" rows="4">${esc(x.content || '')}</textarea><label class="smbe-check"><input type="checkbox" data-tv="${x.id}" ${x.is_visible!==false?'checked':''}> Показывать</label><button type="button" data-save-t="${x.id}">Сохранить</button><button type="button" class="smbe-danger" data-del-t="${x.id}">Удалить</button></div>`).join('') : '<p>Текстов пока нет.</p>'}${hasPhotos.has(id) ? `<h4 style="margin-top:24px">Фотографии</h4>${media.length ? media.map(x=>`<div class="smbe-item"><b>${esc(x.label || x.slot_key)}</b><img class="smbe-preview" src="${esc(x.image_url || '')}" loading="lazy" alt="${esc(x.alt_text || '')}"><label>Заменить фото<input type="file" accept="image/jpeg,image/png,image/webp" data-file="${x.id}"></label><label class="smbe-check"><input type="checkbox" data-mv="${x.id}" ${x.is_visible!==false?'checked':''}> Показывать</label><button type="button" data-save-m="${x.id}">Сохранить фото</button><button type="button" class="smbe-danger" data-del-m="${x.id}">Удалить</button></div>`).join('') : '<p>Фотографий пока нет.</p>'}` : ''}`;
    panel.querySelectorAll('[data-save-t]').forEach(b => b.onclick = async () => { const id=b.dataset.saveT, r=await db.from('site_content').update({content:panel.querySelector(`[data-t="${id}"]`).value,is_visible:panel.querySelector(`[data-tv="${id}"]`).checked,updated_at:new Date().toISOString()}).eq('id',id); if(r.error) alert(r.error.message); else loadBlock(document.querySelector('.smbe-tab.active')?.dataset.b || id); });
    panel.querySelectorAll('[data-del-t]').forEach(b => b.onclick = async () => { if(!confirm('Удалить этот текст?')) return; const r=await db.from('site_content').delete().eq('id',b.dataset.delT); if(r.error) alert(r.error.message); else loadBlock(id); });
    panel.querySelectorAll('[data-save-m]').forEach(b => b.onclick = async () => { try { const mid=b.dataset.saveM, file=panel.querySelector(`[data-file="${mid}"]`).files[0], patch={is_visible:panel.querySelector(`[data-mv="${mid}"]`).checked,updated_at:new Date().toISOString()}; if(file){const ext=(file.name.split('.').pop()||'jpg').toLowerCase(),path=`site-media/${crypto.randomUUID()}.${ext}`,u=await db.storage.from(BUCKET).upload(path,file,{upsert:false,contentType:file.type});if(u.error)throw u.error;patch.image_url=db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;}const r=await db.from('site_media').update(patch).eq('id',mid);if(r.error)throw r.error;loadBlock(id);} catch(e){alert(e.message||String(e));} });
    panel.querySelectorAll('[data-del-m]').forEach(b => b.onclick = async () => { if(!confirm('Удалить эту фотографию из управляемого контента?')) return; const r=await db.from('site_media').delete().eq('id',b.dataset.delM); if(r.error) alert(r.error.message); else loadBlock(id); });
  }

  async function upload(file, folder) { const ext=(file.name.split('.').pop()||'jpg').toLowerCase(),path=`${folder}/${crypto.randomUUID()}.${ext}`,r=await db.storage.from(BUCKET).upload(path,file,{upsert:false,contentType:file.type});if(r.error)throw r.error;return db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl; }
  async function loadMedia() { const r=await db.from('site_media').select('*').order('section').order('sort_order').order('id');if(r.error){document.getElementById('life-media').textContent=r.error.message;return;}const rows=r.data||[];render('life-media',rows.filter(x=>x.section==='life_studio'),'life-media-msg');render('other-media',rows.filter(x=>x.section!=='life_studio'),'other-media-msg'); }
  function render(targetId, rows, msgId) { const root=document.getElementById(targetId);if(!root)return;if(!rows.length){root.innerHTML='<p>Фотографии пока не добавлены.</p>';return;}root.innerHTML=rows.map(row=>`<div class="item" data-media-row="${row.id}"><img class="thumb" src="${esc(row.image_url||'')}" alt="${esc(row.alt_text||row.label||'')}"><div><b>${esc(row.label||row.slot_key)}</b><div>${esc(row.slot_key)}</div><label>Заменить фото<input class="media-file" type="file" accept="image/jpeg,image/png,image/webp"></label><label><input class="media-visible" type="checkbox" style="width:auto" ${row.is_visible!==false?'checked':''}> Показывать на сайте</label></div><div class="actions"><button class="media-save" data-id="${row.id}">Сохранить</button><button class="danger media-delete" data-id="${row.id}">Удалить</button></div></div>`).join('');root.querySelectorAll('.media-save').forEach(btn=>btn.onclick=async()=>{const row=btn.closest('[data-media-row]'),file=row.querySelector('.media-file').files[0],visible=row.querySelector('.media-visible').checked;try{btn.disabled=true;let image_url;if(file)image_url=await upload(file,'site-media');const payload={is_visible:visible};if(image_url)payload.image_url=image_url;const q=await db.from('site_media').update(payload).eq('id',btn.dataset.id);if(q.error)throw q.error;document.getElementById(msgId).textContent='Фотография сохранена.';document.getElementById(msgId).className='msg success';loadMedia();}catch(e){document.getElementById(msgId).textContent=e.message||String(e);document.getElementById(msgId).className='msg error';}finally{btn.disabled=false;}});root.querySelectorAll('.media-delete').forEach(btn=>btn.onclick=async()=>{if(!confirm('Удалить эту фотографию из управляемого контента сайта?'))return;const q=await db.from('site_media').delete().eq('id',btn.dataset.id);if(q.error){document.getElementById(msgId).textContent=q.error.message;document.getElementById(msgId).className='msg error';}else loadMedia();}); }

  const oldSection = document.getElementById('site-media-tab');
  if (oldSection) { /* existing media tab remains available */ }
  section.querySelector('[data-b="home"]').click();
})();