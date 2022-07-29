import { BoldText } from '~/components/typography';
import { Cell } from '.';
import { TableText } from '../types';
import { VariantCodesKeys } from '../../static-props';

type VariantNameCellProps = {
  variantCode: VariantCodesKeys;
  text: TableText;
  mobile?: boolean;
  narrow?: boolean;
};

export function VariantNameCell(props: VariantNameCellProps) {
  const { variantCode, text, mobile, narrow } = props;

  const variantName = text.varianten[variantCode];

  return (
    <Cell mobile={mobile} narrow={narrow}>
      <BoldText>{variantName}</BoldText>
    </Cell>
  );
}
