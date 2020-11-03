import React from 'react';
import { useTheme } from 'styled-components';
import { useMediaQuery } from './useMediaQuery';

export function useBreakpoints() {
  const { mediaQueries } = useTheme();
  const xs = useMediaQuery(mediaQueries.xs);
  const sm = useMediaQuery(mediaQueries.sm);
  const md = useMediaQuery(mediaQueries.md);
  const lg = useMediaQuery(mediaQueries.lg);
  const xl = useMediaQuery(mediaQueries.xl);

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
