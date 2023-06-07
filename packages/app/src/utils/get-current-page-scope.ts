import { RouterDataScopeKey } from '@corona-dashboard/common';
import { NextRouter } from 'next/router';

/**
 * Returns a typed DataScope based on the current route's path
 */
export function getCurrentPageScope(router: NextRouter): (RouterDataScopeKey | 'general') | undefined {
  const { pathname } = router;

  const pageScopeMap: Record<string, RouterDataScopeKey | 'general'> = {
    landelijk: 'nl',
    gemeente: 'gm',
    verantwoording: 'general',
  };

  const pageScopeMapKey = Object.keys(pageScopeMap).find((key) => pathname.startsWith(`/${key}`));

  return pageScopeMapKey ? pageScopeMap[pageScopeMapKey] : undefined;
}
