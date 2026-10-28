import { useState } from "react";
import {
  FaEnvelope, FaLock, FaUser, FaClock, FaRupeeSign, FaWalking, FaShieldAlt,
} from "react-icons/fa";
import Logo from "./logo";

const FEATURES = [
  { Icon: FaClock, text: "Travel time" },
  { Icon: FaRupeeSign, text: "Total fare" },
  { Icon: FaWalking, text: "Walking distance" },
  { Icon: FaShieldAlt, text: "Reliability" },
];

export default function LandingPage({ onAuth }) {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

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
      <header className="landing-header">

        <Logo size="lg" />
        </header>
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

      <form className="card auth-card" onSubmit={submit}>
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
  );
}