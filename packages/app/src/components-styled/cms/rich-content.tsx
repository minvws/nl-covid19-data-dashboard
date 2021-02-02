import { PortableTextEntry } from '@sanity/block-content-to-react';
import { ReactNode } from 'react';
import { Box } from '~/components-styled/base';
import { ContentBlock } from '~/components-styled/cms/content-block';
import { ContentImage } from '~/components-styled/cms/content-image';
import { getFileSrc, PortableText } from '~/lib/sanity';
import { InlineAttachment } from '~/types/cms';
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

    image: ContentImage,
  },

  marks: {
    inlineAttachment,
  },
};

function inlineAttachment(props: {
  children: ReactNode;
  mark: InlineAttachment;
}) {
  return (
    <a download href={getFileSrc(props.mark.asset)}>
      {props.children}
    </a>
  );
}
