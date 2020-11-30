import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { RegionsNursingHome } from '~/types/data';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { createSelectRegionHandler } from '../../select-handlers/create-select-region-handler';
import { SafetyRegionProperties } from '../../shared';

export const createInfectedLocationsRegionalTooltip = (router: NextRouter) => (
  context: SafetyRegionProperties & { value: RegionsNursingHome }
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
          {`${formatPercentage(
            context.value.infected_locations_percentage
          )}% (${formatNumber(context.value.infected_locations_total)})`}
        </strong>
      </TooltipContent>
    )
  );
};
