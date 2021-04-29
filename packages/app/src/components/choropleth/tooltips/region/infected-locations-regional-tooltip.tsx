import {
  RegionsNursingHome,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { InlineText } from '~/components/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { regionThresholds } from '../../region-thresholds';

export function InfectedLocationsRegionalTooltip({
  context,
}: {
  context: SafetyRegionProperties & RegionsNursingHome;
}) {
  const { siteText, formatPercentage, formatNumber } = useIntl();
  const reverseRouter = useReverseRouter();
  const subject = siteText.choropleth_tooltip.infected_locations;
  const thresholdValues =
    regionThresholds.nursing_home.infected_locations_percentage;

  return (
    <TooltipContent
      title={context.vrname}
      link={reverseRouter.vr.verpleeghuiszorg(context.vrcode)}
    >
      <TooltipSubject
        subject={subject}
        thresholdValues={thresholdValues}
        filterBelow={context.infected_locations_percentage}
      >
        <InlineText fontWeight="bold">
          {`${formatPercentage(
            context.infected_locations_percentage
          )}% (${formatNumber(context.infected_locations_total)})`}{' '}
        </InlineText>
      </TooltipSubject>
    </TooltipContent>
  );
}
