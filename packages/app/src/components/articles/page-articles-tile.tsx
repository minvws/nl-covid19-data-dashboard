import { colors } from '@corona-dashboard/common';
import { ChevronRight } from '@corona-dashboard/icons';
import styled, { css } from 'styled-components';
import { useIntl } from '~/intl';
import { getImageProps } from '~/lib/sanity';
import { fontWeights, mediaQueries, radii, space } from '~/style/theme';
import { Article } from '~/types/cms';
import { Link } from '~/utils/link';
import { Box } from '../base';
import { ChartTile } from '../chart-tile';
import { SanityImage } from '../cms/sanity-image';
import { Anchor, BoldText, InlineText, Text } from '../typography';
import { ArticleUpdateOrPublishingDate } from './article-update-or-publishing-date';

interface PageArticlesTileProps {
  articles: Article[];
  title: string;
}

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

                <div>
                  <BoldText color={colors.black}>{article.title}</BoldText>

                  <Box display="flex" color={colors.gray8} spacingHorizontal={1}>
                    <InlineText>{article.mainCategory && `${commonTexts.article_teaser.categories[article.mainCategory]} · `}</InlineText>

                    <ArticleUpdateOrPublishingDate publishedDate={article.publicationDate} updatedDate={article.updatedDate} mainCategory={article.mainCategory} />
                  </Box>
                </div>
              </ArticleCardHeader>

              <Text color={colors.black}>{article.summary}</Text>

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
  display: flex;
  flex-direction: column;
  gap: ${space[2]};
  padding: ${space[3]};

  ${Text} {
    align-items: end;
    display: flex;
    flex-grow: 1;
  }
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
