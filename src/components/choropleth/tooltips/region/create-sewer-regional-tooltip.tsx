import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import siteText from '~/locale/index';
import { RegionalSewerValue } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { createSelectRegionHandler } from '../../select-handlers/create-select-region-handler';
import { SafetyRegionProperties } from '../../shared';
const text = siteText.rioolwater_metingen;

export const createSewerRegionalTooltip = (router: NextRouter) => (
  context: SafetyRegionProperties & RegionalSewerValue
): ReactNode => {
  const handler = createSelectRegionHandler(router);

  const onSelect = (event: any) => {
    event.stopPropagation();
    handler(context);
  };

  return (
    context && (
      <TooltipContent title={context.vrname} onSelect={onSelect}>
        <p className="info-value">
          {`${replaceVariablesInText(text.map_tooltip_value, {
            value: formatNumber(context.average),
          })}`}
        </p>
        <p className="info-total">{text.map_tooltip}</p>
      </TooltipContent>
    )
  );
};
