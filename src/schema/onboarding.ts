import { z } from "zod";

export const onboardingSchema = z.object({
  businessDescription: z
    .string()
    .trim()
    .min(1, "Please fill in what your business sells")
    .max(500),
  idealCustomer: z.object({
    theyAre: z.array(z.string()),
    whoWantTo: z.array(z.string()),
    locatedIn: z.array(z.string()),
    customInput: z.string().max(500),
  }).refine(
    (data) => 
      data.theyAre.length > 0 || 
      data.whoWantTo.length > 0 || 
      data.locatedIn.length > 0 || 
      data.customInput.trim().length > 0,
    {
      message: "Please select at least one option or write your own customer picture.",
      path: ["customInput"],
    }
  ),

  trafficChannel: z
    .string()
    .trim()
    .min(1, "Please pick a channel"),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
