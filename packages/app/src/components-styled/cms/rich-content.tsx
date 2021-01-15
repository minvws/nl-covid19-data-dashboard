//@ts-expect-error types are not available
import BlockContent from '@sanity/block-content-to-react';
import { Box } from '~/components-styled/base';
import { ContentBlock } from '~/components-styled/cms/content-block';
import { Image } from '~/components-styled/cms/image-block';
import { PortableText } from '~/lib/sanity';
import { Block, RichContentBlock } from '~/types/cms';

export function RichContent({
  blocks,
}: {
  blocks: Block | RichContentBlock[];
}) {
  return (
    <Box fontSize="1.125rem">
      <PortableText blocks={blocks} serializers={serializers} />
    </Box>
  );
}

const serializers = {
  types: {
    block: (props: unknown) => (
      <ContentBlock>
        {BlockContent.defaultSerializers.types.block(props)}
      </ContentBlock>
    ),
    image: Image,
  },
};
