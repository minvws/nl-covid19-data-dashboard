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

  return pageScopeMap[Object.keys(pageScopeMap).find((key) => pathname.startsWith(`/${key}`)) as keyof typeof pageScopeMap] || undefined;
}
