import {
  RegionalSewerValue,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { Text } from '~/components-styled/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import siteText from '~/locale/index';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { RegionSelectionHandler } from '../../select-handlers/create-select-region-handler';
const text = siteText.rioolwater_metingen;

export const createSewerRegionalTooltip = (
  selectHandler: RegionSelectionHandler
) => (context: SafetyRegionProperties & RegionalSewerValue): ReactNode => {
  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context.vrcode);
  };

  return (
    context && (
      <TooltipContent title={context.vrname} onSelect={onSelect}>
        <Text m={0} fontWeight="bold">
          {`${replaceVariablesInText(text.map_tooltip_value, {
            value: formatNumber(context.average),
          })}`}
        </Text>
        <Text m={0}>{text.map_tooltip}</Text>
      </TooltipContent>
    )
  );
};
