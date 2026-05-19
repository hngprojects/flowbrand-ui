"use client";

import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "30px", color: "#1f2937" }}>Sign In</h1>
        <button
          onClick={() =>
            signIn("google", { redirect: true, callbackUrl: "/dashboard" })
          }
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
            backgroundColor: "#1f2937",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
