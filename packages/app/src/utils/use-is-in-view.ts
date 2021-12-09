import { MutableRefObject, useCallback, useEffect, useState } from 'react';

/**
 * Returns & updates if the given element is visible in the viewport.
 *
 * @param element - A reference to the element to be watched
 * @param rootMargin - Optional. An IntersectionObserver rootMargin string
 * @returns A boolean telling if the element is in view or not
 */
export function useIsInView(
  element: MutableRefObject<HTMLElement | null>,
  rootMargin?: string
) {
  const [isInView, setIsInView] = useState(false);
  const connect = useCallback(
    (observer: IntersectionObserver, htmlElement: HTMLElement) =>
      observer.observe(htmlElement),
    []
  );
  const disconnect = useCallback((observer, el) => observer.unobserve(el), []);

  useEffect(() => {
    if (!element.current) return;

    const currentElement = element.current;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin }
    );

    connect(observer, currentElement);
    return () => currentElement && disconnect(observer, currentElement);
  }, [connect, disconnect, element, rootMargin]);

  return isInView;
}
