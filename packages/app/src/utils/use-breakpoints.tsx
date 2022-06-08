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

/**
 * Context that tracks all of the media queries configured in the theme.
 *
 * @param param0
 * @returns
 */
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

/**
 * This hook returns all of the matches for the tracked media queries by the BreakpointContextProvider
 *
 * @param initialValue default return value
 * @returns
 */
export function useBreakpoints(initialValue = false): Breakpoints {
  const value = useContext(breakpointContext);

  return value || (initialValue ? breakpointsTrue : breakpointsFalse);
}

/**
 * This hook works the same as useBreakpointsAsync but can also return undefined when the app is not mounted completely.
 * This allows the programmer to make decisons based on the loaded state of the breakpoints.
 *
 * @returns
 */
export function useBreakpointsAsync(): Breakpoints | undefined {
  return useContext(breakpointContext);
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
