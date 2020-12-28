import { Spacer } from './base';
import { Tile } from '~/components-styled/tile';
import { Metadata, MetadataProps } from './metadata';

export function ChartTileContainer({
  children,
  metadata,
}: {
  children: React.ReactNode;
  metadata?: MetadataProps;
}) {
  return (
    <Tile>
      {children}

      {metadata && (
        <>
          <Spacer m="auto" />
          <Metadata {...metadata} />
        </>
      )}
    </Tile>
  );
}
