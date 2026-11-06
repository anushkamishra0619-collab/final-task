import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { loadNetwork } from "./data/network";
import { buildTripEdges } from "./data/places";
import Logo from "./Components/logo";
import LandingPage from "./Components/landingpage";
import Sidebar from "./Components/sidebar";
import AboutPanel from "./Components/AboutPanel";
import SearchForm from "./Components/SearchForm";
import ResultsPage from "./Components/ResultsPage";
import AnimatedBackground from "./AnimatedBackground";
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
  const [dark, setDark] = useState(true);

  const [net, setNet] = useState("loading"); // "loading" | "ready" | "error"
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [fromPlace, setFromPlace] = useState(null);
  const [toPlace, setToPlace] = useState(null);
  const [trip, setTrip] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [weights, setWeights] = useState({
    time: 5, fare: 5, walk: 5, transfers: 5, reliability: 5,
  });

  useEffect(() => {
    loadNetwork().then(() => setNet("ready")).catch(() => setNet("error"));
  }, []);

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

  const getRoute = async () => {
    if (!fromPlace || !toPlace) return setError("Pick both locations from the suggestions list.");
    if (fromPlace.lat === toPlace.lat && fromPlace.lng === toPlace.lng)
      return setError("Start and destination must be different.");
    setError("");
    setBusy(true);
    try {
      const extraEdges = await buildTripEdges(fromPlace, toPlace);
      setTrip({ fromId: "__from", toId: "__to", extraEdges });
      setPage("results");
    } catch {
      setError("Could not prepare routes. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  if (!user) return <LandingPage onAuth={login} />;

  return (
    <div className="shell">
      <header className={`topbar ${page === "home" ? "topbar-search" : ""}`}>
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

      <main>
        {net === "loading" && <p className="empty">Loading the transport network...</p>}
        {net === "error" && (
          <p className="empty">
            Could not load network.json. Run scripts/build-network.mjs first.
          </p>
        )}
        {net === "ready" && page === "home" && (
          <AnimatedBackground>
            <SearchForm
              fromText={fromText} toText={toText}
              setFromText={setFromText} setToText={setToText}
              fromPlace={fromPlace} toPlace={toPlace}
              setFromPlace={setFromPlace} setToPlace={setToPlace}
              onSubmit={getRoute} error={error} busy={busy}
            />
          </AnimatedBackground>
        )}
        {net === "ready" && page === "results" && trip && (
          <ResultsPage
            fromId={trip.fromId} toId={trip.toId} extraEdges={trip.extraEdges}
            weights={weights} setWeights={setWeights}
            onBack={() => setPage("home")}
          />
        )}
      </main>
    </div>
  );
}