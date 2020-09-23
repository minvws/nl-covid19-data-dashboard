import { NextRouter } from 'next/router';
import { MunicipalityProperties } from '../shared';

export type MunicipalitySelectionHandler = (
  context: MunicipalityProperties
) => void;

export function createSelectMunicipalHandler(
  router: NextRouter
): MunicipalitySelectionHandler {
  return (context: MunicipalityProperties) => {
    router.push(
      '/gemeente/[code]/positief-geteste-mensen',
      `/gemeente/${context.gemcode}/positief-geteste-mensen`
    );
  };
}
