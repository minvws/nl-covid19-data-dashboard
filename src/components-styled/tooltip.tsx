import css from '@styled-system/css';
import { MouseEvent, ReactNode, useRef, useState } from 'react';
import { Box } from '~/components-styled/base';

export interface TooltipCoordinates {
  left: number;
  top: number;
}

export type GetTooltipCoordinates<T> = (
  event?: MouseEvent<any>,
  value?: T
) => TooltipCoordinates;

interface TooltipProps<T> {
  controls: string;
  children: ReactNode;
  tooltipState: TooltipState<T>;
  width: number;
}

interface TooltipState<T> {
  visible: boolean;
  coordinates?: TooltipCoordinates;
  value?: T;
}

interface UseTooltipStateArguments<T> {
  values: T[];
  getTooltipCoordinates: GetTooltipCoordinates<T>;
}

// getTooltipCoordinates is provided by the spcific graph to retrieve the coordinates based on
// the mouse event and/or the value
export function useTooltip<T>({
  values,
  getTooltipCoordinates,
}: UseTooltipStateArguments<T>) {
  const [visible, setVisible] = useState(false);
  const [coordinates, setCoordinates] = useState<TooltipCoordinates>();
  const [value, setValue] = useState<T>();
  const [keyboardValueIndex, setKeyboardValueIndex] = useState(0);

  const timer = useRef(-1);

  const tooltipState: TooltipState<T> = {
    visible,
    coordinates,
    value,
  };

  // This timeout smoothens the display of the tooltip for mouse users
  const debounceMouseEvents = (callback: () => void) => {
    if (timer.current > -1) {
      window.clearTimeout(timer.current);
    }

    timer.current = window.setTimeout(callback, 75);
  };

  const openTooltip = (event: MouseEvent<any>, value: T) => {
    debounceMouseEvents(() => {
      setCoordinates(getTooltipCoordinates(event, value));
      setVisible(true);
      setValue(value);
    });
  };

  const closeTooltip = () => {
    debounceMouseEvents(() => {
      setVisible(false);
    });
  };

  const keyboardTooltip = (event: any) => {
    const KEY_ARROW_LEFT = 37;
    const KEY_ARROW_RIGHT = 39;

    if (event.which !== KEY_ARROW_LEFT && event.which !== KEY_ARROW_RIGHT) {
      return;
    }

    const direction = event.which === KEY_ARROW_LEFT ? -1 : 1;

    // The new index overfloews from zero to the last and vice versa
    const newIndex =
      keyboardValueIndex === undefined
        ? 0
        : (keyboardValueIndex + direction + values.length) % values.length;

    const newValue = values[newIndex];

    if (!newValue) {
      setVisible(false);
      return;
    }

    setKeyboardValueIndex(newIndex);
    setCoordinates(getTooltipCoordinates(undefined, newValue));
    setValue(newValue);
    setVisible(true);
  };

  return { openTooltip, closeTooltip, keyboardTooltip, tooltipState };
}

export function Tooltip<T>({
  controls,
  children,
  tooltipState,
  width,
}: TooltipProps<T>) {
  return (
    <Box
      aria-live="assertive"
      aria-controls={controls}
      role="tooltip"
      aria-hidden={!tooltipState.visible}
      css={css({
        position: 'absolute',
        background: 'white',
        transition: 'left 0.15s, top 0.15s',
        transform: 'translate(0, 20px)',
        pointerEvents: 'none',
        width: `${width}px`,
        boxShadow: 'tile',
        borderRadius: 1,
        zIndex: 42,
        left: tooltipState.coordinates?.left,
        top: tooltipState.coordinates?.top,
        '&[aria-hidden="true"]': {
          visibility: 'hidden',
        },
      })}
    >
      {children}
    </Box>
  );
}
