import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { createSelectRegionHandler } from '~/components/chloropleth/selectHandlers/createSelectRegionHandler';
import { SafetyRegionProperties } from '~/components/chloropleth/shared';
import { TooltipContent } from '~/components/chloropleth/tooltips/tooltipContent';
import { formatNumber } from '~/utils/formatNumber';

export const createRegionHospitalAdmissionsTooltip = (router: NextRouter) => (
  context: SafetyRegionProperties & { value: number }
): ReactNode => {
  const handler = createSelectRegionHandler(router);

  const onSelect = (event: any) => {
    event.stopPropagation();
    handler(context);
  };

  return (
    context && (
      <TooltipContent title={context.vrname} onSelect={onSelect}>
        <strong>{formatNumber(context.value)}</strong>
      </TooltipContent>
    )
  );
};
