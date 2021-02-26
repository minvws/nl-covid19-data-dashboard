import { useEffect, useState } from 'react';
import { useIsMountedRef } from './use-is-mounted-ref';

/**
 * @param delayMs optionally mutate state after a delay
 */
export function useIsMounted({ delay }: { delay?: number } = {}) {
  const isMountedRef = useIsMountedRef();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!delay) {
      return setIsMounted(true);
    }

    const timeoutId = setTimeout(() => {
      isMountedRef.current && setIsMounted(true);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [delay, isMountedRef]);
  return isMounted;
}
