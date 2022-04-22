import { colors, DifferenceDecimal } from '@corona-dashboard/common';
import { Down, Gelijk, Up } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import styled from 'styled-components';
import { useIntl } from '~/intl';
import { TableText } from '../types';

export function VariantDifference({
  value,
  text,
}: {
  value: DifferenceDecimal;
  text: TableText;
}) {
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
      <Difference color={colors.body}>
        <Up />
        {formatPercentage(value.difference, options)} {text.verschil.meer}
      </Difference>
    );
  }
  if (value.difference < 0) {
    return (
      <Difference color={colors.body}>
        <Down />
        {formatPercentage(-value.difference, options)} {text.verschil.minder}
      </Difference>
    );
  }
  return (
    <Difference color={colors.data.neutral}>
      <Gelijk color={colors.data.neutral} />
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
