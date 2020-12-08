import { ReactNode } from 'react';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import siteText from '~/locale/index';
import { MunicipalitiesPositiveTestedPeople } from '~/types/data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { MunicipalitySelectionHandler } from '../../select-handlers/create-select-municipal-handler';
import { MunicipalityProperties } from '../../shared';
const text = siteText.common.tooltip;

export const createPositiveTestedPeopleMunicipalTooltip = (
  selectHandler?: MunicipalitySelectionHandler
) => (
  context: MunicipalityProperties & MunicipalitiesPositiveTestedPeople
): ReactNode => {
  const {
    gemnaam,
    positive_tested_people,
    total_positive_tested_people,
  } = context;

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
          {positive_tested_people !== undefined ? (
            <>
              <p className="info-value">{positive_tested_people} per 100.000</p>
              <p className="info-total">
                {replaceVariablesInText(text.positive_tested_people, {
                  totalPositiveTestedPeople: `${total_positive_tested_people}`,
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
