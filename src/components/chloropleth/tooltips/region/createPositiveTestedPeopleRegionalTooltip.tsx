import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { TooltipContent } from '~/components/chloropleth/tooltips/tooltipContent';
import { formatNumber } from '~/utils/formatNumber';
import { createSelectRegionHandler } from '../../selectHandlers/createSelectRegionHandler';
import { SafetyRegionProperties } from '../../shared';

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
        <strong>{`${formatNumber(context.value)} per 100.000`}</strong>
      </TooltipContent>
    )
  );
};
