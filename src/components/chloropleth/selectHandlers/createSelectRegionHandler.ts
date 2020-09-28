import { NextRouter } from 'next/router';
import { SafetyRegionProperties } from '../shared';
import { PageNames } from './types';

export type RegionSelectionHandler = (context: SafetyRegionProperties) => void;

export function createSelectRegionHandler(
  router: NextRouter,
  suffix: PageNames = 'positief-geteste-mensen'
): RegionSelectionHandler {
  return (context: SafetyRegionProperties) => {
    if (!context) {
      return;
    }

    router.push(
      `/veiligheidsregio/[code]/${suffix}`,
      `/veiligheidsregio/${context.vrcode}/${suffix}`
    );
  };
}
