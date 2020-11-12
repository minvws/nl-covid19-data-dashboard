import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { RegionalSewerValue } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';
import { createSelectRegionHandler } from '../../select-handlers/create-select-region-handler';
import { SafetyRegionProperties } from '../../shared';
import siteText from '~/locale/index';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const text = siteText.rioolwater_metingen;

export const createSewerRegionalTooltip = (router: NextRouter) => (
  context: RegionalSewerValue & SafetyRegionProperties
): ReactNode => {
  const handler = createSelectRegionHandler(router);

  const onSelect = (event: any) => {
    event.stopPropagation();
    handler(context);
  };

  return (
    context && (
      <TooltipContent title={context.vrname} onSelect={onSelect}>
        <strong>{`${replaceVariablesInText(text.map_tooltip, {
          value: formatNumber(context.average),
        })}`}</strong>
      </TooltipContent>
    )
  );
};
