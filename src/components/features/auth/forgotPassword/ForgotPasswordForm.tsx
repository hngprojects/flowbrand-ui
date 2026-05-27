"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { requestPasswordReset } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setForgotResetEmail } from "@/lib/forgot-password-storage";
import { cn } from "@/lib/utils";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    try {
      const result = await requestPasswordReset(values.email);
      if (!result.ok) {
        toast.error("Could not send reset code", { description: result.error });
        return;
      }

      setForgotResetEmail(values.email.trim());
      toast.success(result.message);
      router.push("/reset-password");
    } catch {
      toast.error("Could not send reset code", {
        description: "Network error. Please try again.",
      });
    }
  };

  const emailError = form.formState.errors.email?.message;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 py-4 sm:space-y-5"
    >
      <div className="space-y-1.5">
        <h2 className="text-xl font-medium text-brand-deep  sm:text-4xl">
          Forgot your password?
        </h2>
        <p className="text-foreground/70 text-sm sm:text-base">
          Enter your email and we&apos;ll send you a 6-digit reset code.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="forgot-email"
          className="block text-sm font-medium text-brand-deep "
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
        {form.formState.isSubmitting ? "Sending..." : "Send reset code"}
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
