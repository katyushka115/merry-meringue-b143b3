const SUPABASE_ORIGIN = process.env.SUPABASE_URL || 'https://avlozhwwvjqiypifoxox.supabase.co';
const PUBLIC_KEY = 'sb_publishable_3FgdTAmKB8kw2QTrrVPA5g_vb1lya1d';
const ALLOWED_PREFIXES = ['/rest/v1/', '/storage/v1/', '/auth/v1/', '/realtime/v1/'];
exports.handler = async (event) => {
  const incoming = new URL(event.rawUrl || `https://${event.headers?.host || 'localhost'}${event.path || '/'}`);
  let path = incoming.pathname;
  if (path.startsWith('/supabase/')) path = path.slice('/supabase'.length) || '/';
  else if (path.startsWith('/.netlify/functions/supabase-proxy')) path = path.slice('/.netlify/functions/supabase-proxy'.length) || '/';
  const origin = event.headers?.origin || '*';
  const corsHeaders = {'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET,POST,PATCH,PUT,DELETE,OPTIONS','Access-Control-Allow-Headers':'apikey,authorization,content-type,x-client-info,x-supabase-api-version','Access-Control-Expose-Headers':'content-range,x-total-count','Vary':'Origin'};
  if(event.httpMethod==='OPTIONS') return {statusCode:204,headers:corsHeaders,body:''};
  if(!ALLOWED_PREFIXES.some(p=>path.startsWith(p))) return {statusCode:404,headers:corsHeaders,body:'Not found'};
  const headers=new Headers();
  headers.set('apikey',PUBLIC_KEY);
  const auth=event.headers?.authorization||event.headers?.Authorization;
  headers.set('Authorization',auth||`Bearer ${PUBLIC_KEY}`);
  for(const h of ['content-type','x-client-info','x-supabase-api-version']) if(event.headers?.[h]) headers.set(h,event.headers[h]);
  try{
    const response=await fetch(`${SUPABASE_ORIGIN}${path}${incoming.search}`,{method:event.httpMethod,headers,body:['GET','HEAD'].includes(event.httpMethod)?undefined:event.isBase64Encoded?Buffer.from(event.body||'','base64'):event.body,redirect:'follow'});
    return {statusCode:response.status,headers:{'Content-Type':response.headers.get('content-type')||'application/json','Cache-Control':'no-store, max-age=0','X-Content-Type-Options':'nosniff',...corsHeaders},body:await response.text()};
  }catch(error){console.error('supabase-proxy upstream failure',path,error);return {statusCode:502,headers:corsHeaders,body:'Supabase upstream unavailable'}}
};
