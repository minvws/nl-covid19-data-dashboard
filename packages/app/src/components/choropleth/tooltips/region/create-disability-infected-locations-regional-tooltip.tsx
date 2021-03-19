import {
  ChoroplethThresholdsValue,
  RegionsDisabilityCare,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { InlineText } from '~/components-styled/typography';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
import { useIntl } from '~/intl';

import { RegionSelectionHandler } from '../../select-handlers/create-select-region-handler';
import { TooltipContent } from '../tooltip-content';

export const createDisablityInfectedLocationsRegionalTooltip = (
  subject: string,
  thresholdValues: ChoroplethThresholdsValue[],
  selectHandler: RegionSelectionHandler
) => (context: SafetyRegionProperties & RegionsDisabilityCare): ReactNode => {
  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context.vrcode);
  };

  const { formatPercentage, formatNumber } = useIntl();

  return (
    <TooltipContent title={context.vrname} onSelect={onSelect}>
      <TooltipSubject
        subject={subject}
        thresholdValues={thresholdValues}
        filterBelow={context.infected_locations_total}
      >
        <InlineText fontWeight="bold">
          {`${formatPercentage(
            context.infected_locations_percentage
          )}% (${formatNumber(context.infected_locations_total)})`}{' '}
        </InlineText>
      </TooltipSubject>
    </TooltipContent>
  );
};
