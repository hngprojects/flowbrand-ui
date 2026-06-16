"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import MicButtonIcon from "@/components/icons/voice/mic";
import { cn } from "@/lib/utils";
import {
  ONBOARDING_QUESTIONS_ROUTE,
  ONBOARDING_UPLOAD_ROUTE,
  STRATEGY_ROUTE,
} from "@/routes";
import { NEW_STRATEGY_QUERY } from "@/lib/new-strategy";
import { useNewStrategyFlow } from "@/hooks/use-new-strategy-flow";
import { useStartFunnelGenerationMutation } from "@/hooks/mutations/use-funnel-mutations";
import {
  useCompleteVoiceSessionMutation,
  useUploadVoiceRecordingMutation,
  useVoiceSessionStatusQuery,
} from "@/hooks/queries/use-voice-queries";
import { useUploadProgressQueries } from "@/hooks/queries/use-upload-queries";
import { redirectToExistingFunnelIfAny } from "@/lib/onboarding-client-recovery";
import { reserveIdempotencyKey } from "@/lib/funnel-generation-storage";
import { clearNewStrategyFlow } from "@/lib/new-strategy";
import {
  micErrorMessage,
  queryMicPermissionState,
  readVoiceLevels,
  SILENT_VOICE_LEVELS,
  smoothVoiceLevels,
  type VoiceLevels,
} from "@/lib/audio/voice-levels";
import {
  pcmFramesToWavBlob,
  startPcmCapture,
  type PcmCapture,
} from "@/lib/audio/wav-recorder";
import {
  formatVoiceRecordingTime,
  MAX_VOICE_RECORDING_MS,
  MAX_VOICE_RECORDING_SECONDS,
  MAX_VOICE_UPLOAD_BYTES,
  VOICE_POLL_TIMEOUT_MS,
} from "@/lib/audio/voice-limits";
import { GlobeOrb } from "@/components/dashboard/onboarding/voice/globe-orb";

type ViewState =
  | "idle"
  | "requesting"
  | "listening"
  | "uploading"
  | "processing"
  | "generating";

const QUESTIONS = [
  "What does your business sell?",
  "Who is your ideal customer?",
  "How do most of your customers find you right now?",
  "What makes your product or service different?",
  "What is your primary goal right now?",
];

const QUESTION_ROTATION_MS = 4000;

function MicButton() {
  return (
    <div className="flex flex-col items-center gap-0 group focus:outline-none">
      <div className="relative">
        <span
          className="absolute inset-[-12px] rounded-full bg-primary-100 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        <MicButtonIcon />
      </div>
    </div>
  );
}

