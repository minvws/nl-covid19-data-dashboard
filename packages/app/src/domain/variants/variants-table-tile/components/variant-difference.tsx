import { colors, DifferenceDecimal } from '@corona-dashboard/common';
import { Down, Dot, Up } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import styled from 'styled-components';
import { useIntl } from '~/intl';
import { TableText } from '../types';

export function VariantDifference({ value, text, ariaLabel }: { value: DifferenceDecimal; text: TableText; ariaLabel?: string }) {
  const { formatPercentage, commonTexts } = useIntl();

  const options = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  };
  const TrendLabelUp = ariaLabel || commonTexts.accessibility.visual_context_labels.up_trend_label;
  const TrendLabelDown = ariaLabel || commonTexts.accessibility.visual_context_labels.down_trend_label;
  const TrendLabelNeutral = ariaLabel || commonTexts.accessibility.visual_context_labels.neutral_trend_label;

  if (value === undefined) {
    return <>-</>;
  }
  if (value.difference > 0) {
    return (
      <Difference color={colors.black}>
        <Up aria-label={TrendLabelUp} />
        {formatPercentage(value.difference, options)} {text.verschil.meer}
      </Difference>
    );
  }
  if (value.difference < 0) {
    return (
      <Difference color={colors.black}>
        <Down aria-label={TrendLabelDown} />
        {formatPercentage(-value.difference, options)} {text.verschil.minder}
      </Difference>
    );
  }
  return (
    <Difference color={colors.neutral}>
      <Dot color={colors.neutral} aria-label={TrendLabelNeutral} />
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
