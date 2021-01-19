import { NextRouter } from 'next/router';
import { SafetyRegionProperties } from '@corona-dashboard/common';
import { RegioPageName } from './types';

export type RegionSelectionHandler = (context: SafetyRegionProperties) => void;

export function createSelectRegionHandler(
  router: NextRouter,
  pageName: RegioPageName = 'actueel'
): RegionSelectionHandler {
  return (context: SafetyRegionProperties) => {
    router.push(`/veiligheidsregio/${context.vrcode}/${pageName}`);
  };
}
