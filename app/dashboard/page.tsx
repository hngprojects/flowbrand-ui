"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}><p>Loading...</p></div>;
  if (!session) return null;

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Welcome, {session.user?.name}!</h1>
      <div style={{ backgroundColor: "#f3f4f6", padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
        <p><strong>Email:</strong> {session.user?.email}</p>
        {session.user?.image && <img src={session.user.image} alt="Avatar" style={{ width: "100px", height: "100px", borderRadius: "50%", marginTop: "20px", objectFit: "cover" }} />}
      </div>
      <button onClick={() => signOut()} style={{ padding: "12px 24px", marginTop: "30px", cursor: "pointer", backgroundColor: "#dc2626", color: "white", border: "none", borderRadius: "4px", fontSize: "16px", fontWeight: "500" }}>
        Sign Out
      </button>
    </div>
  );
}
