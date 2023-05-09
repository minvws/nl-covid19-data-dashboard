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
import { ImageBlock, InlineAttachment, InlineCollapsibleList, InlineLink, RichContentImageBlock } from '~/types/cms';
import { assert } from '~/utils/assert';
import { isInternalUrl } from '~/utils/is-internal-url';
import { Link } from '~/utils/link';
import { ContentImage } from './content-image';
import { ChevronRight, Download, External as ExternalLinkIcon } from '@corona-dashboard/icons';
import { space } from '~/style/theme';
import { replaceVariablesInText } from '~/utils';
import React from 'react';

type ElementAlignment = 'start' | 'center' | 'end' | 'stretch';

interface RichContentProps {
  blocks?: PortableTextEntry[];
  contentWrapper?: FunctionComponent;
  imageSizes?: string[][];
  elementAlignment?: ElementAlignment;
  variableValue?: string | false;
}

export function RichContent({ contentWrapper, blocks, imageSizes, elementAlignment, variableValue }: RichContentProps) {
  const ContentWrapper = contentWrapper ?? Fragment;
  const serializers = {
    types: {
      inlineBlock: (props: unknown) => {
        assert(
          PortableText.defaultSerializers.types?.inlineBlock,
          `[${RichContent.name}] PortableText needs to provide a serializer for inlineBlock content`
        );
        return <ContentWrapper>{PortableText.defaultSerializers.types.inlineBlock(props)}</ContentWrapper>;
      },
      block: (props: unknown) => {
        assert(
          PortableText.defaultSerializers.types?.block,
          `[${RichContent.name}] PortableText needs to provide a serializer for block content`
        );
        return <ContentWrapper>{PortableText.defaultSerializers.types.block(props)}</ContentWrapper>;
      },
      image: (props: { node: ImageBlock | RichContentImageBlock }) => (
        <ContentImage contentWrapper={contentWrapper} sizes={imageSizes} {...props} />
      ),
      inlineCollapsible: (props: { node: InlineCollapsibleList }) => {
        if (!props.node.content.inlineBlockContent) return null;

        return (
          <ContentWrapper>
            <CollapsibleSection summary={props.node.title}>
              <Box
                paddingY={space[3]}
                css={css({
                  '> div > p': { width: '100%' },

                  /** This is for removing the inline charts default padding
                   * and aligning the KPI's at the start of the flow
                   */
                  '> div > div': {
                    paddingX: '0',
                    alignSelf: 'flex-start',
                    width: '100%',
                  },
                })}
              >
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
      richContentVariable: (props: { children: string[] }) => {
        const { children } = props;
        return (
          <>
            {children.map((child, index) => (
              <React.Fragment key={index}>
                {child.includes('{{kpiValue}}') && variableValue ? replaceVariablesInText(child, { kpiValue: variableValue }) : child}
              </React.Fragment>
            ))}
          </>
        );
      },
    },
  };

  return (
    <ErrorBoundary>
      <StyledPortableText blocks={blocks} serializers={serializers} elementAlignment={elementAlignment} />
    </ErrorBoundary>
  );
}

function InlineAttachmentMark(props: { children: ReactNode; mark: InlineAttachment }) {
  if (!props.mark.asset) return <>{props.children}</>;

  return (
    <a css={css({ textDecoration: 'underline' })} download href={getFileSrc(props.mark.asset)}>
      {props.children} <Download width="15px" height="11px" />
    </a>
  );
}

function InlineLinkMark(props: { children: ReactNode; mark: InlineLink }) {
  const { mark, children } = props;

  const { locale } = useIntl();

  if (!mark.href) return <>{children}</>;

  return isInternalUrl(mark.href) ? (
    <Link href={mark.href} passHref locale={locale}>
      <a css={css({ textDecoration: 'underline' })}>
        {children} <ChevronRight width="10px" height="10px" />
      </a>
    </Link>
  ) : (
    <ExternalLink href={mark.href} underline>
      {children}
      <ExternalLinkIcon width="20px" height="11px" />
    </ExternalLink>
  );
}

const StyledPortableText = styled(PortableText)<{
  elementAlignment?: ElementAlignment;
}>(({ elementAlignment }) =>
  css({
    ...nestedHtml,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: elementAlignment ? elementAlignment : 'center',

    '& > ul': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%',
    },
  })
);
