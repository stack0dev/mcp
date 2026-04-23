import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Stack0 } from "@stack0/sdk";
import { z } from "zod";
import { json, error } from "../util.js";

export function registerDocumentTools(server: McpServer, stack0: Stack0) {
  server.tool(
    "document_parse",
    "Parse a PDF or DOCX file into clean markdown. Pass either a public URL or a pre-uploaded fileUrl.",
    {
      url: z.string().optional(),
      fileUrl: z.string().optional(),
      contentType: z.enum(["pdf", "docx", "auto"]).default("auto"),
      projectId: z.string().optional(),
      environment: z.enum(["sandbox", "production"]).default("production"),
    },
    async (params) => {
      try {
        const result = await stack0.documents.parse(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "document_get",
    "Get document parsing status and markdown.",
    {
      id: z.string(),
      projectId: z.string().optional(),
      environment: z.enum(["sandbox", "production"]).default("production"),
    },
    async (params) => {
      try {
        const result = await stack0.documents.get(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "document_list",
    "List recent parsed documents.",
    {
      projectId: z.string().optional(),
      environment: z.enum(["sandbox", "production"]).optional(),
      status: z.enum(["pending", "processing", "completed", "failed"]).optional(),
      limit: z.number().default(20),
    },
    async (params) => {
      try {
        const result = await stack0.documents.list(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );
}
