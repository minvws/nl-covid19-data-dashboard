import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { useTheme } from 'styled-components';
import { useIsMounted } from './use-is-mounted';
import { useMediaQuery } from './use-media-query';

type Breakpoints = {
  /**
   * ~420px
   */
  xs: boolean;
  /**
   * ~768px
   */
  sm: boolean;
  /**
   * ~960px
   */
  md: boolean;
  /**
   * ~1200px
   */
  lg: boolean;
  /**
   * ~1600px
   */
  xl: boolean;
};

const breakpointContext = createContext<Breakpoints | undefined>(undefined);

export function BreakpointContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const isMounted = useIsMounted();
  const { mediaQueries } = useTheme();

  const xs = useMediaQuery(mediaQueries.xs);
  const sm = useMediaQuery(mediaQueries.sm);
  const md = useMediaQuery(mediaQueries.md);
  const lg = useMediaQuery(mediaQueries.lg);
  const xl = useMediaQuery(mediaQueries.xl);

  const value = useMemo(() => ({ xs, sm, md, lg, xl }), [xs, sm, md, lg, xl]);

  return (
    <breakpointContext.Provider value={isMounted ? value : undefined}>
      {children}
    </breakpointContext.Provider>
  );
}

export function useBreakpoints(initialValue = false): Breakpoints {
  const value = useContext(breakpointContext);

  return value || (initialValue ? breakpointsTrue : breakpointsFalse);
}

const breakpointsTrue: Breakpoints = {
  xs: true,
  sm: true,
  md: true,
  lg: true,
  xl: true,
};

const breakpointsFalse: Breakpoints = {
  xs: false,
  sm: false,
  md: false,
  lg: false,
  xl: false,
};
