import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { useCallback, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { fontSizes, space } from '~/style/theme';
import { useHotkey } from '~/utils/hotkey/use-hotkey';

/**
 * This hook handles a focus trap used for allowing keyboard users to optionally
 * 'step into' a specific DOM area. For example, a choropleth or chart can be
 * skipped by tabbing through the DOM elements by setting the tabindex to -1.
 *
 * This hook return a button that is hidden until it receives focus, once clicked
 * the `isTabInteractive` state will be set to true, this state can then be used
 * to change the appropriate tab index to 1, in which case the next tab press
 * after this button will step into the chart or choropleth.
 *
 * @param label A text label which is rendered in the button
 * @returns A stateful isTabInteractive/setIsTabInteractive set, a button instance that will toggle the isTabInteractive value and
 * a focus and blur handler that also toggle the isTabInteractive value.
 */
export function useTabInteractiveButton(label: string) {
  const [isTabInteractive, setIsTabInteractive] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<number>();

  useHotkey('escape', () => toggleButtonRef.current?.focus(), {
    isDisabled: !isTabInteractive,
  });

  const handleFocus = useCallback(() => {
    clearTimeout(timeoutRef.current);
  }, []);
  const handleBlur = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setIsTabInteractive(false), 0);
  }, []);

  const anchorEventHandlers = useMemo(
    () => ({
      onFocus: handleFocus,
      onBlur: handleBlur,
    }),
    [handleBlur, handleFocus]
  );

  const tabInteractiveButton = (
    <SkipButton
      type="button"
      role="switch"
      isActive={isTabInteractive}
      aria-checked={isTabInteractive ? 'true' : 'false'}
      ref={toggleButtonRef}
      onClick={() => setIsTabInteractive((x) => !x)}
      {...anchorEventHandlers}
    >
      {label}
    </SkipButton>
  );

  return {
    isTabInteractive,
    tabInteractiveButton,
    anchorEventHandlers,
    setIsTabInteractive,
  } as const;
}

const SkipButton = styled.button<{ isActive: boolean }>((x) =>
  css({
    position: 'absolute',
    fontSize: fontSizes[1],
    fontWeight: 'bold',
    width: 'auto',
    paddingX: space[3],
    paddingY: space[2],
    cursor: 'pointer',
    textDecoration: 'none',
    zIndex: 9,
    /**
     * we'll toggle the opacity because for some reason firefox will not keep
     * the toggle button in the viewport, instead it will scroll entirely to the
     * top when the button receives focus.
     */
    opacity: 0,
    pointerEvents: 'none',
    top: 0,
    left: 0,

    border: '1px solid',
    borderColor: colors.blue8,
    background: x.isActive ? colors.blue8 : colors.white,
    color: x.isActive ? colors.white : colors.blue8,

    '&:focus': {
      opacity: 1,
      pointerEvents: 'all',
    },
  })
);
