import { assert, Dictionary } from '@corona-dashboard/common';
import { InlineTooltip } from '~/components/inline-tooltip';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { Cell } from '.';
import { TableText } from '..';

type VariantNameCellProps = {
  variant: string;
  text: TableText;
  mobile?: boolean;
  narrow?: boolean;
};

export function VariantNameCell(props: VariantNameCellProps) {
  const { variant, text, mobile, narrow } = props;

  const { siteText } = useIntl();

  const variantName = (
    siteText.covid_varianten.varianten as Dictionary<string>
  )[variant];

  assert(variantName, `No translation found for variant ${variant}`);

  return (
    <Cell mobile={mobile} narrow={narrow}>
      {variant === 'other' ? (
        <InlineTooltip content={text.anderen_tooltip}>
          <InlineText fontWeight="bold">{variantName}</InlineText>
        </InlineTooltip>
      ) : (
        <InlineText fontWeight="bold">{variantName}</InlineText>
      )}
    </Cell>
  );
}
