import * as process from 'node:process';

export default () => ({
  port: process.env.PORT && parseInt(process.env.PORT, 10),

  client: {
    url: process.env.CLIENT_URL,
  },

  cookie: {
    secure: process.env.COOKIE_SECURE === 'true',
    httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
    sameSite: process.env.COOKIE_SAME_SITE,
    maxAge:
      process.env.COOKIE_MAX_AGE && parseInt(process.env.COOKIE_MAX_AGE, 10),
    path: process.env.COOKIE_PATH,
  },

  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT && parseInt(process.env.REDIS_PORT, 10),
  },

  session: {
    ttl: process.env.SESSION_TTL && parseInt(process.env.SESSION_TTL, 10),
    max: process.env.SESSION_MAX && parseInt(process.env.SESSION_MAX, 10),
  },

  token: {
    verify: {
      ttl:
        process.env.TOKEN_VERIFY_TTL &&
        parseInt(process.env.TOKEN_VERIFY_TTL, 10),
    },
    reset: {
      ttl:
        process.env.TOKEN_RESET_TTL &&
        parseInt(process.env.TOKEN_RESET_TTL, 10),
    },
  },

  email: {
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },

  user: {
    unverifiedTtlMs:
      process.env.USER_UNVERIFIED_TTL_MS &&
      parseInt(process.env.USER_UNVERIFIED_TTL_MS, 10),
  },

  search: {
    jobSeeker: {
      pageSize:
        process.env.SEARCH_JOB_SEEKER_PAGE_SIZE &&
        parseInt(process.env.SEARCH_JOB_SEEKER_PAGE_SIZE, 10),
    },
    company: {
      pageSize:
        process.env.SEARCH_COMPANY_PAGE_SIZE &&
        parseInt(process.env.SEARCH_COMPANY_PAGE_SIZE, 10),
    },
    vacancy: {
      pageSize:
        process.env.SEARCH_VACANCY_PAGE_SIZE &&
        parseInt(process.env.SEARCH_VACANCY_PAGE_SIZE, 10),
    },
    application: {
      pageSize:
        process.env.SEARCH_APPLICATION_PAGE_SIZE &&
        parseInt(process.env.SEARCH_APPLICATION_PAGE_SIZE, 10),
    },
  },
});
