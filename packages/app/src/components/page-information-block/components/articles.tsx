import css from '@styled-system/css';
import { Fragment } from 'react';
import styled from 'styled-components';
import { ChevronRight } from '@corona-dashboard/icons';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { SanityImage } from '~/components/cms/sanity-image';
import { Anchor, InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { getImageProps } from '~/lib/sanity';
import { ImageBlock } from '~/types/cms';
import { Link } from '~/utils/link';
import { space } from '~/style/theme';

interface ArticlesProps {
  articles: ArticleSummary[];
}

export function Articles({ articles }: ArticlesProps) {
  const { commonTexts } = useIntl();

  return (
    <Box spacing={3}>
      <Text variant="subtitle1">{commonTexts.informatie_header.artikelen}</Text>
      <Box spacing={3}>
        {articles.map((article, index) => (
          <ArticleItem key={index} title={article.title} cover={article.cover} slug={article.slug.current} />
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
  const words = title.trim().split(' ');

  return (
    <Link passHref href={`/artikelen/${slug}`}>
      <StyledAnchor>
        <Box width="100px" minWidth="100px" minHeight="66px" overflow="hidden">
          <SanityImage
            {...getImageProps(cover, {
              defaultWidth: '122px',
            })}
          />
        </Box>
        <Box paddingLeft={space[3]} display="flex" alignItems="center">
          <StyledText>
            {words.map((word, index) => (
              <Fragment key={index}>
                {words.length - 1 === index ? (
                  <InlineText
                    css={css({
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      paddingRight: space[1],
                    })}
                  >
                    {word}
                    <ChevronRight />
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
    color: 'blue8',
    textDecoration: 'none',
    display: 'flex',
    fontWeight: 'bold',
  })
);

const StyledText = styled.p(
  css({
    display: 'flex',
    flexWrap: 'wrap',
    margin: '0',
    whiteSpace: 'pre-wrap',

    '&:hover': {
      textDecoration: 'underline',
    },

    svg: {
      marginLeft: space[1],
      width: '12px',
      height: '12px',
    },
  })
);
