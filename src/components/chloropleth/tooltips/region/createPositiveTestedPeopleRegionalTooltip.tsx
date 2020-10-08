import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { SafetyRegionProperties } from '../../shared';
import { createSelectRegionHandler } from '../../selectHandlers/createSelectRegionHandler';
import { TooltipContent } from '~/components/chloropleth/tooltips/tooltipContent';

export const createPositiveTestedPeopleRegionalTooltip = (
  router: NextRouter
) => (context: SafetyRegionProperties & { value: number }): ReactNode => {
  const handler = createSelectRegionHandler(router);

  const onSelect = (event: any) => {
    event.stopPropagation();
    handler(context);
  };

  return (
    context && (
      <TooltipContent title={context.vrname} onSelect={onSelect}>
        <span>
          {context.value !== undefined ? `${context.value} per 100.000` : '-'}
        </span>
      </TooltipContent>
    )
  );
};
