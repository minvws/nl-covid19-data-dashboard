import {
  RegionsElderlyAtHome,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { Text } from '~/components-styled/typography';
import { RegionSelectionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { formatNumber } from '~/utils/formatNumber';

export const createRegionElderlyAtHomeTooltip = (
  selectHandler: RegionSelectionHandler
) => (context: SafetyRegionProperties & RegionsElderlyAtHome): ReactNode => {
  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context.vrcode);
  };

  return (
    <TooltipContent title={context.vrname} onSelect={onSelect}>
      <Text m={0} fontWeight="bold">
        {formatNumber(context.positive_tested_daily_per_100k)} per{' '}
        {formatNumber(100_000)}
      </Text>
    </TooltipContent>
  );
};
