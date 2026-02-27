import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Stack0 } from "@stack0/sdk";
import { z } from "zod";
import { json, error } from "../util.js";

export function registerIntegrationTools(server: McpServer, stack0: Stack0) {
  server.tool(
    "integrations_list_connectors",
    "List available connectors (HubSpot, Salesforce, Google Drive, Dropbox, Slack, etc.).",
    {
      category: z
        .enum(["crm", "storage", "communication", "productivity"])
        .optional()
        .describe("Filter by category"),
    },
    async (params) => {
      try {
        const result = await stack0.integrations.listConnectors(params.category as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "integrations_list_connections",
    "List all OAuth connections for third-party integrations.",
    {
      connectorSlug: z.string().optional().describe("Filter by connector slug"),
      status: z.enum(["pending", "connected", "error", "expired"]).optional().describe("Filter by status"),
      limit: z.number().default(50).describe("Max results (1-100)"),
    },
    async (params) => {
      try {
        const result = await stack0.integrations.listConnections(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  // CRM tools
  server.tool(
    "integrations_crm_list_contacts",
    "List contacts from a connected CRM (HubSpot, Salesforce, Pipedrive, etc.).",
    {
      connectionId: z.string().describe("Connection ID"),
      limit: z.number().default(50).describe("Max results (1-100)"),
      cursor: z.string().optional().describe("Pagination cursor"),
      sortBy: z.string().optional().describe("Sort by field"),
      sortOrder: z.enum(["asc", "desc"]).default("desc").describe("Sort order"),
    },
    async (params) => {
      try {
        const { connectionId, ...options } = params as any;
        const result = await stack0.integrations.crm.listContacts(connectionId, options);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "integrations_crm_create_contact",
    "Create a contact in a connected CRM.",
    {
      connectionId: z.string().describe("Connection ID"),
      firstName: z.string().optional().describe("First name"),
      lastName: z.string().optional().describe("Last name"),
      email: z.string().optional().describe("Email address"),
      phone: z.string().optional().describe("Phone number"),
      companyId: z.string().optional().describe("Company ID"),
      title: z.string().optional().describe("Job title"),
    },
    async (params) => {
      try {
        const { connectionId, ...data } = params as any;
        const result = await stack0.integrations.crm.createContact(connectionId, data);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "integrations_crm_update_contact",
    "Update a contact in a connected CRM.",
    {
      connectionId: z.string().describe("Connection ID"),
      id: z.string().describe("Contact ID to update"),
      firstName: z.string().optional().describe("First name"),
      lastName: z.string().optional().describe("Last name"),
      email: z.string().optional().describe("Email address"),
      phone: z.string().optional().describe("Phone number"),
      title: z.string().optional().describe("Job title"),
    },
    async (params) => {
      try {
        const { connectionId, id, ...data } = params as any;
        const result = await stack0.integrations.crm.updateContact(connectionId, id, data);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  // Storage tools
  server.tool(
    "integrations_storage_list_files",
    "List files from a connected storage provider (Google Drive, Dropbox, OneDrive).",
    {
      connectionId: z.string().describe("Connection ID"),
      folderId: z.string().optional().describe("Folder ID to list files from"),
      limit: z.number().default(50).describe("Max results (1-100)"),
      cursor: z.string().optional().describe("Pagination cursor"),
    },
    async (params) => {
      try {
        const { connectionId, folderId, ...options } = params as any;
        const result = await stack0.integrations.storage.listFiles(connectionId, folderId, options);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "integrations_storage_download",
    "Download a file from a connected storage provider. Returns file metadata.",
    {
      connectionId: z.string().describe("Connection ID"),
      fileId: z.string().describe("File ID to download"),
    },
    async (params) => {
      try {
        const result = await stack0.integrations.storage.downloadFile(
          params.connectionId as string,
          params.fileId as string,
        );
        return json({ filename: result.filename, mimeType: result.mimeType, size: result.data.byteLength });
      } catch (e) {
        return error(e);
      }
    },
  );
}
