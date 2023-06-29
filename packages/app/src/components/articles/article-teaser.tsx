import { colors } from '@corona-dashboard/common';
import { ChevronRight } from '@corona-dashboard/icons';
import styled from 'styled-components';
import { useIntl } from '~/intl';
import { radii, space } from '~/style/theme';
import { Article, ArticleMainCategory, Block, ImageBlock } from '~/types/cms';
import { Link } from '~/utils/link';
import { BackgroundImage } from '../background-image';
import { Box } from '../base';
import { PublicationDate } from '../publication-date';
import { Heading, Text } from '../typography';

export type ArticleSummary = Pick<Article, 'title' | 'slug' | 'summary' | 'cover' | 'category' | 'categories' | 'publicationDate' | 'mainCategory'>;

interface ArticleTeaserProps {
  cover: ImageBlock;
  coverSizes: string[][];
  slug: string;
  summary: Block;
  title: string;
  mainCategory: ArticleMainCategory | null;
  publicationDate: string;
}

const ArticleTeaserImage = ({ image, sizes }: { image: ImageBlock; sizes: string[][] }) => {
  return (
    <div className="article-teaser-image">
      <BackgroundImage image={image} height="200px" sizes={sizes} />
    </div>
  );
};

export const ArticleTeaser = (props: ArticleTeaserProps) => {
  const { title, slug, summary, cover, coverSizes, mainCategory, publicationDate } = props;
  const { commonTexts } = useIntl();

  return (
    <Box as="article" border={`1px solid ${colors.gray3}`} borderRadius={`${radii[2]}px`} overflow="hidden" marginBottom={{ _: space[4], xs: 0 }}>
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

            <ArticlePublicationDate date={publicationDate} />

            <ArticleCTA aria-hidden="true">
              <span>{commonTexts.common.read_more}</span>
              <ChevronRight />
            </ArticleCTA>
          </ArticleTeaserContent>
        </ArticleTeaserCard>
      </Link>
    </Box>
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

const ArticleTeaserCard = styled.div`
  color: ${colors.black};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 26rem;
  overflow: hidden;
  text-decoration: none;

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

const ArticlePublicationDate = styled(PublicationDate)`
  color: ${colors.gray8};
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
