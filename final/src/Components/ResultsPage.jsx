import { useMemo, useState } from "react";
import { FaArrowLeft, FaSlidersH } from "react-icons/fa";
import { edges, stations, coords } from "../data/network";
import { distanceKm } from "../data/places";
import { buildGraph, findRoutes } from "../data/graph";
import { computeMetrics } from "../data/metrics";
import { scoreRoutes, addLabels } from "../data/scoring";
import Preferences from "./Preferences";
import RouteCard from "./RouteCard";
import CompareTable from "./CompareTable";

const SORTS = [
  { key: "time", label: "Fastest" },
  { key: "score", label: "Best Balanced" },
  { key: "fare", label: "Cheapest" },
  { key: "walk", label: "Least Walking" },
];

// A real city network is huge, so keep only stations near the trip.
// This keeps the all-routes search fast.
function corridor(all, fromId, toId, slack = 1.3) {
  const A = coords[fromId], B = coords[toId];
  const direct = distanceKm(A, B);
  const memo = new Map();
  const inside = (id) => {
    if (!memo.has(id)) {
      const c = coords[id];
      memo.set(id, !!c && distanceKm(A, c) + distanceKm(c, B) <= direct * slack + 1.5);
    }
    return memo.get(id);
  };
  return all.filter((e) => inside(e.from) && inside(e.to));
}

export default function ResultsPage({ fromId, toId, extraEdges, weights, setWeights, onBack }) {
  const [sortKey, setSortKey] = useState("time");
  const [showPrefs, setShowPrefs] = useState(false);

  const graph = useMemo(
    () => buildGraph(corridor([...edges, ...extraEdges], fromId, toId)),
    [extraEdges, fromId, toId]
  );

  const routes = useMemo(
    () => findRoutes(graph, fromId, toId).slice(0, 300).map((p, i) => computeMetrics(p, i)),
    [graph, fromId, toId]
  );

  const ranked = useMemo(() => addLabels(scoreRoutes(routes, weights)), [routes, weights]);

  const shown = useMemo(
    () => [...ranked].sort((a, b) => a[sortKey] - b[sortKey]),
    [ranked, sortKey]
  );

  return (
    <section className="results">
      <button className="back-btn" onClick={onBack}>
        <FaArrowLeft /> Edit trip
      </button>

      <div className="results-head">
        <h2>{stations[fromId]} → {stations[toId]}</h2>
        <p>{ranked.length} route{ranked.length === 1 ? "" : "s"} found</p>
      </div>

      <div className="sort-row">
        {SORTS.map(({ key, label }) => (
          <button
            key={key}
            className={`chip ${sortKey === key ? "active" : ""}`}
            onClick={() => setSortKey(key)}
          >
            {label}
          </button>
        ))}
        <button className="chip" onClick={() => setShowPrefs(!showPrefs)}>
          <FaSlidersH /> Preferences
        </button>
      </div>

      {showPrefs && <Preferences weights={weights} setWeights={setWeights} />}

      {ranked.length === 0 && <p className="empty">No route found between these places.</p>}

      {shown.slice(0, 5).map((r, i) => (
        <RouteCard key={r.id} route={r} all={ranked} rank={i} />
      ))}

      {ranked.length > 0 && <CompareTable routes={shown} />}
    </section>
  );
}