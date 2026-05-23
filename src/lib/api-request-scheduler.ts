/**
 * Client-side spacing between funnel/onboarding API calls to avoid rate limits
 * (staging: 5 generations/hour; aggressive polling can trigger 429).
 */

const MIN_GAP_MS = 600;
let chain: Promise<void> = Promise.resolve();
let lastFinishedAt = 0;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Serialize calls with a minimum gap between request starts. */
export async function scheduleApiRequest<T>(fn: () => Promise<T>): Promise<T> {
  const run = async () => {
    const elapsed = Date.now() - lastFinishedAt;
    if (elapsed < MIN_GAP_MS) {
      await wait(MIN_GAP_MS - elapsed);
    }
    try {
      return await fn();
    } finally {
      lastFinishedAt = Date.now();
    }
  };

  const result = chain.then(run, run);
  chain = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

export function staggerDelay(index: number, stepMs = 500): Promise<void> {
  return wait(Math.max(0, index) * stepMs);
}
