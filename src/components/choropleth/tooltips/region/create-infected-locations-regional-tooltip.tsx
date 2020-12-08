import { ReactNode } from 'react';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { RegionsNursingHome } from '~/types/data';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { RegionSelectionHandler } from '../../select-handlers/create-select-region-handler';
import { SafetyRegionProperties } from '../../shared';

export const createInfectedLocationsRegionalTooltip = (
  selectHandler: RegionSelectionHandler
) => (context: SafetyRegionProperties & RegionsNursingHome): ReactNode => {
  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context);
  };

  return (
    <TooltipContent title={context.vrname} onSelect={onSelect}>
      <strong>
        {`${formatPercentage(
          context.infected_locations_percentage
        )}% (${formatNumber(context.infected_locations_total)})`}
      </strong>
    </TooltipContent>
  );
};
