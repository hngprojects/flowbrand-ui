"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { resetPasswordWithToken } from "~/actions/auth";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  getPasswordChecks,
  PASSWORD_RULE_ROWS,
  ResetPasswordSchema,
} from "@/schema/auth.schema";
import { cn } from "@/lib/utils";

const inputClassWithError = (hasError: boolean) => {
  return cn(
    "rounded-lg px-2.5 py-2 text-sm sm:px-3 sm:py-2.5",
    hasError &&
      "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/40 border-2",
  );
};

const InvalidResetLink = () => (
  <div className="space-y-4 py-8 sm:space-y-5">
    <div className="space-y-1.5 sm:space-y-2">
      <h2 className="text-xl font-medium text-[#152D58] sm:text-4xl">
        Invalid reset link
      </h2>
      <p className="text-foreground/70 text-sm sm:text-[15px]">
        This password reset link is invalid or has expired. Please request a new
        one.
      </p>
    </div>
  </div>
);

const ResetPasswordSuccess = () => (
  <div className="flex flex-col items-center space-y-6 py-8 text-center sm:space-y-8 sm:py-10">
    <div className="bg-primary/10 border-border flex h-12 w-12 items-center justify-center rounded-full border sm:h-14 sm:w-14">
      <Check
        className="text-primary size-6 stroke-[2.5] sm:size-7"
        aria-hidden
      />
    </div>

    <div className="space-y-1.5 sm:space-y-2">
      <h2 className="text-xl font-medium text-[#152D58] sm:text-3xl">
        Password reset successful
      </h2>
      <p className="text-foreground/70 mx-auto max-w-md text-sm leading-relaxed sm:text-[15px]">
        Your password has been updated. You can now log in with your new
        password.
      </p>
    </div>

    <Button
      asChild
      className="h-auto w-full rounded-lg py-2.5 text-sm font-bold sm:py-3 sm:text-base"
    >
      <Link href="/login">Continue to log in</Link>
    </Button>
  </div>
);

const CreateNewPasswordForm = ({ token }: Readonly<{ token: string }>) => {
  const [resetComplete, setResetComplete] = useState(false);
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
        token,
        password: values.password,
      });
      if (result.ok) {
        setResetComplete(true);
        return;
      }
      toast.error("Could not update password", {
        description: result.error,
      });
    } catch {
      toast.error("Could not update password", {
        description: "Please try again.",
      });
    }
  };

  if (resetComplete) {
    return <ResetPasswordSuccess />;
  }

  return (
    <div className="space-y-4 py-8 sm:space-y-5">
      <div className="bg-primary/10 text-primary inline-block max-w-fit rounded-full px-2.5 py-0.5 text-[10px] font-medium sm:px-3 sm:py-1 sm:text-xs">
        Password recovery
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <h2 className="text-xl font-medium text-[#152D58] sm:text-4xl">
          Create a new password
        </h2>
        <p className="text-foreground/70 text-sm sm:text-[15px]">
          Enter a new password to continue
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
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
                    <div className="relative">
                      <Input
                        type={showNewPasswordPlain ? "text" : "password"}
                        placeholder="Your new password"
                        disabled={isSubmitting}
                        autoComplete="new-password"
                        {...field}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => {
                          setPasswordFocused(false);
                          field.onBlur();
                        }}
                        className={cn(
                          inputClassWithError(!!form.formState.errors.password),
                          "pr-10",
                        )}
                      />
                      <button
                        type="button"
                        aria-label={
                          showNewPasswordPlain
                            ? "Hide password"
                            : "Show password"
                        }
                        disabled={isSubmitting}
                        className="text-foreground/45 hover:text-foreground/70 absolute inset-y-0 right-0 flex items-center pr-2.5 disabled:opacity-50 sm:pr-3"
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
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                      showPasswordGuide ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div
                        className={cn(
                          "transition-opacity duration-300 ease-out motion-reduce:transition-none",
                          showPasswordGuide ? "opacity-100" : "opacity-0",
                        )}
                        aria-hidden={!showPasswordGuide}
                      >
                        <p className="text-foreground/50 mt-2 text-xs">
                          Use 8+ characters with uppercase, lowercase, and a
                          symbol from @, #, $, or %
                        </p>
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
                      </div>
                    </div>
                  </div>
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
                  <div className="relative">
                    <Input
                      type={showConfirmPasswordPlain ? "text" : "password"}
                      placeholder="Confirm your password"
                      disabled={isSubmitting}
                      autoComplete="new-password"
                      {...field}
                      className={cn(
                        inputClassWithError(
                          !!form.formState.errors.confirmPassword,
                        ),
                        "pr-10",
                      )}
                    />
                    <button
                      type="button"
                      aria-label={
                        showConfirmPasswordPlain
                          ? "Hide password"
                          : "Show password"
                      }
                      disabled={isSubmitting}
                      className="text-foreground/45 hover:text-foreground/70 absolute inset-y-0 right-0 flex items-center pr-2.5 disabled:opacity-50 sm:pr-3"
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
            Done
          </Button>
        </form>
      </Form>
    </div>
  );
};

const CreateNewPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  if (!token) {
    return <InvalidResetLink />;
  }

  return <CreateNewPasswordForm token={token} />;
};

export default CreateNewPassword;
