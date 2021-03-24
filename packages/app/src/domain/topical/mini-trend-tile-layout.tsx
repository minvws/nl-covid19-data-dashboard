import { Children, ReactNode } from 'react';
import { Box } from '~/components-styled/base';

type MiniTrendTileLayoutProps = {
  children: ReactNode;
  id?: string;
};

export function MiniTrendTileLayout({
  children,
  id,
}: MiniTrendTileLayoutProps) {
  const tiles = Children.toArray(children);

  const columnWidth = `${Math.floor(100 / tiles.length)}%`;
  const gutterSize = 4;

  return (
    <Box
      display={{ _: 'block', md: 'flex' }}
      overflow="hidden"
      mx={-gutterSize}
      id={id}
    >
      {tiles.map((tile: ReactNode, index: number) => (
        <Box flex={`1 1 ${columnWidth}`} key={index} mx={gutterSize}>
          {tile}
        </Box>
      ))}
    </Box>
  );
}
