import { Children, ReactNode } from 'react';
import { Box } from '~/components-styled/base';

type MiniTrendTileLayoutProps = {
  children: ReactNode;
};

export function MiniTrendTileLayout({ children }: MiniTrendTileLayoutProps) {
  const tiles = Children.toArray(children);

  const columnWidth = `${Math.floor(100 / tiles.length)}%`;
  const gutter = 4;

  return (
    <Box display={{ _: 'block', md: 'flex' }} overflow="hidden" mx={-gutter}>
      {tiles.map((tile: ReactNode, index: number) => (
        <Box flex={`1 1 ${columnWidth}`} key={index} mx={gutter}>
          {tile}
        </Box>
      ))}
    </Box>
  );
}
