import {
  ChoroplethThresholdsValue,
  RegionsElderlyAtHome,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { css } from '@styled-system/css';
import { ReactNode } from 'react';
import { Box } from '~/components-styled/base';
import { Text } from '~/components-styled/typography';
import { RegionSelectionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
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

  const filteredThreshold = thresholdValues
    .filter((item: ChoroplethThresholdsValue) => {
      return item.threshold <= context.positive_tested_daily_per_100k;
    })
    .slice(-1)[0];

  return (
    <TooltipContent title={context.vrname} onSelect={onSelect}>
      <Text m={0} mb={1} fontWeight="bold">
        {subject}
      </Text>
      <Text
        m={0}
        css={css({
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'nowrap',
          whiteSpace: 'pre-wrap',
        })}
      >
        <span css={css({ fontWeight: 'bold' })}>
          {formatNumber(context.positive_tested_daily_per_100k)} per{' '}
          {formatNumber(100_000)}{' '}
        </span>
        {siteText.choropleth_tooltip.inhabitants}
        <Box
          height={13}
          width={13}
          borderRadius={'2px'}
          ml={'auto'}
          backgroundColor={filteredThreshold.color}
        />
      </Text>
    </TooltipContent>
  );
};
