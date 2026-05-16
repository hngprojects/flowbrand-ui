import * as z from "zod";

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

export const registrationPasswordField = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[A-Z]/, {
    message: "Include an uppercase letter (A–Z)",
  })
  .regex(/[a-z]/, {
    message: "Include a lowercase letter (a–z)",
  })
  .regex(/[@#$%]/, {
    message: "Include a symbol (@, #, $, %)",
  });

export type PasswordChecks = {
  minLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  symbol: boolean;
};

export const PASSWORD_RULE_ROWS = [
  { key: "minLength" as const, label: "At least 8 characters" },
  { key: "uppercase" as const, label: "Uppercase letter (A–Z)" },
  { key: "lowercase" as const, label: "Lowercase letter (a–z)" },
  { key: "symbol" as const, label: "One symbol (@, #, $, %)" },
] as const;

export function getPasswordChecks(password: string): PasswordChecks {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    symbol: /[@#$%]/.test(password),
  };
}

export const RegisterSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required." }).min(3, {
    message: "First name must be at least 3 characters",
  }),
  last_name: z.string().min(1, { message: "Last name is required." }).min(3, {
    message: "Last name must be at least 3 characters",
  }),
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
    full_name: z.string().trim().min(1, { message: "Full name is required" }),
    email: z
      .string()
      .trim()
      .min(1, { message: "Email is required" })
      .email({ message: "Enter a valid email address" }),
    country: z.string().trim().min(1, { message: "Please select a country" }),
    password: registrationPasswordField,
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
  });

export const OtpFormSchema = z.object({
  d0: z.string().length(1).regex(/^\d$/),
  d1: z.string().length(1).regex(/^\d$/),
  d2: z.string().length(1).regex(/^\d$/),
  d3: z.string().length(1).regex(/^\d$/),
  d4: z.string().length(1).regex(/^\d$/),
  d5: z.string().length(1).regex(/^\d$/),
});

/** Six-digit OTP string sent to the verify endpoint (joined from OtpFormSchema). */
export const VerifyOtpCodeSchema = z
  .string()
  .trim()
  .min(1, { message: "Verification code is required." })
  .regex(/^\d{6}$/, { message: "Verification code must be 6 digits." });

export const ResetPasswordSchema = z
  .object({
    password: registrationPasswordField,
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
