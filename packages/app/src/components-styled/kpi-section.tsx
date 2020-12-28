import { Box, BoxProps } from './base';

export const KpiSection = (props: { children: React.ReactNode } & BoxProps) => (
  <Box
    as="article"
    display="flex"
    bg="white"
    borderRadius={5}
    padding={4}
    boxShadow="tile"
    {...(props as any)}
  />
);
