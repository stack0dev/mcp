import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Stack0 } from "@stack0/sdk";
import { registerScreenshotTools } from "./tools/screenshots.js";
import { registerExtractionTools } from "./tools/extraction.js";
import { registerCrawlTools } from "./tools/crawl.js";
import { registerMapTools } from "./tools/map.js";
import { registerDocumentTools } from "./tools/documents.js";
import { registerCdnTools } from "./tools/cdn.js";
import { registerMailTools } from "./tools/mail.js";
import { registerIntegrationTools } from "./tools/integrations.js";
// TODO: uncomment when @stack0/sdk publishes workflows + memory modules
// import { registerWorkflowTools } from "./tools/workflows.js";
import { registerVideoTools } from "./tools/video.js";
// import { registerMemoryTools } from "./tools/memory.js";

const apiKey = process.env.STACK0_API_KEY;
if (!apiKey) {
  console.error("STACK0_API_KEY environment variable is required");
  process.exit(1);
}

const stack0 = new Stack0({
  apiKey,
  baseUrl: process.env.STACK0_BASE_URL,
});

const server = new McpServer({
  name: "stack0",
  version: "0.1.0",
});

registerScreenshotTools(server, stack0);
registerExtractionTools(server, stack0);
registerCrawlTools(server, stack0);
registerMapTools(server, stack0);
registerDocumentTools(server, stack0);
registerCdnTools(server, stack0);
registerMailTools(server, stack0);
registerIntegrationTools(server, stack0);
// registerWorkflowTools(server, stack0);
registerVideoTools(server, stack0);
// registerMemoryTools(server, stack0);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
