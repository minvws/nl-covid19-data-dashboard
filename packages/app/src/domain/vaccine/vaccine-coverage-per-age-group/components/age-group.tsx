import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';

interface AgeGroupProps {
  range: string;
  total?: string;
  birthyear_range: string;
}

export function AgeGroup({ range, total, birthyear_range }: AgeGroupProps) {
  return (
    <Box display="flex" flexDirection="column">
      <InlineText fontWeight="bold">{range}</InlineText>
      <InlineText variant="label1">
        {`${birthyear_range}${total ? `: ${total}` : ''}`}
      </InlineText>
    </Box>
  );
}
