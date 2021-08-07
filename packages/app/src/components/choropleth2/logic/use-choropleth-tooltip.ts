import { localPoint } from '@visx/event';
import {
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useIsTouchDevice } from '~/utils/use-is-touch-device';
import { TooltipSettings } from './types';

export function useChoroplethTooltip(
  showTooltipOnFocus: boolean | undefined,
  setTooltip: (tooltip: TooltipSettings | undefined) => void,
  containerRef: React.RefObject<HTMLDivElement>
) {
  const timeout = useRef(-1);
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    if (!showTooltipOnFocus) {
      setTooltip(undefined);
      return;
    }

    const container = containerRef.current;

    function handleBubbledFocusIn(event: FocusEvent) {
      const link = event.target as HTMLAnchorElement;
      if (!container || !link) {
        return;
      }

      const id = link.getAttribute('data-id');

      if (id) {
        const bboxContainer = container.getBoundingClientRect();
        const bboxLink = link.getBoundingClientRect();
        const left = bboxLink.left - bboxContainer.left;
        const top = bboxLink.top - bboxContainer.top;

        setTooltip({
          left: left + bboxLink.width + 5,
          top: top,
          data: id,
        });
      }
    }

    function handleBubbledFocusOut() {
      setTooltip(undefined);
    }

    /**
     * `focusin` and `focusout` events bubble whereas `focus` doesn't
     */
    container?.addEventListener('focusin', handleBubbledFocusIn);
    container?.addEventListener('focusout', handleBubbledFocusOut);

    return () => {
      container?.removeEventListener('focusin', handleBubbledFocusIn);
      container?.removeEventListener('focusout', handleBubbledFocusOut);
    };
  }, [containerRef, setTooltip, showTooltipOnFocus, isTouch]);

  return [
    createSvgMouseOverHandler(timeout, setTooltip, containerRef),
    isTouch ? undefined : createSvgMouseOutHandler(timeout, setTooltip),
  ] as const;
}

const createSvgMouseOverHandler = (
  timeout: MutableRefObject<number>,
  setTooltip: (settings: TooltipSettings | undefined) => void,
  ref: RefObject<HTMLElement>
) => {
  return useCallback(
    (event: React.MouseEvent) => {
      const elm = event.target as HTMLElement | SVGElement;
      const id = elm.getAttribute('data-id');

      if (id && ref.current) {
        if (timeout.current > -1) {
          clearTimeout(timeout.current);
          timeout.current = -1;
        }

        /**
         * Pass the DOM node to fix positioning in Firefox
         */
        const coords = localPoint(ref.current, event);

        if (coords) {
          setTooltip({
            left: coords.x + 5,
            top: coords.y + 5,
            data: id,
          });
        }
      }
    },
    [timeout, setTooltip, ref]
  );
};

const createSvgMouseOutHandler = (
  timeout: MutableRefObject<number>,
  setTooltip: (settings: TooltipSettings | undefined) => void
) => {
  return useCallback(() => {
    if (timeout.current < 0) {
      timeout.current = window.setTimeout(() => setTooltip(undefined), 10);
    }
  }, [timeout, setTooltip]);
};
