"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { readAdminSession, writeAdminSession } from "@/lib/admin-session";
import { ADMIN_ROUTE } from "@/routes";

const AdminLoginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type AdminLoginValues = z.infer<typeof AdminLoginSchema>;

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (readAdminSession()) {
      router.replace(ADMIN_ROUTE);
    }
  }, []);

  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(AdminLoginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values: AdminLoginValues) => {
    // TODO: Replace with POST /api/admin/auth/login when backend is ready.
    try {
      writeAdminSession(values.email);
      toast.success("Signed in to admin portal");
      const callbackUrl =
        searchParams.get("callbackUrl")?.trim() || ADMIN_ROUTE;
      router.replace(
        callbackUrl.startsWith("/admin") ? callbackUrl : ADMIN_ROUTE,
      );
    } catch {
      toast.error("Could not sign in. Please try again.");
    }
  };

  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;
  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="w-full max-w-[568px] flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-primary-900 md:text-[48px] max-w-[400px]">
          Admin Portal Login
        </h1>
        <p className="mt-2 text-sm text-black-300 font-[300] md:text-[24px]">
          Log in to manage teams and logs
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5 w-full"
      >
        <div className="space-y-2">
          <label
            htmlFor="admin-email"
            className="text-[16px] font-[500] text-black-500"
          >
            Email address
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            placeholder="you@gmail.com"
            aria-invalid={!!emailError}
            className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm text-black-500 outline-none transition-colors focus:border-primary"
            {...form.register("email")}
          />
          {emailError ? (
            <p className="text-sm text-secondary">{emailError}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="admin-password"
            className="text-[16px] font-[500] text-black-500"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Your password"
              aria-invalid={!!passwordError}
              className="h-12 w-full rounded-lg border border-gray-300 px-4 pr-12 text-sm text-black-500 outline-none transition-colors focus:border-primary"
              {...form.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-3 flex items-center text-neutral-400"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye className="size-5" />
              ) : (
                <EyeOff className="size-5" />
              )}
            </button>
          </div>
          {passwordError ? (
            <p className="text-sm text-secondary">{passwordError}</p>
          ) : null}
        </div>

        <Link
          href="/forgot-password"
          className="text-sm font-medium text-primary hover:underline"
        >
          Forgot password?
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-12 w-full rounded-lg bg-primary text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Log in"}
        </button>
      </form>
    </div>
  );
}
