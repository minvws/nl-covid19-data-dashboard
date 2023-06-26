import { colors } from '@corona-dashboard/common';
import { getImageProps } from '~/lib/sanity';
import { fontWeights, mediaQueries, radii, space } from '~/style/theme';
import { Box } from '../base';
import { ChartTile } from '../chart-tile';
import { SanityImage } from '../cms/sanity-image';
import { Anchor, BoldText } from '../typography';
import { Link } from '~/utils/link';
import styled, { css } from 'styled-components';
import { PublicationDate } from '../publication-date';
import { ChevronRight } from '@corona-dashboard/icons';
import { Article } from '~/types/cms';
import { useIntl } from '~/intl';

interface PageArticlesTileProps {
  articles: Article[];
}

export const PageArticlesTile = ({ articles }: PageArticlesTileProps) => {
  const { commonTexts } = useIntl();

  return (
    // TODO: add these things as Lokalize keys
    <ChartTile title="Artikelen over dit onderwerp" disableFullscreen id="artikelen">
      <Grid>
        {articles.map((article, index) => (
          <Link passHref href={`/artikelen/${article.slug.current}`} key={index}>
            <ArticleCard>
              <Box display="grid" gridTemplateColumns="1fr 4fr" style={{ gap: space[2] }} alignItems="center">
                <ArticleImage {...getImageProps(article.cover, {})} />

                <Box display="grid" color={colors.gray5}>
                  <BoldText color={colors.black}>{article.title}</BoldText>
                  <Box>
                    {article.mainCategory === 'knowledge' ? (
                      commonTexts.article_teaser.categories.knowledge
                    ) : (
                      <>
                        {commonTexts.article_teaser.categories.news} · <PublicationDate date={article.publicationDate} />
                      </>
                    )}
                  </Box>
                </Box>
              </Box>

              <Box color={colors.black}>{article.summary}</Box>

              <ArticleLink>
                {commonTexts.article_teaser.read_more}
                <ChevronRight />
              </ArticleLink>
            </ArticleCard>
          </Link>
        ))}
      </Grid>

      <Link passHref href="/artikelen/">
        <ArticlesLink>
          {commonTexts.article_list.articles_page_link}
          <ChevronRight />
        </ArticlesLink>
      </Link>
    </ChartTile>
  );
};

const Grid = styled(Box)`
  display: grid;
  gap: ${space[4]};
  @media ${mediaQueries.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
  margin-bottom: ${space[3]};
`;

const ArticleCard = styled(Anchor)`
  display: grid;
  gap: ${space[2]};
  height: 100%;
  border: 1px solid ${colors.gray3};
  border-radius: ${radii[2]}px;
  padding: ${space[3]};
`;

const ArticleImage = styled(SanityImage)`
  object-fit: cover;

  img {
    border-radius: ${radii[2]}px;
    width: 100%;
    height: ${space[5]};
  }
`;

const linkStyles = css`
  color: ${colors.blue8};
  cursor: pointer;

  svg {
    margin-left: ${space[1]};
    width: 10px;
    height: 10px;
  }
`;

const ArticleLink = styled(BoldText)`
  ${linkStyles}
`;

const ArticlesLink = styled(Anchor)`
  ${linkStyles}

  font-weight: ${fontWeights.bold};
`;
