import { z } from "zod";

const CHANNEL_TYPES = ["discord", "slack", "webhook"];

export const createAlertChannelFormSchema = z
  .object({
    type: z.enum(CHANNEL_TYPES, "Type is required"),
    url: z.string().trim().url("Enter a valid URL"),
    isActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    const { type, url } = data;

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
