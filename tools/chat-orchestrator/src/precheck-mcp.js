import { requireMcpCheck } from './lib/precheck.js';

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--mode' && args[i+1]) { out.mode = args[i+1]; i++; }
    else if ((a === '-m' || a === '--mcp-url') && args[i+1]) { out.mcpUrl = args[i+1]; i++; }
  }
  return out;
}

async function main() {
  const args = parseArgs();
  try {
    const res = await requireMcpCheck(args.mode, { mcpUrl: args.mcpUrl });
    if (!res.ok) {
      if (res.reason === 'no_mcp_url_configured') {
        console.error('MCP required but no MCP health URL configured.');
        console.error('Set environment variable MCP_SERVER_URL (or MCP_HEALTH_URL) to a health endpoint and retry.');
        console.error('Example: $env:MCP_SERVER_URL="http://localhost:PORT/health"');
        process.exit(2);
      }
      console.error('MCP health probe failed. Ensure Playwright MCP is running and reachable at the URL you configured.');
      console.error('Probe URL attempted:', res.probeUrl || '(none)');
      process.exit(2);
    }
    console.log('MCP health probe succeeded. MCP appears reachable.');
    process.exit(0);
  } catch (e) {
    console.error(e.message || e);
    process.exit(2);
  }
}

main().catch(err => { console.error(err); process.exit(2); });
