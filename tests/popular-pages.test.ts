import { describe, expect, it } from "vitest";
import { RANGES, SAMPLES, boardSummary, formatMovement, formatVisits, isRange, rankRoutes, relativeShare, shareOfTotal, totalVisits } from "@/lib/popular-pages";

describe("read window", () => {
  it("changes the data the board reads", () => {
    // Regression: the 24H / 7D / 30D buttons only changed a label; every window showed the same fixed numbers.
    const totals = RANGES.map((range) => boardSummary(range).total);
    expect(new Set(totals).size).toBe(RANGES.length);
    expect(totals).toEqual([1260, 9790, 39700]);
  });

  it("only accepts the three windows", () => {
    expect(isRange("7D")).toBe(true);
    expect(isRange("1Y")).toBe(false);
    expect(isRange(7)).toBe(false);
  });
});

describe("board arithmetic", () => {
  it("ranks routes busiest first without mutating the sample", () => {
    expect(rankRoutes("24H").map((r) => r.path)).toEqual(["/", "/projects", "/about", "/domains"]);
    expect(SAMPLES["24H"][2].path).toBe("/about");
  });

  it("derives the summary the page used to hard-code", () => {
    const { total, top, topShare } = boardSummary("7D");
    expect(formatVisits(total)).toBe("9,790");
    expect(top.path).toBe("/");
    expect(topShare).toBe(42.9);
  });

  it("scales bars to the busiest route and handles no traffic", () => {
    const routes = rankRoutes("7D");
    expect(routes.map((r) => relativeShare(r.visits, routes))).toEqual([100, 67, 46, 20]);
    expect(relativeShare(5, [])).toBe(0);
    expect(shareOfTotal(5, 0)).toBe(0);
    expect(totalVisits([])).toBe(0);
  });

  it("formats movement with a true minus sign and two digits", () => {
    expect(formatMovement(18)).toBe("+18%");
    expect(formatMovement(-4)).toBe("−04%");
    expect(formatMovement(0)).toBe("+00%");
  });
});
