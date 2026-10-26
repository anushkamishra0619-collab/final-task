import { useState } from "react";
import { FaBolt, FaCoins, FaWalking, FaBalanceScale, FaRoute } from "react-icons/fa";
import { MODE_LABEL } from "../data/fare";

const CATEGORIES = [
  { label: "Fastest", name: "Fastest", Icon: FaBolt, tone: "blue" },
  { label: "Cheapest", name: "Cheapest", Icon: FaCoins, tone: "orange" },
  { label: "Least Walking", name: "Least Walking", Icon: FaWalking, tone: "green" },
  { label: "Best Balanced", name: "Balanced", Icon: FaBalanceScale, tone: "purple" },
];

function Dots({ value }) {
  const filled = Math.round(value * 5);
  const level = filled >= 4 ? "hi" : filled === 3 ? "mid" : "lo";
  return (
    <span className={`dots ${level}`} title={`${Math.round(value * 100)}% reliable`}>
      {[0, 1, 2, 3, 4].map((i) => <i key={i} className={i < filled ? "on" : ""} />)}
    </span>
  );
}

export default function CompareTable({ routes, onView }) {
  const [showAll, setShowAll] = useState(false);
  const rows = CATEGORIES
    .map((c) => ({ ...c, title: `${c.label} Route`, route: routes.find((r) => r.labels.includes(c.label)) }))
    .filter((c) => c.route);
  const picked = new Set(rows.map((r) => r.route.id));
  const others = routes
    .filter((r) => !picked.has(r.id))
    .map((route, i) => ({
      name: `Option ${i + 1}`, title: `Option ${i + 1}`, Icon: FaRoute, tone: "grey", route,
    }));

  const list = showAll ? [...rows, ...others] : rows;

  return (
    <div className="card compare-card">
      <div className="table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Route</th><th>Time</th><th>Fare</th><th>Walking</th>
              <th>Transfers</th><th>Reliability</th><th></th>
            </tr>
          </thead>
          <tbody>
            {list.map(({ name, title, Icon, tone, route: r }) => (
              <tr key={title} className={`tone-${tone}`}>
                <td className="route-name">
                  <b><Icon /> {name}</b>
                  <small>{r.modes.map((m) => MODE_LABEL[m]).join(" + ")}</small>
                </td>
                <td>{r.time} min</td>
                <td>₹ {r.fare}</td>
                <td>{(r.walk / 1000).toFixed(1)} km</td>
                <td>{r.transfers}</td>
                <td><Dots value={r.reliability} /></td>
                <td><button className="view-btn" onClick={() => onView(r, title)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {others.length > 0 && (
        <button className="link-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show fewer routes" : `Show ${others.length} more route${others.length === 1 ? "" : "s"}`}
        </button>
      )}
    </div>
  );
}