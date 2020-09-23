import { NextRouter } from 'next/router';
import { SafetyRegionProperties } from '../shared';

export type RegionSelectionHandler = (context: SafetyRegionProperties) => void;

export function createSelectRegionHandler(
  router: NextRouter
): RegionSelectionHandler {
  return (context: SafetyRegionProperties) => {
    router.push(
      '/veiligheidsregio/[code]/positief-geteste-mensen',
      `/veiligheidsregio/${context.vrcode}/positief-geteste-mensen`
    );
  };
}
