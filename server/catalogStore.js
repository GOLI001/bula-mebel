import { del, list, put } from '@vercel/blob';
import { PRODUCTS_DATA } from '../src/data/products.js';

const CATALOG_PREFIX = 'catalog/catalog-';
const TOKEN = () => process.env.BLOB_READ_WRITE_TOKEN;

function latestBlob(blobs) {
  return [...blobs].sort((left, right) => new Date(right.uploadedAt) - new Date(left.uploadedAt))[0];
}

export async function readCloudCatalog() {
  if (!TOKEN()) return { products: PRODUCTS_DATA, source: 'default', blobs: [] };
  const result = await list({ prefix: CATALOG_PREFIX, limit: 100, token: TOKEN() });
  const current = latestBlob(result.blobs);
  if (!current) return { products: PRODUCTS_DATA, source: 'default', blobs: [] };
  const response = await fetch(`${current.url}?v=${encodeURIComponent(current.uploadedAt)}`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Cloud catalog could not be loaded');
  const products = await response.json();
  if (!Array.isArray(products)) throw new Error('Cloud catalog has an invalid format');
  return { products, source: 'cloud', blobs: result.blobs };
}

export async function writeCloudCatalog(products) {
  if (!TOKEN()) throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
  const previous = await readCloudCatalog();
  const pathname = `${CATALOG_PREFIX}${Date.now()}.json`;
  const result = await put(pathname, JSON.stringify(products), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json; charset=utf-8',
    token: TOKEN()
  });

  if (previous.blobs.length) {
    await del(previous.blobs.map((blob) => blob.url), { token: TOKEN() }).catch(() => {});
  }
  return result;
}

export async function removeCloudImages(urls) {
  const cloudUrls = urls.filter((url) => typeof url === 'string' && url.includes('.blob.vercel-storage.com/products/'));
  if (cloudUrls.length && TOKEN()) await del(cloudUrls, { token: TOKEN() }).catch(() => {});
}
