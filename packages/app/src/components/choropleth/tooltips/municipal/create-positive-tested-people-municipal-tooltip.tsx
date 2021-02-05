import {
  MunicipalitiesTestedOverall,
  MunicipalityProperties,
} from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { Text } from '~/components-styled/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import siteText from '~/locale/index';
import { formatPercentage } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { MunicipalitySelectionHandler } from '../../select-handlers/create-select-municipal-handler';
const text = siteText.common.tooltip;

export const createPositiveTestedPeopleMunicipalTooltip = (
  selectHandler?: MunicipalitySelectionHandler
) => (
  context: MunicipalityProperties & MunicipalitiesTestedOverall
): ReactNode => {
  const { gemnaam, infected_per_100k, infected } = context;

  const onSelect = (event: any) => {
    event.stopPropagation();
    if (selectHandler) {
      selectHandler(context.gmcode);
    }
  };

  return (
    <TooltipContent title={gemnaam} onSelect={onSelect}>
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
