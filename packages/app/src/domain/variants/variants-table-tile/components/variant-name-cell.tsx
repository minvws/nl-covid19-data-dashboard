import { assert } from '@corona-dashboard/common';
import { InlineTooltip } from '~/components/inline-tooltip';
import { InlineText } from '~/components/typography';
import { SiteText } from '~/locale';
import { Cell } from '.';

type VariantNameCellProps = {
  variant: string;
  text: SiteText['covid_varianten'];
  mobile?: boolean;
  narrow?: boolean;
};

export function VariantNameCell(props: VariantNameCellProps) {
  const { variant, text, mobile, narrow } = props;

  const variantName = (text.varianten as Record<string, string>)[variant];

  assert(variantName, `No translation found for variant ${variant}`);

  return (
    <Cell mobile={mobile} narrow={narrow}>
      {variant === 'other' ? (
        <InlineTooltip content={text.varianten_tabel.anderen_tooltip}>
          <InlineText fontWeight="bold">{variantName}</InlineText>
        </InlineTooltip>
      ) : (
        <InlineText fontWeight="bold">{variantName}</InlineText>
      )}
    </Cell>
  );
}
