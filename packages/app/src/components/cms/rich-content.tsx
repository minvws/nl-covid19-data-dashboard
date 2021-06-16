import { PortableTextEntry } from '@sanity/block-content-to-react';
import { Fragment, FunctionComponent, ReactNode } from 'react';
import { getFileSrc, PortableText } from '~/lib/sanity';
import {
  CollapsibleList,
  ImageBlock,
  InlineAttachment,
  RichContentImageBlock,
} from '~/types/cms';
import { assert } from '~/utils/assert';
import { Box } from '../base';
import { CollapsibleSection } from '../collapsible';
import { ErrorBoundary } from '../error-boundary';
import { ContentImage } from './content-image';

interface RichContentProps {
  blocks: PortableTextEntry[];
  contentWrapper?: FunctionComponent;
  imageSizes?: number[][];
}

export function RichContent({
  contentWrapper,
  blocks,
  imageSizes,
}: RichContentProps) {
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
      image: (props: { node: ImageBlock | RichContentImageBlock }) => (
        <ContentImage
          contentWrapper={contentWrapper}
          sizes={imageSizes}
          {...props}
        />
      ),
      collapsible: (props: { node: CollapsibleList }) => {
        if (!props.node.content) return null;

        return (
          <ContentWrapper>
            <CollapsibleSection summary={props.node.title}>
              <Box mt={3}>
                <RichContent blocks={props.node.content} />
              </Box>
            </CollapsibleSection>
          </ContentWrapper>
        );
      },
    },
    marks: {
      inlineAttachment: InlineAttachmentMark,
    },
  };

  return (
    <ErrorBoundary>
      <PortableText blocks={blocks} serializers={serializers} />
    </ErrorBoundary>
  );
}

function InlineAttachmentMark(props: {
  children: ReactNode;
  mark: InlineAttachment;
}) {
  return (
    <a download href={getFileSrc(props.mark.asset)}>
      {props.children}
    </a>
  );
}
