import { throttle } from 'lodash';
import { useEffect, useRef, useState } from 'react';

export function useBoundingBox<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [boundingRect, setBoundingRect] = useState<DOMRect>();

  useEffect(() => {
    const setRect = throttle(() => {
      setBoundingRect(ref.current?.getBoundingClientRect());
    }, 100);

    setRect();
    window.addEventListener('resize', setRect);
    window.addEventListener('scroll', setRect);
    return () => {
      window.removeEventListener('resize', setRect);
      window.addEventListener('scroll', setRect);
    };
  }, []);

  return [boundingRect, ref] as const;
}
