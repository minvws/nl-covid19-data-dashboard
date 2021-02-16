import {
  ChoroplethThresholdsValue,
  RegionsTestedOverall,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { css } from '@styled-system/css';
import { ReactNode } from 'react';
import { Box } from '~/components-styled/base';
import { Text } from '~/components-styled/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import siteText from '~/locale/index';
import { formatPercentage } from '~/utils/formatNumber';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { RegionSelectionHandler } from '../../select-handlers/create-select-region-handler';
const text = siteText.common.tooltip;
import { formatNumber } from '~/utils/formatNumber';

export const createPositiveTestedPeopleRegionalTooltip = (
  subject: string,
  thresholdValues: ChoroplethThresholdsValue[],
  selectHandler: RegionSelectionHandler
) => (context: SafetyRegionProperties & RegionsTestedOverall): ReactNode => {
  const { vrname, infected_per_100k, infected } = context;

  const filteredThreshold = thresholdValues
    .filter((item: ChoroplethThresholdsValue) => {
      return item.threshold <= infected_per_100k;
    })
    .slice(-1)[0];

  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context.vrcode);
  };

  return (
    <TooltipContent title={vrname} onSelect={onSelect}>
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
          {formatPercentage(infected_per_100k)} per {formatNumber(100_000)}{' '}
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
      <Text m={0} mt={-1}>
        {replaceComponentsInText(text.positive_tested_people, {
          totalPositiveTestedPeople: (
            <span css={css({ fontWeight: 'bold' })}>{infected}</span>
          ),
        })}
      </Text>
    </TooltipContent>
  );
};
