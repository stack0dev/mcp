import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Stack0 } from "@stack0/sdk";
import { z } from "zod";
import { json, error } from "../util.js";

export function registerVideoTools(server: McpServer, stack0: Stack0) {
  server.tool(
    "video_transcode",
    "Start a video transcoding job to generate HLS streams or MP4 variants.",
    {
      assetId: z.string().describe("Video asset ID to transcode"),
      projectSlug: z.string().optional().describe("Project slug"),
      environment: z.enum(["sandbox", "production"]).default("production").describe("Environment"),
      outputFormat: z.enum(["hls", "mp4"]).default("hls").describe("Output format"),
      variants: z
        .array(
          z.object({
            quality: z.enum(["360p", "480p", "720p", "1080p", "1440p", "2160p"]),
            bitrate: z.number().optional().describe("Bitrate in kbps"),
            codec: z.enum(["h264", "h265"]).default("h264"),
            maxFramerate: z.number().optional().describe("Max framerate"),
          }),
        )
        .min(1)
        .describe("Quality variants to generate"),
      trim: z
        .object({
          start: z.number().describe("Start time in seconds"),
          end: z.number().describe("End time in seconds"),
        })
        .optional()
        .describe("Trim video"),
      webhookUrl: z.string().optional().describe("Webhook URL for completion notification"),
    },
    async (params) => {
      try {
        const result = await stack0.cdn.transcode(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "video_get_job",
    "Get the status and details of a transcoding job.",
    {
      jobId: z.string().describe("Transcode job ID"),
    },
    async (params) => {
      try {
        const result = await stack0.cdn.getJob(params.jobId as string);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "video_list_jobs",
    "List transcoding jobs with optional filters.",
    {
      projectSlug: z.string().optional().describe("Project slug"),
      assetId: z.string().optional().describe("Filter by asset ID"),
      status: z
        .enum(["pending", "processing", "completed", "failed", "cancelled", "queued"])
        .optional()
        .describe("Filter by status"),
      limit: z.number().default(20).describe("Max results (1-100)"),
      offset: z.number().default(0).describe("Pagination offset"),
    },
    async (params) => {
      try {
        const result = await stack0.cdn.listJobs(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "video_cancel_job",
    "Cancel a pending or running transcoding job.",
    {
      jobId: z.string().describe("Transcode job ID to cancel"),
    },
    async (params) => {
      try {
        const result = await stack0.cdn.cancelJob(params.jobId as string);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "video_get_streaming_url",
    "Get streaming URLs (HLS, MP4) for a transcoded video asset.",
    {
      assetId: z.string().describe("Video asset ID"),
    },
    async (params) => {
      try {
        const result = await stack0.cdn.getStreamingUrls(params.assetId as string);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "video_extract_audio",
    "Extract audio track from a video asset.",
    {
      assetId: z.string().describe("Video asset ID"),
      projectSlug: z.string().optional().describe("Project slug"),
      environment: z.enum(["sandbox", "production"]).default("production").describe("Environment"),
      format: z.enum(["mp3", "aac", "wav"]).default("mp3").describe("Audio output format"),
      bitrate: z.number().optional().describe("Bitrate in kbps"),
    },
    async (params) => {
      try {
        const result = await stack0.cdn.extractAudio(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );
}
