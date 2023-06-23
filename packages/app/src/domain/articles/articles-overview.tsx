import css from '@styled-system/css';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { ArticleSummary, ArticleTeaser } from '~/components/article-teaser';
import { Box, Spacer } from '~/components/base';
import { articleCategoryList, ArticleCategoryType } from '~/domain/topical/common/categories';
import { space } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';

interface ArticlesListProps {
  articleSummaries?: ArticleSummary[];
  currentCategory?: ArticleCategoryType;
}

export function ArticlesList({ articleSummaries, currentCategory }: ArticlesListProps) {
  if (!articleSummaries || articleSummaries.length === 0) {
    return null;
  }

  return (
    <Box as="article" display="flex" alignItems="stretch" margin="0" maxWidth="100%" flexWrap="wrap">
      {articleSummaries
        .filter(({ categories }) => {
          if (!isDefined(categories) || currentCategory === articleCategoryList[0]) return true;

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
                ['768px', '445px'],
              ]}
            />
            <Spacer marginBottom={{ _: space[4], md: space[5] }} />
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
      marginLeft: asResponsiveArray({ sm: space[4], md: '0' }),
    },
    '&:nth-child(3n+2)': {
      marginX: asResponsiveArray({ md: '48px' }),
    },
    '& > *': {
      height: '100%',
    },
  })
);
