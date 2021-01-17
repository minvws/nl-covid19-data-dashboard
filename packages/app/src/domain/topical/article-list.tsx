import css from '@styled-system/css';
import styled from 'styled-components';
import ArrowIcon from '~/assets/arrow.svg';
import { ArticleLink } from '~/components-styled/article-link';
import { Box } from '~/components-styled/base';
import { LinkWithIcon } from '~/components-styled/link-with-icon';
import { Tile } from '~/components-styled/tile';
import { Heading, Text } from '~/components-styled/typography';
import siteText from '~/locale';
import { Article } from '~/types/cms';
import { useBreakpoints } from '~/utils/useBreakpoints';

export type ArticleSummary = Pick<
  Article,
  'title' | 'slug' | 'summary' | 'cover'
>;

type ArticleListProps = {
  articleSummaries: ArticleSummary[];
  hideLink?: boolean;
};

export function ArticleList({ articleSummaries, hideLink }: ArticleListProps) {
  const breakpoints = useBreakpoints();

  return (
    <Tile>
      <Heading level={2}>
        {siteText.nationaal_actueel.latest_articles.title}
      </Heading>
      <Box
        display="flex"
        alignItems={{ _: undefined, lg: 'flex-end' }}
        mb={4}
        flexDirection={{ _: 'column', lg: 'row' }}
      >
        <Box flex={{ _: undefined, lg: '0 0 33%' }}>
          <Text m={0}>
            {siteText.nationaal_actueel.latest_articles.subtitle}
          </Text>
        </Box>
        <Box
          flex={{ _: undefined, lg: '0 0 66%' }}
          alignContent={{ _: undefined, lg: 'flex-end' }}
          justifyContent={{ _: undefined, lg: 'flex-end' }}
          display={{ _: undefined, lg: 'flex' }}
          mt={{ _: 2, lg: undefined }}
        >
          {!hideLink && (
            <LinkWithIcon
              href="/artikelen"
              icon={<ArrowIcon />}
              iconPlacement="right"
            >
              {siteText.nationaal_actueel.latest_articles.all_articles}
            </LinkWithIcon>
          )}
        </Box>
      </Box>
      <Box
        display="flex"
        spacingHorizontal={breakpoints.lg}
        flexDirection={{ _: 'column', lg: 'row' }}
        flexWrap="wrap"
        justifyContent="space-between"
      >
        {articleSummaries.map((summary) => (
          <ArticleBox key={summary.slug.current}>
            <ArticleLink articleSummary={summary} />
          </ArticleBox>
        ))}
        {articleSummaries.map((summary) => (
          <ArticleBox key={summary.slug.current}>
            <ArticleLink articleSummary={summary} />
          </ArticleBox>
        ))}
        {articleSummaries.map((summary) => (
          <ArticleBox key={summary.slug.current}>
            <ArticleLink articleSummary={summary} />
          </ArticleBox>
        ))}
        {articleSummaries.map((summary) => (
          <ArticleBox key={summary.slug.current}>
            <ArticleLink articleSummary={summary} />
          </ArticleBox>
        ))}
      </Box>
    </Tile>
  );
}

const ArticleBox = styled(Box)(
  css({
    flex: '0 0 auto',
    marginTop: 3,
  })
);
