import { z } from "zod";

export const onboardingSchema = z.object({
  businessDescription: z
    .string()
    .min(1, "Please fill in what your business sells")
    .max(500),
  idealCustomer: z.object({
    theyAre: z.array(z.string()),
    whoWantTo: z.array(z.string()),
    locatedIn: z.array(z.string()),
    customInput: z.string(),
  }),
  trafficChannel: z.string().min(1, "Please pick a channel"),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
