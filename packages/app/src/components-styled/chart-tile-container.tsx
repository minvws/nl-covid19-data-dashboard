import { Spacer } from './base';
import { Tile } from '~/components-styled/tile';
import { Metadata, MetadataProps } from './metadata';

export function ChartTileContainer({
  children,
  metadata,
  accessibilitySubject,
}: {
  children: React.ReactNode;
  metadata?: MetadataProps;
  accessibilitySubject: string;
}) {
  return (
    <Tile>
      {children}

      {metadata && (
        <>
          <Spacer m="auto" />
          <Metadata {...metadata} accessibilitySubject={accessibilitySubject} />
        </>
      )}
    </Tile>
  );
}
