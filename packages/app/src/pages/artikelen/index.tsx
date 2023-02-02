import { css } from '@styled-system/css';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { isPresent } from 'ts-is-present';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { MaxWidth } from '~/components/max-width';
import { RichContentSelect } from '~/components/rich-content-select';
import { Heading, InlineText, Text } from '~/components/typography';
import { ArticlesOverviewList } from '~/domain/articles/articles-overview-list';
import { Layout } from '~/domain/layout/layout';
import { articleCategory, ArticleCategoryType } from '~/domain/topical/common/categories';
import { useIntl } from '~/intl';
import { Languages, SiteText } from '~/locale';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate, getLokalizeTexts } from '~/static-props/get-data';
import { asResponsiveArray } from '~/style/utils';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useDynamicLokalizeTexts } from '~/utils/cms/use-dynamic-lokalize-texts';
import { space } from '~/style/theme';

const selectLokalizeTexts = (siteText: SiteText) => ({
  textShared: siteText.pages.topical_page.shared,
});

type LokalizeTexts = ReturnType<typeof selectLokalizeTexts>;

export const getStaticProps = createGetStaticProps(
  ({ locale }: { locale: keyof Languages }) => getLokalizeTexts(selectLokalizeTexts, locale),
  getLastGeneratedDate,
  createGetContent<ArticleSummary[]>((context) => {
    const { locale } = context;

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
  const { pageText, content, lastGenerated } = props;
  const { commonTexts } = useIntl();
  const router = useRouter();
  const breakpoints = useBreakpoints();

  const { textShared } = useDynamicLokalizeTexts<LokalizeTexts>(pageText, selectLokalizeTexts);

  const articleCategories = useMemo(() => {
    /**
     * Find all the categories that are currently being used in articles,
     * to later check if we still need it for the menu items.
     */
    const availableCategories: string[] = ['__alles', ...new Set(content.map((item) => item.categories).flat())].filter(isPresent);

    return articleCategory
      .map((id) => {
        const label = textShared.secties.artikelen.categorie_filters[id];

        return {
          label,
          value: id,
        };
      })
      .filter((item) => availableCategories.includes(item.value));
  }, [content, textShared.secties.artikelen.categorie_filters]);

  const selectOptions = useMemo(
    () =>
      articleCategories.map((category) => ({
        ...category,
        content: (
          <Box paddingRight={space[2]}>
            <Text>{category.label}</Text>
          </Box>
        ),
      })),
    [articleCategories]
  );

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

  const currentCategory = (articleCategory.includes(router.query.categorie as ArticleCategoryType) ? router.query.categorie : articleCategory[0]) as ArticleCategoryType;

  return (
    <Layout {...commonTexts.articles_metadata} lastGenerated={lastGenerated}>
      <Box backgroundColor="white" paddingY={{ _: space[4], md: space[5] }}>
        <MaxWidth paddingX={{ _: space[3], lg: space[4] }}>
          <Box paddingBottom={space[2]}>
            <Heading level={2} as="h1">
              {textShared.secties.artikelen.titel}
            </Heading>
          </Box>

          <Text>{textShared.secties.artikelen.beschrijving}</Text>

          {breakpoints.lg ? (
            <OrderedList>
              {articleCategories.map((category, index) => (
                <ListItem key={index} isActive={currentCategory === category.value} onClick={() => handleCategoryFilter(category.value)}>
                  <StyledButton>
                    <InlineText>{category.label}</InlineText>
                    <BoldText aria-hidden="true">{category.label}</BoldText>
                  </StyledButton>
                </ListItem>
              ))}
            </OrderedList>
          ) : (
            <Box
              marginTop={space[3]}
              marginBottom={space[4]}
              width="100%"
              css={css({
                select: {
                  width: '100%',
                  maxWidth: asResponsiveArray({ _: '25rem', xs: '23rem' }),
                },
              })}
            >
              <RichContentSelect
                label={textShared.secties.artikelen.categorie_select_placeholder}
                visuallyHiddenLabel
                initialValue={currentCategory}
                options={selectOptions}
                onChange={(item) => handleCategoryFilter(item.value)}
              />
            </Box>
          )}

          <ArticlesOverviewList articleSummaries={content} hideLink={true} currentCategory={currentCategory} />
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
    borderColor: 'gray3',
    margin: '0',
    marginY: space[4],
    padding: '0',
    listStyleType: 'none',
  })
);

const ListItem = styled.li<{ isActive: boolean }>((x) =>
  css({
    position: 'relative',
    paddingY: space[3],
    height: '100%',
    transition: 'transform 0.2s',
    cursor: 'pointer',

    '&:after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      left: '0',
      bottom: '0',
      height: '5px',
      width: `calc(100%)`,
      backgroundColor: 'blue8',
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
 * Here we draw a identical text on top and switch them once the item is active.
 * It has a aria hidden label and is pure cosmetic for this use case.
 */
const BoldText = styled.span(
  css({
    position: 'absolute',
    top: '0',
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
    paddingX: space[3],

    '&:focus': {
      outlineWidth: '1px',
      outlineStyle: 'dashed',
      outlineColor: 'blue8',
    },
  })
);
