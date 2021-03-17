import { throttle } from 'lodash';
import { useEffect, useState } from 'react';

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
