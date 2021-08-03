import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { ArrowIconRight } from '~/components/arrow-icon';
import { useIntl } from '~/intl';
import { spacingStyle } from '~/style/functions/spacing';
import { Article, Block, ImageBlock } from '~/types/cms';
import { Link } from '~/utils/link';
import { BackgroundImage } from './background-image';
import { Box } from './base';
import { Anchor, Heading, InlineText, Text } from './typography';

export type ArticleSummary = Pick<
  Article,
  'title' | 'slug' | 'summary' | 'cover' | 'category' | 'categories'
>;

type ArticleTeaserProps = {
  title: string;
  slug: string;
  summary: Block;
  cover: ImageBlock;
  coverSizes: number[][];
};

export function ArticleTeaser(props: ArticleTeaserProps) {
  const { title, slug, summary, cover, coverSizes } = props;
  const { siteText } = useIntl();

  return (
    <Link passHref href={`/artikelen/${slug}`}>
      <StyledArticleTeaser>
        <ZoomContainer height={200}>
          <BackgroundImage image={cover} height={200} sizes={coverSizes} />
        </ZoomContainer>

        <Heading level={4} as="h2">
          {title}
        </Heading>
        <Text>{summary}</Text>

        <InlineText aria-hidden="true" fontWeight="bold" color="link">
          {siteText.common.read_more}
          <Arrow />
        </InlineText>
      </StyledArticleTeaser>
    </Link>
  );
}

const ZoomContainer = styled(ZoomContainerUnstyled)``;

function ZoomContainerUnstyled({
  children,
  height,
  className,
}: {
  height: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Box overflow="hidden" height={height} position="relative">
      <Box className={className}>{children}</Box>
    </Box>
  );
}

const StyledArticleTeaser = styled(Anchor)(
  css({
    minHeight: '26rem',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'body',
    ...spacingStyle(3),

    [`${ZoomContainer}, ${Heading}`]: {
      transitionProperty: 'transform, color',
      transitionDuration: '500ms, 250ms',
      transitionTimingFunction: 'ease-out',
      willChange: 'transform, color',
    },

    '&:hover, &:focus': {
      [ZoomContainer]: {
        transitionDuration: '200ms, 250ms',
        transitionTimingFunction: 'ease-in-out',
        transform: 'scale(1.04)',
      },
      [Heading]: { color: 'link' },
    },
  })
);

function Arrow() {
  return (
    <span css={css({ svg: { height: '11px', width: '13px', mx: '3px' } })}>
      <ArrowIconRight />
    </span>
  );
}
