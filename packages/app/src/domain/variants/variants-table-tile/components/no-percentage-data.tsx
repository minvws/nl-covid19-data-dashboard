import { InlineTooltip } from '~/components/inline-tooltip';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';

export function NoPercentageData() {
  const { siteText } = useIntl();
  const text = siteText.internationaal_varianten;

  return (
    <InlineTooltip content={text.geen_percentage_cijfer_tooltip}>
      <InlineText color="bodyLight">{text.geen_percentage_cijfer}</InlineText>
    </InlineTooltip>
  );
}
