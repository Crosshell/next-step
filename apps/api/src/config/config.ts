export default () => ({
  cookie: {
    secure: process.env.COOKIE_SECURE === 'true',
    httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
    sameSite: process.env.COOKIE_SAME_SITE,
    maxAge: process.env.COOKIE_MAX_AGE,
    path: process.env.COOKIE_PATH,
  },
  app: {
    port: process.env.APP_PORT || 3001,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  session: {
    ttl: process.env.SESSION_TTL,
    max: process.env.SESSION_MAX,
  },
});
