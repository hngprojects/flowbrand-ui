/** Matches API max upload size in `uploadVoiceRound`. */
export const MAX_VOICE_UPLOAD_BYTES = 10 * 1024 * 1024;

/** ~90s of mono 16-bit WAV at 48 kHz stays under the 10 MB API limit. */
export const MAX_VOICE_RECORDING_MS = 90_000;
export const MAX_VOICE_RECORDING_SECONDS = MAX_VOICE_RECORDING_MS / 1000;

export function formatVoiceRecordingTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export const VOICE_POLL_MS = 2500;
export const MAX_VOICE_POLLS = 240;
export const VOICE_POLL_TIMEOUT_MS = VOICE_POLL_MS * MAX_VOICE_POLLS;

export function assertVoiceUploadSize(blob: Blob): void {
  if (blob.size === 0) {
    throw new Error("No audio was captured. Please try again.");
  }
  if (blob.size > MAX_VOICE_UPLOAD_BYTES) {
    const maxMb = Math.round(MAX_VOICE_UPLOAD_BYTES / (1024 * 1024));
    throw new Error(
      `Recording is too large (max ${maxMb} MB). Try a shorter message.`,
    );
  }
}
