export function getSidFromSetCookie(setCookie) {
  if (!setCookie) return null;

  const raw = Array.isArray(setCookie) ? setCookie.join(';') : setCookie;

  const match = raw.match(/sid=([^;]+)/);
  return match ? match[1] : null;
}
