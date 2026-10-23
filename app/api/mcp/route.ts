import { NextResponse } from "next/server";
import { RANGES, boardSummary, isRange } from "@/lib/popular-pages";

// Stateless JSON-RPC MCP endpoint over the same authored sample traffic the board shows. No analytics source.

type RpcRequest = { id?: number | string | null; method?: string; params?: { name?: string; arguments?: Record<string, unknown> } };

const rangeSchema = { type: "string", enum: [...RANGES] };
const TOOLS = [
  {
    name: "get_board",
    description: "Sample route board for one window (24H, 7D or 30D): routes busiest first, total and top-route share",
    inputSchema: { type: "object", properties: { range: rangeSchema } },
  },
  {
    name: "get_route",
    description: "Sample visits, movement and status of one route path in one window",
    inputSchema: { type: "object", properties: { path: { type: "string" }, range: rangeSchema }, required: ["path"] },
  },
];

class RpcError extends Error {
  constructor(readonly code: number, message: string) {
    super(message);
  }
}

function readRange(value: unknown) {
  if (value === undefined) return "7D" as const;
  if (!isRange(value)) throw new RpcError(-32602, `Unknown range: ${String(value)}`);
  return value;
}

function callTool(name: string | undefined, args: Record<string, unknown> = {}) {
  switch (name) {
    case "get_board": {
      const range = readRange(args.range);
      const { routes, total, top, topShare } = boardSummary(range);
      return { range, sample: true, routes, total, topRoute: top?.path ?? null, topShare };
    }
    case "get_route": {
      const range = readRange(args.range);
      const route = boardSummary(range).routes.find((entry) => entry.path === args.path);
      if (!route) throw new RpcError(-32602, `No sample route ${String(args.path)}`);
      return { range, sample: true, route };
    }
    default:
      throw new RpcError(-32602, `Unknown tool: ${String(name)}`);
  }
}

export async function POST(request: Request) {
  let id: RpcRequest["id"] = null;
  try {
    const body = (await request.json()) as RpcRequest;
    id = body.id ?? null;
    let result: unknown;
    switch (body.method) {
      case "initialize":
        result = { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "Route Board", version: "1.0.0" } };
        break;
      case "tools/list":
        result = { tools: TOOLS };
        break;
      case "tools/call":
        result = callTool(body.params?.name, body.params?.arguments);
        break;
      default:
        throw new RpcError(-32601, `Unknown method: ${String(body.method)}`);
    }
    return NextResponse.json({ jsonrpc: "2.0", id, result });
  } catch (error) {
    const code = error instanceof RpcError ? error.code : -32700;
    const message = error instanceof RpcError ? error.message : "Parse error";
    return NextResponse.json({ jsonrpc: "2.0", id, error: { code, message } }, { status: 400 });
  }
}
