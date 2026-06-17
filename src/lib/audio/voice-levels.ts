export type VoiceLevels = {
  amplitude: number;
  bass: number;
  mid: number;
  high: number;
};

export const SILENT_VOICE_LEVELS: VoiceLevels = {
  amplitude: 0,
  bass: 0,
  mid: 0,
  high: 0,
};

function averageRange(data: Uint8Array, start: number, end: number): number {
  const from = Math.max(0, start);
  const to = Math.min(data.length, end);
  if (to <= from) return 0;

  let sum = 0;
  for (let i = from; i < to; i++) {
    sum += data[i];
  }
  return sum / (to - from) / 255;
}

function computeRms(timeData: Uint8Array): number {
  let sum = 0;
  for (let i = 0; i < timeData.length; i++) {
    const sample = (timeData[i] - 128) / 128;
    sum += sample * sample;
  }
  return Math.sqrt(sum / timeData.length);
}

/** Read mic level + frequency bands from an AnalyserNode (0–1 each). */
export function readVoiceLevels(analyser: AnalyserNode): VoiceLevels {
  const timeData = new Uint8Array(analyser.fftSize);
  const freqData = new Uint8Array(analyser.frequencyBinCount);

  analyser.getByteTimeDomainData(timeData);
  analyser.getByteFrequencyData(freqData);

  const rms = computeRms(timeData);

  return {
    amplitude: Math.min(rms * 4.5, 1),
    bass: averageRange(freqData, 1, 8),
    mid: averageRange(freqData, 8, 40),
    high: averageRange(freqData, 40, 120),
  };
}

/** Fast attack, slower decay — feels responsive when speaking. */
export function smoothVoiceLevels(
  current: VoiceLevels,
  target: VoiceLevels,
  attack = 0.35,
  decay = 0.12,
): VoiceLevels {
  const smooth = (prev: number, next: number) => {
    const rate = next > prev ? attack : decay;
    return prev + (next - prev) * rate;
  };

  return {
    amplitude: smooth(current.amplitude, target.amplitude),
    bass: smooth(current.bass, target.bass),
    mid: smooth(current.mid, target.mid),
    high: smooth(current.high, target.high),
  };
}

export type MicPermissionState = PermissionState | "unknown";

export async function queryMicPermissionState(): Promise<MicPermissionState> {
  if (!navigator.permissions?.query) return "unknown";

  try {
    const status = await navigator.permissions.query({
      name: "microphone" as PermissionName,
    });
    return status.state;
  } catch {
    return "unknown";
  }
}

export function micDeniedMessage(wasAlreadyDenied: boolean): string {
  if (wasAlreadyDenied) {
    return "Microphone access is blocked for this site. Open your browser's site settings (lock icon in the address bar), allow the microphone, then tap to speak again.";
  }

  return "Microphone access was denied. Tap to speak again and choose Allow when your browser asks.";
}

export function micErrorMessage(
  error: unknown,
  options?: { wasAlreadyDenied?: boolean },
): string {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError" || error.name === "SecurityError") {
      return micDeniedMessage(options?.wasAlreadyDenied ?? false);
    }
    if (error.name === "NotFoundError") {
      return "No microphone found. Connect a mic or use text instead.";
    }
    if (error.name === "NotReadableError") {
      return "Microphone is in use by another app. Close it and try again.";
    }
    if (error.name === "NotSupportedError") {
      return "Your browser does not support microphone access. Try text instead.";
    }
  }

  return "Could not access the microphone. Please try again.";
}
