import css from '@styled-system/css';
import { useCallback, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useHotkey } from '~/utils/hotkey/use-hotkey';

export function useTabInteractiveButton(label: string) {
  const [isTabInteractive, setIsTabInteractive] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<number>();

  useHotkey('escape', () => toggleButtonRef.current?.focus(), {
    disabled: !isTabInteractive,
  });

  const handleFocus = useCallback(() => clearTimeout(timeoutRef.current), []);
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
      aria-checked={isTabInteractive ? 'true' : 'false'}
      ref={toggleButtonRef}
      onClick={() => setIsTabInteractive((x) => !x)}
      onFocus={handleFocus}
      onBlur={handleBlur}
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

const SkipButton = styled.button(
  css({
    position: 'absolute',
    fontSize: 1,
    fontWeight: 'bold',
    width: 'auto',
    px: 3,
    py: 2,
    cursor: 'pointer',
    color: 'white',
    bg: 'blue',
    textDecoration: 'none',
    top: -9999,
    left: -9999,
    border: 0,

    '&:focus': {
      position: 'absolute',
      outline: '2px dotted white',
      outlineOffset: '-2px',
      top: 0,
      left: 0,
    },

    kbd: {
      borderRadius: 1,
      px: 2,
      py: 1,
      border: '1px solid white',
    },
  })
);
