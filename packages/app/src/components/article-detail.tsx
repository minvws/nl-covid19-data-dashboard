import { css } from '@styled-system/css';
import styled from 'styled-components';
import { ArrowIconLeft } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { ContentBlock } from '~/components/cms/content-block';
import { Heading, InlineText, Anchor } from '~/components/typography';
import { ArticleCategoryType } from '~/domain/topical/common/categories';
import { useIntl } from '~/intl';
import { SiteText } from '~/locale';
import { Article } from '~/types/cms';
import { Link } from '~/utils/link';
import { mergeAdjacentKpiBlocks } from '~/utils/merge-adjacent-kpi-blocks';
import { ContentImage } from './cms/content-image';
import { RichContent } from './cms/rich-content';
import { LinkWithIcon } from './link-with-icon';
import { PublicationDate } from './publication-date';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { colors } from '@corona-dashboard/common';
import { space } from '~/style/theme';
interface ArticleDetailProps {
  article: Article;
  text: SiteText['pages']['topical_page']['shared'];
}

const imageSizes = [
  // viewport min-width 700px display images at max. 636px wide
  ['400px', '700px', '636px'],
];

export function ArticleDetail({ article, text }: ArticleDetailProps) {
  const { commonTexts } = useIntl();
  const breakpoints = useBreakpoints();

  article.intro = mergeAdjacentKpiBlocks(article.intro);
  article.content = mergeAdjacentKpiBlocks(article.content);

  return (
    <Box bg="white" paddingY={{ _: space[4], md: space[5] }}>
      <ContentBlock spacing={3}>
        <LinkWithIcon href="/artikelen" icon={<ArrowIconLeft />}>
          {commonTexts.article_detail.back_link.text}
        </LinkWithIcon>

        <Box spacing={2}>
          <Heading level={1}>{article.title}</Heading>
          <InlineText color="gray7">
            <PublicationDate date={article.publicationDate} />
          </InlineText>
        </Box>

        <Box textVariant="h4">
          <RichContent blocks={article.intro} contentWrapper={ContentBlock} />
        </Box>

        <ContentImage node={article.cover} contentWrapper={ContentBlock} sizes={imageSizes} />
      </ContentBlock>
      {!breakpoints.xs
        ? article.imageMobile && (
            <Box marginTop={space[4]}>
              <ContentImage node={article.imageMobile} contentWrapper={ContentBlock} sizes={imageSizes} />
            </Box>
          )
        : article.imageDesktop && (
            <Box marginTop={space[4]}>
              <ContentImage node={article.imageDesktop} contentWrapper={ContentBlock} sizes={imageSizes} />
            </Box>
          )}
      {!!article.content?.length && (
        <Box
          // Since you can't serialize unordered lists we have to position them here in the container
          css={css({
            ul: {
              marginX: 'auto',
              maxWidth: 'contentWidth',
              paddingRight: space[4],
              paddingLeft: space[5],
            },
          })}
        >
          <RichContent blocks={article.content} contentWrapper={ContentBlock} />
        </Box>
      )}
      {article.categories && (
        <ContentBlock>
          <Box paddingBottom={space[2]} paddingTop={space[4]}>
            <InlineText color="gray7">{text.secties.artikelen.tags}</InlineText>
          </Box>
          <Box
            as="ul"
            spacingHorizontal={3}
            display="flex"
            flexWrap="wrap"
            margin="0"
            padding="0"
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
                  <StyledTagAnchor>{text.secties.artikelen.categorie_filters[item as ArticleCategoryType]}</StyledTagAnchor>
                </Link>
              </li>
            ))}
          </Box>
        </ContentBlock>
      )}
    </Box>
  );
}

const StyledTagAnchor = styled(Anchor)`
  border-radius: 5px;
  border: 2px solid ${colors.gray4};
  color: ${colors.black};
  display: block;
  margin-bottom: ${space[3]};
  padding: ${space[2]} ${space[3]};

  &:focus:focus-visible {
    outline: 2px dotted ${colors.blue8};
  }

  &:hover {
    background: ${colors.blue8};
    border: 2px solid ${colors.blue8};
    color: ${colors.white};
    text-shadow: 0.5px 0px 0px ${colors.white}, -0.5px 0px 0px ${colors.white};

    &:focus-visible {
      outline: 2px dotted ${colors.magenta3};
    }
  }
`;
