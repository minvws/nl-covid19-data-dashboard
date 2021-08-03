import {
  VrCollectionBehavior,
  VrGeoProperties,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { vrThresholds } from '~/components/choropleth/logic';
import { TooltipContent } from '~/components/choropleth/tooltips';
import { InlineText, Text } from '~/components/typography';
import { BehaviorIdentifier } from '~/domain/behavior/logic/behavior-types';
import { useIntl } from '~/intl';
import { getFilteredThresholdValues } from '~/utils/get-filtered-threshold-values';
import { useReverseRouter } from '~/utils/use-reverse-router';

interface VrBehaviorTooltipProps {
  context: VrCollectionBehavior & VrGeoProperties;
  currentMetric: BehaviorIdentifier;
  currentComplianceValue: number;
  currentSupportValue: number;
  behaviorType: 'compliance' | 'support';
}

export function VrBehaviorTooltip({
  context,
  currentMetric,
  currentComplianceValue,
  currentSupportValue,
  behaviorType,
}: VrBehaviorTooltipProps) {
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();
  const complianceThresholdKey = `${currentMetric}_compliance` as const;
  const supportThresholdKey = `${currentMetric}_support` as const;

  const complianceFilteredThreshold = getFilteredThresholdValues(
    vrThresholds.behavior[complianceThresholdKey],
    currentComplianceValue
  );

  const supportFilteredThreshold = getFilteredThresholdValues(
    vrThresholds.behavior[supportThresholdKey],
    currentSupportValue
  );

  const complianceTooltipInfo = (
    <TooltipInfo
      title={siteText.nl_gedrag.tooltip_labels.compliance}
      value={currentComplianceValue}
      background={complianceFilteredThreshold.color}
    />
  );

  const supportTooltipInfo = (
    <TooltipInfo
      title={siteText.nl_gedrag.tooltip_labels.support}
      value={currentSupportValue}
      background={supportFilteredThreshold.color}
    />
  );

  return (
    <TooltipContent
      title={context.vrname}
      link={reverseRouter.vr.gedrag(context.vrcode)}
    >
      <Box maxWidth="15rem" spacing={2}>
        <Text fontWeight="bold">
          {siteText.gedrag_onderwerpen[currentMetric]}
        </Text>

        {/* Change order of the info based on the metric name */}
        {behaviorType === 'compliance' ? (
          <div>
            {complianceTooltipInfo}
            {supportTooltipInfo}
          </div>
        ) : (
          <div>
            {supportTooltipInfo}
            {complianceTooltipInfo}
          </div>
        )}
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
