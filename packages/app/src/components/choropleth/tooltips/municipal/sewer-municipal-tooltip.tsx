import { GmProperties, GmSewerValue } from '@corona-dashboard/common';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
import { InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { regionThresholds } from '../../region-thresholds';

export function SewerMunicipalTooltip({
  context,
}: {
  context: GmProperties & GmSewerValue;
}) {
  const { siteText, formatNumber } = useIntl();
  const reverseRouter = useReverseRouter();
  const text = siteText.rioolwater_metingen;

  const subject = siteText.choropleth_tooltip.sewer_regional;
  const thresholdValues = regionThresholds.sewer.average;

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
      <Text m={0} lineHeight={0}>
        {text.map_tooltip}
      </Text>
    </TooltipContent>
  );
}
