import { useState, useEffect, useRef } from 'react';

// This hook uses a generic type to match the input with the output.
//
// Example:
// ```
// const throttledTerm = useThrottle<string>(term, 100);
// ```
export function useThrottle<T>(value: T, intervalMs: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = window.setTimeout(() => {
      if (Date.now() - lastRan.current >= intervalMs) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, intervalMs - (Date.now() - lastRan.current));

    return () => window.clearTimeout(handler);
  }, [value, intervalMs]);

  return throttledValue;
}
