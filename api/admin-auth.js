import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'divan_bula_admin';
const SESSION_SECONDS = 8 * 60 * 60;

function json(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  return response.end(JSON.stringify(body));
}

function sameValue(left = '', right = '') {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && timingSafeEqual(a, b);
}

function signature(value, secret) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function createSession(secret) {
  const payload = `${Math.floor(Date.now() / 1000) + SESSION_SECONDS}.${randomBytes(16).toString('hex')}`;
  return `${payload}.${signature(payload, secret)}`;
}

function isValidSession(token, secret) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3 || Number(parts[0]) <= Math.floor(Date.now() / 1000)) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  return sameValue(parts[2], signature(payload, secret));
}

function readCookie(request, name) {
  const cookies = String(request.headers.cookie || '').split(';');
  const item = cookies.find((cookie) => cookie.trim().startsWith(`${name}=`));
  return item ? decodeURIComponent(item.trim().slice(name.length + 1)) : '';
}

export default async function handler(request, response) {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret || secret.length < 32) return json(response, 503, { authenticated: false, error: 'Admin access is not configured' });

  if (request.method === 'GET') {
    return json(response, 200, { authenticated: isValidSession(readCookie(request, COOKIE_NAME), secret) });
  }

  if (request.method === 'POST') {
    if (!sameValue(request.body?.password, password)) {
      await new Promise((resolve) => setTimeout(resolve, 650));
      return json(response, 401, { authenticated: false });
    }
    const session = createSession(secret);
    response.setHeader('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(session)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`);
    return json(response, 200, { authenticated: true });
  }

  if (request.method === 'DELETE') {
    response.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
    return json(response, 200, { authenticated: false });
  }

  response.setHeader('Allow', 'GET, POST, DELETE');
  return json(response, 405, { error: 'Method not allowed' });
}
