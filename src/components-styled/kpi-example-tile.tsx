import { Box } from './base';
import { Text, Heading } from './typography';
import { Tile } from './layout';
import { MetadataProps, Metadata } from './metadata';

interface Example {
  image: string;
  alt: string;
  description: string;
}

interface KpiExampleProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  metadata: MetadataProps;
  example: Example;
}

/**
 * A generic KPI tile which composes its value content using the children prop.
 * Description can be both plain text and html strings.
 */
export function KpiExampleTile({
  title,
  description,
  children,
  metadata,
  example,
}: KpiExampleProps) {
  return (
    <Tile>
      <Box display="flex" flexWrap="wrap">
        <Box
          mb={4}
          flexGrow={0}
          flexShrink={0}
          flexBasis={{ _: '100%', lg: '50%' }}
          pr={{ _: 0, lg: 4 }}
        >
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
        <Box
          flexGrow={0}
          flexShrink={0}
          flexBasis={{ _: '100%', lg: '50%' }}
          pl={{ _: 0, lg: 4 }}
        >
          <img
            width={315}
            height={100}
            loading="lazy"
            src={example.image}
            alt={example.alt}
          />
          <p>{example.description}</p>
        </Box>
      </Box>
      <Metadata {...metadata} />
    </Tile>
  );
}
