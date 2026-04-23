import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Stack0 } from "@stack0/sdk";
import { z } from "zod";
import { json, error } from "../util.js";

export function registerMapTools(server: McpServer, stack0: Stack0) {
  server.tool(
    "map_create",
    "Quickly discover every URL on a website via sitemap and link extraction.",
    {
      url: z.string(),
      search: z.string().optional().describe("Substring filter for discovered URLs"),
      limit: z.number().min(1).max(10000).default(5000),
      includeSubdomains: z.boolean().default(false),
      ignoreSitemap: z.boolean().default(false),
      sitemapOnly: z.boolean().default(false),
      projectId: z.string().optional(),
      environment: z.enum(["sandbox", "production"]).default("production"),
    },
    async (params) => {
      try {
        const result = await stack0.map.create(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "map_get",
    "Get a map job's discovered URLs.",
    {
      id: z.string(),
      projectId: z.string().optional(),
      environment: z.enum(["sandbox", "production"]).default("production"),
    },
    async (params) => {
      try {
        const result = await stack0.map.get(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "map_list",
    "List recent map jobs.",
    {
      projectId: z.string().optional(),
      environment: z.enum(["sandbox", "production"]).optional(),
      status: z.enum(["pending", "processing", "completed", "failed"]).optional(),
      limit: z.number().default(20),
    },
    async (params) => {
      try {
        const result = await stack0.map.list(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );
}
