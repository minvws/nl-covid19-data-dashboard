import { PortableText, urlFor } from '~/lib/sanity';
import { RichContentBlock, RichContentImageBlock } from '~/types/cms';
import { assert } from '~/utils/assert';

//@ts-expect-error types are not available
import BlockContent from '@sanity/block-content-to-react';
import { Box } from '~/components-styled/base';

export function RichContent({ blocks }: { blocks: RichContentBlock[] }) {
  return <PortableText blocks={blocks} serializers={serializers} />;
}

const serializers = {
  types: {
    block: Block,
    image: Image,
  },
};

function Block(props: unknown) {
  return (
    <Box mx="auto" maxWidth={{ md: 'contentWidth' }}>
      {BlockContent.defaultSerializers.types.block(props)}
    </Box>
  );
}

function Image({ node }: { node: RichContentImageBlock }) {
  const url = urlFor(node).toString();
  assert(
    url !== null,
    `could not get url for node: ${JSON.stringify(node, null, 2)}`
  );

  const caption = node.caption && <figcaption>{node.caption}</figcaption>;

  return node.isFullWidth ? (
    <Box bg="page">
      <Box mx="auto" px={3} py={4} maxWidth={{ md: 'maxWidth' }}>
        <Box as="figure" role="group" spacing={3}>
          <Box
            as="img"
            borderRadius={1}
            boxShadow="tile"
            src={url}
            alt={node.alt}
          />
          {caption}
        </Box>
      </Box>
    </Box>
  ) : (
    <Box maxWidth={{ md: 'contentWidth' }}>
      <Box as="figure" role="group" spacing={3}>
        <img src={url} alt={node.alt} />
        {caption}
      </Box>
    </Box>
  );
}
