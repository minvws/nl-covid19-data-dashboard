// import styled from 'styled-components';
// import { space, layout, color, compose } from 'styled-system';
import locale from '~/locale/index';
import { Box, Spacer } from './base';
import { ExternalLink } from './external-link';

interface KpiTileProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  sourcedFrom?: {
    text: string;
    href: string;
  };
}

// const Root = styled.article(compose(space, color, layout));

/**
 * A generic KPI tile which composes its value content using the children prop.
 * Description can be both plain text and html strings.
 */
export function KpiTile({
  title,
  description,
  children,
  sourcedFrom,
}: KpiTileProps) {
  return (
    <Box
      as="article"
      display="flex"
      flexDirection="column"
      bg="white"
      p={4}
      borderRadius={1}
      boxShadow="tile"
      height="100%"
    >
      <h3>{title}</h3>
      <Box mb={4}>{children}</Box>
      {description && (
        <div
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      )}
      {sourcedFrom && (
        <>
          {/* Using a spacer to push the footer down */}
          <Spacer m="auto" />
          <Box as="footer" mt={3}>
            {locale.common.metadata.source}: <ExternalLink {...sourcedFrom} />
          </Box>
        </>
      )}
    </Box>
  );
}
