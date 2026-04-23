import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Stack0 } from "@stack0/sdk";
import { z } from "zod";
import { json, error } from "../util.js";

export function registerCrawlTools(server: McpServer, stack0: Stack0) {
  server.tool(
    "crawl_start",
    "Recursively crawl a website and scrape every page. Returns a crawl ID for polling.",
    {
      url: z.string().describe("Seed URL to crawl"),
      maxDepth: z.number().min(1).max(10).default(3).describe("Maximum link depth"),
      maxPages: z.number().min(1).max(10000).default(100).describe("Maximum pages to scrape"),
      includePaths: z.array(z.string()).optional().describe("Only crawl URLs whose path contains one of these"),
      excludePaths: z.array(z.string()).optional().describe("Skip URLs whose path contains one of these"),
      allowSubdomains: z.boolean().default(false).describe("Follow links to subdomains"),
      respectRobotsTxt: z.boolean().default(true).describe("Honor robots.txt"),
      formats: z
        .array(z.enum(["markdown", "html", "links", "screenshot"]))
        .default(["markdown"])
        .describe("Output formats per page"),
      stealth: z.boolean().default(true).describe("Use the stealth plugin"),
      projectId: z.string().optional(),
      environment: z.enum(["sandbox", "production"]).default("production"),
    },
    async (params) => {
      try {
        const result = await stack0.crawl.start(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "crawl_get",
    "Get a crawl's status and (optionally) its scraped pages.",
    {
      id: z.string(),
      includePages: z.boolean().default(true),
      projectId: z.string().optional(),
      environment: z.enum(["sandbox", "production"]).default("production"),
    },
    async (params) => {
      try {
        const result = await stack0.crawl.get(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "crawl_list",
    "List recent crawls.",
    {
      projectId: z.string().optional(),
      environment: z.enum(["sandbox", "production"]).optional(),
      status: z.enum(["pending", "processing", "completed", "failed", "cancelled"]).optional(),
      limit: z.number().default(20),
    },
    async (params) => {
      try {
        const result = await stack0.crawl.list(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "crawl_cancel",
    "Cancel a running crawl.",
    {
      id: z.string(),
      projectId: z.string().optional(),
      environment: z.enum(["sandbox", "production"]).default("production"),
    },
    async (params) => {
      try {
        const result = await stack0.crawl.cancel(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );
}
