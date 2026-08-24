const SUPABASE_ORIGIN = process.env.SUPABASE_URL || 'https://avlozhwwvjqiypifoxox.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SECRET_KEY || 'sb_publishable_3FgdTAmKB8kw2QTrrVPA5g_vb1lya1d';
const ALLOWED_PREFIXES = ['/rest/v1/', '/storage/v1/', '/auth/v1/', '/realtime/v1/'];

exports.handler = async (event) => {
  const incoming = new URL(event.rawUrl || `https://${event.headers?.host || 'localhost'}${event.path || '/'}`);
  let path = incoming.pathname;
  if (path.startsWith('/supabase/')) path = path.slice('/supabase'.length) || '/';
  else if (path.startsWith('/.netlify/functions/supabase-proxy')) path = path.slice('/.netlify/functions/supabase-proxy'.length) || '/';

  const origin = event.headers?.origin || '*';
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'apikey,authorization,content-type,x-client-info'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders, body: '' };
  if (!SUPABASE_KEY) return { statusCode: 500, headers: corsHeaders, body: 'Supabase proxy is not configured' };
  if (!ALLOWED_PREFIXES.some(prefix => path.startsWith(prefix))) return { statusCode: 404, headers: corsHeaders, body: 'Not found' };

  const headers = new Headers(event.headers || {});
  headers.set('apikey', SUPABASE_KEY);
  if (!headers.has('authorization')) headers.set('Authorization', `Bearer ${SUPABASE_KEY}`);
  headers.delete('host');
  headers.delete('content-length');

  try {
    const response = await fetch(`${SUPABASE_ORIGIN}${path}${incoming.search}`, {
      method: event.httpMethod,
      headers,
      body: ['GET', 'HEAD'].includes(event.httpMethod) ? undefined : event.isBase64Encoded ? Buffer.from(event.body || '', 'base64') : event.body,
      redirect: 'follow'
    });
    const body = await response.text();
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Cache-Control': 'no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
        ...corsHeaders,
        'Vary': 'Origin'
      },
      body
    };
  } catch (error) {
    console.error('supabase-proxy upstream failure', path, error);
    return { statusCode: 502, headers: corsHeaders, body: 'Supabase upstream unavailable' };
  }
};
