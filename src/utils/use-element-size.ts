import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';

export function useElementSize<T extends HTMLElement>(
  initialWidth = 0,
  initialHeight = 0
) {
  const [size, setSize] = useState({
    width: initialWidth,
    height: initialHeight,
  });
  const ref = useRef<T>(null);

  useEffect(() => {
    const debounceHandleResize = debounce(handleResize, 60);

    handleResize();
    window.addEventListener('resize', debounceHandleResize);

    return () => window.removeEventListener('resize', debounceHandleResize);

    function handleResize() {
      if (ref.current) {
        setSize({
          width: ref.current.offsetWidth || 0,
          height: ref.current.offsetHeight || 0,
        });
      }
    }
  }, []);

  return [ref, size] as const;
}
