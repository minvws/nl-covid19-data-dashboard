import { Box, Spacer } from './base';
import { Text, Heading } from './typography';
import { Tile } from './layout';
import { MetadataProps, Metadata } from './metadata';

interface KpiTileProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  metadata: MetadataProps;
}

/**
 * A generic KPI tile which composes its value content using the children prop.
 * Description can be both plain text and html strings.
 */
export function KpiTile({
  title,
  description,
  children,
  metadata,
}: KpiTileProps) {
  return (
    <Tile height="100%">
      <Heading level={3}>{title}</Heading>
      <Box>{children}</Box>
      {description && (
        <Text
          as="div"
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      )}
      {/* Using a spacer to push the footer down */}
      <Spacer m="auto" />
      <Metadata {...metadata} />
    </Tile>
  );
}
