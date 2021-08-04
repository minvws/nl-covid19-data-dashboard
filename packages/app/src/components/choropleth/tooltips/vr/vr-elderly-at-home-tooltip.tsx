import {
  VrCollectionElderlyAtHome,
  VrGeoProperties,
} from '@corona-dashboard/common';
import { vrThresholds } from '~/components/choropleth/logic';
import {
  TooltipContent,
  TooltipSubject,
} from '~/components/choropleth/tooltips';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';

export function VrElderlyAtHomeTooltip({
  context,
}: {
  context: VrGeoProperties & VrCollectionElderlyAtHome;
}) {
  const { siteText, formatNumber } = useIntl();
  const reverseRouter = useReverseRouter();
  const subject = siteText.choropleth_tooltip.elderly_at_home;
  const thresholdValues =
    vrThresholds.elderly_at_home.positive_tested_daily_per_100k;

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
