import { ADMIN_COOKIE, ADMIN_SESSION_SECONDS, createAdminSession, isAdminRequest, sameValue } from '../server/adminSession.js';

function json(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  return response.end(JSON.stringify(body));
}

export default async function handler(request, response) {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret || secret.length < 32) return json(response, 503, { authenticated: false, error: 'Admin access is not configured' });

  if (request.method === 'GET') {
    return json(response, 200, { authenticated: isAdminRequest(request) });
  }

  if (request.method === 'POST') {
    if (!sameValue(request.body?.password, password)) {
      await new Promise((resolve) => setTimeout(resolve, 650));
      return json(response, 401, { authenticated: false });
    }
    const session = createAdminSession(secret);
    response.setHeader('Set-Cookie', `${ADMIN_COOKIE}=${encodeURIComponent(session)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${ADMIN_SESSION_SECONDS}`);
    return json(response, 200, { authenticated: true });
  }

  if (request.method === 'DELETE') {
    response.setHeader('Set-Cookie', `${ADMIN_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
    return json(response, 200, { authenticated: false });
  }

  response.setHeader('Allow', 'GET, POST, DELETE');
  return json(response, 405, { error: 'Method not allowed' });
}
