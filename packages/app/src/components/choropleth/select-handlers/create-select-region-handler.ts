import { NextRouter } from 'next/router';
import { SafetyRegionProperties } from '@corona-dashboard/common';
import { RegioPageName } from './types';

export type RegionSelectionHandler = (context: SafetyRegionProperties) => void;

export function createSelectRegionHandler(
  router: NextRouter,
  pageName: RegioPageName
): RegionSelectionHandler {
  return (context: SafetyRegionProperties) => {
    if (pageName === 'actueel') {
      router.push(`/actueel/veiligheidsregio/${context.vrcode}`);
      return;
    }
    router.push(`/veiligheidsregio/${context.vrcode}/${pageName}`);
  };
}
