import { VrCollectionBehaviorArchived_20221019 } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { TooltipContent } from '~/components/choropleth/tooltips';
import { TooltipData } from '~/components/choropleth/tooltips/types';
import { BoldText } from '~/components/typography';
import { BehaviorIdentifier } from '~/domain/behavior/logic/behavior-types';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { space } from '~/style/theme';
import { getThresholdValue } from '~/utils/get-threshold-value';
import { useReverseRouter } from '~/utils/use-reverse-router';

interface VrBehaviorTooltipProps {
  context: TooltipData<VrCollectionBehaviorArchived_20221019>;
  currentMetric: BehaviorIdentifier;
  currentComplianceValue: number | null;
  currentSupportValue: number | null;
  behaviorType: 'compliance' | 'support';
  text: SiteText['pages']['behavior_page'];
}

export function VrBehaviorTooltip({ context, currentMetric, currentComplianceValue, currentSupportValue, behaviorType, text }: VrBehaviorTooltipProps) {
  const { commonTexts, formatPercentage } = useIntl();
  const reverseRouter = useReverseRouter();
  const complianceThresholdKey = `${currentMetric}_compliance` as const;
  const supportThresholdKey = `${currentMetric}_support` as const;

  const complianceFilteredThreshold = getThresholdValue(thresholds.vr[complianceThresholdKey], currentComplianceValue ?? 0);

  const supportFilteredThreshold = getThresholdValue(thresholds.vr[supportThresholdKey], currentSupportValue ?? 0);

  const complianceTooltipInfo = (
    <TooltipInfo
      title={text.nl.tooltip_labels.compliance}
      value={currentComplianceValue !== null ? `${formatPercentage(currentComplianceValue)}%` : '-'}
      background={complianceFilteredThreshold.color}
    />
  );

  const supportTooltipInfo = (
    <TooltipInfo
      title={text.nl.tooltip_labels.support}
      value={currentSupportValue !== null ? `${formatPercentage(currentSupportValue)}%` : '-'}
      background={supportFilteredThreshold.color}
    />
  );

  return (
    <TooltipContent title={context.featureName} link={reverseRouter.vr.gedrag(context.dataItem.vrcode)}>
      <Box maxWidth="15rem" spacing={2}>
        <BoldText css={css({ marginBottom: space[2] })}>{commonTexts.behavior.subjects[currentMetric]}</BoldText>

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
  value: string;
  background: string;
}

function TooltipInfo({ title, value, background }: TooltipInfoProps) {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      {title}
      <Box display="flex" alignItems="center">
        <BoldText>{value}</BoldText>
        <LegendaColorBox backgroundColor={background} />
      </Box>
    </Box>
  );
}

const LegendaColorBox = styled.div<{ backgroundColor: string }>((x) =>
  css({
    height: '13px',
    width: '13px',
    borderRadius: '2px',
    marginLeft: space[1],
    backgroundColor: x.backgroundColor,
  })
);
