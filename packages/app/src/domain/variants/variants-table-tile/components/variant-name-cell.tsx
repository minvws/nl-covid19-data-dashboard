import { InlineTooltip } from '~/components/inline-tooltip';
import { InlineText } from '~/components/typography';
import { Cell } from '.';
import { TableText } from '..';
import { useVariantNameAndDescription } from '../logic/use-variant-name-and-description';

type VariantNameCellProps = {
  variant: string;
  text: TableText;
  mobile?: boolean;
  narrow?: boolean;
};

export function VariantNameCell(props: VariantNameCellProps) {
  const { variant, text, mobile, narrow } = props;

  const [variantName, variantDescription] = useVariantNameAndDescription(
    variant,
    text.anderen_tooltip
  );

  return (
    <Cell mobile={mobile} narrow={narrow}>
      {!mobile && (
        <InlineTooltip content={variantDescription}>
          <InlineText fontWeight="bold">{variantName}</InlineText>
        </InlineTooltip>
      )}
      {mobile && <InlineText fontWeight="bold">{variantName}</InlineText>}
    </Cell>
  );
}
