import { colors } from '@corona-dashboard/common';
import { Down, Gelijk, Up } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { SiteText } from '~/locale';
import { BehaviorTrendType } from '../logic/behavior-types';
interface BehaviorTrendProps {
  trend: BehaviorTrendType | null;
  color?: string;
  text: SiteText['pages']['behaviorPage']['shared'];
}

const Trend = styled.span((a) =>
  css({
    whiteSpace: 'nowrap',
    display: 'inline-block',

    svg: {
      color: a.color ?? '#0090DB',
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
        <Up />
        {text.basisregels.trend_hoger}
      </Trend>
    );
  }
  if (trend === 'down') {
    return (
      <Trend color={color}>
        <Down />
        {text.basisregels.trend_lager}
      </Trend>
    );
  }
  if (trend === 'equal') {
    return (
      <Trend color={colors.data.neutral}>
        <Gelijk />
        {text.basisregels.trend_gelijk}
      </Trend>
    );
  }
  return <Box paddingLeft={`calc(12px + 0.25rem)`}>–</Box>;
}
