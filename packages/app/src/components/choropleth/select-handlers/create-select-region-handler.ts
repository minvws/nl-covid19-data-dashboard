import { NextRouter } from 'next/router';
import { RegioPageName } from './types';

export type RegionSelectionHandler = (vrcode: string) => void;

export function createSelectRegionHandler(
  router: NextRouter,
  pageName: RegioPageName,
  openMenu?: boolean
): RegionSelectionHandler {
  return (vrcode) => {
    if (pageName === 'actueel') {
      router.push(
        `/actueel/veiligheidsregio/${vrcode}` + (openMenu ? '?menu=1' : '')
      );
      return;
    }
    router.push(
      `/veiligheidsregio/${vrcode}/${pageName}` + (openMenu ? '?menu=1' : '')
    );
  };
}
