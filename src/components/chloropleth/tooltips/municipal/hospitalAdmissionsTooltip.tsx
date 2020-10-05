import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { MunicipalityProperties } from '~/components/chloropleth/shared';
import { createSelectMunicipalHandler } from '~/components/chloropleth/selectHandlers/createSelectMunicipalHandler';
import { Tooltip } from '~/components/chloropleth/tooltips/tooltipContent';

export const createMunicipalHospitalAdmissionsTooltip = (
  router: NextRouter
) => (context: MunicipalityProperties & { value: number }): ReactNode => {
  const handler = createSelectMunicipalHandler(router);

  const onSelectRegion = (event: any) => {
    event.stopPropagation();
    handler(context);
  };

  return (
    context && (
      <Tooltip title={context.gemnaam} onSelectRegion={onSelectRegion}>
        {context.value !== undefined ? context.value : '-'}
      </Tooltip>
    )
  );
};
