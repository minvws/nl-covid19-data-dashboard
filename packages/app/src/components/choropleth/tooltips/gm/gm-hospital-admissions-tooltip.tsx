import { GmGeoProperties, GmHospitalNiceValue } from '@corona-dashboard/common';
import { gmThresholds } from '~/components/choropleth/logic';
import {
  TooltipContent,
  TooltipSubject,
} from '~/components/choropleth/tooltips';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';

export function GmHospitalAdmissionsTooltip({
  context,
}: {
  context: GmGeoProperties & GmHospitalNiceValue;
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
