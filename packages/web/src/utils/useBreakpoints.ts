import React from 'react';
import { useTheme } from 'styled-components';
import { useMediaQuery } from './useMediaQuery';

export function useBreakpoints(initialValue?: boolean) {
  const { mediaQueries } = useTheme();
  const xs = useMediaQuery(mediaQueries.xs, initialValue);
  const sm = useMediaQuery(mediaQueries.sm, initialValue);
  const md = useMediaQuery(mediaQueries.md, initialValue);
  const lg = useMediaQuery(mediaQueries.lg, initialValue);
  const xl = useMediaQuery(mediaQueries.xl, initialValue);

  return React.useMemo(
    () => ({
      xs,
      sm,
      md,
      lg,
      xl,
    }),
    [xs, sm, md, lg, xl]
  );
}
