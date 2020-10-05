import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { SafetyRegionProperties } from '~/components/chloropleth/shared';
import { createSelectRegionHandler } from '~/components/chloropleth/selectHandlers/createSelectRegionHandler';
import { Tooltip } from '~/components/chloropleth/tooltips/tooltipContent';

export const createRegionHospitalAdmissionsTooltip = (router: NextRouter) => (
  context: SafetyRegionProperties & { value: number }
): ReactNode => {
  const handler = createSelectRegionHandler(router);

  const onSelectRegion = (event: any) => {
    event.stopPropagation();
    handler(context);
  };

  return (
    context && (
      <Tooltip title={context.vrname} onSelectRegion={onSelectRegion}>
        {context.value !== undefined ? context.value : '-'}
      </Tooltip>
    )
  );
};
