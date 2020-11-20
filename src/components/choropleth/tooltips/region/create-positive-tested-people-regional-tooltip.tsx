import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { formatNumber } from '~/utils/formatNumber';
import { createSelectRegionHandler } from '../../select-handlers/create-select-region-handler';
import { SafetyRegionProperties } from '../../shared';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import siteText from '~/locale/index';
const text = siteText.common.tooltip;

export const createPositiveTestedPeopleRegionalTooltip = (
  router: NextRouter
) => (
  context: SafetyRegionProperties & {
    value: number;
    total_positive_tested_people: number;
  }
): ReactNode => {
  const handler = createSelectRegionHandler(router);

  const { vrname, value, total_positive_tested_people } = context;

  const onSelect = (event: any) => {
    event.stopPropagation();
    handler(context);
  };

  return (
    context && (
      <TooltipContent title={vrname} onSelect={onSelect}>
        <p className="info-value">{formatNumber(value)} per 100.000</p>
        <p className="info-total">
          {replaceVariablesInText(text.positive_tested_people, {
            totalPositiveTestedPeople: `${total_positive_tested_people}`,
          })}
        </p>
      </TooltipContent>
    )
  );
};
