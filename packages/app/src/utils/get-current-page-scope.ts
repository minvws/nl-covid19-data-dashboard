import { RouterDataScopeKey } from '@corona-dashboard/common';
import { NextRouter } from 'next/router';

/**
 * Returns a typed DataScope based on the current route's path
 */
export function getCurrentPageScope(router: NextRouter): (RouterDataScopeKey | 'general') | undefined {
  const { pathname } = router;

  // TODO: Implement object lookup
  // const currentPageScopeMap = {
  //   landelijk: 'nl',
  //   gemeente: 'gm',
  //   verantwoording: 'general',
  // };

  // Object.entries(currentPageScopeMap).forEach(([key, value]) => {
  //   return pathname.startsWith(`/${key}`) ? value : undefined;
  // });

  return pathname.startsWith('/landelijk') ? 'nl' : pathname.startsWith('/gemeente') ? 'gm' : pathname.startsWith('/verantwoording') ? 'general' : undefined;
}
