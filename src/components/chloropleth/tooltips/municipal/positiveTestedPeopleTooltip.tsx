import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { MunicipalityProperties } from '../../shared';
import { createSelectMunicipalHandler } from '../../../chloropleth/selectHandlers/createSelectMunicipalHandler';
import { Tooltip } from '~/components/chloropleth/tooltips/tooltipContent';

export const createPositiveTestedPeopleMunicipalTooltip = (
  router: NextRouter
) => (context: MunicipalityProperties & { value: number }): ReactNode => {
  const handler = createSelectMunicipalHandler(router);

  const onSelectRegion = (event: any) => {
    event.stopPropagation();
    handler(context);
  };

  return (
    context && (
      <Tooltip title={context.gemnaam} onSelectRegion={onSelectRegion}>
        {context.value !== undefined ? `${context.value} / 100.000` : '-'}
      </Tooltip>
    )
  );
};
