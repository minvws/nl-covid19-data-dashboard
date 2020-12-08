import { ReactNode } from 'react';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import siteText from '~/locale/index';
import { RegionPositiveTestedPeople } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { RegionSelectionHandler } from '../../select-handlers/create-select-region-handler';
import { SafetyRegionProperties } from '../../shared';
const text = siteText.common.tooltip;

export const createPositiveTestedPeopleRegionalTooltip = (
  selectHandler: RegionSelectionHandler
) => (
  context: SafetyRegionProperties & RegionPositiveTestedPeople
): ReactNode => {
  const {
    vrname,
    positive_tested_people,
    total_positive_tested_people,
  } = context;

  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context);
  };

  return (
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
  );
};
