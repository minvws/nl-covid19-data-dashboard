import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { SafetyRegionProperties } from '../../shared';
import { createSelectRegionHandler } from '../../selectHandlers/createSelectRegionHandler';
import { TooltipContent } from '~/components/chloropleth/tooltips/tooltipContent';
import { RegionsNursingHome } from '~/types/data';
import { formatPercentage } from '~/utils/formatNumber';

export const createInfectedLocationsRegionalTooltip = (router: NextRouter) => (
  context: RegionsNursingHome & SafetyRegionProperties & { value: number }
): ReactNode => {
  const handler = createSelectRegionHandler(router);

  const onSelect = (event: any) => {
    event.stopPropagation();
    handler(context);
  };

  return (
    context && (
      <TooltipContent title={context.vrname} onSelect={onSelect}>
        <strong>
          {`${
            context.value !== undefined ? context.value : '-'
          } (${formatPercentage(context.infected_locations_percentage)}%)`}
        </strong>
      </TooltipContent>
    )
  );
};
