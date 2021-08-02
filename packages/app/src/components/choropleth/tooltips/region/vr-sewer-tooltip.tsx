import { VrProperties, VrSewerValue } from '@corona-dashboard/common';
import { regionThresholds } from '~/components/choropleth/logic';
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
  context: VrProperties & VrSewerValue;
}) {
  const { siteText, formatNumber } = useIntl();
  const reverseRouter = useReverseRouter();
  const subject = siteText.choropleth_tooltip.sewer_regional;
  const thresholdValues = regionThresholds.sewer.average;
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
      <Text m={0} lineHeight={0}>
        {text.map_tooltip}
      </Text>
    </TooltipContent>
  );
}
