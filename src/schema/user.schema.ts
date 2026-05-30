import * as z from "zod";

export const UpdateProfileSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters.")
      .max(80, "Name must be under 80 characters.")
      .transform((val) => val.trim())
      .refine((val) => val.length > 0, "Name cannot be empty.")
      .optional(),

    country: z.string().min(1, "Please select a country.").optional(),
  })
  .refine((data) => data.fullName !== undefined || data.country !== undefined, {
    message: "Provide at least one field to update.",
  });

export type UpdateProfileValues = z.infer<typeof UpdateProfileSchema>;
