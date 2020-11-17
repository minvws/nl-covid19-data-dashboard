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
    <Tile mb={4} ml={{ _: -4, sm: 0 }} mr={{ _: -4, sm: 0 }}>
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
