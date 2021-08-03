import { css } from '@styled-system/css';
import styled from 'styled-components';
import { ArrowIconLeft } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { ContentBlock } from '~/components/cms/content-block';
import { Heading, InlineText } from '~/components/typography';
import { ArticleCategoryType } from '~/domain/topical/common/categories';
import { useIntl } from '~/intl';
import { Article } from '~/types/cms';
import { Link } from '~/utils/link';
import { ContentImage } from './cms/content-image';
import { RichContent } from './cms/rich-content';
import { LinkWithIcon } from './link-with-icon';
import { PublicationDate } from './publication-date';
interface ArticleDetailProps {
  article: Article;
}

const imageSizes = [
  // viewport min-width 700px display images at max. 636px wide
  [700, 636],
];

export function ArticleDetail({ article }: ArticleDetailProps) {
  const { siteText } = useIntl();

  return (
    <Box bg="white" py={{ _: 4, md: 5 }}>
      <ContentBlock spacing={3}>
        <LinkWithIcon href="/artikelen" icon={<ArrowIconLeft />}>
          {siteText.article_detail.back_link.text}
        </LinkWithIcon>

        <Box spacing={2}>
          <Heading level={1}>{article.title}</Heading>
          <InlineText color="annotation">
            <PublicationDate date={article.publicationDate} />
          </InlineText>
        </Box>

        <Box textVariant="h4">
          <RichContent blocks={article.intro} contentWrapper={ContentBlock} />
        </Box>

        <ContentImage
          node={article.cover}
          contentWrapper={ContentBlock}
          sizes={imageSizes}
        />
      </ContentBlock>
      {!!article.content?.length && (
        <ContentBlock>
          <Box textVariant="body1">
            <RichContent
              blocks={article.content}
              contentWrapper={ContentBlock}
            />
          </Box>
        </ContentBlock>
      )}

      {article.categories && (
        <ContentBlock>
          <Box pb={3} pt={3}>
            <InlineText color="annotation">
              {siteText.common_actueel.secties.artikelen.tags}
            </InlineText>
          </Box>
          <Box
            as="ul"
            spacingHorizontal={3}
            display="flex"
            flexWrap="wrap"
            m={0}
            p={0}
            css={css({
              listStyleType: 'none',
            })}
          >
            {article.categories.map((item, index) => (
              <li key={index}>
                <Link
                  href={{
                    pathname: '/artikelen',
                    query: { categorie: item },
                  }}
                  passHref={true}
                >
                  <TagAnchor>
                    {
                      siteText.common_actueel.secties.artikelen
                        .categorie_filters[item as ArticleCategoryType]
                    }
                  </TagAnchor>
                </Link>
              </li>
            ))}
          </Box>
        </ContentBlock>
      )}
    </Box>
  );
}

const TagAnchor = styled.a(
  css({
    display: 'block',
    border: '2px solid transparent',
    mb: 2,
    px: 3,
    py: 2,
    backgroundColor: 'buttonLightBlue',
    color: 'blue',
    textDecoration: 'none',
    transition: '0.1s border-color',

    '&:hover': {
      borderColor: 'blue',
    },

    '&:focus': {
      outline: '2px dotted',
      outlineColor: 'blue',
    },
  })
);
