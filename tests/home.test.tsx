import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("home page", () => {
  it("renders the 7D sample board with derived totals and the sample-data notice", () => {
    const html = renderToString(<Home />);
    expect(html).toContain("Where attention");
    expect(html).toContain("ROUTE BOARD / <!-- -->7D");
    expect(html).toContain("9,790");
    expect(html).toContain("42.9<!-- -->% of this window");
    expect(html).toContain("/projects");
    expect(html).toContain("−04%");
    expect(html).toContain("NO LIVE CONNECTION");
    expect(html).toContain("VALUES ARE STATIC SAMPLE DATA");
  });
});
