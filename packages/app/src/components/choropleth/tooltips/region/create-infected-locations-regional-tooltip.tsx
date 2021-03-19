import {
  ChoroplethThresholdsValue,
  RegionsNursingHome,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { InlineText } from '~/components-styled/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
import { useIntl } from '~/intl';

import { RegionSelectionHandler } from '../../select-handlers/create-select-region-handler';

export const createInfectedLocationsRegionalTooltip = (
  subject: string,
  thresholdValues: ChoroplethThresholdsValue[],
  selectHandler: RegionSelectionHandler
) => (context: SafetyRegionProperties & RegionsNursingHome): ReactNode => {
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
        filterBelow={context.infected_locations_percentage}
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
