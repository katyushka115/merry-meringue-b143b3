const SUPABASE_ORIGIN = process.env.SUPABASE_URL || 'https://avlozhwwvjqiypifoxox.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SECRET_KEY;
const ALLOWED_PREFIXES = ['/rest/v1/', '/storage/v1/', '/auth/v1/', '/realtime/v1/'];

export default async (req) => {
  const incoming = new URL(req.url);
  let path = incoming.pathname;
  if (path.startsWith('/supabase/')) path = path.slice('/supabase'.length) || '/';
  else if (path.startsWith('/.netlify/functions/supabase-proxy')) path = path.slice('/.netlify/functions/supabase-proxy'.length) || '/';
  if (!SUPABASE_KEY) return new Response('Supabase proxy is not configured', { status: 500 });
  if (!ALLOWED_PREFIXES.some(prefix => path.startsWith(prefix))) return new Response('Not found', { status: 404 });

  const headers = new Headers(req.headers);
  headers.set('apikey', SUPABASE_KEY);
  if (!headers.has('authorization')) headers.set('Authorization', `Bearer ${SUPABASE_KEY}`);
  headers.delete('host');
  headers.delete('content-length');

  const response = await fetch(`${SUPABASE_ORIGIN}${path}${incoming.search}`, {
    method: req.method,
    headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
    redirect: 'follow'
  });
  const out = new Headers(response.headers);
  out.delete('set-cookie');
  out.set('Cache-Control', 'no-store, max-age=0');
  out.set('X-Content-Type-Options', 'nosniff');
  out.set('Access-Control-Allow-Origin', incoming.origin || '*');
  out.set('Vary', 'Origin');
  return new Response(response.body, { status: response.status, headers: out });
};
