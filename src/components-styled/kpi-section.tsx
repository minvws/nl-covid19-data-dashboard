import { Box, BoxProps } from './base';

export const KpiSection = (props: BoxProps) => (
  <Box
    as="article"
    bg="white"
    borderRadius={5}
    padding={4}
    boxShadow="tile"
    mb={4}
    ml={{ _: -4, sm: 0 }}
    mr={{ _: -4, sm: 0 }}
    {...props}
  ></Box>
);
