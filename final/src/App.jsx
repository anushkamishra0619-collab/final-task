import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { findStationId } from "./data/network";
import Logo from "./Components/logo";
import LandingPage from "./Components/landingpage";
import Sidebar from "./Components/sidebar";
import AboutPanel from "./Components/AboutPanel";
import SearchForm from "./Components/SearchForm";
import ResultsPage from "./Components/ResultsPage";
import "./App.css";

function loadUser() {
  try { return JSON.parse(localStorage.getItem("routewise_user")); }
  catch { return null; }
}

export default function App() {
  const [user, setUser] = useState(loadUser);
  const [page, setPage] = useState("home"); // "home" | "results"
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [error, setError] = useState("");
  const [weights, setWeights] = useState({
    time: 5, fare: 5, walk: 5, transfers: 5, reliability: 5,
  });

  // station ids are derived from what the user typed
  const fromId = findStationId(fromText);
  const toId = findStationId(toText);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  const closeAll = () => { setSidebarOpen(false); setAboutOpen(false); };

  const login = (u) => {
    try { localStorage.setItem("routewise_user", JSON.stringify(u)); } catch { /* ignore */ }
    setUser(u);
    setPage("home");
  };

  const logout = () => {
    try { localStorage.removeItem("routewise_user"); } catch { /* ignore */ }
    closeAll();
    setUser(null);
  };

  const getRoute = () => {
    if (!fromId || !toId) return setError("Pick both locations from the suggestions list.");
    if (fromId === toId) return setError("Start and destination must be different.");
    setError("");
    setPage("results");
  };

  if (!user) return <LandingPage onAuth={login} />;

  return (
    <div className="shell">
      <header className="topbar">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <FaBars />
        </button>
        <Logo />
        <div className="avatar-sm">{(user.name || "U")[0].toUpperCase()}</div>
      </header>

      <div className={`overlay ${sidebarOpen || aboutOpen ? "show" : ""}`} onClick={closeAll} />

      <Sidebar
        open={sidebarOpen}
        user={user}
        dark={dark}
        setDark={setDark}
        onHome={() => { setPage("home"); closeAll(); }}
        onAbout={() => { setSidebarOpen(false); setAboutOpen(true); }}
        onLogout={logout}
        onClose={closeAll}
      />
      <AboutPanel open={aboutOpen} onClose={() => setAboutOpen(false)} />

      <main className={page === "home" ? "search-page" : undefined}>
        {page === "home" ? (
          <SearchForm
            fromText={fromText} toText={toText}
            setFromText={setFromText} setToText={setToText}
            onSubmit={getRoute} error={error}
          />
        ) : (
          <ResultsPage
            fromId={fromId} toId={toId}
            weights={weights} setWeights={setWeights}
            onBack={() => setPage("home")}
          />
        )}
      </main>
    </div>
  );
}