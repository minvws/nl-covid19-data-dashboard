import css from '@styled-system/css';
import styled from 'styled-components';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { SanityImage } from '~/components/cms/sanity-image';
import { InlineText, Text } from '~/components/typography';
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
    <>
      <InlineText
        mb={2}
        fontSize={2}
        fontWeight="bold"
        css={css({ display: 'block' })}
      >
        {siteText.informatie_header.artikelen}
      </InlineText>
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
    </>
  );
}

interface ArticleItemProps {
  slug: string;
  cover: ImageBlock;
  title: string;
}

export function ArticleItem({ slug, cover, title }: ArticleItemProps) {
  return (
    <Link passHref href={`/artikelen/${slug}`}>
      <StyledLink>
        <Box width={100} minWidth={100} maxHeight={66} overflow="hidden">
          <SanityImage
            {...getImageProps(cover, {
              defaultWidth: 122,
            })}
          />
        </Box>
        <Box pl={3} display="flex" alignItems="center">
          <Text m={0}>{title}</Text>
        </Box>
      </StyledLink>
    </Link>
  );
}

const StyledLink = styled.a(
  css({
    color: 'blue',
    textDecoration: 'none',
    display: 'flex',
    fontWeight: 'bold',
  })
);
