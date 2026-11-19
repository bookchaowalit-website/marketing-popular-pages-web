// @vitest-environment happy-dom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Home from "@/app/page";
import { PopularBoard } from "@/components/popular-board";
import { SAMPLES } from "@/lib/popular-pages";

// Mounted tests for the Popular Pages board on the Dashboard shell: period switch, stats, rows, selection, empty window.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root;
let host: HTMLDivElement;
const $ = (selector: string) => host.querySelector(selector) as HTMLElement | null;
const button = (text: string) => [...host.querySelectorAll("button")].find((b) => b.textContent?.trim().startsWith(text)) as HTMLButtonElement;
const press = (el: Element) => act(() => { el.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
const stats = () => [...host.querySelectorAll(".ds-stat")].map((tile) => tile.textContent);
const mount = (node: React.ReactNode) => act(() => root.render(node));

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("popular pages", () => {
  it("server-renders the 7-day sample board with the sample-data notice and the hub link", () => {
    const html = renderToString(<Home />);
    expect(html).toContain("Most visited pages");
    expect(html).toContain("Sample data");
    expect(html).toContain("9,790");
    expect(html).toContain("No analytics service, tracking script or backend is connected");
    expect(html).toContain('href="https://bookchaowalit.com/"');
  });

  it("opens on 7 days with totals, the top page selected and falls marked as falls", () => {
    mount(<Home />);
    expect(button("7 days").getAttribute("aria-pressed")).toBe("true");
    expect(stats()).toEqual(["Page visits9,790across 4 pages", "Top page/42.9% of visits", "Pages up3visits up on the period before"]);
    const rows = [...host.querySelectorAll("button.ds-row")];
    expect(rows.map((row) => row.querySelector(".ds-row-name")?.textContent)).toEqual(["/", "/projects", "/domains", "/about"]);
    expect(rows[0].getAttribute("aria-pressed")).toBe("true");
    const fall = rows[2].querySelector(".pp-move") as HTMLElement;
    expect(fall.dataset.down).toBe("true");
    expect(fall.textContent).toBe("▼ −04%down 4%");
    expect(rows[1].querySelector(".pp-move")?.textContent).toBe("▲ +11%up 11%");
    expect($(".ds-callout")?.textContent).toContain("Home / first signal");
  });

  it("switches the period, recomputes every figure and keeps a selected page", () => {
    mount(<Home />);
    press(button("/projects"));
    expect(button("/projects").getAttribute("aria-pressed")).toBe("true");
    expect($(".pp-facts")?.textContent).toBe("Visits2,800Share of visits28.6%Change▲ +11%up 11%TrendRising");
    press(button("30 days"));
    expect($(".ds-head p")?.textContent).toContain("Last 30 days · page visits");
    expect(stats()[0]).toBe("Page visits39,700across 4 pages");
    expect($(".pp-facts")?.textContent).toContain("12,400");
    press(button("/domains"));
    expect($(".pp-facts")?.textContent).toContain("TrendQuiet");
    press(button("24 hours"));
    expect(stats()[1]).toBe("Top page/48.4% of visits");
  });

  it("counts pages up from the shown movement and says each bar's value to screen readers", () => {
    mount(<Home />);
    // 7 days: /, /projects and /about are up (+18%, +11%, +6%), /domains is down, so 3 (the Rising tag is on one page only).
    expect(stats()[2]).toBe("Pages up3visits up on the period before");
    const rows = [...host.querySelectorAll("button.ds-row")];
    // The bar is aria-hidden; its value against the busiest page is in the row's text.
    expect(rows[0].querySelector(".ds-meter")?.getAttribute("aria-hidden")).toBe("true");
    expect(rows.map((row) => row.querySelector(".pp-bar-value")?.textContent)).toEqual([
      " · bar 100% of the busiest page", " · bar 67% of the busiest page", " · bar 46% of the busiest page", " · bar 20% of the busiest page",
    ]);
    press(button("30 days"));
    const up = [...host.querySelectorAll("button.ds-row .pp-move")].filter((move) => (move as HTMLElement).dataset.down === "false").length;
    expect(stats()[2]).toBe(`Pages up${up}visits up on the period before`);
  });

  it("says so when a period has no visits", () => {
    mount(<PopularBoard samples={{ ...SAMPLES, "7D": [] }} />);
    expect(stats()).toEqual(["Page visits0across 0 pages", "Top page—no visits yet", "Pages up0visits up on the period before"]);
    expect(host.textContent).toContain("No page visits in the last 7 days");
    expect(host.textContent).toContain("No page to show");
    expect(host.querySelectorAll("button.ds-row")).toHaveLength(0);
  });
});
