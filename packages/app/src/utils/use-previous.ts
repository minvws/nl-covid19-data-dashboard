import { useEffect, useRef } from 'react';

/**
 * Hook to use the previous state of a changing variable.
 */
export function usePrevious<T>(value: T) {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
