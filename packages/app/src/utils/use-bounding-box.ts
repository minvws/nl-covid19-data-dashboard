import { throttle } from 'lodash';
import { useEffect, useRef, useState } from 'react';

/**
 * A hook to get a reactive bounding box for a certain element. Updates on
 * scroll and resize automatically.
 *
 * @returns An array with the BoundingRect of the element, and a ref that
 * should be set on the element in question
 */
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
      window.removeEventListener('scroll', setRect);
    };
  }, []);

  return [boundingRect, ref] as const;
}
