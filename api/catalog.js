import { isAdminRequest } from '../server/adminSession.js';
import { readCloudCatalog, removeCloudImages, writeCloudCatalog } from '../server/catalogStore.js';

function json(response, status, body) {
  response.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  return response.end(JSON.stringify(body));
}

function parseBody(body) {
  return typeof body === 'string' ? JSON.parse(body) : body;
}

function validCatalog(products) {
  return Array.isArray(products) && products.length > 0 && products.length <= 200 && products.every((product) => (
    product && typeof product.id === 'string' && product.id.length <= 100 &&
    typeof product.name === 'string' && product.name.trim() && product.name.length <= 160 &&
    Array.isArray(product.images) && product.images.length > 0 && product.images.length <= 6 &&
    product.images.every((image) => typeof image === 'string' && image.length <= 1000)
  ));
}

function imageSet(products) {
  return new Set(products.flatMap((product) => product.images || []));
}

export default async function handler(request, response) {
  try {
    if (request.method === 'GET') {
      const catalog = await readCloudCatalog();
      return json(response, 200, { products: catalog.products, source: catalog.source });
    }

    if (request.method === 'PUT') {
      if (!isAdminRequest(request)) return json(response, 401, { error: 'Unauthorized' });
      const body = parseBody(request.body);
      if (!validCatalog(body?.products)) return json(response, 400, { error: 'Invalid catalog' });
      const current = await readCloudCatalog();
      const nextImages = imageSet(body.products);
      const removedImages = [...imageSet(current.products)].filter((url) => !nextImages.has(url));
      await writeCloudCatalog(body.products);
      await removeCloudImages(removedImages);
      return json(response, 200, { products: body.products, source: 'cloud' });
    }

    response.setHeader('Allow', 'GET, PUT');
    return json(response, 405, { error: 'Method not allowed' });
  } catch (error) {
    console.error('Catalog API error', error);
    return json(response, 500, { error: 'Catalog storage failed' });
  }
}
