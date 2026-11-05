import { useState } from "react";
import {
  FaEnvelope, FaLock, FaUser, FaClock, FaRupeeSign, FaWalking, FaShieldAlt,
  FaTimes,
} from "react-icons/fa";
import Logo from "./logo";
import HowToDemo from "./HowToDemo";
import LandingFooter from "./LandingFooter";

const FEATURES = [
  { Icon: FaClock, text: "Travel time" },
  { Icon: FaRupeeSign, text: "Total fare" },
  { Icon: FaWalking, text: "Walking distance" },
  { Icon: FaShieldAlt, text: "Reliability" },
];

export default function LandingPage({ onAuth }) {
  const [open, setOpen] = useState(false);          // is the popup open?
  const [mode, setMode] = useState("signin");       // "signin" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const openAuth = (m) => { setMode(m); setError(""); setOpen(true); };
  const closeAuth = () => { setOpen(false); setError(""); };

  const submit = (e) => {
    e.preventDefault();
    if (mode === "signup" && !form.name.trim()) return setError("Please enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email address.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setError("");
    onAuth({
      name: form.name.trim() || form.email.split("@")[0],
      email: form.email,
    });
  };

  return (
    <div className="landing">
      {/* ---------- NAVBAR ---------- */}
      <nav className="landing-nav">
        <Logo size="lg" />
        <div className="nav-actions">
          <button className="nav-btn ghost" onClick={() => openAuth("signin")}>Sign in</button>
          <button className="nav-btn solid" onClick={() => openAuth("signup")}>Sign up</button>
        </div>
      </nav>

      {/* ---------- BODY: visual left, text right ---------- */}
      <div className="landing-body">
        <div className="demo-panel">
          <HowToDemo />
        </div>

        <section className="hero">
          <h1>Don't just find a route.<br />Find <em>your</em> route.</h1>
          <p>
            RouteWise compares every journey on time, fare, walking, transfers and
            reliability, then explains which one fits you best.
          </p>
          <div className="feature-chips">
            {FEATURES.map(({ Icon, text }) => (
              <span key={text} className="chip static"><Icon /> {text}</span>
            ))}
          </div>
        </section>
      </div>
            <LandingFooter onPlan={() => openAuth("signup")} />

      {/* ---------- SIGN IN / SIGN UP POPUP ---------- */}
      {open && (
        <div className="modal-backdrop" onClick={closeAuth}>
          <form
            className="card auth-card"
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="modal-close" onClick={closeAuth} aria-label="Close">
              <FaTimes />
            </button>

            <div className="tabs">
              <button type="button" className={mode === "signin" ? "active" : ""}
                      onClick={() => { setMode("signin"); setError(""); }}>Sign in</button>
              <button type="button" className={mode === "signup" ? "active" : ""}
                      onClick={() => { setMode("signup"); setError(""); }}>Sign up</button>
            </div>

            <h2>{mode === "signin" ? "Welcome back" : "Create your account"}</h2>

            {mode === "signup" && (
              <div className="field">
                <FaUser className="field-icon" />
                <input placeholder="Full name" value={form.name} onChange={update("name")} />
              </div>
            )}
            <div className="field">
              <FaEnvelope className="field-icon" />
              <input type="email" placeholder="Email" value={form.email} onChange={update("email")} />
            </div>
            <div className="field">
              <FaLock className="field-icon" />
              <input type="password" placeholder="Password" value={form.password} onChange={update("password")} />
            </div>

            {error && <p className="error">{error}</p>}

            <button className="primary-btn" type="submit">
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}