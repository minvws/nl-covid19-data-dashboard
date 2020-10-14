import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { MunicipalityProperties } from '~/components/chloropleth/shared';
import { createSelectMunicipalHandler } from '~/components/chloropleth/selectHandlers/createSelectMunicipalHandler';
import { TooltipContent } from '~/components/chloropleth/tooltips/tooltipContent';

export const createMunicipalHospitalAdmissionsTooltip = (
  router: NextRouter
) => (context: MunicipalityProperties & { value: number }): ReactNode => {
  const handler = createSelectMunicipalHandler(router);

  const onSelect = (event: any) => {
    event.stopPropagation();
    handler(context);
  };

  return (
    context && (
      <TooltipContent title={context.gemnaam} onSelect={onSelect}>
        <strong>{context.value !== undefined ? context.value : '-'}</strong>
      </TooltipContent>
    )
  );
};
