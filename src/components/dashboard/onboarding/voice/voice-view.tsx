"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import MicButtonIcon from "@/components/icons/voice/mic";
import GalleryIcon from "@/components/icons/voice/gallery";
import LittlefileIcon from "@/components/icons/voice/file";
import LittleMicIcon from "@/components/icons/voice/littlemic";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ONBOARDING_QUESTIONS_ROUTE, STRATEGY_ROUTE } from "@/routes";
import { NEW_STRATEGY_QUERY } from "@/lib/new-strategy";
import { useNewStrategyFlow } from "@/hooks/use-new-strategy-flow";

type ViewState = "idle" | "listening";

const QUESTIONS = [
  "What does your business sell?",
  "Who is your ideal customer?",
  "How do most of your customers find you right now?",
  "What makes your product or service different?",
  "What is your primary goal right now?",
];

const QUESTION_ROTATION_MS = 4000;

function GlobeOrb({ amplitude }: { amplitude: number }) {
  const scale = 1 + amplitude * 0.12;
  const blur = 18 + amplitude * 10;
  const opacity = 0.85 + amplitude * 0.15;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: 220,
        height: 220,
        transition: "transform 120ms ease-out",
        transform: `scale(${scale})`,
      }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(100,120,255,0.18) 0%, rgba(100,120,255,0) 70%)",
          filter: `blur(${blur}px)`,
          opacity,
          transition: "opacity 120ms ease-out, filter 120ms ease-out",
        }}
      />

      <Image
        src="/images/globe-orb.png"
        alt="AI Orb"
        width={200}
        height={200}
        className="relative z-1 animate-[float_4s_ease-in-out_infinite]"
        priority
      />
    </div>
  );
}

function MicButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex flex-col items-center gap-0 group focus:outline-none">
      <div className="relative">
        <span className="absolute inset-[-12px] rounded-full bg-primary-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
  const [amplitude, setAmplitude] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const questionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
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

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const poll = () => {
      analyser.getByteTimeDomainData(dataArray);

      // RMS of the signal
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const val = (dataArray[i] - 128) / 128;
        sum += val * val;
      }
      const rms = Math.sqrt(sum / dataArray.length);
      // Normalise & smooth: rms typically 0–0.5 when speaking
      setAmplitude((prev) => {
        const target = Math.min(rms * 3, 1);
        return prev * 0.75 + target * 0.25;
      });

      animFrameRef.current = requestAnimationFrame(poll);
    };

    animFrameRef.current = requestAnimationFrame(poll);
  }, []);

  const stopAmplitudePolling = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    setAmplitude(0);
  }, []);

  // UI prototype only.
  // Microphone access is currently used for audio-level visualization.
  // Speech-to-text and AI processing will be added during backend integration.
  const startListening = useCallback(async () => {
    setViewState("listening");
    startQuestionRotation();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      micStreamRef.current = stream;

      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      startAmplitudePolling();
    } catch (error) {
      console.warn(
        "Microphone unavailable. Continuing in prototype mode.",
        error,
      );
    }
  }, [startQuestionRotation, startAmplitudePolling]);

  const stopListening = useCallback(() => {
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;

    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;

    stopAmplitudePolling();
    stopQuestionRotation();
    setViewState("idle");
  }, [stopAmplitudePolling, stopQuestionRotation]);

  const handleCenterTap = useCallback(() => {
    if (viewState === "idle") {
      startListening();
    } else {
      stopListening();
    }
  }, [viewState, startListening, stopListening]);

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
    return () => {
      mountedRef.current = false;
      stopListening();
    };
  }, [stopListening]);

  const currentQuestion = QUESTIONS[questionIndex];
  const isListening = viewState === "listening";

  return (
    <>
      <style>{`
       @keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
}
      `}</style>

      <main className="flex flex-1 flex-col">
        <div
          className="flex-1 flex flex-col items-center justify-center relative"
          style={{
            backgroundImage:
              "linear-gradient(rgba(203,213,225,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(203,213,225,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        >
          <div className="flex flex-col items-center gap-6 px-4">
            <button
              type="button"
              onClick={handleCenterTap}
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              aria-label={isListening ? "Stop listening" : "Tap to speak"}
            >
              {isListening ? (
                <GlobeOrb amplitude={amplitude} />
              ) : (
                <MicButton onClick={() => {}} />
              )}
            </button>

            <p
              className={cn(
                "text-[22px] font-semibold text-neutral-900 tracking-tight transition-opacity duration-300",
                isListening ? "opacity-100" : "opacity-100",
              )}
            >
              {isListening ? "Listening" : "Tap to speak"}
            </p>

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
              onClick={() => setShowTextInput((v) => !v)}
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
