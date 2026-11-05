import { useEffect, useState } from "react";
import {
  FaCrosshairs, FaMapMarkerAlt, FaSearch, FaClock, FaRupeeSign,
  FaStar, FaMousePointer, FaWalking, FaExchangeAlt,
} from "react-icons/fa";

const FROM = "Vaishali";
const TO = "New Delhi";
const CYCLE = 110; // ticks of 120 ms, about 13 s per loop

const STEPS = [
  { title: "1. Enter your trip", text: "Type where you are and where you want to go." },
  { title: "2. Press Get Route", text: "RouteWise builds every possible journey." },
  { title: "3. Compare routes", text: "See time, fare and walking for each option." },
  { title: "4. Read why", text: "Each route explains why it is a good pick." },
];

const ROUTES = [
  { label: "Fastest", time: 38, fare: 30 },
  { label: "Cheapest", time: 52, fare: 20 },
  { label: "Best Balanced", time: 41, fare: 25, best: true },
];

export default function HowToDemo() {
  const [t, setT] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setT((p) => (p + 1) % CYCLE), 120);
    return () => clearInterval(id);
  }, []);

  const step = t < 40 ? 0 : t < 55 ? 1 : t < 85 ? 2 : 3;

  const fromTxt = FROM.slice(0, Math.min(FROM.length, Math.floor(t / 2)));
  const toTxt = t >= 18 ? TO.slice(0, Math.min(TO.length, Math.floor((t - 18) / 2))) : "";
  const typingFrom = step === 0 && fromTxt.length < FROM.length;
  const typingTo = step === 0 && !typingFrom && toTxt.length < TO.length;

  const showResults = step >= 2;

  return (
    <div className="demo">
      <div className="demo-head">
        <span className="demo-kicker">HOW IT WORKS</span>
        <h3>Plan a trip in 4 steps</h3>
      </div>

      <div className="demo-window">
        <div className="demo-bar">
          <i /><i /><i />
          <span>routewise</span>
        </div>

        {!showResults ? (
          <div className="demo-screen" key="form">
            <strong className="demo-title">Find Your Way</strong>

            <div className={`demo-field ${typingFrom ? "focus" : ""}`}>
              <FaCrosshairs />
              <span>
                {fromTxt || <em>Your location...</em>}
                {typingFrom && <b className="caret" />}
              </span>
            </div>

            <div className={`demo-field ${typingTo ? "focus" : ""}`}>
              <FaMapMarkerAlt />
              <span>
                {toTxt || <em>Where to?</em>}
                {typingTo && <b className="caret" />}
              </span>
            </div>

            <div className={`demo-btn ${step === 1 ? "pressed" : ""}`}>
              <FaSearch /> Get Route
            </div>

            {step === 1 && <FaMousePointer className="demo-cursor" />}
          </div>
        ) : (
          <div className="demo-screen" key="results">
            <strong className="demo-title">
              {FROM} → {TO}
            </strong>

            {ROUTES.map((r, i) => (
              <div
                key={r.label}
                className={`demo-card ${r.best ? "best" : ""} ${r.best && step === 3 ? "glow" : ""}`}
                style={{ animationDelay: `${i * 0.25}s` }}
              >
                <span className="demo-badge">
                  {r.best && <FaStar />} {r.label}
                </span>
                <span className="demo-meta">
                  <FaClock /> {r.time} min
                </span>
                <span className="demo-meta">
                  <FaRupeeSign /> {r.fare}
                </span>
              </div>
            ))}

            {step === 3 && (
              <div className="demo-why">
                <strong>Why this route?</strong>
                <p>
                  <FaWalking /> Less walking than average
                  <br />
                  <FaExchangeAlt /> Only 1 transfer, fare below average
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="demo-foot">
        <div className="demo-caption" key={step}>
          <strong>{STEPS[step].title}</strong>
          <span>{STEPS[step].text}</span>
        </div>
        <div className="demo-dots">
          {STEPS.map((_, i) => (
            <i key={i} className={i === step ? "on" : i < step ? "done" : ""} />
          ))}
        </div>
      </div>
    </div>
  );
}