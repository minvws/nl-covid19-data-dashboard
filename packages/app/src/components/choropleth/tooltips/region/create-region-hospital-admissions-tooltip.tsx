import { ReactNode } from 'react';
import { RegionSelectionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { SafetyRegionProperties } from '~/components/choropleth/shared';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { RegionalHospitalNiceValue } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

export const createRegionHospitalAdmissionsTooltip = (
  selectHandler: RegionSelectionHandler
) => (
  context: SafetyRegionProperties & RegionalHospitalNiceValue
): ReactNode => {
  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context);
  };

  return (
    context && (
      <TooltipContent title={context.vrname} onSelect={onSelect}>
        <strong>{formatNumber(context.admissions_moving_average)}</strong>
      </TooltipContent>
    )
  );
};
