import { colors, DifferenceDecimal } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { useIntl } from '~/intl';
import { TableText } from '../types';
import { TrendDirection, TrendIcon } from '~/components/trend-icon';

type TrendIcon = {
  direction: 'UP' | 'DOWN' | ' NEUTRAL';
  color: string;
};

export function VariantDifference({ value, text }: { value: DifferenceDecimal; text: TableText }) {
  const { formatPercentage } = useIntl();

  const options = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  };

  if (value === undefined) {
    return <>-</>;
  }
  if (value.difference > 0) {
    return (
      <Difference color={colors.black}>
        <TrendIcon trendDirection={TrendDirection.UP} />
        {formatPercentage(value.difference, options)} {text.verschil.meer}
      </Difference>
    );
  }
  if (value.difference < 0) {
    return (
      <Difference color={colors.black}>
        <TrendIcon trendDirection={TrendDirection.DOWN} />
        {formatPercentage(-value.difference, options)} {text.verschil.minder}
      </Difference>
    );
  }
  return (
    <Difference color={colors.neutral}>
      <TrendIcon trendDirection={TrendDirection.NEUTRAL} />
      {text.verschil.gelijk}
    </Difference>
  );
}

const Difference = styled.div<{ color: string }>((x) =>
  css({
    svg: {
      color: x.color,
      mr: 1,
      width: '12px',
      height: '12px',
      verticalAlign: 'middle',
    },
  })
);
