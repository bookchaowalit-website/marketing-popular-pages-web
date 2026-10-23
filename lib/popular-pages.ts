// Authored sample route traffic and the arithmetic the board shows. No analytics source is connected.

export const RANGES = ["24H", "7D", "30D"] as const;
export type Range = (typeof RANGES)[number];
export type RouteStatus = "STEADY" | "RISING" | "QUIET";
export type RouteSample = { path: string; label: string; visits: number; movement: number; status: RouteStatus };

const LABELS: Record<string, string> = {
  "/": "Home / first signal",
  "/projects": "Projects / proof shelf",
  "/domains": "Domains / wayfinding",
  "/about": "About / handoff",
};

function rows(values: [string, number, number, RouteStatus][]): RouteSample[] {
  return values.map(([path, visits, movement, status]) => ({ path, label: LABELS[path], visits, movement, status }));
}

// One authored sample per read window, so switching the window changes what the board reads.
export const SAMPLES: Record<Range, RouteSample[]> = {
  "24H": rows([
    ["/", 610, 9, "STEADY"],
    ["/projects", 380, 14, "RISING"],
    ["/about", 150, 3, "STEADY"],
    ["/domains", 120, -7, "QUIET"],
  ]),
  "7D": rows([
    ["/", 4200, 18, "STEADY"],
    ["/projects", 2800, 11, "RISING"],
    ["/domains", 1950, -4, "QUIET"],
    ["/about", 840, 6, "STEADY"],
  ]),
  "30D": rows([
    ["/", 16100, 12, "STEADY"],
    ["/projects", 12400, 21, "RISING"],
    ["/domains", 7300, -2, "QUIET"],
    ["/about", 3900, 5, "STEADY"],
  ]),
};

export function isRange(value: unknown): value is Range {
  return typeof value === "string" && (RANGES as readonly string[]).includes(value);
}

/** Routes for a window, busiest first. */
export function rankRoutes(range: Range): RouteSample[] {
  return [...SAMPLES[range]].sort((a, b) => b.visits - a.visits);
}

export function totalVisits(routes: RouteSample[]): number {
  return routes.reduce((sum, route) => sum + route.visits, 0);
}

/** Percent of all visits in the window, one decimal. 0 when there is no traffic. */
export function shareOfTotal(visits: number, total: number): number {
  return total > 0 ? Math.round((visits / total) * 1000) / 10 : 0;
}

/** Bar width: visits relative to the busiest route (busiest = 100). */
export function relativeShare(visits: number, routes: RouteSample[]): number {
  const max = Math.max(0, ...routes.map((route) => route.visits));
  return max > 0 ? Math.round((visits / max) * 100) : 0;
}

export function formatVisits(visits: number): string {
  return visits.toLocaleString("en-US");
}

/** "+18%" / "−04%" (true minus sign, two digits) as the board prints movement. */
export function formatMovement(percent: number): string {
  const sign = percent < 0 ? "−" : "+";
  return `${sign}${String(Math.abs(Math.round(percent))).padStart(2, "0")}%`;
}

export function boardSummary(range: Range) {
  const routes = rankRoutes(range);
  const total = totalVisits(routes);
  const top = routes[0];
  return { routes, total, top, topShare: top ? shareOfTotal(top.visits, total) : 0 };
}
