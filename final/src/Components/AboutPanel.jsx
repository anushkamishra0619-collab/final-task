import {
  FaTimes, FaMapMarkedAlt, FaProjectDiagram, FaRoute,
  FaBalanceScale, FaSortAmountDown, FaCommentDots,
} from "react-icons/fa";

const STEPS = [
  { Icon: FaMapMarkedAlt, title: "Enter your trip",
    text: "Type where you are and where you want to go." },
  { Icon: FaProjectDiagram, title: "Network becomes a graph",
    text: "Stations are nodes. Metro, bus, train, cab and walking links are edges carrying time, fare, walking distance and reliability." },
  { Icon: FaRoute, title: "Every route is generated",
    text: "A depth-first search finds all loop-free journeys between your two stations." },
  { Icon: FaBalanceScale, title: "Trade-offs are scored",
    text: "Each factor is normalised to a 0–1 scale, then weighted by your preference sliders." },
  { Icon: FaSortAmountDown, title: "Routes are ranked and labelled",
    text: "Fastest, Cheapest, Least Walking, Most Reliable and Best Balanced." },
  { Icon: FaCommentDots, title: "You get the reason",
    text: "Each route explains how it compares with the average option." },
];

export default function AboutPanel({ open, onClose }) {
  return (
    <aside className={`about-panel ${open ? "open" : ""}`}>
      <div className="about-head">
        <h2>How RouteWise works</h2>
        <button className="icon-btn" onClick={onClose} aria-label="Close"><FaTimes /></button>
      </div>

      <ol className="flow">
        {STEPS.map(({ Icon, title, text }, i) => (
          <li key={title}>
            <span className="flow-dot"><Icon /></span>
            <div>
              <h4>{i + 1}. {title}</h4>
              <p>{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}