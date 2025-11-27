export async function fetchWithFallback(endpointPath, options = {}) {
  const primaryBase = 'https://vynceianoani.helioho.st/skonnect-api/';
  const fallbackBase = 'https://skonnect.atwebpages.com/'; // fallback/proxy site

  const primaryUrl = primaryBase + endpointPath;
  const fallbackUrl = fallbackBase + endpointPath;

  // Try primary first
  try {
    const res = await fetch(primaryUrl, { ...options, cache: options.cache ?? 'no-store' });
    if (res && res.ok) return res;
    // Non-ok responses fall through to fallback
  } catch (e) {
    // swallow and try fallback
  }

  // Try fallback
  return fetch(fallbackUrl, { ...options });
}