import { colors } from '@corona-dashboard/common';
import styled from 'styled-components';
import { ArticleSummary, ArticleTeaser } from '~/components/articles/article-teaser';
import { Box } from '~/components/base';
import { BoldText } from '~/components/typography';
import { ArticleCategoryType, allPossibleArticleCategories } from '~/domain/topical/common/categories';
import { useIntl } from '~/intl';
import { mediaQueries, space } from '~/style/theme';
import { replaceVariablesInText } from '~/utils';
import { getCategories } from './logic/get-categories';
import { getDateToUse } from './logic/get-date-to-use';

interface ArticlesListProps {
  articleList: ArticleSummary[];
  currentCategory: ArticleCategoryType;
}

export const ArticlesList = ({ articleList, currentCategory }: ArticlesListProps) => {
  const { commonTexts } = useIntl();

  const articleListPerCategory = articleList.filter((item) => {
    const categories = getCategories(item);
    return categories.includes(currentCategory);
  });

  const articleListForDisplay = currentCategory === allPossibleArticleCategories[0] ? articleList : articleListPerCategory;

  // Articles are grouped by year.
  const articleListPerYear = articleListForDisplay.reduce((object: Record<string, ArticleSummary[]>, currentArticle) => {
    const { publicationDate, updatedDate, mainCategory } = currentArticle;
    const { publishedOrUpdatedDate } = getDateToUse(publicationDate, updatedDate, mainCategory);
    const yearOfPublishingOrUpdate = new Date(publishedOrUpdatedDate).getFullYear();

    // Create a key for a given year if it does not already contain that key.
    if (!Object.hasOwnProperty.call(object, yearOfPublishingOrUpdate)) {
      object[yearOfPublishingOrUpdate] = [];
    }

    object[yearOfPublishingOrUpdate].push(currentArticle);

    return object;
  }, {});

  const articleTeasers = Object.keys(articleListPerYear)
    // Articles list sorted by year to show the latest year first.
    .sort((a, b) => parseFloat(b) - parseFloat(a))
    .map((yearKey, index) => (
      <section key={index}>
        <Box borderBottom={`1px solid ${colors.gray3}`} display="block" marginY={space[4]}>
          <BoldText>{replaceVariablesInText(commonTexts.article_list.articles_per_year, { year: yearKey })}</BoldText>
        </Box>

        <ArticlesGrid>
          {articleListPerYear[yearKey].map((article) => (
            <ArticleTeaser
              key={article.slug.current}
              title={article.title}
              slug={article.slug.current}
              summary={article.summary}
              cover={article.cover}
              mainCategory={article.mainCategory ? article.mainCategory : null}
              publicationDate={article.publicationDate}
              updatedDate={article.updatedDate}
              coverSizes={[
                // Viewport min-width 768px display images at max. 445px wide.
                ['768px', '445px'],
              ]}
            />
          ))}
        </ArticlesGrid>
      </section>
    ));

  return (
    <Box as="article" margin="0" maxWidth="100%">
      {articleTeasers}
    </Box>
  );
};

const ArticlesGrid = styled.div`
  @media ${mediaQueries.sm} {
    display: grid;
    gap: ${space[4]};
    grid-template-columns: repeat(3, 1fr);
    padding-inline: ${space[1]};
  }
`;
