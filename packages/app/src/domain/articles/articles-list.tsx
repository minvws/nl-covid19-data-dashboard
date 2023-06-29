import { colors } from '@corona-dashboard/common';
import styled from 'styled-components';
import { ArticleSummary, ArticleTeaser } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { BoldText } from '~/components/typography';
import { ArticleCategoryType, allPossibleArticleCategories } from '~/domain/topical/common/categories';
import { mediaQueries, space } from '~/style/theme';

interface ArticlesListProps {
  articleList: ArticleSummary[];
  articleCategories: {
    label: string;
    value: ArticleCategoryType;
  }[];
  currentCategory: ArticleCategoryType;
}

export const ArticlesList = ({ articleList, currentCategory, articleCategories }: ArticlesListProps) => {
  const articleListPerCategory = articleList.filter((item) => {
    // TODO: Abstract to function
    const categories = [...(item.categories && item.categories.length ? item.categories : []), ...(item.mainCategory && item.mainCategory.length ? item.mainCategory : [])];

    return categories.includes(currentCategory);
  });

  const articleListForDisplay = currentCategory === allPossibleArticleCategories[0] ? articleList : articleListPerCategory;

  const articleListPerYear = articleListForDisplay.reduce((object: Record<string, ArticleSummary[]>, currentArticle) => {
    const { publicationDate } = currentArticle;
    const yearOfPublishing = new Date(publicationDate).getFullYear();

    if (!Object.hasOwnProperty.call(object, yearOfPublishing)) {
      object[yearOfPublishing] = [];
    }

    object[yearOfPublishing].push(currentArticle);

    return object;
  }, {});

  // Articles list sorted by year to show the latest year first.
  const articleTeasers = Object.keys(articleListPerYear)
    .sort((a, b) => parseFloat(b) - parseFloat(a))
    .map((yearKey, index) => {
      return (
        <section key={index}>
          <Box borderBottom={`1px solid ${colors.gray3}`} display="block" marginY={space[4]}>
            {/* TODO: Covert to lokalize key */}
            <BoldText>Artikelen uit {yearKey}</BoldText>
          </Box>

          <ArticleGrid>
            {articleListPerYear[yearKey].map((article) => {
              const mainCategoryLabel = articleCategories.find((category) =>
                article.mainCategory && article.mainCategory.length ? category.value === article.mainCategory[0] : null
              )?.label;
              return (
                <ArticleTeaser
                  key={article.slug.current}
                  title={article.title}
                  slug={article.slug.current}
                  summary={article.summary}
                  cover={article.cover}
                  mainCategory={mainCategoryLabel}
                  publishedDate={new Date(article.publicationDate)}
                  coverSizes={[
                    // viewport min-width 768px display images at max. 445px wide
                    ['768px', '445px'],
                  ]}
                />
              );
            })}
          </ArticleGrid>
        </section>
      );
    });

  return (
    <Box as="article" margin="0" maxWidth="100%">
      {articleTeasers}
    </Box>
  );
};

const ArticleGrid = styled.div`
  @media ${mediaQueries.sm} {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${space[4]};
  }
`;
