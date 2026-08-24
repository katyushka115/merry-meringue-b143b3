const SUPABASE_ORIGIN = process.env.SUPABASE_URL || 'https://avlozhwwvjqiypifoxox.supabase.co';
// Browser-facing Supabase key. Never expose or forward the server secret as the browser API key.
const PUBLIC_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_3FgdTAmKB8kw2QTrrVPA5g_vb1lya1d';
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
    'Access-Control-Allow-Headers': 'apikey,authorization,content-type,x-client-info,x-supabase-api-version',
    'Access-Control-Expose-Headers': 'content-range,x-total-count'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders, body: '' };
  if (!PUBLIC_KEY) return { statusCode: 500, headers: corsHeaders, body: 'Supabase proxy is not configured' };
  if (!ALLOWED_PREFIXES.some(prefix => path.startsWith(prefix))) return { statusCode: 404, headers: corsHeaders, body: 'Not found' };

  const headers = new Headers();
  // Preserve the authenticated user's session token, but never accept a browser-supplied
  // secret API key. Supabase's public key is sufficient for REST/storage/auth; RLS is
  // enforced using the user's Authorization token.
  const incomingAuthorization = event.headers?.authorization || event.headers?.Authorization;
  headers.set('apikey', PUBLIC_KEY);
  if (incomingAuthorization) headers.set('Authorization', incomingAuthorization);
  else headers.set('Authorization', `Bearer ${PUBLIC_KEY}`);
  if (event.headers?.['content-type']) headers.set('content-type', event.headers['content-type']);
  if (event.headers?.['x-client-info']) headers.set('x-client-info', event.headers['x-client-info']);
  if (event.headers?.['x-supabase-api-version']) headers.set('x-supabase-api-version', event.headers['x-supabase-api-version']);

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
