import { ReactNode } from 'react';
import { RegionsDisabilityCare } from '~/types/data';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { RegionSelectionHandler } from '../../select-handlers/create-select-region-handler';
import { SafetyRegionProperties } from '../../shared';
import { TooltipContent } from '../tooltipContent';

export const createDisablityInfectedLocationsRegionalTooltip = (
  selectHandler: RegionSelectionHandler
) => (context: SafetyRegionProperties & RegionsDisabilityCare): ReactNode => {
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
