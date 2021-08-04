import css from '@styled-system/css';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { ArticleSummary, ArticleTeaser } from '~/components/article-teaser';
import { Box } from '~/components/base';
import {
  articleCategory,
  ArticleCategoryType,
} from '~/domain/topical/common/categories';
import { asResponsiveArray } from '~/style/utils';
type ArticleListProps = {
  articleSummaries?: ArticleSummary[];
  hideLink?: boolean;
  currentCategory?: ArticleCategoryType;
};

export function ArticleList({
  articleSummaries,
  currentCategory,
}: ArticleListProps) {
  if (!articleSummaries || articleSummaries.length === 0) {
    return null;
  }

  return (
    <Box
      display="flex"
      alignItems="stretch"
      margin={0}
      maxWidth="100%"
      flexWrap="wrap"
      mt={3}
    >
      {articleSummaries
        .filter(({ categories }) => {
          if (!isDefined(categories) || currentCategory === articleCategory[0])
            return true;

          return categories.includes(currentCategory);
        })
        .map((summary) => (
          <ArticleBox key={summary.slug.current}>
            <ArticleTeaser
              title={summary.title}
              slug={summary.slug.current}
              summary={summary.summary}
              cover={summary.cover}
              coverSizes={[
                // viewport min-width 768px display images at max. 445px wide
                [768, 445],
              ]}
            />
          </ArticleBox>
        ))}
    </Box>
  );
}

export const ArticleBox = styled.div(
  css({
    width: asResponsiveArray({
      _: '100%',
      sm: 'calc(50% - 16px)',
      md: 'calc(1 / 3 * 100% - 32px)',
      lg: 'calc(1 / 3 * 100% - 32px)',
    }),
    '&:nth-child(even)': {
      ml: asResponsiveArray({ sm: '32px', md: 0, lg: 0, xl: 0 }),
    },
    '&:nth-child(3n+2)': {
      mx: asResponsiveArray({ md: '48px', lg: '48px', xl: '48px' }),
    },
    '& > *': {
      height: '100%',
    },
  })
);
