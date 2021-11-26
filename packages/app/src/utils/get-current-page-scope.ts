import { DataScopeKey } from '@corona-dashboard/common';
import { NextRouter } from 'next/router';

export function getCurrentPageScope(
  router: NextRouter
): DataScopeKey | undefined {
  return router.pathname.startsWith('/internationaal')
    ? 'in'
    : router.pathname.startsWith('/landelijk')
    ? 'nl'
    : router.pathname.startsWith('/veiligheidsregio')
    ? 'vr'
    : router.pathname.startsWith('/gemeente')
    ? 'gm'
    : undefined;
}
