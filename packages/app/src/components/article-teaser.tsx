import { ReactNode } from 'react';
import styled from 'styled-components';
import { useIntl } from '~/intl';
import { Article, Block, ImageBlock } from '~/types/cms';
import { Link } from '~/utils/link';
import { BackgroundImage } from './background-image';
import { Box } from './base';
import { Anchor, Heading, Text } from './typography';
import { colors } from '@corona-dashboard/common';
import { fontWeights, radii, space } from '~/style/theme';
import { ChevronRight } from '@corona-dashboard/icons';

export type ArticleSummary = Pick<Article, 'title' | 'slug' | 'summary' | 'cover' | 'category' | 'categories' | 'publicationDate' | 'mainCategory'>;

interface ArticleTeaserProps {
  cover: ImageBlock;
  coverSizes: string[][];
  slug: string;
  summary: Block;
  title: string;
  mainCategory: string | undefined;
  publishedDate: Date;
}

// TODO: Redesign article teaser
export const ArticleTeaser = (props: ArticleTeaserProps) => {
  const { title, slug, summary, cover, coverSizes, mainCategory, publishedDate } = props;
  const { commonTexts, formatDate } = useIntl();

  return (
    <Box as="article" border={`1px solid ${colors.gray3}`} borderRadius={`${radii[2]}px`} overflow="hidden">
      <Link passHref href={`/artikelen/${slug}`}>
        <StyledArticleTeaser>
          {cover.asset && (
            <ZoomContainer height="200px">
              <BackgroundImage image={cover} height="200px" sizes={coverSizes} />
            </ZoomContainer>
          )}

          <Box padding={`${space[3]} ${space[3]} 0 ${space[3]}`}>
            {mainCategory && <Text color={colors.gray8}>{mainCategory}</Text>}

            <Heading level={4} as="h2">
              {title}
            </Heading>

            <Text>{summary}</Text>

            <Text color={colors.gray8}>{formatDate(publishedDate, 'medium')}</Text>

            <Box as="strong" fontWeight={fontWeights.bold} aria-hidden="true" color={colors.blue8} display="flex" alignItems="center" justifyContent="end">
              <span>{commonTexts.common.read_more}</span>
              <StyledArrowIconRight />
            </Box>
          </Box>
        </StyledArticleTeaser>
      </Link>
    </Box>
  );
};

// TODO: Rework this weird zoom container stuff.
const ZoomContainer = styled(ZoomContainerUnstyled)``;

function ZoomContainerUnstyled({ children, height, className }: { height: string; children: ReactNode; className?: string }) {
  return (
    <Box overflow="hidden" height={height} position="relative">
      <Box className={className}>{children}</Box>
    </Box>
  );
}

const StyledArticleTeaser = styled(Anchor)`
  color: ${colors.black};
  min-height: 26rem;
  overflow: hidden;
  text-decoration: none;

  ${Box} > * {
    margin-bottom: ${space[3]};
  }

  ${ZoomContainer}, ${Heading} {
    transition: transform 500ms, color 250ms ease-out;
    will-change: transform, color;
  }

  &:hover,
  &:focus {
    ${ZoomContainer} {
      transform: scale(1.04);
      transition: transform 200ms, color 250ms ease-in-out;
    }

    ${Heading} {
      color: ${colors.blue8};
    }
  }
`;

const StyledArrowIconRight = styled(ChevronRight)`
  height: 10px;
  margin: 3px 3px 0;
  width: 10px;
`;
