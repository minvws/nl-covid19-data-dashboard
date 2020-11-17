import { Box, Spacer } from './base';
import { Heading } from './typography';
import { Tile } from './layout';
import { MetadataProps, Metadata } from './metadata';
import { DataWarning } from '~/components/dataWarning';

interface KpiTileProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  metadata: MetadataProps;
  showDataWarning?: boolean /* TODO: remove this temporary attribute when it is not used anymore */;
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
  showDataWarning,
}: KpiTileProps) {
  return (
    <Tile height="100%">
      {showDataWarning && <DataWarning />}
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
