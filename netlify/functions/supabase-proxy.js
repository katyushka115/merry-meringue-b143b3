const SUPABASE_ORIGIN = 'https://avlozhwwvjqiypifoxox.supabase.co';
const SUPABASE_KEY = 'sb_publishable_3FgdTAmKB8kw2QTrrVPA5g_vb1lya1d';

const ALLOWED_PREFIXES = [
  '/rest/v1/',
  '/storage/v1/',
  '/auth/v1/',
  '/realtime/v1/'
];

export default async (req) => {
  const incoming = new URL(req.url);
  const marker = '/.netlify/functions/supabase-proxy';
  const path = incoming.pathname.startsWith(marker)
    ? incoming.pathname.slice(marker.length) || '/'
    : '/';

  if (!ALLOWED_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return new Response('Not found', { status: 404 });
  }

  const upstream = `${SUPABASE_ORIGIN}${path}${incoming.search}`;
  const headers = new Headers(req.headers);
  headers.set('apikey', SUPABASE_KEY);
  headers.set('Authorization', `Bearer ${SUPABASE_KEY}`);
  headers.delete('host');
  headers.delete('content-length');

  const response = await fetch(upstream, {
    method: req.method,
    headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
    redirect: 'follow'
  });

  const out = new Headers(response.headers);
  out.delete('set-cookie');
  out.set('Cache-Control', 'no-store, max-age=0');
  out.set('X-Content-Type-Options', 'nosniff');
  out.set('Access-Control-Allow-Origin', '*');

  return new Response(response.body, {
    status: response.status,
    headers: out
  });
};
