const SUPABASE_ORIGINS = [
  'https://avlozhwwvjqiypifoxox.storage.supabase.co',
  'https://avlozhwwvjqiypifoxox.supabase.co'
];
const BUCKET = 'bouquets';
const MARKER = '/.netlify/functions/media-proxy';

const FIXED = {
  '/media/hero.jpg': 'site-media/e78c8f30-9f27-425f-8ac7-d53eef9dbbb6.jpeg',
  '/media/collection-1.jpg': 'collections/fdd4c98a-66dc-4b88-88e3-9266f1a2ddd5.jpeg',
  '/media/collection-2.jpg': 'collections/81b226c1-8f99-41a3-a060-f95cadc16431.jpeg',
  '/media/collection-3.jpg': 'collections/ddf86b0f-28be-47cd-9df9-b4fb27650ba4.jpeg',
  '/media/custom.jpg': 'site-media/36fe864b-da66-4022-bcda-d81b29c7c83c.jpeg',
  '/media/life-1.jpg': 'site-media/aa61840b-6cdc-4995-bc66-254fd06b79c6.jpeg',
  '/media/life-2.jpg': 'site-media/43eded19-9452-4166-94d5-fd30df355827.jpeg',
  '/media/life-3.jpg': 'site-media/8477d15f-8019-4764-99e9-989a8e45bb6e.jpeg',
  '/media/life-4.jpg': 'site-media/2e58be79-a7b9-4702-8467-3891417abe42.jpeg',
  '/media/final.jpg': 'site-media/870dbd10-0776-463b-8474-af91c6bb648e.jpeg'
};

const validPath = value => /^[a-zA-Z0-9_./-]+\.(?:jpe?g|png|webp|avif)$/i.test(value) && !value.includes('..');

export default async (req) => {
  const incoming = new URL(req.url);
  let pathname = incoming.pathname;
  if (pathname.startsWith(MARKER)) pathname = `/media${pathname.slice(MARKER.length)}`;
  if (pathname === '/.netlify/functions/media-proxy') pathname = incoming.searchParams.get('path') || '';

  let objectPath = FIXED[pathname] || '';

  if (pathname.startsWith('/media/product/')) {
    let path = pathname.slice('/media/product/'.length);
    if (path.startsWith('products/')) path = path.slice('products/'.length);
    if (!validPath(path)) return new Response('Bad image path', { status: 400 });
    objectPath = path.startsWith('products/') ? path : path;
  }

  if (!objectPath) return new Response('Not found', { status: 404 });
  if (!validPath(objectPath)) return new Response('Bad image path', { status: 400 });

  let response = null;
  let lastError = null;
  for (const origin of SUPABASE_ORIGINS) {
    try {
      response = await fetch(
        `${origin}/storage/v1/object/public/${BUCKET}/${objectPath}`,
        { redirect: 'follow', headers: { Accept: 'image/avif,image/webp,image/jpeg,image/png,*/*' } }
      );
      if (response.ok) break;
      lastError = new Error(`upstream ${response.status}`);
    } catch (error) {
      lastError = error;
    }
  }

  if (!response?.ok) {
    console.error('media-proxy upstream failure', pathname, objectPath, lastError?.message || 'unknown');
    return new Response('Image not found', { status: response?.status >= 400 ? response.status : 502 });
  }

  const headers = new Headers(response.headers);
  headers.set('Content-Type', response.headers.get('content-type') || 'image/jpeg');
  headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
  headers.set('X-Content-Type-Options', 'nosniff');

  return new Response(response.body, { status: 200, headers });
};
