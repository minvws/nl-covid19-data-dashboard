import {
  RegionsTestedOverall,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { Text } from '~/components-styled/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import siteText from '~/locale/index';
import { formatPercentage } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { RegionSelectionHandler } from '../../select-handlers/create-select-region-handler';
const text = siteText.common.tooltip;

export const createPositiveTestedPeopleRegionalTooltip = (
  selectHandler: RegionSelectionHandler
) => (context: SafetyRegionProperties & RegionsTestedOverall): ReactNode => {
  const { vrname, infected_per_100k, infected } = context;

  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context.vrcode);
  };

  return (
    <TooltipContent title={vrname} onSelect={onSelect}>
      <Text m={0} fontWeight="bold">
        {formatPercentage(infected_per_100k)} per 100.000
      </Text>
      <Text m={0}>
        {replaceVariablesInText(text.positive_tested_people, {
          totalPositiveTestedPeople: `${infected}`,
        })}
      </Text>
    </TooltipContent>
  );
};
