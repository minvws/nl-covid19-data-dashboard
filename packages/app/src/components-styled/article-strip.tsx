import css from '@styled-system/css';
import styled from 'styled-components';
import ArrowIcon from '~/assets/arrow.svg';
import { Box } from '~/components-styled/base';
import { Image } from '~/components-styled/image';
import { Tile } from '~/components-styled/tile';
import { Heading, Text } from '~/components-styled/typography';
import siteText from '~/locale';
import { colors } from '~/style/theme';
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
    <Tile
      css={css({
        background: colors.lightBlue,
        flexDirection: 'row',
        flexWrap: 'wrap',
      })}
    >
      <Heading level={4} fontWeight="bold" css={css({ width: '100%' })}>
        {siteText.article_strip_title}
      </Heading>

      {articles.map((article, index: number) => (
        <Box
          key={article.slug.current}
          width={{ _: '100%', lg: '50%' }}
          paddingRight={{ lg: index === 0 ? 0 : 3 }}
          marginBottom={{ _: index === 0 ? 3 : 0 }}
          paddingLeft={{ lg: index === 1 ? 0 : 3 }}
        >
          <Link passHref href={`/artikelen/${article.slug.current}`}>
            <StyledLink>
              <Box width={122} display="inline-table">
                <Image
                  src={`/${article.cover.asset.assetId}.${article.cover.asset.extension}`}
                  width={122}
                  height={
                    122 / article.cover.asset.metadata.dimensions.aspectRatio
                  }
                  alt={article.cover.alt}
                />
              </Box>
              <Box paddingLeft={3}>
                <Text mt={0} mb={2}>
                  {article.title}
                </Text>
                <LinkWithIcon
                  href={`/artikelen/${article.slug.current}`}
                  icon={
                    <ArrowIcon css={css({ transform: 'rotate(-90deg)' })} />
                  }
                  iconPlacement="right"
                >
                  {siteText.common.read_more}
                </LinkWithIcon>
              </Box>
            </StyledLink>
          </Link>
        </Box>
      ))}
    </Tile>
  );
}

const StyledLink = styled.a(
  css({
    color: 'black',
    textDecoration: 'none',
    display: 'flex',
  })
);
