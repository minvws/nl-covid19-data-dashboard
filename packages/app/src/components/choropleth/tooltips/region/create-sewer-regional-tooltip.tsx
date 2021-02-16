import {
  ChoroplethThresholdsValue,
  RegionalSewerValue,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { css } from '@styled-system/css';
import { ReactNode } from 'react';
import { Box } from '~/components-styled/base';
import { Text } from '~/components-styled/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import siteText from '~/locale/index';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { RegionSelectionHandler } from '../../select-handlers/create-select-region-handler';
const text = siteText.rioolwater_metingen;

export const createSewerRegionalTooltip = (
  subject: string,
  thresholdValues: ChoroplethThresholdsValue[],
  selectHandler: RegionSelectionHandler
) => (context: SafetyRegionProperties & RegionalSewerValue): ReactNode => {
  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context.vrcode);
  };

  const filteredThreshold = thresholdValues
    .filter((item: ChoroplethThresholdsValue) => {
      return item.threshold <= context.average;
    })
    .slice(-1)[0];

  return (
    context && (
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
            {`${replaceVariablesInText(text.map_tooltip_value, {
              value: formatNumber(context.average),
            })}`}
          </span>
          <Box
            height={13}
            width={13}
            borderRadius={'2px'}
            ml={'auto'}
            backgroundColor={filteredThreshold.color}
          />
        </Text>
        <Text m={0} mt={-1}>
          {text.map_tooltip}
        </Text>
      </TooltipContent>
    )
  );
};
