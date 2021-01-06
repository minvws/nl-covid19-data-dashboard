import { ReactNode } from 'react';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import siteText from '~/locale/index';
import { MunicipalitiesTestedOverall } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { MunicipalitySelectionHandler } from '../../select-handlers/create-select-municipal-handler';
import { MunicipalityProperties } from '../../shared';
const text = siteText.common.tooltip;

export const createPositiveTestedPeopleMunicipalTooltip = (
  selectHandler?: MunicipalitySelectionHandler
) => (
  context: MunicipalityProperties & MunicipalitiesTestedOverall
): ReactNode => {
  const { gemnaam, infected_per_100k, infected } = context;

  const onSelect = (event: any) => {
    event.stopPropagation();
    if (selectHandler) {
      selectHandler(context);
    }
  };

  return (
    <TooltipContent title={gemnaam} onSelect={onSelect}>
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
