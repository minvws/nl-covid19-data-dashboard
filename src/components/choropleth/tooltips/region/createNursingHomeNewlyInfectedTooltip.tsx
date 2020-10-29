import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { formatNumber } from '~/utils/formatNumber';
import { createSelectRegionHandler } from '../../selectHandlers/createSelectRegionHandler';
import { SafetyRegionProperties } from '../../shared';

export const createNursingHomeNewlyInfectedTooltip = (router: NextRouter) => (
  context: SafetyRegionProperties & { value: number }
): ReactNode => {
  const handler = createSelectRegionHandler(router);
  const value = context.value;

  const onSelect = (event: any) => {
    event.stopPropagation();
    handler(context);
  };

  return (
    <TooltipContent title={context.vrname} onSelect={onSelect}>
      <strong>{`${formatNumber(value)} per 100.000`}</strong>
    </TooltipContent>
  );
};
