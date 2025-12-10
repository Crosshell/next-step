import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { scenario } from 'k6/execution';
import { getSidFromSetCookie } from '../utils.js';

export function runRecruiterFlow(baseUrl) {
  group('Recruiter Flow', () => {
    const uid = `${scenario.iterationInTest}_${randomString(6)}`;
    const email = `recruiter_${uid}@test.com`;
    const password = 'Password123!';

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
      tags: { name: 'recruiter_flow' },
    };

    const regRes = http.post(
      `${baseUrl}/auth/register`,
      JSON.stringify({ email, password }),
      params,
    );

    if (regRes.status !== 201) {
      console.error(`RecruiterFlow Reg Failed: ${regRes.status}`);
      return;
    }

    const loginRes = http.post(
      `${baseUrl}/auth/login`,
      JSON.stringify({ email, password }),
      params,
    );

    check(loginRes, { 'recruiter login 200': (r) => r.status === 200 });
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
      tags: { name: 'recruiter_flow' },
    };

    const recruiterRes = http.post(
      `${baseUrl}/recruiters`,
      JSON.stringify({
        firstName: 'Rec',
        lastName: `Tester_${uid}`,
      }),
      authParams,
    );

    check(recruiterRes, {
      'recruiter created (201)': (r) => r.status === 201,
    });

    const companyRes = http.post(
      `${baseUrl}/companies`,
      JSON.stringify({
        name: `Test Company ${uid}`,
        description: 'Load test company',
      }),
      authParams,
    );

    check(companyRes, {
      'company created (201)': (r) => r.status === 201,
    });

    if (companyRes.status !== 201) return;

    const vacancyRes = http.post(
      `${baseUrl}/vacancies`,
      JSON.stringify({
        title: `Test Vacancy ${uid}`,
        description:
          'Load test vacancy Load test vacancy Load test vacancy Load test vacancy',
        salaryMin: 1000,
        salaryMax: 4000,
        workFormat: ['REMOTE'],
        employmentType: ['FULL_TIME'],
        seniorityLevel: 'SENIOR',
      }),
      authParams,
    );

    check(vacancyRes, {
      'vacancy created (201)': (r) => r.status === 201,
    });

    const jsSearchRes = http.post(
      `${baseUrl}/job-seekers/search`,
      JSON.stringify({
        page: 1,
        take: 10,
        ...(Math.random() > 0.6 ? { seniorityLevel: 'SENIOR' } : {}),
      }),
      authParams,
    );

    check(jsSearchRes, {
      'job-seeker search 200': (r) => r.status === 200,
    });

    sleep(4);
  });
}
