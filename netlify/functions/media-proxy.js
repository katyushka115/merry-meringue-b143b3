const SUPABASE_ORIGIN = 'https://avlozhwwvjqiypifoxox.supabase.co';
const BUCKET = 'bouquets';
const MARKER = '/.netlify/functions/media-proxy';

// Use the Storage object endpoint for production media. The image-rendering
// endpoint can fail on some networks, while the public object endpoint is
// already used successfully by the bouquet catalog.
const FIXED = {
  '/media/hero.jpg': '/storage/v1/object/public/bouquets/site-media/e78c8f30-9f27-425f-8ac7-d53eef9dbbb6.jpeg',
  '/media/collection-1.jpg': '/storage/v1/object/public/bouquets/collections/fdd4c98a-66dc-4b88-88e3-9266f1a2ddd5.jpeg',
  '/media/collection-2.jpg': '/storage/v1/object/public/bouquets/collections/81b226c1-8f99-41a3-a060-f95cadc16431.jpeg',
  '/media/collection-3.jpg': '/storage/v1/object/public/bouquets/collections/ddf86b0f-28be-47cd-9df9-b4fb27650ba4.jpeg',
  '/media/custom.jpg': '/storage/v1/object/public/bouquets/site-media/36fe864b-da66-4022-bcda-d81b29c7c83c.jpeg',
  '/media/life-1.jpg': '/storage/v1/object/public/bouquets/site-media/aa61840b-6cdc-4995-bc66-254fd06b79c6.jpeg',
  '/media/life-2.jpg': '/storage/v1/object/public/bouquets/site-media/43eded19-9452-4166-94d5-fd30df355827.jpeg',
  '/media/life-3.jpg': '/storage/v1/object/public/bouquets/site-media/8477d15f-8019-4764-99e9-989a8e45bb6e.jpeg',
  '/media/life-4.jpg': '/storage/v1/object/public/bouquets/site-media/2e58be79-a7b9-4702-8467-3891417abe42.jpeg',
  '/media/final.jpg': '/storage/v1/object/public/bouquets/site-media/870dbd10-0776-463b-8474-af91c6bb648e.jpeg'
};

export default async (req) => {
  const incoming = new URL(req.url);
  const pathname = incoming.pathname.startsWith(MARKER)
    ? `/media${incoming.pathname.slice(MARKER.length)}`
    : incoming.pathname;
  let target = FIXED[pathname] || '';

  if (pathname.startsWith('/media/product/')) {
    const path = pathname.slice('/media/product/'.length);
    if (!/^[a-zA-Z0-9_./-]+\.(?:jpe?g|png|webp|avif)$/i.test(path) || path.includes('..')) {
      return new Response('Bad image path', { status: 400 });
    }
    target = `/storage/v1/object/public/${BUCKET}/${path}`;
  }

  if (!target) return new Response('Not found', { status: 404 });

  const response = await fetch(`${SUPABASE_ORIGIN}${target}`, { redirect: 'follow' });
  if (!response.ok) return new Response('Image not found', { status: response.status });

  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
  headers.set('X-Content-Type-Options', 'nosniff');

  return new Response(response.body, { status: 200, headers });
};
