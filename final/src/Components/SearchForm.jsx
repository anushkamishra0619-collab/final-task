import { useState } from "react";
import {
  FaLocationArrow, FaMapMarkerAlt, FaExchangeAlt, FaArrowRight, FaCheckCircle,
} from "react-icons/fa";
import { stations, findStationId } from "../data/network";

const QUICK = ["rajiv_chowk", "new_delhi", "anand_vihar", "akshardham"];

export default function SearchForm({
  fromText, toText, setFromText, setToText, onSubmit, error,
}) {
  const [focus, setFocus] = useState(null); // "from" | "to" | null

  const fromOk = !!findStationId(fromText);
  const toOk = !!findStationId(toText);
  const ready = fromOk && toOk;

  const swap = () => { setFromText(toText); setToText(fromText); };
  const useMyLocation = () => setFromText(stations.vaishali); // demo default

  // stations matching what is typed (excluding an exact match)
  const suggest = (text) => {
    const q = text.trim().toLowerCase();
    return Object.values(stations)
      .filter((n) => n.toLowerCase().includes(q) && n.toLowerCase() !== q)
      .slice(0, 5);
  };

  const Suggestions = ({ text, onPick }) => {
    const list = suggest(text);
    if (!list.length) return null;
    return (
      <ul className="sx-sug">
        {list.map((name) => (
          <li key={name}>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); onPick(name); setFocus(null); }}
            >
              <FaMapMarkerAlt /> {name}
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="sx-stage">
      <form
        className="sx"
        onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      >
        <span className="sx-chip"><i /> SMART ROUTING</span>
        <h2>Find Your Way<b>.</b></h2>
        <p className="sx-sub">Compare every route on time, fare and walking.</p>

        <div className="sx-route">
          {/* dotted line between the two points */}
          <div className="sx-rail">
            <i className="sx-from-dot" />
            <span />
            <FaMapMarkerAlt />
          </div>

          <div className="sx-fields">
            {/* FROM */}
            <div className={`sx-field ${focus === "from" ? "focus" : ""}`}>
              <input
                placeholder="Your location..."
                value={fromText}
                onChange={(e) => setFromText(e.target.value)}
                onFocus={() => setFocus("from")}
                onBlur={() => setFocus(null)}
              />
              {fromOk && <FaCheckCircle className="sx-ok" />}
              <button type="button" className="sx-iconbtn" onClick={useMyLocation} aria-label="Use my location">
                <FaLocationArrow />
              </button>
              {focus === "from" && <Suggestions text={fromText} onPick={setFromText} />}
            </div>

            {/* TO */}
            <div className={`sx-field ${focus === "to" ? "focus" : ""}`}>
              <input
                placeholder="Where to?"
                value={toText}
                onChange={(e) => setToText(e.target.value)}
                onFocus={() => setFocus("to")}
                onBlur={() => setFocus(null)}
              />
              {toOk && <FaCheckCircle className="sx-ok" />}
              <button type="button" className="sx-iconbtn sx-swap" onClick={swap} aria-label="Swap locations">
                <FaExchangeAlt />
              </button>
              {focus === "to" && <Suggestions text={toText} onPick={setToText} />}
            </div>
          </div>
        </div>

        {/* quick places */}
        <div className="sx-quick">
          <em>QUICK</em>
          {QUICK.map((id) => (
            <button
              key={id}
              type="button"
              className={stations[id] === toText ? "on" : ""}
              onClick={() => setToText(stations[id])}
            >
              {stations[id]}
            </button>
          ))}
        </div>

        {error && <p className="sx-error">{error}</p>}

        <button className={`sx-submit ${ready ? "ready" : ""}`} type="submit">
          Get Route <FaArrowRight />
        </button>
      </form>
    </div>
  );
}