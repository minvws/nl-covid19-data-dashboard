import {
  RegionalSewerValue,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { InlineText, Text } from '~/components-styled/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { regionThresholds } from '../../region-thresholds';

export function SewerRegionalTooltip({
  context,
}: {
  context: SafetyRegionProperties & RegionalSewerValue;
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
