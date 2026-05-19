export type RegisterUserSuccess = {
  ok: true;
  status: number;
  data: unknown;
};

export type RegisterUserFailure = {
  ok: false;
  error: string;
  status?: number;
};

export type RegisterUserResult = RegisterUserSuccess | RegisterUserFailure;

export type ResetPasswordResult = { ok: true } | { ok: false; error: string };

export type ResendOtpSuccess = {
  status: number;
  message?: string;
  /** Seconds until resend is allowed (from API body when provided). */
  cooldownSeconds?: number;
};

export type ResendOtpFailure = {
  error: string;
  status?: number;
  cooldownSeconds?: number;
};

export type ResendOtpResult = ResendOtpSuccess | ResendOtpFailure;

export function isResendOtpSuccess(
  result: ResendOtpResult,
): result is ResendOtpSuccess {
  return !("error" in result);
}

export type VerifyOtpSuccess = {
  status: number;
  message?: string;
  accessToken: string;
};

export type VerifyOtpFailure = { error: string; status?: number };

export type VerifyOtpResult = VerifyOtpSuccess | VerifyOtpFailure;

export function isVerifyOtpSuccess(
  result: VerifyOtpResult,
): result is VerifyOtpSuccess {
  return !("error" in result);
}
