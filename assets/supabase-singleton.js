(() => {
  const SUPABASE_URL = 'https://avlozhwwvjqiypifoxox.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
  if (window.smSupabase) return;
  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('Supabase client library is not available');
    return;
  }
  window.smSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
})();
