import { GmHospitalNiceValue, GmProperties } from '@corona-dashboard/common';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { gmThresholds } from '../../gm-thresholds';

export function HospitalAdmissionsGmTooltip({
  context,
}: {
  context: GmProperties & GmHospitalNiceValue;
}) {
  const intl = useIntl();
  const reverseRouter = useReverseRouter();
  const subject = intl.siteText.choropleth_tooltip.hospital_admissions;
  const thresholdValues =
    gmThresholds.hospital_nice.admissions_on_date_of_reporting;

  const { siteText, formatNumber } = useIntl();

  return (
    <TooltipContent
      title={context.gemnaam}
      link={reverseRouter.gm.ziekenhuisopnames(context.gmCode)}
    >
      <TooltipSubject
        subject={subject}
        thresholdValues={thresholdValues}
        filterBelow={context.admissions_on_date_of_reporting}
      >
        \
        <InlineText fontWeight="bold">
          {formatNumber(context.admissions_on_date_of_reporting)}{' '}
        </InlineText>
        {context.admissions_on_date_of_reporting === 1
          ? siteText.choropleth_tooltip.patients.singular
          : siteText.choropleth_tooltip.patients.plural}
      </TooltipSubject>
    </TooltipContent>
  );
}
