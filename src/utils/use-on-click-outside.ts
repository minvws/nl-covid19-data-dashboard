import { RefObject, useEffect, useRef } from 'react';

export function useOnClickOutside<T extends RefObject<Element>>(
  ref: T[],
  handler: (event: MouseEvent | TouchEvent) => void
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const refs = Array.isArray(ref) ? ref : [ref];

    function listener(event: MouseEvent | TouchEvent) {
      const clickedInsideRef = refs.find((ref) =>
        ref.current?.contains(event.target as Node)
      );

      if (!clickedInsideRef) {
        handlerRef.current(event);
      }
    }

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref]);
}
