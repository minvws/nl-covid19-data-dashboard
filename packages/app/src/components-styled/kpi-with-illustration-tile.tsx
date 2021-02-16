import { Box } from './base';
import { Tile } from '~/components-styled/tile';
import { Metadata, MetadataProps } from './metadata';
import { Heading, Text } from './typography';

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
export function KpiWithIllustrationTile({
  title,
  description,
  children,
  metadata,
  illustration,
}: KpiWithIllustrationProps) {
  return (
    <Tile>
      <Box display="flex" flexWrap="wrap">
        <Box mb={4} flex={{ _: '0 0 100%', lg: '1' }} pr={{ lg: 4 }}>
          <Heading level={3}>{title}</Heading>
          {children}
          {description && (
            <Text
              as="div"
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
          )}
        </Box>
        <Box flex={{ _: '0 0 100%', lg: '1' }} pl={{ lg: 4 }}>
          <img
            width={315}
            height={100}
            loading="lazy"
            src={illustration.image}
            alt={illustration.alt}
          />
          <p>{illustration.description}</p>
        </Box>
      </Box>
      <Metadata accessibilitySubject={title} {...metadata} />
    </Tile>
  );
}
