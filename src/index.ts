interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * NOAA SWPC MCP — space weather.
 *
 * Auth: none. Static JSON / text products published by SWPC.
 */


const BASE = 'https://services.swpc.noaa.gov';
const UA = 'pipeworx-mcp-noaa-swpc/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'alerts',
    description: 'Current SWPC alerts/warnings.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'solar_wind',
    description: 'Recent solar wind (DSCOVR plasma + magnetometer).',
    inputSchema: {
      type: 'object',
      properties: {
        window: { type: 'string', description: '5-minute (default) | 1-day | 2-hour | 1-hour' },
      },
    },
  },
  {
    name: 'kp_index',
    description: 'Planetary K index.',
    inputSchema: {
      type: 'object',
      properties: { window: { type: 'string', description: '1-day (default) | 7-day | 30-day | now' } },
    },
  },
  {
    name: 'aurora_forecast',
    description: '30-min ovation aurora forecast.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'goes_xray',
    description: 'GOES X-ray flux history.',
    inputSchema: {
      type: 'object',
      properties: { window: { type: 'string', description: '6-hour (default) | 1-day | 3-day | 7-day' } },
    },
  },
  {
    name: 'boulder_kp',
    description: 'Boulder K-index real-time.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'forecast_text',
    description: '3-day SWPC forecast discussion (raw text).',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'alerts':
      return swpcJson('/products/alerts.json');
    case 'solar_wind': {
      const w = String(args.window ?? '5-minute');
      const map: Record<string, string> = {
        '5-minute': 'plasma-5-minute',
        '2-hour': 'plasma-2-hour',
        '1-hour': 'plasma-1-hour',
        '1-day': 'plasma-1-day',
      };
      const file = map[w];
      if (!file) throw new Error(`window must be one of: ${Object.keys(map).join(', ')}`);
      const [plasma, mag] = await Promise.all([
        swpcJson(`/products/solar-wind/${file}.json`),
        swpcJson(`/products/solar-wind/${file.replace('plasma', 'mag')}.json`),
      ]);
      return { window: w, plasma, mag };
    }
    case 'kp_index': {
      const w = String(args.window ?? '1-day');
      if (w === 'now') return swpcJson('/products/noaa-planetary-k-index.json');
      const map: Record<string, string> = {
        '1-day': 'noaa-planetary-k-index.json',
        '7-day': 'noaa-planetary-k-index-forecast.json',
        '30-day': 'noaa-estimated-planetary-k-index-1-minute.json',
      };
      const file = map[w];
      if (!file) throw new Error(`window must be one of: 1-day | 7-day | 30-day | now`);
      return swpcJson(`/products/${file}`);
    }
    case 'aurora_forecast':
      return swpcJson('/json/ovation_aurora_latest.json');
    case 'goes_xray': {
      const w = String(args.window ?? '6-hour');
      const map: Record<string, string> = {
        '6-hour': 'xrays-6-hour.json',
        '1-day': 'xrays-1-day.json',
        '3-day': 'xrays-3-day.json',
        '7-day': 'xrays-7-day.json',
      };
      const file = map[w];
      if (!file) throw new Error(`window must be one of: ${Object.keys(map).join(', ')}`);
      return swpcJson(`/json/goes/primary/${file}`);
    }
    case 'boulder_kp':
      return swpcJson('/products/boulder-magnetometer.json');
    case 'forecast_text': {
      const res = await fetch(`${BASE}/text/3-day-forecast.txt`, {
        headers: { Accept: 'text/plain', 'User-Agent': UA },
      });
      if (!res.ok) throw new Error(`SWPC forecast: ${res.status}`);
      return { format: 'text', body: await res.text() };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function swpcJson(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (!res.ok) throw new Error(`SWPC: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
