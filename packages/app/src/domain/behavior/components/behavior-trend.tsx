import { colors } from '@corona-dashboard/common';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { BehaviorTrendType } from '../logic/behavior-types';
import { TrendDirection, TrendIcon } from '~/components/trend-icon';
import { space } from '~/style/theme';

type TrendIcon = {
  direction: 'UP' | 'DOWN' | ' NEUTRAL';
  color: string;
};

interface BehaviorTrendProps {
  trend: BehaviorTrendType | null;
  text: string;
  hasMarginRight?: boolean;
}

export const BehaviorTrend = ({ trend, text, hasMarginRight = false }: BehaviorTrendProps) => {
  if (trend === 'up') {
    return (
      <Trend color={colors.black} hasMarginRight={hasMarginRight}>
        {text}
        <TrendIcon trendDirection={TrendDirection.UP} />
      </Trend>
    );
  }

  if (trend === 'down') {
    return (
      <Trend color={colors.black} hasMarginRight={hasMarginRight}>
        {text}
        <TrendIcon trendDirection={TrendDirection.DOWN} />
      </Trend>
    );
  }

  if (trend === 'equal') {
    return <span>{text}</span>;
  }

  return <Box paddingLeft={`calc(12px + 0.25rem)`}>–</Box>;
};

interface TrendProps {
  color: string;
  hasMarginRight: boolean;
}

const Trend = styled.span<TrendProps>`
  white-space: nowrap;
  display: flex;
  align-items: center;
  color: ${({ color }) => color};

  svg {
    margin-left: ${({ hasMarginRight }) => (hasMarginRight ? undefined : space[1])};
    margin-right: ${({ hasMarginRight }) => (hasMarginRight ? space[1] : undefined)};
    height: 12px;
    width: 12px;
  }
`;
