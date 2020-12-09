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
      const clickedInsideRef = refs.find((ref) => {
        let el = ref.current as Node | null;
        /**
         * IE11 does not support `.contains` on SVG elements. We'll traverse the
         * DOM to find the first parent which does support that method.
         */
        while (el && !el.contains && el !== document.body) {
          el = el.parentNode;
        }
        el?.contains(event.target as Node);
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
  }, [ref]);
}
