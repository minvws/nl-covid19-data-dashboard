import { throttle } from 'lodash';
import { useEffect, useRef, useState } from 'react';

export function useBoundingBox<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [boundingRect, setBoundingRect] = useState<DOMRect>();

  useEffect(() => {
    const handleResize = throttle(() => {
      setBoundingRect(ref.current?.getBoundingClientRect());
    }, 100);

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return [boundingRect, ref] as const;
}
