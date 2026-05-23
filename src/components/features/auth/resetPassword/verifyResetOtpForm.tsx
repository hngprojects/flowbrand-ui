"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { requestPasswordReset, verifyResetOtp } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  clearForgotResetStorage,
  setForgotResetToken,
} from "@/lib/forgot-password-storage";
import { isInvalidResetOtpError } from "@/lib/password-reset-errors";
import { OtpFormSchema, OTP_FIELD_NAMES } from "@/schema/auth.schema";
import { cn } from "@/lib/utils";

export function VerifyResetOtpForm({ email }: Readonly<{ email: string }>) {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [otpFocusRequest, setOtpFocusRequest] = useState<{
    id: number;
    index: number;
  } | null>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<z.infer<typeof OtpFormSchema>>({
    resolver: zodResolver(OtpFormSchema),
    mode: "onChange",
    defaultValues: {
      d0: "",
      d1: "",
      d2: "",
      d3: "",
      d4: "",
      d5: "",
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
    if (isResending || isSubmitting) return;
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

  const onSubmit = async (values: z.infer<typeof OtpFormSchema>) => {
    const otp_code = OTP_FIELD_NAMES.map((name) => values[name]).join("");
    try {
      const result = await verifyResetOtp({ email, otp_code });
      if (!result.ok) {
        if (isInvalidResetOtpError(result.error)) {
          toast.error("Invalid code", { description: result.error });
          clearOtpFields();
          queueOtpFocus(0);
          return;
        }
        toast.error("Verification failed", { description: result.error });
        return;
      }

      setForgotResetToken(result.resetToken);
      toast.success("Code verified", {
        description: result.message ?? "Set your new password.",
      });
      router.push("/reset-password");
    } catch {
      toast.error("Verification failed", {
        description: "Network error. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-4 py-8 sm:space-y-5">
      <h2 className="text-[20px] font-medium text-[#152D58] lg:text-[40px]">
        Enter reset code
      </h2>
      <p className="text-foreground/70 text-[20px]">
        We sent a 6-digit code to{" "}
        <span className="text-foreground font-semibold">{email}</span>
      </p>

      <Form {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit(onSubmit)(event);
          }}
          className="space-y-4"
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
                            OTP_FIELD_NAMES.some(
                              (n) => form.formState.errors[n],
                            ) && "border-destructive",
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

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-auto w-full rounded-lg py-2.5 text-sm font-bold sm:py-3 sm:text-base"
          >
            {isSubmitting ? "Verifying..." : "Verify code"}
          </Button>
        </form>
      </Form>

      <button
        type="button"
        className="text-foreground/70 text-sm hover:underline"
        onClick={() => {
          clearForgotResetStorage();
          router.push("/forgot-password");
        }}
      >
        Use a different email
      </button>

      <Link
        href="/login"
        className="text-foreground/70 flex justify-center text-sm hover:underline"
      >
        Back to log in
      </Link>
    </div>
  );
}
