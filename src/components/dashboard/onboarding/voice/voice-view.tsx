"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import MicButtonIcon from "@/components/icons/voice/mic";
import GalleryIcon from "@/components/icons/voice/gallery";
import LittlefileIcon from "@/components/icons/voice/file";
import LittleMicIcon from "@/components/icons/voice/littlemic";
import { cn } from "@/lib/utils";
import { ONBOARDING_QUESTIONS_ROUTE, ONBOARDING_UPLOAD_ROUTE } from "@/routes";
import { NEW_STRATEGY_QUERY } from "@/lib/new-strategy";
import { useNewStrategyFlow } from "@/hooks/use-new-strategy-flow";
import {
  micErrorMessage,
  queryMicPermissionState,
  readVoiceLevels,
  SILENT_VOICE_LEVELS,
  smoothVoiceLevels,
  type VoiceLevels,
} from "@/lib/audio/voice-levels";
import { GlobeOrb } from "@/components/dashboard/onboarding/voice/globe-orb";

type ViewState = "idle" | "requesting" | "listening";

const QUESTIONS = [
  "What does your business sell?",
  "Who is your ideal customer?",
  "How do most of your customers find you right now?",
  "What makes your product or service different?",
  "What is your primary goal right now?",
];

const QUESTION_ROTATION_MS = 4000;

function MicButton({ onClick }: { onClick: () => void }) {
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

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-neutral-400 transition-colors hover:text-neutral-600"
              aria-label="Attach image"
            >
              <GalleryIcon />
            </button>

            <button
              type="button"
              className="text-neutral-400 transition-colors hover:text-neutral-600"
              aria-label="Mention"
            >
              <LittlefileIcon />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-neutral-400 transition-colors hover:text-neutral-600"
              aria-label="Voice input"
            >
              <LittleMicIcon />
            </button>

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
    </div>
  );
}

export function VoiceView() {
  const router = useRouter();
  const isNewStrategy = useNewStrategyFlow();

  const [viewState, setViewState] = useState<ViewState>("idle");
  const [showTextInput, setShowTextInput] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [voiceLevels, setVoiceLevels] =
    useState<VoiceLevels>(SILENT_VOICE_LEVELS);
  const [micError, setMicError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const levelsRef = useRef<VoiceLevels>(SILENT_VOICE_LEVELS);
  const questionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const listenSessionRef = useRef(0);
  const mountedRef = useRef(true);

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

  // UI prototype only.
  // Microphone access is currently used for audio-level visualization.
  // Speech-to-text and AI processing will be added during backend integration.
  const setupAudioAnalyser = useCallback(
    async (stream: MediaStream) => {
      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      if (ctx.state === "suspended") {
        try {
          await ctx.resume();
        } catch {
          // Continue — analyser may still work once the context starts.
        }
      }

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.65;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
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

      try {
        await setupAudioAnalyser(stream);
      } catch (audioError) {
        console.warn("Audio analyser setup failed.", audioError);
      }
    } catch (error) {
      if (!mountedRef.current || listenSessionRef.current !== session) return;

      console.warn("Microphone unavailable.", error);
      setViewState("idle");
      const permissionState = await queryMicPermissionState();
      setMicError(
        micErrorMessage(error, {
          wasAlreadyDenied: permissionState === "denied",
        }),
      );
    }
  }, [startQuestionRotation, setupAudioAnalyser]);

  const stopListening = useCallback(() => {
    listenSessionRef.current += 1;
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;

    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;

    stopAmplitudePolling();
    stopQuestionRotation();
    setViewState("idle");
    setMicError(null);
  }, [stopAmplitudePolling, stopQuestionRotation]);

  const handleCenterTap = useCallback(() => {
    if (viewState === "listening") {
      stopListening();
      return;
    }

    if (viewState === "idle") {
      setShowTextInput(false);
      void startListening();
    }
  }, [viewState, startListening, stopListening]);

  const uploadHref = isNewStrategy
    ? `${ONBOARDING_UPLOAD_ROUTE}?${NEW_STRATEGY_QUERY}=1`
    : ONBOARDING_UPLOAD_ROUTE;

  const goToUpload = useCallback(() => {
    if (viewState === "listening" || viewState === "requesting") {
      stopListening();
    }
    router.push(uploadHref);
  }, [viewState, stopListening, router, uploadHref]);

  const handleTextSubmit = useCallback(
    (_text: string) => {
      const dest = isNewStrategy
        ? `${ONBOARDING_QUESTIONS_ROUTE}?${NEW_STRATEGY_QUERY}=1`
        : ONBOARDING_QUESTIONS_ROUTE;
      router.push(dest);
    },
    [router, isNewStrategy],
  );

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(animFrameRef.current);
      micStreamRef.current?.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
      void audioContextRef.current?.close();
      audioContextRef.current = null;
      analyserRef.current = null;
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
        questionTimerRef.current = null;
      }
    };
  }, []);

  const currentQuestion = QUESTIONS[questionIndex];
  const isListening = viewState === "listening";
  const isRequesting = viewState === "requesting";

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
        @keyframes orbShimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.92; }
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
                isRequesting && "cursor-wait",
              )}
              aria-label={
                isListening
                  ? "Stop listening"
                  : isRequesting
                    ? "Waiting for microphone permission"
                    : "Tap to speak"
              }
            >
              {isListening || isRequesting ? (
                <GlobeOrb levels={voiceLevels} />
              ) : (
                <MicButton onClick={() => {}} />
              )}
            </button>

            <p className="text-[22px] font-semibold text-neutral-900 tracking-tight">
              {isListening
                ? "Listening"
                : isRequesting
                  ? "Allow microphone access"
                  : "Tap to speak"}
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
