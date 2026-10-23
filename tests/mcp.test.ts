import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/mcp/route";

function rpc(body: unknown) {
  return POST(new Request("http://localhost/api/mcp", { method: "POST", body: JSON.stringify(body) }));
}

describe("MCP route", () => {
  it("echoes the JSON-RPC request id and lists the real tools", async () => {
    const body = await (await rpc({ jsonrpc: "2.0", id: 7, method: "tools/list" })).json();
    expect(body.id).toBe(7);
    expect(body.result.tools.map((t: { name: string }) => t.name)).toEqual(["get_board", "get_route"]);
  });

  it("get_board returns the same sample the page shows, defaulting to 7D", async () => {
    const { result } = await (await rpc({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "get_board" } })).json();
    expect(result.range).toBe("7D");
    expect(result.sample).toBe(true);
    expect(result.total).toBe(9790);
    expect(result.topRoute).toBe("/");
    expect(result.topShare).toBe(42.9);
  });

  it("get_route reads one path in one window", async () => {
    const { result } = await (await rpc({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "get_route", arguments: { path: "/about", range: "30D" } } })).json();
    expect(result.route.visits).toBe(3900);
  });

  it("rejects an unknown range, path, tool or method", async () => {
    const range = await (await rpc({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "get_board", arguments: { range: "1Y" } } })).json();
    expect(range.error.code).toBe(-32602);
    expect(range.id).toBe(3);
    const path = await (await rpc({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "get_route", arguments: { path: "/blog" } } })).json();
    expect(path.error.code).toBe(-32602);
    expect((await (await rpc({ jsonrpc: "2.0", id: 5, method: "tools/call", params: { name: "get_data" } })).json()).error.code).toBe(-32602);
    expect((await (await rpc({ jsonrpc: "2.0", id: 6, method: "ping" })).json()).error.code).toBe(-32601);
  });

  it("answers initialize and rejects a malformed body", async () => {
    expect((await (await rpc({ jsonrpc: "2.0", id: 8, method: "initialize" })).json()).result.serverInfo.name).toBe("Route Board");
    const bad = await POST(new Request("http://localhost/api/mcp", { method: "POST", body: "nope" }));
    expect((await bad.json()).error.code).toBe(-32700);
  });
});
