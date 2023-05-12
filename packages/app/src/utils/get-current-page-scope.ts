import { DataScopeKey } from '@corona-dashboard/common';
import { NextRouter } from 'next/router';

/**
 * Returns a typed DataScope based on the current route's path
 */
export function getCurrentPageScope(router: NextRouter): DataScopeKey | undefined {
  return router.pathname.startsWith('/landelijk') ? 'nl' : router.pathname.startsWith('/gemeente') ? 'gm' : undefined;
}
