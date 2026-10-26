// Reasons for the "Why this route?" card (compared with the other options)
export function whyThisRoute(route, all) {
  if (all.length < 2) return { pros: ["This is the only available route"], cons: [] };

  const min = (k) => Math.min(...all.map((r) => r[k]));
  const max = (k) => Math.max(...all.map((r) => r[k]));
  const pros = [];
  const cons = [];
  const km = (m) => (m / 1000).toFixed(1);
  if (route.time === min("time")) pros.push(`Shortest travel time (${route.time} min)`);
  else cons.push(`${route.time - min("time")} min slower than the fastest option`);
  if (route.fare === min("fare")) {
    pros.push(route.fare === 0 ? "Free to travel" : `Lowest total fare (₹${route.fare})`);
  } else {
    cons.push(`₹${route.fare - min("fare")} more than the cheapest option`);
  }
  const extraWalk = route.walk - min("walk");
  if (route.walk === min("walk")) {
    pros.push(route.walk === 0 ? "No walking needed" : `Least walking (${km(route.walk)} km)`);
  } else if (extraWalk >= 300) {
    cons.push(`${km(extraWalk)} km more walking than the best option`);
  }


  const extraTransfers = route.transfers - min("transfers");
  if (route.transfers === 0) pros.push("No transfers needed");
  else if (extraTransfers === 0) pros.push(`Fewest transfers (${route.transfers})`);
  else cons.push(`${extraTransfers} more transfer${extraTransfers === 1 ? "" : "s"} than the best option`);

  const pct = Math.round(route.reliability * 100);
  if (route.reliability === max("reliability")) pros.push(`Most reliable option (${pct}%)`);
  else if (route.reliability >= 0.8) pros.push(`Reliable connections (${pct}%)`);
  else if (route.reliability < 0.6) cons.push(`Lower reliability (${pct}%)`);

  return { pros, cons };
}