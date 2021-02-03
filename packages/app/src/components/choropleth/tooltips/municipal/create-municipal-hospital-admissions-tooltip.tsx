import {
  MunicipalHospitalNiceValue,
  MunicipalityProperties,
} from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { Text } from '~/components-styled/typography';
import { MunicipalitySelectionHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';

export const createMunicipalHospitalAdmissionsTooltip = (
  selectHandler: MunicipalitySelectionHandler
) => (
  context: MunicipalityProperties & MunicipalHospitalNiceValue
): ReactNode => {
  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context);
  };

  return (
    <TooltipContent title={context.gemnaam} onSelect={onSelect}>
      <Text m={0} fontWeight="bold">
        {context.admissions_on_date_of_reporting}
      </Text>
    </TooltipContent>
  );
};
