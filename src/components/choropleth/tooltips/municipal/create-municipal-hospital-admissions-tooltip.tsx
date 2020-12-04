import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { MunicipalityProperties } from '~/components/choropleth/shared';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { MunicipalHospitalValue } from '~/types/data';

export const createMunicipalHospitalAdmissionsTooltip = (
  router: NextRouter
) => (context: MunicipalityProperties & MunicipalHospitalValue): ReactNode => {
  const handler = createSelectMunicipalHandler(router);

  const onSelect = (event: any) => {
    event.stopPropagation();
    handler(context);
  };

  return (
    <TooltipContent title={context.gemnaam} onSelect={onSelect}>
      <strong>{context.admissions_moving_average}</strong>
    </TooltipContent>
  );
};
