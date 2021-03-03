import {
  ChoroplethThresholdsValue,
  MunicipalHospitalNiceValue,
  MunicipalityProperties,
} from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { InlineText } from '~/components-styled/typography';
import { MunicipalitySelectionHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
import siteText from '~/locale/index';
import { formatNumber } from '~/utils/formatNumber';

export const createMunicipalHospitalAdmissionsTooltip = (
  subject: string,
  thresholdValues: ChoroplethThresholdsValue[],
  selectHandler: MunicipalitySelectionHandler
) => (
  context: MunicipalityProperties & MunicipalHospitalNiceValue
): ReactNode => {
  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context.gmcode);
  };

  return (
    <TooltipContent title={context.gemnaam} onSelect={onSelect}>
      <TooltipSubject
        subject={subject}
        thresholdValues={thresholdValues}
        filterBelow={context.admissions_on_date_of_reporting}
      >
        <InlineText fontWeight="bold">
          {formatNumber(context.admissions_on_date_of_reporting)}{' '}
        </InlineText>
        {context.admissions_on_date_of_reporting === 1
          ? siteText.choropleth_tooltip.patients.singular
          : siteText.choropleth_tooltip.patients.plural}
      </TooltipSubject>
    </TooltipContent>
  );
};
