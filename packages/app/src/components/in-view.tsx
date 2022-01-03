import { ReactNode, useRef, useEffect } from 'react';
import { useViewState } from '~/utils/use-view-state';

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
  const viewState = useViewState(ref, rootMargin);
  const hasChanged = useRef(viewState === 'inView');
  const isInView = viewState === 'inView';
  const alwaysShow = 'notSupported' === viewState;

  useEffect(() => {
    if (isInView) {
      hasChanged.current = true;
    }
  }, [isInView]);

  return (
    <div ref={ref}>
      {(isInView || (triggerOnce && hasChanged.current) || alwaysShow) &&
        children}
    </div>
  );
}
