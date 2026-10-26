import { MdOutlineMyLocation } from "react-icons/md";

export default function Logo({ size = "md" }) {
  return (
    <div className={`logo ${size}`}>
      <span className="logo-mark"><MdOutlineMyLocation /></span>
      <span className="logo-name">RouteWise</span>
    </div>
  );
}