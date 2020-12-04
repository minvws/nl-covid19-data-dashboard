import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { formatNumber } from '~/utils/formatNumber';
import { createSelectRegionHandler } from '../../select-handlers/create-select-region-handler';
import { SafetyRegionProperties } from '../../shared';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import siteText from '~/locale/index';
import { RegionPositiveTestedPeople } from '~/types/data';
const text = siteText.common.tooltip;

export const createPositiveTestedPeopleRegionalTooltip = (
  router: NextRouter
) => (
  context: SafetyRegionProperties & RegionPositiveTestedPeople
): ReactNode => {
  const handler = createSelectRegionHandler(router);

  const {
    vrname,
    positive_tested_people,
    total_positive_tested_people,
  } = context;

  const onSelect = (event: any) => {
    event.stopPropagation();
    handler(context);
  };

  return (
    context && (
      <TooltipContent title={vrname} onSelect={onSelect}>
        <p className="info-value">
          {formatNumber(positive_tested_people)} per 100.000
        </p>
        <p className="info-total">
          {replaceVariablesInText(text.positive_tested_people, {
            totalPositiveTestedPeople: `${total_positive_tested_people}`,
          })}
        </p>
      </TooltipContent>
    )
  );
};
