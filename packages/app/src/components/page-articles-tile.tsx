import { colors } from '@corona-dashboard/common';
import { getImageProps } from '~/lib/sanity';
import { fontWeights, mediaQueries, radii, space } from '~/style/theme';
import { Box } from './base';
import { ChartTile } from './chart-tile';
import { SanityImage } from './cms/sanity-image';
import { Anchor, BoldText, Text } from './typography';
import { Link } from '~/utils/link';
import styled, { css } from 'styled-components';
import { PublicationDate } from './publication-date';
import { ChevronRight } from '@corona-dashboard/icons';
import { Article } from '~/types/cms';
import { useIntl } from '~/intl';

interface PageArticlesTileProps {
  articles: Article[];
  title: string;
}

// TODO: this should be moved to the /articles/ directory, as picked up in COR-1601
export const PageArticlesTile = ({ articles, title }: PageArticlesTileProps) => {
  const { commonTexts } = useIntl();

  return (
    <ChartTile title={title ?? commonTexts.article_list.title} disableFullscreen>
      <Grid>
        {articles.map((article, index) => (
          <Link passHref href={`/artikelen/${article.slug.current}`} key={index}>
            <ArticleCard>
              <ArticleCardHeader>
                <ArticleImage {...getImageProps(article.cover, {})} />

                <Box display="grid">
                  <BoldText color={colors.black}>{article.title}</BoldText>
                  <Text color={colors.gray8}>
                    {/* TODO: this should be updated after COR-1601 implements publicationDate vs updateDate logic */}
                    {article.mainCategory && `${commonTexts.article_teaser.categories[article.mainCategory]} · `}
                    <PublicationDate date={article.publicationDate} />
                  </Text>
                </Box>
              </ArticleCardHeader>

              <Box color={colors.black}>{article.summary}</Box>

              <ArticleLink>
                {commonTexts.article_teaser.read_more}
                <ChevronRight />
              </ArticleLink>
            </ArticleCard>
          </Link>
        ))}
      </Grid>

      <Link passHref href="/artikelen/">
        <ArticlesLink>
          {commonTexts.article_list.articles_page_link}
          <ChevronRight />
        </ArticlesLink>
      </Link>
    </ChartTile>
  );
};

const Grid = styled(Box)`
  display: grid;
  gap: ${space[4]};
  margin-bottom: ${space[3]};

  @media ${mediaQueries.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ArticleCard = styled(Anchor)`
  border-radius: ${radii[2]}px;
  border: 1px solid ${colors.gray3};
  display: grid;
  gap: ${space[2]};
  height: 100%;
  padding: ${space[3]};
`;

const ArticleCardHeader = styled(Box)`
  align-items: center;
  display: flex;
  gap: ${space[3]};
`;

const ArticleImage = styled(SanityImage)`
  object-fit: cover;
  flex-shrink: 0;

  img {
    border-radius: ${radii[2]}px;
    height: 48px;
    width: 48px;
  }
`;

const linkStyles = css`
  color: ${colors.blue8};
  cursor: pointer;

  svg {
    height: 10px;
    margin-left: ${space[1]};
    width: 10px;
  }
`;

const ArticleLink = styled(BoldText)`
  ${linkStyles}
`;

const ArticlesLink = styled(Anchor)`
  ${linkStyles}

  font-weight: ${fontWeights.bold};
`;
