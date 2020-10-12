import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { MunicipalityProperties } from '../../shared';
import { createSelectMunicipalHandler } from '../../selectHandlers/createSelectMunicipalHandler';
import { TooltipContent } from '~/components/chloropleth/tooltips/tooltipContent';

export const createPositiveTestedPeopleMunicipalTooltip = (
  router: NextRouter
) => (context: MunicipalityProperties & { value: number }): ReactNode => {
  const handler = createSelectMunicipalHandler(router);

  const onSelect = (event: any) => {
    event.stopPropagation();
    handler(context);
  };

  return (
    context && (
      <TooltipContent title={context.gemnaam} onSelect={onSelect}>
        <span>
          {context.value !== undefined ? `${context.value} per 100.000` : '-'}
        </span>
      </TooltipContent>
    )
  );
};
