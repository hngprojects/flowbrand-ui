import { MAX_VOICE_UPLOAD_BYTES } from "@/lib/audio/voice-limits";

/** Encode mono or interleaved PCM float samples (-1..1) as a 16-bit WAV blob. */
export function encodePcmToWavBlob(
  channels: Float32Array[],
  sampleRate: number,
): Blob {
  if (channels.length === 0 || channels[0].length === 0) {
    return new Blob([], { type: "audio/wav" });
  }

  const channelCount = channels.length;
  const frameCount = channels[0].length;
  const bytesPerSample = 2;
  const blockAlign = channelCount * bytesPerSample;
  const dataSize = frameCount * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channelCount, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let frame = 0; frame < frameCount; frame++) {
    for (let channel = 0; channel < channelCount; channel++) {
      const sample = channels[channel][frame] ?? 0;
      const clamped = Math.max(-1, Math.min(1, sample));
      const int16 = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
      view.setInt16(offset, int16, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: "audio/wav" });
}

export type PcmCapture = {
  stop: () => Float32Array[];
};

/**
 * Capture raw PCM from an existing mic source node for WAV export.
 * WebM uploads are often sniffed as video/webm server-side, which fails API validation.
 */
export function startPcmCapture(
  audioContext: AudioContext,
  source: MediaStreamAudioSourceNode,
): PcmCapture {
  const processor = audioContext.createScriptProcessor(4096, 1, 1);
  const frames: Float32Array[] = [];
  const maxPcmBytes = MAX_VOICE_UPLOAD_BYTES - 44;
  let capturedSamples = 0;

  processor.onaudioprocess = (event) => {
    const remainingSampleBudget = Math.floor(maxPcmBytes / 2) - capturedSamples;
    if (remainingSampleBudget <= 0) return;

    const input = event.inputBuffer.getChannelData(0);
    const copyLength = Math.min(input.length, remainingSampleBudget);
    if (copyLength <= 0) return;

    frames.push(new Float32Array(input.subarray(0, copyLength)));
    capturedSamples += copyLength;
  };

  source.connect(processor);
  const silentOutput = audioContext.createGain();
  silentOutput.gain.value = 0;
  processor.connect(silentOutput);
  silentOutput.connect(audioContext.destination);

  return {
    stop: () => {
      processor.onaudioprocess = null;
      processor.disconnect();
      silentOutput.disconnect();
      return frames;
    },
  };
}

export function pcmFramesToMonoChannel(frames: Float32Array[]): Float32Array {
  const totalLength = frames.reduce((sum, frame) => sum + frame.length, 0);
  const merged = new Float32Array(totalLength);
  let offset = 0;
  for (const frame of frames) {
    merged.set(frame, offset);
    offset += frame.length;
  }
  return merged;
}

export function pcmFramesToWavBlob(
  frames: Float32Array[],
  sampleRate: number,
): Blob {
  const channel = pcmFramesToMonoChannel(frames);
  if (channel.length === 0) {
    return new Blob([], { type: "audio/wav" });
  }
  return encodePcmToWavBlob([channel], sampleRate);
}
