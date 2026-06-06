"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { acceptTeamInvitation } from "@/lib/admin-invite-api";
import { readAdminSession } from "@/lib/admin-session";
import {
  ACCEPT_INVITE_ROUTE,
  ADMIN_LOGIN_ROUTE,
  ADMIN_TEAMS_ROUTE,
} from "@/routes";

const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const NewAccountAcceptSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name must be under 100 characters."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(
        PASSWORD_PATTERN,
        "Use uppercase, lowercase, a number, and a symbol.",
      ),
    confirm_password: z.string().min(1, "Confirm your password."),
  })
  .refine((values) => values.password === values.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

type NewAccountAcceptValues = z.infer<typeof NewAccountAcceptSchema>;

export function AcceptInviteView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const [isAccepting, setIsAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [teamName, setTeamName] = useState<string | null>(null);

  const session = useMemo(() => readAdminSession(), []);
  const loginHref = `${ADMIN_LOGIN_ROUTE}?callbackUrl=${encodeURIComponent(
    token
      ? `${ACCEPT_INVITE_ROUTE}?token=${encodeURIComponent(token)}`
      : ACCEPT_INVITE_ROUTE,
  )}`;

  const form = useForm<NewAccountAcceptValues>({
    resolver: zodResolver(NewAccountAcceptSchema),
    defaultValues: {
      full_name: "",
      password: "",
      confirm_password: "",
    },
    mode: "onSubmit",
  });

  async function handleAccept(payload?: NewAccountAcceptValues) {
    if (!token || isAccepting) return;

    setIsAccepting(true);
    try {
      const result = await acceptTeamInvitation({
        token,
        full_name: payload?.full_name,
        password: payload?.password,
        confirm_password: payload?.confirm_password,
      });

      setTeamName(result.teamName ?? null);
      setAccepted(true);
      toast.success(result.message ?? "Invitation accepted.");

      if (readAdminSession()) {
        router.replace(ADMIN_TEAMS_ROUTE);
      } else {
        router.replace(loginHref);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not accept the invitation.",
      );
    } finally {
      setIsAccepting(false);
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-[520px] rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-primary-900">
          Invalid invitation link
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          This invite link is missing a token. Ask your team admin to send a new
          invitation.
        </p>
        <Link
          href={ADMIN_LOGIN_ROUTE}
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-primary px-6 text-sm font-semibold text-white"
        >
          Go to admin login
        </Link>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="w-full max-w-[520px] rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-primary-900">
          You&apos;re in{teamName ? ` — ${teamName}` : ""}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Your team invitation was accepted. Redirecting to the admin portal…
        </p>
        <Link
          href={ADMIN_TEAMS_ROUTE}
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-primary px-6 text-sm font-semibold text-white"
        >
          View teams
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[520px] rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-primary-900">
          Accept team invitation
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Join your admin team to access the portal.
        </p>
      </div>

      {session ? (
        <div className="space-y-4">
          <p className="rounded-lg bg-primary-50 px-4 py-3 text-sm text-neutral-700">
            Signed in as{" "}
            <span className="font-medium">{session.email ?? "admin"}</span>.
            Accept to join the team linked to this invite.
          </p>
          <button
            type="button"
            disabled={isAccepting}
            onClick={() => void handleAccept()}
            className="h-12 w-full rounded-lg bg-primary text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isAccepting ? "Accepting…" : "Accept invitation"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm text-neutral-500">
              Already have an admin account?
            </p>
            <Link
              href={loginHref}
              className="flex h-12 w-full items-center justify-center rounded-lg border border-gray-300 text-sm font-semibold text-black-500 transition-colors hover:bg-gray-50"
            >
              Sign in to accept
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-neutral-400">or</span>
            </div>
          </div>

          <form
            onSubmit={form.handleSubmit((values) => void handleAccept(values))}
            className="space-y-4"
          >
            <p className="text-sm font-medium text-black-500">
              New to the admin portal
            </p>

            <div className="space-y-2">
              <label
                htmlFor="accept-full-name"
                className="text-sm font-medium text-black-500"
              >
                Full name
              </label>
              <input
                id="accept-full-name"
                type="text"
                autoComplete="name"
                className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-primary"
                {...form.register("full_name")}
              />
              {form.formState.errors.full_name ? (
                <p className="text-sm text-secondary">
                  {form.formState.errors.full_name.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="accept-password"
                className="text-sm font-medium text-black-500"
              >
                Password
              </label>
              <input
                id="accept-password"
                type="password"
                autoComplete="new-password"
                className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-primary"
                {...form.register("password")}
              />
              {form.formState.errors.password ? (
                <p className="text-sm text-secondary">
                  {form.formState.errors.password.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="accept-confirm-password"
                className="text-sm font-medium text-black-500"
              >
                Confirm password
              </label>
              <input
                id="accept-confirm-password"
                type="password"
                autoComplete="new-password"
                className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-primary"
                {...form.register("confirm_password")}
              />
              {form.formState.errors.confirm_password ? (
                <p className="text-sm text-secondary">
                  {form.formState.errors.confirm_password.message}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isAccepting}
              className="h-12 w-full rounded-lg bg-primary text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isAccepting ? "Creating account…" : "Create account & accept"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
