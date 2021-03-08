import css from '@styled-system/css';
import styled from 'styled-components';
import {
  ArticleSummary,
  ArticleTeaser,
} from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import { asResponsiveArray } from '~/style/utils';

type ArticleListProps = {
  articleSummaries: ArticleSummary[];
  hideLink?: boolean;
};

export function ArticleList({ articleSummaries }: ArticleListProps) {
  if (articleSummaries.length === 0) {
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
      {articleSummaries.map((summary) => (
        <ArticleBox key={summary.slug.current}>
          <ArticleTeaser
            title={summary.title}
            slug={summary.slug.current}
            summary={summary.summary}
            cover={summary.cover}
          />
        </ArticleBox>
      ))}
    </Box>
  );
}

const ArticleBox = styled.div(
  css({
    marginBottom: 4,
    width: asResponsiveArray({
      _: '100%',
      sm: 'calc(50% - 16px)',
      md: 'calc(33% - 32px)',
      lg: 'calc(33% - 32px)',
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
