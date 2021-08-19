import { PortableTextEntry } from '@sanity/block-content-to-react';
import css from '@styled-system/css';
import { Fragment, FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { CollapsibleSection } from '~/components/collapsible';
import { ErrorBoundary } from '~/components/error-boundary';
import { ExternalLink } from '~/components/external-link';
import { useIntl } from '~/intl';
import { getFileSrc, PortableText } from '~/lib/sanity';
import { nestedHtml } from '~/style/preset';
import {
  ImageBlock,
  InlineAttachment,
  InlineCollapsibleList,
  InlineLink,
  RichContentImageBlock,
} from '~/types/cms';
import { assert } from '~/utils/assert';
import { isAbsoluteUrl } from '~/utils/is-absolute-url';
import { Link } from '~/utils/link';
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
      inlineBlock: (props: unknown) => {
        assert(
          PortableText.defaultSerializers.types?.inlineBlock,
          'PortableText needs to provide a serializer for inlineBlock content'
        );
        return (
          <ContentWrapper>
            {PortableText.defaultSerializers.types.inlineBlock(props)}
          </ContentWrapper>
        );
      },
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
      inlineCollapsible: (props: { node: InlineCollapsibleList }) => {
        if (!props.node.content.inlineBlockContent) return null;

        return (
          <ContentWrapper>
            <CollapsibleSection summary={props.node.title}>
              <Box py={3}>
                <RichContent blocks={props.node.content.inlineBlockContent} />
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

  const { locale } = useIntl();

  if (!mark.href) return <>{children}</>;

  return isAbsoluteUrl(mark.href) ? (
    <ExternalLink href={mark.href}>{children}</ExternalLink>
  ) : (
    <Link href={mark.href} passHref locale={locale}>
      <a>{children}</a>
    </Link>
  );
}

const StyledPortableText = styled(PortableText)(css(nestedHtml));
