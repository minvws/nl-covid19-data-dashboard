import { ReactNode } from 'react';
import { RegionSelectionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { SafetyRegionProperties } from '~/components/choropleth/shared';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { RegionsElderlyAtHome } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

export const createRegionElderlyAtHomeTooltip = (
  selectHandler: RegionSelectionHandler
) => (context: SafetyRegionProperties & RegionsElderlyAtHome): ReactNode => {
  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context);
  };

  return (
    <TooltipContent title={context.vrname} onSelect={onSelect}>
      <strong>
        {formatNumber(context.positive_tested_daily_per_100k)} per{' '}
        {formatNumber(100_000)}
      </strong>
    </TooltipContent>
  );
};
