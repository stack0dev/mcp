import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Stack0 } from "@stack0/sdk";
import { z } from "zod";
import { json, error } from "../util.js";

export function registerMailTools(server: McpServer, stack0: Stack0) {
  server.tool(
    "mail_send",
    "Send a single email. Returns the email ID and status.",
    {
      from: z.string().describe("Sender email address or JSON {email, name}"),
      to: z.union([z.string(), z.array(z.string())]).describe("Recipient email(s)"),
      subject: z.string().describe("Email subject"),
      html: z.string().optional().describe("HTML content"),
      text: z.string().optional().describe("Plain text content"),
      cc: z.array(z.string()).optional().describe("CC recipients"),
      bcc: z.array(z.string()).optional().describe("BCC recipients"),
      replyTo: z.string().optional().describe("Reply-to address"),
      tags: z.array(z.string()).optional().describe("Tags for filtering"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.send(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_send_batch",
    "Send multiple emails in batch. Returns results for each email.",
    {
      emails: z
        .array(
          z.object({
            from: z.string().describe("Sender email"),
            to: z.union([z.string(), z.array(z.string())]).describe("Recipient(s)"),
            subject: z.string().describe("Subject"),
            html: z.string().optional().describe("HTML content"),
            text: z.string().optional().describe("Plain text"),
          }),
        )
        .min(1)
        .max(100)
        .describe("Array of emails to send"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.sendBatch(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_get",
    "Get an email by ID, including its status and tracking info.",
    {
      id: z.string().describe("Email ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.get(params.id as string);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_list",
    "List sent emails with optional filters.",
    {
      status: z
        .enum(["pending", "sent", "delivered", "bounced", "failed", "deferred"])
        .optional()
        .describe("Filter by status"),
      to: z.string().optional().describe("Filter by recipient"),
      limit: z.number().default(50).describe("Max results (1-100)"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.list(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );
}
