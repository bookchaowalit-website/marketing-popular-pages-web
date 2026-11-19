"use client";

import { useState } from "react";
import { DashFoot, DashTop, Pill, Segmented, Stat, type Tone } from "@/components/dashboard-shell";
import { RANGES, boardSummary, formatMovement, formatVisits, movementWords, relativeShare, shareOfTotal, type Range, type RouteSample, type RouteStatus } from "@/lib/popular-pages";

const RANGE_LABELS: Record<Range, string> = { "24H": "24 hours", "7D": "7 days", "30D": "30 days" };
const PERIODS = RANGES.map((id) => ({ id, label: RANGE_LABELS[id] }));
const STATUS: Record<RouteStatus, { word: string; tone: Tone }> = {
  RISING: { word: "Rising", tone: "green" },
  STEADY: { word: "Steady", tone: "grey" },
  QUIET: { word: "Quiet", tone: "amber" },
};
const SOURCE = "https://github.com/bookchaowalit-website/marketing-popular-pages-web";

/** Movement with a sign, an arrow and a colour, so a fall never reads like a rise. */
function Movement({ percent }: { percent: number }) {
  const down = percent < 0;
  return (
    <span className="pp-move" data-down={down} title={movementWords(percent)}>
      <span aria-hidden="true">{down ? "▼" : "▲"} {formatMovement(percent)}</span>
      <span className="ds-sr">{movementWords(percent)}</span>
    </span>
  );
}

/** The whole board for a sample set; takes the data so an empty window can be rendered and tested. */
export function PopularBoard({ samples }: { samples: Record<Range, RouteSample[]> }) {
  const [range, setRange] = useState<Range>("7D");
  const [picked, setPicked] = useState<string | null>(null);
  const { routes, total, top, topShare } = boardSummary(range, samples);
  const period = RANGE_LABELS[range];
  const selected = routes.find((route) => route.path === picked) ?? top;
  // Counts the pages whose visits went up against the period before (the movement shown on each row), not the Rising tag.
  const rising = routes.filter((route) => route.movement > 0).length;

  return (
    <div className="ds">
      <a className="ds-skip" href="#main">Skip to content</a>
      <DashTop name="Popular Pages" tagline="Which pages people read most" />

      <main id="main" tabIndex={-1} className="ds-main">
        <div className="ds-head">
          <div>
            <h1>Most visited pages</h1>
            <p>Last {period} · page visits <Pill tone="grey">Sample data</Pill></p>
          </div>
          <Segmented label="Period" options={PERIODS} value={range} onChange={setRange} />
        </div>

        <ul className="ds-stats" aria-label={`Last ${period} at a glance`}>
          <Stat label="Page visits" value={formatVisits(total)} note={`across ${routes.length} pages`} />
          <Stat label="Top page" value={top ? top.path : "—"} note={top ? `${topShare}% of visits` : "no visits yet"} />
          <Stat label="Pages up" value={rising} note="visits up on the period before" />
        </ul>

        <div className="ds-grid">
          <section className="ds-panel" aria-labelledby="pages-heading">
            <div className="ds-panel-head">
              <div>
                <h2 id="pages-heading">Pages</h2>
                <p>Busiest first · bar is visits against the busiest page</p>
              </div>
            </div>
            {routes.length === 0 ? (
              <p className="ds-callout" role="status">
                <strong>No page visits in the last {period}</strong>
                <span>Nothing was read in this period yet. Try a longer period.</span>
              </p>
            ) : (
              <ul className="ds-rows">
                {routes.map((route) => (
                  <li key={route.path}>
                    <button type="button" className="ds-row" aria-pressed={selected?.path === route.path} onClick={() => setPicked(route.path)}>
                      <span className="ds-row-name">{route.path}</span>
                      <span className="ds-row-detail">
                        {route.label} · {shareOfTotal(route.visits, total)}% · <Movement percent={route.movement} />
                        {/* The bar is aria-hidden, so its value (against the busiest page, not the total) is said here. */}
                        <span className="ds-sr pp-bar-value"> · bar {relativeShare(route.visits, routes)}% of the busiest page</span>
                      </span>
                      <span className="ds-row-value">{formatVisits(route.visits)}</span>
                      <span className="ds-meter" aria-hidden="true"><span style={{ width: `${relativeShare(route.visits, routes)}%` }} /></span>
                    </button>
                    {/* Phones stack Selected page under the list; this says the picked page's trend in place and jumps there. */}
                    {selected?.path === route.path ? (
                      <a className="pp-jump" href="#selected-page">{STATUS[route.status].word} · see details<span className="ds-sr"> for {route.path}</span></a>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section id="selected-page" tabIndex={-1} className="ds-panel" aria-labelledby="page-heading">
            <div className="ds-panel-head">
              <div>
                <h2 id="page-heading">Selected page</h2>
                <p>Select a page in the list to read it here</p>
              </div>
            </div>
            {selected ? (
              <div className="ds-callout" aria-live="polite">
                <strong>{selected.path}</strong>
                <span>{selected.label}</span>
                <dl className="pp-facts">
                  <div><dt>Visits</dt><dd>{formatVisits(selected.visits)}</dd></div>
                  <div><dt>Share of visits</dt><dd>{shareOfTotal(selected.visits, total)}%</dd></div>
                  <div><dt>Change</dt><dd><Movement percent={selected.movement} /></dd></div>
                  <div><dt>Trend</dt><dd><Pill tone={STATUS[selected.status].tone}>{STATUS[selected.status].word}</Pill></dd></div>
                </dl>
              </div>
            ) : (
              <p className="ds-callout" role="status">
                <strong>No page to show</strong>
                <span>There are no visits in the last {period}.</span>
              </p>
            )}
          </section>
        </div>

        <p className="ds-note">Fixed sample numbers for four pages, written by hand. No analytics service, tracking script or backend is connected; read the shape, not a claim.</p>
      </main>

      <DashFoot source={SOURCE} />
    </div>
  );
}
