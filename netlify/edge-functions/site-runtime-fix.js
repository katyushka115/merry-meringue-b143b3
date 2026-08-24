export default async (_req, context) => {
  const response = await context.next();
  const type = response.headers.get("content-type") || "";
  if (!type.includes("text/html")) return response;

  let html = await response.text();
  html = html.replace(
    "const SUPABASE_URL='https://avlozhwwvjqiypifoxox.supabase.co';",
    "const SUPABASE_URL=location.origin+'/supabase';"
  );
  html = html.replace(/assets\/site-content-loader\.js\?v=[^\"']+/g, "assets/site-content-loader.js?v=20260824-9");
  html = html.replace(/assets\/order-flow\.js\?v=[^\"']+/g, "assets/order-flow.js?v=20260824-9");

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.set("Cache-Control", "no-store, max-age=0");
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
};

export const config = {
  path: "/",
  onError: "bypass"
};
