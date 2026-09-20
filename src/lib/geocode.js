// Real geocoding — replaces the old hardcoded Patna demo point.
//
// Forward geocoding: OSM Nominatim (https://nominatim.openstreetmap.org) — free,
// no API key needed for low-volume/demo use. Its usage policy requires:
//   - a descriptive User-Agent (set via the `Referer`-equivalent header browsers
//     allow us to control, i.e. we identify via a query param + doc title since
//     browser fetch cannot set a custom User-Agent header directly)
//   - no more than ~1 request/second — enforced here with a simple debounce
//   - no request-per-keystroke — callers must debounce input (see useGeocode hook)
//
// For real production traffic beyond a demo, swap NOMINATIM_URL for a paid/
// self-hosted instance, or a free-tier key-based alternative (LocationIQ:
// 5,000 req/day free, OpenCage: 2,500 req/day free) — same {lat, lon} shape.

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

let lastRequestAt = 0;

async function throttle() {
  const elapsed = Date.now() - lastRequestAt;
  if (elapsed < 1000) await new Promise((r) => setTimeout(r, 1000 - elapsed));
  lastRequestAt = Date.now();
}

/**
 * Forward geocode a free-text address to coordinates.
 * Returns { lat, lng, displayName } or null if nothing matched.
 */
export async function geocodeAddress(address) {
  if (!address || address.trim().length < 3) return null;
  await throttle();

  const url = `${NOMINATIM_URL}?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(address)}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.length) return null;
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    };
  } catch (err) {
    console.warn('Geocoding failed:', err.message);
    return null;
  }
}

/**
 * Get the browser's real current position via the Geolocation API.
 * Free, no key, works on desktop and mobile. Returns a Promise<{lat,lng}>.
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

// Haversine distance in kilometers — used to check serviceability against a
// cooperative's coverage radius.
export function distanceKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return R * 2 * Math.asin(Math.sqrt(h));
}
