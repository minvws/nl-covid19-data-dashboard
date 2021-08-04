import { VrGeoProperties, VrSewerValue } from '@corona-dashboard/common';
import { vrThresholds } from '~/components/choropleth/logic';
import {
  TooltipContent,
  TooltipSubject,
} from '~/components/choropleth/tooltips';
import { InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';

export function VrSewerTooltip({
  context,
}: {
  context: VrGeoProperties & VrSewerValue;
}) {
  const { siteText, formatNumber } = useIntl();
  const reverseRouter = useReverseRouter();
  const subject = siteText.choropleth_tooltip.sewer_regional;
  const thresholdValues = vrThresholds.sewer.average;
  const text = siteText.rioolwater_metingen;

  return (
    <TooltipContent
      title={context.vrname}
      link={reverseRouter.vr.rioolwater(context.vrcode)}
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
