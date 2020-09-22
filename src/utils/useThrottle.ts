import { useState, useEffect, useRef } from 'react';

// This hook uses a generic type to match the input with the output.
//
// Example:
// ```
// const throttledTerm = useThrottle<string>(term, 100);
// ```
export function useThrottle<Value>(value: Value, limit: number): Value {
  const [throttledValue, setThrottledValue] = useState<Value>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = window.setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => window.clearTimeout(handler);
  }, [value, limit]);

  return throttledValue;
}
