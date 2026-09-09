import assert from 'node:assert/strict';
import test from 'node:test';
import handler from '../api/catalog.js';
import imageHandler from '../api/catalog-images.js';

function request(apiHandler, method, body, cookie = '') {
  let statusCode = 200;
  const headers = {};
  const response = {
    status(value) { statusCode = value; return this; },
    setHeader(name, value) { headers[name] = value; return this; },
    end(value) { return { statusCode, headers, value }; }
  };
  return apiHandler({ method, body, headers: { cookie } }, response);
}

test('public catalog falls back to the bundled products before Blob is initialized', async () => {
  delete process.env.BLOB_READ_WRITE_TOKEN;
  delete process.env.BLOB_STORE_ID;
  const result = await request(handler, 'GET');
  const body = JSON.parse(result.value);
  assert.equal(result.statusCode, 200);
  assert.equal(body.source, 'default');
  assert.equal(body.storageConfigured, false);
  assert.equal(body.products.length, 24);
});

test('catalog writes and image uploads require an administrator session', async () => {
  const catalogWrite = await request(handler, 'PUT', { products: [] });
  const imageWrite = await request(imageHandler, 'POST', { dataUrl: 'data:image/webp;base64,YQ==' });
  assert.equal(catalogWrite.statusCode, 401);
  assert.equal(imageWrite.statusCode, 401);
});
