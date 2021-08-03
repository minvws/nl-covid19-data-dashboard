import { VrGeoProperties, VrHospitalNiceValue } from '@corona-dashboard/common';
import { vrThresholds } from '~/components/choropleth/logic';
import {
  TooltipContent,
  TooltipSubject,
} from '~/components/choropleth/tooltips';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';

export function VrHospitalAdmissionsTooltip({
  context,
}: {
  context: VrGeoProperties & VrHospitalNiceValue;
}) {
  const { siteText, formatNumber } = useIntl();
  const reverseRouter = useReverseRouter();
  const subject = siteText.choropleth_tooltip.hospital_admissions;
  const thresholdValues =
    vrThresholds.hospital_nice.admissions_on_date_of_reporting;

  return (
    context && (
      <TooltipContent
        title={context.vrname}
        link={reverseRouter.vr.ziekenhuisopnames(context.vrcode)}
      >
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
}
