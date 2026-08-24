"use client";

import { useState } from "react";

const RANGES = ["24H", "7D", "30D"] as const;
const ROUTES = [
  { path: "/", label: "Home / first signal", visits: "4,200", share: 82, movement: "+18%", status: "STEADY" },
  { path: "/projects", label: "Projects / proof shelf", visits: "2,800", share: 61, movement: "+11%", status: "RISING" },
  { path: "/domains", label: "Domains / wayfinding", visits: "1,950", share: 44, movement: "−04%", status: "QUIET" },
  { path: "/about", label: "About / handoff", visits: "840", share: 19, movement: "+06%", status: "STEADY" },
];

export default function Home() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("7D");
  return (
    <main className="route-shell">
      <div className="route-frame">
        <header className="route-topbar">
          <a href="https://bookchaowalit.com" className="route-mark" aria-label="Bookchaowalit home"><span>ROUTE</span> / BOARD</a>
          <span>SAMPLE TRAFFIC / LOCAL READ</span>
          <span>NO LIVE CONNECTION</span>
        </header>

        <section className="route-intro">
          <div>
            <h1>Where attention<br /><em>lands.</em></h1>
            <p>A small route board for reading authored sample signals. Compare the window, then decide which page deserves the next pass.</p>
          </div>
          <div className="route-stamp" aria-hidden="true"><span>WINDOW</span><b>{range}</b><span>SAMPLE ONLY</span></div>
        </section>

        <section className="route-board" aria-label="Popular pages sample metrics">
          <div className="board-head"><span>ROUTE BOARD / {range}</span><span>4 ROUTES INDEXED</span></div>
          <div className="range-strip"><span className="field-label">READ WINDOW</span>{RANGES.map((item) => <button type="button" key={item} className={range === item ? "range-button active" : "range-button"} onClick={() => setRange(item)} aria-pressed={range === item}>{item}</button>)}</div>
          <div className="route-summary"><div><span className="field-label">TOTAL SAMPLE</span><strong>9,790</strong><small>page visits / authored</small></div><div><span className="field-label">TOP ROUTE</span><strong>/</strong><small>42.9% of this window</small></div><div><span className="field-label">READING NOTE</span><strong>4</strong><small>routes, no backend</small></div></div>
          <div className="route-list">
            {ROUTES.map((route, index) => (
              <div className="route-row" key={route.path}>
                <span className="route-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="route-name"><strong>{route.path}</strong><small>{route.label}</small></div>
                <div className="route-bar" aria-label={`${route.share} percent relative share`}><span style={{ width: `${route.share}%` }} /></div>
                <span className="route-visits">{route.visits}</span><span className={`route-status ${route.status.toLowerCase()}`}>{route.status}</span><span className="route-movement">{route.movement}</span>
              </div>
            ))}
          </div>
          <div className="board-foot"><span>READ THE SHAPE, NOT A CLAIM</span><span>VALUES ARE STATIC SAMPLE DATA</span></div>
        </section>

        <footer className="route-footer"><span>BOOK / DEV TOOLS</span><span>WINDOW · ROUTE · SIGNAL</span></footer>
      </div>
    </main>
  );
}
