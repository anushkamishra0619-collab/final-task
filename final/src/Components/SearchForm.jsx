import {
  FaCrosshairs, FaLocationArrow, FaMapMarkerAlt, FaExchangeAlt, FaSearch,
} from "react-icons/fa";
import { stations } from "../data/network";

export default function SearchForm({ fromText, toText, setFromText, setToText, onSubmit, error }) {
  const swap = () => { setFromText(toText); setToText(fromText); };
  const useMyLocation = () => setFromText(stations.vaishali);

  return (
    <form
      className="card search"
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
    >
      <h2>Find Your Way</h2>

      <div className="field">
        <FaCrosshairs className="field-icon" />
        <input
          list="stations-list"
          placeholder="Your location..."
          value={fromText}
          onChange={(e) => setFromText(e.target.value)}
        />
        <button type="button" className="icon-btn" onClick={useMyLocation} aria-label="Use my location">
          <FaLocationArrow />
        </button>
      </div>

      <div className="field">
        <FaMapMarkerAlt className="field-icon" />
        <input
          list="stations-list"
          placeholder="Where to?"
          value={toText}
          onChange={(e) => setToText(e.target.value)}
        />
        <button type="button" className="icon-btn swap-icon" onClick={swap} aria-label="Swap locations">
          <FaExchangeAlt />
        </button>
      </div>

      <datalist id="stations-list">
        {Object.values(stations).map((name) => <option key={name} value={name} />)}
      </datalist>

      {error && <p className="error">{error}</p>}

      <button className="primary-btn" type="submit">
        <FaSearch /> Get Route
      </button>
    </form>
  );
}