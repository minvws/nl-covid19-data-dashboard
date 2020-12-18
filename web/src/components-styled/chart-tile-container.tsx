import { Spacer } from './base';
import { Tile } from './layout';
import { Metadata, MetadataProps } from './metadata';

export function ChartTileContainer({
  children,
  metadata,
}: {
  children: React.ReactNode;
  metadata?: MetadataProps;
}) {
  return (
    <Tile mb={4} ml={{ _: -4, sm: 0 }} mr={{ _: -4, sm: 0 }}>
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
