import {
  FaArrowLeft, FaClock, FaRupeeSign, FaWalking, FaExchangeAlt, FaShieldAlt,
  FaMapMarkerAlt, FaBus, FaSubway, FaTrain, FaCar, FaPlane,
  FaCheckCircle, FaInfoCircle,
} from "react-icons/fa";
import { stations } from "../data/network";
import { buildTimeline } from "../data/timeline";
import { whyThisRoute } from "../data/explain";
import { describeFare, MODE_LABEL } from "../data/fare";
import RouteMap from "./RouteMap";

const MODE_ICON = {
  walk: FaWalking, bus: FaBus, metro: FaSubway, train: FaTrain, car: FaCar, plane: FaPlane,
};

const RIDE_TITLE = {
  metro: (l) => `Board Metro (${l.line} Line)`,
  bus: (l) => `Board ${l.line}`,
  train: (l) => `Take ${l.line} train`,
  car: () => "Take a car",
  plane: (l) => `Take ${l.line}`,
};

const reliabilityLevel = (r) =>
  r >= 0.8 ? ["High", "high"] : r >= 0.6 ? ["Medium", "mid"] : ["Low", "low"];

const km = (m) => (m / 1000).toFixed(1);

export default function RouteDetail({ route, all, title, onBack }) {
  const steps = buildTimeline(route);
  const { pros, cons } = whyThisRoute(route, all);
  const [relLabel, relClass] = reliabilityLevel(route.reliability);
  const rides = route.legs.filter((l) => l.mode !== "walk");

  return (
    <section className="detail">
      <button className="back-btn" onClick={onBack}>
        <FaArrowLeft /> Back to Results
      </button>

      <div className="detail-grid">
        <div>
          <h2 className="detail-title">{title}</h2>

          <div className="card stat-strip">
            <div><FaClock /><b>{route.time} min</b><small>Total Time</small></div>
            <div><FaRupeeSign /><b>₹ {route.fare}</b><small>Total Fare</small></div>
            <div><FaWalking /><b>{km(route.walk)} km</b><small>Walking</small></div>
            <div><FaExchangeAlt /><b>{route.transfers}</b><small>Transfer</small></div>
          </div>

          <span className={`rel-badge ${relClass}`}>
            <FaShieldAlt /> {relLabel} Reliability
          </span>

          <div className="card">
            <ol className="timeline">
              {steps.map((s, i) => {
                if (s.type === "start" || s.type === "arrive") {
                  return (
                    <li key={i} className="tl">
                      <span className={`tl-dot ${s.type}`}><FaMapMarkerAlt /></span>
                      <div className="tl-body">
                        <strong>{s.type === "start" ? "Start" : "Arrive"}</strong>
                        <p>{s.place}</p>
                      </div>
                      <span className="tl-time">{s.at}</span>
                    </li>
                  );
                }

                if (s.type === "transfer") {
                  return (
                    <li key={i} className="tl">
                      <span className="tl-dot transfer"><FaExchangeAlt /></span>
                      <div className="tl-body">
                        <strong>Transfer at {s.place}</strong>
                        <p>{s.from} – {s.to} ({s.wait} min)</p>
                      </div>
                      <span />
                    </li>
                  );
                }

                const Icon = MODE_ICON[s.leg.mode];

                if (s.type === "walk") {
                  return (
                    <li key={i} className="tl">
                      <span className="tl-dot walk"><Icon /></span>
                      <div className="tl-body">
                        <strong>Walk {s.leg.time} min ({km(s.leg.walk)} km)</strong>
                        <p>{stations[s.leg.from]} → {stations[s.leg.to]}</p>
                      </div>
                      <span />
                    </li>
                  );
                }

                return (
                  <li key={i} className="tl">
                    <span className="tl-dot ride"><Icon /></span>
                    <div className="tl-body">
                      <strong>{RIDE_TITLE[s.leg.mode](s.leg)}</strong>
                      <p>{stations[s.leg.from]} → {stations[s.leg.to]} ({s.leg.time} min)</p>
                      <p>{s.from} – {s.to}</p>
                    </div>
                    <span className="tl-tag">{MODE_LABEL[s.leg.mode]} · ₹{s.leg.fare}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
        <div>
          <RouteMap route={route} />

          <div className="card why-card">
            <h3>Why this route?</h3>
            <ul className="checks">
              {pros.map((p) => (
                <li key={p}><FaCheckCircle className="ok" /> {p}</li>
              ))}
              {cons.map((c) => (
                <li key={c}><FaInfoCircle className="warn" /> {c}</li>
              ))}
            </ul>
            <FaBus className="why-bus" />
          </div>

          <div className="card">
            <h3>Fare breakdown</h3>
            <div className="table-wrap">
              <table className="fare-table">
                <thead>
                  <tr><th>Transport</th><th>Distance</th><th>How it's calculated</th><th>Fare</th></tr>
                </thead>
                <tbody>
                  {rides.length === 0 && (
                    <tr><td colSpan={4}>Walking only: free</td></tr>
                  )}
                  {rides.map((l, i) => (
                    <tr key={i}>
                      <td>{MODE_LABEL[l.mode]} ({l.line})</td>
                      <td>{Number(l.distance.toFixed(1))} km</td>
                      <td>{describeFare(l.mode)}</td>
                      <td>₹{l.fare}</td>
                    </tr>
                  ))}
                  <tr className="total">
                    <td colSpan={3}>Total</td>
                    <td>₹{route.fare}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}