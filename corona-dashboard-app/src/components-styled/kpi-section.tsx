import { Box, BoxProps } from './base';

export const KpiSection = (props: { children: React.ReactNode } & BoxProps) => (
  <Box
    as="article"
    display="flex"
    bg="white"
    borderRadius={5}
    padding={4}
    boxShadow="tile"
    mb={4}
    ml={{ _: -4, sm: 0 }}
    mr={{ _: -4, sm: 0 }}
    {...(props as any)}
  />
);
