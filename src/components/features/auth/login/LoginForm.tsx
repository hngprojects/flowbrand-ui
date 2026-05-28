"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getCsrfToken,
  getProviders,
  signIn,
  useSession,
} from "next-auth/react";
import {
  type ChangeEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { useForm, useWatch, type UseFormRegisterReturn } from "react-hook-form";
import * as z from "zod";
import { LoginSchema } from "@/schema/auth.schema";
import { usePostAuthRedirect } from "@/hooks/use-post-auth-redirect";
import { resendOtp } from "@/actions/auth";
import { isResendOtpSuccess } from "@/lib/auth-action-results";
import {
  EMAIL_VERIFICATION_REQUIRED_MESSAGE,
  getLoginErrorMessage,
  isSignInFailure,
  isSignInVerificationRequired,
} from "@/lib/login-errors";
import {
  setRegisterVerifyCooldown,
  setRegisterVerifyEmail,
} from "@/lib/register-verify-storage";
import { cn } from "@/lib/utils";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { getGoogleOAuthUrl } from "~/actions/auth";
import GoogleLogo from "@/components/icons/googleIcon";

type LoginValues = z.infer<typeof LoginSchema>;

const LOGIN_ERROR_MESSAGE = "Unable to sign in. Please try again.";

function AuthField({
  id,
  label,
  placeholder,
  type,
  error,
  showToggle,
  showPassword,
  onTogglePassword,
  register,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  type: "email" | "password" | "text";
  error?: string;
  showToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  register: UseFormRegisterReturn;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) {
  const resolvedType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm leading-[150%] font-medium text-primary-900 sm:text-base"
      >
        {label}
      </label>

      <div
        className={cn(
          "flex h-11 items-center rounded-lg border border-input bg-white px-2.5 transition-colors focus-within:border-primary sm:px-4",
          error && "border-secondary focus-within:border-secondary",
        )}
      >
        <Input
          id={id}
          type={resolvedType}
          autoComplete={type === "email" ? "email" : "current-password"}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-full w-full border-0 bg-transparent p-0 text-sm leading-[150%] text-[#030D1F] outline-none placeholder:text-[#A2A2A2] focus-visible:ring-0 focus-visible:ring-offset-0"
          {...register}
          onChange={(event) => {
            register.onChange(event);
            onChange?.(event);
          }}
        />

        {showToggle ? (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={onTogglePassword}
            className="ml-2 flex size-6 shrink-0 items-center justify-center text-[#CFCFCF]"
          >
            {showPassword ? (
              <Eye className="size-6" strokeWidth={1.8} />
            ) : (
              <EyeOff className="size-6" strokeWidth={1.8} />
            )}
          </button>
        ) : null}
      </div>

      {error ? (
        <p
          id={`${id}-error`}
          className="text-sm leading-[20px] font-normal text-secondary sm:text-xs sm:leading-[18px] sm:font-medium"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated =
    status === "authenticated" &&
    session?.invalid !== true &&
    !!session?.user?.id;
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onSubmit",
  });

  usePostAuthRedirect();

  useEffect(() => {
    void Promise.all([getCsrfToken(), getProviders()]);
    router.prefetch("/register/verify");
  }, [router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("google_error")) {
      return;
    }
    toast.error("Google sign-in failed", {
      description: "Please try again or use email and password.",
    });
    params.delete("google_error");
    const nextQuery = params.toString();
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash}`,
    );
  }, []);

  const isBusy = form.formState.isSubmitting || isAuthenticated;
  const rememberMe =
    useWatch({
      control: form.control,
      name: "rememberMe",
    }) ?? false;

  const redirectToEmailVerification = useCallback(
    (email: string) => {
      const trimmed = email.trim();
      if (!trimmed) return;

      setRegisterVerifyEmail(trimmed);
      router.replace("/register/verify");

      void (async () => {
        const otpResult = await resendOtp(trimmed);

        if (isResendOtpSuccess(otpResult)) {
          if (otpResult.cooldownSeconds) {
            setRegisterVerifyCooldown(otpResult.cooldownSeconds);
          }
          toast.info("Verification code sent", {
            description:
              otpResult.message ??
              "Check your email for a 6-digit code, then enter it below.",
          });
        } else if (
          "cooldownSeconds" in otpResult &&
          otpResult.cooldownSeconds
        ) {
          setRegisterVerifyCooldown(otpResult.cooldownSeconds);
        }
      })();
    },
    [router],
  );

  const onSubmit = async (values: LoginValues) => {
    try {
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe ?? false,
        redirect: false,
      });

      if (isSignInFailure(response)) {
        if (isSignInVerificationRequired(response, response?.url)) {
          toast.info("Verify your email", {
            description: EMAIL_VERIFICATION_REQUIRED_MESSAGE,
          });
          redirectToEmailVerification(values.email);
          return;
        }

        toast.error("Could not sign in", {
          description: getLoginErrorMessage(response),
        });
        return;
      }

      toast.success("Signed in successfully");

      // Session updates after signIn; usePostAuthRedirect handles navigation.
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Login failed", error);
      }
      toast.error("Could not sign in", {
        description: LOGIN_ERROR_MESSAGE,
      });
    }
  };

  const emailRegistration = form.register("email");
  const passwordRegistration = form.register("password");
  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <div className="space-y-4 py-8 sm:space-y-5">
      <div className="space-y-1.5 sm:space-y-2">
        <h1 className="text-xl font-medium text-primary-900 sm:text-4xl">
          Welcome back
        </h1>
        <p className="text-foreground/70 text-sm sm:text-[24px]">
          Log in to keep building your marketing strategy.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-5"
      >
        <AuthField
          id="email-input"
          label="Email address"
          placeholder="you@gmail.com"
          type="email"
          error={emailError}
          register={emailRegistration}
          onChange={() => form.clearErrors("email")}
        />

        <div className="space-y-3">
          <AuthField
            id="password-input"
            label="Password"
            placeholder="Your password"
            type="password"
            error={passwordError}
            showToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((current) => !current)}
            register={passwordRegistration}
            onChange={() => form.clearErrors("password")}
          />

          <div className="flex items-center justify-between gap-4">
            <label className="text-foreground/70 flex items-center gap-2 text-sm">
              <Checkbox
                checked={rememberMe}
                disabled={isBusy}
                onCheckedChange={(checked) => {
                  form.setValue("rememberMe", checked === true, {
                    shouldDirty: true,
                  });
                }}
              />
              <span>Remember me</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary-600"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isBusy}
          className="h-auto w-full rounded-lg py-2.5 text-sm font-bold sm:py-3 sm:text-base"
        >
          Log in
        </Button>
      </form>

      <div className="relative flex items-center justify-center py-2">
        <div className="border-border w-full border-t" />
        <span className="bg-background text-foreground/45 absolute px-2 text-xs">
          OR
        </span>
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={isBusy}
        onClick={async () => {
          if (isBusy) {
            return;
          }

          const url = await getGoogleOAuthUrl();
          window.location.href = url;
        }}
        className="h-auto w-full gap-2 rounded-lg py-2.5 text-sm font-semibold sm:py-3"
      >
        <GoogleLogo className="size-4" />
        Continue with Google
      </Button>

      <p className="text-foreground/70 text-center text-xs sm:text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-bold text-primary-900 hover:underline"
        >
          Create an account
        </Link>
      </p>

      <p className="text-foreground/50 px-4 text-center text-[10px]">
        By logging in, you agree to our{" "}
        <Link href="/terms-and-conditions" className="text-primary underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy" className="text-primary underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
