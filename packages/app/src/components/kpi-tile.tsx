import { Markdown } from '~/components/markdown';
import { Tile } from '~/components/tile';
import { fontSizes } from '~/style/theme';
import { Box } from './base';
import { Metadata, MetadataProps } from './metadata';
import { Heading } from './typography';
interface KpiTileProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  metadata?: MetadataProps;
  hasNoBorder?: boolean;
  hasNoPaddingBottom?: boolean;
}

/**
 * A generic KPI tile which composes its value content using the children prop.
 * Description can be both plain text and html strings.
 */
export function KpiTile({ title, description, children, metadata, hasNoBorder, hasNoPaddingBottom }: KpiTileProps) {
  return (
    <Tile hasNoBorder={hasNoBorder} hasNoPaddingBottom={hasNoPaddingBottom}>
      <Box spacing={3}>
        <Heading level={3}>{title}</Heading>
        {children && <Box spacing={3}>{children}</Box>}

        {description && (
          <Box maxWidth="400px" fontSize={fontSizes[2]} lineHeight={2}>
            <Markdown content={description} />
          </Box>
        )}
      </Box>

      {metadata && <Metadata {...metadata} isTileFooter />}
    </Tile>
  );
}
