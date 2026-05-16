"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { registerUser } from "~/actions/auth";
import GoogleLogo from "~/components/icons/google-logo";
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
import { Select } from "~/components/ui/select";
import {
  getPasswordChecks,
  PASSWORD_RULE_ROWS,
  RegistrationFormSchema,
  splitFullNameForRegister,
} from "~/schemas";
import { COUNTRY_OPTIONS } from "~/lib/countries";
import { REGISTER_VERIFY_EMAIL_STORAGE_KEY } from "~/lib/register-verify-storage";
import { cn } from "~/utils";

const inputClassWithError = (hasError: boolean) => {
  return cn(
    "rounded-lg px-2.5 py-2 text-sm sm:px-3 sm:py-2.5",
    hasError &&
      "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/40 border-2",
  );
};

const RegistrationForm = () => {
  const router = useRouter();
  const { status } = useSession();
  const [showPasswordPlain, setShowPasswordPlain] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const form = useForm<z.infer<typeof RegistrationFormSchema>>({
    resolver: zodResolver(RegistrationFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      full_name: "",
      email: "",
      country: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const onSubmit = async (values: z.infer<typeof RegistrationFormSchema>) => {
    try {
      const { first_name, last_name } = splitFullNameForRegister(
        values.full_name,
      );
      const data = await registerUser({
        first_name,
        last_name,
        email: values.email,
        country: values.country,
        password: values.password,
      });
      const isSuccess = data.ok && data.status === 201;
      const errorDescription = !data.ok
        ? data.error
        : !isSuccess
          ? "Registration could not be completed."
          : undefined;

      toast[isSuccess ? "success" : "error"](
        isSuccess ? "Account created successfully" : "An error occurred",
        {
          description: isSuccess
            ? "Verify your email with the code we sent"
            : errorDescription,
        },
      );

      if (isSuccess) {
        sessionStorage.setItem(REGISTER_VERIFY_EMAIL_STORAGE_KEY, values.email);
        router.push("/register/verify");
      }
    } catch {
      toast.error("An error occurred", {
        description: "Please try again.",
      });
    }
  };

  return (
    <div className="max-h-screen space-y-4 py-8 sm:space-y-5">
      <div className="bg-primary/10 text-foreground inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium sm:px-3 sm:py-1 sm:text-xs">
        No marketing experience needed
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <h2 className="text-xl font-medium text-[#152D58] sm:text-4xl">
          Start building your first marketing strategy
        </h2>
        <p className="text-foreground/70 text-sm sm:text-[24px]">
          Create your free FlowBrand account and launch your first campaign in
          under 10 minutes.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 sm:space-y-4"
        >
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80 text-xs font-semibold sm:text-sm">
                  Full name
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    disabled={isSubmitting}
                    {...field}
                    className={inputClassWithError(
                      !!form.formState.errors.full_name,
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80 text-xs font-semibold sm:text-sm">
                  Email address
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@gmail.com"
                    disabled={isSubmitting}
                    {...field}
                    className={inputClassWithError(
                      !!form.formState.errors.email,
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80 text-xs font-semibold sm:text-sm">
                  Country
                </FormLabel>
                <FormControl>
                  <Select
                    disabled={isSubmitting}
                    {...field}
                    className={inputClassWithError(
                      !!form.formState.errors.country,
                    )}
                  >
                    {COUNTRY_OPTIONS.map((c) => (
                      <option
                        key={c.value === "" ? "_placeholder" : c.value}
                        value={c.value}
                      >
                        {c.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPasswordPlain ? "text" : "password"}
                        placeholder="Your password"
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
                          showPasswordPlain ? "Hide password" : "Show password"
                        }
                        disabled={isSubmitting}
                        className="text-foreground/45 hover:text-foreground/70 absolute inset-y-0 right-0 flex items-center pr-2.5 disabled:opacity-50 sm:pr-3"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowPasswordPlain((v) => !v)}
                      >
                        {showPasswordPlain ? (
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

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-auto w-full rounded-lg py-2.5 text-sm font-bold sm:py-3 sm:text-base"
          >
            Create account
          </Button>
        </form>
      </Form>

      <div className="relative flex items-center justify-center py-2">
        <div className="border-border w-full border-t" />
        <span className="bg-background text-foreground/45 absolute px-2 text-xs">
          OR
        </span>
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={isSubmitting || status === "authenticated"}
        onClick={() => signIn("google", { redirectTo: "/dashboard" })}
        className="h-auto w-full gap-2 rounded-lg py-2.5 text-sm font-semibold sm:py-3"
      >
        <GoogleLogo className="size-4" />
        Continue with Google
      </Button>

      <p className="text-foreground/70 text-center text-xs sm:text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary hover:text-accent font-bold hover:underline"
        >
          Log in
        </Link>
      </p>

      <p className="text-foreground/50 px-4 pb-4 text-center text-[10px]">
        By signing up you agree to our{" "}
        <Link
          href="/terms-and-conditions"
          className="text-primary hover:text-accent underline"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy-policy"
          className="text-primary hover:text-accent underline"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
};

export { RegistrationForm as RegisterForm };
export default RegistrationForm;
