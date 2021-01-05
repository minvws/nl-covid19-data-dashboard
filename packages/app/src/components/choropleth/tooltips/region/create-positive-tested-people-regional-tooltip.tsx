import { ReactNode } from 'react';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import siteText from '~/locale/index';
import { RegionsTestedOverall } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { RegionSelectionHandler } from '../../select-handlers/create-select-region-handler';
import { SafetyRegionProperties } from '../../shared';
const text = siteText.common.tooltip;

export const createPositiveTestedPeopleRegionalTooltip = (
  selectHandler: RegionSelectionHandler
) => (context: SafetyRegionProperties & RegionsTestedOverall): ReactNode => {
  const { vrname, infected_per_100k, infected } = context;

  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context);
  };

  return (
    <TooltipContent title={vrname} onSelect={onSelect}>
      <p className="info-value">
        {formatNumber(infected_per_100k)} per 100.000
      </p>
      <p className="info-total">
        {replaceVariablesInText(text.positive_tested_people, {
          totalPositiveTestedPeople: `${infected}`,
        })}
      </p>
    </TooltipContent>
  );
};
