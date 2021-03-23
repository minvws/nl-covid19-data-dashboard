import {
  RegionsElderlyAtHome,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { InlineText } from '~/components-styled/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { regionThresholds } from '../../region-thresholds';

export function ElderlyAtHomeRegionalTooltip({
  context,
}: {
  context: SafetyRegionProperties & RegionsElderlyAtHome;
}) {
  const { siteText, formatNumber } = useIntl();
  const reverseRouter = useReverseRouter();
  const subject = siteText.choropleth_tooltip.elderly_at_home;
  const thresholdValues =
    regionThresholds.elderly_at_home.positive_tested_daily_per_100k;

  return (
    <TooltipContent
      title={context.vrname}
      link={reverseRouter.vr.thuiswonendeOuderen(context.vrcode)}
    >
      <TooltipSubject
        subject={subject}
        thresholdValues={thresholdValues}
        filterBelow={context.positive_tested_daily_per_100k}
      >
        <InlineText fontWeight="bold">
          {`${formatNumber(
            context.positive_tested_daily_per_100k
          )} per ${formatNumber(100_000)} `}
        </InlineText>
        {siteText.common.inwoners}
      </TooltipSubject>
    </TooltipContent>
  );
}
