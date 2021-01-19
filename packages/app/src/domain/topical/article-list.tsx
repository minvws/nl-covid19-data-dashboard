import css from '@styled-system/css';
import styled from 'styled-components';
import ArrowIcon from '~/assets/arrow.svg';
import {
  ArticleSummary,
  ArticleTeaser,
} from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import { LinkWithIcon } from '~/components-styled/link-with-icon';
import { Heading, Text } from '~/components-styled/typography';
import siteText from '~/locale';
import { asResponsiveArray } from '~/style/utils';
import { useBreakpoints } from '~/utils/useBreakpoints';

type ArticleListProps = {
  articleSummaries: ArticleSummary[];
  hideLink?: boolean;
};

export function ArticleList({ articleSummaries, hideLink }: ArticleListProps) {
  const breakpoints = useBreakpoints();

  return (
    <Box
      css={css({
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <Heading level={2}>
        {siteText.nationaal_actueel.latest_articles.title}
      </Heading>
      <Box
        display="flex"
        alignItems={{ lg: 'flex-end' }}
        flexDirection={{ _: 'column', lg: 'row' }}
      >
        <Box flex={{ lg: '0 0 33%' }}>
          <Text m={0}>
            {siteText.nationaal_actueel.latest_articles.subtitle}
          </Text>
        </Box>
        <Box
          flex={{ lg: '0 0 66%' }}
          alignContent={{ lg: 'flex-end' }}
          justifyContent={{ lg: 'flex-end' }}
          display={{ lg: 'flex' }}
          mt={{ _: 2, lg: undefined }}
        >
          {!hideLink && (
            <LinkWithIcon
              href="/artikelen"
              icon={<ArrowIcon css={css({ transform: 'rotate(-90deg)' })} />}
              iconPlacement="right"
            >
              {siteText.nationaal_actueel.latest_articles.all_articles}
            </LinkWithIcon>
          )}
        </Box>
      </Box>
      <Box display="block" margin={0} maxWidth="100%" mt={3}>
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
    </Box>
  );
}

const ArticleBox = styled.div(
  css({
    display: 'inline-block',
    marginBottom: 4,
    width: asResponsiveArray({
      _: '100%',
      sm: 'calc(50% - 16px)',
      md: 'calc(33% - 32px)',
      lg: 'calc(33% - 32px)',
    }),
    '&:nth-child(n+2)': {
      ml: asResponsiveArray({ sm: '32px' }),
    },
    '&:nth-child(3n+2)': {
      mx: asResponsiveArray({ md: '48px', lg: '48px' }),
    },
  })
);
