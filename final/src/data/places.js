import { stations, coords } from "./network";

const PHOTON = "https://photon.komoot.io/api/";
const BBOX = "76.8,28.2,77.8,29.0"; // Delhi NCR: minLon,minLat,maxLon,maxLat

export function distanceKm(a, b) {
  const R = 6371, rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

// Any address, landmark or station in Delhi NCR
export async function searchPlaces(query, signal) {
  const q = query.trim();
  if (q.length < 2) return [];
  const res = await fetch(`${PHOTON}?q=${encodeURIComponent(q)}&limit=6&lang=en&bbox=${BBOX}`, { signal });
  if (!res.ok) throw new Error("Place search failed");
  const data = await res.json();
  return data.features.map((f) => {
    const p = f.properties;
    const [lng, lat] = f.geometry.coordinates;
    return {
      name: p.name || p.street || q,
      area: [p.district || p.locality || p.city, p.state].filter(Boolean).join(", "),
      lat, lng,
    };
  });
}

function nearestStations(point, k = 2, maxKm = 3) {
  return Object.keys(coords)
    .map((id) => ({ id, km: distanceKm(point, coords[id]) }))
    .filter((s) => s.km <= maxKm)
    .sort((a, b) => a.km - b.km)
    .slice(0, k);
}

const walkCache = new Map();
async function walkMeters(a, b) {
  const key = `${a.lat},${a.lng};${b.lat},${b.lng}`;
  if (walkCache.has(key)) return walkCache.get(key);
  let meters = Math.round(distanceKm(a, b) * 1000 * 1.3); // fallback: straight line + detour
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(
      `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${a.lng},${a.lat};${b.lng},${b.lat}?overview=false`,
      { signal: ctrl.signal }
    );
    clearTimeout(t);
    const d = await res.json();
    if (d?.routes?.[0]?.distance) meters = Math.round(d.routes[0].distance);
  } catch { /* keep the fallback */ }
  walkCache.set(key, meters);
  return meters;
}

const walkEdge = (from, to, m) => ({
  from, to, mode: "walk", line: "Walk",
  time: Math.max(1, Math.round(m / 80)), fare: 0, distance: m / 1000, walk: m, reliability: 0.99,
});

// Connect the user's two places to the real network with walking legs
export async function buildTripEdges(fromPlace, toPlace) {
  coords.__from = { lat: fromPlace.lat, lng: fromPlace.lng };
  coords.__to = { lat: toPlace.lat, lng: toPlace.lng };
  stations.__from = fromPlace.name;
  stations.__to = toPlace.name;

  const out = [];
  for (const [id, place] of [["__from", fromPlace], ["__to", toPlace]]) {
    for (const s of nearestStations(place)) {
      const m = await walkMeters(place, coords[s.id]);
      out.push(walkEdge(id, s.id, m), walkEdge(s.id, id, m));
    }
  }
  if (distanceKm(fromPlace, toPlace) <= 2) {
    const m = await walkMeters(fromPlace, toPlace);
    out.push(walkEdge("__from", "__to", m), walkEdge("__to", "__from", m));
  }
  return out;
}