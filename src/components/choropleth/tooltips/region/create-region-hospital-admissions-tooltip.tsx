import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { SafetyRegionProperties } from '~/components/choropleth/shared';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { RegionHospitalAdmissions } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

export const createRegionHospitalAdmissionsTooltip = (router: NextRouter) => (
  context: SafetyRegionProperties & RegionHospitalAdmissions
): ReactNode => {
  const handler = createSelectRegionHandler(router);

  const onSelect = (event: any) => {
    event.stopPropagation();
    handler(context);
  };

  return (
    context && (
      <TooltipContent title={context.vrname} onSelect={onSelect}>
        <strong>{formatNumber(context.hospital_admissions)}</strong>
      </TooltipContent>
    )
  );
};
