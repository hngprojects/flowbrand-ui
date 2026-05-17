"use server";

import { cookies } from "next/headers";
import { credentialsAuth } from "~/actions/auth";

/** @deprecated Use credentialsAuth — kept for existing imports. */
export const nextLogin = credentialsAuth;

export const setBackend = async (backend?: string) => {
  const cookieStore = await cookies();
  if (backend) {
    cookieStore.set("backend", backend, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }

  return {
    success: true,
  };
};
