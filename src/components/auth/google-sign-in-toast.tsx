"use client";

import { useEffect } from "react";
import { toast } from "sonner";

/** Shows success toast after Google OAuth redirect, then strips the query param. */
export function GoogleSignInToast() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("google_success")) {
      return;
    }

    toast.success("Signed in successfully");

    params.delete("google_success");
    const nextQuery = params.toString();
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash}`,
    );
  }, []);

  return null;
}
