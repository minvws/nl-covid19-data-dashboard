import { useEffect, useState } from 'react';
import { useIsMountedRef } from './use-is-mounted-ref';

/**
 * @param delayMs optionally mutate state after a delay
 */
export function useIsMounted({ delayMs }: { delayMs?: number } = {}) {
  const isMountedRef = useIsMountedRef();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!delayMs) {
      setIsMounted(true);
      return () => setIsMounted(false);
    }

    const timeoutId = setTimeout(
      () => isMountedRef.current && setIsMounted(true),
      delayMs
    );

    return () => {
      clearTimeout(timeoutId);
      setIsMounted(false);
    };
  }, [delayMs, isMountedRef]);
  return isMounted;
}
