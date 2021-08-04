import { GmGeoProperties, GmSewerValue } from '@corona-dashboard/common';
import { vrThresholds } from '~/components/choropleth/logic';
import {
  TooltipContent,
  TooltipSubject,
} from '~/components/choropleth/tooltips';
import { InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';

export function GmSewerTooltip({
  context,
}: {
  context: GmGeoProperties & GmSewerValue;
}) {
  const { siteText, formatNumber } = useIntl();
  const reverseRouter = useReverseRouter();
  const text = siteText.rioolwater_metingen;

  const subject = siteText.choropleth_tooltip.sewer_regional;
  const thresholdValues = vrThresholds.sewer.average;

  return (
    <TooltipContent
      title={context.gemnaam}
      link={reverseRouter.gm.rioolwater(context.gmcode)}
    >
      <TooltipSubject
        subject={subject}
        thresholdValues={thresholdValues}
        filterBelow={context.average}
      >
        <InlineText fontWeight="bold">
          {replaceVariablesInText(text.map_tooltip_value, {
            value: formatNumber(context.average),
          })}
        </InlineText>
      </TooltipSubject>
      <Text>{text.map_tooltip}</Text>
    </TooltipContent>
  );
}
