import { useEffect, useRef, useState } from 'react';

/**
 * Returns the given value as a stateful value after the given delay
 *
 * @param value the specified value
 * @param delayMs an arbitrary delay count in milliseconds
 * @returns the stateful value
 */
export function useThrottle<T>(value: T, delayMs: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = window.setTimeout(() => {
      if (Date.now() - lastRan.current >= delayMs) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, delayMs - (Date.now() - lastRan.current));

    return () => window.clearTimeout(handler);
  }, [value, delayMs]);

  return throttledValue;
}
