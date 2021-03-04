import {
  ChoroplethThresholdsValue,
  MunicipalitiesTestedOverall,
  MunicipalityProperties,
} from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { InlineText, Text } from '~/components-styled/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
import siteText from '~/locale/index';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { MunicipalitySelectionHandler } from '../../select-handlers/create-select-municipal-handler';
const text = siteText.common.tooltip;

export const createPositiveTestedPeopleMunicipalTooltip = (
  subject: string,
  thresholdValues: ChoroplethThresholdsValue[],
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
      <TooltipSubject
        subject={subject}
        thresholdValues={thresholdValues}
        filterBelow={infected_per_100k}
      >
        <InlineText fontWeight="bold">
          {formatPercentage(infected_per_100k)} per {formatNumber(100_000)}{' '}
        </InlineText>
        {siteText.common.inwoners}
      </TooltipSubject>
      <Text m={0} mt={-1}>
        {replaceComponentsInText(text.positive_tested_people, {
          totalPositiveTestedPeople: (
            <InlineText fontWeight="bold">{infected}</InlineText>
          ),
        })}
      </Text>
    </TooltipContent>
  );
};
