const SUPABASE_ORIGIN = 'https://avlozhwwvjqiypifoxox.supabase.co';
const BUCKET = 'bouquets';
const normalizePath = value => decodeURIComponent(value).replace(/^\/+/, '').replace(/^product\//i, '');

export default async (req) => {
  const url = new URL(req.url);
  const rawPath = url.searchParams.get('path') || '';
  const path = normalizePath(rawPath);

  if (!path || path.includes('..') || !/^[a-zA-Z0-9_./-]+\.(?:jpe?g|png|webp|avif)$/i.test(path)) {
    return new Response('Bad image path', { status: 400 });
  }

  const upstream = `${SUPABASE_ORIGIN}/storage/v1/object/public/${BUCKET}/${path}`;
  const response = await fetch(upstream, { redirect: 'follow' });

  if (!response.ok) {
    return new Response('Image not found', { status: response.status });
  }

  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
  headers.set('X-Content-Type-Options', 'nosniff');

  return new Response(response.body, {
    status: 200,
    headers,
  });
};
