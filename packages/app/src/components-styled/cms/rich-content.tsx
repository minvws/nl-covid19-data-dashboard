import { PortableTextEntry } from '@sanity/block-content-to-react';
import { FunctionComponent, Fragment } from 'react';
import { Image } from '~/components-styled/cms/image';
import { PortableText } from '~/lib/sanity';
import { assert } from '~/utils/assert';

interface RichContentProps {
  blocks: PortableTextEntry[];
  contentWrapper?: FunctionComponent;
}

export function RichContent({ contentWrapper, blocks }: RichContentProps) {
  const ContentWrapper = contentWrapper ?? Fragment;
  const serializers = {
    types: {
      block: (props: unknown) => {
        assert(
          PortableText.defaultSerializers.types?.block,
          'PortableText needs to provide a serializer for block content'
        );
        return (
          <ContentWrapper>
            {PortableText.defaultSerializers.types.block(props)}
          </ContentWrapper>
        );
      },
      image: Image,
    },
  };

  return <PortableText blocks={blocks} serializers={serializers} />;
}
