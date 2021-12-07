import { useState, useEffect, MutableRefObject, useCallback } from 'react';

export function useIsInView(
  element: MutableRefObject<HTMLElement | null>,
  rootMargin?: string
) {
  const [isInView, setIsInView] = useState(false);
  const connect = (observer: IntersectionObserver, htmlElement: HTMLElement) =>
    observer.observe(htmlElement);
  const disconnect = useCallback((observer, el) => observer.unobserve(el), []);

  useEffect(() => {
    if (!element.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin }
    );

    connect(observer, element.current);
    return () => element.current && disconnect(observer, element.current);
  }, [connect, disconnect, element, rootMargin]);

  return isInView;
}
