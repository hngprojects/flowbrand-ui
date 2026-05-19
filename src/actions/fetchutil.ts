/* eslint-disable @typescript-eslint/no-explicit-any */
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const DEFAULT_TIMEOUT_MS = 30_000;

interface FetchOptions<TRequestBody> extends Omit<
  RequestInit,
  "body" | "method" | "signal"
> {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: TRequestBody;
  params?: Record<string, string>;
  timeoutMs?: number;
  signal?: AbortSignal;
}

interface FetchConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  timeoutMs?: number;
}

export class HttpError extends Error {
  public statusCode: number;
  public responseBody: any;
  public statusText: string;

  constructor(
    public response: Response,
    responseBody: any,
    statusText: string,
  ) {
    super(`HTTP error! status: ${response.status}`);
    this.name = "HttpError";
    this.statusCode = response.status;
    this.responseBody = responseBody;
    this.statusText = statusText;
  }
}

export class FetchTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`Request timed out after ${timeoutMs}ms`);
    this.name = "FetchTimeoutError";
  }
}

function linkAbortSignals(
  controller: AbortController,
  externalSignal?: AbortSignal,
) {
  if (!externalSignal) return;

  if (externalSignal.aborted) {
    controller.abort(externalSignal.reason);
    return;
  }

  externalSignal.addEventListener(
    "abort",
    () => controller.abort(externalSignal.reason),
    { once: true },
  );
}

export const createFetchUtil = (config: FetchConfig) => {
  const {
    baseUrl,
    defaultHeaders = {},
    timeoutMs: defaultTimeoutMs = DEFAULT_TIMEOUT_MS,
  } = config;

  return async function fetchUtil<TResponse, TRequestBody = unknown>(
    endpoint: string,
    options: FetchOptions<TRequestBody> = {},
  ): Promise<TResponse> {
    const {
      method = "GET",
      headers = {},
      body,
      params,
      timeoutMs = defaultTimeoutMs,
      signal: externalSignal,
      ...restOptions
    } = options;

    const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    const normalizedEndpoint = endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;

    const url = new URL(normalizedEndpoint, normalizedBaseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const mergedHeaders = {
      "Content-Type": "application/json",
      ...defaultHeaders,
      ...headers,
    };

    const controller = new AbortController();
    linkAbortSignals(controller, externalSignal);

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    const fetchOptions: RequestInit = {
      method,
      headers: mergedHeaders,
      signal: controller.signal,
      ...restOptions,
    };

    if (body !== undefined) {
      fetchOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url.toString(), fetchOptions);

      let responseBody;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        responseBody = await response.json();
      } else {
        responseBody = await response.text();
      }

      if (!response.ok) {
        throw new HttpError(response, responseBody, response.statusText);
      }

      return responseBody as TResponse;
    } catch (error) {
      if (controller.signal.aborted && !externalSignal?.aborted) {
        throw new FetchTimeoutError(timeoutMs);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  };
};

export const withAuth = (token: string): Record<string, string> => ({
  Authorization: `Bearer ${token}`,
});
