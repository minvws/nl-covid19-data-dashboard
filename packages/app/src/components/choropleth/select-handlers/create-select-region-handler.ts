import { NextRouter } from 'next/router';
import { getSafetyRegionRoute } from '~/utils/reverse-router';
import { RegioPageName } from './types';

export type RegionSelectionHandler = (vrcode: string) => void;

export function createSelectRegionHandler(
  router: NextRouter,
  pageName: RegioPageName,
  openMenu?: boolean
): RegionSelectionHandler {
  return (vrcode) => {
    router.push(
      getSafetyRegionRoute(pageName, vrcode) + openMenu ? `?menu=1` : ''
    );
  };
}
