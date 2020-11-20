import { useEffect, useRef } from 'react';

export function useOnClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    function listener(event: MouseEvent | TouchEvent) {
      // Do nothing if clicking ref's element or descendent elements
      if (
        !ref.current ||
        (event.target !== null && ref.current.contains(event.target as Node))
      ) {
        return;
      }

      handlerRef.current(event);
    }

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref]);
}
