import { NextRouter } from 'next/router';
import { SafetyRegionProperties } from '../shared';
import { RegioPageName } from './types';

export type RegionSelectionHandler = (context: SafetyRegionProperties) => void;

export function createSelectRegionHandler(
  router: NextRouter,
  pageName: RegioPageName
): RegionSelectionHandler {
  return (context: SafetyRegionProperties) => {
    router.push(`/veiligheidsregio/${context.vrcode}/${pageName}`);
  };
}
