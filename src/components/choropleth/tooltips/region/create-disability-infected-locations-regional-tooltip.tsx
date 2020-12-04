import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { RegionsDisabilityCare } from '~/types/data';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { createSelectRegionHandler } from '../../select-handlers/create-select-region-handler';
import { SafetyRegionProperties } from '../../shared';
import { TooltipContent } from '../tooltipContent';

export const createDisablityInfectedLocationsRegionalTooltip = (
  router: NextRouter
) => (context: SafetyRegionProperties & RegionsDisabilityCare): ReactNode => {
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
            context.infected_locations_percentage
          )}% (${formatNumber(context.infected_locations_total)})`}
        </strong>
      </TooltipContent>
    )
  );
};
