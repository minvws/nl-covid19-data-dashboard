import { Box } from '~/components/base';
import { InlineTooltip } from '~/components/inline-tooltip';
import { InlineText } from '~/components/typography';

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
