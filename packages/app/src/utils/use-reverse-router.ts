import { getReverseRouter } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { useBreakpoints } from './use-breakpoints';

export type ReverseRouter = ReturnType<typeof useReverseRouter>;

/**
 * A hook that returns a memoized reverse router instance.
 *
 * The reverse router is used as a central struct that describes
 * all of the available routes in the application.
 *
 * @returns
 */
export function useReverseRouter() {
  const breakpoints = useBreakpoints();
  const isMobile = !breakpoints.md;

  return useMemo(() => {
    const reverseRouter = getReverseRouter(isMobile);

    return reverseRouter;
  }, [isMobile]);
}
