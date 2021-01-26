import { PortableTextEntry } from '@sanity/block-content-to-react';
import { Box } from '~/components-styled/base';
import { ContentBlock } from '~/components-styled/cms/content-block';
import { Image } from '~/components-styled/cms/image';
import { PortableText } from '~/lib/sanity';
import { assert } from '~/utils/assert';

export function RichContent({ blocks }: { blocks: PortableTextEntry[] }) {
  return (
    <Box fontSize="1.125rem">
      <PortableText blocks={blocks} serializers={serializers} />
    </Box>
  );
}

const serializers = {
  types: {
    block: (props: unknown) => {
      assert(
        PortableText.defaultSerializers.types?.block,
        'PortableText needs to provide a serializer for block content'
      );
      return (
        <ContentBlock>
          {PortableText.defaultSerializers.types.block(props)}
        </ContentBlock>
      );
    },
    image: Image,
  },
};
