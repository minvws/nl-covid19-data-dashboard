import {
  ChoroplethThresholdsValue,
  MunicipalityProperties,
  MunicipalSewerValue,
} from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { InlineText, Text } from '~/components-styled/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { MunicipalitySelectionHandler } from '../../select-handlers/create-select-municipal-handler';
import { useIntl } from '~/intl';

export const createSewerMunicipalTooltip = (
  subject: string,
  thresholdValues: ChoroplethThresholdsValue[],
  selectHandler: MunicipalitySelectionHandler
) => (context: MunicipalityProperties & MunicipalSewerValue): ReactNode => {
  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context.gmcode);
  };
  const { siteText, formatNumber } = useIntl();
  const text = siteText.rioolwater_metingen;

  return (
    context && (
      <TooltipContent title={context.gemnaam} onSelect={onSelect}>
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
