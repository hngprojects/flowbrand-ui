"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useSyncExternalStore, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { resetPasswordWithToken } from "@/actions/auth";
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
import { usePostAuthRedirect } from "@/hooks/use-post-auth-redirect";
import {
  getForgotResetEmail,
  getForgotResetToken,
  subscribeToForgotResetStorage,
} from "@/lib/forgot-password-storage";
import { isSignInFailure, getLoginErrorMessage } from "@/lib/login-errors";
import {
  getPasswordChecks,
  PASSWORD_RULE_ROWS,
  ResetPasswordSchema,
} from "@/schema/auth.schema";
import { cn } from "@/lib/utils";

const passwordWrapperClass = (hasError: boolean) =>
  cn(
    "flex w-full items-center overflow-hidden rounded-lg border bg-transparent",
    hasError
      ? "border-destructive focus-within:ring-destructive/40 border-2"
      : "border-input",
  );

const passwordInputClass =
  "min-w-0 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0";

function ResetPasswordForm({
  email,
  resetToken,
}: Readonly<{ email: string; resetToken: string }>) {
  const router = useRouter();
  const [showNewPasswordPlain, setShowNewPasswordPlain] = useState(false);
  const [showConfirmPasswordPlain, setShowConfirmPasswordPlain] =
    useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    try {
      const result = await resetPasswordWithToken({
        reset_token: resetToken,
        password: values.password,
      });

      if (!result.ok) {
        toast.error("Could not update password", {
          description: result.error,
        });
        return;
      }

      const signInResult = await signIn("access-token", {
        accessToken: result.accessToken,
        redirect: false,
      });

      if (isSignInFailure(signInResult)) {
        toast.error("Password updated", {
          description: `${getLoginErrorMessage(signInResult)} Please sign in with your new password.`,
        });
        router.push("/login");
        return;
      }

      toast.success("Password reset successful", {
        description: result.message ?? "You have been automatically logged in.",
      });
      // usePostAuthRedirect on the page handles navigation after session is ready
    } catch {
      toast.error("Could not update password", {
        description: "Network error. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-4 py-8 sm:space-y-5">
      <h2 className="text-[20px] font-medium text-[#152D58] lg:text-[40px]">
        Create a new password
      </h2>
      <p className="text-foreground/70 text-[20px]">
        Choose a new password for{" "}
        <span className="text-foreground font-semibold">{email}</span>
      </p>

      <Form {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit(onSubmit)(event);
          }}
          className="space-y-3 sm:space-y-4"
        >
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
  const resetToken = useSyncExternalStore(
    subscribeToForgotResetStorage,
    getForgotResetToken,
    () => null,
  );

  usePostAuthRedirect();

  useEffect(() => {
    if (email === null) {
      router.replace("/forgot-password");
      return;
    }
    if (!resetToken) {
      router.replace("/verify-reset-otp");
    }
  }, [email, resetToken, router]);

  if (!email || !resetToken) {
    return null;
  }

  return <ResetPasswordForm email={email} resetToken={resetToken} />;
}
