import { NextRouter } from 'next/router';
import { MunicipalityPageName } from './types';
import { getMunicipalityRoute } from '~/utils/reverse-router';

export type MunicipalitySelectionHandler = (gmcode: string) => void;

export function createSelectMunicipalHandler(
  router: NextRouter,
  pageName: MunicipalityPageName,
  openMenu?: boolean
): MunicipalitySelectionHandler {
  return (gmcode) => {
    router.push(
      getMunicipalityRoute(pageName, gmcode) + openMenu ? `?menu=1` : ''
    );
  };
}
