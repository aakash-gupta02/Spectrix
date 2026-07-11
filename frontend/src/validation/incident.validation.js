import { z } from "zod";
import { IncidentPublicStatus } from "@/enums/incident.enum";

export const updateIncidentSchema = z
  .object({
    publicStatus: z.enum(IncidentPublicStatus, {
      error: "Please select a valid public status.",
    }).optional(),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters.")
      .optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.publicStatus !== undefined ||
      (data.description !== undefined && data.description !== ""),
    {
      message: "At least one field must be updated.",
    },
  );