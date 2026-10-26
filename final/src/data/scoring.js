const COST_KEYS = ["time", "fare", "walk", "transfers"];

function normalize(value, min, max) {
  return max === min ? 0 : (value - min) / (max - min);
}

export function scoreRoutes(routes, weights) {
  if (!routes.length) return [];

  const range = {};
  [...COST_KEYS, "reliability"].forEach((key) => {
    const values = routes.map((route) => route[key]);
    range[key] = { min: Math.min(...values), max: Math.max(...values) };
  });

  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0) || 1;

  return routes
    .map((route) => {
      let cost = 0;
      COST_KEYS.forEach((key) => {
        cost += weights[key] * normalize(route[key], range[key].min, range[key].max);
      });
      cost += weights.reliability *
        (1 - normalize(route.reliability, range.reliability.min, range.reliability.max));
      return { ...route, score: cost / totalWeight };
    })
    .sort((a, b) => a.score - b.score);
}

export function addLabels(ranked) {
  if (!ranked.length) return ranked;
  const best = (key, direction = 1) =>
    ranked.reduce((current, candidate) =>
      direction * (candidate[key] - current[key]) < 0 ? candidate : current
    );

  const picks = {
    "Best Balanced": ranked[0].id,
    Fastest: best("time").id,
    Cheapest: best("fare").id,
    "Least Walking": best("walk").id,
    "Most Reliable": best("reliability", -1).id,
  };

  return ranked.map((route) => ({
    ...route,
    labels: Object.entries(picks)
      .filter(([, id]) => id === route.id)
      .map(([label]) => label),
  }));
}
