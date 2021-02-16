import {
  ChoroplethThresholdsValue,
  MunicipalitiesTestedOverall,
  MunicipalityProperties,
} from '@corona-dashboard/common';
import { css } from '@styled-system/css';
import { ReactNode } from 'react';
import { Box } from '~/components-styled/base';
import { Text } from '~/components-styled/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import siteText from '~/locale/index';
import { formatPercentage } from '~/utils/formatNumber';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { MunicipalitySelectionHandler } from '../../select-handlers/create-select-municipal-handler';
const text = siteText.common.tooltip;
import { formatNumber } from '~/utils/formatNumber';

export const createPositiveTestedPeopleMunicipalTooltip = (
  subject: string,
  thresholdValues: ChoroplethThresholdsValue[],
  selectHandler?: MunicipalitySelectionHandler
) => (
  context: MunicipalityProperties & MunicipalitiesTestedOverall
): ReactNode => {
  const { gemnaam, infected_per_100k, infected } = context;
  const filteredThreshold = thresholdValues
    .filter((item: ChoroplethThresholdsValue) => {
      return item.threshold <= infected_per_100k;
    })
    .slice(-1)[0];

  const onSelect = (event: any) => {
    event.stopPropagation();
    if (selectHandler) {
      selectHandler(context.gmcode);
    }
  };

  return (
    <TooltipContent title={gemnaam} onSelect={onSelect}>
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
