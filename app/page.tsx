"use client";

import { useState } from "react";
import { RANGES, boardSummary, formatMovement, formatVisits, relativeShare, type Range } from "@/lib/popular-pages";

export default function Home() {
  const [range, setRange] = useState<Range>("7D");
  const { routes, total, top, topShare } = boardSummary(range);
  return (
    <main className="route-shell">
      <div className="route-frame">
        <header className="route-topbar">
          <a href="https://bookchaowalit.com" className="route-mark" aria-label="Route board, Bookchaowalit home"><span>ROUTE</span> / BOARD</a>
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
          <div className="board-head"><span>ROUTE BOARD / {range}</span><span>{routes.length} ROUTES INDEXED</span></div>
          <div className="range-strip"><span className="field-label">READ WINDOW</span>{RANGES.map((item) => <button type="button" key={item} className={range === item ? "range-button active" : "range-button"} onClick={() => setRange(item)} aria-pressed={range === item}>{item}</button>)}</div>
          <div className="route-summary"><div><span className="field-label">TOTAL SAMPLE</span><strong>{formatVisits(total)}</strong><small>page visits / authored</small></div><div><span className="field-label">TOP ROUTE</span><strong>{top?.path ?? "—"}</strong><small>{topShare}% of this window</small></div><div><span className="field-label">READING NOTE</span><strong>{routes.length}</strong><small>routes, no backend</small></div></div>
          <div className="route-list">
            {routes.map((route, index) => {
              const share = relativeShare(route.visits, routes);
              return (
              <div className="route-row" key={route.path}>
                <span className="route-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="route-name"><strong>{route.path}</strong><small>{route.label}</small></div>
                <div className="route-bar" role="img" aria-label={`${share} percent of the busiest route`}><span style={{ width: `${share}%` }} /></div>
                <span className="route-visits">{formatVisits(route.visits)}</span><span className={`route-status ${route.status.toLowerCase()}`}>{route.status}</span><span className="route-movement">{formatMovement(route.movement)}</span>
              </div>
              );
            })}
          </div>
          <div className="board-foot"><span>READ THE SHAPE, NOT A CLAIM</span><span>VALUES ARE STATIC SAMPLE DATA</span></div>
        </section>

        <footer className="route-footer"><span>BOOK / DEV TOOLS</span><span>WINDOW · ROUTE · SIGNAL</span></footer>
      </div>
    </main>
  );
}
