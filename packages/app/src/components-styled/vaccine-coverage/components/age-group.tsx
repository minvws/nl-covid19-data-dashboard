import { Box } from '~/components-styled/base';
import { InlineText } from '~/components-styled/typography';

export function AgeGroup(props: { range: string; count: string }) {
  const { range, count } = props;
  return (
    <Box flex="display" flexDirection="column">
      <Box>
        <InlineText fontWeight="bold" fontSize={3}>
          {range}
        </InlineText>
      </Box>
      <Box as="span">
        <InlineText>{count}</InlineText>
      </Box>
    </Box>
  );
}
