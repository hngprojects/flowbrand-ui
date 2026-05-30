"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { submitStageFeedback } from "@/actions/funnels";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function StageFeedback({
  funnelId,
  stageId,
}: {
  funnelId: string;
  stageId: string;
}) {
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const feedback = useMutation({
    retry: false,
    mutationFn: () => submitStageFeedback(funnelId, stageId, comment),
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Feedback submitted. Thank you!");
    },
    onError: (error: Error) => {
      if (error.message?.includes("409")) {
        setSubmitted(true);
        return;
      }
      toast.error("Could not submit feedback. Please try again.");
    },
  });

  if (submitted) {
    return (
      <div className="rounded-[16px] border border-primary-80 bg-white p-5 text-sm text-neutral-500">
        Thank you for your feedback on this stage.
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-primary-80 bg-white p-5 md:p-6">
      <h3 className="mb-3 text-sm font-semibold text-neutral-900">
        How did this stage go?
      </h3>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts on this stage..."
        rows={3}
        className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none"
      />
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          disabled={!comment.trim() || feedback.isPending}
          onClick={() => feedback.mutate()}
          className={cn(
            "rounded-[10px] px-6 py-2.5 text-sm font-semibold transition-colors",
            comment.trim() && !feedback.isPending
              ? "cursor-pointer bg-primary-500 text-white hover:bg-primary-625"
              : "cursor-not-allowed bg-primary-150 text-neutral-900",
          )}
        >
          {feedback.isPending ? "Submitting…" : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
}