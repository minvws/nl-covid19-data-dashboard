import { Box, Spacer } from './base';
import { Heading } from './typography';
import { Tile } from '~/components-styled/tile';
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
        <Box
          as="div"
          maxWidth="400px"
          mt={3}
          fontSize={2}
          lineHeight={2}
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
