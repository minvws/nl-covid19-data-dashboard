import { NextRouter } from 'next/router';
import { MunicipalityProperties } from '@corona-dashboard/common';
import { PageName } from './types';

export type MunicipalitySelectionHandler = (
  context: MunicipalityProperties
) => void;

export function createSelectMunicipalHandler<T extends { gmcode: string }>(
  router: NextRouter,
  pageName: PageName,
  openMenu?: boolean
) {
  return (value: T) => {
    if (!value) {
      return;
    }

    if (pageName === 'actueel') {
      router.push(
        `/actueel/gemeente/${value.gmcode}` + (openMenu ? '?menu=1' : '')
      );
      return;
    }
    router.push(
      `/gemeente/${value.gmcode}/${pageName}` + (openMenu ? '?menu=1' : '')
    );
  };
}
