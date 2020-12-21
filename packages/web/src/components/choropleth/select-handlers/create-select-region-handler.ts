import { NextRouter } from 'next/router';
import { SafetyRegionProperties } from '../shared';
import { RegioPageName } from './types';

export type RegionSelectionHandler = (context: SafetyRegionProperties) => void;

export function createSelectRegionHandler(
  router: NextRouter,
  pageName: RegioPageName = 'positief-geteste-mensen'
): RegionSelectionHandler {
  return (context: SafetyRegionProperties) => {
    if (!context) {
      return;
    }

    router.push(`/veiligheidsregio/${context.vrcode}/${pageName}`);
  };
}
