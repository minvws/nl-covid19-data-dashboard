import {
  ChoroplethThresholdsValue,
  RegionsDisabilityCare,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { css } from '@styled-system/css';
import { ReactNode } from 'react';
import { Box } from '~/components-styled/base';
import { Text } from '~/components-styled/typography';
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

  const filteredThreshold = thresholdValues
    .filter((item: ChoroplethThresholdsValue) => {
      return item.threshold <= context.infected_locations_total;
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
          {`${formatPercentage(
            context.infected_locations_percentage
          )}% (${formatNumber(context.infected_locations_total)})`}{' '}
        </span>
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
