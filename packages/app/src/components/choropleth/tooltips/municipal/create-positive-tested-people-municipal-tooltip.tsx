import { ReactNode } from 'react';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import siteText from '~/locale/index';
import { MunicipalitiesTestedOverall } from '~/types/data';
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
    context && (
      <TooltipContent title={gemnaam} onSelect={onSelect}>
        <span>
          {infected_per_100k !== undefined ? (
            <>
              <p className="info-value">
                {replaceVariablesInText(text.positive_tested_value, {
                  totalPositiveValue: `${infected_per_100k}`,
                })}
              </p>
              <p className="info-total">
                {replaceVariablesInText(text.positive_tested_people, {
                  totalPositiveTestedPeople: `${infected}`,
                })}
              </p>
            </>
          ) : (
            '-'
          )}
        </span>
      </TooltipContent>
    )
  );
};
