import { useMemo } from 'react';

export default function useUniqueId() {
  const uniqueId = useMemo(() => {
    return `_${Math.random().toString(36).substring(2, 15)}`;
  }, []);

  return uniqueId;
}
