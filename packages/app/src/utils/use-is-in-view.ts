import { useState, useEffect, MutableRefObject, useCallback } from 'react';

export const useIsInView = (
  element: MutableRefObject<HTMLElement | null>,
  rootMargin?: string
) => {
  const [isInView, setIsInView] = useState(false);
  const connect = useCallback(
    (observer: IntersectionObserver, htmlElement: HTMLElement) => {
      observer.observe(htmlElement);
    },
    []
  );
  const disconnect = useCallback(
    (observer) => observer.unobserve(element.current),
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin }
    );

    element.current && connect(observer, element.current);
    return () => disconnect(observer);
  }, []);

  return isInView;
};
