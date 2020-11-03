import { useEffect, useRef } from 'react';

export const useWindowResizeDebounce = (
  callback: () => void,
  delay: number
): void => {
  const timeout = useRef<number>();

  useEffect(() => {
    const handleResize = () => {
      if (timeout.current) {
        window.clearTimeout(timeout.current);
      }
      timeout.current = window.setTimeout(callback, delay);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    /* eslint-disable-next-line */
  }, []);
};
