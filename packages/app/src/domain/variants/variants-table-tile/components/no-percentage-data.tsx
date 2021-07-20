import { InlineTooltip } from '~/components/inline-tooltip';
import { useIntl } from '~/intl';

export function NoPercentageData() {
  const { siteText } = useIntl();
  const text = siteText.internationaal_varianten;

  return (
    <InlineTooltip
      content={text.geen_percentage_cijfer_tooltip}
      color="bodyLight"
      fontSize={1}
    >
      {text.geen_percentage_cijfer}
    </InlineTooltip>
  );
}
