import {
  ChoroplethThresholdsValue,
  RegionalHospitalNiceValue,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { ReactNode } from 'react';
import { InlineText } from '~/components-styled/typography';
import { RegionSelectionHandler } from '../../select-handlers/create-select-region-handler';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
import { useIntl } from '~/intl';

export const createRegionHospitalAdmissionsTooltip = (
  subject: string,
  thresholdValues: ChoroplethThresholdsValue[],
  selectHandler: RegionSelectionHandler
) => (
  context: SafetyRegionProperties & RegionalHospitalNiceValue
): ReactNode => {
  const onSelect = (event: any) => {
    event.stopPropagation();
    selectHandler(context.vrcode);
  };

  const { siteText, formatNumber } = useIntl();

  return (
    context && (
      <TooltipContent title={context.vrname} onSelect={onSelect}>
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
    )
  );
};
