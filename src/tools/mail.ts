import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Stack0 } from "@stack0/sdk";
import { z } from "zod";
import { json, error } from "../util.js";

export function registerMailTools(server: McpServer, stack0: Stack0) {
  // ============================================================================
  // TRANSACTIONAL EMAILS
  // ============================================================================

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
    "Send multiple emails in batch (max 100). Each can have different content/recipients.",
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
    "mail_send_broadcast",
    "Send the same email to multiple recipients (up to 1000).",
    {
      from: z.string().describe("Sender email"),
      to: z.array(z.string()).min(1).max(1000).describe("Recipient emails"),
      subject: z.string().describe("Email subject"),
      html: z.string().optional().describe("HTML content"),
      text: z.string().optional().describe("Plain text content"),
      templateId: z.string().optional().describe("Template ID to use"),
      tags: z.array(z.string()).optional().describe("Tags"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.sendBroadcast(params as any);
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
        const result = await stack0.mail.get(params.id);
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
      status: z.enum(["pending", "sent", "delivered", "bounced", "failed", "deferred"]).optional().describe("Filter by status"),
      to: z.string().optional().describe("Filter by recipient"),
      from: z.string().optional().describe("Filter by sender"),
      limit: z.number().default(50).describe("Max results (1-100)"),
      offset: z.number().optional().describe("Pagination offset"),
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

  server.tool(
    "mail_resend",
    "Resend a previously sent email.",
    {
      id: z.string().describe("Email ID to resend"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.resend(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_cancel",
    "Cancel a pending/scheduled email.",
    {
      id: z.string().describe("Email ID to cancel"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.cancel(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  server.tool(
    "mail_analytics",
    "Get overall email analytics (totals, rates, delivery stats).",
    {},
    async () => {
      try {
        const result = await stack0.mail.getAnalytics();
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_analytics_timeseries",
    "Get daily email analytics breakdown.",
    {
      days: z.number().optional().describe("Number of days (default 30, max 365)"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.getTimeSeriesAnalytics(params);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_analytics_hourly",
    "Get hourly email analytics.",
    {},
    async () => {
      try {
        const result = await stack0.mail.getHourlyAnalytics();
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_list_senders",
    "List unique senders with their statistics.",
    {
      search: z.string().optional().describe("Search senders"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.listSenders(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  // ============================================================================
  // TEMPLATES
  // ============================================================================

  server.tool(
    "mail_templates_list",
    "List email templates.",
    {
      limit: z.number().optional().describe("Max results"),
      offset: z.number().optional().describe("Pagination offset"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.templates.list(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_templates_get",
    "Get a template by ID.",
    {
      id: z.string().describe("Template ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.templates.get(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_templates_create",
    "Create an email template.",
    {
      name: z.string().describe("Template name"),
      slug: z.string().describe("Unique slug"),
      subject: z.string().describe("Email subject"),
      html: z.string().describe("HTML content"),
      text: z.string().optional().describe("Plain text content"),
      previewText: z.string().optional().describe("Preview/preheader text"),
      description: z.string().optional().describe("Template description"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.templates.create(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_templates_update",
    "Update an email template.",
    {
      id: z.string().describe("Template ID"),
      name: z.string().optional().describe("Template name"),
      subject: z.string().optional().describe("Email subject"),
      html: z.string().optional().describe("HTML content"),
      text: z.string().optional().describe("Plain text content"),
      previewText: z.string().optional().describe("Preview text"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.templates.update(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_templates_delete",
    "Delete an email template.",
    {
      id: z.string().describe("Template ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.templates.delete(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_templates_preview",
    "Preview a template with variables.",
    {
      id: z.string().describe("Template ID"),
      variables: z.record(z.string(), z.unknown()).optional().describe("Template variables"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.templates.preview({ id: params.id, variables: params.variables as any });
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  // ============================================================================
  // DOMAINS
  // ============================================================================

  server.tool(
    "mail_domains_list",
    "List verified sending domains.",
    {
      projectSlug: z.string().optional().describe("Project slug"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.domains.list(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_domains_add",
    "Add a new sending domain.",
    {
      domain: z.string().describe("Domain name (e.g. example.com)"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.domains.add(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_domains_verify",
    "Verify a domain's DNS records.",
    {
      id: z.string().describe("Domain ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.domains.verify(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_domains_get_dns",
    "Get DNS records needed to verify a domain.",
    {
      id: z.string().describe("Domain ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.domains.getDnsRecords(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_domains_delete",
    "Delete a sending domain.",
    {
      id: z.string().describe("Domain ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.domains.delete(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_domains_set_default",
    "Set a domain as the default sending domain.",
    {
      id: z.string().describe("Domain ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.domains.setDefault(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  // ============================================================================
  // CONTACTS
  // ============================================================================

  server.tool(
    "mail_contacts_list",
    "List contacts with optional filters.",
    {
      limit: z.number().optional().describe("Max results"),
      offset: z.number().optional().describe("Pagination offset"),
      search: z.string().optional().describe("Search by email or name"),
      status: z.enum(["subscribed", "unsubscribed", "bounced", "complained"]).optional().describe("Filter by status"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.contacts.list(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_contacts_create",
    "Create a new contact.",
    {
      email: z.string().describe("Contact email"),
      firstName: z.string().optional().describe("First name"),
      lastName: z.string().optional().describe("Last name"),
      metadata: z.record(z.string(), z.unknown()).optional().describe("Custom metadata"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.contacts.create(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_contacts_update",
    "Update a contact.",
    {
      id: z.string().describe("Contact ID"),
      firstName: z.string().optional().describe("First name"),
      lastName: z.string().optional().describe("Last name"),
      metadata: z.record(z.string(), z.unknown()).optional().describe("Custom metadata"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.contacts.update(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_contacts_delete",
    "Delete a contact.",
    {
      id: z.string().describe("Contact ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.contacts.delete(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  // ============================================================================
  // AUDIENCES
  // ============================================================================

  server.tool(
    "mail_audiences_list",
    "List contact audiences/lists.",
    {
      limit: z.number().optional().describe("Max results"),
      offset: z.number().optional().describe("Pagination offset"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.audiences.list(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_audiences_get",
    "Get an audience by ID.",
    {
      id: z.string().describe("Audience ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.audiences.get(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_audiences_create",
    "Create a new audience.",
    {
      name: z.string().describe("Audience name"),
      description: z.string().optional().describe("Audience description"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.audiences.create(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_audiences_update",
    "Update an audience.",
    {
      id: z.string().describe("Audience ID"),
      name: z.string().optional().describe("Audience name"),
      description: z.string().optional().describe("Audience description"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.audiences.update(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_audiences_delete",
    "Delete an audience.",
    {
      id: z.string().describe("Audience ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.audiences.delete(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_audiences_add_contacts",
    "Add contacts to an audience.",
    {
      audienceId: z.string().describe("Audience ID"),
      contactIds: z.array(z.string()).min(1).describe("Contact IDs to add"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.audiences.addContacts(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_audiences_remove_contacts",
    "Remove contacts from an audience.",
    {
      audienceId: z.string().describe("Audience ID"),
      contactIds: z.array(z.string()).min(1).describe("Contact IDs to remove"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.audiences.removeContacts(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_audiences_list_contacts",
    "List contacts in an audience.",
    {
      audienceId: z.string().describe("Audience ID"),
      limit: z.number().optional().describe("Max results"),
      offset: z.number().optional().describe("Pagination offset"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.audiences.listContacts(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  // ============================================================================
  // CAMPAIGNS
  // ============================================================================

  server.tool(
    "mail_campaigns_list",
    "List email campaigns.",
    {
      limit: z.number().optional().describe("Max results"),
      offset: z.number().optional().describe("Pagination offset"),
      status: z.enum(["draft", "scheduled", "sending", "sent", "paused", "cancelled"]).optional().describe("Filter by status"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.campaigns.list(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_campaigns_get",
    "Get a campaign by ID.",
    {
      id: z.string().describe("Campaign ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.campaigns.get(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_campaigns_create",
    "Create a new campaign.",
    {
      name: z.string().describe("Campaign name"),
      subject: z.string().describe("Email subject"),
      audienceId: z.string().optional().describe("Target audience ID"),
      html: z.string().optional().describe("HTML content"),
      text: z.string().optional().describe("Plain text content"),
      templateId: z.string().optional().describe("Template ID"),
      fromName: z.string().optional().describe("Sender name"),
      fromEmail: z.string().optional().describe("Sender email"),
      replyTo: z.string().optional().describe("Reply-to address"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.campaigns.create(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_campaigns_update",
    "Update a campaign.",
    {
      id: z.string().describe("Campaign ID"),
      name: z.string().optional().describe("Campaign name"),
      subject: z.string().optional().describe("Email subject"),
      audienceId: z.string().optional().describe("Target audience ID"),
      html: z.string().optional().describe("HTML content"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.campaigns.update(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_campaigns_delete",
    "Delete a campaign.",
    {
      id: z.string().describe("Campaign ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.campaigns.delete(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_campaigns_send",
    "Send a campaign to its audience.",
    {
      id: z.string().describe("Campaign ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.campaigns.send({ id: params.id });
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_campaigns_pause",
    "Pause a sending campaign.",
    {
      id: z.string().describe("Campaign ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.campaigns.pause(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_campaigns_cancel",
    "Cancel a campaign.",
    {
      id: z.string().describe("Campaign ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.campaigns.cancel(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_campaigns_duplicate",
    "Duplicate a campaign.",
    {
      id: z.string().describe("Campaign ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.campaigns.duplicate(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_campaigns_stats",
    "Get campaign statistics.",
    {
      id: z.string().describe("Campaign ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.campaigns.getStats(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  // ============================================================================
  // EVENTS
  // ============================================================================

  server.tool(
    "mail_events_list",
    "List custom event definitions.",
    {
      limit: z.number().optional().describe("Max results"),
      offset: z.number().optional().describe("Pagination offset"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.events.list(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_events_create",
    "Create a custom event definition.",
    {
      name: z.string().describe("Event name (e.g. purchase_completed)"),
      description: z.string().optional().describe("Event description"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.events.create(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_events_track",
    "Track a custom event for a contact. Can trigger sequence entries.",
    {
      eventName: z.string().describe("Event name"),
      contactId: z.string().describe("Contact ID"),
      properties: z.record(z.string(), z.unknown()).optional().describe("Event properties"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.events.track(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_events_track_batch",
    "Track multiple events in batch.",
    {
      events: z
        .array(
          z.object({
            eventName: z.string().describe("Event name"),
            contactId: z.string().describe("Contact ID"),
            properties: z.record(z.string(), z.unknown()).optional().describe("Event properties"),
          }),
        )
        .min(1)
        .describe("Array of events"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.events.trackBatch(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  // ============================================================================
  // SEQUENCES
  // ============================================================================

  server.tool(
    "mail_sequences_list",
    "List email sequences/automations.",
    {
      status: z.enum(["draft", "active", "paused", "archived"]).optional().describe("Filter by status"),
      limit: z.number().optional().describe("Max results"),
      offset: z.number().optional().describe("Pagination offset"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.sequences.list(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_sequences_get",
    "Get a sequence by ID with all nodes and connections.",
    {
      id: z.string().describe("Sequence ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.sequences.get(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_sequences_create",
    "Create a new email sequence.",
    {
      name: z.string().describe("Sequence name"),
      triggerType: z.string().describe("Trigger type (contact_created, contact_updated, contact_added_to_list, event_received)"),
      description: z.string().optional().describe("Sequence description"),
      triggerFrequency: z.enum(["once", "multiple"]).optional().describe("How often contacts can enter"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.sequences.create(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_sequences_update",
    "Update a sequence.",
    {
      id: z.string().describe("Sequence ID"),
      name: z.string().optional().describe("Sequence name"),
      description: z.string().optional().describe("Description"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.sequences.update(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_sequences_delete",
    "Delete a sequence.",
    {
      id: z.string().describe("Sequence ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.sequences.delete(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_sequences_publish",
    "Publish (activate) a sequence so it starts processing contacts.",
    {
      id: z.string().describe("Sequence ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.sequences.publish(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_sequences_pause",
    "Pause an active sequence.",
    {
      id: z.string().describe("Sequence ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.sequences.pause(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_sequences_resume",
    "Resume a paused sequence.",
    {
      id: z.string().describe("Sequence ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.sequences.resume(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_sequences_archive",
    "Archive a sequence.",
    {
      id: z.string().describe("Sequence ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.sequences.archive(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_sequences_duplicate",
    "Duplicate a sequence.",
    {
      id: z.string().describe("Sequence ID"),
      name: z.string().optional().describe("Name for the duplicate"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.sequences.duplicate(params.id, params.name);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  // Sequence nodes

  server.tool(
    "mail_sequences_create_node",
    "Create a node in a sequence. Types: trigger, email, timer, filter, branch, experiment, update_contact, add_to_list, remove_from_list, end.",
    {
      sequenceId: z.string().describe("Sequence ID"),
      nodeType: z.string().describe("Node type"),
      name: z.string().optional().describe("Node name"),
      positionX: z.number().optional().describe("X position in visual editor"),
      positionY: z.number().optional().describe("Y position in visual editor"),
      sortOrder: z.number().optional().describe("Sort order"),
      config: z.record(z.string(), z.unknown()).optional().describe("Node-specific config JSON"),
    },
    async (params) => {
      try {
        const { sequenceId, ...data } = params;
        const result = await stack0.mail.sequences.createNode({ id: sequenceId, ...data } as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_sequences_update_node",
    "Update a node in a sequence.",
    {
      sequenceId: z.string().describe("Sequence ID"),
      nodeId: z.string().describe("Node ID"),
      name: z.string().optional().describe("Node name"),
      sortOrder: z.number().optional().describe("Sort order"),
      config: z.record(z.string(), z.unknown()).optional().describe("Node config JSON"),
    },
    async (params) => {
      try {
        const { sequenceId, ...data } = params;
        const result = await stack0.mail.sequences.updateNode({ id: sequenceId, ...data } as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_sequences_delete_node",
    "Delete a node from a sequence.",
    {
      sequenceId: z.string().describe("Sequence ID"),
      nodeId: z.string().describe("Node ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.sequences.deleteNode(params.sequenceId, params.nodeId);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  // Node configuration

  server.tool(
    "mail_sequences_set_node_email",
    "Configure an email node with subject, content, and sender.",
    {
      sequenceId: z.string().describe("Sequence ID"),
      nodeId: z.string().describe("Node ID"),
      subject: z.string().describe("Email subject"),
      html: z.string().optional().describe("HTML content"),
      text: z.string().optional().describe("Plain text content"),
      templateId: z.string().optional().describe("Template ID"),
      fromEmail: z.string().optional().describe("Sender email"),
      fromName: z.string().optional().describe("Sender name"),
      replyTo: z.string().optional().describe("Reply-to address"),
      previewText: z.string().optional().describe("Preview text"),
    },
    async (params) => {
      try {
        const { sequenceId, ...data } = params;
        const result = await stack0.mail.sequences.setNodeEmail(sequenceId, data as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_sequences_set_node_timer",
    "Configure a timer/delay node.",
    {
      sequenceId: z.string().describe("Sequence ID"),
      nodeId: z.string().describe("Node ID"),
      delayAmount: z.number().describe("Delay amount"),
      delayUnit: z.enum(["minutes", "hours", "days", "weeks"]).describe("Delay unit"),
      waitUntilTime: z.string().optional().describe("Wait until time of day (HH:MM)"),
      waitUntilTimezone: z.string().optional().describe("Timezone for wait-until-time"),
    },
    async (params) => {
      try {
        const { sequenceId, ...data } = params;
        const result = await stack0.mail.sequences.setNodeTimer(sequenceId, data as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_sequences_set_node_filter",
    "Configure a filter node with conditions.",
    {
      sequenceId: z.string().describe("Sequence ID"),
      nodeId: z.string().describe("Node ID"),
      conditions: z
        .object({
          operator: z.enum(["and", "or"]).describe("Logical operator"),
          rules: z
            .array(
              z.object({
                field: z.string().describe("Contact field (email, firstName, metadata.plan, etc.)"),
                operator: z.enum(["equals", "not_equals", "contains", "not_contains", "starts_with", "ends_with", "is_set", "is_not_set", "greater_than", "less_than"]).describe("Comparison operator"),
                value: z.unknown().optional().describe("Value to compare against"),
              }),
            )
            .describe("Filter rules"),
        })
        .describe("Filter conditions"),
      nonMatchAction: z.enum(["stop", "continue"]).optional().describe("Action for non-matching contacts"),
    },
    async (params) => {
      try {
        const { sequenceId, ...data } = params;
        const result = await stack0.mail.sequences.setNodeFilter(sequenceId, data as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_sequences_set_node_branch",
    "Configure a branch node for conditional routing.",
    {
      sequenceId: z.string().describe("Sequence ID"),
      nodeId: z.string().describe("Node ID"),
      branches: z
        .array(
          z.object({
            id: z.string().describe("Branch ID"),
            name: z.string().describe("Branch name"),
            conditions: z.object({
              operator: z.enum(["and", "or"]),
              rules: z.array(
                z.object({
                  field: z.string(),
                  operator: z.enum(["equals", "not_equals", "contains", "not_contains", "starts_with", "ends_with", "is_set", "is_not_set", "greater_than", "less_than"]),
                  value: z.unknown().optional(),
                }),
              ),
            }),
          }),
        )
        .describe("Branch conditions"),
      hasDefaultBranch: z.boolean().optional().describe("Include default branch for unmatched contacts"),
    },
    async (params) => {
      try {
        const { sequenceId, ...data } = params;
        const result = await stack0.mail.sequences.setNodeBranch(sequenceId, data as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_sequences_set_node_experiment",
    "Configure an A/B experiment node.",
    {
      sequenceId: z.string().describe("Sequence ID"),
      nodeId: z.string().describe("Node ID"),
      variants: z
        .array(
          z.object({
            id: z.string().describe("Variant ID"),
            name: z.string().describe("Variant name"),
            weight: z.number().describe("Distribution weight (percentage)"),
          }),
        )
        .describe("Experiment variants"),
      sampleSize: z.number().optional().describe("Sample size percentage (0-100)"),
    },
    async (params) => {
      try {
        const { sequenceId, ...data } = params;
        const result = await stack0.mail.sequences.setNodeExperiment(sequenceId, data as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  // Connections

  server.tool(
    "mail_sequences_create_connection",
    "Create a connection between two nodes in a sequence.",
    {
      sequenceId: z.string().describe("Sequence ID"),
      sourceNodeId: z.string().describe("Source node ID"),
      targetNodeId: z.string().describe("Target node ID"),
      connectionType: z.string().optional().describe("Connection type (default, yes, no, or variant/branch ID)"),
      label: z.string().optional().describe("Connection label"),
    },
    async (params) => {
      try {
        const { sequenceId, ...data } = params;
        const result = await stack0.mail.sequences.createConnection({ id: sequenceId, ...data } as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_sequences_delete_connection",
    "Delete a connection between nodes.",
    {
      sequenceId: z.string().describe("Sequence ID"),
      connectionId: z.string().describe("Connection ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.sequences.deleteConnection(params.sequenceId, params.connectionId);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  // Entries (contacts in sequence)

  server.tool(
    "mail_sequences_list_entries",
    "List contacts currently in a sequence with their progress.",
    {
      id: z.string().describe("Sequence ID"),
      status: z.enum(["active", "completed", "paused", "stopped", "bounced", "unsubscribed"]).optional().describe("Filter by status"),
      limit: z.number().optional().describe("Max results"),
      offset: z.number().optional().describe("Pagination offset"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.sequences.listEntries(params as any);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_sequences_add_contact",
    "Add a contact to a sequence manually.",
    {
      sequenceId: z.string().describe("Sequence ID"),
      contactId: z.string().describe("Contact ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.sequences.addContact({ id: params.sequenceId, contactId: params.contactId });
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_sequences_remove_contact",
    "Remove a contact from a sequence.",
    {
      sequenceId: z.string().describe("Sequence ID"),
      entryId: z.string().describe("Entry ID"),
      reason: z.string().optional().describe("Exit reason"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.sequences.removeContact({ id: params.sequenceId, entryId: params.entryId, reason: params.reason });
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );

  server.tool(
    "mail_sequences_analytics",
    "Get sequence analytics with per-node metrics.",
    {
      id: z.string().describe("Sequence ID"),
    },
    async (params) => {
      try {
        const result = await stack0.mail.sequences.getAnalytics(params.id);
        return json(result);
      } catch (e) {
        return error(e);
      }
    },
  );
}
