import { useState, useEffect, MutableRefObject, useCallback } from 'react';

export function useIsInView(
  element: MutableRefObject<HTMLElement | null>,
  rootMargin?: string
) {
  const [isInView, setIsInView] = useState(false);
  const connect = (observer: IntersectionObserver, htmlElement: HTMLElement) =>
    observer.observe(htmlElement);
  const disconnect = useCallback(
    (observer) => element.current || observer.unobserve(element.current),
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin }
    );

    element.current && connect(observer, element.current);
    return () => disconnect(observer);
  }, []);

  return isInView;
}
