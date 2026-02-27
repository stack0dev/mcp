import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Stack0 } from "@stack0/sdk";
import { z } from "zod";
import { json, error } from "../util.js";

export function registerExtractionTools(server: McpServer, stack0: Stack0) {
  server.tool(
    "extraction_extract",
    "Extract structured data or content from a webpage. Returns the extraction ID for tracking.",
    {
      url: z.string().describe("URL to extract data from"),
      projectId: z.string().optional().describe("Project ID for scoping"),
      environment: z.enum(["sandbox", "production"]).default("production").describe("Environment"),
      mode: z.enum(["auto", "schema", "markdown", "raw"]).default("auto").describe("Extraction mode"),
      schema: z.record(z.string(), z.unknown()).optional().describe("JSON schema for structured extraction"),
      prompt: z.string().optional().describe("Natural language extraction prompt"),
      includeLinks: z.boolean().default(true).describe("Include links in extraction"),
      includeImages: z.boolean().default(true).describe("Include images in extraction"),
      includeMetadata: z.boolean().default(true).describe("Include page metadata"),
      waitForSelector: z.string().optional().describe("CSS selector to wait for"),
      waitForTimeout: z.number().default(0).describe("Wait time in ms"),
    },
    async (params) => {
      try {
        const result = await stack0.extraction.extract(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "extraction_get",
    "Get an extraction by ID, including its status and extracted data.",
    {
      id: z.string().describe("Extraction ID"),
      projectId: z.string().optional().describe("Project ID for scoping"),
      environment: z.enum(["sandbox", "production"]).default("production").describe("Environment"),
    },
    async (params) => {
      try {
        const result = await stack0.extraction.get(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "extraction_list",
    "List extractions with optional filters. Returns paginated results.",
    {
      projectId: z.string().optional().describe("Filter by project ID"),
      environment: z.enum(["sandbox", "production"]).optional().describe("Filter by environment"),
      status: z.enum(["pending", "processing", "completed", "failed"]).optional().describe("Filter by status"),
      limit: z.number().default(20).describe("Max results (1-100)"),
    },
    async (params) => {
      try {
        const result = await stack0.extraction.list(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "extraction_delete",
    "Delete an extraction by ID.",
    {
      id: z.string().describe("Extraction ID"),
      projectId: z.string().optional().describe("Project ID for scoping"),
      environment: z.enum(["sandbox", "production"]).default("production").describe("Environment"),
    },
    async (params) => {
      try {
        const result = await stack0.extraction.delete(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );
}
