import { ReactNode } from 'react';
import { MunicipalitySelectionHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { MunicipalityProperties } from '~/components/choropleth/shared';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { MunicipalitiesHospitalAdmissions } from '~/types/data';

export const createMunicipalHospitalAdmissionsTooltip = (
  selectHandler: MunicipalitySelectionHandler
) => (
  context: MunicipalityProperties & MunicipalitiesHospitalAdmissions
): ReactNode => {
  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context);
  };

  return (
    <TooltipContent title={context.gemnaam} onSelect={onSelect}>
      <strong>{context.hospital_admissions}</strong>
    </TooltipContent>
  );
};
