import * as z from "zod";

/** NextAuth passes every credential field as a string — never use z.boolean() raw here. */
function parseRememberMe(value: unknown): boolean {
  if (value === true || value === "true" || value === "on" || value === "1") {
    return true;
  }
  return false;
}

export const LoginSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  email: z
    .string()
    .min(1, {
      message: "Email is required",
    })
    .email({
      message: "Enter a valid email address",
    }),
  rememberMe: z.boolean().default(false).optional(),
});

/** Used in NextAuth `authorize()` where email/password/rememberMe are all strings. */
export const LoginCredentialsSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  email: z
    .string()
    .trim()
    .min(1, {
      message: "Email is required",
    })
    .email({
      message: "Enter a valid email address",
    }),
  rememberMe: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform(parseRememberMe),
});

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export const registrationPasswordField = z
  .string()
  .min(PASSWORD_MIN_LENGTH, {
    message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  })
  .max(PASSWORD_MAX_LENGTH, {
    message: `Password must be at most ${PASSWORD_MAX_LENGTH} characters`,
  })
  .regex(/[A-Z]/, {
    message: "Include an uppercase letter (A–Z)",
  })
  .regex(/[a-z]/, {
    message: "Include a lowercase letter (a–z)",
  })
  .regex(/[0-9]/, {
    message: "Include a number (0–9)",
  })
  .regex(/[@#$%]/, {
    message: "Include a symbol (@, #, $, %)",
  });

export type PasswordChecks = {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  digit: boolean;
  symbol: boolean;
};

export const PASSWORD_RULE_ROWS = [
  {
    key: "length" as const,
    label: `Between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters`,
  },
  { key: "uppercase" as const, label: "Uppercase letter (A–Z)" },
  { key: "lowercase" as const, label: "Lowercase letter (a–z)" },
  { key: "digit" as const, label: "One number (0–9)" },
  { key: "symbol" as const, label: "One symbol (@, #, $, %)" },
] as const;

export function getPasswordChecks(password: string): PasswordChecks {
  return {
    length:
      password.length >= PASSWORD_MIN_LENGTH &&
      password.length <= PASSWORD_MAX_LENGTH,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /[0-9]/.test(password),
    symbol: /[@#$%]/.test(password),
  };
}

export const NAME_NO_DIGITS_MESSAGE = "Full name cannot contain numbers";

export function nameHasNoDigits(value: string): boolean {
  return !/\d/.test(value);
}

const registerNamePartField = (label: "First" | "Last") =>
  z
    .string()
    .trim()
    .min(1, { message: `${label} name is required.` })
    .min(3, { message: `${label} name must be at least 3 characters` })
    .refine(nameHasNoDigits, { message: NAME_NO_DIGITS_MESSAGE });

export const registerFullNameField = z
  .string()
  .trim()
  .min(1, { message: "Full name is required" })
  .refine(nameHasNoDigits, { message: NAME_NO_DIGITS_MESSAGE });

export const RegisterSchema = z.object({
  first_name: registerNamePartField("First"),
  last_name: registerNamePartField("Last"),
  email: z.string().min(1, { message: "Field is required" }).email({
    message: "Invalid email address",
  }),
  country: z.string().min(1, { message: "Country is required" }),
  password: registrationPasswordField,
});

const RegisterNameSchema = RegisterSchema.pick({
  first_name: true,
  last_name: true,
});

export function splitFullNameForRegister(fullName: string): {
  first_name: string;
  last_name: string;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { first_name: "", last_name: "" };
  }
  if (parts.length === 1) {
    return { first_name: parts[0], last_name: "" };
  }
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}

export const RegistrationFormSchema = z
  .object({
    full_name: registerFullNameField,
    business_name: z
      .string()
      .trim()
      .min(1, { message: "Business name is required" })
      .max(150, { message: "Business name must be at most 150 characters" }),
    email: z
      .string()
      .trim()
      .min(1, { message: "Email is required" })
      .email({ message: "Enter a valid email address" }),
    country: z.string().trim().min(1, { message: "Please select a country" }),
    password: registrationPasswordField,
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .superRefine((data, ctx) => {
    const names = splitFullNameForRegister(data.full_name);
    const nameResult = RegisterNameSchema.safeParse(names);
    if (!nameResult.success) {
      for (const issue of nameResult.error.issues) {
        ctx.addIssue({
          ...issue,
          path: ["full_name"],
        });
      }
    }
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const OTP_FIELD_NAMES = ["d0", "d1", "d2", "d3", "d4", "d5"] as const;

export const OtpFormSchema = z.object({
  d0: z.string().length(1).regex(/^\d$/),
  d1: z.string().length(1).regex(/^\d$/),
  d2: z.string().length(1).regex(/^\d$/),
  d3: z.string().length(1).regex(/^\d$/),
  d4: z.string().length(1).regex(/^\d$/),
  d5: z.string().length(1).regex(/^\d$/),
});

export function joinOtpFormDigits(data: z.infer<typeof OtpFormSchema>): string {
  return OTP_FIELD_NAMES.map((key) => data[key]).join("");
}

/** Six-digit OTP string sent to the verify endpoint (joined from OtpFormSchema). */
export const VerifyOtpCodeSchema = z
  .string()
  .trim()
  .min(1, { message: "Verification code is required." })
  .regex(/^\d{6}$/, { message: "Verification code must be 6 digits." });

const resetPasswordFieldsSchema = z.object({
  password: registrationPasswordField,
  confirmPassword: z
    .string()
    .min(1, { message: "Please confirm your password" }),
});

export const ResetPasswordSchema = resetPasswordFieldsSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  },
);

export const ResetPasswordWithOtpFormSchema = resetPasswordFieldsSchema
  .safeExtend(OtpFormSchema.shape)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
