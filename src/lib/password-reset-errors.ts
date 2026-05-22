export function isInvalidResetOtpError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("invalid or expired") ||
    (lower.includes("invalid") && lower.includes("code")) ||
    (lower.includes("expired") && lower.includes("code"))
  );
}
