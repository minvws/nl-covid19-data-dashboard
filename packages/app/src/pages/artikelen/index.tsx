import { css } from '@styled-system/css';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { MaxWidth } from '~/components/max-width';
import { Select } from '~/components/select';
import { Heading, InlineText, Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { ArticleList } from '~/domain/topical/article-list';
import {
  articleCategory,
  ArticleCategoryType,
} from '~/domain/topical/common/categories';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { asResponsiveArray } from '~/style/utils';
import { useBreakpoints } from '~/utils/use-breakpoints';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<ArticleSummary[]>(() => {
    //@TODO We need to switch this from process.env to context as soon as we use i18n routing
    // const { locale } = context;
    const locale = process.env.NEXT_PUBLIC_LOCALE;

    return `*[_type == 'article'] | order(publicationDate desc) {
        "title":title.${locale},
        slug,
        "summary":summary.${locale},
        "categories": [...categories],
        "cover": {
          ...cover,
          "asset": cover.asset->
        }
      }`;
  })
);

const ArticlesOverview = (props: StaticProps<typeof getStaticProps>) => {
  const { content, lastGenerated } = props;
  const { siteText } = useIntl();
  const router = useRouter();
  const breakpoints = useBreakpoints();

  const sortOptions = useMemo(() => {
    return articleCategory.map((id) => {
      const label =
        siteText.common_actueel.secties.artikelen.categorie_filters[id];

      return {
        label,
        value: id,
      };
    });
  }, [siteText]);

  const handleCategoryFilter = useCallback(
    function setNewParam(item: ArticleCategoryType) {
      router.replace(
        {
          pathname: '/artikelen',
          query: { categorie: item },
        },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  const currentCategory = (
    articleCategory.includes(router.query.categorie as ArticleCategoryType)
      ? router.query.categorie
      : articleCategory[0]
  ) as ArticleCategoryType;

  return (
    <Layout {...siteText.articles_metadata} lastGenerated={lastGenerated}>
      <Box backgroundColor="white" py={{ _: 4, md: 5 }}>
        <MaxWidth px={{ _: 3, lg: 4 }}>
          <Box pb={2}>
            <Heading level={2} as="h1">
              {siteText.common_actueel.secties.artikelen.titel}
            </Heading>
          </Box>

          <Text>{siteText.common_actueel.secties.artikelen.beschrijving}</Text>

          {breakpoints.lg ? (
            <OrderedList>
              {sortOptions.map((item, index) => (
                <ListItem
                  key={index}
                  isActive={currentCategory === item.value}
                  onClick={() => handleCategoryFilter(item.value)}
                >
                  <StyledButton>
                    <InlineText>{item.label}</InlineText>
                    <BoldText aria-hidden="true">{item.label}</BoldText>
                  </StyledButton>
                </ListItem>
              ))}
            </OrderedList>
          ) : (
            <Box
              mt={3}
              mb={4}
              width="100%"
              css={css({
                select: {
                  width: '100%',
                  maxWidth: asResponsiveArray({ _: '25rem', xs: '23rem' }),
                },
              })}
            >
              <Select
                options={sortOptions}
                onChange={handleCategoryFilter}
                value={currentCategory}
              />
            </Box>
          )}

          <ArticleList
            articleSummaries={content}
            hideLink={true}
            currentCategory={currentCategory}
          />
        </MaxWidth>
      </Box>
    </Layout>
  );
};

export default ArticlesOverview;

const OrderedList = styled.ol(
  css({
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-around',
    borderTop: '1px solid',
    borderBottom: '1px solid',
    borderColor: 'silver',
    m: 0,
    my: 4,
    p: 0,
    listStyleType: 'none',
  })
);

const ListItem = styled.li<{ isActive: boolean }>((x) =>
  css({
    position: 'relative',
    py: 3,
    height: '100%',
    transition: 'transform 0.2s',
    cursor: 'pointer',

    '&:after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      left: 0,
      bottom: 0,
      height: '6px',
      width: `calc(100%)`,
      backgroundColor: 'blue',
      transform: `translateY(${x.isActive ? 0 : '6px'})`,
      transition: 'transform 0.2s',
    },

    span: {
      // Regular text
      ':nth-of-type(1)': {
        opacity: x.isActive ? 0 : 1,
      },

      // Bold text
      ':nth-of-type(2)': {
        opacity: x.isActive ? 1 : 0,
      },
    },

    ':hover': {
      '&:after': {
        transform: `translateY(0)`,
      },
    },
  })
);

/*
 * Since we are using a justify-content: space around for positioning the elements,
 * transforming them on hover to a bold text would cause a small layout shift.
 * Here we draw a indentical text on top and switch them once the item is active.
 * It has a aria hidden label and is pure cosmetic for this use case.
 */
const BoldText = styled.span(
  css({
    position: 'absolute',
    top: 0,
    left: '50%',
    fontWeight: 'bold',
    opacity: 0,
    whiteSpace: 'nowrap',
    transform: 'translateX(-50%)',
  })
);

const StyledButton = styled.button(
  css({
    all: 'unset',
    position: 'relative',
    px: 3,

    '&:focus': {
      outlineWidth: '1px',
      outlineStyle: 'dashed',
      outlineColor: 'blue',
    },
  })
);
