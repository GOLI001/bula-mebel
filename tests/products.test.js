import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import test from 'node:test';
import { FABRIC_COLLECTIONS, PRODUCTS_DATA, formatMoney, getProduct } from '../src/data/products.js';

test('catalog has unique, complete products and existing media', async () => {
  assert.ok(PRODUCTS_DATA.length >= 4);
  assert.equal(new Set(PRODUCTS_DATA.map((product) => product.id)).size, PRODUCTS_DATA.length);

  for (const product of PRODUCTS_DATA) {
    assert.ok(product.name && product.category && product.description);
    assert.ok(product.price === null || product.price > 0);
    assert.ok(product.oldPrice === null || product.oldPrice >= product.price);
    assert.ok(product.images.length >= 1);
    assert.ok(product.features.length >= 3 && product.materials.length >= 3);
    assert.equal(getProduct(product.id), product);
    await Promise.all([...product.images, ...(product.video ? [product.video] : [])].map((path) => access(`public${path}`)));
  }
});

test('fabric previews are optimized and available', async () => {
  assert.ok(FABRIC_COLLECTIONS.length >= 4);
  await Promise.all(FABRIC_COLLECTIONS.map((fabric) => access(`public${fabric.image}`)));
});

test('money formatter uses readable Russian grouping', () => {
  assert.match(formatMoney(310000), /310[\s\u00a0]000/);
});
