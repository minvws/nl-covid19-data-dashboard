import {
  GmCollectionTestedOverall,
  GmProperties,
} from '@corona-dashboard/common';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
import { InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { municipalThresholds } from '../../municipal-thresholds';

export function PositiveTestedPeopleMunicipalTooltip({
  context,
}: {
  context: GmProperties & GmCollectionTestedOverall;
}) {
  const { siteText, formatNumber, formatPercentage } = useIntl();
  const reverseRouter = useReverseRouter();
  const text = siteText.common.tooltip;

  const subject = siteText.choropleth_tooltip.positive_tested_people;
  const thresholdValues = municipalThresholds.tested_overall.infected_per_100k;

  const { gemnaam, infected_per_100k, infected } = context;

  return (
    <TooltipContent
      title={gemnaam}
      link={reverseRouter.gm.positiefGetesteMensen(context.gmcode)}
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
      <Text>
        {replaceComponentsInText(text.positive_tested_people, {
          totalPositiveTestedPeople: (
            <InlineText fontWeight="bold">{infected}</InlineText>
          ),
        })}
      </Text>
    </TooltipContent>
  );
}
