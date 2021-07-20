import css from '@styled-system/css';
import {
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Box } from '~/components/base';

export interface TooltipCoordinates {
  left: number;
  top: number;
}

export type GetTooltipCoordinates<T> = (
  value: T,
  event?: MouseEvent<any>
) => TooltipCoordinates;

interface TooltipProps<T> {
  children: ReactNode;
  tooltipState: TooltipState<T>;
  width?: number;
  controls?: string;
  tooltipArrow?: string;
}

interface TooltipState<T> {
  isVisible: boolean;
  coordinates?: TooltipCoordinates;
  value?: T;
}

interface UseTooltipStateArguments<T> {
  values: T[];
  getTooltipCoordinates: GetTooltipCoordinates<T>;
}

/**
 * getTooltipCoordinates is provided by the specific graph to retrieve the
 * coordinates based on the mouse event and/or the value.
 */
export function useTooltip<T>({
  values,
  getTooltipCoordinates,
}: UseTooltipStateArguments<T>) {
  const [isVisible, setIsVisible] = useState(false);
  const [coordinates, setCoordinates] = useState<TooltipCoordinates>();
  const [value, setValue] = useState<T>();
  const [keyboardValueIndex, setKeyboardValueIndex] = useState<number>();

  const timer = useRef(-1);

  const tooltipState: TooltipState<T> = {
    isVisible,
    coordinates,
    value,
  };

  useEffect(() => {
    return () => {
      if (timer.current > -1) {
        window.clearTimeout(timer.current);
      }
    };
  }, []);

  // This timeout smoothens the display of the tooltip for mouse users
  function debounceMouseEvents(callback: () => void) {
    if (timer.current > -1) {
      window.clearTimeout(timer.current);
    }

    timer.current = window.setTimeout(callback, 75);
  }

  const openTooltip = useCallback(
    (value: T, event: MouseEvent<any>) => {
      debounceMouseEvents(() => {
        setCoordinates(getTooltipCoordinates(value, event));
        setIsVisible(true);
        setValue(value);
      });
    },
    [getTooltipCoordinates]
  );

  const closeTooltip = useCallback(() => {
    debounceMouseEvents(() => {
      setIsVisible(false);
    });
  }, []);

  const keyboardNavigateTooltip = useCallback(
    (event: any) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return;
      }

      const direction = event.key === 'ArrowLeft' ? -1 : 1;

      // The new index overflows from zero to the last and vice versa
      const newIndex =
        keyboardValueIndex === undefined
          ? 0
          : (keyboardValueIndex + direction + values.length) % values.length;

      const newValue = values[newIndex];

      if (!newValue) {
        setIsVisible(false);
        return;
      }

      requestAnimationFrame(() => {
        setKeyboardValueIndex(newIndex);
        setCoordinates(getTooltipCoordinates(newValue, undefined));
        setValue(newValue);
        setIsVisible(true);
      });
    },
    [getTooltipCoordinates, keyboardValueIndex, values]
  );

  return { openTooltip, closeTooltip, keyboardNavigateTooltip, tooltipState };
}

export function Tooltip<T>({
  controls,
  children,
  tooltipState,
  width,
  tooltipArrow,
}: TooltipProps<T>) {
  return (
    <Box
      aria-live="assertive"
      aria-controls={controls}
      role="tooltip"
      aria-hidden={!tooltipState.isVisible}
      css={css({
        position: 'absolute',
        background: 'white',
        transition: 'left 0.15s, top 0.15s',
        transform: 'translate(0, 20px)',
        pointerEvents: 'none',
        width: width ? `${width}px` : 'auto',
        boxShadow: 'tile',
        borderRadius: 1,
        zIndex: 42,
        left: tooltipState.coordinates?.left,
        top: tooltipState.coordinates?.top,
        '&[aria-hidden="true"]': {
          visibility: 'hidden',
        },
        '&::after': () => {
          switch (tooltipArrow) {
            case 'left':
              return {
                content: '""',
                position: 'absolute',
                transform: 'translateY(-50%)',
                top: '50%',
                left: '-7px',
                zIndex: -1,
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent',
                borderRight: '7px solid white',
              };
            default:
              return {};
          }
        },
      })}
    >
      {children}
    </Box>
  );
}
