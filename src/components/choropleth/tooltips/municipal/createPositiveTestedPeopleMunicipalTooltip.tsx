import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { MunicipalityProperties } from '../../shared';
import { createSelectMunicipalHandler } from '../../selectHandlers/createSelectMunicipalHandler';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import siteText from '~/locale/index';
const text = siteText.common.tooltip;

export const createPositiveTestedPeopleMunicipalTooltip = (
  router: NextRouter
) => (
  context: MunicipalityProperties & {
    value: number;
    total_positive_tested_people: number;
  }
): ReactNode => {
  const onSelectHandler = createSelectMunicipalHandler(router);

  const { gemnaam, value, total_positive_tested_people } = context;

  const onSelect = (event: any) => {
    event.stopPropagation();
    onSelectHandler(context);
  };

  return (
    context && (
      <TooltipContent title={gemnaam} onSelect={onSelect}>
        <span>
          {value !== undefined ? (
            <>
              <p className="info-value">{value} per 100.000</p>
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
