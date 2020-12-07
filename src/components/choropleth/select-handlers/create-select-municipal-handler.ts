import { NextRouter } from 'next/router';
import { MunicipalityProperties } from '../shared';
import { PageName } from './types';

export type MunicipalitySelectionHandler = (
  context: MunicipalityProperties
) => void;

export function createSelectMunicipalHandler(
  router: NextRouter,
  pageName: PageName = 'actueel'
): MunicipalitySelectionHandler {
  return (context: MunicipalityProperties) => {
    if (!context) {
      return;
    }

    router.push(`/gemeente/${context.gemcode}/${pageName}`);
  };
}
