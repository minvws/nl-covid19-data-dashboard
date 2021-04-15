import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Tile } from '~/components/tile';
import { SanityImage } from '~/components/cms/sanity-image';
import { Heading, Text } from '~/components/typography';
import { getImageProps } from '~/lib/sanity';
import { useIntl } from '~/intl';
import { ImageBlock } from '~/types/cms';
import { Link } from '~/utils/link';
import { ArticleSummary } from './article-teaser';
import { ArrowIconRight } from '~/components/arrow-icon';
import { colors } from '~/style/theme';

type ArticleStripProps = {
  articles?: ArticleSummary[];
};

export function ArticleStrip(props: ArticleStripProps) {
  const { articles } = props;

  const { siteText } = useIntl();

  if (!articles?.length) {
    return null;
  }

  return (
    <Tile css={css({ bg: 'lightBlue' })}>
      <Heading level={4} as="h3">
        {siteText.article_strip_title}
      </Heading>

      <Box display="flex" flexWrap="wrap">
        {articles.map((article, index) => (
          <Box
            key={article.slug.current}
            width={{ _: '100%', lg: '50%' }}
            paddingRight={{ lg: index % 2 === 0 ? 0 : 3 }}
            paddingLeft={{ lg: index % 2 === 0 ? 0 : 3 }}
            paddingBottom={{ _: 3, lg: 0 }}
          >
            <ArticleStripItem
              title={article.title}
              cover={article.cover}
              slug={article.slug.current}
            />
          </Box>
        ))}
      </Box>
    </Tile>
  );
}

type ArticleStripItemProps = {
  slug: string;
  cover: ImageBlock;
  title: string;
};

function ArticleStripItem(props: ArticleStripItemProps) {
  const { slug, cover, title } = props;

  const { siteText } = useIntl();

  return (
    <Link passHref href={`/artikelen/${slug}`}>
      <StyledLink>
        <Box width={122} minWidth={122} maxHeight={122} overflow="hidden">
          <SanityImage
            {...getImageProps(cover, {
              defaultWidth: 122,
            })}
          />
        </Box>
        <Box paddingLeft={3}>
          <Text mt={0} mb={2}>
            {title}
          </Text>
          <StyledSpan>
            {siteText.common.read_more}
            <Arrow />
          </StyledSpan>
        </Box>
      </StyledLink>
    </Link>
  );
}

const StyledLink = styled.a(
  css({
    color: 'black',
    textDecoration: 'none',
    display: 'flex',
  })
);

const StyledSpan = styled.span({
  display: 'inline-flex',
  alignItems: 'center',
  color: colors.link,
  '&:hover,&:focus': {
    textDecoration: 'underline',
  },
});

function Arrow() {
  return (
    <span
      css={css({
        display: 'inline-flex',
        svg: { height: '13px', width: '11px', ml: '3px' },
      })}
    >
      <ArrowIconRight />
    </span>
  );
}
