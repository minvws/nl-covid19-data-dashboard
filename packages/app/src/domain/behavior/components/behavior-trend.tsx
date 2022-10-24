import { colors } from '@corona-dashboard/common';
import { Down, Dot, Up } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { SiteText } from '~/locale';
import { BehaviorTrendType } from '../logic/behavior-types';
import { useIntl } from '~/intl';
interface BehaviorTrendProps {
  trend: BehaviorTrendType | null;
  color?: string;
  text: SiteText['pages']['behavior_page']['shared'];
  ariaLabel?: string;
}

const Trend = styled.span((a) =>
  css({
    whiteSpace: 'nowrap',
    display: 'inline-block',

    svg: {
      color: a.color ?? colors.blue6,
      mr: 1,
      width: '12px',
      height: '12px',
      verticalAlign: 'middle',
    },
  })
);

export function BehaviorTrend({ trend, color, text, ariaLabel }: BehaviorTrendProps) {
  const { commonTexts } = useIntl();
  const TrendLabelUp = ariaLabel || commonTexts.accessibility.visual_context_labels.up_trend_label;
  const TrendLabelDown = ariaLabel || commonTexts.accessibility.visual_context_labels.down_trend_label;
  const TrendLabelNeutral = ariaLabel || commonTexts.accessibility.visual_context_labels.neutral_trend_label;

  if (trend === 'up') {
    return (
      <Trend color={color}>
        <Up aaria-label={TrendLabelUp} />
        {text.basisregels.trend_hoger}
      </Trend>
    );
  }
  if (trend === 'down') {
    return (
      <Trend color={color}>
        <Down aria-label={TrendLabelDown} />
        {text.basisregels.trend_lager}
      </Trend>
    );
  }
  if (trend === 'equal') {
    return (
      <Trend color={colors.neutral}>
        <Dot aria-label={TrendLabelNeutral} />
        {text.basisregels.trend_gelijk}
      </Trend>
    );
  }
  return <Box paddingLeft={`calc(12px + 0.25rem)`}>–</Box>;
}
