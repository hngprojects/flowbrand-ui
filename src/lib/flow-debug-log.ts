const PREFIX = "[flowbrand]";

export type FlowDebugArea =
  | "auth"
  | "entry"
  | "onboarding"
  | "funnel"
  | "strategy"
  | "upload";

/** Enable in dev, with FLOWBRAND_DEBUG=1, or sessionStorage flowbrand_debug=1 in the browser. */
export function isFlowDebugEnabled(): boolean {
  if (process.env.FLOWBRAND_DEBUG === "1") return true;
  if (process.env.NODE_ENV === "development") return true;
  if (typeof window !== "undefined") {
    try {
      return sessionStorage.getItem("flowbrand_debug") === "1";
    } catch {
      return false;
    }
  }
  return false;
}

function summarizeData(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (typeof data !== "object") return data;
  if (Array.isArray(data)) {
    return { _arrayLength: data.length, _preview: data.slice(0, 2) };
  }
  const record = data as Record<string, unknown>;
  const keys = Object.keys(record).slice(0, 20);
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    const value = record[key];
    if (
      key.toLowerCase().includes("token") ||
      key.toLowerCase().includes("password")
    ) {
      out[key] = "[redacted]";
      continue;
    }
    if (typeof value === "string" && value.length > 200) {
      out[key] = `${value.slice(0, 200)}…`;
      continue;
    }
    out[key] = value;
  }
  if (Object.keys(record).length > keys.length) {
    out._truncatedKeys = Object.keys(record).length - keys.length;
  }
  return out;
}

export function flowLog(
  area: FlowDebugArea,
  step: string,
  detail?: Record<string, unknown>,
): void {
  if (!isFlowDebugEnabled()) return;
  if (detail) {
    console.log(`${PREFIX}[${area}] ${step}`, detail);
  } else {
    console.log(`${PREFIX}[${area}] ${step}`);
  }
}

export function flowLogApiResult(
  area: FlowDebugArea,
  step: string,
  result: { ok: boolean; status?: number; error?: string; data?: unknown },
  extra?: Record<string, unknown>,
): void {
  if (!isFlowDebugEnabled()) return;
  flowLog(area, step, {
    ok: result.ok,
    status: result.status,
    error: result.ok ? undefined : result.error,
    data: result.ok ? summarizeData(result.data) : summarizeData(result.data),
    ...extra,
  });
}

export function flowLogError(
  area: FlowDebugArea,
  step: string,
  error: unknown,
  extra?: Record<string, unknown>,
): void {
  if (!isFlowDebugEnabled()) return;
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`${PREFIX}[${area}] ${step} FAILED`, {
    message,
    ...extra,
  });
}
