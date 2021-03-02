import {
  ChoroplethThresholdsValue,
  RegionalSewerValue,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { InlineText, Text } from '~/components-styled/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
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

  return (
    context && (
      <TooltipContent title={context.vrname} onSelect={onSelect}>
        <TooltipSubject
          subject={subject}
          thresholdValues={thresholdValues}
          filterBelow={context.average}
        >
          <InlineText fontWeight="bold">
            {replaceVariablesInText(text.map_tooltip_value, {
              value: formatNumber(context.average),
            })}
          </InlineText>
        </TooltipSubject>
        <Text m={0} lineHeight={0}>
          {text.map_tooltip}
        </Text>
      </TooltipContent>
    )
  );
};
