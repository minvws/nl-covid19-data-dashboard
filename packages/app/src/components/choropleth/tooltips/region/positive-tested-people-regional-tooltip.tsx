import {
  RegionsTestedOverall,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { InlineText, Text } from '~/components/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
import { useIntl } from '~/intl';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { regionThresholds } from '../../region-thresholds';

export function PositiveTestedPeopleRegionalTooltip({
  context,
}: {
  context: SafetyRegionProperties & RegionsTestedOverall;
}) {
  const { vrname, infected_per_100k, infected } = context;

  const reverseRouter = useReverseRouter();
  const { siteText, formatPercentage, formatNumber } = useIntl();
  const text = siteText.common.tooltip;

  const subject = siteText.choropleth_tooltip.positive_tested_people;
  const thresholdValues = regionThresholds.tested_overall.infected_per_100k;

  return (
    <TooltipContent
      title={vrname}
      link={reverseRouter.vr.positiefGetesteMensen(context.vrcode)}
    >
      <TooltipSubject
        subject={subject}
        thresholdValues={thresholdValues}
        filterBelow={infected_per_100k}
      >
        <InlineText fontWeight="bold">
          {formatPercentage(infected_per_100k)} per {formatNumber(100_000)}{' '}
        </InlineText>
        {siteText.common.inwoners}
      </TooltipSubject>

      <Text m={0} lineHeight={0}>
        {replaceComponentsInText(text.positive_tested_people, {
          totalPositiveTestedPeople: (
            <InlineText fontWeight="bold">{infected}</InlineText>
          ),
        })}
      </Text>
    </TooltipContent>
  );
}
