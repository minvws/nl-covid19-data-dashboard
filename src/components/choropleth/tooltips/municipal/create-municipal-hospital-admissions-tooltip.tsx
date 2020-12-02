import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { MunicipalityProperties } from '~/components/choropleth/shared';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { MunicipalitiesHospitalAdmissions } from '~/types/data';

export const createMunicipalHospitalAdmissionsTooltip = (
  router: NextRouter
) => (
  context: MunicipalityProperties & MunicipalitiesHospitalAdmissions
): ReactNode => {
  const handler = createSelectMunicipalHandler(router);

  const onSelect = (event: any) => {
    event.stopPropagation();
    handler(context);
  };

  return (
    <TooltipContent title={context.gemnaam} onSelect={onSelect}>
      <strong>{context.hospital_admissions}</strong>
    </TooltipContent>
  );
};
