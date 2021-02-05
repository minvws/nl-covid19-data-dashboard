import { NextRouter } from 'next/router';
import { PageName } from './types';

export type MunicipalitySelectionHandler = (gmcode: string) => void;

export function createSelectMunicipalHandler(
  router: NextRouter,
  pageName: PageName,
  openMenu?: boolean
): MunicipalitySelectionHandler {
  return (gmcode) => {
    if (!gmcode) {
      return;
    }

    if (pageName === 'actueel') {
      router.push(`/actueel/gemeente/${gmcode}` + (openMenu ? '?menu=1' : ''));
      return;
    }
    router.push(
      `/gemeente/${gmcode}/${pageName}` + (openMenu ? '?menu=1' : '')
    );
  };
}
