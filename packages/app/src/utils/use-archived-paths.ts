import { getArchivedRoutes } from '@corona-dashboard/common';
import { useMemo } from 'react';

export type ArchivedPath = ReturnType<typeof useArchivedPaths>;

/**
 * A hook that return a memoized archived routes instance;
 *
 * The archived paths are used to determine the behaviour of the
 * collapsible category menu in the sidebar.
 *
 * @returns
 */
export function useArchivedPaths() {
  return useMemo(() => {
    const archivedPaths = getArchivedRoutes();

    return archivedPaths;
  }, []);
}
