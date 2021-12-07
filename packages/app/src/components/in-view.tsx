import { ReactNode, useRef, useEffect } from 'react';
import { useIsInView } from '~/utils/use-is-in-view';

interface InViewProps {
  children: ReactNode;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function InView({
  rootMargin,
  children,
  triggerOnce = true,
}: InViewProps) {
  const ref = useRef(null);
  const isInView = useIsInView(ref, rootMargin);
  const hasChanged = useRef(isInView);

  useEffect(() => {
    if (isInView) {
      hasChanged.current = true;
    }
  }, [isInView]);

  return (
    <div ref={ref}>
      {(isInView || (triggerOnce && hasChanged.current)) && children}
    </div>
  );
}
