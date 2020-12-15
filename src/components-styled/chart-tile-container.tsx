import { DataWarning } from '~/components/dataWarning';
import { Spacer } from './base';
import { Tile } from './layout';
import { Metadata, MetadataProps } from './metadata';

export function ChartTileContainer({
  children,
  showDataWarning,
  metadata,
}: {
  children: React.ReactNode;
  showDataWarning?: boolean;
  metadata?: MetadataProps;
}) {
  return (
    <Tile>
      {showDataWarning && <DataWarning />}

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
