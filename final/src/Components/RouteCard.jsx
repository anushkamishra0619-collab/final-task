import {
  FaWalking, FaBus, FaSubway, FaTaxi, FaTrain,
  FaClock, FaRupeeSign, FaStar, FaExchangeAlt, FaShieldAlt,
} from "react-icons/fa";
import { stations } from "../data/network";
import { explainRoute, describeRoute } from "../data/explain";

const MODE_ICON = { walk: FaWalking, bus: FaBus, metro: FaSubway, cab: FaTaxi, train: FaTrain };

export default function RouteCard({ route, all, rank }) {
  const notes = explainRoute(route, all);

  return (
    <div className={`card route ${rank === 0 ? "top" : ""}`}>
      <div className="route-head">
        <div className="labels">
          {route.labels.map((l) => (
            <span key={l} className="badge">
              {l === "Best Balanced" && <FaStar />} {l}
            </span>
          ))}
        </div>
        <div className="summary">
          <span><FaClock /> {route.time} min</span>
          <span><FaRupeeSign /> {route.fare}</span>
        </div>
      </div>

      <p className="desc">{describeRoute(route)}</p>

      <div className="stats">
        <span><FaWalking /> {route.walk} m</span>
        <span><FaExchangeAlt /> {route.transfers} transfer{route.transfers === 1 ? "" : "s"}</span>
        <span><FaShieldAlt /> {Math.round(route.reliability * 100)}%</span>
      </div>

      <ul className="legs">
        {route.legs.map((leg, i) => {
          const Icon = MODE_ICON[leg.mode];
          return (
            <li key={i}>
              <Icon />
              <span>
                {leg.line}: {stations[leg.from]} → {stations[leg.to]}
                <small> ({leg.time} min{leg.walk ? `, ${leg.walk} m` : ""})</small>
              </span>
            </li>
          );
        })}
      </ul>

      <div className="why">
        <strong>Why this route?</strong>
        <ul>{notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
      </div>
    </div>
  );
}