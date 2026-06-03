import { z } from "zod";
import { countWords } from "@/lib/word-count";

export const BUSINESS_DESCRIPTION_MAX_WORDS = 2000;
/** Hard cap so a single huge “word” cannot bypass the word limit. */
export const BUSINESS_DESCRIPTION_MAX_CHARS = 20_000;

export const onboardingSchema = z.object({
  businessDescription: z
    .string()
    .trim()
    .min(1, "Please fill in what your business sells")
    .max(
      BUSINESS_DESCRIPTION_MAX_CHARS,
      `Please keep your description under ${BUSINESS_DESCRIPTION_MAX_CHARS.toLocaleString()} characters`,
    )
    .refine(
      (val) => countWords(val) <= BUSINESS_DESCRIPTION_MAX_WORDS,
      `Please keep your description to ${BUSINESS_DESCRIPTION_MAX_WORDS} words or fewer`,
    ),
  idealCustomer: z
    .object({
      theyAre: z.array(z.string()),
      whoWantTo: z.array(z.string()),
      locatedIn: z.array(z.string()),
      customInput: z.string().max(500),
    })
    .refine(
      (data) =>
        data.theyAre.length > 0 ||
        data.whoWantTo.length > 0 ||
        data.locatedIn.length > 0 ||
        data.customInput.trim().length > 0,
      {
        message:
          "Please select at least one option or write your own customer picture.",
        path: ["customInput"],
      },
    ),

  trafficChannel: z.string().trim().min(1, "Please pick a channel"),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
