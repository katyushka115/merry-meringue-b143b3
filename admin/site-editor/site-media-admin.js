(() => {
  const URL = 'https://avlozhwwvjqiypifoxox.supabase.co';
  const KEY = 'sb_publishable_3FgdTAmKB8kw2QTrrVPA5g_vb1lya1d';
  const BUCKET = 'bouquets';
  const db = window.supabase?.createClient ? window.supabase.createClient(URL, KEY, {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}}) : null;
  if (!db) return;

  const esc = x => String(x ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));
  const tabs = document.querySelector('.tabs');
  if (!tabs || document.querySelector('[data-tab="site-media"]')) return;

  const button = document.createElement('button');
  button.className = 'tab';
  button.dataset.tab = 'site-media';
  button.textContent = 'Фотографии сайта';
  tabs.appendChild(button);

  const section = document.createElement('section');
  section.id = 'site-media-tab';
  section.className = 'hidden';
  section.innerHTML = `
    <div class="grid">
      <div class="card">
        <h2>Жизнь студии</h2>
        <p>Здесь находятся фотографии, которые показываются именно в блоке «Жизнь студии» на сайте. Их можно заменить, скрыть или удалить.</p>
        <div id="life-media"></div>
        <div id="life-media-msg" class="msg"></div>
      </div>
      <div class="card">
        <h2>Другие фотографии сайта</h2>
        <p>Все фотографии управляемого контента сайта хранятся здесь по отдельным блокам.</p>
        <div id="other-media"></div>
        <div id="other-media-msg" class="msg"></div>
      </div>
    </div>`;
  document.getElementById('app').appendChild(section);

  const allTabIds = ['products','appearance','texts','orders','settings','site-media'];
  const show = id => {
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === id));
    allTabIds.forEach(x => { const el = document.getElementById(x + '-tab'); if (el) el.classList.toggle('hidden', x !== id); });
    if (id === 'site-media') loadMedia();
  };
  button.addEventListener('click', () => show('site-media'));

  async function upload(file, folder) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const r = await db.storage.from(BUCKET).upload(path, file, {upsert:false, contentType:file.type});
    if (r.error) throw r.error;
    return db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }

  async function loadMedia() {
    const r = await db.from('site_media').select('*').order('section').order('sort_order').order('id');
    if (r.error) {
      document.getElementById('life-media').textContent = r.error.message;
      return;
    }
    const rows = r.data || [];
    render('life-media', rows.filter(x => x.section === 'life_studio'), 'life-media-msg');
    render('other-media', rows.filter(x => x.section !== 'life_studio'), 'other-media-msg');
  }

  function render(targetId, rows, msgId) {
    const root = document.getElementById(targetId);
    if (!rows.length) {
      root.innerHTML = '<p>Фотографии пока не добавлены.</p>';
      return;
    }
    root.innerHTML = rows.map(row => `
      <div class="item" data-media-row="${row.id}">
        <img class="thumb" src="${esc(row.image_url || '')}" alt="${esc(row.alt_text || row.label || '')}">
        <div>
          <b>${esc(row.label || row.slot_key)}</b>
          <div>${esc(row.slot_key)}</div>
          <label>Заменить фото<input class="media-file" type="file" accept="image/jpeg,image/png,image/webp"></label>
          <label><input class="media-visible" type="checkbox" style="width:auto" ${row.is_visible !== false ? 'checked' : ''}> Показывать на сайте</label>
        </div>
        <div class="actions">
          <button class="media-save" data-id="${row.id}">Сохранить</button>
          <button class="danger media-delete" data-id="${row.id}">Удалить</button>
        </div>
      </div>`).join('');

    root.querySelectorAll('.media-save').forEach(btn => btn.onclick = async () => {
      const row = btn.closest('[data-media-row]');
      const file = row.querySelector('.media-file').files[0];
      const visible = row.querySelector('.media-visible').checked;
      try {
        btn.disabled = true;
        let image_url;
        if (file) image_url = await upload(file, 'site-media');
        const payload = {is_visible: visible};
        if (image_url) payload.image_url = image_url;
        const q = await db.from('site_media').update(payload).eq('id', btn.dataset.id);
        if (q.error) throw q.error;
        document.getElementById(msgId).textContent = 'Фотография сохранена.';
        document.getElementById(msgId).className = 'msg success';
        loadMedia();
      } catch (e) {
        document.getElementById(msgId).textContent = e.message || String(e);
        document.getElementById(msgId).className = 'msg error';
      } finally { btn.disabled = false; }
    });

    root.querySelectorAll('.media-delete').forEach(btn => btn.onclick = async () => {
      if (!confirm('Удалить эту фотографию из управляемого контента сайта?')) return;
      try {
        btn.disabled = true;
        const q = await db.from('site_media').delete().eq('id', btn.dataset.id);
        if (q.error) throw q.error;
        loadMedia();
      } catch (e) {
        document.getElementById(msgId).textContent = e.message || String(e);
        document.getElementById(msgId).className = 'msg error';
        btn.disabled = false;
      }
    });
  }
})();