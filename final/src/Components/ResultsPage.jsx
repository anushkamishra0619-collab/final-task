import { useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaSlidersH, FaTrophy, FaBus } from "react-icons/fa";
import { coords, edges, stations } from "../data/network";
import { buildGraph, findRoutes } from "../data/graph";
import { computeMetrics } from "../data/metrics";
import { fetchRoadDistanceKm } from "../data/fare";
import { scoreRoutes, addLabels } from "../data/scoring";
import Preferences from "./Preferences";
import CompareTable from "./CompareTable";
import RouteDetail from "./RouteDetail";

const graph = buildGraph(edges);

export default function ResultsPage({ fromId, toId, weights, setWeights, onBack }) {
  const [showPrefs, setShowPrefs] = useState(false);
  const [selected, setSelected] = useState(null);
  const [roadDistanceResult, setRoadDistanceResult] = useState({
    key: "",
    distances: {},
    status: "idle",
    error: "",
  });

  const paths = useMemo(
    () => findRoutes(graph, fromId, toId, { maxRoutes: 500 }),
    [fromId, toId],
  );

  const carEdges = useMemo(() => {
    const uniqueEdges = new Map();
    paths.flat().forEach((edge) => {
      if (edge.mode === "car") {
        uniqueEdges.set(`${edge.from}>${edge.to}`, edge);
      }
    });
    return [...uniqueEdges.values()];
  }, [paths]);
  const roadDistanceKey = carEdges.map((edge) => `${edge.from}>${edge.to}`).join(",");

  useEffect(() => {
    if (carEdges.length === 0) return undefined;

    const controller = new AbortController();
    Promise.all(carEdges.map(async (edge) => {
      const distance = await fetchRoadDistanceKm(
        coords[edge.from],
        coords[edge.to],
        controller.signal,
      );
      return [`${edge.from}>${edge.to}`, distance];
    }))
      .then((entries) => {
        setRoadDistanceResult({
          key: roadDistanceKey,
          distances: Object.fromEntries(entries),
          status: "loaded",
          error: "",
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setRoadDistanceResult({
            key: roadDistanceKey,
            distances: {},
            status: "error",
            error: error.message,
          });
        }
      });

    return () => controller.abort();
  }, [carEdges, roadDistanceKey]);

  const hasCurrentRoadDistances = roadDistanceResult.key === roadDistanceKey;
  const roadDistanceStatus = carEdges.length === 0
    ? "idle"
    : hasCurrentRoadDistances ? roadDistanceResult.status : "loading";

  const ranked = useMemo(() => {
    const distanceOverrides = roadDistanceResult.key === roadDistanceKey
      ? roadDistanceResult.distances
      : {};
    const routes = paths.map((path, i) => computeMetrics(path, i, distanceOverrides));
    return addLabels(scoreRoutes(routes, weights));
  }, [paths, roadDistanceKey, roadDistanceResult, weights]);
  if (selected) {
    return (
      <RouteDetail
        route={selected.route}
        all={ranked}
        title={selected.title}
        onBack={() => setSelected(null)}
      />
    );
  }

  const best = ranked.find((r) => r.labels.includes("Best Balanced"));

  return (
    <section className="results">
      <button className="back-btn" onClick={onBack}>
        <FaArrowLeft /> Edit trip
      </button>

      <div className="results-head">
        <h2>Compare All Routes</h2>
        <p>
          {stations[fromId]} → {stations[toId]} · See how each option performs
          across different factors.
        </p>
        <p className="data-note">
          Car fares use live road distances from OpenStreetMap OSRM when available;
          other modes use estimated per-kilometre fares.
        </p>
        {roadDistanceStatus === "loading" && (
          <p className="data-status" role="status">Fetching live road distances for car routes…</p>
        )}
        {roadDistanceStatus === "loaded" && (
          <p className="data-status" role="status">Live road distances loaded; car fares are recalculated.</p>
        )}
        {roadDistanceStatus === "error" && (
          <p className="data-error" role="alert">
            Live road distances are unavailable
            {roadDistanceResult.error ? ` (${roadDistanceResult.error})` : ""}.
            Showing estimates based on the configured route distances.
          </p>
        )}
      </div>

      <div className="sort-row">
        <button className="chip" onClick={() => setShowPrefs(!showPrefs)}>
          <FaSlidersH /> Preferences
        </button>
      </div>
      {showPrefs && <Preferences weights={weights} setWeights={setWeights} />}

      {ranked.length === 0 && <p className="empty">No route found between these stations.</p>}

      {ranked.length > 0 && (
        <>
          <CompareTable routes={ranked} onView={(route, title) => setSelected({ route, title })} />

          {best && (
            <div className="card reco">
              <FaTrophy className="reco-trophy" />
              <div>
                <small>Our Recommendation</small>
                <h3>Best Balanced Route</h3>
                <p>
                  A great mix of time, cost, walking and reliability
                  ({best.time} min · ₹{best.fare}).
                </p>
                <button
                  className="view-btn"
                  onClick={() => setSelected({ route: best, title: "Best Balanced Route" })}
                >
                  View
                </button>
              </div>
              <FaBus className="reco-bus" />
            </div>
          )}
        </>
      )}
    </section>
  );
}