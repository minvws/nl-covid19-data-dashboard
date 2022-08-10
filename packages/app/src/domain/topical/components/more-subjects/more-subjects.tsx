import { Box } from '~/components/base';
import { Heading } from '~/components/typography';

export function TopicalTile() {
  return (
    <Box spacing={3}>
      <Box
        display="flex"
        justifyContent={{ _: 'start', xs: 'center' }}
        textAlign={{ xs: 'center' }}
      >
        <Heading as="h3" level={5}>
          Hello WORLD
        </Heading>
      </Box>
    </Box>
  );
}
