import { FaBus, FaCar, FaTrain, FaMapMarkerAlt } from "react-icons/fa";
import "./AnimatedBackground.css";

// Each route is a dashed line with one vehicle driving along it
const routes = [
  { top: "26%", angle: -6, Icon: FaBus,   duration: 16, delay: 0 },
  { top: "60%", angle: 5,  Icon: FaCar,   duration: 20, delay: 3 },
  { top: "82%", angle: -3, Icon: FaTrain, duration: 24, delay: 6 },
];

// Location pins placed around the map
const pins = [
  { left: "12%", top: "18%", color: "#ef4444", delay: 0 },
  { left: "78%", top: "30%", color: "#7c3aed", delay: 1 },
  { left: "22%", top: "70%", color: "#16a34a", delay: 2 },
  { left: "86%", top: "74%", color: "#f59e0b", delay: 3 },
];

export default function AnimatedBackground({ children }) {
  return (
    <div className="map-bg">
      {/* Streets, parks and water (pans slowly) */}
      <div className="map-layer" />

      {/* Routes with moving vehicles */}
      {routes.map(({ top, angle, Icon, duration, delay }, i) => (
        <div
          key={i}
          className="route"
          style={{ top, transform: `rotate(${angle}deg)` }}
          aria-hidden="true"
        >
          <div className="route-line" />
          <Icon
            className="vehicle"
            style={{
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        </div>
      ))}

      {/* Pulsing location pins */}
      {pins.map(({ left, top, color, delay }, i) => (
        <div
          key={i}
          className="pin"
          style={{ left, top, color, animationDelay: `${delay}s` }}
          aria-hidden="true"
        >
          <FaMapMarkerAlt />
          <span className="pin-ring" style={{ animationDelay: `${delay}s` }} />
        </div>
      ))}

      {/* Your form/page content */}
      <div className="map-bg__content">{children}</div>
    </div>
  );
}