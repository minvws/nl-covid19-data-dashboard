import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { SiteText } from '~/locale';
import { BehaviorTrendType } from '../logic/behavior-types';
import { TrendDirection, TrendIcon } from '~/components/trend-icon';

type TrendIcon = {
  direction: 'UP' | 'DOWN' | ' NEUTRAL';
  color: string;
};
interface BehaviorTrendProps {
  trend: BehaviorTrendType | null;
  color?: string;
  text: SiteText['pages']['behavior_page']['shared'];
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

export function BehaviorTrend({ trend, color, text }: BehaviorTrendProps) {
  if (trend === 'up') {
    return (
      <Trend color={color}>
        <TrendIcon trendDirection={TrendDirection.UP} />
        {text.basisregels.trend_hoger}
      </Trend>
    );
  }
  if (trend === 'down') {
    return (
      <Trend color={color}>
        <TrendIcon trendDirection={TrendDirection.DOWN} />
        {text.basisregels.trend_lager}
      </Trend>
    );
  }
  if (trend === 'equal') {
    return (
      <Trend color={colors.neutral}>
        <TrendIcon trendDirection={TrendDirection.NEUTRAL} />
        {text.basisregels.trend_gelijk}
      </Trend>
    );
  }
  return <Box paddingLeft={`calc(12px + 0.25rem)`}>–</Box>;
}
