import { NextRouter } from 'next/router';
import { SafetyRegionProperties } from '../shared';
import { PageName } from './types';

export type RegionSelectionHandler = (context: SafetyRegionProperties) => void;

export function createSelectRegionHandler(
  router: NextRouter,
  pageName: PageName = 'positief-geteste-mensen'
): RegionSelectionHandler {
  return (context: SafetyRegionProperties) => {
    if (!context) {
      return;
    }

    router.push(
      `/veiligheidsregio/[code]/${pageName}`,
      `/veiligheidsregio/${context.vrcode}/${pageName}`
    );
  };
}
