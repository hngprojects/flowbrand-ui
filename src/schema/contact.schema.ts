import { z } from "zod";

export const ContactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(200, "Full name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email({ message: "Enter a valid email address" }),
  businessName: z
    .string()
    .trim()
    .min(1, "Business name is required")
    .max(200, "Business name is too long"),
  message: z
    .string()
    .trim()
    .min(1, "Please enter a message")
    .max(5000, "Message is too long"),
});

export type ContactFormValues = z.infer<typeof ContactFormSchema>;