function TextInputBar({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSubmit(value.trim());
        setValue("");
      }
    }
  };

  return (
    <div
      className="
      mx-auto
      w-[640px]
      max-w-full
      rounded-2xl
      bg-[linear-gradient(90deg,#4289FF_0%,#E58F17_30.77%,#155EEF_59.86%,#E58F17_79.81%)]
      p-px
    "
    >
      <div
        className="rounded-[15px] bg-white px-4 py-3"
        style={{ boxShadow: "0 0 0 2px rgba(255,140,32,0.18)" }}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Text to build your document"
          className="w-full resize-none bg-transparent text-[14px] leading-relaxed text-neutral-700 placeholder-neutral-400 outline-none"
          style={{ minHeight: 28, maxHeight: 120 }}
        />

        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (value.trim()) {
                onSubmit(value.trim());
                setValue("");
              }
            }}
            disabled={!value.trim()}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
              value.trim()
                ? "bg-primary-500 text-white hover:bg-primary-625"
                : "cursor-not-allowed bg-primary-85 text-primary-300",
            )}
            aria-label="Send"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function VoiceView() {
  const router = useRouter();
  const isNewStrategy = useNewStrategyFlow();
  const uploadVoice = useUploadVoiceRecordingMutation();
  const completeVoiceSession = useCompleteVoiceSessionMutation();
  const startGeneration = useStartFunnelGenerationMutation();

  const [viewState, setViewState] = useState<ViewState>("idle");
  const [showTextInput, setShowTextInput] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [voiceLevels, setVoiceLevels] =
    useState<VoiceLevels>(SILENT_VOICE_LEVELS);
  const [micError, setMicError] = useState<string | null>(null);
  const [shouldPollVoiceSession, setShouldPollVoiceSession] = useState(false);
  const [activeVoiceSessionId, setActiveVoiceSessionId] = useState<
    string | null
  >(null);
  const [pendingUploadId, setPendingUploadId] = useState<string | null>(null);
  const [shouldPollUpload, setShouldPollUpload] = useState(false);
  const [recordingSecondsLeft, setRecordingSecondsLeft] = useState(
    MAX_VOICE_RECORDING_SECONDS,
  );

  const voiceSessionQuery = useVoiceSessionStatusQuery(
    activeVoiceSessionId,
    shouldPollVoiceSession,
  );
  const uploadProgressQueries = useUploadProgressQueries(
    pendingUploadId ? [pendingUploadId] : [],
    shouldPollUpload,
  );
  const uploadProgressStatus = uploadProgressQueries[0]?.data?.status;
  const uploadFailureReason = uploadProgressQueries[0]?.data?.failureReason;

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const pcmCaptureRef = useRef<PcmCapture | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const levelsRef = useRef<VoiceLevels>(SILENT_VOICE_LEVELS);
  const questionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingLimitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const recordingTickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const listenSessionRef = useRef(0);
  const mountedRef = useRef(true);
  const generatingRef = useRef(false);
  const completingRef = useRef(false);
  const finishingRecordingRef = useRef(false);

  const startQuestionRotation = useCallback(() => {
    if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    questionTimerRef.current = setInterval(() => {
      setQuestionIndex((i) => (i + 1) % QUESTIONS.length);
    }, QUESTION_ROTATION_MS);
  }, []);

  const stopQuestionRotation = useCallback(() => {
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
      questionTimerRef.current = null;
    }
  }, []);

  const startAmplitudePolling = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const poll = () => {
      const target = readVoiceLevels(analyser);
      const next = smoothVoiceLevels(levelsRef.current, target);
      levelsRef.current = next;
      setVoiceLevels(next);
      animFrameRef.current = requestAnimationFrame(poll);
    };

    animFrameRef.current = requestAnimationFrame(poll);
  }, []);

  const stopAmplitudePolling = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    levelsRef.current = SILENT_VOICE_LEVELS;
    setVoiceLevels(SILENT_VOICE_LEVELS);
  }, []);

  const generateFromUpload = useCallback(
    async (uploadId: string) => {
      if (!uploadId || generatingRef.current) return;

      generatingRef.current = true;
      setShouldPollUpload(false);
      setShouldPollVoiceSession(false);
      setViewState("generating");

      try {
        await startGeneration.mutateAsync({
          source: "document_upload",
          idempotencyKey: reserveIdempotencyKey("document_upload"),
          uploadIds: [uploadId],
        });

        clearNewStrategyFlow();
        toast.success("Building your strategy…");
        router.push(STRATEGY_ROUTE);
      } catch (error) {
        if (await redirectToExistingFunnelIfAny(router, "document_upload")) {
          clearNewStrategyFlow();
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Could not start strategy generation.";
        toast.error("Could not create your strategy", { description: message });
        setViewState("idle");
      } finally {
        generatingRef.current = false;
      }
    },
    [router, startGeneration],
  );

  const beginVoiceProcessing = useCallback((voiceSessionId: string) => {
    completingRef.current = false;
    setActiveVoiceSessionId(voiceSessionId);
    setShouldPollVoiceSession(true);
    setViewState("processing");
  }, []);

  const clearRecordingLimitTimer = useCallback(() => {
    if (recordingLimitTimerRef.current) {
      clearTimeout(recordingLimitTimerRef.current);
      recordingLimitTimerRef.current = null;
    }
    if (recordingTickRef.current) {
      clearInterval(recordingTickRef.current);
      recordingTickRef.current = null;
    }
  }, []);

  const submitRecording = useCallback(
    async (blob: Blob) => {
      setViewState("uploading");

      try {
        const result = await uploadVoice.mutateAsync(blob);
        beginVoiceProcessing(result.voiceSessionId);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Could not upload your recording.";
        toast.error(message);
        setViewState("idle");
      }
    },
    [beginVoiceProcessing, uploadVoice],
  );

  const stopListening = useCallback(async (): Promise<Blob | null> => {
    listenSessionRef.current += 1;
    clearRecordingLimitTimer();
    setRecordingSecondsLeft(MAX_VOICE_RECORDING_SECONDS);

    const ctx = audioContextRef.current;
    const pcmCapture = pcmCaptureRef.current;
    const pcmFrames = pcmCapture?.stop() ?? [];
    pcmCaptureRef.current = null;

    const sampleRate = ctx?.sampleRate ?? 48_000;
    const blob = pcmFramesToWavBlob(pcmFrames, sampleRate);

    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;

    await ctx?.close();
    audioContextRef.current = null;
    analyserRef.current = null;

    stopAmplitudePolling();
    stopQuestionRotation();
    setMicError(null);

    return blob.size > 0 ? blob : null;
  }, [clearRecordingLimitTimer, stopAmplitudePolling, stopQuestionRotation]);

  const finishListeningAndSubmit = useCallback(
    async (hitRecordingLimit = false) => {
      if (finishingRecordingRef.current) return;
      finishingRecordingRef.current = true;
      try {
        const blob = await stopListening();
        if (!blob) {
          toast.error("No audio was captured. Please try again.");
          setViewState("idle");
          return;
        }

        if (hitRecordingLimit || blob.size >= MAX_VOICE_UPLOAD_BYTES - 1024) {
          toast.message("Maximum recording length reached.", {
            description: "Sending what we captured.",
          });
        }

        await submitRecording(blob);
      } finally {
        finishingRecordingRef.current = false;
      }
    },
    [stopListening, submitRecording],
  );

  const startRecordingCountdown = useCallback(() => {
    clearRecordingLimitTimer();
    setRecordingSecondsLeft(MAX_VOICE_RECORDING_SECONDS);

    const endsAt = Date.now() + MAX_VOICE_RECORDING_MS;
    const updateRemaining = () => {
      const secondsLeft = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setRecordingSecondsLeft(secondsLeft);
    };

    updateRemaining();
    recordingTickRef.current = setInterval(updateRemaining, 1000);
    recordingLimitTimerRef.current = setTimeout(() => {
      if (!micStreamRef.current) return;
      void finishListeningAndSubmit(true);
    }, MAX_VOICE_RECORDING_MS);
  }, [clearRecordingLimitTimer, finishListeningAndSubmit]);

  const setupAudioCapture = useCallback(
    async (stream: MediaStream) => {
      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      if (ctx.state === "suspended") {
        try {
          await ctx.resume();
        } catch {
          // Continue — capture may still work once the context starts.
        }
      }

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.65;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      pcmCaptureRef.current = startPcmCapture(ctx, source);
      startAmplitudePolling();
    },
    [startAmplitudePolling],
  );

  const startListening = useCallback(async () => {
    const session = ++listenSessionRef.current;
    setMicError(null);
    setViewState("requesting");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new DOMException("Unsupported", "NotSupportedError");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!mountedRef.current || listenSessionRef.current !== session) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      micStreamRef.current = stream;

      setViewState("listening");
      startQuestionRotation();
      startRecordingCountdown();

      try {
        await setupAudioCapture(stream);
      } catch (audioError) {
        console.warn("Audio capture setup failed.", audioError);
        await stopListening();
        setViewState("idle");
        setMicError("Could not start audio capture. Please try again.");
      }
    } catch (error) {
      if (!mountedRef.current || listenSessionRef.current !== session) return;

      console.warn("Microphone unavailable.", error);
      setViewState("idle");
      clearRecordingLimitTimer();
      const permissionState = await queryMicPermissionState();
      setMicError(
        micErrorMessage(error, {
          wasAlreadyDenied: permissionState === "denied",
        }),
      );
    }
  }, [
    clearRecordingLimitTimer,
    setupAudioCapture,
    startQuestionRotation,
    startRecordingCountdown,
  ]);

  const handleCenterTap = useCallback(() => {
    if (
      viewState === "uploading" ||
      viewState === "processing" ||
      viewState === "generating"
    ) {
      return;
    }

    if (viewState === "listening") {
      void finishListeningAndSubmit();
      return;
    }

    if (viewState === "idle") {
      setShowTextInput(false);
      void startListening();
    }
  }, [viewState, startListening, finishListeningAndSubmit]);

  const uploadHref = isNewStrategy
    ? `${ONBOARDING_UPLOAD_ROUTE}?${NEW_STRATEGY_QUERY}=1`
    : ONBOARDING_UPLOAD_ROUTE;

  const goToUpload = useCallback(() => {
    if (viewState === "listening" || viewState === "requesting") {
      void stopListening();
    }
    router.push(uploadHref);
  }, [viewState, stopListening, router, uploadHref]);

  const handleTextSubmit = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      setShowTextInput(false);
      toast.message("Text input uses the onboarding questions instead.", {
        description: "Taking you to the question flow.",
      });
      const questionsHref = isNewStrategy
        ? `${ONBOARDING_QUESTIONS_ROUTE}?${NEW_STRATEGY_QUERY}=1`
        : ONBOARDING_QUESTIONS_ROUTE;
      router.push(questionsHref);
    },
    [isNewStrategy, router],
  );

  useEffect(() => {
    if (!shouldPollVoiceSession) return;

    const timeoutId = setTimeout(() => {
      setShouldPollVoiceSession(false);
      setViewState("idle");
      toast.error("Voice processing is taking longer than expected.", {
        description: "Please try recording again.",
      });
    }, VOICE_POLL_TIMEOUT_MS);

    return () => clearTimeout(timeoutId);
  }, [shouldPollVoiceSession, activeVoiceSessionId]);

  useEffect(() => {
    if (!shouldPollVoiceSession || !voiceSessionQuery.isError) return;

    const timeoutId = setTimeout(() => {
      setShouldPollVoiceSession(false);
      setViewState("idle");
      toast.error(
        voiceSessionQuery.error instanceof Error
          ? voiceSessionQuery.error.message
          : "Could not check voice transcription status.",
      );
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [
    shouldPollVoiceSession,
    voiceSessionQuery.error,
    voiceSessionQuery.isError,
  ]);

  useEffect(() => {
    if (!shouldPollVoiceSession || !activeVoiceSessionId) return;
    if (!voiceSessionQuery.data?.isReady) return;
    // The mutation object is re-created on every render, so this effect can
    // re-run while the request is still in flight. Guard with a ref so the
    // session is completed exactly once per ready signal.
    if (completingRef.current) return;

    completingRef.current = true;

    void (async () => {
      try {
        const { uploadId } =
          await completeVoiceSession.mutateAsync(activeVoiceSessionId);
        if (!mountedRef.current) return;

        setShouldPollVoiceSession(false);
        setPendingUploadId(uploadId);
        setShouldPollUpload(true);
      } catch (error) {
        completingRef.current = false;
        if (!mountedRef.current) return;

        const message =
          error instanceof Error
            ? error.message
            : "Could not finalize your voice session.";
        toast.error(message);
        setViewState("idle");
        setShouldPollVoiceSession(false);
      }
    })();
  }, [
    activeVoiceSessionId,
    completeVoiceSession,
    shouldPollVoiceSession,
    voiceSessionQuery.data?.isReady,
  ]);

  useEffect(() => {
    if (!shouldPollUpload || !pendingUploadId) return;

    if (uploadProgressStatus === "failed") {
      const timeoutId = setTimeout(() => {
        setShouldPollUpload(false);
        setViewState("idle");
        toast.error(
          uploadFailureReason ??
            "Could not process your voice message. Please try again.",
        );
      }, 0);

      return () => clearTimeout(timeoutId);
    }

    if (uploadProgressStatus === "ready") {
      const timeoutId = setTimeout(() => {
        void generateFromUpload(pendingUploadId);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [
    generateFromUpload,
    pendingUploadId,
    shouldPollUpload,
    uploadFailureReason,
    uploadProgressStatus,
  ]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(animFrameRef.current);
      micStreamRef.current?.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
      pcmCaptureRef.current?.stop();
      pcmCaptureRef.current = null;
      clearRecordingLimitTimer();
      void audioContextRef.current?.close();
      audioContextRef.current = null;
      analyserRef.current = null;
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
        questionTimerRef.current = null;
      }
    };
  }, [clearRecordingLimitTimer]);

  const currentQuestion = QUESTIONS[questionIndex];
  const isListening = viewState === "listening";
  const isRequesting = viewState === "requesting";
  const isBusy =
    viewState === "uploading" ||
    viewState === "processing" ||
    viewState === "generating";

  const statusLabel =
    viewState === "listening"
      ? "Listening"
      : viewState === "requesting"
        ? "Allow microphone access"
        : viewState === "uploading"
          ? "Uploading…"
          : viewState === "processing"
            ? "Processing your message…"
            : viewState === "generating"
              ? "Creating your strategy…"
              : "Tap to speak";

  const recordingTimeHint = isListening
    ? `${formatVoiceRecordingTime(recordingSecondsLeft)} left to record`
    : `You have up to ${formatVoiceRecordingTime(MAX_VOICE_RECORDING_SECONDS)} to record`;

  return (
    <>
      <style>{`
        @keyframes orbSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      <main className="flex flex-1 flex-col">
        <div
          className="flex-1 flex flex-col items-center justify-center relative px-4"
          style={{
            backgroundImage:
              "linear-gradient(rgba(203,213,225,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(203,213,225,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        >
          <button
            type="button"
            onClick={goToUpload}
            className="absolute left-4 top-4 flex items-center gap-1.5 rounded-lg 
            border border-neutral-200 bg-white/80 px-3 py-2 text-sm font-medium text-neutral-700 backdrop-blur-sm
             transition-colors hover:bg-white hover:text-neutral-900 sm:left-6 sm:top-6"
          >
            <ChevronLeft size={16} aria-hidden />
            Back to upload
          </button>

          <div className="flex flex-col items-center gap-6">
            <button
              type="button"
              onClick={handleCenterTap}
              className={cn(
                "rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
                (isRequesting || isBusy) && "cursor-wait",
              )}
              disabled={isBusy}
              aria-label={
                isListening
                  ? "Stop listening and send"
                  : isRequesting
                    ? "Waiting for microphone permission"
                    : isBusy
                      ? statusLabel
                      : "Tap to speak"
              }
            >
              {isListening || isRequesting || isBusy ? (
                <GlobeOrb levels={isBusy ? SILENT_VOICE_LEVELS : voiceLevels} />
              ) : (
                <MicButton />
              )}
            </button>

            <p className="text-[22px] font-semibold text-neutral-900 tracking-tight">
              {statusLabel}
            </p>

            {micError && (
              <div
                role="alert"
                className="max-w-md rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600"
              >
                {micError}
              </div>
            )}

            <div
              key={currentQuestion}
              className="rounded-full border border-neutral-200 bg-white/70 backdrop-blur-sm px-5 py-2 text-[14px] text-neutral-500"
              style={{
                animation: "fadeSlideIn 0.35s ease-out",
              }}
            >
              {currentQuestion}
            </div>

            {!isBusy && (
              <p className="-mt-3 text-center text-[13px] text-neutral-400">
                {recordingTimeHint}
              </p>
            )}

            {showTextInput && (
              <div
                className="w-full max-w-[640px]"
                style={{ animation: "fadeSlideIn 0.25s ease-out" }}
              >
                <TextInputBar onSubmit={handleTextSubmit} />
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setShowTextInput((showing) => {
                  if (
                    !showing &&
                    (viewState === "listening" || viewState === "requesting")
                  ) {
                    stopListening();
                  }
                  return !showing;
                });
              }}
              className="mt-2 text-[14px] text-neutral-500 underline underline-offset-2 hover:text-neutral-700 transition-colors"
            >
              {showTextInput ? "Use voice instead" : "Use text instead"}
            </button>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
