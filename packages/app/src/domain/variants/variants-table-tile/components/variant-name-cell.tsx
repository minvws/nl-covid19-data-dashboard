import { InlineTooltip } from '~/components/inline-tooltip';
import { BoldText } from '~/components/typography';
import { Cell } from '.';
import { useVariantNameAndDescription } from '../logic';
import { TableText } from '../types';

type VariantNameCellProps = {
  variant: string;
  text: TableText;
  mobile?: boolean;
  narrow?: boolean;
  isTooltipEnabled?: boolean;
};

export function VariantNameCell(props: VariantNameCellProps) {
  const { variant, text, mobile, narrow, isTooltipEnabled } = props;

  const [variantName, variantDescription] = useVariantNameAndDescription(
    variant as keyof typeof text.varianten,
    text.anderen_tooltip,
    text
  );

  return (
    <Cell mobile={mobile} narrow={narrow}>
      {!mobile && isTooltipEnabled && (
        <InlineTooltip content={variantDescription}>
          <BoldText>{variantName}</BoldText>
        </InlineTooltip>
      )}

      {(mobile || !isTooltipEnabled) && <BoldText>{variantName}</BoldText>}
    </Cell>
  );
}
