/* Keeps the legacy single /admin panel on the same-origin Supabase proxy. */
(()=>{
  const original=window.supabase?.createClient;
  if(!original)return;
  window.supabase.createClient=(url,key,options={})=>{
    const normalized=(typeof url==='string' && url.includes('supabase.co')) ? `${location.origin}/supabase` : url;
    return original.call(window.supabase,normalized,key,options);
  };
})();
