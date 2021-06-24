import css from '@styled-system/css';
import { useCallback, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useHotkey } from '~/utils/hotkey/use-hotkey';

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
  } as const;
}

const SkipButton = styled.button<{ isActive: boolean }>((x) =>
  css({
    position: 'absolute',
    fontSize: 1,
    fontWeight: 'bold',
    width: 'auto',
    px: 3,
    py: 2,
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
    borderColor: 'blue',
    bg: x.isActive ? 'blue' : 'white',
    color: x.isActive ? 'white' : 'blue',

    '&:focus': {
      opacity: 1,
      pointerEvents: 'all',
    },
  })
);
