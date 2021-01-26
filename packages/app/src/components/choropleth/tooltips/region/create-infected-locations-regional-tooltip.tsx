import {
  RegionsNursingHome,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { Text } from '~/components-styled/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { RegionSelectionHandler } from '../../select-handlers/create-select-region-handler';

export const createInfectedLocationsRegionalTooltip = (
  selectHandler: RegionSelectionHandler
) => (context: SafetyRegionProperties & RegionsNursingHome): ReactNode => {
  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context);
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
