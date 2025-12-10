export const options = {
  scenarios: {
    search_vacancies_flow: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 50 },
        { duration: '60s', target: 120 },
        { duration: '20s', target: 0 },
      ],
      gracefulStop: '15s',
    },

    auth_flow: {
      executor: 'constant-vus',
      vus: 15,
      duration: '90s',
    },

    job_seeker_flow: {
      executor: 'constant-vus',
      vus: 8,
      duration: '90s',
      startTime: '5s',
    },

    recruiter_flow: {
      executor: 'constant-vus',
      vus: 5,
      duration: '90s',
      startTime: '10s',
    },
  },

  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<1500'],

    'http_req_duration{name:search_vacancies_flow}': ['p(95)<1500'],
    'http_req_duration{name:auth_flow}': ['p(95)<1200'],
    'http_req_duration{name:recruiter_flow}': ['p(95)<1500'],
    'http_req_duration{name:job_seeker_flow}': ['p(95)<1500'],
  },
};

export const BASE_URL = 'http://k6-api:8020/api';
