import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { scenario } from 'k6/execution';

export function runAuthFlow(baseUrl) {
  group('Auth Flow', () => {
    const uniqueId = `${scenario.iterationInTest}_${randomString(5)}`;
    const email = `auth_${uniqueId}@test.com`;
    const password = 'Password123!';
    const params = {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'auth_flow' },
    };

    http.post(
      `${baseUrl}/auth/register`,
      JSON.stringify({ email, password }),
      params,
    );

    const loginRes = http.post(
      `${baseUrl}/auth/login`,
      JSON.stringify({ email, password }),
      params,
    );

    check(loginRes, {
      'auth login 200': (r) => r.status === 200,
      'auth has sid': (r) =>
        r.headers['Set-Cookie'] && r.headers['Set-Cookie'].includes('sid='),
    });

    sleep(3);
  });
}
