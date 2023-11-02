import { BoldText } from '~/components/typography';
import { Cell } from '.';
import { TableText } from '../types';
import { VariantCode } from '~/domain/variants/data-selection/types';

type VariantNameCellProps = {
  variantCode: VariantCode;
  text: TableText;
  mobile?: boolean;
  narrow?: boolean;
};

export function VariantNameCell(props: VariantNameCellProps) {
  const { variantCode, text, mobile, narrow } = props;

  const variantName = text.variantCodes[variantCode];

  return (
    <Cell mobile={mobile} narrow={narrow}>
      <BoldText>{variantName}</BoldText>
    </Cell>
  );
}
