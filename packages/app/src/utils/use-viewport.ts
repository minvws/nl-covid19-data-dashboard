import { throttle } from 'lodash';
import { useEffect, useState } from 'react';

/**
 * Returns the window.innerWidth and window.innerHeight whenever the screen resizes.
 */
export function useViewport() {
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = throttle(() => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    }, 100);

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewportSize;
}
