import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { SafetyRegionProperties } from '../../shared';
import { createSelectRegionHandler } from '../../../chloropleth/selectHandlers/createSelectRegionHandler';
import { Tooltip } from '~/components/chloropleth/tooltips/tooltipContent';

export const createPositiveTestedPeopleRegionalTooltip = (
  router: NextRouter
) => (context: SafetyRegionProperties & { value: number }): ReactNode => {
  const handler = createSelectRegionHandler(router);

  const onSelectRegion = (event: any) => {
    event.stopPropagation();
    handler(context);
  };

  return (
    context && (
      <Tooltip title={context.vrname} onSelectRegion={onSelectRegion}>
        <strong>
          {context.value !== undefined ? `${context.value} / 100.000` : '-'}
        </strong>
      </Tooltip>
    )
  );
};
