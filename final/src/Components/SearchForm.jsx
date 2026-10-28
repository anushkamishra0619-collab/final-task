import { useState } from "react";
import { FiNavigation, FiMapPin, FiArrowRight, FiZap, FiShield, FiDollarSign } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";
import { TbArrowsUpDown } from "react-icons/tb";
import { stations } from "../data/network";
import AuroraMapBackground from "./AuroraMapBackground";


export default function SearchForm({ fromText, toText, setFromText, setToText, onSubmit, error }) {


  const swap = () => { setFromText(toText); setToText(fromText); };
  const useMyLocation = () => setFromText(stations.vaishali);

  return (
    <section className="search-page">
    <AuroraMapBackground />
    <form
      className="card search sf-card"
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
    >
      <h2 className="sf-title">Find Your Way</h2>

      <div className="sf-fields">
        <div className="sf-track">
          <span className="sf-dot" />
          <span className="sf-line" />
          <FiMapPin className="sf-pin" />
        </div>

        <div className="sf-inputs">
          <div className="sf-input">
            <input
              list="stations-list"
              placeholder="Your location..."
              value={fromText}
              onChange={(e) => setFromText(e.target.value)}
            />
            <button
              type="button"
              className="sf-icon-btn"
              onClick={useMyLocation}
              aria-label="Use my location"
            >
              <FiNavigation className="sf-pulse" />
            </button>
          </div>

          <div className="sf-input">
            <input
              list="stations-list"
              placeholder="Where to?"
              value={toText}
              onChange={(e) => setToText(e.target.value)}
            />
          </div>
        </div>

        <button type="button" className="sf-swap" onClick={swap} aria-label="Swap locations">
          <TbArrowsUpDown />
        </button>
      </div>

      <datalist id="stations-list">
        {Object.values(stations).map((name) => <option key={name} value={name} />)}
      </datalist>

      

      {error && <p className="sf-error">{error}</p>}

      <button className="sf-submit" type="submit">
        Get Route <FiArrowRight />
      </button>
    </form>
    </section>
  );
}