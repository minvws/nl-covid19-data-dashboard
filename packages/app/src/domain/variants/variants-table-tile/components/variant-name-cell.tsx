import { BoldText } from '~/components/typography';
import { Cell } from '.';
import { TableText } from '../types';

type VariantNameCellProps = {
  variant: string;
  text: TableText;
  mobile?: boolean;
  narrow?: boolean;
};

export function VariantNameCell(props: VariantNameCellProps) {
  const { variant, text, mobile, narrow } = props;

  const { name: variantName } =
    text.varianten[variant as keyof typeof text.varianten];

  return (
    <Cell mobile={mobile} narrow={narrow}>
      <BoldText>{variantName}</BoldText>
    </Cell>
  );
}
