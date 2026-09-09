import assert from 'node:assert/strict';
import test from 'node:test';
import handler from '../api/admin-auth.js';

function request(method, body, cookie = '') {
  let statusCode = 200;
  const headers = {};
  const response = {
    status(value) { statusCode = value; return this; },
    setHeader(name, value) { headers[name] = value; return this; },
    end(value) { return { statusCode, headers, value }; }
  };
  return handler({ method, body, headers: { cookie } }, response);
}

test('admin authentication rejects a wrong password and accepts a signed session', async () => {
  process.env.ADMIN_PASSWORD = 'correct-password';
  process.env.ADMIN_SESSION_SECRET = 'a-test-secret-that-is-longer-than-32-characters';

  const rejected = await request('POST', { password: 'wrong-password' });
  assert.equal(rejected.statusCode, 401);

  const accepted = await request('POST', { password: 'correct-password' });
  assert.equal(accepted.statusCode, 200);
  assert.match(accepted.headers['Set-Cookie'], /HttpOnly/);
  assert.match(accepted.headers['Set-Cookie'], /SameSite=Strict/);

  const cookie = accepted.headers['Set-Cookie'].split(';')[0];
  const verified = await request('GET', null, cookie);
  assert.deepEqual(JSON.parse(verified.value), { authenticated: true });

  const anonymous = await request('GET', null);
  assert.deepEqual(JSON.parse(anonymous.value), { authenticated: false });
});
