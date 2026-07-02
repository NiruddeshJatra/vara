// Centralized error-message extraction for the backend's
// { success, message, data } envelope. Use in every catch block instead of
// surfacing axios's raw "Request failed with status code N".

type ApiErrorBody = {
  message?: string;
  data?: unknown;
  detail?: string;
};

/** First human-readable string inside an error payload (field errors, non_field_errors, detail). */
function firstOf(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;
  const obj = data as Record<string, unknown>;
  if (typeof obj.detail === 'string') return obj.detail;
  for (const value of Object.values(obj)) {
    if (Array.isArray(value) && value.length && typeof value[0] === 'string') {
      return value[0];
    }
    if (typeof value === 'string') return value;
  }
  return undefined;
}

/**
 * Extract a user-facing message from an API error.
 * Order: envelope `message` -> first error string in `data` -> raw DRF error -> generic.
 * Never returns axios's "Request failed with status code N".
 */
export function getApiError(err: any): string {
  const body = err?.response?.data as ApiErrorBody | undefined;
  if (body && typeof body === 'object') {
    return body.message || firstOf(body.data) || firstOf(body) || 'Something went wrong';
  }
  const msg = err?.message;
  if (typeof msg === 'string' && !/^Request failed with status code/.test(msg)) {
    return msg;
  }
  return 'Something went wrong';
}
