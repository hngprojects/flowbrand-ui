export function isInvalidResetOtpError(message: string): boolean {
  const lower = message.toLowerCase();
  const hasInvalid = lower.includes("invalid");
  const hasExpired = lower.includes("expired");
  const hasCodeOrToken = lower.includes("code") || lower.includes("token");

  return (
    lower.includes("invalid or expired") ||
    (hasInvalid && hasCodeOrToken) ||
    (hasExpired && hasCodeOrToken)
  );
}
