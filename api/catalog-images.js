import { put } from '@vercel/blob';
import { isAdminRequest } from '../server/adminSession.js';
import { isBlobConfigured } from '../server/catalogStore.js';

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

function json(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  return response.end(JSON.stringify(body));
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return json(response, 405, { error: 'Method not allowed' });
  }
  if (!isAdminRequest(request)) return json(response, 401, { error: 'Unauthorized' });
  if (!isBlobConfigured()) return json(response, 503, { error: 'Blob storage is not configured', message: 'Blob-хранилище не подключено к Production.' });

  try {
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    const match = String(body?.dataUrl || '').match(/^data:image\/(?:webp|jpeg|png);base64,([a-zA-Z0-9+/=]+)$/);
    if (!match) return json(response, 400, { error: 'Invalid image', message: 'Формат фотографии не поддерживается.' });
    const image = Buffer.from(match[1], 'base64');
    if (!image.length || image.length > MAX_IMAGE_BYTES) return json(response, 413, { error: 'Image is too large', message: 'Фотография слишком большая.' });

    const productId = String(body?.productId || 'new-product').toLowerCase().replace(/[^a-z0-9-]+/g, '-').slice(0, 80) || 'new-product';
    const pathname = `products/${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.webp`;
    const blob = await put(pathname, image, { access: 'public', addRandomSuffix: true, contentType: 'image/webp' });
    return json(response, 201, { url: blob.url });
  } catch (error) {
    console.error('Image upload error', error);
    return json(response, 500, { error: 'Image upload failed', message: 'Vercel Blob отклонил загрузку фотографии.' });
  }
}
