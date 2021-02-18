import {
  ChoroplethThresholdsValue,
  RegionsTestedOverall,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { css } from '@styled-system/css';
import { ReactNode } from 'react';
import { Text } from '~/components-styled/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import siteText from '~/locale/index';
import { formatPercentage } from '~/utils/formatNumber';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { RegionSelectionHandler } from '../../select-handlers/create-select-region-handler';
const text = siteText.common.tooltip;
import { formatNumber } from '~/utils/formatNumber';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltipSubject';

export const createPositiveTestedPeopleRegionalTooltip = (
  subject: string,
  thresholdValues: ChoroplethThresholdsValue[],
  selectHandler: RegionSelectionHandler
) => (context: SafetyRegionProperties & RegionsTestedOverall): ReactNode => {
  const { vrname, infected_per_100k, infected } = context;

  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context.vrcode);
  };

  return (
    <TooltipContent title={vrname} onSelect={onSelect}>
      <TooltipSubject
        subject={subject}
        thresholdValues={thresholdValues}
        filterBelow={infected_per_100k}
      >
        <span css={css({ fontWeight: 'bold' })}>
          {formatPercentage(infected_per_100k)} per {formatNumber(100_000)}{' '}
        </span>
        {siteText.choropleth_tooltip.inhabitants}
      </TooltipSubject>

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
