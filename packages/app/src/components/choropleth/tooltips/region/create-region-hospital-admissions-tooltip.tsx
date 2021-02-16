import {
  ChoroplethThresholdsValue,
  RegionalHospitalNiceValue,
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

export const createRegionHospitalAdmissionsTooltip = (
  subject: string,
  thresholdValues: ChoroplethThresholdsValue[],
  selectHandler: RegionSelectionHandler
) => (
  context: SafetyRegionProperties & RegionalHospitalNiceValue
): ReactNode => {
  const filteredThreshold = thresholdValues
    .filter((item: ChoroplethThresholdsValue) => {
      return item.threshold <= context.admissions_on_date_of_reporting;
    })
    .slice(-1)[0];

  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context.vrcode);
  };

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
            {formatNumber(context.admissions_on_date_of_reporting)}{' '}
          </span>
          {context.admissions_on_date_of_reporting === 1
            ? siteText.choropleth_tooltip.patients.singular
            : siteText.choropleth_tooltip.patients.plural}
          <Box
            height={13}
            width={13}
            borderRadius={'2px'}
            ml={'auto'}
            backgroundColor={filteredThreshold.color}
          />
        </Text>
      </TooltipContent>
    )
  );
};
