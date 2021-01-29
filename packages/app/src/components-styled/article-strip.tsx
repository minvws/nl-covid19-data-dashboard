import { Box } from '~/components-styled/base';
import { Text, Heading } from '~/components-styled/typography';
import { LinkWithIcon } from './link-with-icon';
import { Tile } from '~/components-styled/tile';
import css from '@styled-system/css';
import { colors } from '~/style/theme';
import ArrowIcon from '~/assets/arrow.svg';
import { Image } from '~/components-styled/image';
import { ImageBlock } from '~/types/cms';
import { Link } from '~/utils/link';
import styled from 'styled-components';
import siteText from '~/locale';

type testTing = {
  title: string;
  slug: {
    current: string;
  };
  cover: ImageBlock;
};

type ArticleTeaserProps = {
  ArticleTeasers: testTing[];
};

export function ArticleStrip(props: ArticleTeaserProps) {
  const { ArticleTeasers } = props;

  if (ArticleTeasers.length === 0) {
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

      {ArticleTeasers.map((article, index: number) => (
        <Box
          key={index}
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
