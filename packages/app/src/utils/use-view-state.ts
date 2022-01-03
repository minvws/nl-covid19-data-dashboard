import { MutableRefObject, useCallback, useEffect, useState } from 'react';

type InViewState = 'inView' | 'outView' | 'notSupported';

/**
 * Returns & updates if the given element is visible in the viewport.
 *
 * @param element - A reference to the element to be watched/
 * @param rootMargin - Optional. An IntersectionObserver rootMargin string.
 * @returns inView, outView or not supported.
 */
export function useViewState(
  element: MutableRefObject<HTMLElement | null>,
  rootMargin?: string
) {
  const [isInView, setIsInView] = useState<InViewState>('outView');
  const connect = useCallback(
    (observer: IntersectionObserver, htmlElement: HTMLElement) =>
      observer.observe(htmlElement),
    []
  );
  const disconnect = useCallback((observer, el) => observer.unobserve(el), []);

  useEffect(() => {
    if (!element.current) return;

    if (false === 'IntersectionObserver' in window) {
      setIsInView('notSupported');
      return;
    }

    const currentElement = element.current;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting ? 'inView' : 'outView'),
      { rootMargin }
    );

    connect(observer, currentElement);
    return () => currentElement && disconnect(observer, currentElement);
  }, [connect, disconnect, element, rootMargin]);

  return isInView;
}
