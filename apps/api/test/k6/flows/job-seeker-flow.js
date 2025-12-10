import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { scenario } from 'k6/execution';
import { getSidFromSetCookie } from '../utils.js';

export function runJobSeekerFlow(baseUrl) {
  group('Job Seeker Flow', () => {
    const uniqueId = `${scenario.iterationInTest}_${randomString(6)}`;
    const email = `app_${uniqueId}@stress.com`;
    const password = 'Password123!';

    const params = {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'job_seeker_flow' },
    };

    const regRes = http.post(
      `${baseUrl}/auth/register`,
      JSON.stringify({ email, password }),
      params,
    );

    if (regRes.status !== 201) {
      console.error(`AppFlow Reg Failed: ${regRes.status}`);
      return;
    }

    const loginRes = http.post(
      `${baseUrl}/auth/login`,
      JSON.stringify({ email, password }),
      params,
    );

    check(loginRes, { 'app login 200': (r) => r.status === 200 });

    if (loginRes.status !== 200) return;

    const sid = getSidFromSetCookie(loginRes.headers['Set-Cookie']);
    if (!sid) {
      console.error('RecruiterFlow: sid not found in Set-Cookie');
      return;
    }

    const authParams = {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `sid=${sid}`,
      },
      tags: { name: 'application_flow' },
    };

    const profilePayload = JSON.stringify({
      firstName: 'Stress',
      lastName: 'Tester',
      expectedSalary: 1000 + Math.floor(Math.random() * 5000),
      seniorityLevel: 'SENIOR',
    });

    const profileRes = http.post(
      `${baseUrl}/job-seekers`,
      profilePayload,
      authParams,
    );

    if (profileRes.status !== 201) return;

    const searchRes = http.post(
      `${baseUrl}/vacancies/search`,
      JSON.stringify({ take: 1 }),
      authParams,
    );

    try {
      const vacancyId = searchRes.json('data.0.id');

      if (vacancyId) {
        const applyPayload = JSON.stringify({
          vacancyId: vacancyId,
          coverLetter: `I am the best candidate ${uniqueId}`,
        });

        const applyRes = http.post(
          `${baseUrl}/applications`,
          applyPayload,
          authParams,
        );

        check(applyRes, {
          'application submitted (201)': (r) => r.status === 201,
        });
      }
    } catch (e) {
      console.error('Failed to parse vacancy search response');
    }

    sleep(5);
  });
}
