import http from 'k6/http';
import { check, sleep, group } from 'k6';

export function runSearchVacanciesFlow(baseUrl) {
  group('Search Vacancies Flow', () => {
    const searchPayload = JSON.stringify({
      page: 1,
      take: 20,
      ...(Math.random() > 0.6 ? { title: 'Developer' } : {}),
      ...(Math.random() > 0.8 ? { salaryMin: 500 } : {}),
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
      tags: { name: 'search_vacancies_flow' },
    };

    const res = http.post(`${baseUrl}/vacancies/search`, searchPayload, params);

    check(res, { 'search 200': (r) => r.status === 200 });
    sleep(1);
  });
}
