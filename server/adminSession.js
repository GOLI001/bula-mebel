import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = 'divan_bula_admin';
export const ADMIN_SESSION_SECONDS = 8 * 60 * 60;

export function sameValue(left = '', right = '') {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && timingSafeEqual(a, b);
}

function signature(value, secret) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

export function createAdminSession(secret) {
  const payload = `${Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS}.${randomBytes(16).toString('hex')}`;
  return `${payload}.${signature(payload, secret)}`;
}

function readCookie(request, name) {
  const cookies = String(request.headers.cookie || '').split(';');
  const item = cookies.find((cookie) => cookie.trim().startsWith(`${name}=`));
  return item ? decodeURIComponent(item.trim().slice(name.length + 1)) : '';
}

export function isAdminRequest(request) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const token = readCookie(request, ADMIN_COOKIE);
  if (!secret || secret.length < 32 || !token) return false;
  const parts = token.split('.');
  if (parts.length !== 3 || Number(parts[0]) <= Math.floor(Date.now() / 1000)) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  return sameValue(parts[2], signature(payload, secret));
}
