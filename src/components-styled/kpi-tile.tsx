import locale from '~/locale/index';
import { Box, BoxProps, Spacer } from './base';
import { ExternalLink } from './external-link';
import { Text, Heading } from './typography';

interface KpiTileProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  sourcedFrom?: {
    text: string;
    href: string;
  };
}

export const Tile = (props: { children: React.ReactNode } & BoxProps) => (
  <Box
    as="article"
    display="flex"
    flexDirection="column"
    bg="white"
    p={4}
    borderRadius={1}
    boxShadow="tile"
    height="100%"
    {...(props as any)}
  />
);

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
    <Tile>
      <Heading level={3}>{title}</Heading>
      <Box mb={4}>{children}</Box>
      {description && (
        <Text
          as="div"
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      )}
      {sourcedFrom && (
        <>
          {/* Using a spacer to push the footer down */}
          <Spacer m="auto" />
          <Text as="footer" mt={3}>
            {locale.common.metadata.source}: <ExternalLink {...sourcedFrom} />
          </Text>
        </>
      )}
    </Tile>
  );
}
