import {
  RegionsBehavior,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltip-content';
import { InlineText, Text } from '~/components/typography';
import { BehaviorIdentifier } from '~/domain/behavior/behavior-types';
import { useIntl } from '~/intl';
import { getFilteredThresholdValues } from '~/utils/get-filtered-threshold-values';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { regionThresholds } from '../../region-thresholds';

interface BehaviorTooltipProps {
  context: RegionsBehavior & SafetyRegionProperties;
  currentMetric: BehaviorIdentifier;
  currentComplianceValue: number;
  currentSupportValue: number;
}

export function BehaviorTooltip({
  context,
  currentMetric,
  currentComplianceValue,
  currentSupportValue,
}: BehaviorTooltipProps) {
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();

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
      <Box maxWidth="15rem">
        <Text m={0} mb={2} fontWeight="bold">
          {siteText.gedrag_onderwerpen[currentMetric]}
        </Text>
        <TooltipInfo
          title={siteText.nl_gedrag.tooltip_labels.compliance}
          value={currentComplianceValue}
          background={complianceFilteredThreshold.color}
        />
        <TooltipInfo
          title={siteText.nl_gedrag.tooltip_labels.support}
          value={currentSupportValue}
          background={supportFilteredThreshold.color}
        />
      </Box>
    </TooltipContent>
  );
}

interface TooltipInfoProps {
  title: string;
  value: number;
  background: string;
}

function TooltipInfo({ title, value, background }: TooltipInfoProps) {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      {title}
      <Box display="flex" alignItems="center">
        <InlineText fontWeight="bold">{`${value}%`}</InlineText>
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
