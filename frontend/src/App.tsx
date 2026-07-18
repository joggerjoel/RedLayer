import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { ConfigPage } from "./pages/ConfigPage";
import { DashboardPage } from "./pages/DashboardPage";

type Theme = "light" | "dark";

function initialTheme(): Theme {
  const saved = localStorage.getItem("redlayer-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("redlayer-theme", theme);
  }, [theme]);

  return (
    <button
      className="btn ghost theme-toggle"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}

export function App() {
  return (
    <div className="app">
      <header className="topbar">
        <Link
          to="/"
          className="logo"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Red<span className="mark">Layer</span>
        </Link>
        <span className="sub">SMB Lending AI · prompt-injection red-team</span>
        <span className="spacer" />
        <ThemeToggle />
      </header>
      <Routes>
        <Route path="/" element={<ConfigPage />} />
        <Route path="/scans/:id" element={<DashboardPage />} />
      </Routes>
    </div>
  );
}
