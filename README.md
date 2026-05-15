# mcp-noaa-swpc

NOAA Space Weather Prediction Center (solar wind, Kp, aurora, alerts)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `alerts` | Current SWPC alerts/warnings. |
| `solar_wind` | Recent solar wind (DSCOVR plasma + magnetometer). |
| `kp_index` | Planetary K index. |
| `aurora_forecast` | 30-min ovation aurora forecast. |
| `goes_xray` | GOES X-ray flux history. |
| `boulder_kp` | Boulder K-index real-time. |
| `forecast_text` | 3-day SWPC forecast discussion (raw text). |

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

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
