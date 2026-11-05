import { FaGithub, FaLinkedinIn, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Logo from "./logo";

const EXPLORE = ["Home", "About", "Find a Route", "Compare Routes"];
const ROUTE_TYPES = ["Fastest Route", "Cheapest Route", "Least Walking", "Best Balanced"];

export default function LandingFooter({ onPlan }) {
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="lf">
      <div className="lf-inner">
        <div className="lf-grid">
          {/* brand: same Logo as the top-left navbar */}
          <div className="lf-brand">
            <Logo size="lg" />
            <p>
              Compare, rank and understand every journey by time, fare, walking
              distance, transfers and reliability.
            </p>
            <div className="lf-social">
              <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
              <a href="https://linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X"><FaXTwitter /></a>
            </div>
          </div>

          {/* explore */}
          <div className="lf-col">
            <h4>EXPLORE</h4>
            {EXPLORE.map((t) => (
              <button key={t} onClick={t === "Home" ? toTop : onPlan}>{t}</button>
            ))}
          </div>

          {/* route types */}
          <div className="lf-col">
            <h4>ROUTE TYPES</h4>
            {ROUTE_TYPES.map((t) => (
              <button key={t} onClick={onPlan}>{t}</button>
            ))}
          </div>

          {/* contact */}
          <div className="lf-col">
            <h4>CONTACT</h4>
            <a className="lf-contact" href="mailto:hello@routewise.app">
              <FaEnvelope /> hello@routewise.app
            </a>
            <span className="lf-contact">
              <FaMapMarkerAlt /> Ghaziabad, India
            </span>
          </div>
        </div>

        <div className="lf-bottom">
          <span>© 2026 RouteWise. All rights reserved.</span>
          <span className="lf-legal">
            <button onClick={toTop}>Privacy</button>
            <button onClick={toTop}>Terms</button>
          </span>
          <span>Built by <strong>Anushka Mishra</strong></span>
        </div>
      </div>
    </footer>
  );
}