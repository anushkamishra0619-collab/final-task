
export const FARE_RULES = {
  bus:   { base: 10,   perKm: 1.8, min: 10,  max: 40 },
  metro: { base: 20,   perKm: 3.5, min: 10,  max: 60 },
  train: { base: 15,   perKm: 2.2, min: 15,  max: 80 },
  car:   { base: 60,   perKm: 16,  min: 80,  max: 400 },
  plane: { base: 1800, perKm: 2.8, min: 2200, max: 12000 },
  walk:  { base: 0,    perKm: 0,   min: 0 },
};

export const MODE_LABEL = {
  bus: "Bus", metro: "Metro", train: "Train", car: "Car", plane: "Plane", walk: "Walk",
};

export function calcFare(mode, km) {
  const rule = FARE_RULES[mode];
  if (!rule) return 0;
  const raw = rule.base + rule.perKm * km;
  const clamped = Math.max(rule.min, raw);
  return Math.round(rule.max ? Math.min(rule.max, clamped) : clamped);
}

export async function fetchRoadDistanceKm(from, to, signal) {
  if (!Array.isArray(from) || !Array.isArray(to) ||
      from.length !== 2 || to.length !== 2 ||
      ![...from, ...to].every(Number.isFinite)) {
    throw new Error("Valid start and destination coordinates are required.");
  }

  const [fromLat, fromLon] = from;
  const [toLat, toLon] = to;
  const url = `https://router.project-osrm.org/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}?overview=false&steps=false`;
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Road distance service returned HTTP ${response.status}.`);
  }

  const data = await response.json();
  const distanceMeters = data.routes?.[0]?.distance;
  if (data.code !== "Ok" || !Number.isFinite(distanceMeters)) {
    throw new Error("Road distance service did not return a route.");
  }

  return distanceMeters / 1000;
}

export function describeFare(mode) {
  const rule = FARE_RULES[mode];
  if (!rule || (rule.base === 0 && rule.perKm === 0)) return "Free";
  const limits = `min ₹${rule.min}${rule.max ? `, max ₹${rule.max}` : ""}`;
  return `₹${rule.base} + ₹${rule.perKm}/km (${limits})`;
}