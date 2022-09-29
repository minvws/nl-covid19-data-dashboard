import { InlineTooltip } from '~/components/inline-tooltip';
import { TableText } from '../types';

interface NoPercentageDataProps {
  text: TableText;
}

export function NoPercentageData({ text }: NoPercentageDataProps) {
  return (
    <InlineTooltip
      content={text.geen_percentage_cijfer_tooltip}
      color="gray7"
      fontSize={1}
    >
      {text.geen_percentage_cijfer}
    </InlineTooltip>
  );
}
