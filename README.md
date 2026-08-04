# @pipeworx/noaa-swpc

NOAA [Space Weather Prediction Center](https://www.swpc.noaa.gov) MCP — geomagnetic indices, solar wind, aurora forecasts, alerts. Keyless JSON products.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Noaa Swpc data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
