import {
  RegionsBehavior,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { InlineText, Text } from '~/components/typography';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { TooltipSubject } from '~/components/choropleth/tooltips/tooltip-subject';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { regionThresholds } from '../../region-thresholds';
import { Box } from '~/components/base';
import { BehaviorFormatted } from '~/domain/behavior/behavior-logic';
import css from '@styled-system/css';
import styled from 'styled-components';
import { getFilteredThresholdValues } from '~/utils/get-filtered-threshold-values';

export function BehaviorTooltip({
  context,
  currentMetric,
  currentComplianceValue,
  currentSupportValue,
}: {
  context: RegionsBehavior & SafetyRegionProperties;
  currentMetric: BehaviorFormatted;
  currentComplianceValue: string | number | null;
  currentSupportValue: string | number | null;
}) {
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();
  // const subject = siteText.choropleth_tooltip.infected_locations;
  // const thresholdValues =
  //   regionThresholds.nursing_home.infected_locations_percentage;

  const complianceFilteredThreshold = getFilteredThresholdValues(
    regionThresholds.behavior_compliance,
    currentComplianceValue
  );

  const supportFilteredThreshold = getFilteredThresholdValues(
    regionThresholds.behavior_support,
    currentSupportValue
  );

  return (
    <TooltipContent
      title={context.vrname}
      link={reverseRouter.vr.gedrag(context.vrcode)}
    >
      <Box maxWidth="240px">
        <Text m={0} mb={2} fontWeight="bold">
          {currentMetric.description}
        </Text>
        <TestItem
          title="Naleving"
          value={currentComplianceValue}
          background={complianceFilteredThreshold.color}
        />
        <TestItem
          title="Draagvlak"
          value={currentSupportValue}
          background={supportFilteredThreshold.color}
        />
      </Box>
    </TooltipContent>
  );
}

function TestItem({ title, value, background }) {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      {title}
      <Box display="flex" alignItems="center">
        <InlineText fontWeight="bold">{value}%</InlineText>
        <LegendaColorBox backgroundColor={background} />
      </Box>
    </Box>
  );
}

const LegendaColorBox = styled.div<{ backgroundColor: string }>((x) =>
  css({
    height: 13,
    width: 13,
    borderRadius: '2px',
    ml: '1',
    backgroundColor: x.backgroundColor,
  })
);
