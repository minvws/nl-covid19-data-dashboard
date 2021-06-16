import { InlineTooltip } from '~/components/inline-tooltip';
import { InlineText } from '~/components/typography';
import { SiteText } from '~/locale';
import { Cell } from '.';
import { Variant } from '../logic/use-variants-table-data';

type VariantNameCellProps = {
  variant: Variant;
  text: SiteText['covid_varianten'];
  compact?: boolean;
};

export function VariantNameCell(props: VariantNameCellProps) {
  const { variant, text, compact } = props;

  return (
    <Cell compact={compact}>
      {variant === 'other' ? (
        <InlineTooltip content={text.varianten_tabel.anderen_tooltip}>
          <InlineText fontWeight="bold">{text.varianten[variant]}</InlineText>
        </InlineTooltip>
      ) : (
        <InlineText fontWeight="bold">{text.varianten[variant]}</InlineText>
      )}
    </Cell>
  );
}
