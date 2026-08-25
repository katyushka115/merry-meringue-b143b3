const SUPABASE_ORIGIN = process.env.SUPABASE_URL || 'https://avlozhwwvjqiypifoxox.supabase.co';
const PUBLIC_KEY = 'sb_publishable_3FgdTAmKB8kw2QTrrVPA5g_vb1lya1d';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  try {
    const { email, password } = JSON.parse(event.body || '{}');
    if (!email || !password) {
      return { statusCode: 400, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify({ error: 'Введите почту и пароль' }) };
    }
    const response = await fetch(`${SUPABASE_ORIGIN}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        apikey: PUBLIC_KEY,
        Authorization: `Bearer ${PUBLIC_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { error: text || 'Ошибка авторизации' }; }
    const body = response.ok
      ? JSON.stringify({ access_token: data.access_token, refresh_token: data.refresh_token, expires_in: data.expires_in, expires_at: data.expires_at, token_type: data.token_type, user: data.user })
      : JSON.stringify({ error: data.error_description || data.msg || data.error || 'Не удалось войти', code: data.code || null });
    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, max-age=0' },
      body
    };
  } catch (error) {
    console.error('admin-auth failure', error);
    return { statusCode: 502, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify({ error: 'Сервис авторизации временно недоступен' }) };
  }
};
