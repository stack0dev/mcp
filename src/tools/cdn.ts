import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Stack0 } from "@stack0/sdk";
import { z } from "zod";
import { json, error } from "../util.js";

export function registerCdnTools(server: McpServer, stack0: Stack0) {
  server.tool(
    "cdn_upload",
    "Generate a presigned URL for uploading a file to the CDN. Returns the upload URL and asset ID.",
    {
      filename: z.string().describe("Name of the file"),
      mimeType: z.string().describe("MIME type of the file"),
      size: z.number().describe("File size in bytes"),
      projectSlug: z.string().optional().describe("Project slug"),
      environment: z.enum(["sandbox", "production"]).default("production").describe("Environment"),
      folder: z.string().optional().describe("Folder path to upload to"),
    },
    async (params) => {
      try {
        const result = await stack0.cdn.getUploadUrl(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "cdn_get",
    "Get an asset by ID, including its CDN URLs and metadata.",
    {
      id: z.string().describe("Asset ID"),
    },
    async (params) => {
      try {
        const result = await stack0.cdn.get(params.id as string);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "cdn_list",
    "List assets with optional filters and pagination.",
    {
      projectSlug: z.string().optional().describe("Project slug"),
      environment: z.enum(["sandbox", "production"]).optional().describe("Filter by environment"),
      folder: z.string().optional().describe("Filter by folder"),
      type: z.enum(["image", "video", "audio", "document", "other"]).optional().describe("Filter by type"),
      status: z.enum(["pending", "processing", "ready", "failed", "deleting"]).optional().describe("Filter by status"),
      search: z.string().optional().describe("Search by filename"),
      limit: z.number().default(50).describe("Max results (1-100)"),
      offset: z.number().default(0).describe("Pagination offset"),
      sortBy: z.enum(["createdAt", "filename", "size"]).default("createdAt").describe("Sort field"),
      sortOrder: z.enum(["asc", "desc"]).default("desc").describe("Sort order"),
    },
    async (params) => {
      try {
        const result = await stack0.cdn.list(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "cdn_delete",
    "Delete an asset by ID.",
    {
      id: z.string().describe("Asset ID"),
    },
    async (params) => {
      try {
        const result = await stack0.cdn.delete(params.id as string);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "cdn_create_folder",
    "Create a new folder in the CDN.",
    {
      projectSlug: z.string().optional().describe("Project slug"),
      name: z.string().describe("Folder name"),
      parentId: z.string().optional().describe("Parent folder ID"),
    },
    async (params) => {
      try {
        const result = await stack0.cdn.createFolder(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "cdn_list_folders",
    "List folders in the CDN.",
    {
      projectSlug: z.string().optional().describe("Project slug"),
      parentId: z.string().optional().describe("Parent folder ID (omit for root)"),
      limit: z.number().default(50).describe("Max results (1-100)"),
      offset: z.number().default(0).describe("Pagination offset"),
    },
    async (params) => {
      try {
        const result = await stack0.cdn.listFolders(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "cdn_delete_folder",
    "Delete a folder by ID.",
    {
      id: z.string().describe("Folder ID"),
      deleteContents: z.boolean().default(false).describe("Delete folder contents (vs move to parent)"),
    },
    async (params) => {
      try {
        const result = await stack0.cdn.deleteFolder(params.id as string, params.deleteContents as boolean);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );
}
