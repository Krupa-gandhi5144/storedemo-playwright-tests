import { test, expect } from '@playwright/test';

const API_BASE = 'https://dummyjson.com';

test.describe('API Products', () => {

  // ✅ PASS (25)
  test('GET /products returns 200', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products`);
    expect(response.status()).toBe(200);
  });

  test('GET /products returns products array', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products`);
    const body = await response.json();
    expect(body).toHaveProperty('products');
    expect(Array.isArray(body.products)).toBe(true);
  });

  test('GET /products/1 returns product with id 1', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/1`);
    const body = await response.json();
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('title');
  });

  test('GET /products/categories returns array', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/categories`);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test('GET /products?limit=5 returns max 5 products', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products?limit=5`);
    const body = await response.json();
    expect(body.products.length).toBeLessThanOrEqual(5);
  });

  test('GET /products/1 has title property', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/1`);
    const body = await response.json();
    expect(body).toHaveProperty('title');
    expect(typeof body.title).toBe('string');
    expect(body.title.length).toBeGreaterThan(0);
  });

  test('GET /products/1 has price property', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/1`);
    const body = await response.json();
    expect(body).toHaveProperty('price');
    expect(typeof body.price).toBe('number');
    expect(body.price).toBeGreaterThan(0);
  });

  test('GET /products/1 has description property', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/1`);
    const body = await response.json();
    expect(body).toHaveProperty('description');
    expect(typeof body.description).toBe('string');
  });

  test('GET /products/1 has category property', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/1`);
    const body = await response.json();
    expect(body).toHaveProperty('category');
    expect(typeof body.category).toBe('string');
  });

  test('GET /products/1 has thumbnail property', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/1`);
    const body = await response.json();
    expect(body).toHaveProperty('thumbnail');
    expect(typeof body.thumbnail).toBe('string');
  });

  test('GET /products/1 has rating property', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/1`);
    const body = await response.json();
    expect(body).toHaveProperty('rating');
    expect(body.rating).toBeGreaterThanOrEqual(0);
    expect(body.rating).toBeLessThanOrEqual(5);
  });

  test('GET /products/1 has stock property', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/1`);
    const body = await response.json();
    expect(body).toHaveProperty('stock');
    expect(typeof body.stock).toBe('number');
  });

  test('GET /products/1 has brand property', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/1`);
    const body = await response.json();
    expect(body).toHaveProperty('brand');
  });

  test('GET /products/1 has images array', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/1`);
    const body = await response.json();
    expect(body).toHaveProperty('images');
    expect(Array.isArray(body.images)).toBe(true);
  });

  test('GET /products?limit=10 returns exactly 10 products', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products?limit=10`);
    const body = await response.json();
    expect(body.products.length).toBe(10);
  });

  test('GET /products?limit=1 returns single product', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products?limit=1`);
    const body = await response.json();
    expect(body.products.length).toBe(1);
  });

  test('GET /products?skip=5&limit=5 skips first 5 products', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products?skip=5&limit=5`);
    const body = await response.json();
    expect(body.products.length).toBeLessThanOrEqual(5);
    expect(body).toHaveProperty('skip', 5);
  });

  test('GET /products/search?q=phone returns results', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/search?q=phone`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('products');
    expect(Array.isArray(body.products)).toBe(true);
  });

  test('GET /products/2 returns product with id 2', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/2`);
    const body = await response.json();
    expect(body).toHaveProperty('id', 2);
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('price');
  });

  test('GET /products/3 returns product with id 3', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/3`);
    const body = await response.json();
    expect(body).toHaveProperty('id', 3);
    expect(body).toHaveProperty('title');
  });

  test('POST /products/add returns new product', async ({ request }) => {
    const response = await request.post(`${API_BASE}/products/add`, {
      data: { title: 'Test Product', price: 9.99 },
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('title', 'Test Product');
  });

  test('PUT /products/1 updates product', async ({ request }) => {
    const response = await request.put(`${API_BASE}/products/1`, {
      data: { title: 'Updated Product' },
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('title', 'Updated Product');
  });

  test('DELETE /products/1 returns deleted product', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/products/1`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('isDeleted', true);
  });

  test('GET /products returns total count property', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products`);
    const body = await response.json();
    expect(body).toHaveProperty('total');
    expect(typeof body.total).toBe('number');
    expect(body.total).toBeGreaterThan(0);
  });

  test('GET /products response has correct structure', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products`);
    const body = await response.json();
    expect(body).toHaveProperty('products');
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('skip');
    expect(body).toHaveProperty('limit');
  });

  test('GET multiple products sequentially', async ({ request }) => {
    for (let i = 1; i <= 5; i++) {
      const response = await request.get(`${API_BASE}/products/${i}`);
      const body = await response.json();
      expect(response.status()).toBe(200);
      expect(body).toHaveProperty('id', i);
    }
  });

  test('GET /products/search?q=laptop returns results', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/search?q=laptop`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('products');
  });

  test('GET /products with different limits', async ({ request }) => {
    for (const limit of [1, 3, 5, 10]) {
      const response = await request.get(`${API_BASE}/products?limit=${limit}`);
      const body = await response.json();
      expect(body.products.length).toBeLessThanOrEqual(limit);
    }
  });

  // ❌ FAIL (7)
  test('GET /products/1 should have warranty field', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/1`);
    const body = await response.json();
    expect(body).toHaveProperty('warranty', '2 years');
  });

  test('GET /products should return exactly 200 products', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products`);
    const body = await response.json();
    expect(body.products.length).toBe(200);
  });

  test('POST /products/add should return 201 status', async ({ request }) => {
    const response = await request.post(`${API_BASE}/products/add`, {
      data: { title: 'Test Product', price: 9.99 },
    });
    expect(response.status()).toBe(201);
  });

  test('GET /products/1 should have manufacturer field', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/1`);
    const body = await response.json();
    expect(body).toHaveProperty('manufacturer', 'Apple Inc.');
  });

  test('GET /products should have weight field on products', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/1`);
    const body = await response.json();
    expect(body).toHaveProperty('weight_kg', 0.5);
  });

  test('GET /products/1 should have shipping info', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products/1`);
    const body = await response.json();
    expect(body).toHaveProperty('shippingInfo');
    expect(body.shippingInfo).toHaveProperty('freeShipping', true);
  });

  test('GET /products should support sort by price', async ({ request }) => {
    const response = await request.get(`${API_BASE}/products?sortBy=price&order=asc`);
    const body = await response.json();
    expect(body.products[0].price).toBeLessThan(body.products[1].price);
  });

  // 🔄 FLAKY (3)
  test('Flaky - Product search API response', async ({ request }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    const response = await request.get(`${API_BASE}/products/search?q=phone`);
    expect(response.status()).toBe(200);
  });

  test('Flaky - Product category API timing', async ({ request }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    const response = await request.get(`${API_BASE}/products/categories`);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('Flaky - Product pagination API response', async ({ request }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    const response = await request.get(`${API_BASE}/products?limit=5&skip=10`);
    expect(response.status()).toBe(200);
  });

  // ⏭️ SKIP (2)
  test.skip('Bulk update product prices', async ({ request }) => {
    const response = await request.put(`${API_BASE}/products/bulk-update`, {
      data: { ids: [1, 2], price: 19.99 },
    });
    expect(response.status()).toBe(200);
  });

  test.skip('Batch delete products', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/products/batch-delete`, {
      data: { ids: [1, 2, 3] },
    });
    expect(response.status()).toBe(200);
  });

});
