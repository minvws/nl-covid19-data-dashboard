import {
  RegionsDisabilityCare,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { Text } from '~/components-styled/typography';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { RegionSelectionHandler } from '../../select-handlers/create-select-region-handler';
import { TooltipContent } from '../tooltipContent';

export const createDisablityInfectedLocationsRegionalTooltip = (
  selectHandler: RegionSelectionHandler
) => (context: SafetyRegionProperties & RegionsDisabilityCare): ReactNode => {
  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context.vrcode);
  };

  return (
    <TooltipContent title={context.vrname} onSelect={onSelect}>
      <Text m={0} fontWeight="bold">
        {`${formatPercentage(
          context.infected_locations_percentage
        )}% (${formatNumber(context.infected_locations_total)})`}
      </Text>
    </TooltipContent>
  );
};
