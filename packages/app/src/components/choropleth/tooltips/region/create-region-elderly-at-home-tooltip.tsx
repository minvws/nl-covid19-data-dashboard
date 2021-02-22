import {
  ChoroplethThresholdsValue,
  RegionsElderlyAtHome,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { InlineText } from '~/components-styled/typography';
import { RegionSelectionHandler } from '../../select-handlers/create-select-region-handler';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
import siteText from '~/locale/index';
import { formatNumber } from '~/utils/formatNumber';

export const createRegionElderlyAtHomeTooltip = (
  subject: string,
  thresholdValues: ChoroplethThresholdsValue[],
  selectHandler: RegionSelectionHandler
) => (context: SafetyRegionProperties & RegionsElderlyAtHome): ReactNode => {
  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context.vrcode);
  };

  return (
    <TooltipContent title={context.vrname} onSelect={onSelect}>
      <TooltipSubject
        subject={subject}
        thresholdValues={thresholdValues}
        filterBelow={context.positive_tested_daily_per_100k}
      >
        <InlineText fontWeight="bold">
          {`${formatNumber(
            context.positive_tested_daily_per_100k
          )} per ${formatNumber(100_000)} `}
        </InlineText>
        {siteText.common.inwoners}
      </TooltipSubject>
    </TooltipContent>
  );
};
