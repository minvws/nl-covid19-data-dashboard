import {
  VrCollectionDisabilityCare,
  VrProperties,
} from '@corona-dashboard/common';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { regionThresholds } from '../../region-thresholds';
import { TooltipContent } from '../tooltip-content';

export function DisablityInfectedLocationsRegionalTooltip({
  context,
}: {
  context: VrProperties & VrCollectionDisabilityCare;
}) {
  const { formatPercentage, formatNumber, siteText } = useIntl();
  const reverseRouter = useReverseRouter();
  const subject = siteText.choropleth_tooltip.infected_locations;
  const thresholdValues =
    regionThresholds.nursing_home.infected_locations_percentage;

  return (
    <TooltipContent
      title={context.vrname}
      link={reverseRouter.vr.gehandicaptenzorg(context.vrcode)}
    >
      <TooltipSubject
        subject={subject}
        thresholdValues={thresholdValues}
        filterBelow={context.infected_locations_total}
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
