import { colors } from '@corona-dashboard/common';
import { InlineTooltip } from '~/components/inline-tooltip';
import { fontSizes } from '~/style/theme';
import { TableText } from '../types';

interface NoPercentageDataProps {
  text: TableText;
}

export function NoPercentageData({ text }: NoPercentageDataProps) {
  return (
    <InlineTooltip content={text.geen_percentage_cijfer_tooltip} color={colors.gray7} fontSize={fontSizes[1]}>
      {text.geen_percentage_cijfer}
    </InlineTooltip>
  );
}
