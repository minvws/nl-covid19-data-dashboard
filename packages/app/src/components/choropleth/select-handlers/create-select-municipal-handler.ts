import { NextRouter } from 'next/router';
import { MunicipalityProperties } from '@corona-dashboard/common';
import { PageName } from './types';

export type MunicipalitySelectionHandler = (
  context: MunicipalityProperties
) => void;

export function createSelectMunicipalHandler(
  router: NextRouter,
  pageName: PageName = 'actueel',
  openMenu?: boolean
): MunicipalitySelectionHandler {
  return (context: MunicipalityProperties) => {
    if (!context) {
      return;
    }

    router.push(
      `/gemeente/${context.gemcode}/${pageName}` + (openMenu ? '?menu=1' : '')
    );
  };
}
