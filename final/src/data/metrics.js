import { calcFare } from "./fare";

export const TRANSFER_PENALTY = 4;


export function buildLegs(path, distanceOverrides = {}) {
  const legs = [];
  path.forEach((e) => {
    const distance = distanceOverrides[`${e.from}>${e.to}`] ?? e.distance;
    const last = legs[legs.length - 1];
    if (last && last.line === e.line && last.mode === e.mode) {
      last.to = e.to;
      last.time += e.time;
      last.distance += distance;
      last.stops.push(e.to);
    } else {
      legs.push({
        from: e.from, to: e.to, mode: e.mode, line: e.line,
        time: e.time, distance,
        stops: [e.from, e.to], 
      });
    }
  });

  
  legs.forEach((l) => {
    l.fare = calcFare(l.mode, l.distance);
    l.walk = l.mode === "walk" ? Math.round(l.distance * 1000) : 0;
  });
  return legs;
}

export function computeMetrics(path, id, distanceOverrides = {}) {
  const legs = buildLegs(path, distanceOverrides);
  const rides = legs.filter((l) => l.mode !== "walk");
  const transfers = Math.max(0, rides.length - 1);

  return {
    id,
    path,
    legs,
    time: path.reduce((s, e) => s + e.time, 0) + transfers * TRANSFER_PENALTY,
    fare: legs.reduce((s, l) => s + l.fare, 0),
    walk: legs.reduce((s, l) => s + l.walk, 0),
    distance: path.reduce(
      (sum, edge) => sum + (distanceOverrides[`${edge.from}>${edge.to}`] ?? edge.distance),
      0,
    ),
    transfers,
    reliability: path.reduce((p, e) => p * e.reliability, 1),
    modes: [...new Set(legs.map((l) => l.mode))],
  };
}