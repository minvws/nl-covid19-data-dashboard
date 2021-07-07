import { VrHospitalNiceValue, VrProperties } from '@corona-dashboard/common';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { regionThresholds } from '../../region-thresholds';

export function HospitalAdmissionsRegionalTooltip({
  context,
}: {
  context: VrProperties & VrHospitalNiceValue;
}) {
  const { siteText, formatNumber } = useIntl();
  const reverseRouter = useReverseRouter();
  const subject = siteText.choropleth_tooltip.hospital_admissions;
  const thresholdValues =
    regionThresholds.hospital_nice.admissions_on_date_of_reporting;

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
