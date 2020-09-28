import { NextRouter } from 'next/router';
import { MunicipalityProperties } from '../shared';
import { PageNames } from './types';

export type MunicipalitySelectionHandler = (
  context: MunicipalityProperties
) => void;

export function createSelectMunicipalHandler(
  router: NextRouter,
  suffix: PageNames = 'positief-geteste-mensen'
): MunicipalitySelectionHandler {
  return (context: MunicipalityProperties) => {
    if (!context) {
      return;
    }

    router.push(
      `/gemeente/[code]/${suffix}`,
      `/gemeente/${context.gemcode}/${suffix}`
    );
  };
}
