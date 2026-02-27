import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Stack0 } from "@stack0/sdk";
import { z } from "zod";
import { json, error } from "../util.js";

export function registerWorkflowTools(server: McpServer, stack0: Stack0) {
  server.tool(
    "workflows_create",
    "Create a new AI workflow with LLM, HTTP, and transform steps. Workflows are DAGs that process data through multiple steps.",
    {
      slug: z.string().describe("Unique slug for the workflow (lowercase, hyphens only)"),
      name: z.string().describe("Workflow name"),
      description: z.string().optional().describe("Workflow description"),
      environment: z.enum(["sandbox", "production"]).default("production").describe("Environment"),
      steps: z
        .array(
          z.object({
            id: z.string().describe("Unique step ID"),
            name: z.string().describe("Step name"),
            type: z
              .enum(["llm", "image", "video", "audio", "code", "http", "transform", "condition", "loop"])
              .describe("Step type"),
            provider: z.enum(["anthropic", "openai", "gemini", "replicate", "stack0"]).describe("Provider"),
            model: z.string().describe("Model name"),
            config: z
              .object({
                prompt: z.string().optional(),
                systemPrompt: z.string().optional(),
                temperature: z.number().optional(),
                maxTokens: z.number().optional(),
                responseFormat: z.enum(["text", "json"]).optional(),
                url: z.string().optional(),
                method: z.enum(["GET", "POST", "PUT", "DELETE"]).optional(),
              })
              .optional()
              .describe("Step configuration"),
            dependsOn: z.array(z.string()).optional().describe("Step IDs this depends on"),
          }),
        )
        .min(1)
        .describe("Workflow steps (DAG)"),
      variables: z
        .array(
          z.object({
            name: z.string(),
            type: z.enum(["string", "number", "boolean", "object", "array", "image"]),
            required: z.boolean().default(false),
            description: z.string().optional(),
          }),
        )
        .optional()
        .describe("Input variable definitions"),
    },
    async (params) => {
      try {
        const result = await stack0.workflows.create(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "workflows_run",
    "Execute a workflow with provided input variables. Returns a run ID for tracking progress.",
    {
      workflowId: z.string().optional().describe("Workflow ID (alternative to slug)"),
      workflowSlug: z.string().optional().describe("Workflow slug (alternative to ID)"),
      environment: z.enum(["sandbox", "production"]).default("production").describe("Environment"),
      variables: z.record(z.string(), z.unknown()).optional().describe("Input variables"),
    },
    async (params) => {
      try {
        const result = await stack0.workflows.run(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "workflows_get_run",
    "Get the status and result of a workflow run.",
    {
      id: z.string().describe("Run ID"),
      environment: z.enum(["sandbox", "production"]).optional().describe("Environment"),
    },
    async (params) => {
      try {
        const result = await stack0.workflows.getRun(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "workflows_list",
    "List all workflows in the organization.",
    {
      environment: z.enum(["sandbox", "production"]).optional().describe("Filter by environment"),
      limit: z.number().default(20).describe("Max results (1-100)"),
    },
    async (params) => {
      try {
        const result = await stack0.workflows.list(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "workflows_list_runs",
    "List workflow runs with optional filters.",
    {
      workflowId: z.string().optional().describe("Filter by workflow ID"),
      environment: z.enum(["sandbox", "production"]).optional().describe("Filter by environment"),
      status: z.enum(["pending", "running", "completed", "failed", "cancelled"]).optional().describe("Filter by status"),
      limit: z.number().default(20).describe("Max results (1-100)"),
    },
    async (params) => {
      try {
        const result = await stack0.workflows.listRuns(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "workflows_cancel_run",
    "Cancel a pending or running workflow run.",
    {
      id: z.string().describe("Run ID to cancel"),
    },
    async (params) => {
      try {
        const result = await stack0.workflows.cancelRun(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );
}
