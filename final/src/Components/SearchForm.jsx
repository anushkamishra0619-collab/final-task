import { useEffect, useState } from "react";
import {
  FaLocationArrow, FaMapMarkerAlt, FaExchangeAlt, FaArrowRight, FaCheckCircle,
} from "react-icons/fa";
import { stations, coords, findStationId } from "../data/network";
import { searchPlaces } from "../data/places";

const QUICK = ["Rajiv Chowk", "New Delhi", "Anand Vihar", "Akshardham"];

export default function SearchForm({
  fromText, toText, setFromText, setToText,
  fromPlace, toPlace, setFromPlace, setToPlace,
  onSubmit, error, busy,
}) {
  const [focus, setFocus] = useState(null); // "from" | "to" | null
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [geoErr, setGeoErr] = useState("");

  const activeText = focus === "from" ? fromText : focus === "to" ? toText : "";
  const skip = focus === "from" ? !!fromPlace : focus === "to" ? !!toPlace : true;

  // debounced live place search
  useEffect(() => {
    if (!focus || skip || activeText.trim().length < 2) { setResults([]); setSearching(false); return; }
    const ctrl = new AbortController();
    setSearching(true);
    const t = setTimeout(async () => {
      try { setResults(await searchPlaces(activeText, ctrl.signal)); }
      catch (e) { if (e.name !== "AbortError") setResults([]); }
      finally { setSearching(false); }
    }, 350);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [focus, activeText, skip]);

  const pick = (which, place) => {
    if (which === "from") { setFromText(place.name); setFromPlace(place); }
    else { setToText(place.name); setToPlace(place); }
    setResults([]); setFocus(null);
  };

  const swap = () => {
    setFromText(toText); setToText(fromText);
    setFromPlace(toPlace); setToPlace(fromPlace);
  };

  const useMyLocation = () => {
    setGeoErr("");
    if (!navigator.geolocation) return setGeoErr("Location is not supported on this device.");
    navigator.geolocation.getCurrentPosition(
      (pos) => pick("from", { name: "My location", area: "", lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setGeoErr("Allow location access to use this.")
    );
  };

  const quickPlace = (name) => {
    const id = findStationId(name);
    return id ? { name: stations[id], area: "Metro station", ...coords[id] } : null;
  };
  const quick = QUICK.map(quickPlace).filter(Boolean);

  const ready = !!fromPlace && !!toPlace;

  const dropdown = (which) =>
    focus === which && (searching || results.length > 0) && (
      <ul className="sx-sug">
        {searching && !results.length && <li className="sx-hint">Searching places...</li>}
        {results.map((p, i) => (
          <li key={`${p.name}-${p.lat}-${i}`}>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); pick(which, p); }}>
              <FaMapMarkerAlt /> <span>{p.name}</span>
              {p.area && <small>{p.area}</small>}
            </button>
          </li>
        ))}
      </ul>
    );

  return (
    <div className="sx-stage">
      <form className="sx" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <span className="sx-chip"><i /> SMART ROUTING</span>
        <h2>Find Your Way<b>.</b></h2>
        <p className="sx-sub">Compare every route on time, fare and walking.</p>

        <div className="sx-route">
          <div className="sx-rail">
            <i className="sx-from-dot" />
            <span />
            <FaMapMarkerAlt />
          </div>

          <div className="sx-fields">
            <div className={`sx-field ${focus === "from" ? "focus" : ""}`}>
              <input
                placeholder="Your location..."
                value={fromText}
                onChange={(e) => { setFromText(e.target.value); setFromPlace(null); }}
                onFocus={() => setFocus("from")}
                onBlur={() => setFocus(null)}
              />
              {fromPlace && <FaCheckCircle className="sx-ok" />}
              <button type="button" className="sx-iconbtn" onClick={useMyLocation} aria-label="Use my location">
                <FaLocationArrow />
              </button>
              {dropdown("from")}
            </div>

            <div className={`sx-field ${focus === "to" ? "focus" : ""}`}>
              <input
                placeholder="Where to?"
                value={toText}
                onChange={(e) => { setToText(e.target.value); setToPlace(null); }}
                onFocus={() => setFocus("to")}
                onBlur={() => setFocus(null)}
              />
              {toPlace && <FaCheckCircle className="sx-ok" />}
              <button type="button" className="sx-iconbtn sx-swap" onClick={swap} aria-label="Swap locations">
                <FaExchangeAlt />
              </button>
              {dropdown("to")}
            </div>
          </div>
        </div>

        {quick.length > 0 && (
          <div className="sx-quick">
            <em>QUICK</em>
            {quick.map((p) => (
              <button
                key={p.name}
                type="button"
                className={toPlace?.name === p.name ? "on" : ""}
                onClick={() => { setToText(p.name); setToPlace(p); }}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}

        {(error || geoErr) && <p className="sx-error">{error || geoErr}</p>}

        <button className={`sx-submit ${ready ? "ready" : ""}`} type="submit" disabled={busy}>
          {busy ? "Finding routes..." : <>Get Route <FaArrowRight /></>}
        </button>
      </form>
    </div>
  );
}