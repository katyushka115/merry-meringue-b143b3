(()=>{
const DB='https://avlozhwwvjqiypifoxox.supabase.co',KEY='sb_publishable_3FgdTAmKB8kw2QTrrVPA5g_vb1lya1d',H={apikey:KEY,Authorization:'Bearer '+KEY},bucket='bouquets';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=async(url,opt={})=>{const r=await fetch(url,{...opt,headers:{...H,...(opt.headers||{})},cache:'no-store'});if(!r.ok){let m='HTTP '+r.status;try{const x=await r.json();m=x.message||x.hint||m}catch{}throw Error(m)}return r.status===204?null:r.json()};
const upload=async file=>{const ext=(file.name.split('.').pop()||'jpg').toLowerCase(),path='categories/'+crypto.randomUUID()+'.'+ext,r=await fetch(DB+'/storage/v1/object/'+bucket+'/'+path,{method:'POST',headers:{...H,'Content-Type':file.type||'image/jpeg'},body:file});if(!r.ok)throw Error('Не удалось загрузить фото');return DB+'/storage/v1/render/image/public/'+bucket+'/'+path};
const loadCats=()=>json(DB+'/rest/v1/categories?select=id,name,slug,description,image_url,sort_order,is_active,created_at&order=sort_order.asc,id.asc');
const slugify=s=>String(s).toLowerCase().trim().replace(/[^a-z0-9а-яё]+/gi,'-').replace(/^-+|-+$/g,'')||'collection';
function dedupeProductSelect(){const selects=[...document.querySelectorAll('#productForm select#pcollection')];selects.slice(1).forEach(s=>{const label=s.closest('label');if(label)label.remove();else s.remove()});return selects[0]||null}
function updateProductSelects(data){const select=dedupeProductSelect();if(!select)return;const cur=select.value;select.innerHTML='<option value="">Без коллекции</option>'+data.filter(c=>c.is_active!==false).map(c=>'<option value="'+esc(c.id)+'">'+esc(c.name)+'</option>').join('');if(cur)select.value=cur}
async function render(){
 const box=document.getElementById('siteEditor');if(!box||box.classList.contains('hidden'))return;
 const tile=document.querySelector('.site-tile.active'),block=tile?.dataset.block||'',title=box.querySelector('h3')?.textContent||'';
 dedupeProductSelect();
 if(block!=='Коллекции'&&!/коллекц/i.test(title))return;
 if(document.getElementById('smCollectionsManager'))return;
 try{
  const manager=document.createElement('div');manager.id='smCollectionsManager';manager.className='field';
  manager.innerHTML='<div class="actions"><h4 style="margin:0">Управление коллекциями</h4><button type="button" id="smNewCollection">Добавить коллекцию</button></div><p class="muted">Новая коллекция сразу появится в поле «Коллекция» у букетов.</p><div id="smCollectionsList"></div><div id="smCollectionForm" class="hidden" style="margin-top:12px;padding:14px;border:1px solid #eee;border-radius:12px"><input id="smCid" type="hidden"><label>Название<input id="smCname" required></label><label>Описание<textarea id="smCdesc" rows="3"></textarea></label><label>Фото коллекции<input id="smCfile" type="file" accept="image/*"></label><div class="actions"><button type="button" id="smSaveCollection">Сохранить коллекцию</button><button type="button" id="smCancelCollection" class="secondary">Отмена</button></div><p id="smCmsg" class="muted"></p></div>';
  box.appendChild(manager);
  const list=document.getElementById('smCollectionsList'),form=document.getElementById('smCollectionForm');
  const draw=async()=>{const data=await loadCats();list.innerHTML=data.map(c=>'<div class="row"><div class="actions"><img class="thumb" src="'+esc(c.image_url||'')+'" alt=""><div style="flex:1"><b>'+esc(c.name)+'</b><br><span class="muted">'+(c.is_active===false?'Скрыта':'Активна')+'</span><br><button type="button" data-cat-edit="'+c.id+'">Изменить</button> <button type="button" class="danger" data-cat-delete="'+c.id+'">Удалить</button></div></div></div>').join('')||'<p class="muted">Коллекций пока нет.</p>';updateProductSelects(data);bind(data)};
  const bind=data=>{list.querySelectorAll('[data-cat-edit]').forEach(b=>b.onclick=()=>{const c=data.find(x=>String(x.id)===b.dataset.catEdit);if(!c)return;document.getElementById('smCid').value=c.id;document.getElementById('smCname').value=c.name;document.getElementById('smCdesc').value=c.description||'';document.getElementById('smCfile').value='';document.getElementById('smCmsg').textContent='';form.classList.remove('hidden')});list.querySelectorAll('[data-cat-delete]').forEach(b=>b.onclick=async()=>{if(!confirm('Удалить коллекцию? Букеты останутся, но потеряют привязку к этой коллекции.'))return;try{await json(DB+'/rest/v1/products?category_id=eq.'+b.dataset.catDelete,{method:'PATCH',headers:{'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({category_id:null})});await json(DB+'/rest/v1/categories?id=eq.'+b.dataset.catDelete,{method:'DELETE'});await draw()}catch(e){alert(e.message)}})};
  document.getElementById('smNewCollection').onclick=()=>{document.getElementById('smCid').value='';document.getElementById('smCname').value='';document.getElementById('smCdesc').value='';document.getElementById('smCfile').value='';document.getElementById('smCmsg').textContent='';form.classList.remove('hidden')};
  document.getElementById('smCancelCollection').onclick=()=>form.classList.add('hidden');
  document.getElementById('smSaveCollection').onclick=async()=>{const msg=document.getElementById('smCmsg');try{const id=document.getElementById('smCid').value,name=document.getElementById('smCname').value.trim();if(!name)throw Error('Введите название коллекции');const f=document.getElementById('smCfile').files[0],payload={name,slug:slugify(name),description:document.getElementById('smCdesc').value.trim()};if(f)payload.image_url=await upload(f);if(!id){const last=await json(DB+'/rest/v1/categories?select=sort_order&order=sort_order.desc,id.desc&limit=1');payload.sort_order=Number(last?.[0]?.sort_order||0)+1;payload.is_active=true;await json(DB+'/rest/v1/categories',{method:'POST',headers:{'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify(payload)})}else await json(DB+'/rest/v1/categories?id=eq.'+id,{method:'PATCH',headers:{'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify(payload)});form.classList.add('hidden');await draw()}catch(e){msg.textContent=e.message}};
  await draw();
 }catch(e){console.error('collection manager',e);const manager=document.getElementById('smCollectionsManager');if(manager)manager.remove()}
}

function installProductDelete(){
 const list=document.getElementById('productsList');if(!list)return;
 list.querySelectorAll('.sm-product-delete,[data-delete-product]').forEach(b=>b.remove());
 list.querySelectorAll('.row').forEach(row=>{
   const edit=row.querySelector('[data-edit]');if(!edit)return;
   const id=edit.getAttribute('data-edit');if(!id)return;
   const del=document.createElement('button');del.type='button';del.className='danger sm-product-delete';del.textContent='Удалить букет';del.style.marginLeft='8px';del.dataset.productId=id;
   edit.insertAdjacentElement('afterend',del);
   del.onclick=async()=>{
     const name=row.querySelector('b')?.textContent?.trim()||'этот букет';
     if(!confirm(`Удалить букет «${name}»?\n\nОн исчезнет с сайта и из каталога. Существующие заказы сохранятся.`))return;
     del.disabled=true;del.textContent='Удаление…';
     try{await json(DB+'/rest/v1/products?id=eq.'+encodeURIComponent(id),{method:'DELETE',headers:{'Prefer':'return=minimal'}});row.remove()}
     catch(e){del.disabled=false;del.textContent='Удалить букет';alert('Не удалось удалить букет: '+e.message)}
   };
 });
}
let deleteTimer=null;
const scheduleDeleteFix=()=>{clearTimeout(deleteTimer);deleteTimer=setTimeout(installProductDelete,80)};
const observer=new MutationObserver(scheduleDeleteFix);
observer.observe(document.body,{subtree:true,childList:true});
setInterval(()=>{dedupeProductSelect();render();installProductDelete()},1500);
setTimeout(()=>{render();installProductDelete()},500);
})();
