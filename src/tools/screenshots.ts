import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Stack0 } from "@stack0/sdk";
import { z } from "zod";
import { json, error } from "../util.js";

export function registerScreenshotTools(server: McpServer, stack0: Stack0) {
  server.tool(
    "screenshots_capture",
    "Capture a screenshot of a webpage. Returns the screenshot ID for tracking.",
    {
      url: z.string().describe("URL to capture screenshot of"),
      projectId: z.string().optional().describe("Project ID for scoping"),
      environment: z.enum(["sandbox", "production"]).default("production").describe("Environment"),
      format: z.enum(["png", "jpeg", "webp", "pdf"]).default("png").describe("Image format"),
      quality: z.number().min(1).max(100).default(80).describe("Image quality (1-100)"),
      fullPage: z.boolean().default(false).describe("Capture full page"),
      deviceType: z.enum(["desktop", "tablet", "mobile"]).default("desktop").describe("Device type"),
      viewportWidth: z.number().default(1280).describe("Viewport width"),
      viewportHeight: z.number().default(720).describe("Viewport height"),
      deviceScaleFactor: z.number().default(1).describe("Device scale factor (1-3)"),
      waitForSelector: z.string().optional().describe("CSS selector to wait for before capture"),
      waitForTimeout: z.number().default(0).describe("Wait time in ms before capture"),
      blockAds: z.boolean().default(true).describe("Block ads"),
      blockCookieBanners: z.boolean().default(false).describe("Block cookie banners"),
      blockChatWidgets: z.boolean().default(false).describe("Block chat widgets"),
      blockTrackers: z.boolean().default(false).describe("Block trackers"),
      darkMode: z.boolean().default(false).describe("Enable dark mode"),
      selector: z.string().optional().describe("Capture only this CSS selector element"),
      omitBackground: z.boolean().default(false).describe("Transparent background"),
    },
    async (params) => {
      try {
        const result = await stack0.screenshots.capture(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "screenshots_get",
    "Get a screenshot by ID, including its status and result URL.",
    {
      id: z.string().describe("Screenshot ID"),
      projectId: z.string().optional().describe("Project ID for scoping"),
      environment: z.enum(["sandbox", "production"]).default("production").describe("Environment"),
    },
    async (params) => {
      try {
        const result = await stack0.screenshots.get(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "screenshots_list",
    "List screenshots with optional filters. Returns paginated results.",
    {
      projectId: z.string().optional().describe("Filter by project ID"),
      environment: z.enum(["sandbox", "production"]).optional().describe("Filter by environment"),
      status: z.enum(["pending", "processing", "completed", "failed"]).optional().describe("Filter by status"),
      limit: z.number().default(20).describe("Max results (1-100)"),
    },
    async (params) => {
      try {
        const result = await stack0.screenshots.list(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "screenshots_delete",
    "Delete a screenshot by ID.",
    {
      id: z.string().describe("Screenshot ID"),
      projectId: z.string().optional().describe("Project ID for scoping"),
      environment: z.enum(["sandbox", "production"]).default("production").describe("Environment"),
    },
    async (params) => {
      try {
        const result = await stack0.screenshots.delete(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );
}
