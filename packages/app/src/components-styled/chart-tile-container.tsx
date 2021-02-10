import { Spacer } from './base';
import { Tile } from '~/components-styled/tile';
import { Metadata, MetadataProps } from './metadata';

export function ChartTileContainer({
  children,
  metadata,
  title,
}: {
  children: React.ReactNode;
  metadata?: MetadataProps;
  title: string;
}) {
  return (
    <Tile>
      {children}

      {metadata && (
        <>
          <Spacer m="auto" />
          <Metadata {...metadata} title={title} />
        </>
      )}
    </Tile>
  );
}
