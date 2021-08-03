import css from '@styled-system/css';
import { Fragment } from 'react';
import styled from 'styled-components';
import ChevronIcon from '~/assets/chevron.svg';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { SanityImage } from '~/components/cms/sanity-image';
import { Anchor, InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { getImageProps } from '~/lib/sanity';
import { ImageBlock } from '~/types/cms';
import { Link } from '~/utils/link';

interface ArticlesProps {
  articles: ArticleSummary[];
}

export function Articles({ articles }: ArticlesProps) {
  const { siteText } = useIntl();

  return (
    <Box spacing={3}>
      <Text variant="subtitle1">{siteText.informatie_header.artikelen}</Text>
      <Box spacing={3}>
        {articles.map((article, index) => (
          <ArticleItem
            key={index}
            title={article.title}
            cover={article.cover}
            slug={article.slug.current}
          />
        ))}
      </Box>
    </Box>
  );
}

interface ArticleItemProps {
  slug: string;
  cover: ImageBlock;
  title: string;
}

function ArticleItem({ slug, cover, title }: ArticleItemProps) {
  const words = title.split(' ');

  return (
    <Link passHref href={`/artikelen/${slug}`}>
      <StyledAnchor>
        <Box width={100} minWidth={100} maxHeight={66} overflow="hidden">
          <SanityImage
            {...getImageProps(cover, {
              defaultWidth: 122,
            })}
          />
        </Box>
        <Box pl={3} display="flex" alignItems="center">
          <StyledText>
            {words.map((word, index) => (
              <Fragment key={index}>
                {words.length - 1 === index ? (
                  <InlineText
                    css={css({
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      pr: 1,
                    })}
                  >
                    {word}
                    <ChevronIcon />
                  </InlineText>
                ) : (
                  <InlineText>{`${word} `}</InlineText>
                )}
              </Fragment>
            ))}
          </StyledText>
        </Box>
      </StyledAnchor>
    </Link>
  );
}

const StyledAnchor = styled(Anchor)(
  css({
    color: 'blue',
    textDecoration: 'none',
    display: 'flex',
    fontWeight: 'bold',
  })
);

const StyledText = styled.p(
  css({
    display: 'flex',
    flexWrap: 'wrap',
    margin: 0,
    whiteSpace: 'pre-wrap',

    '&:hover': {
      textDecoration: 'underline',
    },

    svg: {
      marginLeft: 1,
      width: 12,
      height: 12,
    },
  })
);
