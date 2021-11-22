import { getReverserRouter } from '@corona-dashboard/common';
import { useMemo } from 'react';
import { useBreakpoints } from './use-breakpoints';

export type ReverseRouter = ReturnType<typeof useReverseRouter>;

export function useReverseRouter() {
  const breakpoints = useBreakpoints();
  const isMobile = !breakpoints.md;

  return useMemo(() => {
    const reverseRouter = getReverserRouter(isMobile);

    return reverseRouter;
  }, [isMobile]);
}
