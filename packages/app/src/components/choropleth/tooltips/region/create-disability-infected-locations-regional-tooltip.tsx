import {
  ChoroplethThresholdsValue,
  RegionsDisabilityCare,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { css } from '@styled-system/css';
import { ReactNode } from 'react';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltipSubject';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { RegionSelectionHandler } from '../../select-handlers/create-select-region-handler';
import { TooltipContent } from '../tooltipContent';

export const createDisablityInfectedLocationsRegionalTooltip = (
  subject: string,
  thresholdValues: ChoroplethThresholdsValue[],
  selectHandler: RegionSelectionHandler
) => (context: SafetyRegionProperties & RegionsDisabilityCare): ReactNode => {
  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context.vrcode);
  };

  return (
    <TooltipContent title={context.vrname} onSelect={onSelect}>
      <TooltipSubject
        subject={subject}
        thresholdValues={thresholdValues}
        filterBelow={context.infected_locations_total}
      >
        <span css={css({ fontWeight: 'bold' })}>
          {`${formatPercentage(
            context.infected_locations_percentage
          )}% (${formatNumber(context.infected_locations_total)})`}{' '}
        </span>
      </TooltipSubject>
    </TooltipContent>
  );
};
