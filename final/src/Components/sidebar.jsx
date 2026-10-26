import { useState } from "react";
import {
  FaHome, FaInfoCircle, FaCog, FaSignOutAlt, FaTimes, FaMoon,
} from "react-icons/fa";

export default function Sidebar({ open, user, dark, setDark, onHome, onAbout, onLogout, onClose }) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <button className="close-btn" onClick={onClose} aria-label="Close menu">
        <FaTimes />
      </button>

      <div className="profile">
        <div className="avatar">{(user.name || "U")[0].toUpperCase()}</div>
        <div>
          <strong>{user.name}</strong>
          <small>{user.email}</small>
        </div>
      </div>

      <nav>
        <button onClick={onHome}><FaHome /> Home</button>
        <button onClick={onAbout}><FaInfoCircle /> About</button>
        <button onClick={() => setSettingsOpen(!settingsOpen)}><FaCog /> Settings</button>

        {settingsOpen && (
          <div className="nav-row sub">
            <FaMoon /> Dark mode
            <button
              type="button"
              className={`switch ${dark ? "on" : ""}`}
              onClick={() => setDark(!dark)}
              aria-label="Toggle dark mode"
            />
          </div>
        )}
      </nav>

      <button className="signout" onClick={onLogout}>
        <FaSignOutAlt /> Sign out
      </button>
    </aside>
  );
}