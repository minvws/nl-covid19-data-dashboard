import css from '@styled-system/css';
import styled from 'styled-components';
import ArrowIcon from '~/assets/arrow.svg';
import { Box } from '~/components-styled/base';
import { Tile } from '~/components-styled/tile';
import { SanityImage } from '~/components-styled/cms/sanity-image';
import { Heading, Text } from '~/components-styled/typography';
import { getImageProps } from '~/lib/sanity';
import siteText from '~/locale';
import { ImageBlock } from '~/types/cms';
import { Link } from '~/utils/link';
import { ArticleSummary } from './article-teaser';
import { LinkWithIcon } from './link-with-icon';

type ArticleStripProps = {
  articles?: ArticleSummary[];
};

export function ArticleStrip(props: ArticleStripProps) {
  const { articles } = props;

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

  return (
    <Link passHref href={`/artikelen/${slug}`}>
      <StyledLink>
        <Box width={122} maxHeight={122} overflow="hidden">
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
          <LinkWithIcon
            href={`/artikelen/${slug}`}
            icon={<ArrowIcon css={css({ transform: 'rotate(-90deg)' })} />}
            iconPlacement="right"
          >
            {siteText.common.read_more}
          </LinkWithIcon>
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
