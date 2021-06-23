import { FetchError } from 'node-fetch';
import { Dispatch, SetStateAction } from 'react';

const retryCodes = [
  408 /* Request Timeout */, 500 /* Internal Server Error */,
  502 /* Bad Gateway */, 503 /* Service Unavailable */,
  504 /* Gateway Timeout */, 522 /* Connection timed out*/,
  524 /* Cloudflare  Timeout Occurred */,
];

export type FetchState = 'idle' | 'loading' | 'error' | 'retrying';

export async function fetchWithRetry<T>(
  input: RequestInfo,
  setLoadingState: Dispatch<SetStateAction<FetchState>>,
  init?: RequestInit,
  retries = 3,
  retryDelayMs = 300
) {
  setLoadingState('loading');
  const response = await fetch(input, init);
  if (response.ok) {
    setLoadingState('idle');
    return (await response.json()) as T;
  }

  if (retries > 0 && retryCodes.includes(response.status)) {
    setLoadingState('retrying');
    return await new Promise<T>((resolve, reject) => {
      setTimeout(async () => {
        try {
          const result = (await fetchWithRetry(
            input,
            setLoadingState,
            init,
            retries - 1,
            retryDelayMs * 2
          )) as T;
          resolve(result);
        } catch (e) {
          reject(e);
        }
      }, retryDelayMs);
    });
  } else {
    setLoadingState('error');
    const error = new FetchError(input.toString(), response.status.toString());
    error.code = response.status.toString();
    throw error;
  }
}
