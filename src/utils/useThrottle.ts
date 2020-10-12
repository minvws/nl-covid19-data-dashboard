import { useState, useEffect, useRef } from 'react';

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
