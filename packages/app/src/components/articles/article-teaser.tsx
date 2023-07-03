import { colors } from '@corona-dashboard/common';
import { ChevronRight } from '@corona-dashboard/icons';
import styled from 'styled-components';
import { useIntl } from '~/intl';
import { mediaQueries, radii, space } from '~/style/theme';
import { Article, ArticleMainCategory, ArticlePublishedDate, ArticleUpdatedDate, Block, ImageBlock } from '~/types/cms';
import { Link } from '~/utils/link';
import { BackgroundImage } from '../background-image';
import { Box } from '../base';
import { Anchor, Heading, Text } from '../typography';
import { ArticleUpdateOrPublishingDate } from './article-update-or-publishing-date';

export type ArticleSummary = Pick<Article, 'title' | 'slug' | 'summary' | 'cover' | 'category' | 'categories' | 'publicationDate' | 'mainCategory' | 'updatedDate'>;

interface ArticleTeaserImageProps {
  image: ImageBlock;
  sizes: string[][];
}

const ArticleTeaserImage = ({ image, sizes }: ArticleTeaserImageProps) => {
  return (
    <div className="article-teaser-image">
      <BackgroundImage image={image} height="200px" sizes={sizes} />
    </div>
  );
};

interface ArticleTeaserProps {
  cover: ImageBlock;
  coverSizes: string[][];
  mainCategory: ArticleMainCategory | null;
  publicationDate: ArticlePublishedDate;
  slug: string;
  summary: Block;
  title: string;
  updatedDate: ArticleUpdatedDate;
}

export const ArticleTeaser = ({ title, slug, summary, cover, coverSizes, mainCategory, publicationDate, updatedDate }: ArticleTeaserProps) => {
  const { commonTexts } = useIntl();

  return (
    <article>
      <Link passHref href={`/artikelen/${slug}`}>
        <ArticleTeaserCard>
          {cover.asset && <ArticleTeaserImage image={cover} sizes={coverSizes} />}

          <ArticleTeaserContent>
            {mainCategory && <Text color={colors.gray8}>{commonTexts.article_teaser.categories[mainCategory]}</Text>}

            <Heading level={4} as="h2">
              {title}
            </Heading>

            <Box flexGrow={1}>
              <Text>{summary}</Text>
            </Box>

            <ArticleUpdateOrPublishingDate publishedDate={publicationDate} updatedDate={updatedDate} mainCategory={mainCategory} />

            <ArticleCTA aria-hidden="true">
              <span>{commonTexts.common.read_more}</span>
              <ChevronRight />
            </ArticleCTA>
          </ArticleTeaserContent>
        </ArticleTeaserCard>
      </Link>
    </article>
  );
};

const ArticleTeaserContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${space[3]} ${space[3]} 0 ${space[3]};

  & > * {
    margin-bottom: ${space[3]};
  }
`;

const ArticleTeaserCard = styled(Anchor)`
  border: 1px solid ${colors.gray3};
  border-radius: ${radii[2]}px;
  color: ${colors.black};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-bottom: ${space[4]};
  min-height: 26rem;
  overflow: hidden;
  text-decoration: none;

  @media ${mediaQueries.xs} {
    margin-bottom: 0;
  }

  .article-teaser-image {
    flex-shrink: 0;
    height: 200px;
    overflow: hidden;
    position: relative;
  }

  .article-teaser-image,
  ${Heading} {
    transition: transform 500ms, color 250ms ease-out;
    will-change: transform, color;
  }

  &:hover,
  &:focus {
    .article-teaser-image {
      transform: scale(1.04);
      transition: transform 200ms, color 250ms ease-in-out;
    }

    ${Heading} {
      color: ${colors.blue8};
    }
  }
`;

const ArticleCTA = styled.strong`
  align-items: center;
  color: ${colors.blue8};
  display: flex;
  justify-content: end;

  svg {
    height: 10px;
    margin: 3px 3px 0;
    width: 10px;
  }
`;
