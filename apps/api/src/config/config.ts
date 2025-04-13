export default () => ({
  cookie: {
    secure: process.env.COOKIE_SECURE === 'true',
    httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
    sameSite: process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none',
    maxAge: parseInt(process.env.COOKIE_MAX_AGE || '86400'),
    path: process.env.COOKIE_PATH,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
});
