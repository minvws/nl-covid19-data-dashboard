import { PortableTextEntry } from '@sanity/block-content-to-react';
import { Fragment, FunctionComponent, ReactNode } from 'react';
import { getFileSrc, PortableText } from '~/lib/sanity';
import {
  CollapsibleList,
  ImageBlock,
  InlineAttachment,
  InlineLink,
  RichContentImageBlock,
} from '~/types/cms';
import { assert } from '~/utils/assert';
import { Box } from '../base';
import { CollapsibleSection } from '../collapsible';
import { ErrorBoundary } from '../error-boundary';
import { ContentImage } from './content-image';
import { ExternalLink } from '~/components/external-link';
import { Link } from '~/utils/link';
import { isAbsoluteUrl } from '~/utils/is-absolute-url';
import styled from 'styled-components';
import { preset } from '~/style/preset';
import css from '@styled-system/css';
import { spacingStyle } from '~/style/functions/spacing';
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
              <Box py={3}>
                <RichContent blocks={props.node.content} />
              </Box>
            </CollapsibleSection>
          </ContentWrapper>
        );
      },
    },
    marks: {
      inlineAttachment: InlineAttachmentMark,
      link: InlineLinkMark,
    },
  };

  return (
    <ErrorBoundary>
      <StyledPortableText blocks={blocks} serializers={serializers} />
    </ErrorBoundary>
  );
}

function InlineAttachmentMark(props: {
  children: ReactNode;
  mark: InlineAttachment;
}) {
  if (!props.mark.asset) return <>{props.children}</>;

  return (
    <a download href={getFileSrc(props.mark.asset)}>
      {props.children}
    </a>
  );
}

function InlineLinkMark(props: { children: ReactNode; mark: InlineLink }) {
  const { mark, children } = props;

  if (!mark.href) return <>{children}</>;

  return isAbsoluteUrl(mark.href) ? (
    <ExternalLink href={mark.href}>{children}</ExternalLink>
  ) : (
    <Link href={mark.href} passHref>
      <a>{children}</a>
    </Link>
  );
}

const StyledPortableText = styled(PortableText)(
  css({
    ...spacingStyle(3),
    p: preset.typography.body2,
    h1: preset.typography.h1,
    h2: preset.typography.h2,
    h3: preset.typography.h3,
    h4: preset.typography.h4,
    h5: preset.typography.h5,
    strong: { fontWeight: 'bold' },
    em: { fontStyle: 'italic' },
    ul: { ml: 4 },
    ol: { ml: 4 },
    a: { textDecoration: 'underline' },
  })
);
