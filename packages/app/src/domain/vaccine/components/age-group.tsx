import { Box } from '~/components-styled/base';
import { InlineText } from '~/components-styled/typography';

export function AgeGroup(props: { range: string; total: string }) {
  const { range, total } = props;
  return (
    <Box display="flex" flexDirection="column">
      <Box>
        <InlineText fontWeight="bold" fontSize={{ _: 2, md: 3 }}>
          {range}
        </InlineText>
      </Box>
      <Box as="span" fontSize={{ _: 1, md: 2 }}>
        <InlineText>{total}</InlineText>
      </Box>
    </Box>
  );
}
