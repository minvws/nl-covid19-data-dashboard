import { Box } from './base';
import { Tile } from '~/components/tile';
import { Metadata, MetadataProps } from './metadata';
import { Heading } from './typography';
import { css } from '@styled-system/css';
import { Markdown } from '~/components/markdown';
import { space } from '~/style/theme';
interface Illustration {
  image: string;
  alt: string;
  description: string;
}

interface KpiWithIllustrationProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  metadata: MetadataProps;
  illustration: Illustration;
}

/**
 * A generic KPI tile which composes its value content using the children prop.
 * Description can be both plain text and html strings.
 */
export function KpiWithIllustrationTile({ title, description, children, metadata, illustration }: KpiWithIllustrationProps) {
  return (
    <Tile>
      <Box display="flex" flexWrap="wrap">
        <Box marginBottom={space[4]} flex={{ _: '0 0 100%', lg: '1' }} paddingRight={{ lg: space[4] }} spacing={3}>
          <Heading level={3}>{title}</Heading>
          {children}
          {description && <Markdown content={description} />}
        </Box>

        <Box flex={{ _: '0 0 100%', lg: '1' }} paddingLeft={{ lg: space[4] }}>
          <img width="315px" height="100px" loading="lazy" src={illustration.image} alt={illustration.alt} css={css({ marginBottom: space[3] })} />
          <p>{illustration.description}</p>
        </Box>
      </Box>
      <Metadata {...metadata} isTileFooter />
    </Tile>
  );
}
