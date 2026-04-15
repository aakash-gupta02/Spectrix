import { z } from "zod";

// Validation schema for creating an alert channel
export const createAlertChannelSchema = z
  .object({
    type: z.enum(
      ["discord", "slack", "webhook"],
      "Type must be one of 'discord', 'slack', or 'webhook'",
    ),
    url: z.string().min(1, "URL is required"),
    isActive: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const { type, url } = data;

    // type-specific validation
    if (type === "slack" && !url.includes("hooks.slack.com")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid Slack webhook URL",
        path: ["url"],
      });
    }

    if (type === "discord" && !url.includes("discord.com/api/webhooks")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid Discord webhook URL",
        path: ["url"],
      });
    }

    if (type === "webhook" && !url.startsWith("https://")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Webhook URL must be HTTPS",
        path: ["url"],
      });
    }
  });


// Validation schema for alert channel ID parameter
export const alertChannelIdParamSchema = z.object({
  alertChannelId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid alert channel ID"),
});

export type CreateAlertChannelInput = z.infer<typeof createAlertChannelSchema>;
export type AlertChannelIdParam = z.infer<typeof alertChannelIdParamSchema>;
