# @pipeworx/noaa-swpc

NOAA [Space Weather Prediction Center](https://www.swpc.noaa.gov) MCP — geomagnetic indices, solar wind, aurora forecasts, alerts. Keyless JSON products.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1679+ live data sources.

## Tools

- `alerts()` — current SWPC alerts/warnings
- `solar_wind(window?)` — recent solar wind (DSCOVR plasma + mag): "5-minute" (default) | "1-day" | "2-hour" | "1-hour"
- `kp_index(window?)` — planetary K index history: "1-day" (default) | "7-day" | "30-day" | "now"
- `aurora_forecast()` — 30-min ovation aurora forecast (north or south)
- `goes_xray(window?)` — recent GOES X-ray flux: "6-hour" (default) | "1-day" | "3-day" | "7-day"
- `boulder_kp()` — Boulder K index (real-time)
- `forecast_text()` — 3-day SWPC forecast (raw text)

## Data source

`https://services.swpc.noaa.gov/products/...`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "noaa-swpc": {
      "url": "https://gateway.pipeworx.io/noaa-swpc/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/noaa-swpc/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1679+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/alerts \
  -H 'Content-Type: application/json' \
  -d '{}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/alerts`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Standalone (no gateway account)

This package also runs as a local stdio MCP server — no Pipeworx account, no
gateway round-trip:

```json
{
  "mcpServers": {
    "noaa-swpc": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-noaa-swpc"]
    }
  }
}
```

Or run it directly to confirm it starts:

```bash
npx -y @pipeworx/mcp-noaa-swpc
```

It speaks MCP over stdin/stdout and answers `initialize`/`tools/list`/`tools/call`
for **only** this pack's tools — none of the shared meta-tools the gateway
connection above adds. Same source, same tools, no ask_pipeworx routing.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Noaa Swpc data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
