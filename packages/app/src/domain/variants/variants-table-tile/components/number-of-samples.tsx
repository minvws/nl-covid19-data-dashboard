import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';

export function NumberOfSamples({
  occurrence,
  sampleSize,
}: {
  occurrence: number;
  sampleSize: number;
}) {
  const { formatNumber } = useIntl();

  return (
    <>
      <InlineText fontWeight="bold">{formatNumber(occurrence)}</InlineText>
      <InlineText>/{formatNumber(sampleSize)}</InlineText>
    </>
  );
}
