import {
  FaClock, FaRupeeSign, FaWalking, FaExchangeAlt, FaShieldAlt,
} from "react-icons/fa";

const FIELDS = [
  { key: "time", label: "Travel time", Icon: FaClock },
  { key: "fare", label: "Total fare", Icon: FaRupeeSign },
  { key: "walk", label: "Walking", Icon: FaWalking },
  { key: "transfers", label: "Transfers", Icon: FaExchangeAlt },
  { key: "reliability", label: "Reliability", Icon: FaShieldAlt },
];

export default function Preferences({ weights, setWeights }) {
  return (
    <div className="card">
      <h3>How important is each factor?</h3>
      {FIELDS.map(({ key, label, Icon }) => (
        <div className="slider-row" key={key}>
          <span><Icon /> {label}</span>
          <input
            type="range"
            min="0"
            max="10"
            value={weights[key]}
            onChange={(event) =>
              setWeights({ ...weights, [key]: Number(event.target.value) })
            }
          />
          <b>{weights[key]}</b>
        </div>
      ))}
    </div>
  );
}
