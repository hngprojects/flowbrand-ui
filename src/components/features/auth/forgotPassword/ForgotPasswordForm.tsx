"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { requestPasswordReset } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    try {
      await requestPasswordReset(values.email);
      setSubmittedEmail(values.email);
      setSubmitted(true);
    } catch {
      toast.error("Could not send reset link", {
        description: "Please try again.",
      });
    }
  };

  if (submitted) {
    return (
      <div className="space-y-4 py-4 text-center">
        <h2 className="text-xl font-medium text-[#152D58] sm:text-2xl">
          Check your email
        </h2>
        <p className="text-foreground/70 text-sm">
          If an account exists for <strong>{submittedEmail}</strong>, we sent a
          password reset link.
        </p>
        <Button asChild className="mt-4 w-full">
          <Link href="/login">Back to log in</Link>
        </Button>
      </div>
    );
  }

  const emailError = form.formState.errors.email?.message;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 py-4 sm:space-y-5"
    >
      <div className="space-y-1.5">
        <h2 className="text-xl font-medium text-[#152D58] sm:text-4xl">
          Forgot your password?
        </h2>
        <p className="text-foreground/70 text-sm sm:text-base">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="forgot-email"
          className="block text-sm font-medium text-[#152D58]"
        >
          Email address
        </label>
        <Input
          id="forgot-email"
          type="email"
          placeholder="you@gmail.com"
          autoComplete="email"
          className={cn(emailError && "border-destructive")}
          {...form.register("email")}
        />
        {emailError ? (
          <p className="text-destructive text-xs">{emailError}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="h-auto w-full rounded-lg py-2.5 text-sm font-bold"
      >
        {form.formState.isSubmitting ? "Sending..." : "Send reset link"}
      </Button>

      <Link
        href="/login"
        className="text-foreground/70 flex justify-center text-sm hover:underline"
      >
        Back to log in
      </Link>
    </form>
  );
}
