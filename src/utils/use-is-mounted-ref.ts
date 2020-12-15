import { useEffect, useRef, useState } from 'react';

export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  return isMounted;
}

export function useIsMountedRef() {
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMountedRef;
}
