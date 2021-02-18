import {
  ChoroplethThresholdsValue,
  RegionalSewerValue,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { css } from '@styled-system/css';
import { ReactNode } from 'react';
import { Text } from '~/components-styled/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltipSubject';
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
          <span css={css({ fontWeight: 'bold' })}>
            {`${replaceVariablesInText(text.map_tooltip_value, {
              value: formatNumber(context.average),
            })}`}
          </span>
        </TooltipSubject>
        <Text m={0} mt={-1}>
          {text.map_tooltip}
        </Text>
      </TooltipContent>
    )
  );
};
