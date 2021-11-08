import { RefObject, useEffect, useRef } from 'react';

export function useOnClickOutside<T extends RefObject<Element>>(
  refs: T[],
  handler: (event: MouseEvent | TouchEvent) => void
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    function listener(event: MouseEvent | TouchEvent) {
      const clickedInsideRef = refs.find((ref) => {
        const el = ref.current as Node | null;
        return el?.contains(event.target as Node);
      });

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
  }, [refs]);
}
