import { Children, ReactNode } from 'react';
import { Box } from '~/components-styled/base';
import { Tile } from '~/components-styled/tile';

type MiniTrendTileLayoutProps = {
  children: ReactNode;
};

export function MiniTrendTileLayout({ children }: MiniTrendTileLayoutProps) {
  const miniTrendTiles = Children.toArray(children);

  const columnWidth = `${Math.floor(100 / miniTrendTiles.length)}%`;

  return (
    <Tile>
      <Box display="flex" flexDirection="row">
        {miniTrendTiles.map((tile: ReactNode) => (
          <Box flex={`1 1 ${columnWidth}`}>{tile}</Box>
        ))}
      </Box>
    </Tile>
  );
}
