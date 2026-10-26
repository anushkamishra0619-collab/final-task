import { stations } from "../data/network";
import { TRANSFER_PENALTY } from "./metrics";

const fmt = (mins) => {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

export function buildTimeline(route, startMinutes = 10 * 60) {
  const steps = [];
  let clock = startMinutes;
  let rodeBefore = false;

  steps.push({ type: "start", place: stations[route.legs[0].from], at: fmt(clock) });

  route.legs.forEach((leg) => {
    const isRide = leg.mode !== "walk";

  
    if (isRide && rodeBefore) {
      steps.push({
        type: "transfer",
        place: stations[leg.from],
        from: fmt(clock),
        to: fmt(clock + TRANSFER_PENALTY),
        wait: TRANSFER_PENALTY,
      });
      clock += TRANSFER_PENALTY;
    }

    const begin = clock;
    clock += leg.time;
    steps.push({ type: isRide ? "ride" : "walk", leg, from: fmt(begin), to: fmt(clock) });
    if (isRide) rodeBefore = true;
  });

  const lastLeg = route.legs[route.legs.length - 1];
  steps.push({ type: "arrive", place: stations[lastLeg.to], at: fmt(clock) });
  return steps;
}