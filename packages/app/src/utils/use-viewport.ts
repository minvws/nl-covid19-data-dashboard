import { throttle } from 'lodash';
import { useEffect, useState } from 'react';

export function useViewport(throttleMS = 100) {
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = throttle(() => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    }, throttleMS);

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewportSize;
}
