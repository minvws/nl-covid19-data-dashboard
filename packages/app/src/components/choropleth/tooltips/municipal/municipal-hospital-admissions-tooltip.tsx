import { GmHospitalNiceValue, GmProperties } from '@corona-dashboard/common';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { municipalThresholds } from '../../municipal-thresholds';

export function HospitalAdmissionsMunicipalTooltip({
  context,
}: {
  context: GmProperties & GmHospitalNiceValue;
}) {
  const intl = useIntl();
  const reverseRouter = useReverseRouter();
  const subject = intl.siteText.choropleth_tooltip.hospital_admissions;
  const thresholdValues =
    municipalThresholds.hospital_nice.admissions_on_date_of_reporting;

  const { siteText, formatNumber } = useIntl();

  return (
    <TooltipContent
      title={context.gemnaam}
      link={reverseRouter.gm.ziekenhuisopnames(context.gmcode)}
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
  );
}
