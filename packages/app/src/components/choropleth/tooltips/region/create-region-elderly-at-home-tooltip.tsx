import {
  ChoroplethThresholdsValue,
  RegionsElderlyAtHome,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { css } from '@styled-system/css';
import { ReactNode } from 'react';
import { RegionSelectionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltipSubject';
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
        <span css={css({ fontWeight: 'bold' })}>
          {formatNumber(context.positive_tested_daily_per_100k)} per{' '}
          {formatNumber(100_000)}{' '}
        </span>
        {siteText.choropleth_tooltip.inhabitants}
      </TooltipSubject>
    </TooltipContent>
  );
};
