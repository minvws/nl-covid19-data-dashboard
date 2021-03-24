import { useMemo } from 'react';

export function useUniqueId() {
  const uniqueId = useMemo(() => {
    return `_${createUniqueId()}`;
  }, []);

  return uniqueId;
}

export function createUniqueId() {
  return Math.random().toString(36).substring(2, 15);
}
