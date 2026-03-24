import { test, expect } from '@playwright/test';

const API_BASE = 'https://dummyjson.com';

test.describe('API Users', () => {

  // ✅ PASS (25)
  test('GET /users returns 200', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users`);
    expect(response.status()).toBe(200);
  });

  test('GET /users returns users array', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users`);
    const body = await response.json();
    expect(body).toHaveProperty('users');
    expect(Array.isArray(body.users)).toBe(true);
  });

  test('GET /users/1 returns user with id 1', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('firstName');
  });

  test('GET /users?limit=3 returns max 3 users', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users?limit=3`);
    const body = await response.json();
    expect(body.users.length).toBeLessThanOrEqual(3);
  });

  test('DELETE /users/1 returns isDeleted true', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('isDeleted', true);
  });

  test('GET /users/1 has firstName property', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('firstName');
    expect(typeof body.firstName).toBe('string');
    expect(body.firstName.length).toBeGreaterThan(0);
  });

  test('GET /users/1 has lastName property', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('lastName');
    expect(typeof body.lastName).toBe('string');
  });

  test('GET /users/1 has email property', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('email');
    expect(typeof body.email).toBe('string');
    expect(body.email).toContain('@');
  });

  test('GET /users/1 has age property', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('age');
    expect(typeof body.age).toBe('number');
    expect(body.age).toBeGreaterThan(0);
  });

  test('GET /users/1 has gender property', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('gender');
    expect(typeof body.gender).toBe('string');
  });

  test('GET /users/1 has phone property', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('phone');
    expect(typeof body.phone).toBe('string');
  });

  test('GET /users/1 has username property', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('username');
    expect(typeof body.username).toBe('string');
  });

  test('GET /users/1 has image property', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('image');
    expect(typeof body.image).toBe('string');
  });

  test('GET /users/1 has address property', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('address');
    expect(typeof body.address).toBe('object');
  });

  test('GET /users?limit=10 returns exactly 10 users', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users?limit=10`);
    const body = await response.json();
    expect(body.users.length).toBe(10);
  });

  test('GET /users?limit=1 returns single user', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users?limit=1`);
    const body = await response.json();
    expect(body.users.length).toBe(1);
  });

  test('GET /users?skip=5&limit=5 skips first 5 users', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users?skip=5&limit=5`);
    const body = await response.json();
    expect(body.users.length).toBeLessThanOrEqual(5);
    expect(body).toHaveProperty('skip', 5);
  });

  test('GET /users/search?q=john returns results', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/search?q=john`);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('users');
    expect(Array.isArray(body.users)).toBe(true);
  });

  test('GET /users/2 returns user with id 2', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/2`);
    const body = await response.json();
    expect(body).toHaveProperty('id', 2);
    expect(body).toHaveProperty('firstName');
    expect(body).toHaveProperty('email');
  });

  test('GET /users/3 returns user with id 3', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/3`);
    const body = await response.json();
    expect(body).toHaveProperty('id', 3);
    expect(body).toHaveProperty('firstName');
  });

  test('POST /users/add returns new user', async ({ request }) => {
    const response = await request.post(`${API_BASE}/users/add`, {
      data: { firstName: 'Test', lastName: 'User' },
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('firstName', 'Test');
  });

  test('PUT /users/1 updates user', async ({ request }) => {
    const response = await request.put(`${API_BASE}/users/1`, {
      data: { firstName: 'Updated' },
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('firstName', 'Updated');
  });

  test('GET /users returns total count property', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users`);
    const body = await response.json();
    expect(body).toHaveProperty('total');
    expect(typeof body.total).toBe('number');
    expect(body.total).toBeGreaterThan(0);
  });

  test('GET /users response has correct structure', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users`);
    const body = await response.json();
    expect(body).toHaveProperty('users');
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('skip');
    expect(body).toHaveProperty('limit');
  });

  test('GET multiple users sequentially', async ({ request }) => {
    for (let i = 1; i <= 5; i++) {
      const response = await request.get(`${API_BASE}/users/${i}`);
      const body = await response.json();
      expect(response.status()).toBe(200);
      expect(body).toHaveProperty('id', i);
    }
  });

  test('GET /users with different limits', async ({ request }) => {
    for (const limit of [1, 3, 5, 10]) {
      const response = await request.get(`${API_BASE}/users?limit=${limit}`);
      const body = await response.json();
      expect(body.users.length).toBeLessThanOrEqual(limit);
    }
  });

  test('POST /auth/login returns token', async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/login`, {
      data: { username: 'emilys', password: 'emilyspass' },
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('accessToken');
  });

  // ❌ FAIL (7)
  test('GET /users/1 should have role as superadmin', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('role', 'superadmin');
  });

  test('GET /users should return exactly 100 users by default', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users`);
    const body = await response.json();
    expect(body.users.length).toBe(100);
  });

  test('POST /users/add should return 201 status', async ({ request }) => {
    const response = await request.post(`${API_BASE}/users/add`, {
      data: { firstName: 'Test', lastName: 'User' },
    });
    expect(response.status()).toBe(201);
  });

  test('GET /users/1 should have department field', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('department', 'Engineering');
  });

  test('GET /users/1 should have salary field', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('salary');
    expect(body.salary).toBeGreaterThan(50000);
  });

  test('GET /users/1 should have permissions array', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    const body = await response.json();
    expect(body).toHaveProperty('permissions');
    expect(Array.isArray(body.permissions)).toBe(true);
    expect(body.permissions).toContain('admin');
  });

  test('GET /users should support sort by name', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users?sortBy=firstName&order=asc`);
    const body = await response.json();
    const first = body.users[0].firstName;
    const second = body.users[1].firstName;
    expect(first.localeCompare(second)).toBeLessThanOrEqual(0);
  });

  // 🔄 FLAKY (3)
  test('Flaky - User search API response', async ({ request }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    const response = await request.get(`${API_BASE}/users/search?q=john`);
    expect(response.status()).toBe(200);
  });

  test('Flaky - User auth token refresh', async ({ request }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    const response = await request.get(`${API_BASE}/users/1`);
    expect(response.status()).toBe(200);
  });

  test('Flaky - User pagination API response', async ({ request }) => {
    if (test.info().retry === 0) {
      expect(true).toBe(false);
    }
    const response = await request.get(`${API_BASE}/users?limit=5&skip=10`);
    expect(response.status()).toBe(200);
  });

  // ⏭️ SKIP (2)
  test.skip('Bulk delete users endpoint', async ({ request }) => {
    const response = await request.post(`${API_BASE}/users/bulk-delete`, {
      data: { ids: [1, 2, 3] },
    });
    expect(response.status()).toBe(200);
  });

  test.skip('Batch update user roles', async ({ request }) => {
    const response = await request.put(`${API_BASE}/users/batch-update`, {
      data: { ids: [1, 2], role: 'admin' },
    });
    expect(response.status()).toBe(200);
  });

});
