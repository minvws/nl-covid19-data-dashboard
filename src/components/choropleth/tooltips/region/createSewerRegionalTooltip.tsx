import { NextRouter } from 'next/router';
import { ReactNode, useContext } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { RegionalSewerValue } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';
import { createSelectRegionHandler } from '../../selectHandlers/createSelectRegionHandler';
import { SafetyRegionProperties } from '../../shared';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export const createSewerRegionalTooltip = (router: NextRouter) => (
  context: RegionalSewerValue & SafetyRegionProperties
): ReactNode => {
  const handler = createSelectRegionHandler(router);
  const { siteText }: ILocale = useContext(LocaleContext);
  const text = siteText.rioolwater_metingen;

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
