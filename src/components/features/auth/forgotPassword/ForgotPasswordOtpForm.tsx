"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { requestPasswordReset, verifyResetOtp } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  setForgotResetToken,
  clearForgotResetToken,
} from "@/lib/forgot-password-storage";
import { isInvalidResetOtpError } from "@/lib/password-reset-errors";
import {
  joinOtpFormDigits,
  OTP_FIELD_NAMES,
  OtpFormSchema,
} from "@/schema/auth.schema";
import { cn } from "@/lib/utils";

type Props = Readonly<{ email: string }>;

const ForgotPasswordOtpForm = ({ email }: Props) => {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<z.infer<typeof OtpFormSchema>>({
    resolver: zodResolver(OtpFormSchema),
    defaultValues: {
      d0: "",
      d1: "",
      d2: "",
      d3: "",
      d4: "",
      d5: "",
    },
    mode: "onChange",
  });

  const otpValues = useWatch({ control: form.control });
  const isOtpComplete = OtpFormSchema.safeParse(otpValues).success;

  const focusDigit = useCallback((index: number) => {
    inputRefs.current[index]?.focus();
  }, []);

  const clearOtpFields = useCallback(() => {
    for (const name of OTP_FIELD_NAMES) {
      form.setValue(name, "");
    }
    focusDigit(0);
  }, [form, focusDigit]);

  const onConfirm = () => {
    void form.handleSubmit(async (data) => {
      setIsVerifying(true);
      try {
        const result = await verifyResetOtp({
          email,
          otp_code: joinOtpFormDigits(data),
        });

        if (!result.ok) {
          if (isInvalidResetOtpError(result.error)) {
            toast.error("Invalid or expired reset code", {
              description: result.error,
            });
            clearOtpFields();
            return;
          }
          toast.error("Could not verify code", { description: result.error });
          return;
        }

        // Persist the short-lived reset token; the next page will consume it.
        setForgotResetToken(result.resetToken);
        toast.success("Code verified", {
          description: "Now create your new password.",
        });
        router.push("/reset-password");
      } catch {
        toast.error("Could not verify code", {
          description: "Network error. Please try again.",
        });
      } finally {
        setIsVerifying(false);
      }
    })();
  };

  const handleResend = async () => {
    if (isResending) return;
    setIsResending(true);
    try {
      // A new code invalidates any previously issued reset_token.
      clearForgotResetToken();
      const result = await requestPasswordReset(email);
      if (result.ok) {
        toast.success("Code sent", { description: result.message });
        clearOtpFields();
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

  // Auto-focus the first input on mount.
  useEffect(() => {
    focusDigit(0);
  }, [focusDigit]);

  return (
    <div className="-mt-50 flex h-full flex-col justify-center space-y-5 sm:space-y-6 lg:-mt-0">
      <div className="bg-primary/10 text-primary inline-block max-w-fit rounded-full px-2.5 py-0.5 text-[10px] font-medium sm:px-3 sm:py-1 sm:text-xs">
        OTP has been sent
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <h2 className="text-xl font-medium text-[#152D58] sm:text-4xl">
          Verify your reset code
        </h2>
        <p className="text-foreground/70 text-sm sm:text-[15px]">
          We sent a 6-digit code to{" "}
          <span className="border-border text-foreground border-b font-semibold">
            {email || "your email"}
          </span>
        </p>
      </div>

      <Form {...form}>
        <div
          className="grid w-full grid-cols-6 gap-2 sm:gap-3"
          aria-label="6-digit reset code"
        >
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
                      ref={(el) => {
                        field.ref(el);
                        inputRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      disabled={isVerifying}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(-1);
                        field.onChange(v);
                        if (v && i < 5) focusDigit(i + 1);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !field.value && i > 0) {
                          focusDigit(i - 1);
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
                        focusDigit(Math.min(i + paste.length, 5));
                      }}
                      className="h-14 w-full min-w-0 rounded-md p-0 text-center text-lg font-bold sm:h-[66px] sm:rounded-lg sm:text-xl"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>
      </Form>

      <div className="space-y-3 sm:space-y-4">
        <p className="text-foreground/70 text-center text-xs sm:text-sm">
          Didn&apos;t get a code?{" "}
          <Button
            type="button"
            variant="link"
            disabled={isVerifying || isResending}
            onClick={handleResend}
            className="text-primary hover:text-primary/90 h-auto p-0 font-bold disabled:opacity-40"
          >
            Resend
          </Button>
        </p>

        <Button
          type="button"
          disabled={!isOtpComplete || isVerifying}
          variant={isOtpComplete ? "default" : "outline"}
          onClick={onConfirm}
          className={cn(
            "h-auto w-full rounded-lg py-2.5 text-sm font-bold sm:py-3 sm:text-base",
            !isOtpComplete &&
              "border-border bg-border/50 text-foreground/45 hover:border-border hover:!bg-border/55 hover:!text-foreground/45",
          )}
        >
          {isVerifying ? "Verifying..." : "Next"}
        </Button>

        <Link
          href="/login"
          className="text-foreground/70 flex w-full items-center justify-center gap-2 text-xs sm:text-sm"
        >
          <ArrowLeft size={16} />
          Back to Log In
        </Link>
      </div>
    </div>
  );
};

export { ForgotPasswordOtpForm };
export default ForgotPasswordOtpForm;
