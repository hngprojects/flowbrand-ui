"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  clearForgotResetStorage,
  getForgotResetEmail,
  subscribeToForgotResetStorage,
} from "@/lib/forgot-password-storage";
import { isInvalidResetOtpError } from "@/lib/password-reset-errors";
import {
  getPasswordChecks,
  joinOtpFormDigits,
  OTP_FIELD_NAMES,
  PASSWORD_RULE_ROWS,
  ResetPasswordWithOtpFormSchema,
} from "@/schema/auth.schema";
import { cn } from "@/lib/utils";
import {
  requestPasswordReset,
  resetPasswordWithOtp,
  verifyResetOtp,
} from "@/actions/auth";

const passwordWrapperClass = (hasError: boolean) =>
  cn(
    "flex w-full items-center overflow-hidden rounded-lg border bg-transparent",
    hasError
      ? "border-destructive focus-within:ring-destructive/40 border-2"
      : "border-input",
  );

const passwordInputClass =
  "min-w-0 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0";

function ResetPasswordForm({ email }: Readonly<{ email: string }>) {
  const router = useRouter();
  const [showNewPasswordPlain, setShowNewPasswordPlain] = useState(false);
  const [showConfirmPasswordPlain, setShowConfirmPasswordPlain] =
    useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpFocusRequest, setOtpFocusRequest] = useState<{
    id: number;
    index: number;
  } | null>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<z.infer<typeof ResetPasswordWithOtpFormSchema>>({
    resolver: zodResolver(ResetPasswordWithOtpFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      d0: "",
      d1: "",
      d2: "",
      d3: "",
      d4: "",
      d5: "",
      password: "",
      confirmPassword: "",
    },
  });

  const focusOtpDigit = useCallback((index: number) => {
    otpInputRefs.current[index]?.focus();
  }, []);

  const queueOtpFocus = useCallback((index: number) => {
    setOtpFocusRequest((prev) => ({
      id: (prev?.id ?? 0) + 1,
      index,
    }));
  }, []);

  useEffect(() => {
    if (!otpFocusRequest) return;
    otpInputRefs.current[otpFocusRequest.index]?.focus();
  }, [otpFocusRequest]);

  const clearOtpFields = useCallback(() => {
    for (const name of OTP_FIELD_NAMES) {
      form.setValue(name, "");
    }
  }, [form]);

  const { isSubmitting } = form.formState;

  const handleResend = async () => {
    if (isResending) return;
    setIsResending(true);
    try {
      const result = await requestPasswordReset(email);
      if (result.ok) {
        toast.success("Code sent", { description: result.message });
        clearOtpFields();
        queueOtpFocus(0);
      } else {
        toast.error("Could not resend", { description: result.error });
      }
    } catch {
      toast.error("Could not resend", {
        description: "Network error. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (
    values: z.infer<typeof ResetPasswordWithOtpFormSchema>,
  ) => {
    try {
      // Step 1: verify OTP → get reset token
      const verifyResult = await verifyResetOtp({
        email,
        otp_code: joinOtpFormDigits(values),
      });

      if (!verifyResult.ok) {
        if (isInvalidResetOtpError(verifyResult.error)) {
          toast.error("Invalid or expired reset code", {
            description: verifyResult.error,
          });
          clearOtpFields();
          queueOtpFocus(0);
          return;
        }
        toast.error("Could not verify code", {
          description: verifyResult.error,
        });
        return;
      }

      // Step 2: use reset token to set new password
      const resetResult = await resetPasswordWithOtp({
        reset_token: verifyResult.resetToken,
        password: values.password,
      });

      if (!resetResult.ok) {
        // Token expired between steps — send user back to re-enter OTP
        if (isInvalidResetOtpError(resetResult.error)) {
          toast.error("Reset session expired", {
            description: "Please re-enter your code.",
          });
          clearOtpFields();
          queueOtpFocus(0);
          return;
        }
        toast.error("Could not update password", {
          description: resetResult.error,
        });
        return;
      }

      clearForgotResetStorage();
      await signOut({ redirect: false });
      toast.success("Password reset successful", {
        description: "Sign in with your new password.",
      });
      router.push("/login");
    } catch {
      toast.error("Could not update password", {
        description: "Network error. Please try again.",
      });
    }
  };
  return (
    <div className="space-y-4 py-8 sm:space-y-5">
      <h2 className="text-[20px] lg:text-[40px] font-medium text-[#152D58]">
        Create a new password
      </h2>
      <p className="text-foreground/70 text-[20px]">
        Enter the 6-digit code sent to{" "}
        <span className="text-foreground font-semibold">{email}</span> and Enter
        a new password to continue.
      </p>

      <Form {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit(onSubmit)(event);
          }}
          className="space-y-3 sm:space-y-4"
        >
          <div className="space-y-2">
            <label
              id="reset-code-label"
              className="text-foreground/80 text-xs font-semibold sm:text-sm"
            >
              Reset code
            </label>
            <div className="grid w-full grid-cols-6 gap-2 sm:gap-3">
              {OTP_FIELD_NAMES.map((name, i) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className="w-full min-w-0 space-y-0">
                      <FormControl>
                        <Input
                          {...field}
                          aria-label={`Reset code digit ${i + 1}`}
                          aria-describedby="reset-code-label"
                          ref={(el) => {
                            field.ref(el);
                            otpInputRefs.current[i] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={1}
                          disabled={isSubmitting}
                          onChange={(e) => {
                            const v = e.target.value
                              .replace(/\D/g, "")
                              .slice(-1);
                            field.onChange(v);
                            if (v && i < 5) focusOtpDigit(i + 1);
                          }}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Backspace" &&
                              !field.value &&
                              i > 0
                            ) {
                              focusOtpDigit(i - 1);
                            }
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                            const paste = e.clipboardData
                              .getData("text")
                              .replace(/\D/g, "")
                              .slice(0, 6);
                            if (!paste) return;
                            const next = { ...form.getValues() };
                            paste.split("").forEach((ch, j) => {
                              if (i + j < 6) {
                                next[OTP_FIELD_NAMES[i + j]] = ch;
                              }
                            });
                            form.reset(next);
                            focusOtpDigit(Math.min(i + paste.length, 5));
                          }}
                          className={cn(
                            "h-14 w-full min-w-0 rounded-md p-0 text-center text-lg font-bold sm:h-[66px] sm:rounded-lg sm:text-xl",
                            (form.formState.errors.d0 ||
                              form.formState.errors.d1 ||
                              form.formState.errors.d2 ||
                              form.formState.errors.d3 ||
                              form.formState.errors.d4 ||
                              form.formState.errors.d5) &&
                              "border-destructive",
                          )}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            {OTP_FIELD_NAMES.some((name) => form.formState.errors[name]) ? (
              <p className="text-destructive text-xs">
                {form.formState.errors.d0?.message ??
                  "Enter the full 6-digit code."}
              </p>
            ) : null}
            <p className="text-foreground/70 text-xs">
              Didn&apos;t get a code?{" "}
              <Button
                type="button"
                variant="link"
                disabled={isResending || isSubmitting}
                onClick={handleResend}
                className="text-primary hover:text-primary/90 h-auto p-0 text-xs font-bold"
              >
                Resend
              </Button>
            </p>
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              const pwd = field.value ?? "";
              const checks = getPasswordChecks(pwd);
              const showPasswordGuide = passwordFocused || pwd.length > 0;

              return (
                <FormItem>
                  <FormLabel className="text-foreground/80 text-xs font-semibold sm:text-sm">
                    New password
                  </FormLabel>
                  <FormControl>
                    <div
                      className={passwordWrapperClass(
                        !!form.formState.errors.password,
                      )}
                    >
                      <Input
                        type={showNewPasswordPlain ? "text" : "password"}
                        placeholder="Your new password"
                        disabled={isSubmitting}
                        autoComplete="new-password"
                        maxLength={128}
                        {...field}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => {
                          setPasswordFocused(false);
                          field.onBlur();
                        }}
                        className={passwordInputClass}
                      />
                      <button
                        type="button"
                        aria-label={
                          showNewPasswordPlain
                            ? "Hide password"
                            : "Show password"
                        }
                        disabled={isSubmitting}
                        className="text-foreground/45 hover:text-foreground/70 shrink-0 px-2.5 disabled:opacity-50 sm:px-3"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowNewPasswordPlain((v) => !v)}
                      >
                        {showNewPasswordPlain ? (
                          <EyeOff className="size-5" aria-hidden />
                        ) : (
                          <Eye className="size-5" aria-hidden />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  {showPasswordGuide ? (
                    <ul className="mt-3 space-y-2 pt-3">
                      {PASSWORD_RULE_ROWS.map(({ key, label }) => {
                        const met = checks[key];
                        return (
                          <li
                            key={key}
                            className="flex items-start gap-2.5 text-xs sm:text-[13px]"
                          >
                            <Check
                              aria-hidden
                              className={cn(
                                "mt-0.5 size-4 shrink-0 stroke-[2.5]",
                                met ? "text-primary" : "text-foreground/25",
                              )}
                            />
                            <span
                              className={cn(
                                "leading-snug",
                                met
                                  ? "text-primary font-medium"
                                  : "text-foreground/50",
                              )}
                            >
                              {label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80 text-xs font-semibold sm:text-sm">
                  Confirm password
                </FormLabel>
                <FormControl>
                  <div
                    className={passwordWrapperClass(
                      !!form.formState.errors.confirmPassword,
                    )}
                  >
                    <Input
                      type={showConfirmPasswordPlain ? "text" : "password"}
                      placeholder="Confirm your password"
                      disabled={isSubmitting}
                      autoComplete="new-password"
                      maxLength={128}
                      {...field}
                      className={passwordInputClass}
                    />
                    <button
                      type="button"
                      aria-label={
                        showConfirmPasswordPlain
                          ? "Hide password"
                          : "Show password"
                      }
                      disabled={isSubmitting}
                      className="text-foreground/45 hover:text-foreground/70 shrink-0 px-2.5 disabled:opacity-50 sm:px-3"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowConfirmPasswordPlain((v) => !v)}
                    >
                      {showConfirmPasswordPlain ? (
                        <EyeOff className="size-5" aria-hidden />
                      ) : (
                        <Eye className="size-5" aria-hidden />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-auto w-full rounded-lg py-2.5 text-sm font-bold sm:py-3 sm:text-base"
          >
            {isSubmitting ? "Updating..." : "Reset password"}
          </Button>
        </form>
      </Form>

      <Link
        href="/login"
        className="text-foreground/70 flex justify-center text-sm hover:underline"
      >
        Back to log in
      </Link>
    </div>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const email = useSyncExternalStore(
    subscribeToForgotResetStorage,
    getForgotResetEmail,
    () => null,
  );

  useEffect(() => {
    if (email === null) {
      router.replace("/forgot-password");
    }
  }, [email, router]);

  if (!email) {
    return null;
  }

  return <ResetPasswordForm email={email} />;
}
