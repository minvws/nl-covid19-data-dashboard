import { Children, ReactNode } from 'react';
import { Box } from '~/components-styled/base';

type MiniTrendTileLayoutProps = {
  children: ReactNode;
};

export function MiniTrendTileLayout({ children }: MiniTrendTileLayoutProps) {
  const tiles = Children.toArray(children);

  const columnWidth = `${Math.floor(100 / tiles.length)}%`;

  return (
    <Box display={{ _: 'block', md: 'flex' }}>
      {tiles.map((tile: ReactNode, index: number) => (
        <Box flex={`1 1 ${columnWidth}`} key={index}>
          {tile}
        </Box>
      ))}
    </Box>
  );
}
