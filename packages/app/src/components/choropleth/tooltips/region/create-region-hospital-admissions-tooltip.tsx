import { ReactNode } from 'react';
import { RegionSelectionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { SafetyRegionProperties } from '@corona-dashboard/common';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { RegionalHospitalNiceValue } from '@corona-dashboard/common';
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
        <strong>{formatNumber(context.admissions_on_date_of_reporting)}</strong>
      </TooltipContent>
    )
  );
};
