import { BoldText } from '~/components/typography';
import { Cell } from '.';
import { TableText, VariantCodes } from '../types';

type VariantNameCellProps = {
  variant: keyof VariantCodes;
  text: TableText;
  mobile?: boolean;
  narrow?: boolean;
};

export function VariantNameCell(props: VariantNameCellProps) {
  const { variant, text, mobile, narrow } = props;

  const variantName = text.varianten[variant];

  return (
    <Cell mobile={mobile} narrow={narrow}>
      <BoldText>{variantName}</BoldText>
    </Cell>
  );
}
