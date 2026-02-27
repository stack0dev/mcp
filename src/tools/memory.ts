import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Stack0 } from "@stack0/sdk";
import { z } from "zod";
import { json, error } from "../util.js";

export function registerMemoryTools(server: McpServer, stack0: Stack0) {
  server.tool(
    "memory_store",
    "Store a memory for an AI agent. Memories are automatically embedded for semantic search.",
    {
      agentId: z.string().describe("Agent ID to store the memory for"),
      content: z.string().describe("Memory content text"),
      type: z.string().optional().describe("Memory type (e.g. 'preference', 'fact', 'conversation')"),
      metadata: z.record(z.string(), z.unknown()).optional().describe("Custom metadata"),
    },
    async (params) => {
      try {
        const result = await stack0.memory.store(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "memory_recall",
    "Recall memories for an AI agent using semantic search. Returns the most relevant memories.",
    {
      agentId: z.string().describe("Agent ID to recall memories for"),
      query: z.string().describe("Search query for semantic recall"),
      limit: z.number().default(10).describe("Max memories to return"),
    },
    async (params) => {
      try {
        const result = await stack0.memory.recall(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "memory_search",
    "Search memories with filters. More flexible than recall.",
    {
      agentId: z.string().optional().describe("Filter by agent ID"),
      query: z.string().optional().describe("Search query"),
      type: z.string().optional().describe("Filter by memory type"),
      limit: z.number().default(20).describe("Max results"),
    },
    async (params) => {
      try {
        const result = await stack0.memory.search(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "memory_get",
    "Get a specific memory by ID.",
    {
      id: z.string().describe("Memory ID"),
    },
    async (params) => {
      try {
        const result = await stack0.memory.get(params.id as string);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "memory_list",
    "List memories with optional filters.",
    {
      agentId: z.string().optional().describe("Filter by agent ID"),
      type: z.string().optional().describe("Filter by memory type"),
      limit: z.number().default(20).describe("Max results"),
    },
    async (params) => {
      try {
        const result = await stack0.memory.list(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "memory_delete",
    "Delete a memory by ID.",
    {
      id: z.string().describe("Memory ID to delete"),
    },
    async (params) => {
      try {
        await stack0.memory.delete(params.id as string);
        return json({ success: true });
      } catch (e) {
        return error(e);
      }
    },
  );
}
