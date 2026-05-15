"use client";

import { Button } from "@/components/ui/button";
import WaitlistHeader from "./nav";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { joinWaitlist } from "@/services/waitlist.service";
import { waitlistSchema } from "@/schema/waitlist.schema";
import { WaitingUsers } from "@/components/icons/waiting-users";
import lapttopScreenPop from "@public/images/laptop-screen.png";

export default function WaitlistBody() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess(false);
    setLoading(true);

    const result = waitlistSchema.safeParse({ email });

    if (!result.success) {
      setError("Enter a valid email");
      setLoading(false);
      return;
    }

    try {
      await joinWaitlist(email);

      setSuccess(true);
      setEmail("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to join waitlist";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] min-h-screen px-4 sm:px-6 lg:px-18">
      <WaitlistHeader />

      <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-10 lg:gap-6 pt-4 lg:pt-12">
        <div className="w-full lg:max-w-[480px]">
          <div className="flex items-center gap-2 bg-primary-foreground rounded-full px-3 py-1.5 w-fit">
            <div className="bg-primary w-2 h-2 rounded-full"></div>
            <p className="text-primary text-xs font-semibold tracking-wide">
              AVAILABLE SOON
            </p>
          </div>

          <div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mt-6 mb-4 text-foreground">
              Turn More Leads Into Paying{" "}
              <span className="text-primary">Customers</span>
            </h1>
            <p className="text-muted-foreground text-base mb-8">
              Seil helps small and growing businesses attract leads, convert
              customers, and drive repeat sales through guided, step-by-step
              marketing strategy you can execute yourself.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col lg:flex-row w-full max-w-[480px] gap-3 lg:gap-2"
          >
            <div className="flex-1">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                className={`flex-1 min-h-12 px-4 py-2 rounded-xl bg-background border ${
                  error ? "border-red-500" : "border-gray-800"
                }`}
              />

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              {success && (
                <p className="text-green-600 text-sm mt-2">
                  Congratulations! You are added to our waitlist
                </p>
              )}
            </div>

            <Button type="submit" disabled={loading} className="h-12">
              {loading ? "Joining..." : "Join Waitlist"}
            </Button>
          </form>

          <div className="flex flex-col lg:flex-row items-center gap-3 mt-6">
            <WaitingUsers />
            <p className="text-sm text-foreground">
              20+ businesses already waiting
            </p>
          </div>
        </div>

        <div className="w-full lg:w-auto flex justify-center">
          <Image
            src={lapttopScreenPop}
            alt="laptop screen"
            className="max-w-auto min-h-auto"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
