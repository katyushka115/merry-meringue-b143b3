(()=>{
const DB='https://avlozhwwvjqiypifoxox.supabase.co';
const KEY='sb_publishable_3FgdTAmKB8kw2QTrrVPA5g_vb1lya1d';
const H={apikey:KEY,Authorization:'Bearer '+KEY};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=async(url,opt={})=>{const r=await fetch(url,{...opt,headers:{...H,...(opt.headers||{})},cache:'no-store'});if(!r.ok){let m='HTTP '+r.status;try{const x=await r.json();m=x.message||x.hint||m}catch{}throw Error(m)}return r.status===204?null:r.json()};
const bucket='bouquets';
const upload=async file=>{const ext=(file.name.split('.').pop()||'jpg').toLowerCase(),path='categories/'+crypto.randomUUID()+'.'+ext,r=await fetch(DB+'/storage/v1/object/'+bucket+'/'+path,{method:'POST',headers:{...H,'Content-Type':file.type||'image/jpeg'},body:file});if(!r.ok)throw Error('Не удалось загрузить фото');return DB+'/storage/v1/render/image/public/'+bucket+'/'+path};
async function loadCats(){return json(DB+'/rest/v1/categories?select=id,name,slug,description,image_url,sort_order,is_active,created_at&order=sort_order.asc,id.asc')}
function slugify(s){return String(s).toLowerCase().trim().replace(/[^a-z0-9а-яё]+/gi,'-').replace(/^-+|-+$/g,'')||'collection'}
async function render(){
 const doc=document, box=doc.getElementById('siteEditor'); if(!box||box.classList.contains('hidden')) return;
 const tile=doc.querySelector('.site-tile.active'); const block=tile?.dataset.block||''; const title=box.querySelector('h3')?.textContent||'';
 if(block!=='Коллекции' && !/коллекц/i.test(title)) return;
 if(box.dataset.smCollectionsRendered==='1')return;
 box.dataset.smCollectionsRendered='1';
 try{
  const cats=await loadCats();
  const existing=box.innerHTML;
  const manager=doc.createElement('div'); manager.id='smCollectionsManager'; manager.className='field';
  manager.innerHTML='<div class="actions"><h4 style="margin:0">Коллекции</h4><button type="button" id="smNewCollection">Добавить коллекцию</button></div><p class="muted">Коллекции управляются здесь. Новая коллекция сразу появится в поле «Коллекция» у букетов.</p><div id="smCollectionsList"></div><div id="smCollectionForm" class="hidden" style="margin-top:12px;padding:14px;border:1px solid #eee;border-radius:12px"><input id="smCid" type="hidden"><label>Название<input id="smCname" required></label><label>Описание<textarea id="smCdesc" rows="3"></textarea></label><label>Фото коллекции<input id="smCfile" type="file" accept="image/*"></label><div class="actions"><button type="button" id="smSaveCollection">Сохранить коллекцию</button><button type="button" id="smCancelCollection" class="secondary">Отмена</button></div><p id="smCmsg" class="muted"></p></div>';
  box.appendChild(manager);
  const list=doc.getElementById('smCollectionsList'), form=doc.getElementById('smCollectionForm');
  const draw=async()=>{const data=await loadCats();list.innerHTML=data.map(c=>'<div class="row" data-cat-row="'+c.id+'"><div class="actions"><img class="thumb" src="'+esc(c.image_url||'')+'" alt=""><div style="flex:1"><b>'+esc(c.name)+'</b><br><span class="muted">'+(c.is_active===false?'Скрыта':'Активна')+'</span><br><button type="button" data-cat-edit="'+c.id+'">Изменить</button> <button type="button" class="danger" data-cat-delete="'+c.id+'">Удалить</button></div></div></div>').join('')||'<p class="muted">Коллекций пока нет.</p>';bind();updateProductSelects(data)};
  const bind=()=>{list.querySelectorAll('[data-cat-edit]').forEach(b=>b.onclick=async()=>{const c=(await loadCats()).find(x=>String(x.id)===b.dataset.catEdit);if(!c)return;doc.getElementById('smCid').value=c.id;doc.getElementById('smCname').value=c.name;doc.getElementById('smCdesc').value=c.description||'';doc.getElementById('smCfile').value='';doc.getElementById('smCmsg').textContent='';form.classList.remove('hidden')});list.querySelectorAll('[data-cat-delete]').forEach(b=>b.onclick=async()=>{if(!confirm('Удалить коллекцию? Букеты останутся, но потеряют привязку к этой коллекции.'))return;try{await json(DB+'/rest/v1/products?category_id=eq.'+b.dataset.catDelete,{method:'PATCH',headers:{'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({category_id:null})});await json(DB+'/rest/v1/categories?id=eq.'+b.dataset.catDelete,{method:'DELETE'});await draw()}catch(e){alert(e.message)}})};
  const updateProductSelects=data=>{const select=doc.getElementById('pcollection');if(!select)return;const cur=select.value;select.innerHTML='<option value="">Без коллекции</option>'+data.filter(c=>c.is_active!==false).map(c=>'<option value="'+esc(c.id)+'">'+esc(c.name)+'</option>').join('');if(cur)select.value=cur};
  doc.getElementById('smNewCollection').onclick=()=>{doc.getElementById('smCid').value='';doc.getElementById('smCname').value='';doc.getElementById('smCdesc').value='';doc.getElementById('smCfile').value='';doc.getElementById('smCmsg').textContent='';form.classList.remove('hidden')};
  doc.getElementById('smCancelCollection').onclick=()=>form.classList.add('hidden');
  doc.getElementById('smSaveCollection').onclick=async()=>{const msg=doc.getElementById('smCmsg');try{const id=doc.getElementById('smCid').value,name=doc.getElementById('smCname').value.trim();if(!name)throw Error('Введите название коллекции');const f=doc.getElementById('smCfile').files[0];let image_url=null;if(f)image_url=await upload(f);const payload={name,slug:slugify(name),description:doc.getElementById('smCdesc').value.trim()};if(image_url)payload.image_url=image_url;if(!id){const last=await json(DB+'/rest/v1/categories?select=sort_order&order=sort_order.desc,id.desc&limit=1');payload.sort_order=Number(last?.[0]?.sort_order||0)+1;payload.is_active=true;await json(DB+'/rest/v1/categories',{method:'POST',headers:{'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify(payload)})}else{await json(DB+'/rest/v1/categories?id=eq.'+id,{method:'PATCH',headers:{'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify(payload)})}msg.textContent='Сохранено';form.classList.add('hidden');await draw()}catch(e){msg.textContent=e.message}};
  await draw();
 }catch(e){box.dataset.smCollectionsRendered='0';console.error('collection manager',e)}
}
function reset(){const box=document.getElementById('siteEditor');if(box)box.dataset.smCollectionsRendered='0'}
new MutationObserver(()=>{reset();setTimeout(render,80)}).observe(document.body,{subtree:true,childList:true});
setInterval(render,1500);setTimeout(render,500);
})();