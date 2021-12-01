import { useMemo } from 'react';

/**
 * Returns a memoized unique id
 */
export function useUniqueId() {
  const uniqueId = useMemo(() => {
    return `_${createUniqueId()}`;
  }, []);

  return uniqueId;
}

function createUniqueId() {
  return Math.random().toString(36).substring(2, 15);
}
