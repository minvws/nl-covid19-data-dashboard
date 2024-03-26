import { Box } from './base';
import { fontSizes } from '~/style/theme';
import { Heading } from './typography';
import { Markdown } from '~/components/markdown';
import { Metadata } from '~/components/metadata';
import { MetadataProps } from './metadata/types';
import { Tile } from '~/components/tile';

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
