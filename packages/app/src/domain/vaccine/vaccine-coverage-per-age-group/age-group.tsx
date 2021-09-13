import { InlineText } from '~/components/typography';
import { InlineTooltip } from '~/components/inline-tooltip';
import { Box } from '~/components/base';

export function AgeGroup({
  range,
  total,
  tooltipText,
  birthyear_range,
}: {
  range: string;
  total: string;
  tooltipText?: string;
  birthyear_range: string;
}) {
  return (
    <Box display="flex" flexDirection="column">
      {tooltipText ? (
        <InlineTooltip content={tooltipText}>
          <InlineText fontWeight="bold">{range}</InlineText>
        </InlineTooltip>
      ) : (
        <InlineText fontWeight="bold">{range}</InlineText>
      )}

      <InlineText variant="label1">
        {birthyear_range}: {total}
      </InlineText>
    </Box>
  );
}
