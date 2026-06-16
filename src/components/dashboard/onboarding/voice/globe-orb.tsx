"use client";

import Image from "next/image";
import type { VoiceLevels } from "@/lib/audio/voice-levels";

type GlobeOrbProps = {
  levels: VoiceLevels;
};

const ORB_SPIN_DURATION_S = 10;

export function GlobeOrb({ levels }: GlobeOrbProps) {
  const { amplitude, bass } = levels;
  const scale = 1 + amplitude * 0.25;
  const glowBlur = 20 + amplitude * 28 + bass * 12;
  const glowOpacity = 0.55 + amplitude * 0.4;
  const innerBlue = 0.35 + bass * 0.4;
  const outerBlue = 0.18 + amplitude * 0.25;

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
      <div
        className="relative flex items-center justify-center"
        style={{ width: 260, height: 260 }}
      >
        <div
          className="pointer-events-none absolute inset-[-18px] rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(66,137,255,${innerBlue}) 0%, rgba(21,94,239,${outerBlue}) 50%, transparent 72%)`,
            filter: `blur(${glowBlur}px)`,
            opacity: glowOpacity,
            transition: "opacity 80ms ease-out, filter 80ms ease-out",
          }}
        />

        <div
          className="relative flex items-center justify-center"
          style={{
            width: 220,
            height: 220,
            transform: `scale(${scale})`,
            transition: "transform 70ms ease-out",
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              animation: `orbSpin ${ORB_SPIN_DURATION_S}s linear infinite`,
            }}
          >
            <div style={{ animation: "orbFloat 4s ease-in-out infinite" }}>
              <Image
                src="/images/globe-orb.png"
                alt="AI Orb"
                width={200}
                height={200}
                className="relative z-1"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
