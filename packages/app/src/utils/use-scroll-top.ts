import { throttle } from 'lodash';
import { useEffect, useState } from 'react';

export function useScrollTop() {
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrollTop(window.scrollY);
    }, 100);

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollTop;
}
