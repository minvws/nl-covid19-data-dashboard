import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { MunicipalityProperties } from '../../shared';
import { createSelectMunicipalHandler } from '../../select-handlers/create-select-municipal-handler';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import siteText from '~/locale/index';
import { MunicipalitiesPositiveTestedPeople } from '~/types/data';
const text = siteText.common.tooltip;

export const createPositiveTestedPeopleMunicipalTooltip = (
  router: NextRouter
) => (
  context: MunicipalityProperties & MunicipalitiesPositiveTestedPeople
): ReactNode => {
  const onSelectHandler = createSelectMunicipalHandler(router);

  const {
    gemnaam,
    positive_tested_people,
    total_positive_tested_people,
  } = context;

  const onSelect = (event: any) => {
    event.stopPropagation();
    onSelectHandler(context);
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
