import { NextRouter } from 'next/router';
import { SafetyRegionProperties } from '@corona-dashboard/common';
import { RegioPageName } from './types';

export type RegionSelectionHandler = (context: SafetyRegionProperties) => void;

export function createSelectRegionHandler<T extends { vrcode: string }>(
  router: NextRouter,
  pageName: RegioPageName,
  openMenu?: boolean
) {
  return (value: T) => {
    if (pageName === 'actueel') {
      router.push(
        `/actueel/veiligheidsregio/${value.vrcode}` +
          (openMenu ? '?menu=1' : '')
      );
      return;
    }
    router.push(
      `/veiligheidsregio/${value.vrcode}/${pageName}` +
        (openMenu ? '?menu=1' : '')
    );
  };
}
