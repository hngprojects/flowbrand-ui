export function wavFileForUpload(blob: Blob, namePrefix = "voice"): File {
  return new File([blob], `${namePrefix}-${Date.now()}.wav`, {
    type: "audio/wav",
  });
}
